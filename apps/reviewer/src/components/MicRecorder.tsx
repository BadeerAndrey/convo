import React, { useRef, useState, useEffect } from 'react';
import './MicRecorder.css';

type Props = {
    onTranscript: (text: string) => void;
};

export const MicRecorder: React.FC<Props> = ({ onTranscript }) => {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Initialise SpeechRecognition once
    useEffect(() => {
        console.log('Recognition ref', recognitionRef.current);
        const API =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!API) {
            console.warn('SpeechRecognition not supported');
            return;
        }

        const rec = new API();
        rec.lang = 'en-US';
        rec.continuous = false;
        rec.interimResults = false;

        rec.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            onTranscript(transcript);
        };
        rec.onerror = (e: any) => {
            console.error('Speech error', e.error);
            setIsRecording(false);
        };
        rec.onend = () => setIsRecording(false);

        recognitionRef.current = rec;
    }, [onTranscript]);

    const start = () => {
        recognitionRef.current?.start();
        setIsRecording(true);
    };
    const stop = () => {
        recognitionRef.current?.stop();
        setIsRecording(false);
    };

    return (
        <div className="mic-section">
            <button
                className={`mic-btn ${isRecording ? 'recording' : ''}`}
                onMouseDown={start}
                onMouseUp={stop}
                onMouseLeave={stop}
            >
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3z" />
                    <path d="M19 11v1a7 7 0 01-14 0v-1" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
            </button>
            <p className="mic-label">{isRecording ? 'Recording...' : 'Hold to speak'}</p>
        </div>
    );
};