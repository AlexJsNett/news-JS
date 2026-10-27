import { Callback, HttpMethod, QueryOptions, RequestParams } from '../../types';

class Loader {
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

    private load<T>(
        method: HttpMethod,
        endpoint: string,
        callback: Callback<T>,
        options: Partial<QueryOptions> = {}
    ): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res): Promise<T> => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;
