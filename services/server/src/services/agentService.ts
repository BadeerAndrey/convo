import {AgentQuestions} from "shared";
import {StreamClient} from "../infrastructures/stream-client/StreamClient";

export class AgentService {
    private streamClient: StreamClient<AgentQuestions>;

    constructor(
        streamClient: StreamClient<AgentQuestions>
    ) {
        this.streamClient = streamClient;
    }

    async getQuestions(streamId?: string): Promise<AgentQuestions[]> {
        try {

            const items = await this.streamClient.read(streamId)
            return items.map(x => ({
                ...x.message,
                id: x.id,
            }));
        } catch (err) {
            console.log(err);
            return [];
        }
    }
}