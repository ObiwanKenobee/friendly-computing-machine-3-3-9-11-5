
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreateInteractionSession, InteractionType } from '@/hooks/useAdvancedSupabaseData';
import { Mic, Hand, Brain, Eye, Palette, Headphones, MousePointer, Bot } from 'lucide-react';

const interactionConfig = {
  voice_command: {
    icon: Mic,
    title: 'Voice Command',
    description: 'Natural language voice interactions',
    color: 'bg-blue-500'
  },
  gesture_control: {
    icon: Hand,
    title: 'Gesture Control',
    description: 'Hand and body gesture recognition',
    color: 'bg-green-500'
  },
  brain_interface: {
    icon: Brain,
    title: 'Neural Interface',
    description: 'Direct brain-computer interaction',
    color: 'bg-purple-500'
  },
  ar_interaction: {
    icon: Eye,
    title: 'AR Interaction',
    description: 'Augmented reality environments',
    color: 'bg-orange-500'
  },
  holographic_display: {
    icon: Palette,
    title: 'Holographic Display',
    description: '3D holographic projections',
    color: 'bg-pink-500'
  },
  haptic_feedback: {
    icon: Headphones,
    title: 'Haptic Feedback',
    description: 'Touch and force feedback systems',
    color: 'bg-yellow-500'
  },
  eye_tracking: {
    icon: Eye,
    title: 'Eye Tracking',
    description: 'Gaze-based interface control',
    color: 'bg-red-500'
  },
  ai_assistant: {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Intelligent virtual assistant',
    color: 'bg-indigo-500'
  }
} as const;

const InteractionInterface: React.FC = () => {
  const [activeSession, setActiveSession] = useState<InteractionType | null>(null);
  const createSession = useCreateInteractionSession();

  const handleStartSession = async (sessionType: InteractionType) => {
    try {
      setActiveSession(sessionType);
      await createSession.mutateAsync({
        session_type: sessionType,
        interaction_data: {
          started_via: 'web_interface',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error starting session:', error);
      setActiveSession(null);
    }
  };

  const handleEndSession = () => {
    setActiveSession(null);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          Interaction Methods
          {activeSession && (
            <Badge className="bg-green-600 text-white">
              Active: {interactionConfig[activeSession].title}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(interactionConfig).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = activeSession === key;
            
            return (
              <Button
                key={key}
                variant={isActive ? "default" : "outline"}
                className={`h-auto p-4 ${
                  isActive 
                    ? `${config.color} text-white` 
                    : 'border-slate-600 hover:bg-slate-700'
                }`}
                onClick={() => 
                  isActive 
                    ? handleEndSession() 
                    : handleStartSession(key as InteractionType)
                }
                disabled={createSession.isPending}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className="h-6 w-6" />
                  <div className="text-xs text-center">
                    <div className="font-medium">{config.title}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {activeSession && (
          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">
              {interactionConfig[activeSession].title} Session Active
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              {interactionConfig[activeSession].description}
            </p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleEndSession}
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                End Session
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractionInterface;
