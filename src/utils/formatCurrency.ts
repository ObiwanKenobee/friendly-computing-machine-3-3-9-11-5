import { localizationConfig } from "../config/localization";

export interface CurrencyFormatOptions {
  currency: string;
  locale?: string;
  notation?: "standard" | "scientific" | "engineering" | "compact";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
  showCode?: boolean;
  useGrouping?: boolean;
  signDisplay?: "auto" | "never" | "always" | "exceptZero";
}

export interface CryptoFormatOptions {
  decimals?: number;
  showFullPrecision?: boolean;
  useScientificNotation?: boolean;
  threshold?: number;
}

/**
 * Format currency amount with locale-specific formatting
 */
export const formatCurrency = (
  amount: number,
  options: CurrencyFormatOptions,
): string => {
  const {
    currency,
    locale = "en-US",
    notation = "standard",
    showSymbol = true,
    showCode = false,
    useGrouping = true,
    signDisplay = "auto",
  } = options;

  const currencyConfig =
    localizationConfig.currencies[
      currency as keyof typeof localizationConfig.currencies
    ];

  if (!currencyConfig) {
    console.warn(`Currency ${currency} not found in configuration`);
    return `${amount.toFixed(2)} ${currency}`;
  }

  const formatOptions: Intl.NumberFormatOptions = {
    style: showSymbol ? "currency" : "decimal",
    currency: currency,
    notation,
    useGrouping,
    signDisplay,
    minimumFractionDigits:
      options.minimumFractionDigits ?? currencyConfig.decimals,
    maximumFractionDigits:
      options.maximumFractionDigits ?? currencyConfig.decimals,
  };

  try {
    const formatter = new Intl.NumberFormat(locale, formatOptions);
    let formatted = formatter.format(amount);

    // Add currency code if requested and not already showing symbol
    if (showCode && !showSymbol) {
      formatted += ` ${currency}`;
    }

    return formatted;
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${currencyConfig.symbol}${amount.toFixed(currencyConfig.decimals)}`;
  }
};

/**
 * Format cryptocurrency amounts with appropriate precision
 */
export const formatCrypto = (
  amount: number,
  currency: string,
  options: CryptoFormatOptions = {},
): string => {
  const {
    decimals,
    showFullPrecision = false,
    useScientificNotation = false,
    threshold = 0.01,
  } = options;

  const currencyConfig =
    localizationConfig.currencies[
      currency as keyof typeof localizationConfig.currencies
    ];

  if (!currencyConfig || currencyConfig.type !== "crypto") {
    return `${amount} ${currency}`;
  }

  const maxDecimals = decimals ?? currencyConfig.decimals;

  // Use scientific notation for very small amounts
  if (useScientificNotation && amount > 0 && amount < threshold) {
    return `${amount.toExponential(4)} ${currency}`;
  }

  // Show full precision for very small amounts
  if (showFullPrecision && amount > 0 && amount < threshold) {
    const significantDecimals = Math.max(
      -Math.floor(Math.log10(Math.abs(amount))) + 4,
      maxDecimals,
    );
    return `${amount.toFixed(significantDecimals)} ${currency}`;
  }

  // Determine appropriate decimal places based on amount
  let displayDecimals = maxDecimals;
  if (amount >= 1000) {
    displayDecimals = Math.min(2, maxDecimals);
  } else if (amount >= 1) {
    displayDecimals = Math.min(4, maxDecimals);
  } else if (amount >= 0.01) {
    displayDecimals = Math.min(6, maxDecimals);
  }

  return `${amount.toFixed(displayDecimals)} ${currency}`;
};

/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 */
export const formatLargeNumber = (
  amount: number,
  locale: string = "en",
  precision: number = 1,
): string => {
  const suffixes =
    localizationConfig.formatting.largeNumbers[
      locale as keyof typeof localizationConfig.formatting.largeNumbers
    ] || localizationConfig.formatting.largeNumbers.en;

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (absAmount >= 1e12) {
    return `${sign}${(absAmount / 1e12).toFixed(precision)}${suffixes.trillion}`;
  } else if (absAmount >= 1e9) {
    return `${sign}${(absAmount / 1e9).toFixed(precision)}${suffixes.billion}`;
  } else if (absAmount >= 1e6) {
    return `${sign}${(absAmount / 1e6).toFixed(precision)}${suffixes.million}`;
  } else if (absAmount >= 1e3) {
    return `${sign}${(absAmount / 1e3).toFixed(precision)}${suffixes.thousand}`;
  } else {
    return `${sign}${absAmount.toFixed(precision)}`;
  }
};

/**
 * Format percentage with appropriate precision and signs
 */
export const formatPercentage = (
  value: number,
  options: {
    precision?: number;
    showSign?: boolean;
    locale?: string;
  } = {},
): string => {
  const {
    precision = localizationConfig.formatting.percentages.precision,
    showSign = localizationConfig.formatting.percentages.showPlus,
    locale = "en-US",
  } = options;

  const sign = showSign && value > 0 ? "+" : "";

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

    const formatted = formatter.format(value / 100);
    return showSign && value > 0 ? `+${formatted}` : formatted;
  } catch (error) {
    return `${sign}${value.toFixed(precision)}%`;
  }
};

/**
 * Format currency with compact notation for large amounts
 */
export const formatCompactCurrency = (
  amount: number,
  currency: string,
  locale: string = "en-US",
): string => {
  return formatCurrency(amount, {
    currency,
    locale,
    notation: "compact",
    maximumFractionDigits: 1,
  });
};

/**
 * Format range of amounts (e.g., "$100 - $500")
 */
export const formatCurrencyRange = (
  min: number,
  max: number,
  currency: string,
  locale: string = "en-US",
): string => {
  const minFormatted = formatCurrency(min, { currency, locale });
  const maxFormatted = formatCurrency(max, { currency, locale });

  return `${minFormatted} - ${maxFormatted}`;
};

/**
 * Format currency with change indicator
 */
export const formatCurrencyWithChange = (
  current: number,
  previous: number,
  currency: string,
  locale: string = "en-US",
): {
  current: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
} => {
  const currentFormatted = formatCurrency(current, { currency, locale });
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;

  const changeFormatted = formatCurrency(Math.abs(change), {
    currency,
    locale,
    signDisplay: "never",
  });

  const changePercentFormatted = formatPercentage(changePercent, {
    showSign: true,
    locale,
  });

  const isPositive = change >= 0;
  const sign = isPositive ? "+" : "-";

  return {
    current: currentFormatted,
    change: `${sign}${changeFormatted}`,
    changePercent: changePercentFormatted,
    isPositive,
  };
};

/**
 * Parse currency string back to number
 */
export const parseCurrency = (
  currencyString: string,
  currency: string,
  locale: string = "en-US",
): number => {
  try {
    // Remove currency symbols and codes
    const currencyConfig =
      localizationConfig.currencies[
        currency as keyof typeof localizationConfig.currencies
      ];
    let cleaned = currencyString;

    if (currencyConfig) {
      cleaned = cleaned.replace(new RegExp(currencyConfig.symbol, "g"), "");
      cleaned = cleaned.replace(new RegExp(currency, "g"), "");
    }

    // Remove common separators and normalize
    cleaned = cleaned.replace(/[,\s]/g, "").trim();

    // Handle different decimal separators
    if (locale.includes("de") || locale.includes("fr")) {
      // European format: 1.234,56
      cleaned = cleaned.replace(".", "").replace(",", ".");
    }

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  } catch (error) {
    console.error("Error parsing currency:", error);
    return 0;
  }
};

/**
 * Convert between currencies (requires exchange rates)
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number,
): {
  originalAmount: string;
  convertedAmount: string;
  rate: number;
  fromCurrency: string;
  toCurrency: string;
} => {
  const convertedAmount = amount * exchangeRate;

  return {
    originalAmount: formatCurrency(amount, { currency: fromCurrency }),
    convertedAmount: formatCurrency(convertedAmount, { currency: toCurrency }),
    rate: exchangeRate,
    fromCurrency,
    toCurrency,
  };
};

/**
 * Format Islamic finance amounts (avoiding interest-based terminology)
 */
export const formatIslamicCurrency = (
  amount: number,
  currency: string,
  type:
    | "profit"
    | "loss"
    | "principal"
    | "murabaha"
    | "mudharabah"
    | "musharakah",
  locale: string = "ar-SA",
): {
  amount: string;
  type: string;
  description: string;
} => {
  const amountFormatted = formatCurrency(amount, { currency, locale });

  const typeDescriptions = {
    profit: "ربح", // Profit
    loss: "خسارة", // Loss
    principal: "رأس المال", // Principal
    murabaha: "مرابحة", // Cost-plus financing
    mudharabah: "مضاربة", // Profit-sharing
    musharakah: "مشاركة", // Joint venture
  };

  return {
    amount: amountFormatted,
    type: type,
    description: typeDescriptions[type] || type,
  };
};

/**
 * Format currency for different cultural contexts
 */
export const formatCulturalCurrency = (
  amount: number,
  currency: string,
  culturalFramework: string,
  locale?: string,
): string => {
  // Determine appropriate locale based on cultural framework
  if (!locale) {
    const framework =
      localizationConfig.culturalFrameworks[
        culturalFramework as keyof typeof localizationConfig.culturalFrameworks
      ];
    locale = framework?.languages[0]
      ? `${framework.languages[0]}-${framework.currencies?.[0]?.slice(0, 2) || "US"}`
      : "en-US";
  }

  return formatCurrency(amount, { currency, locale });
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: string): string => {
  const currencyConfig =
    localizationConfig.currencies[
      currency as keyof typeof localizationConfig.currencies
    ];
  return currencyConfig?.symbol || currency;
};

/**
 * Get currency info
 */
export const getCurrencyInfo = (currency: string) => {
  return localizationConfig.currencies[
    currency as keyof typeof localizationConfig.currencies
  ];
};

/**
 * Check if currency is supported
 */
export const isCurrencySupported = (currency: string): boolean => {
  return currency in localizationConfig.currencies;
};

/**
 * Get currencies by type
 */
export const getCurrenciesByType = (type: "fiat" | "crypto"): string[] => {
  return Object.entries(localizationConfig.currencies)
    .filter(([, config]) => config.type === type)
    .map(([code]) => code);
};

export default {
  formatCurrency,
  formatCrypto,
  formatLargeNumber,
  formatPercentage,
  formatCompactCurrency,
  formatCurrencyRange,
  formatCurrencyWithChange,
  parseCurrency,
  convertCurrency,
  formatIslamicCurrency,
  formatCulturalCurrency,
  getCurrencySymbol,
  getCurrencyInfo,
  isCurrencySupported,
  getCurrenciesByType,
};
