export type Required<T, K extends keyof T> = {
    [P in K]-?: T[P];
};
export type Optional<T, K extends keyof T> = Partial<Pick<T, K>>;
export type OptionalPropertyNames<T> = {
    [K in keyof T]-?: {} extends {
        [P in K]: T[K];
    } ? K : never;
}[keyof T];
export type IsOptional<T, K extends keyof T> = K extends OptionalPropertyNames<T> ? true : false;
export declare function openInNewTab(url: string, target?: string): void;
export declare function wrap(newFn: {
    before?: (...args: any[]) => void;
    after?: (...args: any[]) => void;
}, fn?: (...args: any[]) => any): (...args: any[]) => any;
export declare function snakeCaseToCamelCase(obj: Record<string, any>): void;
export declare function camelCaseToSnakeCase(obj: Record<string, any>): void;
export declare const MIN_DATE: Date;
export declare function generateSecureRandomString(length: number, charSet?: string): string;
