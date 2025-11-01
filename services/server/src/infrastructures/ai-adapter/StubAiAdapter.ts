import {AiAdapter, GenerateResult} from "./AiAdapter";

export class StubAiAdapter implements AiAdapter {
    async generate(prompt:string): Promise<GenerateResult> {
        return {ok:true,data:[prompt]}
    }
}