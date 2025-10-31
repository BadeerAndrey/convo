import fp from 'fastify-plugin';
import {RedisStreamClient} from "../infrastructures/stream-client/RedisStreamClient";
import {AgentQuestions} from "../packages/shared";

export default fp(async (fastify) => {
    const { REDIS_URL } = fastify.config;   // <-- from .env
    const questionStreamClient =new RedisStreamClient<AgentQuestions>(REDIS_URL,"questionStreamClient");
    fastify.decorate('questionStreamClient', questionStreamClient);
    fastify.addHook('onClose', async (instance) => {
        await instance.questionStreamClient.disconnect();
    });
});