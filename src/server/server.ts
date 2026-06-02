/**
 * © Ocado Group
 * Created on 13/12/2024 at 12:15:05(+00:00).
 *
 * A server for an app in a live environment.
 * Based off: https://github.com/bluwy/create-vite-extra/blob/master/template-ssr-react-ts/server.js
 */

import { Cache, type CacheClass } from "memory-cache"
import { type UUID, randomUUID } from "node:crypto"
import express, { type Express, type Request, type Response } from "express"
import fs from "node:fs/promises"
import http from "node:http"

type Mode = "development" | "staging" | "production"
type Options = Partial<{
  mode: Mode
  port: number
  base: string
}>

type HealthStatus =
  | "healthy"
  | "startingUp"
  | "shuttingDown"
  | "unhealthy"
  | "unknown"
type HealthCheck = {
  healthStatus: HealthStatus
  additionalInfo: string
  details?: Array<{
    name: string
    description: string
    health: HealthStatus
  }>
}
type HealthCheckResponse = {
  appId: string
  healthStatus: HealthStatus
  lastCheckedTimestamp: string
  additionalInformation: string
  startupTimestamp: string
  appVersion: string
  details: Array<{
    name: string
    description: string
    health: HealthStatus
  }>
}

type Render = (path: string) => Promise<{ head?: string; html?: string }>
type EntryModule = { render: Render }
type RenderAndTemplate = [Render, string]
type GetRenderAndTemplate = (path: string) => Promise<RenderAndTemplate>
type OnServeError = (error: Error) => string | undefined

type Setup = {
  getRenderAndTemplate: GetRenderAndTemplate
  onServeError: OnServeError
}

export default class Server {
  envIsProduction: boolean
  templateHtml: string
  hostname: string
  configFile: string
  mode: Mode
  port: number
  base: string
  app: Express
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  cache: CacheClass<string, any>
  healthCheckCacheKey: string
  healthCheckCacheTimeout: number
  healthCheckStatusCodes: Record<HealthStatus, number>
  devtoolsWorkspaceUUID: UUID

  constructor({ mode, port, base }: Options = {}) {
    this.envIsProduction = process.env.NODE_ENV === "production"
    this.templateHtml = ""
    this.hostname = this.envIsProduction ? "0.0.0.0" : "127.0.0.1"

    this.configFile = "./vite.config.ts"
    this.mode = mode || (process.env.MODE as Mode) || "development"
    this.port =
      port ||
      (process.env.PORT
        ? Number(process.env.PORT)
        : this.envIsProduction
          ? 8080
          : 5173)
    this.base = base || process.env.BASE || ""

    this.app = express()
    this.server = http.createServer(this.app)
    this.cache = new Cache()

    this.healthCheckCacheKey = "health-check"
    this.healthCheckCacheTimeout = 30000
    this.healthCheckStatusCodes = {
      // The app is running normally.
      healthy: 200,
      // The app is performing app-specific initialisation which must
      // complete before it will serve normal application requests
      // (perhaps the app is warming a cache or something similar). You
      // only need to use this status if your app will be in a start-up
      // mode for a prolonged period of time.
      startingUp: 503,
      // The app is shutting down. As with startingUp, you only need to
      // use this status if your app takes a prolonged amount of time
      // to shutdown, perhaps because it waits for a long-running
      // process to complete before shutting down.
      shuttingDown: 503,
      // The app is not running normally.
      unhealthy: 503,
      // The app is not able to report its own state.
      unknown: 503,
    }

    this.devtoolsWorkspaceUUID = randomUUID()
  }

  // @ts-expect-error unused var
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHealthCheck(request: Request): HealthCheck {
    return {
      healthStatus: "healthy",
      additionalInfo: "All healthy.",
    }
  }

  handleHealthCheck(request: Request, response: Response): void {
    let value: HealthCheckResponse = this.cache.get(
      this.healthCheckCacheKey,
    ) as HealthCheckResponse
    if (value === null) {
      const healthCheck = this.getHealthCheck(request)

      if (healthCheck.healthStatus !== "healthy") {
        console.warn(`health check: ${JSON.stringify(healthCheck)}`)
      }

      value = {
        appId: process.env.APP_ID || "REPLACE_ME",
        healthStatus: healthCheck.healthStatus,
        lastCheckedTimestamp: new Date().toISOString(),
        additionalInformation: healthCheck.additionalInfo,
        startupTimestamp: new Date().toISOString(),
        appVersion: process.env.APP_VERSION || "REPLACE_ME",
        details: healthCheck.details || [],
      }

      this.cache.put(
        this.healthCheckCacheKey,
        value,
        this.healthCheckCacheTimeout,
      )
    }

    response.status(this.healthCheckStatusCodes[value.healthStatus]).json(value)
  }

  async handleServeHtml(
    request: Request,
    response: Response,
    { getRenderAndTemplate, onServeError }: Setup,
  ): Promise<void> {
    try {
      const path = request.originalUrl.replace(this.base, "")

      const [render, template] = await getRenderAndTemplate(path)

      const rendered = await render(path)

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? "")
        .replace(`<!--app-html-->`, rendered.html ?? "")

      response.status(200).set({ "Content-Type": "text/html" }).send(html)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.stack)
        const body = onServeError(error)
        response.status(500).end(body)
      }
    }
  }

  // @ts-expect-error unused var
  handleChromeDevTools(request: Request, response: Response) {
    if (this.envIsProduction) {
      response.status(404).json({})
    } else {
      const localWorkspacePath = process.env.LOCAL_WORKSPACE_PATH

      let code: number
      let body: object
      if (localWorkspacePath) {
        code = 200
        body = {
          workspace: {
            uuid: this.devtoolsWorkspaceUUID,
            root: localWorkspacePath,
          },
        }
      } else {
        code = 404
        body = { error: "Local workspace path not configured." }
      }

      response.status(code).json(body)
    }
  }

  async setUpProduction(): Promise<Setup> {
    const compression = (await import("compression")).default
    const sirv = (await import("sirv")).default

    this.templateHtml = await fs.readFile("./dist/client/index.html", "utf-8")

    this.app.use(compression())
    this.app.use(this.base, sirv("./dist/client", { extensions: [] }))

    return {
      getRenderAndTemplate: async () => {
        const render = (
          (await import(
            // @ts-expect-error only present after building installing app.
            "../../../../dist/server/entry-server.js"
          )) as EntryModule
        ).render

        // Use cached template.
        const template = this.templateHtml

        return [render, template]
      },
      onServeError: () => undefined,
    }
  }

  async setUpDevelopment(): Promise<Setup> {
    const { createServer } = await import("vite")

    // Check if service has its own config, else fall back to workspace config.
    try {
      await fs.stat(this.configFile)
    } catch {
      this.configFile = "/workspace/frontend/vite.config.ts"
    }

    const vite = await createServer({
      configFile: this.configFile,
      server: {
        middlewareMode: true,
        hmr: { server: this.server },
      },
      appType: "custom",
      base: this.base,
      mode: this.mode,
    })

    this.app.use(vite.middlewares)

    return {
      getRenderAndTemplate: async path => {
        const render = (
          (await vite.ssrLoadModule("/src/entry-server.tsx")) as EntryModule
        ).render

        // Always read fresh template.
        let template = await fs.readFile("./index.html", "utf-8")
        template = await vite.transformIndexHtml(path, template)

        return [render, template]
      },
      onServeError: error => {
        vite.ssrFixStacktrace(error)
        return error.stack
      },
    }
  }

  async run() {
    const setup = this.envIsProduction
      ? await this.setUpProduction()
      : await this.setUpDevelopment()

    this.app.get("/health-check", (request, response) => {
      this.handleHealthCheck(request, response)
    })

    this.app.get(
      "/.well-known/appspecific/com.chrome.devtools.json",
      (request, response) => {
        this.handleChromeDevTools(request, response)
      },
    )

    this.app.get("*", async (request, response) => {
      await this.handleServeHtml(request, response, setup)
    })

    this.server.listen(this.port, this.hostname, () => {
      let startMessage =
        "Server started.\n" +
        `url: http://${this.hostname}:${this.port}\n` +
        `environment: ${process.env.NODE_ENV}\n`

      if (!this.envIsProduction) {
        startMessage +=
          `mode: ${this.mode}\n` + `config file: ${this.configFile}\n`
      }

      console.log(startMessage)
    })
  }
}
