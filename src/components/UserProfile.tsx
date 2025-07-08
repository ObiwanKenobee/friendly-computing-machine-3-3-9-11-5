
import React, { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut } from 'lucide-react';

interface UserProfileData {
  full_name?: string;
  role?: string;
  organization?: string;
  avatar_url?: string;
  department?: string;
}

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfileData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'executive': return 'bg-purple-600';
      case 'developer': return 'bg-blue-600';
      case 'analyst': return 'bg-green-600';
      case 'admin': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <User className="mr-2 h-5 w-5" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
              {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-white font-semibold text-lg">
              {profile.full_name || user?.email}
            </h3>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            {profile.role && (
              <Badge className={`${getRoleColor(profile.role)} text-white`}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </Badge>
            )}
          </div>
        </div>

        {profile.organization && (
          <div className="space-y-2">
            <h4 className="text-white font-medium">Organization</h4>
            <p className="text-gray-300">{profile.organization}</p>
          </div>
        )}

        {profile.department && (
          <div className="space-y-2">
            <h4 className="text-white font-medium">Department</h4>
            <p className="text-gray-300">{profile.department}</p>
          </div>
        )}

        <div className="flex space-x-2 pt-4">
          <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
