import { RateLimiter } from "./RateLimiter";
import {createClient, RedisClientType} from "redis";

export interface RateLimitOptions {
    max: number;       // max actions per window
    windowSec: number; // duration of the window in seconds
}

export class RedisRateLimiter implements RateLimiter {
    private client: RedisClientType;
    private readonly options: RateLimitOptions;

    constructor(redisUrl: string, options: RateLimitOptions) {
        this.client = createClient({ url: redisUrl });
        this.options = options;
    }

    private async ensureConnected(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }
    async allow(key: string): Promise<boolean> {
        await this.ensureConnected();
        const { max, windowSec } = this.options;
        const now = Math.floor(Date.now() / 1000);
        const windowKey = `rate:${key}:${Math.floor(now / windowSec)}`;

        const count = await this.client.incr(windowKey);

        if (count === 1) {
            // Set expiration only the first time
            await this.client.expire(windowKey, windowSec);
        }

        return count <= max;
    }
    async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }
}
