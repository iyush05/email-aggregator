import express from "express";
import { startImapForAccount } from "../imap/imapManager";

const router = express.Router();

router.post("/start-imap", async (req, res) => {
  try {
    const { id, host, port, secure, auth, method } = req.body;
    const user = auth.user;
    const accessToken = auth.accessToken;

    const config = {
      id: id || "gmail1",
      host: host || "imap.gmail.com",
      port: port || 993,
      secure: secure !== false, // default true
      auth: {
        user,
        accessToken
      }
    };

    await startImapForAccount(config);

    res.json({
      status: "connected",
      account: config.auth.user,
      message: "IMAP connection started successfully",
    });
    
  } catch (err: any) {
    console.error("Error starting IMAP:", err);
    res.status(500).json({ 
      error: "Failed to start IMAP connection", 
      details: err.message 
    });
  }
});

export default router;
