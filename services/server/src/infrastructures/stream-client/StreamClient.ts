export interface StreamClient<T> {
    add(message: T): Promise<string>;
    read(lastId: string): Promise<{ id: string; message: T }[]>;
    disconnect(): Promise<void>;
}