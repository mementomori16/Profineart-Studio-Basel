export interface TimeSlot {
    time: string;
    packageId: string;

    // FIX 1 APPLIED: Matches LessonPackage and AvailableSlot
    durationMinutes: number; // Duration in minutes (e.g., 60, 90)

    price: number;

    // FIX 2 APPLIED: Matches AvailableSlot
    isAvailable: boolean; // True if the slot is open
}
