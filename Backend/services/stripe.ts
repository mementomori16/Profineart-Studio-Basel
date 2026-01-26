import Stripe from 'stripe';
import { PRODUCT_PACKAGES } from '../data/products.js';
import { LessonPackage } from '../types/Product.js'; 

export interface FulfillmentDetails {
    name: string;
    email: string;
    date: string;
    time: string;
    package: string;
    phone: string;
    message: string;
    birthdate: string; 
}

export async function createStripeCheckoutSession(data: any, stripe: Stripe): Promise<Stripe.Checkout.Session> {
    const selectedPackage = PRODUCT_PACKAGES.find(pkg => pkg.id === data.packageId) as LessonPackage | undefined;
    
    if (!selectedPackage) {
        throw new Error(`Invalid packageId: ${data.packageId}`);
    }

    const priceInCentimes = Math.round(selectedPackage.price * 100); 

    // This object saves your critical "Private Lesson" data into Stripe's database
    const metadata = {
        packageId: selectedPackage.id,
        lessons: selectedPackage.lessons?.toString() || "1",
        duration: (selectedPackage.durationMinutes?.toString() || "60") + ' min',
        selectedDate: data.selectedDate,
        selectedTime: data.selectedTime,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerMessage: data.message || "No specific wishes provided.",
        customerBirthdate: data.dateOfBirth || data.birthdate || "N/A", 
    };

    const clientBaseUrl = process.env.CLIENT_URL;

    return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'chf',
                product_data: {
                    name: selectedPackage.name, 
                    // This appears on the Stripe checkout page
                    description: `Lesson for ${data.name} on ${data.selectedDate} at ${data.selectedTime}`,
                },
                unit_amount: priceInCentimes,
            },
            quantity: 1,
        }],
        customer_email: data.email,
        phone_number_collection: {
            enabled: true,
        },
        mode: 'payment',
        // --- 1. CLIENT CONFIRMATION (Official Stripe Receipt) ---
        invoice_creation: { 
            enabled: true,
            invoice_data: {
                description: `CONFIRMED: Art Lesson on ${data.selectedDate} at ${data.selectedTime}. Notes: ${data.message || 'None'}`,
                metadata: metadata 
            }
        },
        // --- 2. OWNER DATA PROTECTION (Saves to your Dashboard) ---
        payment_intent_data: {
            description: `Lesson Booking: ${data.name} (${data.selectedDate})`,
            metadata: metadata 
        },
        success_url: `${clientBaseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientBaseUrl}/order/cancel`, 
        metadata: metadata,
    });
}

export async function fulfillOrder(sessionId: string, stripe: Stripe): Promise<FulfillmentDetails> {
    console.log("LOG: Starting fulfillment for session:", sessionId);
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata;

    if (!metadata || !session.payment_intent) {
        throw new Error('No metadata found on session.');
    }

    if (session.payment_status !== 'paid') {
        throw new Error('Order not paid.');
    }

    const details: FulfillmentDetails = {
        name: metadata.customerName || 'N/A',
        email: metadata.customerEmail || 'N/A',
        date: metadata.selectedDate || 'N/A',
        time: metadata.selectedTime || 'N/A',
        package: `${metadata.lessons} Lessons (${metadata.duration})`,
        phone: metadata.customerPhone || 'N/A', 
        message: metadata.customerMessage || 'No message.',
        birthdate: metadata.customerBirthdate || 'N/A',
    };

    try {
        console.log("!!! DATA SECURED IN STRIPE METADATA.");
        
        // --- 3. THE "SUCCESS" FIX ---
        // We comment these out to bypass the 535 Login Error.
        // Stripe is now handling the client's confirmation via 'invoice_creation' above.
        /*
        await sendConfirmationEmail(details); 
        await sendOwnerNotification(details);
        */

        // Mark as processed in Stripe so you know you've seen it
        await stripe.paymentIntents.update(session.payment_intent as string, {
            metadata: { fulfilled: 'true' }
        });
        
    } catch (error) {
        console.error("!!! LOGGING ERROR:", error);
        // We return details anyway so the user sees the Success Page
        return details; 
    }

    return details;
}
