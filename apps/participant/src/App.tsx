import {useEffect, useRef, useState,} from 'react';
import { useSocket } from './hooks/useSocket.ts';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import ChatFeed from './components/ChatFeed';
import ConnectionStatus from './components/ConnectionStatus';
import ReconnectHandler from './components/ReconnectHandler';
import './App.css';
import type {AgentQuestions} from "shared";
import {configs} from "./config.ts";

function App() {
    const [messages, setMessages] = useState<AgentQuestions[]>([]);
    const [muted, setMuted] = useState(true);
    const mutedRef = useRef(muted);
    useEffect(() => {
        mutedRef.current = muted;
    }, [muted]);

    const { speak } = useSpeechSynthesis();

    const handleMessage = (msg: AgentQuestions) => {
        setMessages((prev) => [...prev, msg]);
        if (!mutedRef.current) {
            speak(msg.text);
        }
    };

    const { status } = useSocket(configs.apiURL, handleMessage);
    return (
        <div className="app">
            <ReconnectHandler status={status} />
            <header>
                <h1>Participant</h1>
                <button onClick={()=>setMuted(x=>!x)}> {muted?'Unmute':'Mute'}</button>
                <ConnectionStatus status={status} />
            </header>

            <main>
                <ChatFeed messages={messages} />
            </main>

            <footer>
                <p><small>Listening for clarifying questions...</small></p>
            </footer>
        </div>
    );
}

export default App;