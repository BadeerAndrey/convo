import fp from 'fastify-plugin';
import {RedisStreamClient} from "../infrastructures/stream-client/RedisStreamClient";
import {FollowUpPayload} from "shared";

export default fp(async (fastify) => {
    const { REDIS_URL } = fastify.config;   // <-- from .env
    const questionStreamClient =new RedisStreamClient<FollowUpPayload>(REDIS_URL,"followups:stream");
    fastify.decorate('followupStreamClient', questionStreamClient);
    fastify.addHook('onClose', async (instance) => {
        await instance.followupStreamClient.disconnect();
    });
});