export interface MessageProducer {
    send(
        topic: string,
        message: string,
    ): Promise<void>;
}