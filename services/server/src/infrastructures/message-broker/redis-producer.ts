import { createClient, RedisClientType } from 'redis';
import { MessageProducer } from './producer';

export class RedisProducer implements MessageProducer {
    private client: RedisClientType;

    constructor(redisUrl: string) {
        this.client = createClient({ url: redisUrl });
        this.client.connect();
    }

    async send(
        topic: string,
        message: string,
    ): Promise<void> {

        await this.client.xAdd(topic, '*', {
            message,
        });
    }

    async disconnect(): Promise<void> {
        await this.client.quit();
    }
}