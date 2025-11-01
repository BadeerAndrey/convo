import {useEffect, useRef, useCallback, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import type {ClientToServerEvents, ServerToClientEvents} from "shared";

type Status = 'idle' | 'sending' | 'acknowledged' | 'rejected';

export const useSocket = (
    url: string,
): {
    socket: Socket | null;
    emitItems: (items: string[]) => void;
    status: Status;
    message: string;
    connected: boolean;
    setStatus: React.Dispatch<React.SetStateAction<Status>>;
} => {
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState<string>('');
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = io(
            url,
            {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 2000,
            },
        );
        console.log('created a new socket', socket);

        socket.on('connect', () => {
            console.log('Socket.IO connected', socket.id)
            setConnected(true);
        });
        socket.on('connect_error', (err) => {
            setConnected(false);
            console.error('Socket.IO error', err)
        });
        socketRef.current = socket;
        return () => {
            socket.disconnect();
        };
    }, [url]);

    const emitItems = useCallback(
        (items: string[]) => {
            if (!socketRef.current) return;
            setStatus('sending');
            socketRef.current.emit('followup:create',
                {
                    items,
                    createdAt: Date.now(),
                },
                (res)=>{
                    if (res.ok){
                        setStatus('acknowledged');
                    }else {
                        setStatus("rejected" );
                        setMessage(res.message??'')
                    }
                })
        },
        []
    );

    return {socket: socketRef.current, emitItems, connected: connected, status,message, setStatus};
};