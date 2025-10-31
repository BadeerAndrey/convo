import { useEffect } from 'react';

type Props = {
    status: string;
};

export default function ReconnectHandler({ status }: Props) {
    useEffect(() => {
        if (status === 'disconnected') {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    if (status !== 'disconnected') return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'red',
            color: 'white',
            padding: '8px',
            textAlign: 'center',
            fontSize: '0.9rem',
        }}>
            Connection lost. Reconnecting in 5s...
        </div>
    );
}