import express from "express";
import axios from "axios";
import 'dotenv/config';
const router = express.Router();

router.get("/google", (req, res) => {
    const redirect_uri = "http://localhost:4000/auth/google/callback";
    const client_id = process.env.GOOGLE_CLIENT_ID;
      const scope = [
    "openid",
    "email",
    "profile",
    "https://mail.google.com/",
  ].join(" ");

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
    try { 
        const code = req.query.code;
        if (!code) return res.status(400).send("Missing code");
            const params = new URLSearchParams();
            params.append("code", code);
            params.append("client_id", process.env.GOOGLE_CLIENT_ID!);
            params.append("client_secret", process.env.CLIENT_SECRET!);
            params.append("redirect_uri", "http://localhost:4000/auth/google/callback");
            params.append("grant_type", "authorization_code");

        const tokenRes = await axios.post("https://oauth2.googleapis.com/token", params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
        const { access_token, refresh_token } = tokenRes.data;
        const profileRes = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
  headers: { Authorization: `Bearer ${access_token}` },
});


        const userEmail = profileRes.data.email;

        res.redirect(`http://localhost:3000?token=${encodeURIComponent(access_token)}&email=${encodeURIComponent(userEmail)}`);

    } catch (err) {
        console.error("OAuth token exchange failed:", err);
        res.status(500).send("Token exchange failed");
    }
})

export default router;