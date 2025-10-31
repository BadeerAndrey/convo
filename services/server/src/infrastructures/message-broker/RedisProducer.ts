import { createClient, RedisClientType } from 'redis';
import { MessageProducer } from './MessageProducer';

class RedisProducer<T> implements MessageProducer<T> {
    private client: RedisClientType;
    private readonly topic: string;

    public constructor(redisUrl: string, topic: string) {
        this.client =  createClient({ url: redisUrl });
        this.topic = topic;
    }

    private async ensureConnected(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    async send( messages: T, ): Promise<void> {
        console.log(`Redis producer Sending messages`);
        await this.ensureConnected();
        await this.client.publish(this.topic,JSON.stringify(messages));
    }

    async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }
}

export default RedisProducer