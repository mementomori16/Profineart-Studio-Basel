import Stripe from 'stripe';
import { PRODUCT_PACKAGES } from '../data/products.js';
import { LessonPackage } from '../types/Product.js'; 

/**
 * Helper to ensure metadata strings stay within Stripe's character limits.
 * Stripe metadata values have a limit of 500 characters.
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

    // Stripe requires the price in the smallest currency unit (e.g., centimes for CHF)
    const unitAmount = Math.round(selectedPackage.price * 100);

    /**
     * Metadata object to be passed through the Stripe flow.
     * This allows us to recover full booking details even if our database fails.
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
        customerAddress: limit(data.address || "N/A"), // Combined address from ContactDetails.tsx
        customerMessage: limit(data.message || "No specific wishes provided."),
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
                    description: limit(`${selectedPackage.lessons} sessions for ${data.name}`, 450),
                },
                unit_amount: unitAmount,
            },
            quantity: 1,
        }],
        customer_email: data.email,
        mode: 'payment',
        // We attach metadata at the session level AND the payment intent level
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

    // Verify the payment was actually successful before proceeding
    if (session.payment_status !== 'paid') {
        throw new Error(`Order fulfillment failed: Session status is ${session.payment_status}`);
    }

    // Map the Stripe metadata back to our internal FulfillmentDetails interface
    const details: FulfillmentDetails = {
        name: metadata.customerName || 'N/A',
        email: metadata.customerEmail || 'N/A',
        date: metadata.selectedDate || 'N/A',
        time: metadata.selectedTime || 'N/A',
        packageName: `${metadata.lessons} Lessons (${metadata.duration})`,
        phone: metadata.customerPhone || 'N/A', 
        address: metadata.customerAddress || 'N/A',
        message: metadata.customerMessage || 'No message provided.',
        birthdate: metadata.customerBirthdate || 'N/A',
    };

    try {
        // Optional: Update the PaymentIntent to mark it as fulfilled in the Stripe Dashboard
        if (session.payment_intent) {
            await stripe.paymentIntents.update(session.payment_intent as string, {
                metadata: { ...metadata, fulfilled: 'true', fulfillment_date: new Date().toISOString() }
            });
        }
        console.log("LOG: Fulfillment details successfully compiled for client:", details.name);
    } catch (error) {
        // We catch the error but return the details anyway so the email/success page still works
        console.error("LOG: Non-critical error updating payment intent metadata:", error);
    }

    return details;
}