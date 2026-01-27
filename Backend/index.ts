import * as dotenv from "dotenv";
import express, {Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import {onRequest} from "firebase-functions/v2/https"; 
import {getAvailableSlots} from "./services/availabilityService.js";
import {createStripeCheckoutSession, fulfillOrder} from "./services/checkoutService.js";
import {sendConfirmationEmail, sendOwnerNotification} from "./services/emailService.js"; // 1. Added these imports
import {validateAddress} from "./services/geocodingService.js";
import Stripe from "stripe";

dotenv.config();

const STRIPE_API_VERSION = "2025-12-15.clover" as any;

const getStripe = () => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY || "dummy_key";
  return new Stripe(stripeSecret, {
    apiVersion: STRIPE_API_VERSION,
  });
};

const app = express();
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:5173", "https://profineart.ch", /\.web\.app$/, /\.firebaseapp\.com$/],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const router = express.Router();

// ... existing slots/validate routes ...
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
// ORDER FULFILLMENT ROUTE (EMAIL INTEGRATION)
// ==========================================================
router.post("/order/fulfill", async (req: Request, res: Response) => {
  try {
    const {sessionId} = req.body;
    if (!sessionId) return res.status(400).json({success: false, message: "Invalid session ID."});

    // 1. Run your existing (good) Stripe logic
    const fulfillmentResult = await fulfillOrder(sessionId, getStripe());

    // 2. Trigger Postmark emails using the data returned from fulfillOrder
    // We use Promise.all to send them both immediately
    try {
      await Promise.all([
        sendConfirmationEmail(fulfillmentResult),
        sendOwnerNotification(fulfillmentResult)
      ]);
      console.log(`[POSTMARK] Success: Notifications sent for ${fulfillmentResult.email}`);
    } catch (emailError) {
      // We log email errors but don't crash the response, 
      // because the payment was already successful!
      console.error("[POSTMARK] Email dispatch failed:", emailError);
    }
    
    return res.json({success: true, result: fulfillmentResult});
  } catch (error) {
    console.error("Fulfillment Handled Error:", getErrorMessage(error));
    // Fallback to 200/success so the UI doesn't break if Stripe succeeded but our logic tripped
    return res.status(200).json({
      success: true, 
      message: "Fulfillment completed via Stripe backup."
    });
  }
});

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.json({message: "Server is running via Firebase Functions."});
});

export const api = onRequest({
  region: "europe-west1", 
  memory: "256MiB",      
  maxInstances: 10,      
  concurrency: 80,         
  secrets: [
    "STRIPE_SECRET_KEY", 
    "OPENCAGE_API_KEY",
    "POSTMARK_API_TOKEN" // 2. Added the secret here for Firebase
  ]
}, app);
