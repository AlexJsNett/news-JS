interface CacheEntry<T> {
    data: T;
    savedAt: number;
}

function isCacheEntry(value: unknown): value is CacheEntry<unknown> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'data' in value &&
        'savedAt' in value &&
        typeof value.savedAt === 'number'
    );
}

export default class ResponseCache {
    private readonly memory = new Map<string, CacheEntry<unknown>>();

    constructor(private readonly prefix: string) {}

    public get<T>(key: string, ttlMs: number): T | null {
        const entry = this.memory.get(key) ?? this.readStorage(key);

        if (!entry || Date.now() - entry.savedAt > ttlMs) return null;

        this.memory.set(key, entry);
        return entry.data as T;
    }

    public set<T>(key: string, data: T): void {
        const entry: CacheEntry<T> = { data, savedAt: Date.now() };

        this.memory.set(key, entry);
        this.writeStorage(key, entry);
    }

    private readStorage(key: string): CacheEntry<unknown> | null {
        try {
            const raw = sessionStorage.getItem(this.prefix + key);
            const parsed: unknown = raw ? JSON.parse(raw) : null;

            return isCacheEntry(parsed) ? parsed : null;
        } catch {
            return null;
        }
    }

    private writeStorage<T>(key: string, entry: CacheEntry<T>): void {
        try {
            sessionStorage.setItem(this.prefix + key, JSON.stringify(entry));
        } catch {
            // storage is full or unavailable, memory cache still works
        }
    }
}
