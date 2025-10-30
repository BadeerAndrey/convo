import fp from 'fastify-plugin';
import env from '@fastify/env';

export default fp(async (fastify) => {
    await fastify.register(env, {
        confKey: 'config',          // fastify.config will hold the values
        schema: {
            type: 'object',
            required: ['REDIS_URL', "OPENAI_API_KEY"],
            properties: {
                DATABASE_URL: { type: 'string' },
                OPENAI_API_KEY: { type: 'string' },
                // add more if needed
            },
        },
        dotenv: true,               // automatically loads .env
        data: process.env,          // fallback for CI/CD
    });
});