import { useRef } from 'react';

export const useSpeechSynthesis = () => {
    const speaking = useRef(false);
    const queue = useRef<string[]>([]);

    const speak = (text: string) => {
        console.log("before", speaking.current, text);
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

        utterance.onerror = (e) => {
            console.error("speech error", e);
            speaking.current = false;
            queue.current = [];
        }

        speechSynthesis.onvoiceschanged = () => {
            speechSynthesis.getVoices();
        };
        speechSynthesis.speak(utterance);
    };

    return { speak };
};