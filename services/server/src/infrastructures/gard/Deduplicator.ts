export interface Deduplicator {
    /** Returns true if this is a new payload, false if duplicate */
    isUnique(key: string| string[]): Promise<boolean>;
    disconnect(): Promise<void>;
}