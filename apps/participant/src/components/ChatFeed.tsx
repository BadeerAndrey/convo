import MessageItem from './MessageItem';
import type {AgentQuestions} from "../../../../packages/shared/src";

type Props = {
    messages: AgentQuestions[];
};

export default function ChatFeed({ messages }: Props) {
    return (
        <div
            style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
            }}
        >
            {messages.length === 0 ? (
                <p style={{ color: '#999', fontStyle: 'italic' }}>
                    Waiting for clarifying questions...
                </p>
            ) : (
                messages.map((msg, i) => <MessageItem key={i} message={msg} />)
            )}
        </div>
    );
}