export type RequestHandler = (req: Request) => Request | undefined;
export type ResponseHandler = (res: Response) => Response | undefined;

export interface FetchClientOptions {
    url?: string;
    requestHandlers?: RequestHandler[];
    responseHandlers?: ResponseHandler[];
}

export interface FetchAspectOptions extends FetchClientOptions {
    fetchAdapter: typeof fetch;
    url: string;
}

export interface FetchEndpointOptions extends FetchClientOptions {}
