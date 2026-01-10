import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { onRequest } from 'firebase-functions/v2/https'; // 1. Added Firebase Import
import { getAvailableSlots } from './services/availabilityService.js';
import { createStripeCheckoutSession, fulfillOrder } from './services/checkoutService.js';
import { validateAddress } from './services/geocodingService.js';
import Stripe from 'stripe';

dotenv.config();

const STRIPE_API_VERSION = '2024-04-10' as const;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: STRIPE_API_VERSION,
});

const app = express();

// --- Security Middleware Stack ---
app.use(helmet()); 

// 2. Updated CORS to include your real domain and Firebase defaults
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'https://profineart.ch',
        /\.web\.app$/,
        /\.firebaseapp\.com$/
    ],
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(express.json());

// --- Helper Function ---
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

// --- Routes ---

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Server is running via Firebase Cloud Functions.' });
});

app.get('/api/schedule/slots', async (req: Request, res: Response) => {
    try {
        const { productId, date, duration } = req.query;
        if (!productId || typeof productId !== 'string' || !date || typeof date !== 'string' || !duration) {
            return res.status(400).json({ success: false, message: 'Missing parameters.' });
        }
        const durationMinutes = parseInt(duration as string, 10);
        const slots = await getAvailableSlots(productId, date, durationMinutes);
        res.json({ success: true, slots });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch slots.' });
    }
});

app.post('/api/validate-address', async (req: Request, res: Response) => {
    try {
        const { address } = req.body;
        if (!address) return res.status(400).json({ success: false, message: 'Address required.' });
        const validationResult = await validateAddress(address);
        res.status(validationResult.isValid ? 200 : 422).json({ success: validationResult.isValid, message: validationResult.message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Address validation error.' });
    }
});

app.post('/api/create-checkout-session', async (req: Request, res: Response) => {
    try {
        if (!req.body.packageId || !req.body.email) {
            return res.status(400).json({ success: false, message: 'Missing info.' });
        }
        const session = await createStripeCheckoutSession(req.body, stripe);
        res.json({ checkoutUrl: session.url });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Stripe session error.' });
    }
});

app.post('/api/order/fulfill', async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ success: false, message: 'Missing session ID.' });
        const fulfillmentResult = await fulfillOrder(sessionId, stripe);
        res.json({ success: true, bookingDetails: fulfillmentResult });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Fulfillment failed.' });
    }
});

// --- FIREBASE DEPLOYMENT EXPORT ---
// We remove app.listen and replace it with this:
export const api = onRequest({
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 10,  // Safety Cap
    concurrency: 80
}, app);