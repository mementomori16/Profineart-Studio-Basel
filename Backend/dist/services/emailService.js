import * as postmark from 'postmark';
/**
 * Initialize Postmark Client.
 * Note: Use your Server API Token here.
 */
const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN || '');
/**
 * Sends a confirmation email to the customer.
 * Ported from original Nodemailer logic to Postmark.
 */
export async function sendConfirmationEmail(details) {
    try {
        await client.sendEmail({
            "From": `"Professional Fine Art Studio" <info@profineart.ch>`,
            "To": details.email,
            "Subject": `🎨 Booking Confirmed: ${details.packageName}`,
            "TextBody": `Hello ${details.name},\n\nThank you for your booking! Your payment was successful.\n\nDetails:\nService: ${details.packageName}\nDate: ${details.date}\nTime: ${details.time}\nAddress: ${details.address}\n\nWe look forward to seeing you at the studio!`,
            "HtmlBody": `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
                    </div>
                    <div style="padding: 30px; color: #333;">
                        <p>Hello <strong>${details.name}</strong>,</p>
                        <p>Thank you for choosing our studio. Your payment has been processed successfully, and your art session is officially scheduled.</p>
                        
                        <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 20px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #2c3e50;">Reservation Summary</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 5px 0; color: #7f8c8d;"><strong>Service:</strong></td>
                                    <td style="padding: 5px 0;">${details.packageName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #7f8c8d;"><strong>Date:</strong></td>
                                    <td style="padding: 5px 0;">${details.date}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #7f8c8d;"><strong>Time:</strong></td>
                                    <td style="padding: 5px 0;">${details.time}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #7f8c8d;"><strong>Location:</strong></td>
                                    <td style="padding: 5px 0;">${details.address}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <p>If you have any questions or need to reschedule, please reply to this email or contact us directly.</p>
                        <p style="margin-top: 30px;">Best regards,<br><strong>Professional Fine Art Studio</strong></p>
                    </div>
                    <div style="background-color: #f1f1f1; color: #95a5a6; padding: 15px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">&copy; 2026 Professional Fine Art Studio. All rights reserved.</p>
                    </div>
                </div>
            `,
            "MessageStream": "outbound"
        });
        console.log(`[POSTMARK SUCCESS] Client confirmation sent to: ${details.email}`);
    }
    catch (error) {
        console.error(`[POSTMARK ERROR] Failed to send client confirmation:`, error);
        throw error;
    }
}
/**
 * Sends a notification to the studio owner.
 * Ported from original Nodemailer logic to Postmark.
 */
export async function sendOwnerNotification(details) {
    const ownerEmail = "info@profineart.ch";
    try {
        await client.sendEmail({
            "From": `"Studio Booking System" <info@profineart.ch>`,
            "To": ownerEmail,
            "Subject": `🔔 NEW BOOKING: ${details.name} - ${details.date}`,
            "HtmlBody": `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #27ae60; border-bottom: 2px solid #27ae60; padding-bottom: 10px;">New Order Received</h2>
                    <p>You have a new booking. Here are the full details provided by the customer:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f2f2f2;">
                            <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Field</th>
                            <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Customer Information</th>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Client Name</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${details.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Client Email</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${details.email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Client Phone</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${details.phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Birthdate</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${details.birthdate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Client Address</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${details.address}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Package Booked</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${details.packageName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Scheduled For</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${details.date} at ${details.time}</td>
                        </tr>
                    </table>

                    <div style="background-color: #fff9c4; padding: 15px; border-radius: 5px; border: 1px solid #fbc02d;">
                        <h4 style="margin-top: 0;">Customer Message:</h4>
                        <p style="margin-bottom: 0;">${details.message}</p>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #95a5a6;">This is an automated notification from your website's Stripe integration.</p>
                </div>
            `,
            "MessageStream": "outbound"
        });
        console.log(`[POSTMARK SUCCESS] Owner notification sent for: ${details.name}`);
    }
    catch (error) {
        console.error(`[POSTMARK ERROR] Failed to send owner notification:`, error);
    }
}
