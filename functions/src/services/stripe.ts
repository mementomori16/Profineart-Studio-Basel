import Stripe from 'stripe';
import { PRODUCT_PACKAGES } from '../data/products.js';
import { LessonPackage } from '../types/Product.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export interface FulfillmentDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  package: string;
  message: string;
}

export async function createStripeCheckoutSession(
  data: any
): Promise<Stripe.Checkout.Session> {
  const selectedPackage = PRODUCT_PACKAGES.find(
    pkg => pkg.id === data.packageId
  ) as LessonPackage | undefined;

  if (!selectedPackage) {
    throw new Error('Invalid package');
  }

  const priceInCents = Math.round(selectedPackage.price * 100);

  return await stripe.checkout.sessions.create({
    mode: 'payment',

    payment_method_types: ['card'],

    customer_email: data.email,

    // ✅ LET STRIPE COLLECT ADDRESS
    billing_address_collection: 'required',

    // OPTIONAL (enable if you want shipping)
    shipping_address_collection: {
      allowed_countries: ['CH', 'DE', 'FR', 'IT'],
    },

    phone_number_collection: {
      enabled: true,
    },

    line_items: [
      {
        price_data: {
          currency: 'chf',
          unit_amount: priceInCents,
          product_data: {
            name: selectedPackage.name,
          },
        },
        quantity: 1,
      },
    ],

    payment_intent_data: {
      description: `Lesson booking for ${data.name}`,
      metadata: {
        selectedDate: data.selectedDate,
        selectedTime: data.selectedTime,
        packageId: selectedPackage.id,
        message: data.message || '',
      },
    },

    invoice_creation: {
      enabled: true,
    },

    success_url: `${process.env.CLIENT_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/order/cancel`,
  });
}

export async function fulfillOrder(
  sessionId: string
): Promise<FulfillmentDetails> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent', 'customer'],
  });

  if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed');
  }

  const customer =
    typeof session.customer === 'string'
      ? await stripe.customers.retrieve(session.customer)
      : session.customer;

  if (!customer || customer.deleted) {
    throw new Error('Customer not found');
  }

  const addressObj = customer.address;
  const address = addressObj
    ? `${addressObj.line1 || ''} ${addressObj.line2 || ''}, ${addressObj.postal_code || ''} ${addressObj.city || ''}, ${addressObj.country || ''}`
    : 'No address provided';

  return {
    name: customer.name || 'N/A',
    email: customer.email || 'N/A',
    phone: customer.phone || 'N/A',
    address,
    date: session.metadata?.selectedDate || 'N/A',
    time: session.metadata?.selectedTime || 'N/A',
    package: session.metadata?.packageId || 'N/A',
    message: session.metadata?.message || '',
  };
}

