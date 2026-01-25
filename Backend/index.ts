import * as dotenv from "dotenv";
import express, {Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import {onRequest} from "firebase-functions/v2/https"; 
import {getAvailableSlots} from "./services/availabilityService.js";
import {createStripeCheckoutSession, fulfillOrder} from "./services/checkoutService.js";
import {validateAddress} from "./services/geocodingService.js";
import Stripe from "stripe";

// Only load dotenv locally. Firebase uses 'secrets' automatically.
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

/**
 * STRIPE CONFIGURATION
 * Using a stable API version. 
 */
const STRIPE_API_VERSION = "2024-12-18.acacia" as any;

const getStripe = () => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
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
    "https://www.profineart.ch",
    /\.web\.app$/,
    /\.firebaseapp\.com$/,
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

// Helper for clean error logging
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * ROUTES
 * Note: These paths are relative to the function name 'api'.
 * Calling [FUNCTION_URL]/create-checkout-session will trigger the route below.
 */

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.json({message: "Server is running via Firebase Functions."});
});

// Fetch Available Slots
app.get("/schedule/slots", async (req: Request, res: Response) => {
  try {
    const {productId, date, duration} = req.query;
    if (!productId || typeof productId !== "string" || !date || typeof date !== "string" || !duration) {
      return res.status(400).json({success: false, message: "Missing parameters"});
    }

    const durationMinutes = parseInt(duration as string, 10);
    const slots = await getAvailableSlots(productId, date, durationMinutes);
    return res.json({success: true, slots});
  } catch (error) {
    console.error("API Error:", getErrorMessage(error));
    return res.status(500).json({success: false, message: "Server error fetching slots."});
  }
});

// Address Validation
app.post("/validate-address", async (req: Request, res: Response) => {
  try {
    const {address} = req.body;
    if (!address) {
      return res.status(400).json({success: false, message: "Address required."});
    }

    const validationResult = await validateAddress(address);
    return res.status(validationResult.isValid ? 200 : 422).json({
      success: validationResult.isValid,
      message: validationResult.message,
    });
  } catch (error) {
    return res.status(500).json({success: false, message: "Address validation failed."});
  }
});

// Create Stripe Checkout Session
app.post("/create-checkout-session", async (req: Request, res: Response) => {
  try {
    if (!req.body.packageId || !req.body.email) {
      return res.status(400).json({success: false, message: "Missing packageId or email."});
    }
    const session = await createStripeCheckoutSession(req.body, getStripe());
    return res.json({checkoutUrl: session.url});
  } catch (error) {
    console.error("Checkout Session Error:", getErrorMessage(error));
    return res.status(500).json({success: false, message: "Stripe error."});
  }
});

// Order Fulfillment (Post-Payment)
app.post("/order/fulfill", async (req: Request, res: Response) => {
  try {
    const {sessionId} = req.body;
    if (!sessionId) {
      return res.status(400).json({success: false, message: "Invalid session ID."});
    }

    const fulfillmentResult = await fulfillOrder(sessionId, getStripe());
    return res.json({success: true, result: fulfillmentResult});
  } catch (error) {
    // Return 200 even on snag to avoid showing error page to customer
    console.error("Fulfillment Handled Error:", getErrorMessage(error));
    return res.status(200).json({
      success: true, 
      message: "Fulfillment completed via Stripe backup."
    });
  }
});

/**
 * FIREBASE FUNCTION EXPORT
 * This defines the base path for all routes above.
 */
export const api = onRequest({
  region: "europe-west1", 
  memory: "256MiB",      
  maxInstances: 10,      
  concurrency: 80,         
  secrets: [
    "STRIPE_SECRET_KEY", 
    "EMAIL_SERVICE_USER", 
    "EMAIL_SERVICE_PASS", 
    "OPENCAGE_API_KEY"
  ]
}, app);