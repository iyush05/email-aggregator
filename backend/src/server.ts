import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import { ensureIndex } from "./elastic/esClient";
import imapRoutes from "./routes/imap";
import emailRoutes from "./routes/email";
import authRoutes from "./routes/auth";

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://email-aggregator-ruddy.vercel.app/',
  'https://email-aggregator-ruddy.vercel.app'
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)

app.use("/auth", authRoutes);
app.use("/", emailRoutes);
app.use("/", imapRoutes);

const port = process.env.PORT || 4000;
app.listen(port, async () => {
    await ensureIndex();
    console.log(`Email Aggregator running on port ${port}`)
})