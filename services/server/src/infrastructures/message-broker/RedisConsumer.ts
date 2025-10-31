import { createClient, RedisClientType } from 'redis';
import { MessageConsumer } from './MessageConsumer';

export class RedisConsumer<T> implements MessageConsumer<T> {
    private client: RedisClientType;
    private subscribed = false;
    private readonly topic:string;

    constructor(redisUrl: string, topic:string) {
        this.client = createClient({ url: redisUrl });
        this.topic = topic;
    }

    private async ensureConnected() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    async consume(
        handler: (message: T) => Promise<void>,
    ): Promise<void> {
        await this.ensureConnected();

        if (this.subscribed) {
            console.warn(`already subscribed to a topic.`);
            return;
        }

        this.subscribed = true;

        await this.client.subscribe(this.topic, async (rawMessage: string) => {
            try {
                const parsed = JSON.parse(rawMessage) as T;
                await handler(parsed);
            } catch (err) {
                console.error('Error handling message:', err);
            }
        });

    }

    async stop(): Promise<void> {
        if (this.subscribed) {
            await this.client.unsubscribe();
            this.subscribed = false;
        }

        if (this.client.isOpen) {
            await this.client.quit();
        }
    }
}
