import fp from 'fastify-plugin';
import {OpenAiAdapter} from "../infrastructures/ai-adapter/OpenAiAdapter";
import {StubAiAdapter} from "../infrastructures/ai-adapter/StubAiAdapter";

export default fp(async (fastify) => {
    const { OPENAI_API_KEY } = fastify.config;   // <-- from .env
    const questionAdapter =new OpenAiAdapter(OPENAI_API_KEY,
        "You are a helpful conversation agent.\n" +
        "Generate 2–4 short, polite clarifying questions based on the given items.\n" +
        "Combine related topics where possible. Be concise and natural.\n" +
        "Output each question on a new line without numbering.");
    if (questionAdapter){
        console.log();
    }
    fastify.decorate('aiAdapter',  new StubAiAdapter());
});