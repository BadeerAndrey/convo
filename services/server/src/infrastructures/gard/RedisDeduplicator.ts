import { Deduplicator } from "./Deduplicator";
import { createClient, RedisClientType } from "redis";
import { createHash } from "node:crypto";

export interface DeduplicationOptions {
    ttlSec: number;
}

function hashKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
}

export class RedisDeduplicator implements Deduplicator {
    private client: RedisClientType;
    private readonly ttlSec: number;

    constructor(redisUrl: string, options: DeduplicationOptions) {
        this.client = createClient({ url: redisUrl });
        this.ttlSec = options.ttlSec;
    }

    private async ensureConnected(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    async isUnique(keys: string | string[]): Promise<boolean> {
        const keyArray = Array.isArray(keys) ? keys : [keys];
        if (keyArray.length === 0) return true;

        await this.ensureConnected();

        const pipeline = this.client.multi();

        for (const key of keyArray) {
            const hashed = hashKey(key);
            const rkey = `dedup:${hashed}`;
            pipeline.set(rkey, "1", { NX: true, EX: this.ttlSec });
        }

        const results = await pipeline.exec();
        return (results as unknown as (string | null)[]).every((res) => res === "OK");
    }

    async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }
}