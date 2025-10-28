import { FastifyPluginAsync } from 'fastify'
import {ClientToServerEvents} from "../../../../packages/shared";

const ws: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/reviewer', { websocket: true }, (connection, req) => {
        connection.socket.on('message', (message:ClientToServerEvents) => {
            console.log('Received:', message.toString())
            connection.socket.send(`Echo: ${message}`);
        })
        fastify.get('/participant', { websocket: true }, (connection, req) => {

        })
    })
}

export default ws