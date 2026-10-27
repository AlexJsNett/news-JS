import { Callback, Endpoint, HttpMethod, QueryOptions, RequestParams } from '../../types';
import ResponseCache from '../../utils/cache';

const MINUTE_MS = 60 * 1000;

const CACHE_TTL_MS: Readonly<Record<Endpoint, number>> = {
    [Endpoint.Sources]: 60 * MINUTE_MS,
    [Endpoint.Everything]: 10 * MINUTE_MS,
};

class Loader {
    private readonly cache = new ResponseCache('news-cache:');

    constructor(
        private readonly baseLink: string,
        private readonly options: Readonly<Pick<QueryOptions, 'apiKey'>>
    ) {}

    protected getResp<T>(
        { endpoint, options = {} }: RequestParams,
        callback: Callback<T> = (): void => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load<T>(HttpMethod.Get, endpoint, callback, options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: Partial<QueryOptions>, endpoint: string): string {
        const urlOptions: Partial<QueryOptions> = { ...this.options, ...options };
        const params = new URLSearchParams();

        (Object.keys(urlOptions) as Array<keyof QueryOptions>).forEach((key) => {
            const value = urlOptions[key];
            if (value !== undefined) params.append(key, value);
        });

        return `${this.baseLink}${endpoint}?${params.toString()}`;
    }

    private makeCacheKey(options: Partial<QueryOptions>, endpoint: Endpoint): string {
        const { sources = '' } = options;

        return `${endpoint}?sources=${sources}`;
    }

    private load<T>(
        method: HttpMethod,
        endpoint: Endpoint,
        callback: Callback<T>,
        options: Partial<QueryOptions> = {}
    ): void {
        const cacheKey = this.makeCacheKey(options, endpoint);
        const cached = this.cache.get<T>(cacheKey, CACHE_TTL_MS[endpoint]);

        if (cached !== null) {
            callback(cached);
            return;
        }

        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res): Promise<T> => res.json())
            .then((data) => {
                this.cache.set(cacheKey, data);
                callback(data);
            })
            .catch((err) => console.error(err));
    }
}

export default Loader;
