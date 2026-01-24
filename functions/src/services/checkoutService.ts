import Stripe from "stripe";
import {PRODUCT_PACKAGES} from "../data/products.js";
import {LessonPackage} from "../types/Product.js";
import {sendConfirmationEmail, sendOwnerNotification} from "./emailService.js";

// --- Interfaces ---

interface CheckoutData {
    selectedDate: string; 
    selectedTime: string; 
    packageId: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    birthdate: string;
}

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

// --- Service Functions ---

/**
 * Creates a Stripe Checkout Session for the selected product package.
 */
export async function createStripeCheckoutSession(data: CheckoutData, stripe: Stripe): Promise<Stripe.Checkout.Session> {
  const selectedPackage = PRODUCT_PACKAGES.find((pkg) => pkg.id === data.packageId) as LessonPackage | undefined;

  if (!selectedPackage) {
    throw new Error(`Invalid packageId: ${data.packageId}`);
  }

  const priceInCentimes = Math.round(selectedPackage.price * 100);

  const metadata = {
    packageId: selectedPackage.id,
    lessons: selectedPackage.lessons.toString(),
    duration: selectedPackage.durationMinutes.toString() + " min",
    selectedDate: data.selectedDate,
    selectedTime: data.selectedTime,
    customerName: data.name,
    customerEmail: data.email,
    customerPhone: data.phone,
    customerMessage: data.message,
    customerBirthdate: data.birthdate,
  };

  // 🔥 CHANGE: Added fallback to prevent the "CLIENT_URL not set" crash
  const clientBaseUrl = process.env.CLIENT_URL || "https://profineart.ch";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "chf",
            tax_behavior: "inclusive",
            product_data: {
              name: selectedPackage.name,
              description: selectedPackage.description,
              metadata: {packageId: selectedPackage.id},
            },
            unit_amount: priceInCentimes,
          },
          quantity: 1,
        },
      ],
      customer_email: data.email || undefined,
      mode: "payment",
      success_url: `${clientBaseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientBaseUrl}/order/cancel`,
      metadata: metadata,
    });

    return session;
  } catch (error) {
    console.error("Stripe Session Creation Error:", error);
    // Rethrow the actual error message for better debugging in logs
    throw error;
  }
}

/**
 * Confirms payment via Stripe and performs fulfillment actions.
 */
export async function fulfillOrder(sessionId: string, stripe: Stripe): Promise<FulfillmentDetails> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata;

    if (!metadata || !session.payment_intent) {
      throw new Error("No metadata or payment intent found on Stripe session.");
    }

    if (session.payment_status !== "paid") {
      throw new Error(`Payment status is ${session.payment_status}. Order not fulfilled.`);
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent as string
    );

    if (paymentIntent.metadata?.fulfilled === "true") {
      console.log(`[FULFILLMENT CHECK] Session ${sessionId} already fulfilled. Skipping.`);
      return {
        name: metadata.customerName || "N/A",
        email: metadata.customerEmail || "N/A",
        date: metadata.selectedDate || "N/A",
        time: metadata.selectedTime || "N/A",
        package: `${metadata.lessons} Lessons (${metadata.duration})` || "N/A",
        phone: metadata.customerPhone || "N/A",
        message: metadata.customerMessage || "No special message.",
        birthdate: metadata.customerBirthdate || "N/A",
      };
    }

    const details: FulfillmentDetails = {
      name: metadata.customerName || "N/A",
      email: metadata.customerEmail || "N/A",
      date: metadata.selectedDate || "N/A",
      time: metadata.selectedTime || "N/A",
      package: `${metadata.lessons} Lessons (${metadata.duration})` || "N/A",
      phone: metadata.customerPhone || "N/A",
      message: metadata.customerMessage || "No special message.",
      birthdate: metadata.customerBirthdate || "N/A",
    };

    // Fulfillment Actions
    await sendConfirmationEmail(details);
    await sendOwnerNotification(details);

    await stripe.paymentIntents.update(session.payment_intent as string, {
      metadata: {fulfilled: "true"},
    });

    console.log(`[FULFILLMENT SUCCESS] Booking confirmed for ${details.name}.`);
    return details;
  } catch (error) {
    console.error("Fulfillment Error:", error);
    throw new Error("Failed to verify payment or retrieve order details.");
  }
}
