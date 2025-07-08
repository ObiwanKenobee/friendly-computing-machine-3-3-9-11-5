/**
 * Age Switcher Component for QuantumVest Enterprise
 * Allows users to select their age range for personalized investment recommendations
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Calendar,
  TrendingUp,
  Shield,
  Target,
  Info,
  ChevronDown,
  Check,
  Sparkles,
  Timer,
  DollarSign,
  BarChart3,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgeContext } from "../hooks/useAgeContext";
import {
  useAgeInvestmentStrategies,
  useAgeBasedUI,
} from "../hooks/useAgeContext";
import { AgeRange } from "../types/Age";
import { AGE_PROFILES } from "../utils/ageInvestmentStrategies";

interface AgeSwitcherProps {
  variant?: "header" | "standalone" | "compact" | "onboarding";
  showRecommendations?: boolean;
  showStrategies?: boolean;
  onAgeSelected?: (age: AgeRange) => void;
  className?: string;
}

const AgeSwitcher: React.FC<AgeSwitcherProps> = ({
  variant = "header",
  showRecommendations = true,
  showStrategies = false,
  onAgeSelected,
  className,
}) => {
  const { currentAge, setAge, profile } = useAgeContext();
  const { getTopStrategy, getLegendaryInvestorRecommendation } =
    useAgeInvestmentStrategies();
  const { getColorScheme, getMotivationalMessage, ageIcon } = useAgeBasedUI();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAge, setSelectedAge] = useState<AgeRange | null>(currentAge);

  const colorScheme = getColorScheme();
  const motivationalMessage = getMotivationalMessage();
  const topStrategy = getTopStrategy();
  const legendaryRecommendation = getLegendaryInvestorRecommendation();

  useEffect(() => {
    setSelectedAge(currentAge);
  }, [currentAge]);

  const handleAgeSelection = (age: AgeRange) => {
    setSelectedAge(age);
    setAge(age);
    setIsOpen(false);
    onAgeSelected?.(age);
  };

  const ageOptions = Object.values(AGE_PROFILES);

  // Compact Header Variant
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Select value={currentAge || ""} onValueChange={handleAgeSelection}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue placeholder="Age" />
          </SelectTrigger>
          <SelectContent>
            {ageOptions.map((option) => (
              <SelectItem key={option.range} value={option.range}>
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.range}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentAge && (
          <Badge variant="outline" className="text-xs">
            {AGE_PROFILES[currentAge].label}
          </Badge>
        )}
      </div>
    );
  }

  // Header Variant
  if (variant === "header") {
    return (
      <TooltipProvider>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              className={cn(
                "w-48 justify-between border-2 transition-all duration-300",
                currentAge && "border-blue-500 bg-blue-50",
                className,
              )}
              style={{
                borderColor: currentAge ? colorScheme.primary : undefined,
                backgroundColor: currentAge
                  ? `${colorScheme.primary}10`
                  : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                {currentAge ? (
                  <>
                    <span className="text-lg">{ageIcon}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">
                        {AGE_PROFILES[currentAge].label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {currentAge}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    <span>Select Age Range</span>
                  </>
                )}
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search age range..." />
              <CommandEmpty>No age range found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {ageOptions.map((option) => (
                    <CommandItem
                      key={option.range}
                      value={option.range}
                      onSelect={() => handleAgeSelection(option.range)}
                      className="flex items-center gap-3 p-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl">{option.icon}</span>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {option.range}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {option.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: option.colors.primary }}
                        >
                          {option.characteristics.riskTolerance}
                        </Badge>
                        {currentAge === option.range && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    );
  }

  // Onboarding Variant
  if (variant === "onboarding") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Choose Your Investment Stage</h2>
          <p className="text-muted-foreground text-lg">
            Get personalized strategies based on your life stage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ageOptions.map((option) => (
            <motion.div
              key={option.range}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() => handleAgeSelection(option.range)}
            >
              <Card
                className={cn(
                  "border-2 transition-all duration-300 hover:shadow-lg",
                  selectedAge === option.range &&
                    "border-blue-500 bg-blue-50 shadow-lg",
                )}
                style={{
                  borderColor:
                    selectedAge === option.range
                      ? colorScheme.primary
                      : undefined,
                  backgroundColor:
                    selectedAge === option.range
                      ? `${colorScheme.primary}10`
                      : undefined,
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <CardTitle className="text-lg">
                          {option.label}
                        </CardTitle>
                        <CardDescription className="font-medium">
                          Ages {option.range}
                        </CardDescription>
                      </div>
                    </div>
                    {selectedAge === option.range && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        Risk Tolerance:
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {option.characteristics.riskTolerance}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Horizon:</span>
                      <span className="text-sm">
                        {option.characteristics.investmentHorizon} years
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Growth Focus:</span>
                      <span className="text-sm">
                        {option.recommendedStrategies.growth}%
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      Primary Goals:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {option.characteristics.primaryGoals
                        .slice(0, 3)
                        .map((goal) => (
                          <Badge
                            key={goal}
                            variant="secondary"
                            className="text-xs"
                          >
                            {goal}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedAge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold">Perfect Choice!</h3>
              </div>

              <p className="text-muted-foreground mb-4">
                {motivationalMessage}
              </p>

              {legendaryRecommendation && (
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">
                      Recommended by {legendaryRecommendation.investor}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {legendaryRecommendation.relevance}/10 relevance
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {legendaryRecommendation.strategy}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Standalone Variant (default)
  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Age-Based Strategy
        </CardTitle>
        <CardDescription>
          Select your age range for personalized investment recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={currentAge || ""} onValueChange={handleAgeSelection}>
          <SelectTrigger>
            <SelectValue placeholder="Select your age range" />
          </SelectTrigger>
          <SelectContent>
            {ageOptions.map((option) => (
              <SelectItem key={option.range} value={option.range}>
                <div className="flex items-center gap-3">
                  <span>{option.icon}</span>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {option.range} • {option.characteristics.riskTolerance}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentAge && profile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Separator />

            <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-lg mb-1">{ageIcon}</div>
              <div className="font-medium">{profile.label}</div>
              <div className="text-sm text-muted-foreground">
                {profile.description}
              </div>
            </div>

            {showRecommendations && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Recommended Allocation:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-lg font-bold text-green-700">
                      {profile.recommendedStrategies.growth}%
                    </div>
                    <div className="text-xs">Growth</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-lg font-bold text-blue-700">
                      {profile.recommendedStrategies.income}%
                    </div>
                    <div className="text-xs">Income</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-lg font-bold text-gray-700">
                      {profile.recommendedStrategies.preservation}%
                    </div>
                    <div className="text-xs">Preservation</div>
                  </div>
                </div>
              </div>
            )}

            {showStrategies && topStrategy && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Top Strategy:</span>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-medium text-sm">{topStrategy.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {topStrategy.description}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {topStrategy.expectedReturn}% expected return
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Risk: {topStrategy.riskLevel}/10
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgeSwitcher;
