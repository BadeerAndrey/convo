import path from 'path'
import AutoLoad from '@fastify/autoload'
import { FastifyInstance } from 'fastify'
import fastifySocketIo from 'fastify-socket.io'
import fastifyStatic from '@fastify/static'

export default async function (fastify: FastifyInstance, opts: any) {
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