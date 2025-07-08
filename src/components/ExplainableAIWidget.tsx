import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Info,
  Languages,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { conversationalIntelligenceService } from "../services/conversationalIntelligenceService";

interface ExplainableAIWidgetProps {
  title: string;
  explanation: string;
  confidence: number;
  language?: string;
  showDetails?: boolean;
  compact?: boolean;
  context?: any;
  onLanguageChange?: (language: string) => void;
  onGetMoreDetails?: () => void;
}

export const ExplainableAIWidget: React.FC<ExplainableAIWidgetProps> = ({
  title,
  explanation,
  confidence,
  language = "en",
  showDetails = false,
  compact = false,
  context,
  onLanguageChange,
  onGetMoreDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [detailedExplanation, setDetailedExplanation] = useState<string>("");
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [translatedContent, setTranslatedContent] =
    useState<string>(explanation);
  const [availableLanguages] = useState([
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  ]);

  useEffect(() => {
    if (language !== "en") {
      translateContent();
    } else {
      setTranslatedContent(explanation);
    }
  }, [language, explanation]);

  const translateContent = async () => {
    try {
      const translated =
        await conversationalIntelligenceService.translateContent(
          explanation,
          language,
          { context: "ai_explanation", preserveFormatting: true },
        );
      setTranslatedContent(translated);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedContent(explanation);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-50";
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="h-4 w-4" />;
    if (confidence >= 0.6) return <AlertTriangle className="h-4 w-4" />;
    return <Info className="h-4 w-4" />;
  };

  const getDetailedExplanation = async () => {
    if (detailedExplanation) {
      setIsExpanded(!isExpanded);
      return;
    }

    setLoadingDetails(true);
    try {
      const detailed = await conversationalIntelligenceService.generateResponse(
        `Provide a detailed explanation of: ${explanation}. Include the reasoning, data sources, and confidence factors for a first-time investor.`,
        language,
        {
          context: "detailed_ai_explanation",
          originalContent: explanation,
          ...context,
        },
      );
      setDetailedExplanation(detailed);
      setIsExpanded(true);
    } catch (error) {
      console.error("Failed to get detailed explanation:", error);
      setDetailedExplanation(
        "Detailed explanation is currently unavailable. The AI system is analyzing multiple factors including market trends, risk assessments, and historical data to provide this recommendation.",
      );
      setIsExpanded(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }

    // Translate both explanations if detailed is available
    if (detailedExplanation && newLanguage !== "en") {
      try {
        const translatedDetailed =
          await conversationalIntelligenceService.translateContent(
            detailedExplanation,
            newLanguage,
            { context: "detailed_ai_explanation" },
          );
        setDetailedExplanation(translatedDetailed);
      } catch (error) {
        console.error("Failed to translate detailed explanation:", error);
      }
    }
  };

  if (compact) {
    return (
      <div className="border rounded-lg p-3 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-2">
          <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-blue-900">{title}</span>
              <Badge className={`text-xs ${getConfidenceColor(confidence)}`}>
                {getConfidenceIcon(confidence)}
                <span className="ml-1">{Math.round(confidence * 100)}%</span>
              </Badge>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              {translatedContent}
            </p>
            {onGetMoreDetails && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                onClick={onGetMoreDetails}
              >
                Learn more
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge className={getConfidenceColor(confidence)}>
              {getConfidenceIcon(confidence)}
              <span className="ml-1">
                AI Confidence: {Math.round(confidence * 100)}%
              </span>
            </Badge>
          </div>

          {/* Language Selector */}
          {availableLanguages.length > 1 && (
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-background"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <CardDescription className="text-sm text-blue-700">
          AI-powered explanation in your language
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-relaxed">{translatedContent}</p>
          </div>
        </div>

        {/* Confidence Breakdown */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Based on: Market data, risk analysis, and personalized factors
          </span>
          <span>
            Updated:{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Expandable Detailed Explanation */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={getDetailedExplanation}
              disabled={loadingDetails}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {loadingDetails
                  ? "Loading detailed analysis..."
                  : "Show detailed AI reasoning"}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            {detailedExplanation && (
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Detailed AI Analysis
                </h4>
                <div className="text-sm leading-relaxed text-blue-800 space-y-2">
                  {detailedExplanation
                    .split("\n")
                    .map(
                      (paragraph, index) =>
                        paragraph.trim() && <p key={index}>{paragraph}</p>,
                    )}
                </div>

                <div className="mt-4 pt-3 border-t border-blue-100">
                  <div className="flex items-center gap-4 text-xs text-blue-600">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Real-time analysis
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Market-validated
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      Personalized for you
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Info className="h-3 w-3 mr-1" />
            More about this AI model
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Languages className="h-3 w-3 mr-1" />
            Improve translation
          </Button>
          {onGetMoreDetails && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={onGetMoreDetails}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Related insights
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
