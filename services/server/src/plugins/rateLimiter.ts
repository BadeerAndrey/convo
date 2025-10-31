import fp from 'fastify-plugin';
import {RedisRateLimiter} from "../infrastructures/gard/RedisRateLimiter";

export default fp(async (fastify) => {
    const { REDIS_URL } = fastify.config;   // <-- from .env
    const limiter =new RedisRateLimiter(REDIS_URL,{
        max:10,
        windowSec:60
    });

    fastify.decorate('rateLimiter', limiter);
    fastify.addHook('onClose', async (instance) => {
        await instance.rateLimiter.disconnect();
    });
});