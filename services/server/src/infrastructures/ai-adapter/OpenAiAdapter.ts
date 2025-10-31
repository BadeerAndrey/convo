import OpenAI from "openai";
import {AiAdapter, GenerateResult} from "./AiAdapter";

export class OpenAiAdapter implements AiAdapter {
    private client: OpenAI;
    private readonly systemPrompt: string;

    constructor(apiKey: string, systemPrompt: string ) {
        this.client = new OpenAI({ apiKey });
        this.systemPrompt = systemPrompt;
    }

    async generate(prompt:string): Promise<GenerateResult> {
        try {
            const response = await this.client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: this.systemPrompt },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
            });
            const text = response.choices[0].message?.content?.trim() ?? "";
            const parts= text
                .split(/\r?\n/)       // handle both \n and \r\n
                .map(q => q.trim())
                .filter(q => q.length > 0);
            return {ok: true, data: parts};
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                return {ok: false, error: error.message};
            }
            return {ok:false, error: "Unknown error occurred" };
        }
    }
}
