import Stripe from "stripe";
import {PRODUCT_PACKAGES} from "../data/products.js";
import {LessonPackage} from "../types/Product.js";
import {sendConfirmationEmail, sendOwnerNotification} from "./emailService.js";

// --- Interfaces ---

// Interface for the data coming from the frontend (for creating session)
interface CheckoutData {
    selectedDate: string; // YYYY-MM-DD
    selectedTime: string; // HH:MM
    packageId: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    // 🔥 NEW: Added birthdate
    birthdate: string;
}

// Interface for the data returned to the frontend (after fulfillment)
export interface FulfillmentDetails {
    name: string;
    email: string;
    date: string;
    time: string;
    package: string;
    phone: string;
    message: string;
    // 🔥 NEW: Added birthdate
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

  // Price conversion: Stripe requires price in the smallest currency unit (centimes).
  const priceInCentimes = Math.round(selectedPackage.price * 100);

  // Define Metadata to attach booking details to the payment
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
    // 🔥 NEW: Store birthdate in Stripe metadata
    customerBirthdate: data.birthdate,
    // The 'fulfilled' flag will be set on the Payment Intent later,
    // but we keep this data on the session metadata for retrieval.
  };

  const clientBaseUrl = process.env.CLIENT_URL;
  if (!clientBaseUrl) {
    throw new Error("CLIENT_URL environment variable is not set. Cannot create Stripe session.");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "chf",
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
      // Pre-fill the customer's email
      customer_email: data.email || undefined,
      mode: "payment",

      // Redirect URLs use the CLIENT_URL environment variable
      success_url: `${clientBaseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientBaseUrl}/order/cancel`,

      metadata: metadata, // Attach booking details to the payment
    });

    return session;
  } catch (error) {
    console.error("Stripe Session Creation Error:", error);
    throw new Error("Could not create Stripe checkout session.");
  }
}

/**
 * Confirms payment via Stripe, performs idempotency check, sends emails,
 * and marks the associated Payment Intent as fulfilled.
 */
export async function fulfillOrder(sessionId: string, stripe: Stripe): Promise<FulfillmentDetails> {
  try {
    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata;

    // 2. Validate essential data
    if (!metadata || !session.payment_intent) {
      throw new Error("No metadata or payment intent found on Stripe session.");
    }

    // 3. Validate Payment Status
    if (session.payment_status !== "paid") {
      throw new Error(`Payment status is ${session.payment_status}. Order not fulfilled.`);
    }

    // 4. RETRIEVE PAYMENT INTENT for Idempotency Check
    const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent as string
    );

    // 🛑 5. IDEMPOTENCY CHECK on Payment Intent Metadata
    if (paymentIntent.metadata?.fulfilled === "true") {
      console.log(`[FULFILLMENT CHECK] Session ${sessionId} already fulfilled via Payment Intent. Skipping actions.`);

      // Extract details to return, without re-sending emails
      const details: FulfillmentDetails = {
        name: metadata.customerName || "N/A",
        email: metadata.customerEmail || "N/A",
        date: metadata.selectedDate || "N/A",
        time: metadata.selectedTime || "N/A",
        package: `${metadata.lessons} Lessons (${metadata.duration})` || "N/A",
        phone: metadata.customerPhone || "N/A",
        message: metadata.customerMessage || "No special message.",
        // 🔥 NEW: Extract birthdate in idempotency path
        birthdate: metadata.customerBirthdate || "N/A",
      };
      return details;
    }

    // 6. Extract Booking Details
    const details: FulfillmentDetails = {
      name: metadata.customerName || "N/A",
      email: metadata.customerEmail || "N/A",
      date: metadata.selectedDate || "N/A",
      time: metadata.selectedTime || "N/A",
      package: `${metadata.lessons} Lessons (${metadata.duration})` || "N/A",
      phone: metadata.customerPhone || "N/A",
      message: metadata.customerMessage || "No special message.",
      // 🔥 NEW: Extract birthdate in main path
      birthdate: metadata.customerBirthdate || "N/A",
    };

    // --- 7. Fulfillment Actions (Run only once) ---

    // Send the confirmation email to the client
    await sendConfirmationEmail(details);

    // Send the notification email to the owner
    await sendOwnerNotification(details);

    // 8. MARK AS FULFILLED: Update the Payment Intent's metadata
    // This permanently marks the transaction as processed.
    await stripe.paymentIntents.update(session.payment_intent as string, {
      metadata: {fulfilled: "true"},
    });

    console.log(`[FULFILLMENT SUCCESS] Booking confirmed for ${details.name} on ${details.date}.`);

    return details;
  } catch (error) {
    console.error("Fulfillment Error:", error);
    throw new Error("Failed to verify payment or retrieve order details.");
  }
}
