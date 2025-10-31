export type GenerateResult =
    | { ok: true; data: string[] }
    | { ok: false; error: string };

export interface AiAdapter {
    generate(question: string): Promise<GenerateResult>;
}