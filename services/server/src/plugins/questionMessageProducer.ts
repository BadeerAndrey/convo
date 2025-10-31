import fp from 'fastify-plugin';
import RedisProducer from "../infrastructures/message-broker/RedisProducer";

export default fp(async (fastify) => {
    const { REDIS_URL } = fastify.config;   // <-- from .env

    const questionMessageProducer =new RedisProducer(REDIS_URL, "agent-message")
    fastify.decorate('questionMessageProducer', questionMessageProducer);
    fastify.addHook('onClose', async (instance) => {
        await instance.questionMessageProducer.disconnect();
    });
});