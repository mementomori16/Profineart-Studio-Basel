import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Added helmet
import { getAvailableSlots } from './services/availabilityService.js';
import { createStripeCheckoutSession, fulfillOrder } from './services/checkoutService.js';
import { validateAddress } from './services/geocodingService.js';
import Stripe from 'stripe';
dotenv.config();
const STRIPE_API_VERSION = '2024-04-10';
// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
});
const app = express();
const PORT = process.env.PORT || 3001;
// --- Security Middleware Stack ---
// 1. Helmet: Sets various HTTP headers to protect against common attacks
app.use(helmet());
// 2. CORS: Restrict access to your frontend domain only
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));
// 3. Body Parser: Parses incoming JSON (placed after security checks)
app.use(express.json());
// --- Helper Function: getErrorMessage
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
// --- Routes ---
// 1. Root/Status Route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running and operational.' });
});
// 2. Schedule Availability Endpoint
app.get('/api/schedule/slots', async (req, res) => {
    try {
        const { productId, date, duration } = req.query;
        console.log(`[API] Received request for slots: productId=${productId}, date=${date}, duration=${duration}`);
        if (!productId || typeof productId !== 'string') {
            return res.status(400).json({ success: false, message: 'Error: productId is missing or invalid.' });
        }
        if (!date || typeof date !== 'string') {
            return res.status(400).json({ success: false, message: 'Error: date is missing or invalid.' });
        }
        if (!duration) {
            return res.status(400).json({ success: false, message: 'Error: duration (in minutes) is missing from the query parameters.' });
        }
        const durationMinutes = parseInt(duration, 10);
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            return res.status(400).json({ success: false, message: `Error: duration must be a valid positive number, received "${duration}".` });
        }
        const slots = await getAvailableSlots(productId, date, durationMinutes);
        res.json({ success: true, slots });
    }
    catch (error) {
        console.error('API Error in /api/schedule/slots:', getErrorMessage(error));
        res.status(500).json({ success: false, message: 'Failed to fetch schedule due to server error.' });
    }
});
// 3. Address Validation Endpoint
app.post('/api/validate-address', async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ success: false, message: 'Address is required for validation.' });
        }
        const validationResult = await validateAddress(address);
        if (validationResult.isValid) {
            res.json({ success: true, message: validationResult.message });
        }
        else {
            // Use 422 Unprocessable Entity for validation failures rather than 400
            res.status(422).json({ success: false, message: validationResult.message });
        }
    }
    catch (error) {
        console.error('API Error in /api/validate-address:', getErrorMessage(error));
        res.status(500).json({ success: false, message: 'Failed to process address validation.' });
    }
});
// 4. Stripe Checkout Session Creation Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        // Validation: Ensure req.body has necessary fields before calling service
        if (!req.body.packageId || !req.body.email) {
            return res.status(400).json({ success: false, message: 'Missing required checkout information.' });
        }
        const session = await createStripeCheckoutSession(req.body, stripe);
        res.json({ checkoutUrl: session.url });
    }
    catch (error) {
        console.error('API Error in /api/create-checkout-session:', getErrorMessage(error));
        res.status(500).json({ success: false, message: 'Failed to create Stripe session.' });
    }
});
// 5. Order Fulfillment and Confirmation Endpoint
// SECURITY NOTE: This endpoint is vulnerable to manual calling.
// It is highly recommended to replace this with a Stripe Webhook.
app.post('/api/order/fulfill', async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId || typeof sessionId !== 'string') {
            return res.status(400).json({ success: false, message: 'Missing or invalid session ID.' });
        }
        const fulfillmentResult = await fulfillOrder(sessionId, stripe);
        res.json({
            success: true,
            message: 'Order successfully fulfilled.',
            bookingDetails: fulfillmentResult
        });
    }
    catch (error) {
        console.error('API Error in /api/order/fulfill:', getErrorMessage(error));
        res.status(500).json({
            success: false,
            message: `Order fulfillment failed: ${getErrorMessage(error)}`
        });
    }
});
// --- Server Listener ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Access the backend at http://localhost:${PORT}`);
});
