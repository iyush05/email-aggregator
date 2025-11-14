import { ImapFlow } from "imapflow"
import { indexEmailToES } from "../elastic/esClient";
import { classifyEmail } from "../classifier/classifier";
import { notifySlack } from "../notifier/slack";
import { triggerWebhook } from "../notifier/webhook";
import { parseEmail } from "../utils/mailParser.js"

export type ImapAccountConfig = {
    id: string;
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; accessToken: string };
};

const activeClients = new Map<string, ImapFlow>();

function extractEmailAddress(field: any): string {
    if (!field) return "";
    
    if (typeof field === "string") {
        return field.toLowerCase().trim();
    }
    
    if (Array.isArray(field)) {
        if (field.length === 0) return "";
        const first = field[0];
        if (typeof first === "string") return first.toLowerCase().trim();
        if (first?.address) return first.address.toLowerCase().trim();
        return String(first).toLowerCase().trim();
    }
    
    if (field?.value?.[0]?.address) {
        return field.value[0].address.toLowerCase().trim();
    }
    
    if (field?.address) {
        return field.address.toLowerCase().trim();
    }
    
    return String(field).toLowerCase().trim();
}

export async function startImapForAccount(cfg: ImapAccountConfig) {
    
    const client = new ImapFlow({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: {
            user: cfg.auth.user,
            accessToken: cfg.auth.accessToken,
            loginMethod: "XOAUTH2",
        },
        logger: false,
    });

    await client.connect();
    console.log(`IMAP:${cfg.id} connected`);

    await client.mailboxOpen("INBOX");
    console.log(`IMAP:${cfg.id} INBOX opened`);

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 30);
    
    let count = 0;
    for await (const msg of client.fetch(
        { since: sinceDate },
        { envelope: true, source: true, flags: true, internalDate: true }
    )) {
        count++;
        await processRawMessage(cfg.id, msg);
    }

    console.log(`IMAP:${cfg.id} Total emails fetched: ${count}`);

    client.on('exists', () => {
        console.log(`IMAP:${cfg.id} New email arrived`);
        (async () => {
            for await (let msg of client.fetch('1:*', { envelope: true, source: true, internalDate: true})) {
                await processRawMessage(cfg.id, msg);
            }
        })();
    });

    activeClients.set(cfg.id, client);
}

async function processRawMessage(accountId: string, message: any) {
    console.log(`IMAP:${accountId} Processing message`);
    try {
        const parsed = await parseEmail(message.source);
        
        const toEmail = extractEmailAddress(parsed.to);
        const fromEmail = extractEmailAddress(parsed.from);

        const emailDoc = {
            accountId, 
            from: fromEmail,
            to: toEmail,
            subject: parsed.subject || "",
            date: parsed.date || new Date(),
            text: parsed.text || "",
            html: parsed.html || "",
            folder: "INBOX",
        };

        await indexEmailToES(emailDoc);
        console.log(`IMAP:${accountId} Indexed to ES`);

        const label = await classifyEmail({
            subject: emailDoc.subject,
            text: emailDoc.text,
            from: emailDoc.from,
        });
        
        if (label === "Interested") {
            console.log(`IMAP:${accountId} Sending Slack for Interested email`);
            await notifySlack(emailDoc);
            await triggerWebhook(emailDoc);
        }
    } catch (err) {
        console.error('processRawMessage error:', err);
    }
}

