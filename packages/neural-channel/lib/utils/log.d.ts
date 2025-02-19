export interface Logger {
    info: (message: string) => void;
    error: (message: string) => void;
    warn: (message: string) => void;
}
export declare function logger(module: string, enable?: boolean): Logger;
