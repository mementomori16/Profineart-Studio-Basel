import axios from 'axios';
import { TimeSlot } from '../types/Booking.js';
import { PRODUCT_PACKAGES } from '../data/products.js'; 
import { DateTime } from 'luxon';

// --- CRITICAL FIX: Reverting to the standard Google Sheets URL format ---
// This path structure is more reliable for publicly shared CSV files.
const SCHEDULE_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTwsYJfuTfwBE1hA7wA7MRedNg5jsArQFahWZWn1dgxlBmLAbS7_hRUD1KV4y41Lwg0cc9J3wHPaTQb/pub?gid=0&single=true&output=csv';

// Defines the fixed increment for time slot start times (every half hour)
const SLOT_INCREMENT_MINUTES = 30;

// Helper to map package durations to their IDs
const packageDurationMap = PRODUCT_PACKAGES.reduce((acc, pkg) => {
    acc[pkg.durationMinutes] = pkg.id;
    return acc;
}, {} as Record<number, string>);

/**
 * Converts a time string (e.g., "8:30:00" or "8:30") into minutes past midnight.
 * Handles potential non-numeric characters gracefully.
 */
function timeToMinutes(timeString: string): number {
    // Clean string by removing quotes and trimming, then split
    const cleanedString = timeString.replace(/"/g, '').trim();
    const parts = cleanedString.split(':').map(p => parseInt(p, 10));
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return NaN;
    // Add 0 if seconds are missing
    const hours = parts[0];
    const minutes = parts[1];
    return hours * 60 + minutes;
}

// ====================================================================
// SWISS HOLIDAY LOGIC (Private to this module)
// ====================================================================
const SWISS_HOLIDAYS: string[] = [
    // ------------------- 2025 -------------------
    '2025-12-25', // Christmas Day 
    '2025-12-26', // St. Stephen's Day 
    // ------------------- 2026 -------------------
    '2026-01-01', // New Year's Day
    '2026-04-03', // Good Friday
    '2026-04-06', // Easter Monday
    '2026-05-01', // Labour Day
    '2026-05-14', // Ascension Day
    '2026-05-25', // Whit Monday
    '2026-08-01', // Swiss National Day
    '2026-12-25', // Christmas Day 
    '2026-12-26', // St. Stephen's Day 
    // ------------------- 2027 -------------------
    '2027-01-01', // New Year's Day
    '2027-03-26', // Good Friday
    '2027-03-29', // Easter Monday
    '2027-05-01', // Labour Day
    '2027-05-06', // Ascension Day
    '2027-05-17', // Whit Monday
    '2027-08-01', // Swiss National Day
    '2027-12-25', // Christmas Day 
    '2027-12-26', // St. Stephen's Day 
];

/**
 * Checks if a given date is an official Swiss national holiday.
 * @param dateString The date string (YYYY-MM-DD).
 * @returns boolean
 */
function isSwissHoliday(dateString: string): boolean {
    return SWISS_HOLIDAYS.includes(dateString);
}
// ====================================================================


/**
 * Fetches and parses availability data from the Google Sheet (CSV format).
 * @param date The date string (YYYY-MM-DD) for which to fetch slots.
 * @param duration The required duration of the slot in minutes.
 * @returns A promise that resolves to an array of available TimeSlots.
 */
export const getAvailableSlots = async (_productId: string, date: string, duration: number): Promise<TimeSlot[]> => {
    try {
        // Fetch the CSV data from the Google Sheet
        const response = await axios.get(SCHEDULE_CSV_URL, { responseType: 'text' });
        const csvText = response.data;

        // Split data into rows, filter out empty lines, and handle the header row
        const rows = csvText.trim().split('\n').filter((line: string) => line.length > 0);

        if (rows.length <= 1) return []; // Only header row exists

        // 1. Check for non-working days (Sunday and Holidays)
        const requestedDate = DateTime.fromISO(date, { zone: 'utc' });
        if (!requestedDate.isValid) {
            throw new Error(`Invalid date format provided: ${date}`);
        }
        const requestedDayOfWeek = requestedDate.toFormat('EEEE'); 
        
        // FIX: Exclude Sundays and Swiss National Holidays
        if (requestedDayOfWeek === 'Sunday' || isSwissHoliday(date)) {
            console.log(`Date ${date} is a Sunday or holiday. No slots available.`);
            return [];
        }

        // 2. Find the operating hours for that day in the CSV
        // Columns: Col 0: Day of Week | Col 1: Start Time | Col 2: End Time | Col 3: Available
        let operatingHours: { startTime: number, endTime: number, isAvailable: boolean } | null = null;

        for (let i = 1; i < rows.length; i++) {
            // Simple split by comma is used, assuming no commas within sheet data fields
            const cells = rows[i].split(',');

            if (cells.length < 4) continue;

            const dayOfWeek = cells[0].trim().replace(/"/g, '');
            const rawStartTime = cells[1].trim().replace(/"/g, '');
            const rawEndTime = cells[2].trim().replace(/"/g, '');
            const isAvailableStr = cells[3].trim().replace(/"/g, '').toUpperCase();

            // Match the requested day of week (case-insensitive)
            if (dayOfWeek.toUpperCase() === requestedDayOfWeek.toUpperCase()) {
                const startTimeMinutes = timeToMinutes(rawStartTime);
                const endTimeMinutes = timeToMinutes(rawEndTime);
                const isDayAvailable = isAvailableStr === 'TRUE';

                if (!isNaN(startTimeMinutes) && !isNaN(endTimeMinutes)) {
                    operatingHours = { 
                        startTime: startTimeMinutes, 
                        endTime: endTimeMinutes,
                        isAvailable: isDayAvailable
                    };
                    break; // Found the hours for the requested day
                }
            }
        }

        // 3. Generate slots based on operating hours and required duration
        const availableSlots: TimeSlot[] = [];

        if (operatingHours && operatingHours.isAvailable) {
            const packageDurationId = packageDurationMap[duration];
            // CRITICAL: Get the price for the specific duration
            const packagePrice = PRODUCT_PACKAGES.find(p => p.durationMinutes === duration)?.price || 0; 

            if (!packageDurationId) {
                console.warn(`Skipping slot generation: Unknown duration ${duration}. Check PRODUCT_PACKAGES mapping.`);
                return [];
            }

            let currentTimeMinutes = operatingHours.startTime;

            // FIX: The loop condition correctly handles sessions of any duration (e.g., 90 minutes).
            // It ensures the session ends *at or before* the operating end time.
            while (currentTimeMinutes + duration <= operatingHours.endTime) {
                
                const hour = Math.floor(currentTimeMinutes / 60);
                const minute = currentTimeMinutes % 60;
                
                // Format time as "HH:MM"
                const slotTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                
                availableSlots.push({
                    time: slotTime,
                    packageId: packageDurationId,
                    durationMinutes: duration,
                    price: packagePrice, 
                    isAvailable: true 
                });
                
                // Move to the next potential start time using the fixed increment (30 minutes)
                currentTimeMinutes += SLOT_INCREMENT_MINUTES; 
            }
        } else if (operatingHours) {
            console.log(`Operating hours found for ${requestedDayOfWeek} but isAvailable is FALSE.`);
        } else {
             console.log(`No operating hours found for ${requestedDayOfWeek}.`);
        }
        
        return availableSlots;

    } catch (error) {
        console.error("Error fetching or parsing Google Sheet CSV data:", error);
        // Throw a specific error message for easier debugging in the client
        throw new Error('Failed to fetch schedule from Google Sheet. Please check the network connection and the SCHEDULE_CSV_URL.');
    }
};

