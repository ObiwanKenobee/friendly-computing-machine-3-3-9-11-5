/**
 * Quantum API Service - Frontend Integration
 * Mathematical foundations for quantum-classical interface
 */

import { z } from "zod";

// Environment configuration
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  algebraUrl:
    import.meta.env.VITE_QUANTUM_ALGEBRA_URL ||
    "http://localhost:8080/api/v1/algebra",
  schedulerUrl:
    import.meta.env.VITE_QUANTUM_SCHEDULER_URL ||
    "http://localhost:8081/api/v1/scheduler",
  errorCorrectionUrl:
    import.meta.env.VITE_QUANTUM_ERROR_CORRECTION_URL ||
    "http://localhost:8082/api/v1/error-correction",
  interfaceUrl:
    import.meta.env.VITE_QUANTUM_INTERFACE_URL ||
    "http://localhost:8083/api/v1/interface",
  mlUrl:
    import.meta.env.VITE_QUANTUM_ML_URL || "http://localhost:8084/api/v1/ml",
  timeout: 30000,
  retries: 3,
};

// Type definitions for quantum operations
export interface QuantumGate {
  type:
    | "pauli_x"
    | "pauli_y"
    | "pauli_z"
    | "hadamard"
    | "cnot"
    | "phase"
    | "qft"
    | "grover_diffuser";
  qubits: number[];
  parameters?: { [key: string]: number };
}

export interface QuantumCircuit {
  num_qubits: number;
  gates: QuantumGate[];
  shots?: number;
}

export interface QuantumState {
  state_vector: [number, number][]; // [real, imaginary] pairs
  num_qubits: number;
  entanglement_entropy?: number;
  fidelity?: number;
}

export interface SimulationResult {
  counts: { [bitstring: string]: number };
  probabilities: number[];
  state_vector: [number, number][];
  simulation_time: number;
  fidelity: number;
  num_qubits: number;
  num_gates: number;
  shots: number;
}

export interface ErrorCorrectionCode {
  name: string;
  type: "steane" | "shor" | "surface" | "color";
  num_physical_qubits: number;
  num_logical_qubits: number;
  code_distance: number;
  threshold_error_rate: number;
}

export interface SyndromeResult {
  syndrome: number[];
  error_detected: boolean;
  correction_applied: boolean;
  confidence: number;
  measurement_time: number;
}

export interface VQCParameters {
  num_qubits: number;
  num_layers: number;
  architecture: "hardware_efficient" | "real_amplitudes" | "two_local";
  parameter_values: number[];
}

export interface VQCTrainingConfig {
  learning_rate: number;
  max_iterations: number;
  convergence_threshold: number;
  optimization_method: "adam" | "bfgs" | "cobyla" | "spsa";
  batch_size: number;
}

export interface TrainingResult {
  final_loss: number;
  training_history: number[];
  convergence_achieved: boolean;
  training_time: number;
  iterations_completed: number;
}

export interface QuantumJob {
  id: string;
  type: "simulation" | "error_correction" | "vqc_training" | "optimization";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  progress: number;
  submitted_at: string;
  started_at?: string;
  completed_at?: string;
  result?: any;
  error_message?: string;
}

export interface ResourceUtilization {
  resource_id: string;
  resource_type: "quantum_simulator" | "classical_cpu" | "classical_gpu";
  utilization_percent: number;
  current_load: number;
  capacity: number;
  queue_length: number;
  estimated_wait_time: number;
}

// API Error handling
export class QuantumAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string,
    public details?: any,
  ) {
    super(message);
    this.name = "QuantumAPIError";
  }
}

// HTTP client with retry logic
class APIClient {
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    retries: number = API_CONFIG.retries,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new QuantumAPIError(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          url,
          errorData,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof QuantumAPIError) {
        throw error;
      }

      // Retry on network errors
      if (retries > 0 && (error as Error).name !== "AbortError") {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (API_CONFIG.retries - retries + 1)),
        );
        return this.makeRequest<T>(url, options, retries - 1);
      }

      throw new QuantumAPIError(
        `Network error: ${(error as Error).message}`,
        0,
        url,
        error,
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;

    return this.makeRequest<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// Quantum Linear Algebra Service API
export class QuantumAlgebraAPI {
  private client = new APIClient();

  async simulateCircuit(circuit: QuantumCircuit): Promise<SimulationResult> {
    return this.client.post<SimulationResult>(
      `${API_CONFIG.algebraUrl}/simulate`,
      circuit,
    );
  }

  async optimizeCircuit(circuit: QuantumCircuit): Promise<{
    optimized_circuit: QuantumCircuit;
    gate_reduction: number;
    depth_reduction: number;
    fidelity_preserved: number;
  }> {
    return this.client.post(`${API_CONFIG.algebraUrl}/optimize`, circuit);
  }

  async calculateFidelity(
    state1: QuantumState,
    state2: QuantumState,
  ): Promise<number> {
    return this.client
      .post<{
        fidelity: number;
      }>(`${API_CONFIG.algebraUrl}/fidelity`, { state1, state2 })
      .then((result) => result.fidelity);
  }

  async tensorDecomposition(
    circuit: QuantumCircuit,
    method: "parafac" | "tucker" = "parafac",
  ): Promise<{
    factors: number[][][];
    compression_ratio: number;
    reconstruction_error: number;
  }> {
    return this.client.post(`${API_CONFIG.algebraUrl}/tensor-decomposition`, {
      circuit,
      method,
    });
  }

  async measureExpectationValue(
    state: QuantumState,
    observable: { pauli_string: string; coefficient: number }[],
  ): Promise<{
    expectation_value: number;
    variance: number;
    measurement_uncertainty: number;
  }> {
    return this.client.post(`${API_CONFIG.algebraUrl}/expectation`, {
      state,
      observable,
    });
  }
}

// Quantum Workload Scheduler API
export class QuantumSchedulerAPI {
  private client = new APIClient();

  async submitJob(job: {
    circuit?: QuantumCircuit;
    job_type: string;
    priority: "critical" | "high" | "normal" | "low";
    estimated_runtime: number;
    required_resources: string[];
  }): Promise<{ job_id: string }> {
    return this.client.post<{ job_id: string }>(
      `${API_CONFIG.schedulerUrl}/jobs/submit`,
      job,
    );
  }

  async getJobStatus(jobId: string): Promise<QuantumJob> {
    return this.client.get<QuantumJob>(
      `${API_CONFIG.schedulerUrl}/jobs/${jobId}`,
    );
  }

  async listJobs(
    status?: string,
    limit: number = 50,
  ): Promise<{
    jobs: QuantumJob[];
    total: number;
    has_more: boolean;
  }> {
    return this.client.get(`${API_CONFIG.schedulerUrl}/jobs`, {
      status,
      limit,
    });
  }

  async getResourceUtilization(): Promise<ResourceUtilization[]> {
    return this.client.get<ResourceUtilization[]>(
      `${API_CONFIG.schedulerUrl}/resources/utilization`,
    );
  }

  async getQueueMetrics(): Promise<{
    total_jobs: number;
    pending_jobs: number;
    running_jobs: number;
    average_wait_time: number;
    throughput: number;
  }> {
    return this.client.get(`${API_CONFIG.schedulerUrl}/metrics/queue`);
  }

  async cancelJob(jobId: string): Promise<{ success: boolean }> {
    return this.client.delete(`${API_CONFIG.schedulerUrl}/jobs/${jobId}`);
  }
}

// Quantum Error Correction API
export class QuantumErrorCorrectionAPI {
  private client = new APIClient();

  async listCodes(): Promise<ErrorCorrectionCode[]> {
    return this.client.get<ErrorCorrectionCode[]>(
      `${API_CONFIG.errorCorrectionUrl}/codes`,
    );
  }

  async encodeLogicalQubit(
    logical_state: [number, number],
    code_type: string,
  ): Promise<{
    encoded_state: QuantumState;
    encoding_fidelity: number;
    physical_qubits_used: number;
  }> {
    return this.client.post(`${API_CONFIG.errorCorrectionUrl}/encode`, {
      logical_state,
      code_type,
    });
  }

  async measureSyndrome(
    physical_state: QuantumState,
    code_type: string,
  ): Promise<SyndromeResult> {
    return this.client.post<SyndromeResult>(
      `${API_CONFIG.errorCorrectionUrl}/syndrome`,
      { physical_state, code_type },
    );
  }

  async correctErrors(
    noisy_state: QuantumState,
    syndrome: SyndromeResult,
    code_type: string,
  ): Promise<{
    corrected_state: QuantumState;
    correction_success: boolean;
    logical_fidelity: number;
    correction_time: number;
  }> {
    return this.client.post(`${API_CONFIG.errorCorrectionUrl}/correct`, {
      noisy_state,
      syndrome,
      code_type,
    });
  }

  async simulateErrorCorrection(
    logical_state: [number, number],
    code_type: string,
    error_rate: number,
    num_cycles: number,
  ): Promise<{
    final_logical_fidelity: number;
    average_correction_success_rate: number;
    total_errors_detected: number;
    total_errors_corrected: number;
    cycles: Array<{
      cycle: number;
      errors_detected: number;
      correction_successful: boolean;
      logical_fidelity: number;
    }>;
  }> {
    return this.client.post(`${API_CONFIG.errorCorrectionUrl}/simulate`, {
      logical_state,
      code_type,
      error_rate,
      num_cycles,
    });
  }
}

// Quantum-Classical Interface API
export class QuantumClassicalInterfaceAPI {
  private client = new APIClient();

  async verifyQuantumOperation(
    operation: string,
    input_types: string[],
    output_types: string[],
  ): Promise<{
    verification_passed: boolean;
    type_compatible: boolean;
    safety_guaranteed: boolean;
    error_message?: string;
  }> {
    return this.client.post(`${API_CONFIG.interfaceUrl}/verify-operation`, {
      operation,
      input_types,
      output_types,
    });
  }

  async executeVerifiedAlgorithm(
    algorithm_steps: Array<{
      operation: string;
      inputs: any[];
      input_var?: string;
      output_var: string;
    }>,
  ): Promise<{
    algorithm_valid: boolean;
    execution_successful: boolean;
    type_errors: string[];
    boundary_violations: string[];
    execution_trace: Array<{
      step: number;
      operation: string;
      verification_passed: boolean;
      execution_time: number;
      error?: string;
    }>;
    final_result: any;
  }> {
    return this.client.post(`${API_CONFIG.interfaceUrl}/execute-algorithm`, {
      algorithm_steps,
    });
  }

  async getInterfaceStatistics(): Promise<{
    total_verifications: number;
    successful_verifications: number;
    type_safety_violations: number;
    boundary_crossings: number;
    average_verification_time: number;
  }> {
    return this.client.get(`${API_CONFIG.interfaceUrl}/statistics`);
  }
}

// Quantum Machine Learning API
export class QuantumMLAPI {
  private client = new APIClient();

  async createVQCClassifier(
    num_qubits: number,
    num_layers: number,
    architecture: string,
  ): Promise<{ model_id: string }> {
    return this.client.post<{ model_id: string }>(
      `${API_CONFIG.mlUrl}/vqc/classifier/create`,
      { num_qubits, num_layers, architecture },
    );
  }

  async createVQCRegressor(
    num_qubits: number,
    num_layers: number,
    architecture: string,
  ): Promise<{ model_id: string }> {
    return this.client.post<{ model_id: string }>(
      `${API_CONFIG.mlUrl}/vqc/regressor/create`,
      { num_qubits, num_layers, architecture },
    );
  }

  async trainVQCModel(
    model_id: string,
    training_data: number[][],
    training_labels: number[],
    validation_data?: number[][],
    validation_labels?: number[],
    config?: Partial<VQCTrainingConfig>,
  ): Promise<{ job_id: string }> {
    return this.client.post<{ job_id: string }>(
      `${API_CONFIG.mlUrl}/vqc/train`,
      {
        model_id,
        training_data,
        training_labels,
        validation_data,
        validation_labels,
        config: {
          learning_rate: 0.01,
          max_iterations: 1000,
          convergence_threshold: 1e-6,
          optimization_method: "adam",
          batch_size: 32,
          ...config,
        },
      },
    );
  }

  async predictVQC(
    model_id: string,
    input_data: number[][],
  ): Promise<{
    predictions: number[];
    probabilities?: number[][]; // For classifiers
    confidence_scores: number[];
    prediction_time: number;
  }> {
    return this.client.post(`${API_CONFIG.mlUrl}/vqc/predict`, {
      model_id,
      input_data,
    });
  }

  async evaluateVQCModel(
    model_id: string,
    test_data: number[][],
    test_labels: number[],
  ): Promise<{
    accuracy?: number; // For classifiers
    precision?: number;
    recall?: number;
    f1_score?: number;
    mse?: number; // For regressors
    mae?: number;
    r2_score?: number;
    confusion_matrix?: number[][];
  }> {
    return this.client.post(`${API_CONFIG.mlUrl}/vqc/evaluate`, {
      model_id,
      test_data,
      test_labels,
    });
  }

  async listVQCModels(): Promise<{
    models: Array<{
      model_id: string;
      model_type: "classifier" | "regressor";
      num_qubits: number;
      num_layers: number;
      architecture: string;
      is_trained: boolean;
      created_at: string;
    }>;
    total: number;
  }> {
    return this.client.get(`${API_CONFIG.mlUrl}/vqc/models`);
  }

  async getModelInfo(model_id: string): Promise<{
    model_id: string;
    model_type: string;
    num_qubits: number;
    num_layers: number;
    architecture: string;
    num_parameters: number;
    is_trained: boolean;
    training_history?: TrainingResult;
    performance_metrics?: any;
  }> {
    return this.client.get(`${API_CONFIG.mlUrl}/vqc/models/${model_id}`);
  }
}

// Combined Quantum API Service
export class QuantumAPIService {
  public algebra = new QuantumAlgebraAPI();
  public scheduler = new QuantumSchedulerAPI();
  public errorCorrection = new QuantumErrorCorrectionAPI();
  public interface = new QuantumClassicalInterfaceAPI();
  public ml = new QuantumMLAPI();

  private client = new APIClient();

  async healthCheck(): Promise<{
    status: "healthy" | "degraded" | "unhealthy";
    services: {
      [serviceName: string]: {
        status: "healthy" | "unhealthy";
        response_time_ms: number;
        last_check: string;
      };
    };
    system_info: {
      total_qubits_available: number;
      active_jobs: number;
      queue_length: number;
      error_correction_enabled: boolean;
    };
  }> {
    return this.client.get(`${API_CONFIG.baseUrl}/health`);
  }

  async getSystemMetrics(): Promise<{
    quantum_volume: number;
    average_gate_fidelity: number;
    error_correction_threshold: number;
    active_circuits: number;
    completed_simulations: number;
    total_quantum_operations: number;
    uptime_seconds: number;
    memory_usage_mb: number;
    cpu_utilization: number;
  }> {
    return this.client.get(`${API_CONFIG.baseUrl}/metrics`);
  }

  // Utility method for batch operations
  async batchExecute<T>(
    operations: Array<() => Promise<T>>,
    concurrency: number = 5,
  ): Promise<Array<{ success: boolean; result?: T; error?: string }>> {
    const results: Array<{ success: boolean; result?: T; error?: string }> = [];

    for (let i = 0; i < operations.length; i += concurrency) {
      const batch = operations.slice(i, i + concurrency);
      const batchPromises = batch.map(async (operation) => {
        try {
          const result = await operation();
          return { success: true, result };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }
}

// Export singleton instance
export const quantumAPI = new QuantumAPIService();

// Export individual services for direct access
export {
  QuantumAlgebraAPI,
  QuantumSchedulerAPI,
  QuantumErrorCorrectionAPI,
  QuantumClassicalInterfaceAPI,
  QuantumMLAPI,
};
