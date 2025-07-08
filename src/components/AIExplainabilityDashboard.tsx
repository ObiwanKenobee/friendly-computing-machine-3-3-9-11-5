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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import {
  mlModelService,
  type MLModel,
  type ModelExplanation,
} from "../services/mlModelService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
} from "recharts";
import {
  Brain,
  Eye,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Shield,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

interface ExplainabilityMetrics {
  modelId: string;
  globalExplainability: {
    featureImportances: Array<{
      feature: string;
      importance: number;
      category: string;
    }>;
    shapSummary: {
      meanShapValues: number[];
      featureInteractions: Array<{
        feature1: string;
        feature2: string;
        interaction: number;
      }>;
    };
    permutationImportance: Array<{
      feature: string;
      importance: number;
      std: number;
    }>;
  };
  localExplainability: {
    sampleExplanations: ModelExplanation[];
    counterfactuals: Array<{
      original: any;
      counterfactual: any;
      confidence: number;
      changes: Array<{ feature: string; originalValue: any; newValue: any }>;
    }>;
  };
  fairnessMetrics: {
    demographicParity: number;
    equalizedOdds: number;
    calibration: number;
    biasScore: number;
    sensitiveFeatures: string[];
  };
  interpretabilityScore: {
    complexity: number;
    transparency: number;
    faithfulness: number;
    overall: number;
  };
}

export default function AIExplainabilityDashboard() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [explainabilityData, setExplainabilityData] =
    useState<ExplainabilityMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedExplanation, setSelectedExplanation] =
    useState<ModelExplanation | null>(null);
  const [viewMode, setViewMode] = useState<
    "global" | "local" | "fairness" | "comparison"
  >("global");

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (selectedModel) {
      loadExplainabilityData(selectedModel);
    }
  }, [selectedModel]);

  const loadModels = async () => {
    try {
      const modelsData = await mlModelService.getModels({ status: "deployed" });
      setModels(modelsData);
      if (modelsData.length > 0) {
        setSelectedModel(modelsData[0].id);
      }
    } catch (error) {
      console.error("Failed to load models:", error);
    }
  };

  const loadExplainabilityData = async (modelId: string) => {
    setLoading(true);
    try {
      // Simulate loading explainability data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockData: ExplainabilityMetrics = {
        modelId,
        globalExplainability: {
          featureImportances: [
            { feature: "Income", importance: 0.35, category: "Financial" },
            { feature: "Age", importance: 0.25, category: "Demographic" },
            {
              feature: "Investment Experience",
              importance: 0.2,
              category: "Behavioral",
            },
            {
              feature: "Risk Tolerance",
              importance: 0.15,
              category: "Behavioral",
            },
            {
              feature: "Market Volatility",
              importance: 0.05,
              category: "Market",
            },
          ],
          shapSummary: {
            meanShapValues: [0.35, 0.25, 0.2, 0.15, 0.05],
            featureInteractions: [
              { feature1: "Income", feature2: "Age", interaction: 0.12 },
              {
                feature1: "Age",
                feature2: "Risk Tolerance",
                interaction: 0.08,
              },
              {
                feature1: "Income",
                feature2: "Investment Experience",
                interaction: 0.06,
              },
            ],
          },
          permutationImportance: [
            { feature: "Income", importance: 0.32, std: 0.03 },
            { feature: "Age", importance: 0.28, std: 0.04 },
            { feature: "Investment Experience", importance: 0.18, std: 0.02 },
            { feature: "Risk Tolerance", importance: 0.16, std: 0.03 },
            { feature: "Market Volatility", importance: 0.06, std: 0.01 },
          ],
        },
        localExplainability: {
          sampleExplanations: await Promise.all([
            mlModelService.explainPrediction(modelId, "pred-1", {
              income: 75000,
              age: 35,
            }),
            mlModelService.explainPrediction(modelId, "pred-2", {
              income: 120000,
              age: 45,
            }),
            mlModelService.explainPrediction(modelId, "pred-3", {
              income: 45000,
              age: 28,
            }),
          ]),
          counterfactuals: [
            {
              original: { income: 75000, age: 35, riskTolerance: 3 },
              counterfactual: { income: 85000, age: 35, riskTolerance: 3 },
              confidence: 0.92,
              changes: [
                { feature: "income", originalValue: 75000, newValue: 85000 },
              ],
            },
            {
              original: { income: 45000, age: 28, riskTolerance: 2 },
              counterfactual: { income: 45000, age: 32, riskTolerance: 3 },
              confidence: 0.87,
              changes: [
                { feature: "age", originalValue: 28, newValue: 32 },
                { feature: "riskTolerance", originalValue: 2, newValue: 3 },
              ],
            },
          ],
        },
        fairnessMetrics: {
          demographicParity: 0.92,
          equalizedOdds: 0.89,
          calibration: 0.94,
          biasScore: 0.15,
          sensitiveFeatures: ["age", "gender", "location"],
        },
        interpretabilityScore: {
          complexity: 0.75,
          transparency: 0.88,
          faithfulness: 0.91,
          overall: 0.85,
        },
      };

      setExplainabilityData(mockData);
    } catch (error) {
      console.error("Failed to load explainability data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInterpretabilityColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getInterpretabilityIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 0.6)
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Explainability Dashboard
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Understand and interpret your AI models with comprehensive
            explainability tools, feature importance analysis, and fairness
            metrics.
          </p>
        </div>

        {/* Model Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Model Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a model to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} (v{model.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedModel && (
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    {models.find((m) => m.id === selectedModel)?.type}
                  </Badge>
                  <Badge variant="outline">
                    Accuracy:{" "}
                    {(
                      (models.find((m) => m.id === selectedModel)?.accuracy ||
                        0) * 100
                    ).toFixed(1)}
                    %
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p>Analyzing model explainability...</p>
                <Progress value={60} className="w-64 mx-auto" />
              </div>
            </CardContent>
          </Card>
        )}

        {explainabilityData && !loading && (
          <>
            {/* Interpretability Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Complexity
                      </p>
                      <p
                        className={`text-2xl font-bold ${getInterpretabilityColor(explainabilityData.interpretabilityScore.complexity)}`}
                      >
                        {(
                          explainabilityData.interpretabilityScore.complexity *
                          100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>
                    {getInterpretabilityIcon(
                      explainabilityData.interpretabilityScore.complexity,
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Transparency
                      </p>
                      <p
                        className={`text-2xl font-bold ${getInterpretabilityColor(explainabilityData.interpretabilityScore.transparency)}`}
                      >
                        {(
                          explainabilityData.interpretabilityScore
                            .transparency * 100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>
                    {getInterpretabilityIcon(
                      explainabilityData.interpretabilityScore.transparency,
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Faithfulness
                      </p>
                      <p
                        className={`text-2xl font-bold ${getInterpretabilityColor(explainabilityData.interpretabilityScore.faithfulness)}`}
                      >
                        {(
                          explainabilityData.interpretabilityScore
                            .faithfulness * 100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>
                    {getInterpretabilityIcon(
                      explainabilityData.interpretabilityScore.faithfulness,
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Overall Score
                      </p>
                      <p
                        className={`text-2xl font-bold ${getInterpretabilityColor(explainabilityData.interpretabilityScore.overall)}`}
                      >
                        {(
                          explainabilityData.interpretabilityScore.overall * 100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>
                    {getInterpretabilityIcon(
                      explainabilityData.interpretabilityScore.overall,
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* View Mode Tabs */}
            <Tabs
              value={viewMode}
              onValueChange={(value: any) => setViewMode(value)}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="global">Global Explanations</TabsTrigger>
                <TabsTrigger value="local">Local Explanations</TabsTrigger>
                <TabsTrigger value="fairness">Fairness Analysis</TabsTrigger>
                <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
              </TabsList>

              {/* Global Explanations */}
              <TabsContent value="global" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Feature Importance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Feature Importance</span>
                      </CardTitle>
                      <CardDescription>
                        Global feature importance scores across all predictions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={
                            explainabilityData.globalExplainability
                              .featureImportances
                          }
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="feature"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="importance" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Feature Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <PieChartIcon className="h-5 w-5" />
                        <span>Feature Categories</span>
                      </CardTitle>
                      <CardDescription>
                        Distribution of feature importance by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={
                              explainabilityData.globalExplainability
                                .featureImportances
                            }
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ category, importance }) =>
                              `${category}: ${(importance * 100).toFixed(1)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="importance"
                          >
                            {explainabilityData.globalExplainability.featureImportances.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ),
                            )}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Feature Interactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Interactions</CardTitle>
                    <CardDescription>
                      How features interact with each other in the model
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {explainabilityData.globalExplainability.shapSummary.featureInteractions.map(
                        (interaction, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {interaction.feature1}
                              </Badge>
                              <span className="text-gray-400">×</span>
                              <Badge variant="outline">
                                {interaction.feature2}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                Interaction Strength:
                              </span>
                              <Badge
                                variant={
                                  interaction.interaction > 0.1
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {interaction.interaction.toFixed(3)}
                              </Badge>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Permutation Importance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Permutation Importance</CardTitle>
                    <CardDescription>
                      Feature importance measured by performance drop when
                      feature is shuffled
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={
                          explainabilityData.globalExplainability
                            .permutationImportance
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="feature"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="importance" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Local Explanations */}
              <TabsContent value="local" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sample Explanations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>Sample Predictions</span>
                      </CardTitle>
                      <CardDescription>
                        Detailed explanations for individual predictions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {explainabilityData.localExplainability.sampleExplanations.map(
                          (explanation, index) => (
                            <div
                              key={index}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedExplanation?.predictionId ===
                                explanation.predictionId
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() =>
                                setSelectedExplanation(explanation)
                              }
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">
                                  Prediction {index + 1}
                                </Badge>
                                <Badge
                                  variant={
                                    explanation.confidence > 0.8
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {(explanation.confidence * 100).toFixed(1)}%
                                  confident
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Prediction:{" "}
                                <span className="font-medium">
                                  {JSON.stringify(explanation.prediction)}
                                </span>
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* SHAP Values for Selected Prediction */}
                  {selectedExplanation && (
                    <Card>
                      <CardHeader>
                        <CardTitle>SHAP Values</CardTitle>
                        <CardDescription>
                          Feature contributions for selected prediction
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={selectedExplanation.featureImportances}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="feature"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar
                              dataKey="importance"
                              fill={(entry: any) =>
                                entry.importance > 0 ? "#10B981" : "#EF4444"
                              }
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Counterfactuals */}
                <Card>
                  <CardHeader>
                    <CardTitle>Counterfactual Explanations</CardTitle>
                    <CardDescription>
                      What would need to change to get a different prediction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {explainabilityData.localExplainability.counterfactuals.map(
                        (counterfactual, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">
                                Counterfactual {index + 1}
                              </h4>
                              <Badge variant="outline">
                                {(counterfactual.confidence * 100).toFixed(1)}%
                                confidence
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 mb-2">
                                  Original Values
                                </h5>
                                <div className="space-y-1">
                                  {Object.entries(counterfactual.original).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex justify-between text-sm"
                                      >
                                        <span>{key}:</span>
                                        <span className="font-medium">
                                          {String(value)}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>

                              <div>
                                <h5 className="text-sm font-medium text-gray-600 mb-2">
                                  Required Changes
                                </h5>
                                <div className="space-y-1">
                                  {counterfactual.changes.map(
                                    (change, changeIndex) => (
                                      <div
                                        key={changeIndex}
                                        className="flex justify-between text-sm"
                                      >
                                        <span>{change.feature}:</span>
                                        <span className="font-medium text-blue-600">
                                          {String(change.originalValue)} →{" "}
                                          {String(change.newValue)}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fairness Analysis */}
              <TabsContent value="fairness" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Fairness Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Fairness Metrics</span>
                      </CardTitle>
                      <CardDescription>
                        Bias and fairness assessment across different groups
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Demographic Parity
                          </span>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                explainabilityData.fairnessMetrics
                                  .demographicParity * 100
                              }
                              className="w-24"
                            />
                            <span className="text-sm">
                              {(
                                explainabilityData.fairnessMetrics
                                  .demographicParity * 100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Equalized Odds
                          </span>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                explainabilityData.fairnessMetrics
                                  .equalizedOdds * 100
                              }
                              className="w-24"
                            />
                            <span className="text-sm">
                              {(
                                explainabilityData.fairnessMetrics
                                  .equalizedOdds * 100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Calibration
                          </span>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                explainabilityData.fairnessMetrics.calibration *
                                100
                              }
                              className="w-24"
                            />
                            <span className="text-sm">
                              {(
                                explainabilityData.fairnessMetrics.calibration *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Bias Score
                          </span>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                (1 -
                                  explainabilityData.fairnessMetrics
                                    .biasScore) *
                                100
                              }
                              className="w-24"
                            />
                            <span className="text-sm">
                              {(
                                explainabilityData.fairnessMetrics.biasScore *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sensitive Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sensitive Features</CardTitle>
                      <CardDescription>
                        Features that may introduce bias in predictions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {explainabilityData.fairnessMetrics.sensitiveFeatures.map(
                          (feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                            >
                              <span className="font-medium text-yellow-800">
                                {feature}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-yellow-600 border-yellow-300"
                              >
                                Sensitive
                              </Badge>
                            </div>
                          ),
                        )}
                      </div>

                      <Alert className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Monitor these features carefully to ensure fair and
                          unbiased predictions across different demographic
                          groups.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>

                {/* Bias Analysis Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bias Analysis Over Time</CardTitle>
                    <CardDescription>
                      Historical bias metrics to track model fairness
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={[
                          {
                            month: "Jan",
                            demographicParity: 0.85,
                            equalizedOdds: 0.82,
                            calibration: 0.9,
                          },
                          {
                            month: "Feb",
                            demographicParity: 0.88,
                            equalizedOdds: 0.85,
                            calibration: 0.92,
                          },
                          {
                            month: "Mar",
                            demographicParity: 0.92,
                            equalizedOdds: 0.89,
                            calibration: 0.94,
                          },
                          {
                            month: "Apr",
                            demographicParity: 0.9,
                            equalizedOdds: 0.87,
                            calibration: 0.93,
                          },
                          {
                            month: "May",
                            demographicParity: 0.93,
                            equalizedOdds: 0.91,
                            calibration: 0.95,
                          },
                          {
                            month: "Jun",
                            demographicParity: 0.92,
                            equalizedOdds: 0.89,
                            calibration: 0.94,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="demographicParity"
                          stroke="#3B82F6"
                          name="Demographic Parity"
                        />
                        <Line
                          type="monotone"
                          dataKey="equalizedOdds"
                          stroke="#10B981"
                          name="Equalized Odds"
                        />
                        <Line
                          type="monotone"
                          dataKey="calibration"
                          stroke="#F59E0B"
                          name="Calibration"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Feature Comparison */}
              <TabsContent value="comparison" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Importance Comparison</CardTitle>
                    <CardDescription>
                      Compare different feature importance methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart
                        data={explainabilityData.globalExplainability.featureImportances.map(
                          (feature) => ({
                            feature: feature.feature,
                            "Feature Importance": feature.importance,
                            "Permutation Importance":
                              explainabilityData.globalExplainability.permutationImportance.find(
                                (p) => p.feature === feature.feature,
                              )?.importance || 0,
                            "SHAP Values": Math.random() * 0.4, // Mock SHAP values
                          }),
                        )}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="feature" />
                        <PolarRadiusAxis angle={90} domain={[0, 0.4]} />
                        <Radar
                          name="Feature Importance"
                          dataKey="Feature Importance"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.1}
                        />
                        <Radar
                          name="Permutation Importance"
                          dataKey="Permutation Importance"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.1}
                        />
                        <Radar
                          name="SHAP Values"
                          dataKey="SHAP Values"
                          stroke="#F59E0B"
                          fill="#F59E0B"
                          fillOpacity={0.1}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Model Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>High Interpretability Score:</strong> Your
                          model has excellent transparency with a score of{" "}
                          {(
                            explainabilityData.interpretabilityScore.overall *
                            100
                          ).toFixed(0)}
                          %.
                        </AlertDescription>
                      </Alert>

                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Feature Engineering:</strong> Consider
                          creating interaction features between 'Income' and
                          'Age' as they show strong correlation.
                        </AlertDescription>
                      </Alert>

                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Fairness Monitoring:</strong> Continue
                          monitoring bias metrics for age-related features to
                          ensure fair lending practices.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
