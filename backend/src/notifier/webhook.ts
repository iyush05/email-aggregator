import axios from 'axios';
const EXTERNAL_WEBHOOK = process.env.EXTERNAL_WEBHOOK;

export async function triggerWebhook(email: any) {
    try {
        await axios.post(process.env.EXTERNAL_WEBHOOK!, {
            event: 'interested_email',
            email
        });
    } catch (err) {
        console.error('webhook err', err);
    }
}