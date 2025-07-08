
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    browser: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'team';
    analyticsOptOut: boolean;
    dataSharing: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    defaultDashboard: string;
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
    compactMode: boolean;
    animations: boolean;
  };
}

const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    browser: true,
    marketing: false,
  },
  privacy: {
    profileVisibility: 'team',
    analyticsOptOut: false,
    dataSharing: false,
  },
  preferences: {
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/dd/yyyy',
    defaultDashboard: 'overview',
  },
  appearance: {
    theme: 'dark',
    compactMode: false,
    animations: true,
  },
};

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        // If table doesn't exist or other error, use defaults
        setSettings(defaultSettings);
      } else if (data && data.settings) {
        setSettings({ ...defaultSettings, ...data.settings });
      } else {
        // No settings found, use defaults
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving settings:', error);
      // Revert on error
      setSettings(settings);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    updateSettings,
  };
};
