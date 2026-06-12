import * as path from "path"
import { type PluginOption, defineConfig } from "vite"
import {
  viteConfig as workspaceViteConfig,
  vitestConfig as workspaceVitestConfig,
} from "@codeforlife/workspace/vite.config.ts"
import { builtinModules } from "node:module"
import dts from "vite-plugin-dts"
import { mergeConfig } from "vitest/config"

import packageJson from "./package.json"
import workspacePackageJson from "./node_modules/@codeforlife/workspace/package.json"

function generateEntries(...indexDirs: string[]) {
  return Object.fromEntries(
    indexDirs.reduce(
      (entries, entry) => {
        const match = entry.match(/^(.+)\.tsx?$/)
        if (!match) throw Error("Entry needs to end with '.ts' or '.tsx'.")

        entries.push([match[1], path.resolve(__dirname, `src/${entry}`)])

        return entries
      },
      [] as [string, string][],
    ),
  )
}

function generateExternalDependencies(
  ignore: string[],
  ...dependencies: Array<Record<string, string> | undefined>
) {
  return dependencies.reduce(
    (keys, dependencies) => {
      for (const dependency of Object.keys(dependencies || {})) {
        if (ignore.includes(dependency)) continue

        // Add the dependency (e.g. "react")
        keys.push(dependency)
        // Add all subpaths of the dependency (e.g. "react/jsx-runtime")
        // eslint-disable-next-line no-useless-escape
        keys.push(new RegExp(`^${dependency}\/.*`))
      }

      return keys
    },
    [] as Array<string | RegExp>,
  )
}

const viteConfig = defineConfig({
  plugins: [
    ...(workspaceViteConfig.plugins as PluginOption[]),
    // https://www.npmjs.com/package/vite-plugin-dts
    dts({
      // Generates the corresponding .d.ts files in the build directory.
      insertTypesEntry: true,
      // Transforms dynamic imports to static (helps with tree-shaking). For
      // example, `import('@mui/material').Button` is transformed to
      // `import { Button } from "@mui/material"`.
      staticImport: true,
      // Generates TypeScript declaration files (.d.ts) for each source file.
      // There is a known issue of vite-plugin-dts not performing deep analysis
      // of exports and therefore not correctly rolling up types into one file.
      rollupTypes: false,
      // Provide path to client-side TypeScript configuration.
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    // Informs Vite we are building a library.
    lib: {
      entry: generateEntries(
        "index.ts",
        "api/index.ts",
        "api/endpoints/index.ts",
        "components/index.ts",
        "components/form/index.ts",
        "components/page/index.ts",
        "components/router/index.ts",
        "components/table/index.ts",
        "features/index.ts",
        "hooks/index.ts",
        "middlewares/index.ts",
        "server/App.tsx",
        "server/DefaultRoutes.tsx",
        "server/entry/index.ts",
        "server/entry/client.tsx",
        "server/entry/server.tsx",
        "server/server.ts",
        "slices/index.ts",
        "theme/index.ts",
        "theme/components/index.ts",
        "utils/api.tsx",
        "utils/auth.ts",
        "utils/cookies.ts",
        "utils/form.ts",
        "utils/general.ts",
        "utils/location.ts",
        "utils/object.ts",
        "utils/router.ts",
        "utils/schema.ts",
        "utils/settings.ts",
        "utils/store.ts",
        "utils/test.tsx",
        "utils/theme.tsx",
        "utils/window.ts",
      ),
      name: packageJson.name,
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      cssFileName: "style",
      formats: [
        // ES Modules are the official, standardized module system for
        // JavaScript. They use import and export statements, which are a part
        // of the ECMAScript standard and are supported natively by all modern
        // browsers and recent versions of Node.js.
        "es",
        // CommonJS is the module system used by Node.js. It's a synchronous
        // system designed for server-side development, where files are loaded
        // from the local disk.
        "cjs",
      ],
    },
    rollupOptions: {
      // Tells Rollup which packages should not be bundled in. Why is this
      // important?
      // - Reduces bundle size: Your package will be much smaller if it doesn't
      //  include the entire code for MUI, React, etc.
      // - Efficient caching: The user's browser may already have these common
      //  libraries cached, so not bundling them saves download time.
      external: [
        ...generateExternalDependencies(
          ["dayjs"],
          packageJson.dependencies,
          packageJson.devDependencies,
          workspacePackageJson.dependencies,
        ),
        // Make sure to externalize Node.js built-in modules.
        // It's a good practice to handle both 'fs' and 'node:fs' syntax.
        ...builtinModules.map(m => `node:${m}`),
        ...builtinModules,
        /^\.\/dist\/.*/, // this package's dist files
        /^(\.\.\/){3,}dist\/.*/, // a service's dist files
      ],
    },
    // Vite will output both your built .js file and a corresponding .js.map
    // file. When you install this package in your application and open your
    // browser's developer tools, the tools will automatically detect the source
    // map and show you your original, un-minified code in the "Sources" or
    // "Debugger" panel. This lets you set breakpoints, inspect variables, and
    // step through your code just as if you were working with the original
    // files.
    sourcemap: true,
    // Empty the output directory before writing the build to it.
    emptyOutDir: true,
    // Ensure output directory is "dist".
    outDir: "dist",
  },
})

export default mergeConfig(viteConfig, workspaceVitestConfig)
