import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    // Ensure proper module resolution for TypeScript files
    preserveSymlinks: false,
    mainFields: ["browser", "module", "main"],
    conditions: ["browser", "module", "import", "default"],
  },
  define: {
    // Global constants for performance
    __DEV__: process.env.NODE_ENV === "development",
    __PROD__: process.env.NODE_ENV === "production",
    // SEO and analytics
    __SITE_URL__: JSON.stringify(
      process.env.VITE_SITE_URL || "https://quantumvest.com",
    ),
    __ANALYTICS_ID__: JSON.stringify(process.env.VITE_ANALYTICS_ID || "GA_ID"),
    // Fix for Supabase browser compatibility
    global: "globalThis",
    "process.env": "{}",
    process: JSON.stringify({ env: {} }),
  },
  build: {
    target: "es2015",
    minify: "terser",
    sourcemap: process.env.GENERATE_SOURCEMAP !== "false",
    chunkSizeWarningLimit: 1000,
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          "vendor-charts": ["recharts"],
          "vendor-forms": ["@hookform/resolvers", "react-hook-form"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-icons": ["lucide-react"],

          // Feature chunks
          auth: [
            "./src/components/auth/AuthProvider",
            "./src/components/auth/LoginModal",
            "./src/components/EnterpriseSecurityProvider",
            "./src/services/enterpriseAuthService",
          ],
          analytics: [
            "./src/components/EnterpriseOperationalDashboard",
            "./src/components/UserInteractionDashboard",
            "./src/services/interactiveAnalyticsService",
            "./src/services/userInteractionService",
          ],
          payments: [
            "./src/components/PaymentProcessor",
            "./src/components/PaymentDashboard",
            "./src/services/enterprisePaymentService",
          ],
          security: [
            "./src/components/SecurityDashboard",
            "./src/services/ciscoXDRService",
          ],
          seo: ["./src/services/seoTrafficService", "./src/components/SEOHead"],
          services: [
            "./src/services/concurrentDataProcessor",
            "./src/services/enterpriseAPIGateway",
            "./src/services/globalLanguageService",
            "./src/services/localizationService",
          ],
        },
        // Generate better chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split("/")
                .pop()
                ?.replace(".tsx", "")
                .replace(".ts", "")
            : "chunk";
          return `assets/${facadeModuleId}-[hash].js`;
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.trace",
        ],
      },
      mangle: {
        safari10: true,
      },
      format: {
        safari10: true,
      },
    },
  },
  server: {
    port: 3001,
    host: true,
    cors: true,
    strictPort: false,
    hmr: {
      port: 3002,
      overlay: false, // Disable overlay to prevent blocking
    },
    // Enhanced module resolution
    fs: {
      strict: false,
      allow: [".."],
    },
    watch: {
      usePolling: false,
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
    // Improve loading performance
    warmup: {
      clientFiles: [
        "./src/App.tsx",
        "./src/components/PlatformNavigation.tsx",
        "./src/pages/Index.tsx",
      ],
    },
    // Removed proxy configuration since we don't have a separate API server
    // All API calls are handled by the frontend services
  },
  preview: {
    port: 4173,
    host: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "lucide-react",
      "recharts",
      // Pre-bundle critical UI components
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-tabs",
      // Force Supabase to use browser-compatible versions
      "@supabase/supabase-js",
    ],
    exclude: [
      "@vite/client",
      "@vite/env",
      // Exclude problematic Node.js specific modules
      "@supabase/node-fetch",
    ],
    force: false,
    // Prevent pre-bundling issues
    needsInterop: [],
    esbuildOptions: {
      target: "es2020",
      keepNames: true,
      // Define Node.js globals for browser compatibility
      define: {
        global: "globalThis",
        process: "globalThis.process",
      },
    },
  },
  esbuild: {
    logOverride: {
      "this-is-undefined-in-esm": "silent",
      "direct-eval": "silent",
    },
    target: "es2020",
    keepNames: true,
    treeShaking: true,
    // Better module compatibility
    platform: "browser",
    format: "esm",
  },

  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
});
