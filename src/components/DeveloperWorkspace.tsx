
import React, { useState } from 'react';
import { Code, GitBranch, Terminal, Zap, Bug, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DeveloperWorkspace = () => {
  const [activeProject, setActiveProject] = useState('quantum-ai');

  const projects = [
    { 
      id: 'quantum-ai', 
      name: 'Quantum AI Core', 
      status: 'active', 
      progress: 78,
      language: 'Python',
      lastCommit: '2 hours ago'
    },
    { 
      id: 'blockchain-wallet', 
      name: 'Blockchain Wallet', 
      status: 'testing', 
      progress: 92,
      language: 'TypeScript',
      lastCommit: '1 day ago'
    },
    { 
      id: 'ml-pipeline', 
      name: 'ML Pipeline', 
      status: 'deployed', 
      progress: 100,
      language: 'Python',
      lastCommit: '3 days ago'
    }
  ];

  const buildStatus = [
    { name: 'quantum-ai', status: 'success', time: '2m 34s', coverage: '94%' },
    { name: 'blockchain-wallet', status: 'running', time: '1m 12s', coverage: '89%' },
    { name: 'ml-pipeline', status: 'success', time: '3m 45s', coverage: '97%' }
  ];

  const aiSuggestions = [
    { type: 'optimization', message: 'Consider using async/await for better performance in auth.ts', severity: 'medium' },
    { type: 'security', message: 'Add input validation to user registration endpoint', severity: 'high' },
    { type: 'refactor', message: 'Extract duplicate code in utils/helpers.ts', severity: 'low' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Developer Workspace</h1>
          <p className="text-slate-400">AI-powered development environment</p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
            <Terminal className="h-4 w-4 mr-2" />
            Open Terminal
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <GitBranch className="h-4 w-4 mr-2" />
            Git Status
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className={`cursor-pointer transition-all duration-300 ${
              activeProject === project.id 
                ? 'bg-white/20 border-white/40' 
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            } backdrop-blur-lg`}
            onClick={() => setActiveProject(project.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                <span className={`px-2 py-1 rounded text-xs ${
                  project.status === 'active' ? 'bg-blue-500 text-white' :
                  project.status === 'testing' ? 'bg-yellow-500 text-black' :
                  'bg-green-500 text-white'
                }`}>
                  {project.status}
                </span>
              </div>
              <CardDescription className="text-slate-300">
                {project.language} • {project.lastCommit}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
          <TabsTrigger value="code" className="data-[state=active]:bg-white/20 text-white">Code</TabsTrigger>
          <TabsTrigger value="builds" className="data-[state=active]:bg-white/20 text-white">Builds</TabsTrigger>
          <TabsTrigger value="ai-assist" className="data-[state=active]:bg-white/20 text-white">AI Assistant</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-white/20 text-white">Performance</TabsTrigger>
          <TabsTrigger value="deployment" className="data-[state=active]:bg-white/20 text-white">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-400">src/ai/quantum-core.py</span>
                  <div className="flex space-x-2">
                    <span className="text-green-400">✓ Saved</span>
                    <span className="text-yellow-400">AI Suggestions: 3</span>
                  </div>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div><span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np</div>
                  <div><span className="text-purple-400">from</span> quantum_ml <span className="text-purple-400">import</span> QuantumClassifier</div>
                  <div className="mt-2"></div>
                  <div><span className="text-blue-400">class</span> <span className="text-yellow-400">QuantumAI</span>:</div>
                  <div className="ml-4"><span className="text-purple-400">def</span> <span className="text-green-400">__init__</span>(self, qubits=8):</div>
                  <div className="ml-8">self.qubits = qubits</div>
                  <div className="ml-8">self.classifier = QuantumClassifier(qubits)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builds" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Build Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {buildStatus.map((build, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-3">
                    {build.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : build.status === 'running' ? (
                      <Clock className="h-5 w-5 text-yellow-400 animate-spin" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">{build.name}</p>
                      <p className="text-slate-400 text-sm">Build time: {build.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white">Coverage: {build.coverage}</p>
                    <p className="text-slate-400 text-sm">{build.status}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-assist" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                AI Code Assistant
              </CardTitle>
              <CardDescription className="text-slate-300">
                Smart suggestions and automated improvements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  suggestion.severity === 'high' ? 'bg-red-500/20 border-red-500/50' :
                  suggestion.severity === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50' :
                  'bg-blue-500/20 border-blue-500/50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          suggestion.type === 'security' ? 'bg-red-500 text-white' :
                          suggestion.type === 'optimization' ? 'bg-blue-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {suggestion.type}
                        </span>
                        <span className={`text-xs ${
                          suggestion.severity === 'high' ? 'text-red-400' :
                          suggestion.severity === 'medium' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`}>
                          {suggestion.severity} priority
                        </span>
                      </div>
                      <p className="text-white text-sm">{suggestion.message}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Apply</Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">Ignore</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Load Time</span>
                    <span className="text-white">1.2s</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-slate-300">Memory Usage</span>
                    <span className="text-white">245MB</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Code Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Code Coverage</span>
                    <span className="text-white">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-slate-300">Code Quality Score</span>
                    <span className="text-white">A+</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Deployment Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Production Deployment</span>
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">Deploy</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Staging Environment</span>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperWorkspace;
