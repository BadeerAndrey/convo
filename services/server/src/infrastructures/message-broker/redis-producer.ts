import { createClient, RedisClientType } from 'redis';
import { MessageProducer } from './producer';

class RedisProducer<T> implements MessageProducer<T> {
    private client: RedisClientType;
    private readonly topic: string;

    private constructor(client: RedisClientType, topic: string) {
        this.client = client;
        this.topic = topic;
    }

    static async create<T>(redisUrl: string, topic: string): Promise<RedisProducer<T>> {
        const client:RedisClientType = createClient({ url: redisUrl });
        await client.connect();
        return new RedisProducer<T>(client, topic);
    }

    async send( messages: T, ): Promise<void> {
        console.log(`Redis producer Sending messages`);
        await this.client.publish(this.topic,JSON.stringify(messages));
    }

    async disconnect(): Promise<void> {
        await this.client.quit();
    }
}

export default RedisProducer