export type FollowUpPayload = {
    items: string[];
    createdAt: number
};
export type AgentQuestions = {
    text: string;
    createdAt: number;
    streamId?: string
};

export interface ClientToServerEvents {
    "followup:create": (
        payload: FollowUpPayload,
        ack: (response: { ok: boolean; message?: string }) => void
    ) => void;
    "agent:questions:replay": (since: string) => void;
}

export interface ServerToClientEvents {
    "agent:questions": (data: AgentQuestions) => void;
}
