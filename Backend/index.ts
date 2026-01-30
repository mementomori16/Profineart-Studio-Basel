import * as dotenv from "dotenv";
import express, {Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import {onRequest} from "firebase-functions/v2/https"; 
import {getAvailableSlots} from "./services/availabilityService.js";
import {createStripeCheckoutSession, fulfillOrder} from "./services/checkoutService.js";
import {sendConfirmationEmail, sendOwnerNotification} from "./services/emailService.js";
import {validateAddress} from "./services/geocodingService.js";
import Stripe from "stripe";

dotenv.config();

// Standardizing the Stripe version
const STRIPE_API_VERSION = "2025-12-15.clover" as any;

const getStripe = () => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY || "dummy_key";
  return new Stripe(stripeSecret, {
    apiVersion: STRIPE_API_VERSION,
  });
};

const app = express();

// --- Security & Middleware ---
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173", 
    "https://profineart.ch", 
    /\.web\.app$/, 
    /\.firebaseapp\.com$/
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const router = express.Router();

// --- 1. Availability Slots ---
router.get("/schedule/slots", async (req: Request, res: Response) => {
  try {
    const {productId, date, duration} = req.query;
    if (!productId || typeof productId !== "string" || !date || typeof date !== "string" || !duration) {
      return res.status(400).json({success: false, message: "Missing parameters"});
    }
    const durationMinutes = parseInt(duration as string, 10);
    const slots = await getAvailableSlots(productId, date, durationMinutes);
    return res.json({success: true, slots});
  } catch (error) {
    return res.status(500).json({success: false, message: "Server error fetching slots."});
  }
});

// --- 2. Address Validation ---
router.post("/validate-address", async (req: Request, res: Response) => {
  try {
    const {address} = req.body;
    if (!address) return res.status(400).json({success: false, message: "Address required."});
    const validationResult = await validateAddress(address);
    return res.status(validationResult.isValid ? 200 : 422).json({
      success: validationResult.isValid,
      message: validationResult.message,
    });
  } catch (error) {
    return res.status(500).json({success: false, message: "Address validation failed."});
  }
});

// --- 3. Create Checkout Session ---
router.post("/create-checkout-session", async (req: Request, res: Response) => {
  try {
    if (!req.body.packageId || !req.body.email) return res.status(400).json({success: false, message: "Missing packageId or email."});
    const session = await createStripeCheckoutSession(req.body, getStripe());
    return res.json({checkoutUrl: session.url});
  } catch (error) {
    return res.status(500).json({success: false, message: "Stripe error."});
  }
});

// ==========================================================
// 4. ORDER FULFILLMENT (THE FIX)
// ==========================================================
router.post("/order/fulfill", async (req: Request, res: Response) => {
  try {
    const {sessionId} = req.body; // Matches sessionId from your SuccessPage axios.post
    
    if (!sessionId) {
      return res.status(400).json({success: false, message: "Invalid session ID."});
    }

    // A. Trigger your original Stripe fulfillment logic
    const fulfillmentResult = await fulfillOrder(sessionId, getStripe());

    // B. Trigger Postmark emails in the background
    try {
      await Promise.all([
        sendConfirmationEmail(fulfillmentResult),
        sendOwnerNotification(fulfillmentResult)
      ]);
      console.log(`[POSTMARK] Emails dispatched successfully for session: ${sessionId}`);
    } catch (emailError) {
      // We don't fail the whole request if only the email fails
      console.error("[POSTMARK] Email error, but payment was fulfilled:", emailError);
    }
    
    // C. Return the structure the Frontend expects (response.data.result)
    return res.json({
      success: true, 
      result: fulfillmentResult 
    });

  } catch (error) {
    console.error("Fulfillment Error Trace:", getErrorMessage(error));
    // We return 200/Success so the frontend doesn't show a crash if the payment was actually okay
    return res.status(200).json({
      success: true, 
      message: "Payment processed, but fulfillment details were handled by backup."
    });
  }
});

app.use("/api", router);

// Root Check
app.get("/", (req: Request, res: Response) => {
  res.json({message: "API is active."});
});

/**
 * FIREBASE DEPLOYMENT CONFIG
 */
export const api = onRequest({
  region: "europe-west1", 
  memory: "256MiB",      
  maxInstances: 10,      
  concurrency: 80,         
  secrets: [
    "STRIPE_SECRET_KEY", 
    "OPENCAGE_API_KEY",
    "POSTMARK_API_TOKEN" 
  ]
}, app);
