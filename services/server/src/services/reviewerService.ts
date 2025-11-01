import {MessageProducer} from "../infrastructures/message-broker/MessageProducer";
import {AgentQuestions, FollowUpPayload} from "shared";
import {StreamClient} from "../infrastructures/stream-client/StreamClient";
import {AiAdapter} from "../infrastructures/ai-adapter/AiAdapter";
import {RateLimiter} from "../infrastructures/gard/RateLimiter";
import {Deduplicator} from "../infrastructures/gard/Deduplicator";

export class ReviewerService {
    private producer: MessageProducer<AgentQuestions[]>;
    private questionsStreamClient: StreamClient<AgentQuestions>;
    private followupStreamClient: StreamClient<FollowUpPayload>;
    private aiAdapter: AiAdapter;
    private limiter: RateLimiter;
    private deduplicator: Deduplicator;

    constructor(
        producer: MessageProducer<AgentQuestions[]>,
        questionsStreamClient: StreamClient<AgentQuestions>,
        followupStreamClient: StreamClient<FollowUpPayload>,
        aiAdapter: AiAdapter,
        limiter: RateLimiter,
        deduplicator: Deduplicator
    ) {
        this.producer = producer;
        this.questionsStreamClient = questionsStreamClient;
        this.followupStreamClient = followupStreamClient;
        this.aiAdapter = aiAdapter;
        this.limiter = limiter;
        this.deduplicator = deduplicator;
    }

    async followUp(dto: FollowUpPayload) {

        try {
            if (!dto
                || !dto.items
                || !dto.items.length
                || dto.items.length > 8
                || dto.items.find(x=>!x || x.length === 0)
                || dto.items.reduce((sum, x) => sum + x.length, 0) > 300
            ) {
                return {ok: false, message: "invalid payload"};
            }

            if (!await this.limiter.allow("followUp")) {
                return {ok: false, message: "too many followup request"};
            }

            if (!await this.deduplicator.isUnique(dto.items)) {
                return {ok: false, message: "found duplicate request"};
            }
            await this.followupStreamClient.add(dto);

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
                reply.streamId = await this.questionsStreamClient.add(reply);
            }
            await this.producer.send(replies);
            return {ok: true};
        }catch (err){
            console.log(err);
            return {ok: false, message: 'unknow error'};
        }
    }
}