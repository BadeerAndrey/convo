import '@fastify/env';
import {MessageProducer} from "../infrastructures/message-broker/MessageProducer";
import type { Server } from 'socket.io';
import {AgentQuestions, ClientToServerEvents, ServerToClientEvents} from "../packages/shared";
import {MessageConsumer} from "../infrastructures/message-broker/MessageConsumer";
import {StreamClient} from "../infrastructures/stream-client/StreamClient";
import {AiAdapter} from "../infrastructures/ai-adapter/AiAdapter";
import {Deduplicator} from "../infrastructures/gard/Deduplicator";
import {RateLimiter} from "../infrastructures/gard/RateLimiter";

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            REDIS_URL: string;
            OPENAI_API_KEY:string;
        };
        questionMessageProducer: MessageProducer<AgentQuestions[]>;
        questionMessageConsumer: MessageConsumer<AgentQuestions[]>;
        questionStreamClient: StreamClient<AgentQuestions>;
        aiAdapter: AiAdapter;
        deduplicator: Deduplicator;
        rateLimiter: RateLimiter;
        io: Server<ClientToServerEvents,ServerToClientEvents>;
    }
}