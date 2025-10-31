export const normalizeItems = (text: string): string[] => {
    return text
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
};