import fp from 'fastify-plugin';
import {OpenAiAdapter} from "../infrastructures/ai-adapter/OpenAiAdapter";
import {StubAiAdapter} from "../infrastructures/ai-adapter/StubAiAdapter";

export default fp(async (fastify) => {
    const {OPENAI_API_KEY, OPENAI_API_MODEL, OPENAI_API_SYSTEM_PROMPT,OPENAI_TOKEN_LIMIT} = fastify.config;   // <-- from .env

    const questionAdapter =
        OPENAI_API_KEY && OPENAI_API_KEY.length > 0
        && OPENAI_API_SYSTEM_PROMPT
        && OPENAI_API_MODEL
        && OPENAI_TOKEN_LIMIT
        ? new OpenAiAdapter(OPENAI_API_KEY, OPENAI_API_MODEL, OPENAI_API_SYSTEM_PROMPT,OPENAI_TOKEN_LIMIT)
        : new StubAiAdapter();
    fastify.decorate('aiAdapter', questionAdapter);
});