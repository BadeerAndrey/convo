import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type {AgentQuestions, ClientToServerEvents, ServerToClientEvents} from "../../../../packages/shared.ts";

const SOCKET_URL = 'http://localhost:3000';   // Socket.IO uses HTTP for handshake

export const useSocket = (onMessage: (msg: AgentQuestions) => void) => {
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const lastStreamId = useRef<string | null>(null);

    const connect = useCallback(() => {
        if (socketRef.current?.connected) return;

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setStatus('connected');

            // Ask the server for everything we missed
            if (lastStreamId.current) {
                socket.emit('agent:questions:replay', { since: lastStreamId.current });
            }
        });

        // -----------------------------------------------------------------
        //  Server → Client event (exact name from the spec)
        // -----------------------------------------------------------------
        socket.on('agent:questions', (payload: AgentQuestions) => {
            // payload already contains `streamId` from the backend
            lastStreamId.current = payload.streamId ?? lastStreamId.current;
            onMessage(payload);
        });

        socket.on('disconnect', () => {
            setStatus('disconnected');
        });

        socket.on('connect_error', () => {
            setStatus('disconnected');
        });
    }, []);

    // -----------------------------------------------------------------
    //  Lifecycle
    // -----------------------------------------------------------------
    useEffect(() => {
        connect();

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [connect]);

    return { status };
};