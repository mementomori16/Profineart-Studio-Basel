import Stripe from 'stripe';
import { PRODUCT_PACKAGES } from '../data/products.js';
import { LessonPackage } from '../types/Product.js'; 
import { sendConfirmationEmail, sendOwnerNotification } from './emailService.js';

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

    // Syncing metadata keys with what your Frontend 'ContactDetails' actually sends
    const metadata = {
        packageId: selectedPackage.id,
        lessons: selectedPackage.lessons?.toString() || "1",
        duration: (selectedPackage.durationMinutes?.toString() || "60") + ' min',
        selectedDate: data.selectedDate,
        selectedTime: data.selectedTime,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerMessage: data.message || "",
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
                    description: selectedPackage.description,
                },
                unit_amount: priceInCentimes,
            },
            quantity: 1,
        }],
        customer_email: data.email,
        // ✅ CRITICAL: This enables the phone number field inside the Stripe UI
        phone_number_collection: {
            enabled: true,
        },
        mode: 'payment',
        success_url: `${clientBaseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientBaseUrl}/order/cancel`, 
        metadata: metadata,
    });
}

export async function fulfillOrder(sessionId: string, stripe: Stripe): Promise<FulfillmentDetails> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata;

    if (!metadata || !session.payment_intent) {
        throw new Error('No metadata found on session.');
    }

    if (session.payment_status !== 'paid') {
        throw new Error('Order not paid.');
    }

    // Idempotency check using PaymentIntent metadata
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
    
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

    if (paymentIntent.metadata?.fulfilled === 'true') {
        return details;
    }

    // Trigger Emails
    await sendConfirmationEmail(details); 
    await sendOwnerNotification(details);
    
    // Mark as processed
    await stripe.paymentIntents.update(session.payment_intent as string, {
        metadata: { fulfilled: 'true' }
    });

    return details;
}
