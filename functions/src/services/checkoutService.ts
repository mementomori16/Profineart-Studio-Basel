import Stripe from 'stripe';
import { PRODUCT_PACKAGES } from '../data/products.js';
import { LessonPackage } from '../types/Product.js'; 

/**
 * Helper to ensure metadata strings stay within Stripe's character limits (500 chars).
 */
const limit = (str: any, max: number = 490): string => {
    const text = String(str || "");
    return text.length > max ? text.substring(0, max) + "..." : text;
};

/**
 * Interface representing the data structure returned for emails and the success page.
 */
export interface FulfillmentDetails {
    name: string;
    email: string;
    date: string;
    time: string;
    packageName: string;
    phone: string;
    address: string;
    message: string;
    birthdate: string; 
}

/**
 * Creates a Stripe Checkout Session with full customer and booking metadata.
 */
export async function createStripeCheckoutSession(data: any, stripe: Stripe): Promise<Stripe.Checkout.Session> {
    // Locate the specific package from the shared data source
    const selectedPackage = PRODUCT_PACKAGES.find(pkg => pkg.id === data.packageId) as LessonPackage | undefined;
    
    if (!selectedPackage) {
        throw new Error(`Invalid packageId: ${data.packageId}`);
    }

    // Stripe requires the price in the smallest currency unit (centimes for CHF)
    const unitAmount = Math.round(selectedPackage.price * 100);

    /**
     * Metadata object: This is the "safe" where we store all your form data.
     */
    const metadata = {
        productId: data.productId,
        packageId: selectedPackage.id,
        lessons: selectedPackage.lessons.toString(),
        duration: `${selectedPackage.durationMinutes} min`,
        selectedDate: data.selectedDate,
        selectedTime: data.selectedTime,
        customerName: limit(data.name),
        customerEmail: limit(data.email),
        customerPhone: limit(data.phone),
        // This 'address' comes from the combined string in ContactDetails.tsx
        customerAddress: limit(data.address || "N/A"), 
        customerMessage: limit(data.message || "No message provided."),
        customerBirthdate: limit(data.dateOfBirth || "N/A"), 
    };

    const clientBaseUrl = process.env.CLIENT_URL || "https://profineart.ch";

    return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'chf',
                product_data: {
                    name: selectedPackage.name, 
                    description: `${selectedPackage.lessons} Sessions x ${selectedPackage.durationMinutes} min`,
                },
                unit_amount: unitAmount,
            },
            quantity: 1,
        }],
        customer_email: data.email,
        mode: 'payment',
        
        // --- NATIVE STRIPE COLLECTIONS ---
        phone_number_collection: { enabled: true },
        billing_address_collection: 'required', 

        // Attach metadata to both the Session and the PaymentIntent
        metadata: metadata,
        payment_intent_data: { 
            metadata: metadata 
        },
        success_url: `${clientBaseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientBaseUrl}/order/cancel`, 
    });
}

/**
 * Retrieves a Stripe session and extracts all metadata for post-payment fulfillment.
 */
export async function fulfillOrder(sessionId: string, stripe: Stripe): Promise<FulfillmentDetails> {
    console.log("LOG: Starting fulfillment process for session:", sessionId);
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata;

    if (!metadata) {
        throw new Error('No metadata found in Stripe session. Cannot fulfill order.');
    }

    // Verify payment status
    if (session.payment_status !== 'paid') {
        throw new Error(`Order fulfillment failed: Session status is ${session.payment_status}`);
    }

    /**
     * Data Retrieval Logic:
     * We prioritize Stripe's verified data, then fall back to our metadata.
     */
    
    // 1. Get Phone
    const finalPhone = metadata.customerPhone || session.customer_details?.phone || 'N/A';

    // 2. Get Address
    let finalAddress = metadata.customerAddress || 'N/A';
    const nativeAddr = session.customer_details?.address;
    if (nativeAddr?.line1) {
        finalAddress = [
            nativeAddr.line1,
            nativeAddr.line2,
            `${nativeAddr.postal_code} ${nativeAddr.city}`,
            nativeAddr.country
        ].filter(Boolean).join(', ');
    }

    // 3. Construct the details object
    const details: FulfillmentDetails = {
        name: metadata.customerName || 'N/A',
        email: metadata.customerEmail || 'N/A',
        date: metadata.selectedDate || 'N/A',
        time: metadata.selectedTime || 'N/A',
        // This is the specific label that will appear on the Success Page
        packageName: `Private Lesson: ${metadata.lessons} Sessions`,
        phone: finalPhone, 
        address: finalAddress,
        message: metadata.customerMessage || 'No message provided.',
        birthdate: metadata.customerBirthdate || 'N/A',
    };

    try {
        // Mark as fulfilled in the Stripe Dashboard
        if (session.payment_intent) {
            await stripe.paymentIntents.update(session.payment_intent as string, {
                metadata: { 
                    ...metadata, 
                    fulfilled: 'true', 
                    fulfillment_date: new Date().toISOString() 
                }
            });
        }
        console.log("LOG: Fulfillment details successfully compiled for:", details.name);
    } catch (error) {
        console.error("LOG: Non-critical error updating payment intent metadata:", error);
    }

    return details;
}