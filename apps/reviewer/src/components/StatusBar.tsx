import React from 'react';
import './StatusBar.css';

type Props = {
    status: 'idle' | 'sending' | 'acknowledged' | 'rejected';
    message: string;
};

export const StatusBar: React.FC<Props> = ({ status,message }) => {
    if (status === 'idle') return null;

    return (
        <div className={`status ${status}`}>
            {status === 'sending' && 'Sending...'}
            {status === 'acknowledged' && 'Acknowledged!'}
            {status === 'rejected' && `Rejected: ${message}`}
        </div>
    );
};