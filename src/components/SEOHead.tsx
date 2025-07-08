import React from "react";
import { Helmet } from "react-helmet-async";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: Record<string, unknown>;
}

const defaultSEO = {
  title: "QuantumVest - Enterprise Financial Innovation Platform",
  description:
    "Military-grade Cisco XDR security meets global financial innovation. Enterprise-grade platform supporting 7,000+ languages with quantum-level protection.",
  keywords: [
    "enterprise finance",
    "quantum investing",
    "global markets",
    "security platform",
    "multi-language",
    "cultural sovereignty",
    "financial technology",
    "enterprise security",
    "global innovation",
    "investment platform",
  ],
  image: "https://quantumvest.com/og-image.jpg",
  url: "https://quantumvest.com",
  type: "website" as const,
  locale: "en_US",
};

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  locale = "en_US",
  canonicalUrl,
  noindex = false,
  nofollow = false,
  structuredData,
}) => {
  const seoTitle = title || defaultSEO.title;
  const seoDescription = description || defaultSEO.description;
  const seoKeywords = [...defaultSEO.keywords, ...keywords];
  const seoImage = image || defaultSEO.image;
  const seoUrl = url || defaultSEO.url;
  const seoCanonical = canonicalUrl || seoUrl;

  const robotsContent = `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(", ")} />
      <meta name="robots" content={robotsContent} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content={locale.split("_")[0]} />

      {/* Canonical URL */}
      <link rel="canonical" href={seoCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="QuantumVest" />
      <meta property="og:locale" content={locale} />

      {/* Article specific meta tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      {type === "article" &&
        tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@quantumvest" />
      <meta name="twitter:creator" content="@quantumvest" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Additional SEO tags */}
      <meta name="author" content={author || "QuantumVest Team"} />
      <meta name="publisher" content="QuantumVest" />
      <meta
        name="copyright"
        content="© 2024 QuantumVest. All rights reserved."
      />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#0066CC" />
      <meta name="msapplication-TileColor" content="#0066CC" />

      {/* Performance and Security */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Default Organization Schema */}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "QuantumVest",
            url: "https://quantumvest.com",
            logo: "https://quantumvest.com/logo.png",
            description:
              "Enterprise-grade financial innovation platform with military-grade security",
            foundingDate: "2024",
            industry: "Financial Technology",
            address: {
              "@type": "PostalAddress",
              addressCountry: "US",
            },
            sameAs: [
              "https://linkedin.com/company/quantumvest",
              "https://twitter.com/quantumvest",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              availableLanguage: [
                "English",
                "Spanish",
                "French",
                "German",
                "Chinese",
                "Japanese",
              ],
            },
          })}
        </script>
      )}
    </Helmet>
  );
};

// Predefined SEO configurations for different page types
export const pageSEOConfigs = {
  home: {
    title: "QuantumVest - Enterprise Financial Innovation Platform",
    description:
      "Military-grade Cisco XDR security meets global financial innovation. Enterprise-grade platform supporting 7,000+ languages with quantum-level protection.",
    keywords: [
      "enterprise finance",
      "quantum investing",
      "global markets",
      "security platform",
    ],
    type: "website" as const,
  },

  enterprise: {
    title: "Enterprise Solutions - QuantumVest",
    description:
      "Enterprise-grade financial solutions with advanced security, multi-language support, and cultural sovereignty features.",
    keywords: [
      "enterprise solutions",
      "business finance",
      "corporate investing",
      "financial technology",
    ],
    type: "website" as const,
  },

  security: {
    title: "Cisco XDR Security - QuantumVest",
    description:
      "Military-grade Cisco XDR security platform with real-time threat detection, automated response, and comprehensive compliance.",
    keywords: [
      "cisco xdr",
      "cybersecurity",
      "threat detection",
      "enterprise security",
      "compliance",
    ],
    type: "website" as const,
  },

  analytics: {
    title: "Analytics Dashboard - QuantumVest",
    description:
      "Advanced analytics and real-time insights for enterprise financial operations with interactive dashboards and reporting.",
    keywords: [
      "financial analytics",
      "business intelligence",
      "real-time insights",
      "enterprise reporting",
    ],
    type: "website" as const,
  },

  pricing: {
    title: "Pricing Plans - QuantumVest",
    description:
      "Flexible pricing plans for enterprise financial innovation. From Basic to Quantum tiers with PayPal and Paystack integration.",
    keywords: [
      "pricing plans",
      "enterprise pricing",
      "subscription tiers",
      "payment processing",
    ],
    type: "website" as const,
  },

  blog: {
    title: "Blog - QuantumVest",
    description:
      "Latest insights, trends, and innovations in enterprise finance, global markets, and financial technology.",
    keywords: [
      "financial blog",
      "enterprise insights",
      "market trends",
      "fintech news",
    ],
    type: "website" as const,
  },
};

// Hook for dynamic SEO
export const useSEO = (
  pageType: keyof typeof pageSEOConfigs,
  customSEO?: Partial<SEOProps>,
) => {
  const baseSEO = pageSEOConfigs[pageType];
  return { ...baseSEO, ...customSEO };
};

export default SEOHead;
