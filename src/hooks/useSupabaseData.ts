import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: any) => {
    const { data, error } = await supabase
      .from("projects")
      .insert([{ ...projectData, owner_id: user?.id }])
      .select()
      .single();

    if (!error && data) {
      setProjects((prev) => [data, ...prev]);
    }

    return { data, error };
  };

  return { projects, loading, createProject, refetch: fetchProjects };
};

export const useAIModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchModels();
    }
  }, [user]);

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_models")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setModels(data);
      }
    } catch (error) {
      console.error("Error fetching AI models:", error);
    } finally {
      setLoading(false);
    }
  };

  const createModel = async (modelData: any) => {
    const { data, error } = await supabase
      .from("ai_models")
      .insert([{ ...modelData, created_by: user?.id }])
      .select()
      .single();

    if (!error && data) {
      setModels((prev) => [data, ...prev]);
    }

    return { data, error };
  };

  return { models, loading, createModel, refetch: fetchModels };
};

export const useBlockchainAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [user]);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from("blockchain_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setAssets(data);
      }
    } catch (error) {
      console.error("Error fetching blockchain assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAsset = async (assetData: any) => {
    const { data, error } = await supabase
      .from("blockchain_assets")
      .insert([{ ...assetData, created_by: user?.id }])
      .select()
      .single();

    if (!error && data) {
      setAssets((prev) => [data, ...prev]);
    }

    return { data, error };
  };

  return { assets, loading, createAsset, refetch: fetchAssets };
};

export const useSupabaseNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif,
        ),
      );
    }
  };

  return { notifications, loading, markAsRead, refetch: fetchNotifications };
};
