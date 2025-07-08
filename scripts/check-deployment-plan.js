#!/usr/bin/env node

/**
 * Deployment Plan Checker
 * Analyzes current deployment and provides recommendations
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
  magenta: "\x1b[35m",
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

async function checkDeploymentPlan() {
  printHeader("QuantumVest Enterprise - Deployment Plan Analysis");

  // Check environment variables
  const deploymentPlan = process.env.VITE_DEPLOYMENT_PLAN || "hobby";
  print(`Current Deployment Plan: ${deploymentPlan}`, "bright");

  // Load package.json
  const packagePath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packagePath)) {
    print("❌ package.json not found!", "red");
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  // Check Vercel configuration
  const vercelConfigs = {
    hobby: "vercel.hobby.json",
    pro: "vercel.pro.json",
    enterprise: "vercel.enterprise.json",
  };

  printSection("📋 Configuration Analysis");

  // Check which configs exist
  for (const [plan, configFile] of Object.entries(vercelConfigs)) {
    const exists = fs.existsSync(path.join(process.cwd(), configFile));
    const status = exists ? "✅" : "❌";
    const color = exists ? "green" : "red";
    print(`${status} ${configFile}`, color);
  }

  // Analyze current configuration
  const currentConfig = vercelConfigs[deploymentPlan];
  if (fs.existsSync(currentConfig)) {
    const config = JSON.parse(fs.readFileSync(currentConfig, "utf8"));

    printSection("🌍 Region Configuration");
    if (config.regions) {
      print(`Regions: ${config.regions.join(", ")}`, "green");
      print(
        `Multi-region: ${config.regions.length > 1 ? "Yes" : "No"}`,
        config.regions.length > 1 ? "green" : "yellow",
      );
    }

    if (config.functions) {
      printSection("⚡ Functions Configuration");
      const functionRegions = config.functions["api/**/*.ts"]?.regions || [
        "default",
      ];
      print(`Function regions: ${functionRegions.join(", ")}`, "green");
    }
  }

  // Analyze bundle size
  printSection("📦 Bundle Analysis");
  const distPath = path.join(process.cwd(), "dist");
  if (fs.existsSync(distPath)) {
    const { execSync } = require("child_process");
    try {
      const size = execSync("du -sh dist/", { encoding: "utf8" }).split(
        "\t",
      )[0];
      print(`Bundle size: ${size}`, "green");

      // Check if size is appropriate for plan
      const sizeBytes = parseInt(
        execSync("du -sb dist/", { encoding: "utf8" }).split("\t")[0],
      );
      const recommendations = {
        hobby: {
          max: 50 * 1024 * 1024,
          warning: "Consider optimization for hobby plan",
        },
        pro: {
          max: 100 * 1024 * 1024,
          warning: "Size is reasonable for pro plan",
        },
        enterprise: {
          max: 500 * 1024 * 1024,
          warning: "Size is fine for enterprise plan",
        },
      };

      const rec = recommendations[deploymentPlan];
      if (sizeBytes > rec.max) {
        print(`⚠️  ${rec.warning}`, "yellow");
      } else {
        print("✅ Bundle size is optimal for current plan", "green");
      }
    } catch (error) {
      print("❌ Could not analyze bundle size", "red");
    }
  } else {
    print("❌ No build found. Run npm run build first.", "red");
  }

  // Check edge functions
  printSection("🔄 Edge Functions Analysis");
  const supabaseFunctionsPath = path.join(
    process.cwd(),
    "supabase",
    "functions",
  );
  if (fs.existsSync(supabaseFunctionsPath)) {
    const functions = fs.readdirSync(supabaseFunctionsPath);
    print(`Supabase functions: ${functions.length}`, "green");
    functions.forEach((func) => {
      print(`  • ${func}`, "cyan");
    });
  }

  const apiFunctionsPath = path.join(process.cwd(), "api");
  if (fs.existsSync(apiFunctionsPath)) {
    const functions = fs
      .readdirSync(apiFunctionsPath, { recursive: true })
      .filter((file) => file.endsWith(".ts"));
    print(`Vercel API functions: ${functions.length}`, "green");
    functions.forEach((func) => {
      print(`  • ${func}`, "cyan");
    });
  }

  // Deployment recommendations
  printSection("💡 Recommendations");

  if (deploymentPlan === "hobby") {
    print("🏠 HOBBY PLAN OPTIMIZATIONS:", "bright");
    print("  ✅ Single-region deployment", "green");
    print("  ✅ Aggressive caching enabled", "green");
    print("  ✅ Bundle optimization active", "green");
    print("  ⚠️  Limited to 12 serverless functions", "yellow");
    print("  ⚠️  100GB bandwidth limit", "yellow");
    print("  ⚠️  No custom domains", "yellow");

    print("\n🚀 UPGRADE BENEFITS:", "bright");
    print("  Pro Plan: Multi-region, 1TB bandwidth, custom domains", "cyan");
    print("  Enterprise: Unlimited resources, advanced monitoring", "cyan");
  } else if (deploymentPlan === "pro") {
    print("⭐ PRO PLAN FEATURES:", "bright");
    print("  ✅ Multi-region deployment", "green");
    print("  ✅ Custom domains", "green");
    print("  ✅ 1TB bandwidth", "green");
    print("  ✅ 100 serverless functions", "green");
  } else {
    print("🏢 ENTERPRISE PLAN FEATURES:", "bright");
    print("  ✅ Global deployment", "green");
    print("  ✅ Unlimited resources", "green");
    print("  �� Advanced monitoring", "green");
    print("  ✅ Priority support", "green");
  }

  // Cost analysis
  printSection("💰 Cost Analysis");
  const costEstimates = {
    hobby: "$0/month (Free tier)",
    pro: "$20/month + usage",
    enterprise: "$400/month + usage",
  };

  print(`Current plan cost: ${costEstimates[deploymentPlan]}`, "green");

  if (deploymentPlan === "hobby") {
    print("Upgrade costs:", "cyan");
    print(`  Pro: ${costEstimates.pro}`, "cyan");
    print(`  Enterprise: ${costEstimates.enterprise}`, "cyan");
  }

  // Action items
  printSection("📋 Action Items");

  if (deploymentPlan === "hobby") {
    print("To optimize for hobby plan:", "bright");
    print("  1. npm run optimize:hobby", "cyan");
    print("  2. npm run validate:hobby-limits", "cyan");
    print("  3. npm run deploy:hobby", "cyan");

    print("\nTo upgrade to Pro:", "bright");
    print("  1. npm run upgrade:pro", "cyan");
    print("  2. Update your Vercel plan", "cyan");
    print("  3. npm run deploy:pro", "cyan");
  }

  printSection("🔍 Health Check");

  // Check if deployment is working
  const siteUrl =
    process.env.VITE_SITE_URL || "https://quantumvest-enterprise.vercel.app";
  print(`Site URL: ${siteUrl}`, "cyan");

  try {
    const https = require("https");
    const http = require("http");
    const protocol = siteUrl.startsWith("https") ? https : http;

    await new Promise((resolve, reject) => {
      const req = protocol.get(siteUrl, (res) => {
        if (res.statusCode === 200) {
          print("✅ Site is accessible", "green");
        } else {
          print(`⚠️  Site returned status: ${res.statusCode}`, "yellow");
        }
        resolve();
      });

      req.on("error", (error) => {
        print(`❌ Site is not accessible: ${error.message}`, "red");
        resolve();
      });

      req.setTimeout(5000, () => {
        print("⚠️  Site response is slow (>5s)", "yellow");
        req.abort();
        resolve();
      });
    });
  } catch (error) {
    print(`❌ Error checking site: ${error.message}`, "red");
  }

  print("\n" + colorize("Analysis complete! 🎉", "bright"));
}

// Run the analysis
checkDeploymentPlan().catch((error) => {
  console.error(colorize(`Error: ${error.message}`, "red"));
  process.exit(1);
});
