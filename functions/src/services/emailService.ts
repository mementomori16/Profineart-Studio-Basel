import nodemailer from 'nodemailer';
import { FulfillmentDetails } from './checkoutService.js';

// 1. Create a transporter using Infomaniak settings
const transporter = nodemailer.createTransport({
    host: 'mail.infomaniak.com',
    port: 587,
    secure: false, // false for 587
    auth: {
        user: process.env.EMAIL_SERVICE_USER, // Your full Infomaniak email
        pass: process.env.EMAIL_SERVICE_PASS, // Your NEW App Password
    },
});

/**
 * Sends a booking confirmation email to the client.
 */
export async function sendConfirmationEmail(details: FulfillmentDetails): Promise<void> {
    const mailOptions = {
        // The 'from' must match your Infomaniak user
        from: `"Professional Fine Art Studio" <${process.env.EMAIL_SERVICE_USER}>`,
        to: details.email,
        subject: `🎨 Booking Confirmed: ${details.package}`,
        
        text: `Hello ${details.name},\n\nThank you for your booking! Here are the details:\n\nService: ${details.package}\nDate: ${details.date} @ ${details.time}\n\nWe look forward to seeing you.`,

        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #333333; text-align: center;">Booking Confirmation 🎉</h2>
                <p>Hello <strong>${details.name}</strong>,</p>
                <p>Thank you for booking with us! Your payment was successful, and your session is confirmed.</p>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <h3 style="color: #6bb3f1; margin-top: 0;">Your Booking Details</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Service:</strong> ${details.package}</li>
                        <li><strong>Date:</strong> ${details.date}</li>
                        <li><strong>Time:</strong> ${details.time}</li>
                        <li><strong>Email:</strong> ${details.email}</li>
                    </ul>
                </div>
                
                <p style="margin-top: 20px;">We look forward to seeing you at the studio!</p>
                <p>Best regards,<br><strong>The Art Studio Team</strong></p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[INFOMANIAK SUCCESS] Client email sent. ID: ${info.messageId}`);
    } catch (error) {
        console.error(`[INFOMANIAK ERROR] Failed to send client email:`, error);
        throw error; // Re-throw so the Fulfillment log captures it
    }
}

/**
 * Sends a notification email to the studio owner.
 */
export async function sendOwnerNotification(details: FulfillmentDetails): Promise<void> {
    const ownerEmail = process.env.EMAIL_SERVICE_USER;

    const mailOptions = {
        from: `"Studio System" <${process.env.EMAIL_SERVICE_USER}>`,
        to: ownerEmail,
        subject: `🔔 NEW BOOKING: ${details.package} on ${details.date}`,
        
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #4CAF50;">New Booking Alert! 🔔</h2>
                <div style="background: #f0fff0; padding: 15px; border-radius: 5px; margin-top: 20px;">
                    <h3 style="color: #4CAF50; margin-top: 0;">Client & Booking Details</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Service:</strong> ${details.package}</li>
                        <li><strong>Date:</strong> ${details.date}</li>
                        <li><strong>Time:</strong> ${details.time}</li>
                        <li><strong>Client Name:</strong> ${details.name}</li>
                        <li><strong>Client Email:</strong> ${details.email}</li>
                        <li><strong>Client Phone:</strong> ${details.phone}</li>
                    </ul>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 10px 0;">
                    <p><strong>Client Message:</strong></p>
                    <p style="white-space: pre-wrap; margin-left: 10px; font-style: italic;">${details.message}</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[INFOMANIAK SUCCESS] Owner notification sent.`);
    } catch (error) {
        console.error(`[INFOMANIAK ERROR] Failed to send owner notification:`, error);
    }
}