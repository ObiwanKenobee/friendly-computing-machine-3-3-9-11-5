import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import {
  Brain,
  AlertTriangle,
  Shield,
  Target,
  Lightbulb,
  CheckCircle,
  X,
  Eye,
  Users,
} from "lucide-react";
import { mungerMentalModelsService } from "../../services/mungerMentalModelsService";
import type {
  MentalModel,
  InversionAnalysis,
  AvoidFailureIntent,
  RedTeamChallenge,
  LatticeRecommendation,
} from "../../services/mungerMentalModelsService";

interface MungerAdvisoryPanelProps {
  vaultId?: string;
  userId?: string;
  className?: string;
}

export const MungerAdvisoryPanel: React.FC<MungerAdvisoryPanelProps> = ({
  vaultId,
  userId,
  className,
}) => {
  const [mentalModels, setMentalModels] = useState<MentalModel[]>([]);
  const [inversions, setInversions] = useState<InversionAnalysis[]>([]);
  const [failureIntents, setFailureIntents] = useState<AvoidFailureIntent[]>(
    [],
  );
  const [redTeamChallenges, setRedTeamChallenges] = useState<
    RedTeamChallenge[]
  >([]);
  const [latticeRecs, setLatticeRecs] = useState<LatticeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mental-models");

  useEffect(() => {
    loadMungerData();
  }, [vaultId, userId]);

  const loadMungerData = async () => {
    setLoading(true);
    try {
      const [models, inversionAnalyses, intents, challenges, recommendations] =
        await Promise.all([
          mungerMentalModelsService.getMentalModels(),
          mungerMentalModelsService.getInversionAnalyses(),
          mungerMentalModelsService.getAvoidFailureIntents(userId),
          mungerMentalModelsService.getRedTeamChallenges(),
          vaultId
            ? mungerMentalModelsService.getLatticeRecommendations(vaultId)
            : Promise.resolve([]),
        ]);

      setMentalModels(models);
      setInversions(inversionAnalyses);
      setFailureIntents(intents);
      setRedTeamChallenges(challenges);
      setLatticeRecs(recommendations);
    } catch (error) {
      console.error("Failed to load Munger data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFailureIntent = async (intent: string, category: any) => {
    if (!userId) return;

    try {
      await mungerMentalModelsService.createAvoidFailureIntent(
        userId,
        intent,
        category,
      );
      await loadMungerData();
    } catch (error) {
      console.error("Failed to create failure intent:", error);
    }
  };

  const handleResolveChallenge = async (
    challengeId: string,
    resolution: string,
  ) => {
    try {
      await mungerMentalModelsService.resolveRedTeamChallenge(
        challengeId,
        resolution,
      );
      await loadMungerData();
    } catch (error) {
      console.error("Failed to resolve challenge:", error);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">
              Loading Munger advisory intelligence...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle>Charlie Munger Advisory Panel</CardTitle>
            <CardDescription>
              Lattice of Mental Models & Inversion Analysis for Superior
              Decision Making
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="mental-models">Mental Models</TabsTrigger>
            <TabsTrigger value="inversion">Inversion Analysis</TabsTrigger>
            <TabsTrigger value="failure-intents">Avoid Failure</TabsTrigger>
            <TabsTrigger value="red-team">Red Team</TabsTrigger>
            <TabsTrigger value="lattice">Lattice Recs</TabsTrigger>
          </TabsList>

          {/* Mental Models Tab */}
          <TabsContent value="mental-models" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentalModels.slice(0, 6).map((model) => (
                <Card
                  key={model.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm">{model.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {model.discipline}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {model.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-blue-600">
                          {model.reliability}%
                        </div>
                        <div className="text-gray-500">Reliability</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">
                          {model.ecosystemRelevance}%
                        </div>
                        <div className="text-gray-500">Ecosystem</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-purple-600">
                          {model.inversionPotential}%
                        </div>
                        <div className="text-gray-500">Inversion</div>
                      </div>
                    </div>

                    {model.biasWarnings.length > 0 && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
                        <strong>Bias Warnings:</strong>{" "}
                        {model.biasWarnings.join(", ")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                Explore All {mentalModels.length} Mental Models
              </Button>
            </div>
          </TabsContent>

          {/* Inversion Analysis Tab */}
          <TabsContent value="inversion" className="space-y-4">
            {inversions.map((inversion) => (
              <Card key={inversion.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{inversion.scenario}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive" className="text-xs">
                        Risk Score: {inversion.riskScore}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {inversion.probabilityOfFailure}% Probability
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3 p-3 bg-red-50 rounded">
                    <h5 className="font-medium text-red-800 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Inversion Question
                    </h5>
                    <p className="text-sm text-red-700">{inversion.question}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Failure Modes
                      </h5>
                      <ul className="space-y-1">
                        {inversion.failureModes.map((mode, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <X className="h-3 w-3 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                            {mode}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Avoidance Strategies
                      </h5>
                      <ul className="space-y-1">
                        {inversion.avoidanceStrategies.map(
                          (strategy, index) => (
                            <li
                              key={index}
                              className="text-sm flex items-start"
                            >
                              <Shield className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              {strategy}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <h5 className="font-medium text-blue-800 mb-2">
                      Inverse Measures
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {inversion.inverseMeasures.map((measure, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {measure}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Avoid Failure Intents Tab */}
          <TabsContent value="failure-intents" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Avoid-Failure Intents</h3>
              <Button
                size="sm"
                onClick={() => {
                  const intent = prompt("What must not happen?");
                  if (intent) {
                    handleCreateFailureIntent(intent, "asset_misallocation");
                  }
                }}
              >
                <Target className="h-4 w-4 mr-2" />
                Create Intent
              </Button>
            </div>

            {failureIntents.map((intent) => (
              <Card
                key={intent.id}
                className={`border-l-4 ${
                  intent.severity === "critical"
                    ? "border-l-red-500"
                    : intent.severity === "high"
                      ? "border-l-orange-500"
                      : intent.severity === "medium"
                        ? "border-l-yellow-500"
                        : "border-l-blue-500"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{intent.intent}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          intent.status === "triggered"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {intent.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          intent.severity === "critical"
                            ? "border-red-500 text-red-700"
                            : intent.severity === "high"
                              ? "border-orange-500 text-orange-700"
                              : "border-yellow-500 text-yellow-700"
                        }
                      >
                        {intent.severity}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Trigger Conditions
                      </h5>
                      <ul className="space-y-1">
                        {intent.triggerConditions.map((condition, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <Eye className="h-3 w-3 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2">Guardrails</h5>
                      <ul className="space-y-1">
                        {intent.guardrails.map((guardrail, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <Shield className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            {guardrail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Monitoring Metrics
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {intent.monitoringMetrics.map((metric, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">
                        <strong>Last Review:</strong>{" "}
                        {intent.lastReview.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Red Team Challenges:</strong>{" "}
                        {intent.redTeamChallenges.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Red Team Challenges Tab */}
          <TabsContent value="red-team" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Red Team Challenges</h3>
              <Badge variant="outline">
                {redTeamChallenges.filter((c) => !c.resolution).length} Active
                Challenges
              </Badge>
            </div>

            {redTeamChallenges
              .filter((c) => !c.resolution)
              .map((challenge) => (
                <Alert
                  key={challenge.id}
                  className={`border-l-4 ${
                    challenge.riskLevel >= 80
                      ? "border-l-red-500"
                      : challenge.riskLevel >= 60
                        ? "border-l-orange-500"
                        : "border-l-yellow-500"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold capitalize">
                          {challenge.challenger.replace("_", " ")}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={challenge.riskLevel}
                            className="w-20 h-2"
                          />
                          <span className="text-xs font-medium">
                            {challenge.riskLevel}% Risk
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700">{challenge.challenge}</p>

                      {challenge.evidence.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">
                            Supporting Evidence
                          </h5>
                          <ul className="space-y-1">
                            {challenge.evidence.map((evidence, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                • {evidence}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {challenge.counterArguments.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">
                            Counter Arguments
                          </h5>
                          <ul className="space-y-1">
                            {challenge.counterArguments.map((arg, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                • {arg}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-gray-500">
                          Challenge requires response
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            const resolution = prompt(
                              "Provide your response to this challenge:",
                            );
                            if (resolution) {
                              handleResolveChallenge(challenge.id, resolution);
                            }
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Respond
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}

            {redTeamChallenges.filter((c) => !c.resolution).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active red team challenges</p>
                <p className="text-sm">
                  AI agents will generate challenges to test your reasoning
                </p>
              </div>
            )}
          </TabsContent>

          {/* Lattice Recommendations Tab */}
          <TabsContent value="lattice" className="space-y-4">
            {vaultId ? (
              <>
                {latticeRecs.map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Multi-Model Analysis</h4>
                        <Badge variant="outline">
                          {rec.confidence}% Confidence
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-700 mb-4">
                        {rec.reasoning}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">
                            Models Combined
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {rec.modelsCombined.map((model, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm mb-2">
                            Cross-Disciplinary Insights
                          </h5>
                          <ul className="space-y-1">
                            {rec.crossDisciplinaryInsights
                              .slice(0, 3)
                              .map((insight, index) => (
                                <li
                                  key={index}
                                  className="text-sm flex items-start"
                                >
                                  <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                                  {insight}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <h5 className="font-medium text-blue-800 mb-2">
                          Action Plan
                        </h5>
                        <p className="text-sm text-blue-700">
                          {rec.actionPlan}
                        </p>
                      </div>

                      {rec.potentialBlindSpots.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded">
                          <h5 className="font-medium text-yellow-800 mb-2">
                            Potential Blind Spots
                          </h5>
                          <ul className="space-y-1">
                            {rec.potentialBlindSpots.map((blindspot, index) => (
                              <li
                                key={index}
                                className="text-sm text-yellow-700"
                              >
                                • {blindspot}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rec.fallbackStrategies.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-sm mb-2">
                            Fallback Strategies
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {rec.fallbackStrategies.map((strategy, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {strategy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {latticeRecs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No lattice recommendations available</p>
                    <p className="text-sm">
                      Mental model analysis is being processed
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a vault to see lattice recommendations</p>
                <p className="text-sm">
                  Multi-model analysis requires specific investment context
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
