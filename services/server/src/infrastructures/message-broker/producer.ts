export interface MessageProducer<T> {
    send( messages: T): Promise<void>;
    disconnect(): Promise<void>;
}