export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  images?: SitemapImage[];
}

export interface SitemapImage {
  url: string;
  caption?: string;
  title?: string;
  license?: string;
}

export interface RobotsTxtRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface RobotsTxtConfig {
  rules: RobotsTxtRule[];
  sitemaps: string[];
  host?: string;
}

class SitemapService {
  private baseUrl: string;
  private sitemap: SitemapEntry[] = [];
  private robotsConfig: RobotsTxtConfig;

  constructor(baseUrl: string = "https://quantumvest.com") {
    this.baseUrl = baseUrl;
    this.initializeDefaultSitemap();
    this.initializeRobotsConfig();
  }

  // Sitemap Generation
  generateSitemap(): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${this.sitemap.map((entry) => this.generateSitemapEntry(entry)).join("\n")}
</urlset>`;
    return xml;
  }

  generateSitemapIndex(sitemaps: string[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;
    return xml;
  }

  generateImageSitemap(): string {
    const imageEntries = this.sitemap.filter(
      (entry) => entry.images && entry.images.length > 0,
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries.map((entry) => this.generateImageSitemapEntry(entry)).join("\n")}
</urlset>`;
    return xml;
  }

  generateNewsSitemap(
    newsArticles: Array<{
      url: string;
      title: string;
      publishedDate: string;
      keywords?: string;
    }>,
  ): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsArticles
  .map(
    (article) => `  <url>
    <loc>${this.baseUrl}${article.url}</loc>
    <news:news>
      <news:publication>
        <news:name>QuantumVest</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.publishedDate}</news:publication_date>
      <news:title>${this.escapeXml(article.title)}</news:title>
      ${article.keywords ? `<news:keywords>${this.escapeXml(article.keywords)}</news:keywords>` : ""}
    </news:news>
  </url>`,
  )
  .join("\n")}
</urlset>`;
    return xml;
  }

  // Robots.txt Generation
  generateRobotsTxt(): string {
    let robotsTxt = "";

    // Add rules for each user agent
    this.robotsConfig.rules.forEach((rule) => {
      robotsTxt += `User-agent: ${rule.userAgent}\n`;

      if (rule.allow) {
        rule.allow.forEach((path) => {
          robotsTxt += `Allow: ${path}\n`;
        });
      }

      if (rule.disallow) {
        rule.disallow.forEach((path) => {
          robotsTxt += `Disallow: ${path}\n`;
        });
      }

      if (rule.crawlDelay) {
        robotsTxt += `Crawl-delay: ${rule.crawlDelay}\n`;
      }

      robotsTxt += "\n";
    });

    // Add host if specified
    if (this.robotsConfig.host) {
      robotsTxt += `Host: ${this.robotsConfig.host}\n\n`;
    }

    // Add sitemaps
    this.robotsConfig.sitemaps.forEach((sitemap) => {
      robotsTxt += `Sitemap: ${sitemap}\n`;
    });

    return robotsTxt;
  }

  // Sitemap Management
  addUrl(entry: SitemapEntry): void {
    // Ensure URL is absolute
    if (!entry.url.startsWith("http")) {
      entry.url = `${this.baseUrl}${entry.url.startsWith("/") ? "" : "/"}${entry.url}`;
    }

    // Check if URL already exists
    const existingIndex = this.sitemap.findIndex(
      (existing) => existing.url === entry.url,
    );

    if (existingIndex >= 0) {
      // Update existing entry
      this.sitemap[existingIndex] = {
        ...this.sitemap[existingIndex],
        ...entry,
      };
    } else {
      // Add new entry
      this.sitemap.push({
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.5,
        ...entry,
      });
    }
  }

  removeUrl(url: string): void {
    const absoluteUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;
    this.sitemap = this.sitemap.filter((entry) => entry.url !== absoluteUrl);
  }

  updateUrl(url: string, updates: Partial<SitemapEntry>): void {
    const absoluteUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;
    const entry = this.sitemap.find((e) => e.url === absoluteUrl);

    if (entry) {
      Object.assign(entry, updates);
      entry.lastmod = new Date().toISOString();
    }
  }

  // Bulk Operations
  addBulkUrls(entries: SitemapEntry[]): void {
    entries.forEach((entry) => this.addUrl(entry));
  }

  generateDynamicSitemap(
    routes: Array<{
      path: string;
      priority?: number;
      changefreq?: SitemapEntry["changefreq"];
      getLastmod?: () => string;
    }>,
  ): void {
    routes.forEach((route) => {
      this.addUrl({
        url: route.path,
        priority: route.priority || 0.5,
        changefreq: route.changefreq || "weekly",
        lastmod: route.getLastmod
          ? route.getLastmod()
          : new Date().toISOString(),
      });
    });
  }

  // SEO Optimization
  optimizeSitemapForSEO(): void {
    // Sort by priority (highest first)
    this.sitemap.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Update change frequencies based on URL patterns
    this.sitemap.forEach((entry) => {
      if (entry.url.includes("/blog/") || entry.url.includes("/news/")) {
        entry.changefreq = "daily";
        entry.priority = Math.max(entry.priority || 0, 0.7);
      } else if (
        entry.url.includes("/pricing") ||
        entry.url.includes("/enterprise")
      ) {
        entry.changefreq = "weekly";
        entry.priority = Math.max(entry.priority || 0, 0.8);
      } else if (
        entry.url === this.baseUrl ||
        entry.url === `${this.baseUrl}/`
      ) {
        entry.changefreq = "daily";
        entry.priority = 1.0;
      }
    });
  }

  // Validation
  validateSitemap(): Array<{ url: string; issues: string[] }> {
    const issues: Array<{ url: string; issues: string[] }> = [];

    this.sitemap.forEach((entry) => {
      const entryIssues: string[] = [];

      // URL validation
      if (!this.isValidUrl(entry.url)) {
        entryIssues.push("Invalid URL format");
      }

      // Priority validation
      if (
        entry.priority !== undefined &&
        (entry.priority < 0 || entry.priority > 1)
      ) {
        entryIssues.push("Priority must be between 0 and 1");
      }

      // Image validation
      if (entry.images) {
        entry.images.forEach((image, index) => {
          if (!this.isValidUrl(image.url)) {
            entryIssues.push(`Invalid image URL at index ${index}`);
          }
        });
      }

      if (entryIssues.length > 0) {
        issues.push({ url: entry.url, issues: entryIssues });
      }
    });

    return issues;
  }

  // Analytics Integration
  generateSitemapAnalytics(): {
    totalUrls: number;
    byPriority: Record<string, number>;
    byChangeFreq: Record<string, number>;
    recentlyUpdated: number;
    withImages: number;
  } {
    const analytics = {
      totalUrls: this.sitemap.length,
      byPriority: {} as Record<string, number>,
      byChangeFreq: {} as Record<string, number>,
      recentlyUpdated: 0,
      withImages: 0,
    };

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    this.sitemap.forEach((entry) => {
      // Priority distribution
      const priorityRange = this.getPriorityRange(entry.priority || 0);
      analytics.byPriority[priorityRange] =
        (analytics.byPriority[priorityRange] || 0) + 1;

      // Change frequency distribution
      const changefreq = entry.changefreq || "weekly";
      analytics.byChangeFreq[changefreq] =
        (analytics.byChangeFreq[changefreq] || 0) + 1;

      // Recently updated
      if (entry.lastmod && new Date(entry.lastmod) > weekAgo) {
        analytics.recentlyUpdated++;
      }

      // With images
      if (entry.images && entry.images.length > 0) {
        analytics.withImages++;
      }
    });

    return analytics;
  }

  // Private Methods
  private initializeDefaultSitemap(): void {
    const defaultPages = [
      { url: "/", priority: 1.0, changefreq: "daily" as const },
      { url: "/enterprise", priority: 0.9, changefreq: "weekly" as const },
      { url: "/analytics", priority: 0.8, changefreq: "weekly" as const },
      { url: "/security", priority: 0.8, changefreq: "weekly" as const },
      { url: "/pricing", priority: 0.9, changefreq: "weekly" as const },
      { url: "/about", priority: 0.6, changefreq: "monthly" as const },
      { url: "/contact", priority: 0.7, changefreq: "monthly" as const },
      { url: "/blog", priority: 0.7, changefreq: "daily" as const },
      { url: "/docs", priority: 0.6, changefreq: "weekly" as const },
      { url: "/api", priority: 0.5, changefreq: "weekly" as const },
    ];

    defaultPages.forEach((page) => this.addUrl(page));
  }

  private initializeRobotsConfig(): void {
    this.robotsConfig = {
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
          disallow: ["/admin/", "/api/private/", "/_next/", "/tmp/"],
        },
        {
          userAgent: "Googlebot",
          allow: ["/"],
          crawlDelay: 1,
        },
        {
          userAgent: "Bingbot",
          allow: ["/"],
          crawlDelay: 2,
        },
        {
          userAgent: "BadBot",
          disallow: ["/"],
        },
      ],
      sitemaps: [
        `${this.baseUrl}/sitemap.xml`,
        `${this.baseUrl}/sitemap-images.xml`,
        `${this.baseUrl}/sitemap-news.xml`,
      ],
      host: this.baseUrl,
    };
  }

  private generateSitemapEntry(entry: SitemapEntry): string {
    let xml = `  <url>
    <loc>${this.escapeXml(entry.url)}</loc>`;

    if (entry.lastmod) {
      xml += `\n    <lastmod>${entry.lastmod}</lastmod>`;
    }

    if (entry.changefreq) {
      xml += `\n    <changefreq>${entry.changefreq}</changefreq>`;
    }

    if (entry.priority !== undefined) {
      xml += `\n    <priority>${entry.priority.toFixed(1)}</priority>`;
    }

    if (entry.images && entry.images.length > 0) {
      entry.images.forEach((image) => {
        xml += `\n    <image:image>
      <image:loc>${this.escapeXml(image.url)}</image:loc>`;

        if (image.caption) {
          xml += `\n      <image:caption>${this.escapeXml(image.caption)}</image:caption>`;
        }

        if (image.title) {
          xml += `\n      <image:title>${this.escapeXml(image.title)}</image:title>`;
        }

        if (image.license) {
          xml += `\n      <image:license>${this.escapeXml(image.license)}</image:license>`;
        }

        xml += "\n    </image:image>";
      });
    }

    xml += "\n  </url>";
    return xml;
  }

  private generateImageSitemapEntry(entry: SitemapEntry): string {
    if (!entry.images || entry.images.length === 0) return "";

    let xml = `  <url>
    <loc>${this.escapeXml(entry.url)}</loc>`;

    entry.images.forEach((image) => {
      xml += `\n    <image:image>
      <image:loc>${this.escapeXml(image.url)}</image:loc>`;

      if (image.caption) {
        xml += `\n      <image:caption>${this.escapeXml(image.caption)}</image:caption>`;
      }

      xml += "\n    </image:image>";
    });

    xml += "\n  </url>";
    return xml;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private getPriorityRange(priority: number): string {
    if (priority >= 0.8) return "High (0.8-1.0)";
    if (priority >= 0.5) return "Medium (0.5-0.7)";
    return "Low (0.0-0.4)";
  }

  // Public API
  getSitemap(): SitemapEntry[] {
    return [...this.sitemap];
  }

  getRobotsConfig(): RobotsTxtConfig {
    return { ...this.robotsConfig };
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
    this.initializeRobotsConfig();
  }

  exportSitemapData(): {
    sitemap: SitemapEntry[];
    robotsConfig: RobotsTxtConfig;
    analytics: any;
  } {
    return {
      sitemap: this.getSitemap(),
      robotsConfig: this.getRobotsConfig(),
      analytics: this.generateSitemapAnalytics(),
    };
  }
}

export const sitemapService = new SitemapService();
