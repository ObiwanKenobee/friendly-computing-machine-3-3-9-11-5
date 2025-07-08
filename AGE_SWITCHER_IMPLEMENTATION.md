# Age Switcher Implementation Guide

## Overview

The Age Switcher system is a comprehensive age-based investment personalization feature for QuantumVest Enterprise. It provides users with tailored investment strategies, risk assessments, and product recommendations based on their life stage and age demographics.

## Features

### 🎯 Core Functionality

- **Age-Based Strategies**: Personalized investment recommendations for 5 distinct age groups
- **Risk Management**: Age-appropriate risk tolerance and product restrictions
- **Legendary Investor Wisdom**: Strategies adapted from Warren Buffett, Charlie Munger, Ray Dalio, and Peter Lynch
- **Regulatory Compliance**: Automatic eligibility checks and required disclosures
- **Persistent State**: User selections saved to localStorage with context preservation

### 📊 Age Groups & Characteristics

| Age Range | Label              | Risk Tolerance | Investment Horizon | Primary Focus                           |
| --------- | ------------------ | -------------- | ------------------ | --------------------------------------- |
| 18-25     | Young Professional | Aggressive     | 40 years           | Wealth accumulation, Growth             |
| 26-35     | Career Builder     | Aggressive     | 30 years           | Home ownership, Family planning         |
| 36-50     | Peak Earner        | Moderate       | 20 years           | Retirement planning, Diversification    |
| 51-65     | Pre-Retirement     | Moderate       | 15 years           | Income generation, Capital preservation |
| 65+       | Retirement         | Conservative   | 10 years           | Income focus, Legacy planning           |

### 🎨 Component Variants

1. **Header Variant**: Compact dropdown for navigation bars
2. **Standalone Variant**: Full-featured card with recommendations
3. **Compact Variant**: Minimal space-efficient selector
4. **Onboarding Variant**: Interactive selection experience for new users

## Architecture

### File Structure

```
src/
├── types/Age.d.ts                 # TypeScript definitions
├── utils/ageInvestmentStrategies.ts # Investment logic and profiles
├── contexts/AgeContext.tsx        # React context provider
├── hooks/useAgeContext.ts         # Context hooks and utilities
├── components/AgeSwitcher.tsx     # Main component
└── pages/age-switcher-demo.tsx    # Demo and documentation page
```

### Key Components

#### 1. Age Context (`AgeContext.tsx`)

- Manages global age state
- Provides age-related utilities
- Persists user preferences
- Handles compliance checks

#### 2. Age Switcher Component (`AgeSwitcher.tsx`)

- Multiple UI variants
- Smooth animations with Framer Motion
- Accessibility features
- Real-time updates

#### 3. Investment Strategies (`ageInvestmentStrategies.ts`)

- Age-specific investment portfolios
- Risk tolerance calculations
- Legendary investor focus scores
- Performance metrics

## Usage Examples

### Basic Implementation

```tsx
import AgeSwitcher from "@/components/AgeSwitcher";
import { AgeProvider } from "@/contexts/AgeContext";

// Wrap your app with AgeProvider
<AgeProvider>
  <AgeSwitcher variant="header" />
</AgeProvider>;
```

### Using Age Context

```tsx
import { useAgeContext } from "@/hooks/useAgeContext";

function MyComponent() {
  const { currentAge, profile, setAge } = useAgeContext();

  return <div>{profile && <h2>Welcome, {profile.label}!</h2>}</div>;
}
```

### Investment Strategies

```tsx
import { useAgeInvestmentStrategies } from "@/hooks/useAgeContext";

function PortfolioRecommendations() {
  const {
    getTopStrategy,
    getOptimalAllocation,
    getLegendaryInvestorRecommendation,
  } = useAgeInvestmentStrategies();

  const strategy = getTopStrategy();
  const allocation = getOptimalAllocation();

  return (
    <div>
      <h3>{strategy?.name}</h3>
      <p>Stocks: {allocation?.stocks}%</p>
    </div>
  );
}
```

### Compliance Checking

```tsx
import { useAgeCompliance } from "@/hooks/useAgeContext";

function ProductAccess({ productId }: { productId: string }) {
  const { checkProductEligibility } = useAgeCompliance();
  const eligibility = checkProductEligibility(productId, "investment");

  if (!eligibility.eligible) {
    return <div>Not eligible: {eligibility.reason}</div>;
  }

  return <div>Product available</div>;
}
```

## Investment Philosophy Integration

### Legendary Investor Focus Scores

Each age group has relevance scores (0-10) for legendary investors:

- **Warren Buffett**: Quality companies, economic moats, long-term value
- **Charlie Munger**: Mental models, rational decision-making, patience
- **Ray Dalio**: All-weather portfolio, risk management, diversification
- **Peter Lynch**: Growth opportunities, invest in what you know

### Age-Specific Strategies

#### Young Professional (18-25)

- **Growth Focus**: 80% growth, 5% income, 15% preservation
- **Top Investor**: Peter Lynch (growth opportunities)
- **Strategy**: Aggressive growth with emerging markets and technology

#### Career Builder (26-35)

- **Growth Focus**: 70% growth, 15% income, 15% preservation
- **Top Investor**: Warren Buffett (quality companies)
- **Strategy**: Quality growth with sustainable competitive advantages

#### Peak Earner (36-50)

- **Balanced Focus**: 55% growth, 30% income, 15% preservation
- **Top Investors**: Buffett & Munger (wisdom and quality)
- **Strategy**: Balanced approach with tax optimization

#### Pre-Retirement (51-65)

- **Income Focus**: 35% growth, 50% income, 15% preservation
- **Top Investor**: Ray Dalio (risk management)
- **Strategy**: Income generation with capital preservation

#### Retirement (65+)

- **Preservation Focus**: 20% growth, 60% income, 20% preservation
- **Top Investor**: Ray Dalio (risk parity)
- **Strategy**: Income focus with inflation protection

## Technical Implementation

### Dependencies

- React 18+ with Context API
- Framer Motion for animations
- Radix UI components
- Tailwind CSS for styling
- TypeScript for type safety

### Performance Optimizations

- Lazy loading of investment data
- Memoized calculations
- Optimized re-renders with React.memo
- localStorage caching

### Accessibility Features

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

## Compliance & Security

### Age Verification

- Age range validation
- Product access restrictions
- Required disclosure management
- Regulatory compliance checks

### Data Privacy

- localStorage for client-side persistence
- No sensitive data transmission
- User-controlled data retention
- GDPR compliance ready

### Product Restrictions

| Product Type         | Minimum Age | Complexity | Risk Level |
| -------------------- | ----------- | ---------- | ---------- |
| Basic ETFs           | 18          | Simple     | 3          |
| Crypto Trading       | 21          | Complex    | 9          |
| Leveraged ETFs       | 25          | Moderate   | 8          |
| Private Equity       | 30          | Complex    | 7          |
| Retirement Annuities | 45          | Moderate   | 2          |

## Demo & Testing

### Demo Page

Visit `/age-switcher-demo` to explore:

- All component variants
- Interactive age selection
- Strategy recommendations
- Compliance demonstrations
- Implementation examples

### Test Cases

- Age selection persistence
- Strategy calculations
- Compliance validation
- UI responsiveness
- Accessibility compliance

## Integration with QuantumVest Enterprise

### Platform Navigation

- Added to main navigation as demo route
- Categorized as "Free" tier feature
- Estimated 12-minute exploration time
- High popularity rating (4/5)

### Enterprise Features

- Integration with subscription tiers
- Enhanced strategies for paid users
- Advanced analytics for enterprise clients
- White-label customization options

### Future Enhancements

- Machine learning personalization
- Dynamic risk adjustment
- Real-time market adaptation
- Advanced behavioral analytics
- International regulatory compliance

## API Integration Potential

### External Data Sources

```typescript
// Future integration possibilities
interface AgeBasedAPI {
  updateMarketConditions: (age: AgeRange) => Promise<void>;
  getPersonalizedNews: (age: AgeRange) => Promise<NewsItem[]>;
  calculateRealTimeRisk: (
    age: AgeRange,
    portfolio: Portfolio,
  ) => Promise<number>;
  getAgeGroupBenchmarks: (age: AgeRange) => Promise<BenchmarkData>;
}
```

### Webhook Integration

```typescript
// Real-time updates
interface AgeContextWebhook {
  onAgeChange: (oldAge: AgeRange | null, newAge: AgeRange) => void;
  onStrategyUpdate: (age: AgeRange, newStrategy: AgeInvestmentStrategy) => void;
  onComplianceChange: (age: AgeRange, restrictions: string[]) => void;
}
```

## Conclusion

The Age Switcher system represents a significant advancement in investment personalization, combining legendary investor wisdom with modern UX design. It provides a foundation for age-aware financial services that can adapt and grow with users throughout their investment journey.

### Key Benefits

- ✅ Reduces cognitive load through age-appropriate interfaces
- ✅ Improves investment outcomes with targeted strategies
- ✅ Ensures regulatory compliance automatically
- ✅ Enhances user engagement through personalization
- ✅ Scales across different user demographics
- ✅ Integrates seamlessly with existing QuantumVest features

### Success Metrics

- User engagement time
- Strategy adoption rates
- Risk-adjusted returns
- Compliance incident reduction
- User satisfaction scores
- Conversion rate improvements

This implementation serves as both a functional feature and a demonstration of QuantumVest's commitment to personalized, responsible investment management.
