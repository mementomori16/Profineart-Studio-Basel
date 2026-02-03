import * as postmark from 'postmark';
/**
 * Initialize Postmark Client.
 * Pulls the token from process.env (Firebase Secrets).
 */
const getPostmarkClient = () => {
    return new postmark.ServerClient(process.env.POSTMARK_API_TOKEN || '');
};
/**
 * Sends a high-end styled confirmation email to the customer.
 */
export async function sendConfirmationEmail(details) {
    const client = getPostmarkClient();
    const logoUrl = "https://res.cloudinary.com/dpayqcrg5/image/upload/fl_limit_size:150000/v1769809657/Group_148_1_eozycn.png";
    try {
        await client.sendEmail({
            "From": `"Profineart Studio Basel" <info@profineart.ch>`,
            "To": details.email,
            "Subject": `🎨 Booking Confirmed: ${details.packageName}`,
            "TextBody": `Your payment was successful and the art session is officially secured.\n\nPackage: ${details.packageName}\nDate: ${details.date}\nTime: ${details.time}\n\nThe mentor will contact you shortly to confirm and discuss the session. For inquiries, contact info@profineart.ch.`,
            "HtmlBody": `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; background-color: #171717; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { background-color: #171717; width: 100%; padding: 60px 0; }
        .container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 4px; overflow: hidden; }
        .header { padding: 50px 20px; text-align: center; }
        .logo { width: 280px; height: auto; max-width: 90%; }
        .content { padding: 0 50px 50px; color: rgba(255, 255, 255, 0.9); line-height: 1.8; font-size: 16px; }
        .main-heading { color: #ffffff; font-size: 22px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; text-align: center; margin-bottom: 40px; }
        .summary-box { border-top: 1px solid rgba(255, 255, 255, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 30px 0; margin: 30px 0; }
        .detail-item { margin-bottom: 15px; }
        .label { color: #ffffff; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 5px; opacity: 0.5; }
        .value { color: #ffffff; font-size: 16px; font-weight: 300; }
        .mentor-note { background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 2px; font-style: italic; border-left: 2px solid #ffffff; margin: 30px 0; }
        .pill-button { display: inline-block; background-color: #ffffff; color: #000000 !important; padding: 18px 45px; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 30px; }
        .footer { padding: 40px; text-align: center; font-size: 11px; color: rgba(255, 255, 255, 0.3); letter-spacing: 1px; text-transform: uppercase; background: rgba(0,0,0,0.2); }
        .contact-link { color: #ffffff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.3); }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <img src="${logoUrl}" alt="Profineart Studio Basel" class="logo">
            </div>
            <div class="content">
                <h2 class="main-heading">Booking Confirmed</h2>
                <p>The payment was successful and the art session is officially secured. This mentorship focuses on mastering the visual language of art through historical tradition and contemporary standards.</p>
                
                <div class="summary-box">
                    <div class="detail-item"><span class="label">Course</span><span class="value">${details.packageName}</span></div>
                    <div class="detail-item"><span class="label">Scheduled Date</span><span class="value">${details.date}</span></div>
                    <div class="detail-item"><span class="label">Time</span><span class="value">${details.time}</span></div>
                    <div class="detail-item"><span class="label">Location</span><span class="value">${details.address}</span></div>
                </div>

                <div class="mentor-note">
                    The mentor will contact you shortly to confirm the appointment, discuss the required materials, and talk about the upcoming session to ensure all artistic goals are met.
                </div>

                <p>If you want to reschedule, cancel, or have any questions, please contact <a href="mailto:info@profineart.ch" class="contact-link">info@profineart.ch</a> or simply reply to this email.</p>

                <div style="text-align: center;">
                    <a href="https://profineart.ch" class="pill-button">Back to Studio</a>
                </div>
            </div>
            <div class="footer">
                Profineart Studio Basel<br>
                Private Mentorship & Contemporary Art Education
            </div>
        </div>
    </div>
</body>
</html>
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
 */
export async function sendOwnerNotification(details) {
    const client = getPostmarkClient();
    const ownerEmail = "info@profineart.ch";
    try {
        await client.sendEmail({
            "From": `"Studio Booking System" <info@profineart.ch>`,
            "To": ownerEmail,
            "Subject": `🔔 NEW BOOKING: ${details.name} - ${details.date}`,
            "HtmlBody": `
                <div style="background-color: #171717; color: #ffffff; padding: 40px; font-family: sans-serif;">
                    <h2 style="border-bottom: 1px solid #ffffff; padding-bottom: 10px; font-weight: 300; letter-spacing: 2px;">NEW ORDER RECEIVED</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; color: #ffffff;">
                        <tr><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);"><strong>Client</strong></td><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">${details.name}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);"><strong>Email</strong></td><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">${details.email}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);"><strong>Phone</strong></td><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">${details.phone}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);"><strong>Birthdate</strong></td><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">${details.birthdate}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);"><strong>Address</strong></td><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">${details.address}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);"><strong>Package</strong></td><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">${details.packageName}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);"><strong>Date/Time</strong></td><td style="padding: 10px; border: 1px solid rgba(255,255,255,0.1);">${details.date} at ${details.time}</td></tr>
                    </table>
                    <div style="margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                        <strong>Customer Message:</strong><br>${details.message || 'None'}
                    </div>
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
