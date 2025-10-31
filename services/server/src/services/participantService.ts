import {AgentQuestions} from "../packages/shared";
import {MessageConsumer} from "../infrastructures/message-broker/MessageConsumer";

export class ParticipantService {
    private consumer: MessageConsumer<AgentQuestions[]>;
    constructor(consumer: MessageConsumer<AgentQuestions[]>) {
        this.consumer = consumer;
    }

    async consume(handler: (message :AgentQuestions[])=>Promise<void>){
       await this.consumer.consume(async messages =>{
           await handler(messages);
       })
    }
}