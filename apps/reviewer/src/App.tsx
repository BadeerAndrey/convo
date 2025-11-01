import { useState, useCallback } from 'react';
import { MicRecorder } from './components/MicRecorder';
import { TextInput } from './components/TextInput';
import { StatusBar } from './components/StatusBar';
import { useSocket } from './hooks/useSocket';
import { normalizeItems } from './utils/normalize';
import './App.css';
import {configs} from "./config.ts";


function App() {
    const [transcript, setTranscript] = useState('');
    const [manual, setManual] = useState('');

    const { emitItems, status,message,connected } = useSocket(configs.apiURL);

    const send = useCallback(
        (raw: string) => {
            const items = normalizeItems(raw);
            if (items.length === 0) return;
            setTranscript(raw);
            emitItems(items);
        },
        [emitItems]
    );

    return (
        <div className="app-container">
            <h1>Reviewer Input</h1>

            <MicRecorder onTranscript={send} disabled={!connected} />

            {transcript && (
                <div className="transcript">
                    <strong>Recognized:</strong> {transcript}
                </div>
            )}

            <StatusBar status={status} message={message} connected={connected}/>

            <TextInput
                disabled={!connected}
                value={manual}
                onChange={setManual}
                onSend={() => {
                    send(manual);
                    setManual('');
                }}
            />
        </div>
    );
}

export default App;