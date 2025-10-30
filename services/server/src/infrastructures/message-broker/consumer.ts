export interface MessageConsumer <T>{
    consume( handler: (messages: T) => Promise<void>): Promise<void>;
    stop(): Promise<void>;
}