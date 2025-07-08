/**
 * MythicGuide AI Advisor System
 * GPT-powered guidance with cultural wisdom integration
 */

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Star,
  Heart,
  Globe,
  Book,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Clock,
  MessageCircle,
  Sparkles,
  Brain,
  Zap,
  Eye,
  Download,
  Share,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    category?: string;
    confidence?: number;
    sources?: string[];
    culturalContext?: string;
    ritualSuggestion?: string;
  };
}

interface AIPersonality {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  culturalBackground: string;
  avatar: string;
  description: string;
  greeting: string;
}

interface ConversationContext {
  userProfile: {
    investmentGoals: string[];
    culturalBackground: string;
    riskTolerance: string;
    timeHorizon: string;
  };
  currentFocus: string;
  sessionTopics: string[];
}

const MythicGuideAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState("sankofa");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPersonalities, setShowPersonalities] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [personalities] = useState<AIPersonality[]>([
    {
      id: "sankofa",
      name: "Sankofa",
      title: "The Wisdom Keeper",
      specialization: [
        "Cultural Investment",
        "Legacy Building",
        "Ancestral Wisdom",
      ],
      culturalBackground: "West African (Akan)",
      avatar: "🦅",
      description:
        "Combines ancient Akan wisdom with modern investment strategies, specializing in cultural preservation and legacy building.",
      greeting:
        "Greetings, seeker of wisdom. I am Sankofa, keeper of ancient knowledge and modern prosperity. How may I guide your journey today?",
    },
    {
      id: "pachamama",
      name: "Pachamama",
      title: "The Earth Mother",
      specialization: [
        "Environmental Impact",
        "Sustainable Investing",
        "Ecological Harmony",
      ],
      culturalBackground: "Andean (Quechua)",
      avatar: "🌍",
      description:
        "Embodies the wisdom of Pachamama, focusing on investments that honor the Earth and create sustainable abundance.",
      greeting:
        "Welcome, child of the Earth. I am Pachamama's voice in the digital realm. Let us explore investments that heal our planet together.",
    },
    {
      id: "kitsune",
      name: "Kitsune",
      title: "The Strategic Fox",
      specialization: [
        "Market Analysis",
        "Strategic Planning",
        "Risk Management",
      ],
      culturalBackground: "Japanese (Shinto)",
      avatar: "🦊",
      description:
        "Nine-tailed wisdom meets modern portfolio theory. Specializes in strategic thinking and long-term market analysis.",
      greeting:
        "Honored investor, I am Kitsune, your strategic guide through the markets. My tails have seen many cycles - shall we begin?",
    },
    {
      id: "thunderbird",
      name: "Thunderbird",
      title: "The Vision Seeker",
      specialization: [
        "Innovation Investing",
        "Future Trends",
        "Technological Harmony",
      ],
      culturalBackground: "Native American (Plains)",
      avatar: "⚡",
      description:
        "Soars above market noise to spot future opportunities. Balances technological innovation with traditional wisdom.",
      greeting:
        "Great spirit guides your path here. I am Thunderbird, seeker of tomorrow's opportunities. What vision shall we pursue?",
    },
  ]);

  const [context] = useState<ConversationContext>({
    userProfile: {
      investmentGoals: [
        "Sustainable Growth",
        "Cultural Impact",
        "Legacy Building",
      ],
      culturalBackground: "Global Citizen",
      riskTolerance: "Moderate",
      timeHorizon: "Long-term (10+ years)",
    },
    currentFocus: "Portfolio Optimization",
    sessionTopics: [
      "ESG Investing",
      "Cultural Preservation",
      "Yield Optimization",
    ],
  });

  const currentPersonality =
    personalities.find((p) => p.id === selectedPersonality) || personalities[0];

  useEffect(() => {
    // Initialize conversation with greeting
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          type: "ai",
          content: currentPersonality.greeting,
          timestamp: new Date().toISOString(),
          metadata: {
            category: "greeting",
            confidence: 100,
            culturalContext: currentPersonality.culturalBackground,
          },
        },
      ]);
    }
  }, [selectedPersonality]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, currentPersonality);
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (
    userInput: string,
    personality: AIPersonality,
  ): Message => {
    // Simulate intelligent AI response based on personality and context
    const responses = {
      sankofa: [
        "The ancestors whisper wisdom about your portfolio... Consider investments that honor both profit and purpose. Have you explored cultural preservation funds?",
        "In the tradition of Sankofa, we must look back to move forward. Your investment history shows strength - let's build upon these foundations.",
        "The golden stool of wisdom suggests diversifying into heritage assets. Cultural NFTs and traditional craft cooperatives align with your values.",
      ],
      pachamama: [
        "Mother Earth rewards those who invest in her healing. I see opportunities in regenerative agriculture and clean energy that match your risk profile.",
        "The mountain spirits suggest patience with your ESG portfolio. Sustainable investments grow like ancient trees - slowly but with deep roots.",
        "Your portfolio lacks harmony with nature. Consider divesting from extractive industries and flowing capital toward renewable solutions.",
      ],
      kitsune: [
        "My nine tails sense market turbulence ahead. Your current allocation should weather the storm, but consider hedging with precious metals.",
        "Strategic patience is the fox's virtue. The market cycle suggests accumulating quality assets during this correction phase.",
        "Like a fox hunting in winter, timing is everything. The technical analysis reveals optimal entry points in emerging markets next quarter.",
      ],
      thunderbird: [
        "The vision shows breakthrough technologies on the horizon. Your innovation allocation should include quantum computing and biotech sectors.",
        "Flying above the clouds of market noise, I see AI and renewable energy converging. This intersection holds great promise for your portfolio.",
        "The thunder speaks of disruption coming to traditional finance. Prepare by increasing exposure to DeFi and blockchain infrastructure.",
      ],
    };

    const personalityResponses =
      responses[personality.id as keyof typeof responses];
    const randomResponse =
      personalityResponses[
        Math.floor(Math.random() * personalityResponses.length)
      ];

    // Determine category based on keywords
    let category = "general";
    if (
      userInput.toLowerCase().includes("ritual") ||
      userInput.toLowerCase().includes("yield")
    ) {
      category = "ritual";
    } else if (
      userInput.toLowerCase().includes("invest") ||
      userInput.toLowerCase().includes("portfolio")
    ) {
      category = "investment";
    } else if (
      userInput.toLowerCase().includes("culture") ||
      userInput.toLowerCase().includes("heritage")
    ) {
      category = "cultural";
    }

    return {
      id: Date.now().toString(),
      type: "ai",
      content: randomResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        category,
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        sources: ["Traditional Wisdom", "Market Analysis", "Cultural Studies"],
        culturalContext: personality.culturalBackground,
        ritualSuggestion:
          category === "ritual" ? "Tree Planting Ceremony" : undefined,
      },
    };
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const handleTextToSpeech = (message: string) => {
    setIsSpeaking(!isSpeaking);
    // Text-to-speech implementation would go here
  };

  const getMessageIcon = (type: string, category?: string) => {
    if (type === "user") return <Users className="h-4 w-4 text-blue-600" />;

    switch (category) {
      case "ritual":
        return <Heart className="h-4 w-4 text-pink-600" />;
      case "investment":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "cultural":
        return <Star className="h-4 w-4 text-purple-600" />;
      default:
        return <Bot className="h-4 w-4 text-orange-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Bot className="h-8 w-8 text-orange-600" />
            MythicGuide AI Advisor
          </h2>
          <p className="text-gray-600 mt-2">
            GPT-powered guidance with cultural wisdom integration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Chat
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* AI Personality Selector */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Personality
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPersonalities(!showPersonalities)}
            >
              {showPersonalities ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{currentPersonality.avatar}</div>
            <div>
              <h3 className="font-semibold">{currentPersonality.name}</h3>
              <p className="text-sm text-gray-600">
                {currentPersonality.title}
              </p>
              <div className="flex gap-1 mt-1">
                {currentPersonality.specialization.map((spec, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {showPersonalities && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t">
              {personalities.map((personality) => (
                <div
                  key={personality.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPersonality === personality.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPersonality(personality.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{personality.avatar}</div>
                    <div>
                      <p className="font-medium">{personality.name}</p>
                      <p className="text-xs text-gray-600">
                        {personality.culturalBackground}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-96">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  {message.type === "user" ? (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">
                        {currentPersonality.avatar}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`flex-1 max-w-xs lg:max-w-md ${
                    message.type === "user" ? "text-right" : ""
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.metadata && message.type === "ai" && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs">
                          {getMessageIcon(
                            message.type,
                            message.metadata.category,
                          )}
                          <span>
                            Confidence: {message.metadata.confidence}%
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTextToSpeech(message.content)}
                          >
                            {isSpeaking ? (
                              <VolumeX className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">
                    {currentPersonality.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
                      <span className="text-sm text-gray-600">
                        Consulting the spirits...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for guidance on investments, rituals, or cultural wisdom..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={handleVoiceInput}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-600" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Context & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Investment Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Investment Goals
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {context.userProfile.investmentGoals.map((goal, idx) => (
                    <Badge key={idx} variant="outline">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Risk Tolerance
                </p>
                <p className="text-sm">{context.userProfile.riskTolerance}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Time Horizon
                </p>
                <p className="text-sm">{context.userProfile.timeHorizon}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Current Focus
                </p>
                <Badge className="bg-blue-100 text-blue-800">
                  {context.currentFocus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Suggested Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "How can I optimize my ritual yield performance?",
                "What are the best cultural preservation investments?",
                "Guide me through sustainable portfolio rebalancing",
                "Explain the connection between ESG and spiritual investing",
                "What rituals align with my investment goals?",
                "How do I increase my cultural impact score?",
              ].map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3"
                  onClick={() => setInputValue(suggestion)}
                >
                  <span className="text-sm">{suggestion}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MythicGuideAI;
