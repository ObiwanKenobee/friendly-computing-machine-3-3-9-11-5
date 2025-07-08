/**
 * Fast Loading Fallback Component
 * Minimal, quick-loading fallback with essential feedback
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Loader2, CheckCircle, Zap, Rocket } from "lucide-react";

interface FastLoadingFallbackProps {
  pageName?: string;
  showProgress?: boolean;
  timeout?: number;
}

const FastLoadingFallback: React.FC<FastLoadingFallbackProps> = ({
  pageName = "Application",
  showProgress = true,
  timeout = 10000, // Reduced from 90 seconds to 10 seconds
}) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Initializing...");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const phases = [
      { name: "Loading Core Components", duration: 1000 },
      { name: "Initializing Services", duration: 1500 },
      { name: "Setting up Security", duration: 1000 },
      { name: "Preparing Interface", duration: 1500 },
      { name: "Almost Ready...", duration: 1000 },
    ];

    let totalTime = 0;
    let currentTime = 0;

    // Calculate total duration
    phases.forEach((phase) => (totalTime += phase.duration));

    // Execute phases
    phases.forEach((phase, index) => {
      setTimeout(() => {
        setCurrentPhase(phase.name);
        const progressValue =
          ((currentTime + phase.duration) / totalTime) * 100;
        setProgress(progressValue);
        currentTime += phase.duration;

        if (index === phases.length - 1) {
          setTimeout(() => {
            setIsComplete(true);
            setProgress(100);
            setCurrentPhase("Ready!");
          }, phase.duration);
        }
      }, currentTime);
    });

    // Fallback timeout
    const timeoutId = setTimeout(() => {
      setIsComplete(true);
      setProgress(100);
      setCurrentPhase("Loading Complete");
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [timeout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              {isComplete ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              QuantumVest Enterprise
            </h2>

            <p className="text-gray-600">Loading {pageName}</p>
          </div>

          {/* Progress Section */}
          {showProgress && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Progress value={progress} className="w-full h-3" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{Math.round(progress)}% complete</span>
                  <span>{isComplete ? "Ready!" : "Loading..."}</span>
                </div>
              </div>

              {/* Current Phase */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="italic">{currentPhase}</span>
                </div>
              </div>
            </div>
          )}

          {/* Status Badges */}
          <div className="flex justify-center gap-2 mt-6">
            <Badge variant="outline" className="flex items-center gap-1">
              <Rocket className="h-3 w-3" />
              Fast Loading
            </Badge>
            <Badge variant="outline">Enterprise Ready</Badge>
          </div>

          {/* Quick Tips */}
          {!isComplete && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 text-center">
                💡 <strong>Tip:</strong> QuantumVest loads your personalized
                investment strategies based on your age and location
                preferences.
              </p>
            </div>
          )}

          {/* Loading Complete Message */}
          {isComplete && (
            <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 text-center">
                ✅ <strong>Ready!</strong> Your investment consciousness
                platform is loaded and ready for use.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FastLoadingFallback;
