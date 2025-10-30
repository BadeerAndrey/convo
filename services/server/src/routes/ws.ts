import { FastifyPluginAsync } from 'fastify'
import {ReviewerService} from "../services/reviewerService";
import {ClientToServerEvents} from "../packages/shared";
import {Socket } from 'socket.io';
import {ParticipantService} from "../services/participantService";

const ws: FastifyPluginAsync = async (fastify): Promise<void> => {
    const reviewerService:ReviewerService = new ReviewerService(fastify.questionMessageProducer);
    const consumerService:ParticipantService = new ParticipantService(fastify.questionMessageConsumer);
    const io = fastify.io;

    io.on('connection', (socket: Socket<ClientToServerEvents>) => {
        socket.on('followup:create', (payload) => {
            reviewerService.followUp(payload);
        });

        socket.on('disconnect', () => {
            console.log('Reviewer disconnected:', socket.id);
        });
    });

    await consumerService.consume(async messages => {
        for (const message of messages) {
            io.emit('agent:questions', message);
        }
    })
}

export default ws
