import { useRef } from 'react';

export const useSpeechSynthesis = () => {
    const speaking = useRef(false);
    const queue = useRef<string[]>([]);

    const speak = (text: string) => {
        if (speaking.current) {
            queue.current.push(text);
            return;
        }

        speaking.current = true;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onend = () => {
            speaking.current = false;
            if (queue.current.length > 0) {
                speak(queue.current.shift()!);
            }
        };

        speechSynthesis.speak(utterance);
    };

    return { speak };
};