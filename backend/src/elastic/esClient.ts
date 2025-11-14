import { Client } from "@elastic/elasticsearch";
const ES_HOST = process.env.ES_HOST || 'http://localhost:9200'
export const es = new Client({ node: ES_HOST });

export async function ensureIndex() {
    const idx = 'emails';
    const exists = await es.indices.exists({ index: idx });
    if (!exists) {
        await es.indices.create({
            index: idx,
                mappings: {
                    properties: {
                        accountId: { type: 'keyword' },
                        folder: { type: 'keyword' },
                        from: { type: 'text' },
                        to: { type: 'text' },
                        subject: { type: 'text' },
                        text: { type: 'text' },
                        date: { type: 'date' },
                        label: { type: 'keyword' }
                    }
                }
        });
    }
}

export async function indexEmailToES(doc: any) {
    await es.index({
        index: 'emails',
        document: doc
    });
}