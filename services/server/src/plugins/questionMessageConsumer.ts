import fp from 'fastify-plugin';
import {RedisConsumer} from "../infrastructures/message-broker/redis-consumer";
import {AgentQuestions} from "../packages/shared";

export default fp(async (fastify) => {
    const { REDIS_URL } = fastify.config;   // <-- from .env

    const consumer =new RedisConsumer<AgentQuestions[]>(REDIS_URL, "agent-message")
    fastify.decorate('questionMessageConsumer', consumer);
    fastify.addHook('onClose', async (instance) => {
        await instance.questionMessageConsumer.stop();
    });
});