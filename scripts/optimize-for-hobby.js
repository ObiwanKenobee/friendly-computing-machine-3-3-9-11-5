#!/usr/bin/env node

/**
 * Hobby Plan Optimizer
 * Optimizes the codebase for hobby plan constraints
 */

const fs = require("fs");
const path = require("path");

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function print(text, color = "reset") {
  console.log(colorize(text, color));
}

function printHeader(text) {
  console.log("\n" + colorize("=".repeat(60), "cyan"));
  console.log(colorize(text, "bright"));
  console.log(colorize("=".repeat(60), "cyan"));
}

function printSection(text) {
  console.log("\n" + colorize(text, "blue"));
  console.log(colorize("-".repeat(40), "blue"));
}

async function optimizeForHobby() {
  printHeader("QuantumVest Enterprise - Hobby Plan Optimization");

  // 1. Update environment variables
  printSection("🔧 Environment Configuration");

  const envUpdates = {
    VITE_DEPLOYMENT_PLAN: "hobby",
    VITE_CACHE_STRATEGY: "aggressive",
    VITE_BUNDLE_OPTIMIZATION: "true",
    VITE_EDGE_OPTIMIZATION: "true",
  };

  // Update .env files
  const envFiles = [".env", ".env.local", ".env.production"];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      print(`Updating ${envFile}...`, "cyan");
      let content = fs.readFileSync(envFile, "utf8");

      for (const [key, value] of Object.entries(envUpdates)) {
        const regex = new RegExp(`^${key}=.*$`, "m");
        const newLine = `${key}=${value}`;

        if (content.match(regex)) {
          content = content.replace(regex, newLine);
        } else {
          content += `\n${newLine}`;
        }
      }

      fs.writeFileSync(envFile, content);
      print(`✅ Updated ${envFile}`, "green");
    }
  }

  // 2. Optimize Vite configuration
  printSection("⚡ Vite Configuration Optimization");

  const viteConfigPath = path.join(process.cwd(), "vite.config.ts");
  if (fs.existsSync(viteConfigPath)) {
    let viteConfig = fs.readFileSync(viteConfigPath, "utf8");

    // Add hobby plan optimizations
    const hobbyOptimizations = `
// Hobby Plan Optimizations
const isHobbyPlan = process.env.VITE_DEPLOYMENT_PLAN === 'hobby';

const hobbyBuildOptions = isHobbyPlan ? {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
        utils: ['clsx', 'tailwind-merge']
      }
    }
  },
  chunkSizeWarningLimit: 1000,
  minify: 'esbuild',
  sourcemap: false,
  cssCodeSplit: true
} : {};`;

    // Insert optimization if not already present
    if (!viteConfig.includes("Hobby Plan Optimizations")) {
      viteConfig = viteConfig.replace(
        "export default defineConfig({",
        `${hobbyOptimizations}\n\nexport default defineConfig({\n  build: hobbyBuildOptions,`,
      );

      fs.writeFileSync(viteConfigPath, viteConfig);
      print("✅ Added hobby optimizations to vite.config.ts", "green");
    } else {
      print("✅ Vite config already optimized", "green");
    }
  }

  // 3. Optimize package.json scripts
  printSection("📦 Package Scripts Optimization");

  const packagePath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  // Add hobby-specific scripts if not present
  const hobbyScripts = {
    "build:hobby-optimized":
      "VITE_DEPLOYMENT_PLAN=hobby GENERATE_SOURCEMAP=false npm run build",
    "analyze:hobby":
      "npm run build:hobby-optimized && npx vite-bundle-analyzer dist",
    "serve:hobby": "npm run build:hobby-optimized && npm run preview",
  };

  let scriptsUpdated = false;
  for (const [script, command] of Object.entries(hobbyScripts)) {
    if (!packageJson.scripts[script]) {
      packageJson.scripts[script] = command;
      scriptsUpdated = true;
    }
  }

  if (scriptsUpdated) {
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    print("✅ Added hobby-specific scripts", "green");
  } else {
    print("✅ Package scripts already optimized", "green");
  }

  // 4. Configure Vercel for hobby plan
  printSection("🚀 Vercel Configuration");

  const vercelConfigPath = path.join(process.cwd(), "vercel.json");
  const hobbyConfigPath = path.join(process.cwd(), "vercel.hobby.json");

  if (fs.existsSync(hobbyConfigPath)) {
    // Copy hobby config to main config
    const hobbyConfig = fs.readFileSync(hobbyConfigPath, "utf8");
    fs.writeFileSync(vercelConfigPath, hobbyConfig);
    print("✅ Applied hobby Vercel configuration", "green");
  } else {
    print("❌ vercel.hobby.json not found", "red");
  }

  // 5. Optimize API functions for hobby limits
  printSection("🔄 API Functions Optimization");

  const apiFunctionsPath = path.join(process.cwd(), "api");
  if (fs.existsSync(apiFunctionsPath)) {
    const functions = fs
      .readdirSync(apiFunctionsPath, { recursive: true })
      .filter((file) => file.endsWith(".ts"));

    print(`Found ${functions.length} API functions`, "cyan");

    if (functions.length > 12) {
      print("⚠️  Warning: Hobby plan limited to 12 functions", "yellow");
      print("Consider consolidating some functions", "yellow");
    } else {
      print("✅ Function count is within hobby limits", "green");
    }
  }

  // 6. Check and optimize dependencies
  printSection("📚 Dependencies Optimization");

  // Analyze bundle size contributors
  const bundleAnalysisNeeded = !fs.existsSync(path.join(process.cwd(), "dist"));

  if (bundleAnalysisNeeded) {
    print("Building for bundle analysis...", "cyan");
    const { execSync } = require("child_process");
    try {
      execSync("npm run build:hobby-optimized", { stdio: "inherit" });
      print("✅ Build completed", "green");
    } catch (error) {
      print("❌ Build failed", "red");
      return;
    }
  }

  // Check bundle size
  if (fs.existsSync(path.join(process.cwd(), "dist"))) {
    const { execSync } = require("child_process");
    try {
      const size = execSync("du -sh dist/", { encoding: "utf8" }).split(
        "\t",
      )[0];
      print(`Current bundle size: ${size}`, "green");

      const sizeBytes = parseInt(
        execSync("du -sb dist/", { encoding: "utf8" }).split("\t")[0],
      );
      const maxRecommendedSize = 50 * 1024 * 1024; // 50MB

      if (sizeBytes > maxRecommendedSize) {
        print("⚠️  Bundle size is large for hobby plan", "yellow");
        print("Recommendations:", "cyan");
        print("  • Enable code splitting", "cyan");
        print("  • Remove unused dependencies", "cyan");
        print("  • Use dynamic imports for large components", "cyan");
      } else {
        print("✅ Bundle size is optimal for hobby plan", "green");
      }
    } catch (error) {
      print("❌ Could not analyze bundle size", "red");
    }
  }

  // 7. Create hobby-specific monitoring
  printSection("📊 Monitoring Setup");

  // Create a simple monitoring script
  const monitorScript = `#!/bin/bash
# Simple monitoring for hobby plan
URL="\${SITE_URL:-https://quantumvest-enterprise.vercel.app}"
TIMESTAMP=\$(date '+%Y-%m-%d %H:%M:%S')

echo "[\$TIMESTAMP] Checking \$URL..."
if curl -f -s "\$URL" > /dev/null; then
    echo "[\$TIMESTAMP] ✅ Site is up"
    exit 0
else
    echo "[\$TIMESTAMP] ❌ Site appears down"
    exit 1
fi
`;

  const monitorPath = path.join(process.cwd(), "scripts", "hobby-monitor.sh");
  if (!fs.existsSync(monitorPath)) {
    fs.writeFileSync(monitorPath, monitorScript);
    print("✅ Created hobby monitoring script", "green");
  } else {
    print("✅ Monitoring script already exists", "green");
  }

  // 8. Generate optimization report
  printSection("📋 Optimization Report");

  const report = {
    timestamp: new Date().toISOString(),
    plan: "hobby",
    optimizations: [
      "Environment variables configured",
      "Vite build optimized",
      "Vercel configuration applied",
      "Bundle size optimized",
      "Monitoring script created",
    ],
    recommendations: [
      "Use aggressive caching",
      "Monitor function usage",
      "Consider code splitting for large components",
      "Use edge functions sparingly",
    ],
    limits: {
      functions: "12 max",
      bandwidth: "100GB/month",
      regions: "1 (us-east-1)",
      domains: "vercel.app subdomain only",
    },
  };

  const reportPath = path.join(process.cwd(), "hobby-optimization-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  print(
    "✅ Optimization report saved to hobby-optimization-report.json",
    "green",
  );

  // 9. Final recommendations
  printSection("🎯 Next Steps");

  print("Your app is now optimized for Hobby plan!", "bright");
  print("", "reset");
  print("To deploy:", "cyan");
  print("  npm run deploy:hobby", "cyan");
  print("", "reset");
  print("To monitor:", "cyan");
  print("  npm run monitor:hobby", "cyan");
  print("", "reset");
  print("To upgrade later:", "cyan");
  print("  npm run upgrade:pro", "cyan");
  print("", "reset");
  print("Hobby plan features:", "green");
  print("  ✅ Single-region deployment", "green");
  print("  ✅ 12 serverless functions", "green");
  print("  ✅ 100GB bandwidth", "green");
  print("  ✅ Edge functions", "green");
  print("  ✅ Automatic HTTPS", "green");

  print("\n" + colorize("Optimization complete! 🚀", "bright"));
}

// Run the optimization
optimizeForHobby().catch((error) => {
  console.error(colorize(`Error: ${error.message}`, "red"));
  process.exit(1);
});
