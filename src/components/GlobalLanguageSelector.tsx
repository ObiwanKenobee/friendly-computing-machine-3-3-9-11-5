import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { globalLanguageService } from "../services/globalLanguageService";
import { regionalSovereigntyService } from "../services/regionalSovereigntyService";
import {
  LanguageSovereignty,
  RegionalConfig,
  InnovationCycle,
} from "../types/GlobalLanguage";
import {
  Globe2,
  Search,
  MapPin,
  Users,
  Crown,
  Calendar,
  Heart,
  Sparkles,
  TreePine,
  Star,
  ArrowRight,
  Volume2,
  Eye,
  Hand,
  Brain,
  Zap,
  Target,
} from "lucide-react";

interface GlobalLanguageSelectorProps {
  onLanguageSelect?: (language: LanguageSovereignty) => void;
  onRegionSelect?: (region: RegionalConfig) => void;
  showRegionalContext?: boolean;
  showInnovationCycle?: boolean;
  compact?: boolean;
}

const GlobalLanguageSelector: React.FC<GlobalLanguageSelectorProps> = ({
  onLanguageSelect,
  onRegionSelect,
  showRegionalContext = true,
  showInnovationCycle = true,
  compact = false,
}) => {
  const [selectedTab, setSelectedTab] = useState("languages");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageSovereignty | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionalConfig | null>(
    null,
  );
  const [allLanguages, setAllLanguages] = useState<LanguageSovereignty[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<
    LanguageSovereignty[]
  >([]);
  const [innovationCycle, setInnovationCycle] =
    useState<InnovationCycle | null>(null);
  const [languagesByContinent, setLanguagesByContinent] = useState<
    Record<string, LanguageSovereignty[]>
  >({});

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    filterLanguages();
  }, [filterLanguages]);

  useEffect(() => {
    if (selectedLanguage && onLanguageSelect) {
      onLanguageSelect(selectedLanguage);
    }
  }, [selectedLanguage, onLanguageSelect]);

  useEffect(() => {
    if (selectedRegion && onRegionSelect) {
      onRegionSelect(selectedRegion);
    }
  }, [selectedRegion, onRegionSelect]);

  const initializeData = () => {
    const languages = globalLanguageService.getAllLanguages();
    const currentLanguage = globalLanguageService.getCurrentLanguage();
    const currentRegion = globalLanguageService.getCurrentRegion();
    const currentCycle = globalLanguageService.getCurrentInnovationCycle();

    setAllLanguages(languages);
    setSelectedLanguage(currentLanguage);
    setSelectedRegion(currentRegion);
    setInnovationCycle(currentCycle);

    // Group languages by continent
    const continentGroups: Record<string, LanguageSovereignty[]> = {};
    for (const language of languages) {
      for (const territory of language.sovereignTerritories) {
        const sovereignTerritory =
          regionalSovereigntyService.getSovereignTerritory(territory);
        if (sovereignTerritory) {
          const continent = sovereignTerritory.continent;
          if (!continentGroups[continent]) {
            continentGroups[continent] = [];
          }
          if (
            !continentGroups[continent].some((l) => l.code === language.code)
          ) {
            continentGroups[continent].push(language);
          }
        }
      }
    }
    setLanguagesByContinent(continentGroups);
  };

  const filterLanguages = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredLanguages(allLanguages);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allLanguages.filter(
      (language) =>
        language.name.toLowerCase().includes(query) ||
        language.nativeName.toLowerCase().includes(query) ||
        language.family.toLowerCase().includes(query) ||
        language.sovereignTerritories.some((territory) =>
          territory.toLowerCase().includes(query),
        ),
    );
    setFilteredLanguages(filtered);
  }, [searchQuery, allLanguages]);

  const handleLanguageSelect = async (language: LanguageSovereignty) => {
    setSelectedLanguage(language);
    const success = await globalLanguageService.switchLanguage(language.code);

    if (success) {
      const newRegion = globalLanguageService.getCurrentRegion();
      const newCycle = globalLanguageService.getCurrentInnovationCycle();
      setSelectedRegion(newRegion);
      setInnovationCycle(newCycle);
    }
  };

  const getLanguageBadgeColor = (language: LanguageSovereignty) => {
    if (language.speakers > 500000000) return "bg-blue-500";
    if (language.speakers > 100000000) return "bg-green-500";
    if (language.speakers > 10000000) return "bg-yellow-500";
    if (language.speakers > 1000000) return "bg-orange-500";
    return "bg-purple-500";
  };

  const formatSpeakerCount = (count: number): string => {
    if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
        >
          <Globe2 className="h-4 w-4 mr-2" />
          {selectedLanguage?.nativeName || "Select Language"}
        </Button>
        {selectedRegion && (
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {selectedRegion.name}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/60 border-slate-600 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center">
          <Globe2 className="h-8 w-8 mr-3 text-blue-400" />
          Global Language Sovereignty
        </CardTitle>
        <CardDescription className="text-gray-300">
          Choose from 7,000+ living languages with full cultural and regional
          context
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 bg-slate-700 mb-6">
            <TabsTrigger
              value="languages"
              className="data-[state=active]:bg-blue-600"
            >
              <Users className="h-4 w-4 mr-2" />
              Languages
            </TabsTrigger>
            <TabsTrigger
              value="regions"
              className="data-[state=active]:bg-green-600"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Regions
            </TabsTrigger>
            <TabsTrigger
              value="innovation"
              className="data-[state=active]:bg-purple-600"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Innovation
            </TabsTrigger>
            <TabsTrigger
              value="context"
              className="data-[state=active]:bg-orange-600"
            >
              <Brain className="h-4 w-4 mr-2" />
              Context
            </TabsTrigger>
          </TabsList>

          <TabsContent value="languages" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search languages, territories, or families..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-4">
                {Object.entries(languagesByContinent).map(
                  ([continent, languages]) => (
                    <div key={continent} className="space-y-2">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <TreePine className="h-5 w-5 mr-2 text-green-400" />
                        {continent}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {languages
                          .filter(
                            (lang) =>
                              !searchQuery ||
                              filteredLanguages.some(
                                (fl) => fl.code === lang.code,
                              ),
                          )
                          .slice(0, 10)
                          .map((language) => (
                            <div
                              key={language.code}
                              className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                                selectedLanguage?.code === language.code
                                  ? "border-blue-500 bg-blue-500/20"
                                  : "border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700"
                              }`}
                              onClick={() => handleLanguageSelect(language)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${getLanguageBadgeColor(language)}`}
                                  />
                                  <span className="font-semibold text-white">
                                    {language.nativeName}
                                  </span>
                                </div>
                                {language.direction === "rtl" && (
                                  <Badge variant="outline" className="text-xs">
                                    RTL
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-gray-400 mb-2">
                                {language.name}
                              </p>

                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                  {language.family}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="bg-slate-600"
                                >
                                  {formatSpeakerCount(language.speakers)}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-1 mt-2">
                                {language.sovereignTerritories
                                  .slice(0, 3)
                                  .map((territory) => (
                                    <Badge
                                      key={territory}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {territory}
                                    </Badge>
                                  ))}
                                {language.sovereignTerritories.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{language.sovereignTerritories.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="regions" className="space-y-6">
            {showRegionalContext && selectedRegion && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                    {selectedRegion.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Regional sovereignty and cultural context
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Sovereign Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegion.sovereignLanguages.map((langCode) => {
                        const language = allLanguages.find(
                          (l) => l.code === langCode,
                        );
                        return language ? (
                          <Badge
                            key={langCode}
                            variant="outline"
                            className="text-blue-400 border-blue-400"
                          >
                            {language.nativeName}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Cultural Priorities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegion.culturalPriorities.map((priority) => (
                        <Badge
                          key={priority}
                          variant="secondary"
                          className="bg-green-600"
                        >
                          {priority}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        Economic Model
                      </h4>
                      <p className="text-sm text-gray-300">
                        {selectedRegion.economicModel}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        Governance
                      </h4>
                      <p className="text-sm text-gray-300">
                        {selectedRegion.governanceStyle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="innovation" className="space-y-6">
            {showInnovationCycle && innovationCycle && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-purple-400" />
                    {innovationCycle.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Regional innovation cycle and cultural values
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Current Phase
                    </h4>
                    <Badge className="bg-purple-600 text-white">
                      {innovationCycle.currentPhase}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Innovation Phases
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {innovationCycle.phases.map((phase, index) => (
                        <div
                          key={phase}
                          className={`p-2 rounded border text-sm ${
                            phase === innovationCycle.currentPhase
                              ? "border-purple-500 bg-purple-500/20 text-purple-300"
                              : "border-slate-600 bg-slate-700/50 text-gray-300"
                          }`}
                        >
                          {index + 1}. {phase}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Cultural Values
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {innovationCycle.culturalValues.map((value) => (
                        <Badge
                          key={value}
                          variant="outline"
                          className="text-yellow-400 border-yellow-400"
                        >
                          <Heart className="h-3 w-3 mr-1" />
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Duration: {innovationCycle.duration}
                    </span>
                    <span className="text-sm text-gray-400">
                      Started: {innovationCycle.startDate.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="context" className="space-y-6">
            {selectedLanguage && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-white flex items-center">
                    <Target className="h-5 w-5 mr-2 text-orange-400" />
                    Cultural Context: {selectedLanguage.nativeName}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Cultural adaptation and interaction patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Writing System
                      </h4>
                      <p className="text-sm text-gray-300">
                        {selectedLanguage.writingSystem}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Hand className="h-4 w-4 mr-2" />
                        Direction
                      </h4>
                      <p className="text-sm text-gray-300">
                        {selectedLanguage.direction === "rtl"
                          ? "Right to Left"
                          : "Left to Right"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Cultural Context
                    </h4>
                    <Badge variant="secondary" className="bg-orange-600">
                      {selectedLanguage.culturalContext}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Economic Model
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-green-400 border-green-400"
                    >
                      {selectedLanguage.economicModel}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Innovation Approach
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-purple-400 border-purple-400"
                    >
                      {selectedLanguage.innovationCycle}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-gray-400">
                      Language Family: {selectedLanguage.family} →{" "}
                      {selectedLanguage.subfamily}
                    </span>
                    <Badge className="bg-blue-600">
                      {formatSpeakerCount(selectedLanguage.speakers)} speakers
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {selectedLanguage && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-300">
                Language sovereignty enabled for{" "}
                {selectedLanguage.sovereignTerritories.length} territories
              </span>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
              <Star className="h-4 w-4 mr-2" />
              Apply Language Settings
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalLanguageSelector;
