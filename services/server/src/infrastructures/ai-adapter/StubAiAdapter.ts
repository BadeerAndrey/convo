import {AiAdapter, GenerateResult} from "./AiAdapter";

export class StubAiAdapter implements AiAdapter {
    async generate(prompt:string): Promise<GenerateResult> {
        console.log(`Stub Ai Adapter Generate result: ${prompt}`);
        return {ok:true,data:[prompt]}
    }
}