import express from "express";
import OpenAI from "openai";
import { es } from "../elastic/esClient";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.get("/emails", async (req, res) => {
    try {
        const { q, accountId, email, folder, label, size = 20, page = 1 } = req.query;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: "Missing email parameter" });
        }

        const must: any[] = [];
        
        must.push({ 
            match: { 
                to: email.toLowerCase() 
            } 
        });

            const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        must.push({
            range: {
                date: {
                    gte: thirtyDaysAgo.toISOString()
                }
            }
        });

        if (q && typeof q === 'string') {
            must.push({ 
                multi_match: { 
                    query: q, 
                    fields: ["subject", "text", "from", "to"],
                    fuzziness: "AUTO"
                }
            });
        }
        
        if (accountId && typeof accountId === 'string') {
            must.push({ term: { "accountId.keyword": accountId } });
        }
        
        if (folder && typeof folder === 'string') {
            must.push({ term: { "folder.keyword": folder } });
        }
        
        if (label && typeof label === 'string') {
            must.push({ term: { "label.keyword": label } });
        }

        const result = await es.search({
            index: "emails",
            from: (Number(page) - 1) * Number(size),
            size: Number(size),
            query: must.length ? { bool: { must } } : { match_all: {} },
            sort: [{ date: { order: "desc" } }],
        });

        const totalCount = typeof result.hits.total === 'object' 
            ? result.hits.total.value 
            : result.hits.total;

        const emails = result.hits.hits.map((h: any) => ({
            id: h._id,
            ...h._source,
        }));

        res.json({ count: totalCount, emails });
    } catch (err) {
        console.error("Error searching emails:", err);
        res.status(500).json({ 
            error: "Failed to fetch emails",
            details: err instanceof Error ? err.message : String(err)
        });
    }
});

export default router;

