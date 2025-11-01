import type {AgentQuestions} from "shared";

type Props = {
    message: AgentQuestions;
};

export default function MessageItem({ message }: Props) {
    return (
        <div
            style={{
                padding: '12px',
                margin: '8px 0',
                background: '#f0f0f0',
                borderRadius: '8px',
                maxWidth: '80%',
                alignSelf: 'flex-start',
            }}
        >
            <p style={{ margin: 0, fontSize: '1rem' }}>{message.text}</p>
            <small style={{ color: '#666', fontSize: '0.75rem' }}>
                {new Date(message.createdAt).toLocaleTimeString()}
            </small>
        </div>
    );
}