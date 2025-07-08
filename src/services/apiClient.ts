import { supabase } from '@/integrations/supabase/client';
import { API_CONFIG } from '@/config/api';

export class APIClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.headers = { ...API_CONFIG.REQUEST_CONFIG.headers };
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    const authHeaders: Record<string, string> = {};
    
    if (session?.access_token) {
      authHeaders['Authorization'] = `Bearer ${session.access_token}`;
    }
    
    return authHeaders;
  }

  // Make request method public so it can be used by production hooks
  public async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...authHeaders,
        ...options.headers,
      },
    };

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_CONFIG.timeout);
    
    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }) {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async updateArchetype(archetype: string) {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.ARCHETYPE, {
      method: 'PUT',
      body: JSON.stringify({ archetype }),
    });
  }

  // Interaction methods
  async createInteractionSession(sessionData: {
    session_type: string;
    workspace_id?: string;
    interaction_data?: any;
    biometric_data?: any;
  }) {
    return this.request(API_CONFIG.ENDPOINTS.INTERACTIONS.SESSIONS, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async processBiometricData(data: { session_id: string; biometric_data: any }) {
    return this.request(API_CONFIG.ENDPOINTS.INTERACTIONS.BIOMETRIC, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendVoiceCommand(command: { text: string; audio_data?: string }) {
    return this.request(API_CONFIG.ENDPOINTS.INTERACTIONS.VOICE_COMMANDS, {
      method: 'POST',
      body: JSON.stringify(command),
    });
  }

  async processGesture(gestureData: { type: string; coordinates: number[]; confidence: number }) {
    return this.request(API_CONFIG.ENDPOINTS.INTERACTIONS.GESTURE_CONTROL, {
      method: 'POST',
      body: JSON.stringify(gestureData),
    });
  }

  // AI/ML methods
  async createMLExperiment(experimentData: {
    model_id: string;
    experiment_name: string;
    hypothesis: string;
    parameters: any;
  }) {
    return this.request(API_CONFIG.ENDPOINTS.AI_ML.EXPERIMENTS, {
      method: 'POST',
      body: JSON.stringify(experimentData),
    });
  }

  async runInference(modelId: string, inputData: any) {
    return this.request(`${API_CONFIG.ENDPOINTS.AI_ML.INFERENCE}/${modelId}`, {
      method: 'POST',
      body: JSON.stringify({ input: inputData }),
    });
  }

  // Blockchain methods
  async deploySmartContract(contractData: {
    name: string;
    source_code: string;
    blockchain_network: string;
    parameters: any;
  }) {
    return this.request(API_CONFIG.ENDPOINTS.BLOCKCHAIN.SMART_CONTRACTS, {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  }

  async createBlockchainInnovation(innovationData: {
    innovation_name: string;
    category: string;
    technical_specs: any;
    economic_model: any;
  }) {
    return this.request(API_CONFIG.ENDPOINTS.BLOCKCHAIN.INNOVATIONS, {
      method: 'POST',
      body: JSON.stringify(innovationData),
    });
  }

  // Knowledge Graph methods
  async generateInsights(query: string, context?: any) {
    return this.request(`${API_CONFIG.ENDPOINTS.KNOWLEDGE.INSIGHTS}/generate`, {
      method: 'POST',
      body: JSON.stringify({ query, context }),
    });
  }

  async discoverConnections(nodeIds: string[]) {
    return this.request(`${API_CONFIG.ENDPOINTS.KNOWLEDGE.DISCOVERY}/connections`, {
      method: 'POST',
      body: JSON.stringify({ node_ids: nodeIds }),
    });
  }

  async searchKnowledge(query: string, filters?: any) {
    return this.request(`${API_CONFIG.ENDPOINTS.KNOWLEDGE.SEARCH}?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  }

  // Innovation Pipeline methods
  async orchestrateCollaboration(data: {
    innovation_id: string;
    required_archetypes: string[];
    collaboration_type: string;
  }) {
    return this.request(`${API_CONFIG.ENDPOINTS.INNOVATION.COLLABORATION}/orchestrate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async predictInnovationSuccess(innovationData: any) {
    return this.request(`${API_CONFIG.ENDPOINTS.INNOVATION.METRICS}/predict`, {
      method: 'POST',
      body: JSON.stringify({ innovation_data: innovationData }),
    });
  }

  // Analytics methods
  async getRealtimeAnalytics(engineId: string) {
    return this.request(`${API_CONFIG.ENDPOINTS.ANALYTICS.REAL_TIME}/${engineId}`);
  }

  async generatePredictiveAnalytics(data: {
    data_sources: string[];
    prediction_type: string;
    time_horizon: string;
  }) {
    return this.request(API_CONFIG.ENDPOINTS.ANALYTICS.PREDICTIVE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Security methods
  async runSecurityAudit(protocolId: string) {
    return this.request(`${API_CONFIG.ENDPOINTS.SECURITY.AUDITS}/${protocolId}/run`, {
      method: 'POST',
    });
  }

  async reportSecurityIncident(incidentData: {
    type: string;
    severity: string;
    description: string;
    affected_systems: string[];
  }) {
    return this.request(API_CONFIG.ENDPOINTS.SECURITY.INCIDENTS, {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  }

  // Communication methods
  async createHolographicMeeting(meetingData: {
    title: string;
    participants: string[];
    holographic_settings: any;
  }) {
    return this.request(API_CONFIG.ENDPOINTS.COMMUNICATION.HOLOGRAPHIC_MEET, {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  }

  async translateMessage(data: {
    text: string;
    source_language: string;
    target_language: string;
  }) {
    return this.request(API_CONFIG.ENDPOINTS.COMMUNICATION.TRANSLATION, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Edge Functions
  async callEdgeFunction<T>(functionName: keyof typeof API_CONFIG.ENDPOINTS.EDGE_FUNCTIONS, data?: any): Promise<T> {
    const endpoint = API_CONFIG.ENDPOINTS.EDGE_FUNCTIONS[functionName];
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new APIClient();
