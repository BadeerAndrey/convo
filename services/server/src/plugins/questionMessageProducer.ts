import fp from 'fastify-plugin';
import RedisProducer from "../infrastructures/message-broker/redis-producer";

export default fp(async (fastify) => {
    const { REDIS_URL } = fastify.config;   // <-- from .env

    const questionMessageProducer =await RedisProducer.create(REDIS_URL, "agent-message")
    fastify.decorate('questionMessageProducer', questionMessageProducer);
    fastify.addHook('onClose', async (instance) => {
        await instance.questionMessageProducer.disconnect();
    });
});