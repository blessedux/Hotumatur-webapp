export interface ApiError {
    response?: {
        data: unknown;
    };
    message: string;
}