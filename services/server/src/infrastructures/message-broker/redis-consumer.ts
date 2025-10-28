import { createClient, RedisClientType } from 'redis';
import {
    MessageConsumer,
} from './consumer';

export class RedisConsumer implements MessageConsumer {
    private client: RedisClientType;
    private consumerName: string;
    private stopped = false;

    constructor(redisUrl: string, consumerName = `consumer-${Date.now()}`) {
        this.client = createClient({ url: redisUrl });
        this.consumerName = consumerName;
    }

    private async ensureConnected() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    async consume(
        topic: string,
        handler: (message: string) => Promise<void>,
    ): Promise<void> {
        await this.ensureConnected();

        const groupId = 'default-group';

        try {
            await this.client.xGroupCreate(topic, groupId, '0', { MKSTREAM: true }).catch(() => {});
        } catch {
        }

        this.stopped = false;

        while (!this.stopped) {
            try {
                const result = await this.client.xReadGroup(
                    groupId,
                    this.consumerName,
                    [{ key: topic, id: '>' }],
                    { COUNT: 1, BLOCK: 5000 }
                );

                if (!result || this.stopped) continue;

                for (const stream of result) {
                    for (const msg of stream.messages) {
                        const fields = msg.message;
                        await handler(fields.message);
                        await this.client.xAck(topic, groupId, msg.id);
                    }
                }
            } catch (err) {
                if (!this.stopped) console.error('Consume error:', err);
            }
        }
    }

    async stop(): Promise<void> {
        this.stopped = true;
        if (this.client.isOpen) {
            await this.client.quit();
        }
    }
}