import {createClient, RedisClientType} from 'redis';
import {StreamClient} from './StreamClient';

export class RedisStreamClient<T> implements StreamClient<T> {
    private client: RedisClientType;
    private readonly streamKey: string;

    constructor(redisUrl: string, streamKey: string) {
        this.client = createClient({ url: redisUrl });
        this.streamKey = streamKey;

        this.client.on('error', (err) => console.error('Redis error:', err));
    }

    private async ensureConnected(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    async add(message: T): Promise<string> {
        await this.ensureConnected();

        const payload = { data: JSON.stringify(message) };
        return await this.client.xAdd(
            this.streamKey,
            '*',
            payload,
            {
                TRIM: {
                    strategy: 'MAXLEN',
                    threshold: 100,
                },
            }
        );
    }


    async read(lastId?: string): Promise<{ id: string; message: T }[]> {
        await this.ensureConnected();

        const result = await this.client.xRead(
            [{ key: this.streamKey, id: lastId ??'0'}],
        );

        if (!result) return [];

        return result.flatMap(entry =>
            entry.messages.map(msg => ({
                id: msg.id,
                message: JSON.parse(msg.message.data) as T,
            }))
        );
    }

    async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }
}
