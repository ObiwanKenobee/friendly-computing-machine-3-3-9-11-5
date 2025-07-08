
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
      <p className="text-gray-400">Loading platform...</p>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <Skeleton className="h-4 w-3/4 bg-gray-700" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2 bg-gray-700 mb-2" />
            <Skeleton className="h-3 w-full bg-gray-700" />
          </CardContent>
        </Card>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <Skeleton className="h-5 w-1/3 bg-gray-700" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full bg-gray-700" />
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <Skeleton className="h-5 w-1/4 bg-gray-700" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-3/4 bg-gray-700" />
                <Skeleton className="h-2 w-1/2 bg-gray-700" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    <div className="flex space-x-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1 bg-gray-700" />
      ))}
    </div>
    
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, j) => (
          <Skeleton key={j} className="h-8 flex-1 bg-gray-700" />
        ))}
      </div>
    ))}
  </div>
);
