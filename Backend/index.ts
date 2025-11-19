import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe and environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT || 3001;

if (!STRIPE_SECRET_KEY || !CLIENT_URL) {
    throw new Error("Missing required environment variables: STRIPE_SECRET_KEY or CLIENT_URL");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

const app = express();

// Middleware setup
app.use(cors({ origin: CLIENT_URL })); // Allow requests from your React site
app.use(express.json()); 

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Stripe backend is operational.');
});

// 💡 Endpoint to create the Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    const { priceId, courseId, selectedDate } = req.body;
    
    if (!priceId || !selectedDate) {
        return res.status(400).json({ error: 'Missing priceId or selectedDate' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            metadata: {
                courseId: courseId,
                selectedDate: selectedDate, 
            },
            // Redirect URLs use the client URL defined in .env
            success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/card/${courseId}`,
        });

        res.json({ id: session.id, url: session.url }); 
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: 'Failed to create Stripe Checkout session.' });
    }
});

app.listen(PORT, () => {
    console.log(`Node server listening on port ${PORT}`);
});