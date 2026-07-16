// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
    // Force ALL external dependencies to be bundled inline
    externals: {
      inline: true,
      // Also explicitly list problematic packages
      traceInclude: [
        'tslib',
        '@radix-ui/**',
      ],
    },
    // Ensure side effects are preserved during bundling
    moduleSideEffects: true,
    rollupConfig: {
      output: {
        format: "esm",
      },
      // Bundle everything, including node_modules
      external: [],
    },
  },
});
