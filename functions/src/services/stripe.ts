import Stripe from 'stripe';
import { PRODUCT_PACKAGES } from '../data/products.js';
import { LessonPackage } from '../types/Product.js'; 

const limit = (str: any, max: number = 490): string => {
    const text = String(str || "");
    return text.length > max ? text.substring(0, max) + "..." : text;
};

export interface FulfillmentDetails {
    name: string;
    email: string;
    date: string;
    time: string;
    package: string;
    phone: string;
    message: string;
    birthdate: string; 
    address: string;
}

export async function createStripeCheckoutSession(data: any, stripe: Stripe): Promise<Stripe.Checkout.Session> {
    const selectedPackage = PRODUCT_PACKAGES.find(pkg => pkg.id === data.packageId) as LessonPackage | undefined;
    
    if (!selectedPackage) {
        throw new Error(`Invalid packageId: ${data.packageId}`);
    }

    const priceInCentimes = Math.round(selectedPackage.price * 100); 

    const metadata = {
        packageId: selectedPackage.id,
        lessons: selectedPackage.lessons?.toString() || "1",
        duration: (selectedPackage.durationMinutes?.toString() || "60") + ' min',
        selectedDate: data.selectedDate,
        selectedTime: data.selectedTime,
        customerName: limit(data.name),
        customerEmail: limit(data.email),
        customerPhone: limit(data.phone),
        customerMessage: limit(data.message || "No specific wishes provided."),
        customerBirthdate: limit(data.dateOfBirth || data.birthdate || "N/A"), 
    };

    const clientBaseUrl = process.env.CLIENT_URL || "https://profineart.ch";

    return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // 1. Force address collection
        billing_address_collection: 'required', 
        // 2. IMPORTANT: Create a customer so the address attaches to the Invoice PDF
        customer_creation: 'always', 
        
        line_items: [{
            price_data: {
                currency: 'chf',
                product_data: {
                    name: selectedPackage.name, 
                    description: limit(`Lesson for ${data.name} on ${data.selectedDate} at ${data.selectedTime}`, 450),
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
        invoice_creation: { 
            enabled: true,
            invoice_data: {
                description: limit(`Art Lesson on ${data.selectedDate}. Notes: ${data.message || 'None'}`, 450),
                metadata: metadata 
            }
        },
        payment_intent_data: {
            description: limit(`Lesson Booking: ${data.name} (${data.selectedDate})`, 450),
            metadata: metadata 
        },
        success_url: `${clientBaseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientBaseUrl}/order/cancel`, 
        metadata: metadata,
    });
}

export async function fulfillOrder(sessionId: string, stripe: Stripe): Promise<FulfillmentDetails> {
    // 3. Expand 'customer' to get the full address details reliably
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['customer', 'payment_intent']
    });

    const metadata = session.metadata;
    if (!metadata || !session.payment_intent) {
        throw new Error('No metadata found on session.');
    }

    if (session.payment_status !== 'paid') {
        throw new Error('Order not paid.');
    }

    // 4. Try to get address from Customer object first, then fallback to session details
    const customer = session.customer as Stripe.Customer;
    const addr = customer?.address || session.customer_details?.address;
    
    const addressString = addr 
        ? `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.postal_code} ${addr.city}, ${addr.country}`
        : 'No address provided';

    const details: FulfillmentDetails = {
        name: metadata.customerName || 'N/A',
        email: metadata.customerEmail || 'N/A',
        date: metadata.selectedDate || 'N/A',
        time: metadata.selectedTime || 'N/A',
        package: `${metadata.lessons} Lessons (${metadata.duration})`,
        phone: session.customer_details?.phone || metadata.customerPhone || 'N/A', 
        message: metadata.customerMessage || 'No message.',
        birthdate: metadata.customerBirthdate || 'N/A',
        address: addressString,
    };

    try {
        await stripe.paymentIntents.update(session.payment_intent as string, {
            metadata: { 
                fulfilled: 'true',
                customerAddress: limit(addressString, 450)
            }
        });
    } catch (error) {
        console.error("Fulfillment secondary update error:", error);
    }

    return details;
}