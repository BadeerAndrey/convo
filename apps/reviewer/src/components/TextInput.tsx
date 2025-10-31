import React from 'react';
import './TextInput.css';

type Props = {
    value: string;
    onChange: (v: string) => void;
    onSend: () => void;
};

export const TextInput: React.FC<Props> = ({ value, onChange, onSend }) => {
    return (
        <div className="text-fallback">
      <textarea
          placeholder="Or type comma-separated items (apple, banana, cherry)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
      />
            <button onClick={onSend} className="send-btn">
                Send
            </button>
        </div>
    );
};