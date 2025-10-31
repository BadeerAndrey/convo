import {AiAdapter} from "./AiAdapter";

export class StubAiAdapter implements AiAdapter {
    async generate(prompt:string): Promise<string[]> {
        return [prompt]
    }
}
