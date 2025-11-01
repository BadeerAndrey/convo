import React from 'react';
import './TextInput.css';

type Props = {
    value: string;
    onChange: (v: string) => void;
    onSend: () => void;
    disabled: boolean;
};

export const TextInput: React.FC<Props> = ({ value, onChange, onSend,disabled }) => {
    return (
        <div className="text-fallback">
      <textarea
          disabled={disabled}
          placeholder="Or type comma-separated items (apple, banana, cherry)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
      />
            <button onClick={onSend} className="send-btn" disabled={disabled}>
                Send
            </button>
        </div>
    );
};