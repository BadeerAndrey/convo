import fp from 'fastify-plugin';
import {RedisDeduplicator} from "../infrastructures/gard/RedisDeduplicator";

export default fp(async (fastify) => {
    const { REDIS_URL } = fastify.config;   // <-- from .env
    const deduplicator =new RedisDeduplicator(REDIS_URL,{
        ttlSec:60*60
    });

    fastify.decorate('deduplicator', deduplicator);
    fastify.addHook('onClose', async (instance) => {
        await instance.deduplicator.disconnect();
    });
});