import axios from "axios";
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function notifySlack(email: any) {
    if (!SLACK_WEBHOOK_URL) return;
    const text = `*Interested* email from ${email.from}\n*Subject:* ${email.subject}\n*Snippet:* ${email.text?.slice(0,200)}`;
    await axios.post(SLACK_WEBHOOK_URL, { text });
}