// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Disable SSR for Vercel deployment to avoid module resolution issues
    ssr: false,
  },
  nitro: {
    preset: "vercel",
    // Static site generation mode
    static: true,
    compressPublicAssets: true,
    // Bundle all dependencies inline
    moduleSideEffects: true,
    externals: {
      inline: true,
    },
    rollupConfig: {
      output: {
        format: "esm",
        inlineDynamicImports: false,
      },
    },
    // Ensure all routes are pre-rendered
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/login',
        '/expenses',
        '/income',
        '/budgets',
        '/savings',
        '/reports',
        '/predictions',
        '/settings',
        '/pricing',
        '/premium',
        '/reset-password',
        '/health',
      ],
    },
  },
  vite: {
    ssr: {
      // Prevent SSR issues with these packages
      noExternal: ['@radix-ui/*', '@supabase/supabase-js'],
    },
    build: {
      // Target modern browsers for better compatibility
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: {
            'radix-ui': [
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-dialog',
              '@radix-ui/react-select',
              '@radix-ui/react-dropdown-menu',
            ],
            'supabase': ['@supabase/supabase-js'],
            'charts': ['recharts'],
          },
        },
      },
    },
  },
});
