import {MessageProducer} from "../infrastructures/message-broker/producer";
import {AgentQuestions, FollowUpPayload} from "../packages/shared";

export class ReviewerService {
    private producer: MessageProducer<AgentQuestions[]>;
    constructor(producer: MessageProducer<AgentQuestions[]>) {
        this.producer = producer;
    }

    async followUp(dto:FollowUpPayload) {
        console.log('Review service Received:', dto.items);
        const  replies = dto.items.map(x=>({
            text : x,
            createdAt: Date.now(),
        }));
        await this.producer.send(replies);
    }
}