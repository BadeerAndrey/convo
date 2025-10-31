import type {ReactNode} from 'react';

type Props = {
    status: 'connecting' | 'connected' | 'disconnected';
};

const statusConfig: Record<Props['status'], { color: string; label: ReactNode }> = {
    connecting: { color: 'orange', label: 'Connecting...' },
    connected: { color: 'green', label: 'Ready' },
    disconnected: { color: 'red', label: 'Disconnected' },
};

export default function ConnectionStatus({ status }: Props) {
    const { color, label } = statusConfig[status];

    return (
        <div style={{ color, fontWeight: 'bold', marginBottom: '1rem' }}>
            Status: {label}
        </div>
    );
}