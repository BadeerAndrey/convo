import React from 'react';
import './StatusBar.css';

type Props = {
    status: 'idle' | 'sending' | 'acknowledged' | 'rejected';
    message: string;
    connected:boolean;
};

export const StatusBar: React.FC<Props> = ({connected, status,message }) => {
    return (
        <div className={`status ${status}`}>
            {connected? 'Connected!' : 'Connect Error!'}
            {' '}
            {status === 'sending' && 'Sending...'}
            {status === 'acknowledged' && 'Acknowledged!'}
            {status === 'rejected' && `Rejected: ${message}`}
        </div>
    );
};