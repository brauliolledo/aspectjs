export type RequestHandler = (req: Request) => Request | undefined;
export type ResponseHandler = (res: Response) => Response | undefined;

export type FetchClientInit = string | (RequestInit & { url?: string });
export type FetchEndpointInit = FetchClientInit;

export interface FetchAspectOptions extends Request {
    fetchAdapter: typeof fetch;
    url: string;
    requestHandlers?: RequestHandler[];
    responseHandlers?: ResponseHandler[];
}
