import { useState, useCallback } from 'react';
import { MicRecorder } from './components/MicRecorder';
import { TextInput } from './components/TextInput';
import { StatusBar } from './components/StatusBar';
import { useSocket } from './hooks/useSocket';
import { normalizeItems } from './utils/normalize';
import './App.css';

const SOCKET_URL = 'http://localhost:3000'; // ← change if needed

function App() {
    const [transcript, setTranscript] = useState('');
    const [manual, setManual] = useState('');

    const { emitItems, status,message } = useSocket(SOCKET_URL);

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

            <MicRecorder onTranscript={send} />

            {transcript && (
                <div className="transcript">
                    <strong>Recognized:</strong> {transcript}
                </div>
            )}

            <StatusBar status={status} message={message} />

            <TextInput
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