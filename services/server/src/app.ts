import path from 'path'
import AutoLoad from '@fastify/autoload'
import { FastifyInstance } from 'fastify'
import fastifySocketIo from 'fastify-socket.io'
import fastifyStatic from '@fastify/static'
import env from "@fastify/env";

export default async function (fastify: FastifyInstance, opts: any) {
    await fastify.register(env, {
        confKey: 'config',          // fastify.config will hold the values
        schema: {
            type: 'object',
            required: ['REDIS_URL', "OPENAI_API_KEY"],
            properties: {
                DATABASE_URL: { type: 'string' },
                OPENAI_API_KEY: { type: 'string' },
                // add more if needed
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