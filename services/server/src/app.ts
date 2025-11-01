import path from 'path'
import AutoLoad from '@fastify/autoload'
import { FastifyInstance } from 'fastify'
import fastifySocketIo from 'fastify-socket.io'
import fastifyStatic from '@fastify/static'
import env from "@fastify/env";
import {MessageProducer} from "./infrastructures/message-broker/MessageProducer";
import {AgentQuestions, ClientToServerEvents, FollowUpPayload, ServerToClientEvents} from "shared";
import {MessageConsumer} from "./infrastructures/message-broker/MessageConsumer";
import {StreamClient} from "./infrastructures/stream-client/StreamClient";
import {AiAdapter} from "./infrastructures/ai-adapter/AiAdapter";
import {Deduplicator} from "./infrastructures/gard/Deduplicator";
import {RateLimiter} from "./infrastructures/gard/RateLimiter";
import type {Server} from "socket.io";

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            REDIS_URL: string;
            OPENAI_API_KEY:string;
            OPENAI_API_MODEL:string;
            OPENAI_API_SYSTEM_PROMPT:string;
            OPENAI_TOKEN_LIMIT:number;
        };

        questionMessageProducer: MessageProducer<AgentQuestions[]>;
        questionMessageConsumer: MessageConsumer<AgentQuestions[]>;
        questionStreamClient: StreamClient<AgentQuestions>;
        followupStreamClient:StreamClient<FollowUpPayload>;
        aiAdapter: AiAdapter;
        deduplicator: Deduplicator;
        rateLimiter: RateLimiter;
        io: Server<ClientToServerEvents,ServerToClientEvents>;
    }
}
export default async function (fastify: FastifyInstance, opts: any) {
    await fastify.register(env, {
        confKey: 'config',          // fastify.config will hold the values
        schema: {
            type: 'object',
            required: ['REDIS_URL'],
            properties: {
                DATABASE_URL: { type: 'string' },
                OPENAI_API_KEY: { type: 'string' },
                OPENAI_API_MODEL: { type: 'string' },
                OPENAI_API_SYSTEM_PROMPT: { type: 'string' },
                OPENAI_TOKEN_LIMIT: { type: 'number'}
            },
        },
        dotenv: true,               // automatically loads .env
        data: process.env,          // fallback for CI/CD
    });

    await fastify.register(fastifySocketIo,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    await fastify.register(fastifyStatic, {
        root: path.join(__dirname, 'public'),
        prefix: '/',
    });

    // Load plugins
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: { ...opts },
    })

    // Load routes
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: { ...opts },
    })
}