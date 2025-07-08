/**
 * Game Layout Demo Page
 * Demonstrates responsive layouts inspired by Mahjong, Spider Solitaire, and other strategy games
 */

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GameLayoutDemo from "@/components/GameLayoutDemo";
import {
  ArrowLeft,
  Gamepad2,
  Layers,
  Grid3X3,
  List,
  Sparkles,
  Info,
  Play,
} from "lucide-react";

const GameLayoutDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Platform
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Gamepad2 className="h-3 w-3" />
              Demo Mode
            </Badge>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Game-Inspired Responsive Layouts
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Explore innovative layout patterns inspired by classic strategy
              games like Mahjong and Spider Solitaire, reimagined for modern
              investment platform interfaces.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">Mahjong Layout</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    3D tile-based layout with layered information architecture,
                    perfect for complex data visualization.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Solitaire Columns</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Cascading column layout with stacked cards, ideal for
                    sequential information flow.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <List className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Cascade View</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Information cascade with progressive disclosure, following
                    natural reading patterns.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">Responsive Grid</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Adaptive grid system with game-like interactions and smooth
                    animations.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Interactive Game Features
                  </CardTitle>
                  <CardDescription className="text-base">
                    Experience these game-inspired interaction patterns
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="p-1 bg-blue-100 rounded">
                    <Play className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Tile Selection
                    </h4>
                    <p className="text-sm text-gray-600">
                      Mahjong-style tile matching and selection logic
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="p-1 bg-green-100 rounded">
                    <Layers className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">3D Layering</h4>
                    <p className="text-sm text-gray-600">
                      Multi-level information architecture with depth
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="p-1 bg-purple-100 rounded">
                    <Grid3X3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Adaptive Layout
                    </h4>
                    <p className="text-sm text-gray-600">
                      Responsive design that adapts to screen size
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="p-1 bg-yellow-100 rounded">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Game Animations
                    </h4>
                    <p className="text-sm text-gray-600">
                      Smooth transitions and game-like feedback
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="p-1 bg-red-100 rounded">
                    <Info className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Progressive Disclosure
                    </h4>
                    <p className="text-sm text-gray-600">
                      Information revealed through interaction
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="p-1 bg-teal-100 rounded">
                    <Gamepad2 className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Scoring System
                    </h4>
                    <p className="text-sm text-gray-600">
                      Gamified interactions with point tracking
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Demo */}
      <GameLayoutDemo />

      {/* Instructions Footer */}
      <div className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                How to Interact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Layout Controls</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      • Switch between different layout modes using the header
                      buttons
                    </li>
                    <li>• Use search to filter tiles by name or description</li>
                    <li>
                      • Filter by subscription tier (Free, Starter,
                      Professional, Enterprise)
                    </li>
                    <li>• Toggle animations on/off for performance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Tile Interactions</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Click tiles to select them (up to 2 at once)</li>
                    <li>• Matching tiles by category or tier scores points</li>
                    <li>• Hover over tiles for enhanced visual feedback</li>
                    <li>
                      • Selected tiles will navigate to their respective
                      features
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameLayoutDemoPage;
