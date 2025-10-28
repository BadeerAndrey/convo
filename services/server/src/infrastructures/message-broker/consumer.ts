export interface MessageConsumer {
    consume(
        topic: string,
        handler: (message: string) => Promise<void>,
    ): Promise<void>;

    stop(): Promise<void>;
}