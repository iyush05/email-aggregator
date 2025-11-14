import { simpleParser } from "mailparser";

export async function parseEmail(raw: Buffer | string) {
  if (!raw) {
    throw new Error("Cannot parse empty or undefined email source");
  }

  const parsed = await simpleParser(raw);

  return {
    from: parsed.from?.text || "",
    to: (Array.isArray(parsed.to) ? parsed.to[0]?.text : parsed.to?.text) || "",
    subject: parsed.subject || "(No Subject)",
    text: parsed.text || "",
    html: parsed.html || "",
    date: parsed.date || new Date(),
    attachments:
      parsed.attachments?.map((a) => ({
        filename: a.filename,
        contentType: a.contentType,
        size: a.size,
      })) || [],
  };
}
