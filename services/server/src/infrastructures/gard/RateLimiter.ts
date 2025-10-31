export interface RateLimiter {
    /** Returns true if allowed, false if rate limit exceeded */
    allow(key: string): Promise<boolean>;
    disconnect(): Promise<void>;
}