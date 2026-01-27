import postmark from 'postmark';

// Use the token from your Postmark dashboard
const client = new postmark.ServerClient("d3333157-1f43-4138-8961-8f2d3df52712");

async function runTest() {
    console.log("Checking Postmark connection...");
    
    try {
        const response = await client.sendEmail({
            "From": "info@profineart.ch",
            "To": "info@profineart.ch",
            "Subject": "Studio Professional Test",
            "HtmlBody": "<strong>The bridge is ready!</strong> Once approved, this will arrive in your inbox.",
            "MessageStream": "outbound"
        });

        console.log("✅ Success! Server accepted the request.");
        console.log("Message ID:", response.MessageID);
    } catch (error) {
        // While waiting for approval, you might see a "422" or "Account Pending" error
        console.error("❌ Postmark Status:", error.message);
    }
}

runTest();