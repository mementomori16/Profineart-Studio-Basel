// Backend/services/emailService.ts
import nodemailer from 'nodemailer';
// 1. Create a transporter object using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: parseInt(process.env.EMAIL_SERVICE_PORT || '587', 10),
    secure: process.env.EMAIL_SERVICE_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
    },
});
/**
 * Sends a booking confirmation email to the client.
 */
export async function sendConfirmationEmail(details) {
    const mailOptions = {
        from: process.env.EMAIL_FROM_ADDRESS,
        to: details.email,
        subject: `🎨 Booking Confirmed: ${details.package}`,
        // This is the plain text fallback
        text: `Hello ${details.name},\n\nThank you for your booking! Here are the details:\n\nService: ${details.package}\nDate: ${details.date} @ ${details.time}\n\nWe look forward to seeing you.`,
        // This is the HTML body for a nice format
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #333333;">Booking Confirmation 🎉</h2>
                <p>Hello <strong>${details.name}</strong>,</p>
                <p>Thank you for booking with us! Your payment was successful, and your session is confirmed.</p>
                
                <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <h3 style="color: ${process.env.COLOR_PRIMARY || '#6bb3f1'}; margin-top: 0;">Your Booking Details</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Service:</strong> ${details.package}</li>
                        <li><strong>Date:</strong> ${details.date}</li>
                        <li><strong>Time:</strong> ${details.time}</li>
                        <li><strong>Email:</strong> ${details.email}</li>
                    </ul>
                </div>
                
                <p style="margin-top: 20px;">We look forward to guiding your session!</p>
                <p>Best regards,<br>The Art Studio Team</p>
            </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Client confirmation email sent to ${details.email}`);
    }
    catch (error) {
        console.error(`[EMAIL ERROR] Failed to send client email to ${details.email}:`, error);
        // Do NOT re-throw the error
    }
}
/**
 * Sends a notification email to the studio owner (you).
 */
export async function sendOwnerNotification(details) {
    const ownerEmail = process.env.EMAIL_SERVICE_USER; // Your own email from .env
    const mailOptions = {
        from: process.env.EMAIL_FROM_ADDRESS,
        to: ownerEmail,
        subject: `🔔 NEW BOOKING: ${details.package} on ${details.date}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #4CAF50;">New Booking Alert! 🔔</h2>
                <p>A new session has been booked and paid for. Review the details below:</p>
                
                <div style="background: #f0fff0; padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <h3 style="color: #4CAF50; margin-top: 0;">Client & Booking Details</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Service:</strong> ${details.package}</li>
                        <li><strong>Date:</strong> ${details.date}</li>
                        <li><strong>Time:</strong> ${details.time}</li>
                        <li><strong>Client Name:</strong> ${details.name}</li>
                        <li><strong>Client Email:</strong> ${details.email}</li>
                        <li><strong>Client Phone:</strong> ${details.phone}</li>
                        <li><strong>Client Birthdate:</strong> ${details.birthdate}</li> </ul>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;">
                    <p><strong>Client Message:</strong></p>
                    <p style="white-space: pre-wrap; margin-left: 10px; font-style: italic;">${details.message}</p>
                </div>
                <p>This payment was successful via Stripe. You may need to manually add the event to your external calendar.</p>
                <p>Best,<br>Your Backend System</p>
            </div>
        `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Owner notification sent to ${ownerEmail}`);
    }
    catch (error) {
        console.error(`[EMAIL ERROR] Failed to send owner notification:`, error);
        // Do NOT re-throw the error
    }
}
