export const localizationConfig = {
  // Default Settings
  defaultLanguage: "en",
  defaultCurrency: "USD",
  defaultRegion: "US",

  // Supported Languages
  languages: {
    en: {
      code: "en",
      name: "English",
      nativeName: "English",
      rtl: false,
      flag: "🇺🇸",
      regions: ["US", "GB", "CA", "AU", "NZ"],
    },
    ar: {
      code: "ar",
      name: "Arabic",
      nativeName: "العربية",
      rtl: true,
      flag: "🇸🇦",
      regions: [
        "SA",
        "AE",
        "QA",
        "KW",
        "BH",
        "OM",
        "JO",
        "LB",
        "SY",
        "IQ",
        "EG",
        "LY",
        "TN",
        "DZ",
        "MA",
      ],
    },
    zh: {
      code: "zh",
      name: "Chinese (Simplified)",
      nativeName: "简体中文",
      rtl: false,
      flag: "🇨🇳",
      regions: ["CN", "SG"],
    },
    "zh-TW": {
      code: "zh-TW",
      name: "Chinese (Traditional)",
      nativeName: "繁體中文",
      rtl: false,
      flag: "🇹🇼",
      regions: ["TW", "HK", "MO"],
    },
    es: {
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      rtl: false,
      flag: "🇪🇸",
      regions: [
        "ES",
        "MX",
        "AR",
        "CO",
        "PE",
        "VE",
        "CL",
        "EC",
        "GT",
        "CU",
        "BO",
        "DO",
        "HN",
        "PY",
        "SV",
        "NI",
        "CR",
        "PA",
        "UY",
      ],
    },
    fr: {
      code: "fr",
      name: "French",
      nativeName: "Français",
      rtl: false,
      flag: "🇫🇷",
      regions: ["FR", "CA", "BE", "CH", "LU", "MC"],
    },
    de: {
      code: "de",
      name: "German",
      nativeName: "Deutsch",
      rtl: false,
      flag: "🇩🇪",
      regions: ["DE", "AT", "CH", "LI"],
    },
    it: {
      code: "it",
      name: "Italian",
      nativeName: "Italiano",
      rtl: false,
      flag: "🇮🇹",
      regions: ["IT", "SM", "VA", "CH"],
    },
    pt: {
      code: "pt",
      name: "Portuguese",
      nativeName: "Português",
      rtl: false,
      flag: "🇵🇹",
      regions: ["PT", "BR", "AO", "MZ", "GW", "CV", "ST", "TL"],
    },
    ru: {
      code: "ru",
      name: "Russian",
      nativeName: "Русский",
      rtl: false,
      flag: "🇷🇺",
      regions: ["RU", "BY", "KZ", "KG", "TJ"],
    },
    ja: {
      code: "ja",
      name: "Japanese",
      nativeName: "日本語",
      rtl: false,
      flag: "🇯🇵",
      regions: ["JP"],
    },
    ko: {
      code: "ko",
      name: "Korean",
      nativeName: "한국어",
      rtl: false,
      flag: "🇰🇷",
      regions: ["KR"],
    },
    hi: {
      code: "hi",
      name: "Hindi",
      nativeName: "हिन्दी",
      rtl: false,
      flag: "🇮🇳",
      regions: ["IN"],
    },
    ur: {
      code: "ur",
      name: "Urdu",
      nativeName: "اردو",
      rtl: true,
      flag: "🇵🇰",
      regions: ["PK", "IN"],
    },
    bn: {
      code: "bn",
      name: "Bengali",
      nativeName: "বাংলা",
      rtl: false,
      flag: "🇧🇩",
      regions: ["BD", "IN"],
    },
    tr: {
      code: "tr",
      name: "Turkish",
      nativeName: "Türkçe",
      rtl: false,
      flag: "🇹🇷",
      regions: ["TR"],
    },
    fa: {
      code: "fa",
      name: "Persian",
      nativeName: "فارسی",
      rtl: true,
      flag: "🇮🇷",
      regions: ["IR", "AF", "TJ"],
    },
    id: {
      code: "id",
      name: "Indonesian",
      nativeName: "Bahasa Indonesia",
      rtl: false,
      flag: "🇮🇩",
      regions: ["ID"],
    },
    ms: {
      code: "ms",
      name: "Malay",
      nativeName: "Bahasa Melayu",
      rtl: false,
      flag: "🇲🇾",
      regions: ["MY", "BN", "SG"],
    },
    th: {
      code: "th",
      name: "Thai",
      nativeName: "ไทย",
      rtl: false,
      flag: "🇹🇭",
      regions: ["TH"],
    },
    vi: {
      code: "vi",
      name: "Vietnamese",
      nativeName: "Tiếng Việt",
      rtl: false,
      flag: "🇻🇳",
      regions: ["VN"],
    },
  },

  // Supported Currencies
  currencies: {
    // Fiat Currencies
    USD: {
      symbol: "$",
      name: "US Dollar",
      code: "USD",
      decimals: 2,
      type: "fiat",
    },
    EUR: { symbol: "€", name: "Euro", code: "EUR", decimals: 2, type: "fiat" },
    GBP: {
      symbol: "£",
      name: "British Pound",
      code: "GBP",
      decimals: 2,
      type: "fiat",
    },
    JPY: {
      symbol: "¥",
      name: "Japanese Yen",
      code: "JPY",
      decimals: 0,
      type: "fiat",
    },
    CNY: {
      symbol: "¥",
      name: "Chinese Yuan",
      code: "CNY",
      decimals: 2,
      type: "fiat",
    },
    CHF: {
      symbol: "Fr",
      name: "Swiss Franc",
      code: "CHF",
      decimals: 2,
      type: "fiat",
    },
    CAD: {
      symbol: "C$",
      name: "Canadian Dollar",
      code: "CAD",
      decimals: 2,
      type: "fiat",
    },
    AUD: {
      symbol: "A$",
      name: "Australian Dollar",
      code: "AUD",
      decimals: 2,
      type: "fiat",
    },

    // Middle East & Islamic Countries
    SAR: {
      symbol: "ر.س",
      name: "Saudi Riyal",
      code: "SAR",
      decimals: 2,
      type: "fiat",
    },
    AED: {
      symbol: "د.إ",
      name: "UAE Dirham",
      code: "AED",
      decimals: 2,
      type: "fiat",
    },
    QAR: {
      symbol: "ر.ق",
      name: "Qatari Riyal",
      code: "QAR",
      decimals: 2,
      type: "fiat",
    },
    KWD: {
      symbol: "د.ك",
      name: "Kuwaiti Dinar",
      code: "KWD",
      decimals: 3,
      type: "fiat",
    },
    BHD: {
      symbol: ".د.ب",
      name: "Bahraini Dinar",
      code: "BHD",
      decimals: 3,
      type: "fiat",
    },
    OMR: {
      symbol: "ر.ع.",
      name: "Omani Rial",
      code: "OMR",
      decimals: 3,
      type: "fiat",
    },
    JOD: {
      symbol: "د.ا",
      name: "Jordanian Dinar",
      code: "JOD",
      decimals: 3,
      type: "fiat",
    },
    EGP: {
      symbol: "ج.م",
      name: "Egyptian Pound",
      code: "EGP",
      decimals: 2,
      type: "fiat",
    },
    PKR: {
      symbol: "₨",
      name: "Pakistani Rupee",
      code: "PKR",
      decimals: 2,
      type: "fiat",
    },
    BDT: {
      symbol: "৳",
      name: "Bangladeshi Taka",
      code: "BDT",
      decimals: 2,
      type: "fiat",
    },
    IRR: {
      symbol: "﷼",
      name: "Iranian Rial",
      code: "IRR",
      decimals: 2,
      type: "fiat",
    },
    TRY: {
      symbol: "₺",
      name: "Turkish Lira",
      code: "TRY",
      decimals: 2,
      type: "fiat",
    },
    IDR: {
      symbol: "Rp",
      name: "Indonesian Rupiah",
      code: "IDR",
      decimals: 2,
      type: "fiat",
    },
    MYR: {
      symbol: "RM",
      name: "Malaysian Ringgit",
      code: "MYR",
      decimals: 2,
      type: "fiat",
    },

    // Asian Currencies
    INR: {
      symbol: "₹",
      name: "Indian Rupee",
      code: "INR",
      decimals: 2,
      type: "fiat",
    },
    KRW: {
      symbol: "₩",
      name: "South Korean Won",
      code: "KRW",
      decimals: 0,
      type: "fiat",
    },
    THB: {
      symbol: "฿",
      name: "Thai Baht",
      code: "THB",
      decimals: 2,
      type: "fiat",
    },
    VND: {
      symbol: "₫",
      name: "Vietnamese Dong",
      code: "VND",
      decimals: 0,
      type: "fiat",
    },
    SGD: {
      symbol: "S$",
      name: "Singapore Dollar",
      code: "SGD",
      decimals: 2,
      type: "fiat",
    },
    HKD: {
      symbol: "HK$",
      name: "Hong Kong Dollar",
      code: "HKD",
      decimals: 2,
      type: "fiat",
    },
    TWD: {
      symbol: "NT$",
      name: "Taiwan Dollar",
      code: "TWD",
      decimals: 2,
      type: "fiat",
    },

    // Latin American Currencies
    MXN: {
      symbol: "$",
      name: "Mexican Peso",
      code: "MXN",
      decimals: 2,
      type: "fiat",
    },
    BRL: {
      symbol: "R$",
      name: "Brazilian Real",
      code: "BRL",
      decimals: 2,
      type: "fiat",
    },
    ARS: {
      symbol: "$",
      name: "Argentine Peso",
      code: "ARS",
      decimals: 2,
      type: "fiat",
    },
    CLP: {
      symbol: "$",
      name: "Chilean Peso",
      code: "CLP",
      decimals: 0,
      type: "fiat",
    },
    COP: {
      symbol: "$",
      name: "Colombian Peso",
      code: "COP",
      decimals: 2,
      type: "fiat",
    },
    PEN: {
      symbol: "S/",
      name: "Peruvian Sol",
      code: "PEN",
      decimals: 2,
      type: "fiat",
    },

    // African Currencies
    ZAR: {
      symbol: "R",
      name: "South African Rand",
      code: "ZAR",
      decimals: 2,
      type: "fiat",
    },
    NGN: {
      symbol: "₦",
      name: "Nigerian Naira",
      code: "NGN",
      decimals: 2,
      type: "fiat",
    },
    KES: {
      symbol: "KSh",
      name: "Kenyan Shilling",
      code: "KES",
      decimals: 2,
      type: "fiat",
    },
    GHS: {
      symbol: "₵",
      name: "Ghanaian Cedi",
      code: "GHS",
      decimals: 2,
      type: "fiat",
    },

    // Cryptocurrencies
    BTC: {
      symbol: "₿",
      name: "Bitcoin",
      code: "BTC",
      decimals: 8,
      type: "crypto",
    },
    ETH: {
      symbol: "Ξ",
      name: "Ethereum",
      code: "ETH",
      decimals: 18,
      type: "crypto",
    },
    USDC: {
      symbol: "USDC",
      name: "USD Coin",
      code: "USDC",
      decimals: 6,
      type: "crypto",
    },
    USDT: {
      symbol: "USDT",
      name: "Tether",
      code: "USDT",
      decimals: 6,
      type: "crypto",
    },
    BNB: {
      symbol: "BNB",
      name: "Binance Coin",
      code: "BNB",
      decimals: 18,
      type: "crypto",
    },
    MATIC: {
      symbol: "MATIC",
      name: "Polygon",
      code: "MATIC",
      decimals: 18,
      type: "crypto",
    },
  },

  // Regional Settings
  regions: {
    US: {
      code: "US",
      name: "United States",
      currency: "USD",
      timeZone: "America/New_York",
      dateFormat: "MM/dd/yyyy",
      numberFormat: "en-US",
      markets: ["NYSE", "NASDAQ"],
    },
    GB: {
      code: "GB",
      name: "United Kingdom",
      currency: "GBP",
      timeZone: "Europe/London",
      dateFormat: "dd/MM/yyyy",
      numberFormat: "en-GB",
      markets: ["LSE"],
    },
    EU: {
      code: "EU",
      name: "European Union",
      currency: "EUR",
      timeZone: "Europe/Brussels",
      dateFormat: "dd.MM.yyyy",
      numberFormat: "de-DE",
      markets: ["EURONEXT", "XETRA"],
    },
    SA: {
      code: "SA",
      name: "Saudi Arabia",
      currency: "SAR",
      timeZone: "Asia/Riyadh",
      dateFormat: "dd/MM/yyyy",
      numberFormat: "ar-SA",
      markets: ["TADAWUL"],
    },
    AE: {
      code: "AE",
      name: "United Arab Emirates",
      currency: "AED",
      timeZone: "Asia/Dubai",
      dateFormat: "dd/MM/yyyy",
      numberFormat: "ar-AE",
      markets: ["DFM", "ADX"],
    },
    CN: {
      code: "CN",
      name: "China",
      currency: "CNY",
      timeZone: "Asia/Shanghai",
      dateFormat: "yyyy-MM-dd",
      numberFormat: "zh-CN",
      markets: ["SSE", "SZSE"],
    },
    JP: {
      code: "JP",
      name: "Japan",
      currency: "JPY",
      timeZone: "Asia/Tokyo",
      dateFormat: "yyyy/MM/dd",
      numberFormat: "ja-JP",
      markets: ["TSE"],
    },
    IN: {
      code: "IN",
      name: "India",
      currency: "INR",
      timeZone: "Asia/Kolkata",
      dateFormat: "dd-MM-yyyy",
      numberFormat: "en-IN",
      markets: ["NSE", "BSE"],
    },
    ID: {
      code: "ID",
      name: "Indonesia",
      currency: "IDR",
      timeZone: "Asia/Jakarta",
      dateFormat: "dd/MM/yyyy",
      numberFormat: "id-ID",
      markets: ["IDX"],
    },
    MY: {
      code: "MY",
      name: "Malaysia",
      currency: "MYR",
      timeZone: "Asia/Kuala_Lumpur",
      dateFormat: "dd/MM/yyyy",
      numberFormat: "ms-MY",
      markets: ["BURSA"],
    },
  },

  // Cultural and Religious Preferences
  culturalFrameworks: {
    islamic: {
      name: "Islamic Finance",
      principles: [
        "No interest (Riba)",
        "No gambling (Maysir)",
        "No excessive uncertainty (Gharar)",
        "Asset-backed",
        "Profit and loss sharing",
      ],
      currencies: [
        "SAR",
        "AED",
        "QAR",
        "KWD",
        "BHD",
        "OMR",
        "PKR",
        "BDT",
        "IDR",
        "MYR",
      ],
      languages: ["ar", "ur", "fa", "id", "ms"],
      calendar: "hijri",
      prayerTimes: true,
      halalCertification: true,
    },
    esg: {
      name: "ESG (Environmental, Social, Governance)",
      principles: [
        "Environmental responsibility",
        "Social impact",
        "Good governance",
        "Sustainability",
        "Ethical business practices",
      ],
      languages: ["en", "fr", "de", "es", "it", "pt"],
      reporting: ["GRI", "SASB", "TCFD"],
      certifications: ["B-Corp", "ISO14001", "SA8000"],
    },
    christian: {
      name: "Christian Values",
      principles: [
        "Stewardship",
        "Social justice",
        "Human dignity",
        "Care for creation",
        "Ethical business",
      ],
      excludedSectors: [
        "gambling",
        "tobacco",
        "alcohol",
        "weapons",
        "adult-entertainment",
      ],
      languages: ["en", "es", "pt", "fr", "it"],
    },
    buddhist: {
      name: "Buddhist Ethics",
      principles: [
        "Non-harm (Ahimsa)",
        "Right livelihood",
        "Compassion",
        "Mindful consumption",
        "Environmental harmony",
      ],
      excludedSectors: [
        "weapons",
        "tobacco",
        "alcohol",
        "gambling",
        "animal-testing",
      ],
      languages: ["zh", "ja", "ko", "th", "vi"],
    },
    indigenous: {
      name: "Indigenous Values",
      principles: [
        "Seven generations thinking",
        "Land stewardship",
        "Community ownership",
        "Traditional knowledge",
        "Cultural preservation",
      ],
      focus: [
        "land-rights",
        "cultural-preservation",
        "sustainable-development",
        "community-ownership",
      ],
      languages: ["en", "es", "pt", "fr"],
    },
  },

  // Number and Date Formatting
  formatting: {
    largeNumbers: {
      en: { thousand: "K", million: "M", billion: "B", trillion: "T" },
      ar: {
        thousand: "ألف",
        million: "مليون",
        billion: "مليار",
        trillion: "تريليون",
      },
      zh: {
        thousand: "千",
        million: "百万",
        billion: "十亿",
        trillion: "万亿",
      },
      es: { thousand: "K", million: "M", billion: "MM", trillion: "B" },
      fr: { thousand: "K", million: "M", billion: "Md", trillion: "B" },
    },
    percentages: {
      precision: 2,
      showPlus: true,
    },
    dates: {
      relative: true,
      includeTime: true,
    },
  },

  // Translation Configuration
  translation: {
    enabled: true,
    service: "internal", // 'google', 'azure', 'internal'
    fallbackLanguage: "en",
    autoDetect: true,
    cacheTranslations: true,
    namespaces: [
      "common",
      "navigation",
      "auth",
      "dashboard",
      "investment",
      "portfolio",
      "risk",
      "cultural",
      "education",
      "errors",
    ],
  },

  // Time Zones
  timeZones: {
    "America/New_York": "Eastern Time (US)",
    "America/Chicago": "Central Time (US)",
    "America/Denver": "Mountain Time (US)",
    "America/Los_Angeles": "Pacific Time (US)",
    "Europe/London": "Greenwich Mean Time",
    "Europe/Paris": "Central European Time",
    "Europe/Berlin": "Central European Time",
    "Asia/Tokyo": "Japan Standard Time",
    "Asia/Shanghai": "China Standard Time",
    "Asia/Kolkata": "India Standard Time",
    "Asia/Dubai": "Gulf Standard Time",
    "Asia/Riyadh": "Arabia Standard Time",
    "Asia/Jakarta": "Western Indonesia Time",
    "Asia/Kuala_Lumpur": "Malaysia Time",
    "Asia/Singapore": "Singapore Time",
    "Australia/Sydney": "Australian Eastern Time",
  },
};

// Helper Functions
export const getLanguageConfig = (code: string) => {
  return localizationConfig.languages[
    code as keyof typeof localizationConfig.languages
  ];
};

export const getCurrencyConfig = (code: string) => {
  return localizationConfig.currencies[
    code as keyof typeof localizationConfig.currencies
  ];
};

export const getRegionConfig = (code: string) => {
  return localizationConfig.regions[
    code as keyof typeof localizationConfig.regions
  ];
};

export const getSupportedLanguages = () => {
  return Object.keys(localizationConfig.languages);
};

export const getSupportedCurrencies = () => {
  return Object.keys(localizationConfig.currencies);
};

export const isRTL = (languageCode: string): boolean => {
  const language = getLanguageConfig(languageCode);
  return language?.rtl || false;
};

export const getCurrenciesForRegion = (regionCode: string) => {
  const region = getRegionConfig(regionCode);
  if (!region) return [];

  // Return primary currency and other common currencies for the region
  const currencies = [region.currency];

  // Add USD and EUR as commonly accepted currencies
  if (!currencies.includes("USD")) currencies.push("USD");
  if (!currencies.includes("EUR")) currencies.push("EUR");

  return currencies;
};

export const getLanguagesForRegion = (regionCode: string) => {
  return Object.values(localizationConfig.languages)
    .filter((lang) => lang.regions.includes(regionCode))
    .map((lang) => lang.code);
};

export default localizationConfig;
