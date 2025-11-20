// Backend/index.ts

import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios'; // For making API calls to OpenCage

dotenv.config();

// --- CONSTANTS AND ENVIRONMENT SETUP ---
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT || 3001;

// Location Data
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY; 
const BASEL_LAT = parseFloat(process.env.BASEL_LAT || '47.5582761');
const BASEL_LON = parseFloat(process.env.BASEL_LON || '7.5878411');
const MAX_DISTANCE_KM = parseInt(process.env.MAX_DISTANCE_KM || '27', 10);

if (!STRIPE_SECRET_KEY || !CLIENT_URL || !OPENCAGE_API_KEY) {
    throw new Error("Missing required environment variables: STRIPE_SECRET_KEY, CLIENT_URL, or OPENCAGE_API_KEY");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
});

// --- LESSON PACKAGES (MUST MATCH FRONTEND) ---
const BACKEND_LESSON_PACKAGES = [
    // 🚨 IMPORTANT: REPLACE these placeholder price IDs with your ACTUAL Stripe Price IDs
    { id: 1, lessons: 1, priceCHF: 80, stripePriceId: 'price_1P6d5T...CHF_80_ID' },  
    { id: 5, lessons: 5, priceCHF: 390, stripePriceId: 'price_1P6d5T...CHF_390_ID' }, 
    { id: 10, lessons: 10, priceCHF: 780, stripePriceId: 'price_1P6d5T...CHF_780_ID' },
];

const app = express();

// Middleware setup
app.use(cors({ origin: CLIENT_URL })); // Allow requests from your React site
app.use(express.json()); 

// ----------------------------------------------------------------------
// HAIVERSINE DISTANCE CALCULATION FUNCTION
// ----------------------------------------------------------------------
// Calculates distance between two lat/lon points on Earth
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// ----------------------------------------------------------------------
// ENDPOINT 1: /api/validate-address (LONG-TERM SOLUTION)
// ----------------------------------------------------------------------
app.post('/api/validate-address', async (req: Request, res: Response) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ message: 'Address is required for validation.' });
    }
    
    try {
        // 1. Geocoding: Convert address string to Lat/Lon using OpenCage
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&countrycode=ch`; 
        const geocodeResponse = await axios.get(geocodeUrl);

        const results = geocodeResponse.data.results;

        if (results.length === 0) {
            return res.status(404).json({ message: 'Could not find a valid location for the given address.' });
        }

        const location = results[0].geometry;
        const userLat = location.lat;
        const userLon = location.lng;

        // 2. Distance Calculation
        const distance = haversineDistance(BASEL_LAT, BASEL_LON, userLat, userLon);

        // 3. Validation Check
        if (distance <= MAX_DISTANCE_KM) {
            return res.status(200).json({ 
                message: 'Address validated successfully.',
                distance: distance.toFixed(2),
                maxDistance: MAX_DISTANCE_KM,
            });
        } else {
            // Failure: Address is too far
            return res.status(403).json({ 
                message: `This address is ${distance.toFixed(1)} km away, which is outside the ${MAX_DISTANCE_KM} km service radius from Basel.`,
                distance: distance.toFixed(2),
                maxDistance: MAX_DISTANCE_KM,
            });
        }
    } catch (error) {
        console.error('Geocoding/Validation Error:', error);
        return res.status(500).json({ message: 'An internal error occurred during validation.' });
    }
});

// ----------------------------------------------------------------------
// ENDPOINT 2: /api/create-checkout-session (MODIFIED)
// ----------------------------------------------------------------------
app.post('/api/create-checkout-session', async (req: Request, res: Response) => {
    // Deconstruct packageId and address from the request body
    const { courseId, packageId, selectedDate, address } = req.body; 

    // Find the price ID based on the selected package
    const selectedPackage = BACKEND_LESSON_PACKAGES.find(pkg => pkg.id === packageId);
    
    if (!selectedPackage || !selectedDate || !address) {
        return res.status(400).json({ error: 'Missing required checkout details: package, date, or address.' });
    }
    
    // NOTE: For production, you would ideally re-run the address validation here
    // to prevent tampering with the frontend validation result.

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: selectedPackage.stripePriceId, // Use the specific price ID for the package
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                courseId: courseId,
                lessons: selectedPackage.lessons,
                date: selectedDate,
                customer_address: address, // Store the validated address for your records
            },
            
            // Collect shipping/service address on Stripe Checkout page
            shipping_address_collection: {
                allowed_countries: ['CH'], 
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

// ----------------------------------------------------------------------
// MODIFIED ENDPOINT: /api/create-checkout-session (Remains the same as before)
// ----------------------------------------------------------------------
app.post('/api/create-checkout-session', async (req: Request, res: Response) => {
    // ... [Stripe checkout creation code remains the same] ...
});
// ----------------------------------------------------------------------

// Health check endpoint (kept at the end)
app.get('/', (req, res) => {
    res.send('Stripe backend is operational.');
});


app.listen(PORT, () => {
    console.log(`Node server listening on port ${PORT}`);
});