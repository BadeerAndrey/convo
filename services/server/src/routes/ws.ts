import { FastifyPluginAsync } from 'fastify'
import {ReviewerService} from "../services/reviewerService";
import {ClientToServerEvents, ServerToClientEvents} from "shared";
import {Socket } from 'socket.io';
import {ParticipantService} from "../services/participantService";
import {AgentService} from "../services/agentService";

const ws: FastifyPluginAsync = async (fastify): Promise<void> => {
    const reviewerService:ReviewerService = new ReviewerService(
        fastify.questionMessageProducer,
        fastify.questionStreamClient,
        fastify.aiAdapter,
        fastify.rateLimiter,
        fastify.deduplicator
    );
    const participantService:ParticipantService = new ParticipantService(fastify.questionMessageConsumer);
    const agentService:AgentService = new AgentService(fastify.questionStreamClient);
    const io = fastify.io;

    io.on('connection', (socket: Socket<ClientToServerEvents,ServerToClientEvents>) => {
        socket.on('followup:create', async (payload, ack) => {
            const res = await reviewerService.followUp(payload);
            ack(res);
       });

        socket.on('agent:questions:replay',async (since) => {
            const  questions =await agentService.getQuestions(since);
            for(const question of questions){
               socket.emit('agent:questions',question);
            }
        });
    });

    await participantService.consume(async messages => {
        for (const message of messages) {
            io.emit('agent:questions', message);
        }
    })
}

export default ws
