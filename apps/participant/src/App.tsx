// src/App.tsx
import { useState,  } from 'react';
import { useSocket } from './hooks/useSocket.ts';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import ChatFeed from './components/ChatFeed';
import ConnectionStatus from './components/ConnectionStatus';
import ReconnectHandler from './components/ReconnectHandler';
import './App.css';
import type {AgentQuestions} from "../../../packages/shared.ts";

function App() {
    const [messages, setMessages] = useState<AgentQuestions[]>([]);
    const { speak } = useSpeechSynthesis();

    const handleMessage = (msg: AgentQuestions) => {
        setMessages((prev) => [...prev, msg]);
        speak(msg.text);
    };

    const { status } = useSocket(handleMessage);

    return (
        <div className="app">
            <ReconnectHandler status={status} />
            <header>
                <h1>Participant</h1>
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