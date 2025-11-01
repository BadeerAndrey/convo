import {MessageProducer} from "../infrastructures/message-broker/MessageProducer";
import {AgentQuestions, FollowUpPayload} from "shared";
import {StreamClient} from "../infrastructures/stream-client/StreamClient";
import {AiAdapter} from "../infrastructures/ai-adapter/AiAdapter";
import {RateLimiter} from "../infrastructures/gard/RateLimiter";
import {Deduplicator} from "../infrastructures/gard/Deduplicator";

export class ReviewerService {
    private producer: MessageProducer<AgentQuestions[]>;
    private streamClient: StreamClient<AgentQuestions>;
    private aiAdapter: AiAdapter;
    private limiter: RateLimiter;
    private deduplicator: Deduplicator;

    constructor(
        producer: MessageProducer<AgentQuestions[]>,
        streamClient: StreamClient<AgentQuestions>,
        aiAdapter: AiAdapter,
        limiter: RateLimiter,
        deduplicator: Deduplicator
    ) {
        this.producer = producer;
        this.streamClient = streamClient;
        this.aiAdapter = aiAdapter;
        this.limiter = limiter;
        this.deduplicator = deduplicator;
    }

    async followUp(dto: FollowUpPayload) {

        try {
            if (!dto || !dto.items || !dto.items.length || dto.items.find(x=>!x)) {
                return {ok: false, message: "invalid payload"};
            }

            if (!await this.limiter.allow("followUp")) {
                return {ok: false, message: "too many followup request"};
            }

            if (!await this.deduplicator.isUnique(dto.items)) {
                return {ok: false, message: "found duplicate request"};
            }

            const userPrompt = `Items: ${dto.items.join(", ")}\n\nGenerate 2–4 clarifying questions.`;
            const res = await this.aiAdapter.generate(userPrompt);
            console.log(res);
            if (!res.ok) {
                return {ok: false, message: 'failed to call AI'};
            }

            const replies: AgentQuestions[] = res.data
                .map(q => ({
                    createdAt: Date.now(),
                    text: q,
                }));

            for (const reply of replies) {
                reply.streamId = await this.streamClient.add(reply);
            }
            await this.producer.send(replies);
            return {ok: true};
        }catch (err){
            console.log(err);
            return {ok: false, message: 'unknow error'};
        }
    }
}