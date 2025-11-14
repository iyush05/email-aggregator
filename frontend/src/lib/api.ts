import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export async function fetchEmails(params?: {
    q?: string;
    accountId?: string;
    email: string;
    folder?: string;
    label?: string;
}) {
    const res = await api.get("/emails", { params });
    return res.data.emails || [];
}

export async function startImapConnection({
  id,
  user,
  pass,
  host,
  port,
  secure,
  accessToken,
  method,
}: {
  id: string;
  user: string;
  pass?: string;
  host: string;
  port: number;
  secure: boolean;
  accessToken?: string;
  method?: "XOAUTH2";
}) {
  try {
    const body: any = {
      id,
      host,
      port,
      secure,
      auth: {
        user: user,
        accessToken: accessToken
      },
    };

    body.auth.method = "XOAUTH2";
    

    const res = await api.post("/start-imap", body);
    return res.data;
  } catch (err: any) {
    console.error("IMAP connection failed:", err.response?.data || err.message);
    throw err;
  }
}