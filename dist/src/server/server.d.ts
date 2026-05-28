import { CacheClass } from 'memory-cache';
import { UUID } from 'node:crypto';
import { Express, Request, Response } from 'express';
import { default as http } from 'node:http';
type Mode = "development" | "staging" | "production";
type Options = Partial<{
    mode: Mode;
    port: number;
    base: string;
}>;
type HealthStatus = "healthy" | "startingUp" | "shuttingDown" | "unhealthy" | "unknown";
type HealthCheck = {
    healthStatus: HealthStatus;
    additionalInfo: string;
    details?: Array<{
        name: string;
        description: string;
        health: HealthStatus;
    }>;
};
type Render = (path: string) => Promise<{
    head?: string;
    html?: string;
}>;
type RenderAndTemplate = [Render, string];
type GetRenderAndTemplate = (path: string) => Promise<RenderAndTemplate>;
type OnServeError = (error: Error) => string | undefined;
type Setup = {
    getRenderAndTemplate: GetRenderAndTemplate;
    onServeError: OnServeError;
};
export default class Server {
    envIsProduction: boolean;
    templateHtml: string;
    hostname: string;
    configFile: string;
    mode: Mode;
    port: number;
    base: string;
    app: Express;
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    cache: CacheClass<string, any>;
    healthCheckCacheKey: string;
    healthCheckCacheTimeout: number;
    healthCheckStatusCodes: Record<HealthStatus, number>;
    devtoolsWorkspaceUUID: UUID;
    constructor({ mode, port, base }?: Options);
    getHealthCheck(request: Request): HealthCheck;
    handleHealthCheck(request: Request, response: Response): void;
    handleServeHtml(request: Request, response: Response, { getRenderAndTemplate, onServeError }: Setup): Promise<void>;
    handleChromeDevTools(request: Request, response: Response): void;
    setUpProduction(): Promise<Setup>;
    setUpDevelopment(): Promise<Setup>;
    run(): Promise<void>;
}
export {};
