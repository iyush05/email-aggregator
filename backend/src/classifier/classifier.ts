import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LABELS = ['Interested', 'Meeting Booked', 'Not Interested', 'Spam', 'Out of Office'];

export async function classifyEmail(email: { subject: string; text: string; from?: string }) {
    const prompt = `
    You are an assistant that classifies an email into one of the labels: ${LABELS.join(', ')}.
    Return only the single label word.
    
    Email subject: ${email.subject || ""}
    Email body: ${email.text?.slice(0,3000) || ""}
    
    Which label fits best?
    `;

    const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 16,
        temperature: 0,
    });

    const label = resp.choices?.[0]?.message?.content?.trim().split('\n')[0];
    if (LABELS.includes(label!)) return label;

    if (/out of office|vacation/i.test(email.text || "")) return 'Out of Office';
    if (/meeting|schedule|call|book/i.test(email.subject + " " + (email.text||""))) return "Meeting Booked";
    return "Not Interested";
}