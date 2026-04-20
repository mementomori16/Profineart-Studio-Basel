import axios from 'axios';
import { TimeSlot } from '../types/Booking.js';
import { PRODUCT_PACKAGES, CONSULTATION_PACKAGES } from '../data/products.js'; 
import { DateTime } from 'luxon';

const SCHEDULE_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTwsYJfuTfwBE1hA7wA7MRedNg5jsArQFahWZWn1dgxlBmLAbS7_hRUD1KV4y41Lwg0cc9J3wHPaTQb/pub?gid=0&single=true&output=csv';
const SLOT_INCREMENT_MINUTES = 30;

// Combine all packages
const ALL_PACKAGES = [...PRODUCT_PACKAGES, ...CONSULTATION_PACKAGES];

function timeToMinutes(timeString: string): number {
    if (!timeString) return NaN;
    let cleaned = timeString.replace(/"/g, '').trim().toUpperCase();
    const isPM = cleaned.includes('PM');
    const isAM = cleaned.includes('AM');
    cleaned = cleaned.replace(/[A-Z\s]/g, '');
    const parts = cleaned.split(':').map(p => parseInt(p, 10));
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return NaN;
    let hours = parts[0];
    const minutes = parts[1];
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + minutes;
}

const SWISS_HOLIDAYS = [
    '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-01', '2026-05-14', '2026-05-25', '2026-08-01', '2026-12-25', '2026-12-26'
];

export const getAvailableSlots = async (productId: string, date: string, duration: number): Promise<TimeSlot[]> => {
    console.log(`DEBUG: Fetching slots for Product: ${productId}, Duration: ${duration}, Date: ${date}`);

    try {
        const response = await axios.get(SCHEDULE_CSV_URL, { responseType: 'text' });
        const rows = response.data.trim().split('\n').filter((line: string) => line.length > 0);

        const requestedDate = DateTime.fromISO(date, { zone: 'utc' });
        const requestedDayOfWeek = requestedDate.toFormat('EEEE'); 
        
        if (requestedDayOfWeek === 'Sunday' || SWISS_HOLIDAYS.includes(date)) return [];

        let operatingHours = null;
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].split(',');
            if (cells.length < 4) continue;
            const dayInSheet = cells[0].trim().replace(/"/g, '');
            if (dayInSheet.toUpperCase() === requestedDayOfWeek.toUpperCase()) {
                operatingHours = { 
                    startTime: timeToMinutes(cells[1]), 
                    endTime: timeToMinutes(cells[2]), 
                    isAvailable: cells[3].trim().replace(/"/g, '').toUpperCase() === 'TRUE' 
                };
                break;
            }
        }

        const availableSlots: TimeSlot[] = [];
        if (operatingHours && operatingHours.isAvailable) {
            // MATCHING FIX: We look for the package using the productId AND the duration
            const targetPackage = ALL_PACKAGES.find(p => p.id === productId || p.durationMinutes === duration);

            if (!targetPackage) {
                console.error("DEBUG: Package not found in ALL_PACKAGES for ID:", productId);
                return [];
            }

            let currentTimeMinutes = operatingHours.startTime;
            // Use targetPackage.durationMinutes to be absolutely sure we match the product definition
            const actualDuration = targetPackage.durationMinutes;

            while (currentTimeMinutes + actualDuration <= operatingHours.endTime) {
                const hour = Math.floor(currentTimeMinutes / 60);
                const minute = currentTimeMinutes % 60;
                const slotTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                
                availableSlots.push({
                    time: slotTime,
                    packageId: targetPackage.id,
                    durationMinutes: actualDuration,
                    price: targetPackage.price, 
                    isAvailable: true 
                });
                currentTimeMinutes += SLOT_INCREMENT_MINUTES; 
            }
        }
        
        return availableSlots;
    } catch (error) {
        console.error("ERROR:", error);
        return [];
    }
};

