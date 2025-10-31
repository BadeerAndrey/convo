import OpenAI from "openai";
import {AiAdapter} from "./AiAdapter";

export class OpenAiAdapter implements AiAdapter {
    private client: OpenAI;
    private readonly systemPrompt: string;

    constructor(apiKey: string, systemPrompt: string ) {
        this.client = new OpenAI({ apiKey });
        this.systemPrompt = systemPrompt;
    }

    async generate(prompt:string): Promise<string[]> {
        const response = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: this.systemPrompt },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });

        const text =  response.choices[0].message?.content?.trim() ?? "";
        return text
            .split(/\r?\n/)       // handle both \n and \r\n
            .map(q => q.trim())
            .filter(q => q.length > 0);
    }
}
