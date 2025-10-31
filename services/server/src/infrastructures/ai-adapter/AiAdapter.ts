export interface AiAdapter {
    generate(question: string): Promise<string[]>;
}