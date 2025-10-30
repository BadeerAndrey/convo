import '@fastify/env';
import {MessageProducer} from "../infrastructures/message-broker/producer";
import type { Server } from 'socket.io';
import {AgentQuestions, ClientToServerEvents, ServerToClientEvents} from "../packages/shared";
import {MessageConsumer} from "../infrastructures/message-broker/consumer";

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            REDIS_URL: string;
            OPENAI_API_KEY:string;
        };
        questionMessageProducer: MessageProducer<AgentQuestions[]>;
        questionMessageConsumer: MessageConsumer<AgentQuestions[]>;
        io: Server<ClientToServerEvents,ServerToClientEvents>;
    }
}