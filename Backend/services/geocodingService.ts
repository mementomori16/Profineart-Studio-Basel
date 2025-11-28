// Backend/services/geocodingService.ts

import axios from 'axios';
import dotenv from 'dotenv';
import { getDistance } from 'geolib'; // You'll need to install 'geolib'

dotenv.config();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const BASEL_LAT = parseFloat(process.env.BASEL_LAT || '47.5582761'); 
const BASEL_LON = parseFloat(process.env.BASEL_LON || '7.5878411'); 
// Use the client's provided 20 km (using the .env's 27km as the limit)
const MAX_DISTANCE_KM = parseFloat(process.env.MAX_DISTANCE_KM || '27'); 
const BASEL_COORDS = { latitude: BASEL_LAT, longitude: BASEL_LON };

/**
 * Calculates the distance between two coordinates using the Haversine formula (via geolib).
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers.
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // geolib's getDistance returns distance in meters by default
    const distanceMeters = getDistance(
        { latitude: lat1, longitude: lon1 },
        { latitude: lat2, longitude: lon2 }
    );
    return distanceMeters / 1000; // Convert to kilometers
}

/**
 * Geocodes an address and validates its distance from Basel.
 */
export async function validateAddress(address: string): Promise<{ isValid: boolean, message: string }> {
    if (!OPENCAGE_API_KEY) {
        return { isValid: false, message: 'Geocoding API key not configured on server.' };
    }

    try {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&countrycode=ch`;
        const response = await axios.get(url);
        
        if (response.data.results.length === 0) {
            return { isValid: false, message: 'Address could not be found or is incomplete.' };
        }

        const location = response.data.results[0].geometry;
        const distanceKm = calculateDistance(
            BASEL_COORDS.latitude, BASEL_COORDS.longitude,
            location.lat, location.lng
        );

        if (distanceKm <= MAX_DISTANCE_KM) {
            return { 
                isValid: true, 
                message: `Distance: ${distanceKm.toFixed(2)} km. Service available.` 
            };
        } else {
            return { 
                isValid: false, 
                message: `Address is ${distanceKm.toFixed(2)} km away, exceeding the ${MAX_DISTANCE_KM} km limit from Basel.` 
            };
        }

    } catch (error) {
        console.error('OpenCage Geocoding Error:', error);
        return { isValid: false, message: 'Error communicating with geocoding service.' };
    }
}