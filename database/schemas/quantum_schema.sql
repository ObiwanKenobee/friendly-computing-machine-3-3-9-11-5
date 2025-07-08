-- Quantum Computing Cloud Database Schema
-- PostgreSQL schema for storing quantum states, error correction codes, and simulation results

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable complex number support (stored as JSON)
-- Enable vector operations for quantum states
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- QUANTUM CIRCUIT AND STATE MANAGEMENT
-- ============================================================================

-- Quantum circuits storage
CREATE TABLE quantum_circuits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circuit_name VARCHAR(255) NOT NULL,
    circuit_description TEXT,
    num_qubits INTEGER NOT NULL CHECK (num_qubits > 0),
    circuit_depth INTEGER NOT NULL CHECK (circuit_depth >= 0),
    circuit_qasm TEXT, -- QASM representation
    circuit_json JSONB, -- JSON representation of gates and parameters
    circuit_type VARCHAR(50) CHECK (circuit_type IN ('algorithm', 'variational', 'error_correction', 'benchmark')),
    complexity_class VARCHAR(50), -- BQP, QMA, etc.
    estimated_fidelity FLOAT CHECK (estimated_fidelity >= 0 AND estimated_fidelity <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    tags TEXT[],
    metadata JSONB
);

-- Quantum states storage with efficient compression
CREATE TABLE quantum_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_name VARCHAR(255),
    num_qubits INTEGER NOT NULL CHECK (num_qubits > 0),
    state_vector_real vector(2048), -- Real part of state vector (limited to 11 qubits for memory)
    state_vector_imag vector(2048), -- Imaginary part of state vector
    state_compressed BYTEA, -- Compressed representation for larger states
    normalization_factor FLOAT NOT NULL DEFAULT 1.0,
    entanglement_entropy FLOAT, -- Von Neumann entropy measure
    purity FLOAT CHECK (purity >= 0 AND purity <= 1),
    is_maximally_entangled BOOLEAN,
    is_product_state BOOLEAN,
    coherence_time FLOAT, -- Estimated coherence time in microseconds
    fidelity_threshold FLOAT DEFAULT 0.95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    circuit_id UUID REFERENCES quantum_circuits(id) ON DELETE SET NULL,
    parent_state_id UUID REFERENCES quantum_states(id) ON DELETE SET NULL,
    metadata JSONB
);

-- Quantum gates library
CREATE TABLE quantum_gates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gate_name VARCHAR(100) NOT NULL,
    gate_symbol VARCHAR(20) NOT NULL,
    num_qubits INTEGER NOT NULL CHECK (num_qubits > 0),
    gate_matrix_real vector(16), -- Real part of unitary matrix (up to 2x2)
    gate_matrix_imag vector(16), -- Imaginary part of unitary matrix
    gate_matrix_json JSONB, -- For larger matrices
    is_unitary BOOLEAN NOT NULL DEFAULT true,
    is_hermitian BOOLEAN DEFAULT false,
    gate_type VARCHAR(50) CHECK (gate_type IN ('pauli', 'rotation', 'controlled', 'measurement', 'custom')),
    computational_cost INTEGER, -- Gate complexity measure
    error_rate FLOAT DEFAULT 0.001,
    gate_time FLOAT, -- Execution time in nanoseconds
    hardware_native BOOLEAN DEFAULT false,
    decomposition JSONB, -- Decomposition into native gates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ERROR CORRECTION AND FAULT TOLERANCE
-- ============================================================================

-- Error correction codes
CREATE TABLE error_correction_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_name VARCHAR(255) NOT NULL,
    code_type VARCHAR(50) CHECK (code_type IN ('steane', 'shor', 'surface', 'color', 'stabilizer', 'topological')),
    num_physical_qubits INTEGER NOT NULL,
    num_logical_qubits INTEGER NOT NULL,
    code_distance INTEGER NOT NULL CHECK (code_distance > 0),
    threshold_error_rate FLOAT CHECK (threshold_error_rate >= 0 AND threshold_error_rate <= 1),
    stabilizer_generators JSONB, -- Stabilizer generator matrices
    logical_operators JSONB, -- Logical X and Z operators
    syndrome_lookup JSONB, -- Syndrome to error mapping
    decoding_algorithm VARCHAR(100),
    correction_overhead FLOAT, -- Resource overhead factor
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    implementation_notes TEXT,
    references TEXT[]
);

-- Error syndromes and correction history
CREATE TABLE error_syndromes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    syndrome_value BIT VARYING NOT NULL, -- Binary syndrome
    error_pattern BIT VARYING, -- Detected error pattern
    correction_applied BIT VARYING, -- Correction operations applied
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    measurement_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    correction_time INTERVAL,
    code_id UUID REFERENCES error_correction_codes(id),
    state_id UUID REFERENCES quantum_states(id),
    success BOOLEAN,
    metadata JSONB
);

-- Quantum error events
CREATE TABLE quantum_errors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_type VARCHAR(50) CHECK (error_type IN ('bit_flip', 'phase_flip', 'depolarizing', 'amplitude_damping', 'phase_damping', 'measurement')),
    affected_qubits INTEGER[] NOT NULL,
    error_probability FLOAT CHECK (error_probability >= 0 AND error_probability <= 1),
    error_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_duration INTERVAL,
    detected BOOLEAN DEFAULT false,
    corrected BOOLEAN DEFAULT false,
    circuit_id UUID REFERENCES quantum_circuits(id),
    state_id UUID REFERENCES quantum_states(id),
    syndrome_id UUID REFERENCES error_syndromes(id),
    error_model JSONB, -- Detailed error model parameters
    environmental_factors JSONB -- Temperature, noise, etc.
);

-- ============================================================================
-- QUANTUM SIMULATION AND COMPUTATION
-- ============================================================================

-- Simulation jobs and results
CREATE TABLE simulation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_name VARCHAR(255),
    job_type VARCHAR(50) CHECK (job_type IN ('state_evolution', 'expectation_value', 'sampling', 'optimization', 'vqc_training')),
    circuit_id UUID REFERENCES quantum_circuits(id),
    num_shots INTEGER DEFAULT 1000,
    simulation_method VARCHAR(50) CHECK (simulation_method IN ('state_vector', 'density_matrix', 'matrix_product_state', 'tensor_network')),
    backend VARCHAR(100), -- Simulation backend used
    resource_estimate JSONB, -- Memory, CPU time estimates
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    wall_time INTERVAL,
    cpu_time INTERVAL,
    memory_usage BIGINT, -- Peak memory usage in bytes
    submitted_by UUID,
    node_assignment VARCHAR(100), -- Compute node where job ran
    error_message TEXT,
    metadata JSONB
);

-- Simulation results and measurements
CREATE TABLE simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES simulation_jobs(id) ON DELETE CASCADE,
    result_type VARCHAR(50) CHECK (result_type IN ('state_vector', 'measurement_counts', 'expectation_values', 'probability_distribution')),
    result_data JSONB NOT NULL, -- Main result data
    result_compressed BYTEA, -- Compressed binary data for large results
    statistical_error FLOAT, -- Estimated statistical error
    systematic_error FLOAT, -- Estimated systematic error
    fidelity FLOAT CHECK (fidelity >= 0 AND fidelity <= 1), -- Fidelity with exact result
    entropy FLOAT, -- Entanglement entropy of result
    measurement_counts JSONB, -- Histogram of measurement outcomes
    expectation_values JSONB, -- Observable expectation values
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checksum VARCHAR(64), -- Data integrity check
    metadata JSONB
);

-- ============================================================================
-- VARIATIONAL QUANTUM ALGORITHMS
-- ============================================================================

-- VQA optimization parameters
CREATE TABLE vqa_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parameter_name VARCHAR(255),
    circuit_id UUID REFERENCES quantum_circuits(id),
    num_parameters INTEGER NOT NULL,
    parameter_values FLOAT[] NOT NULL,
    parameter_bounds JSONB, -- Min/max bounds for each parameter
    optimization_method VARCHAR(50) CHECK (optimization_method IN ('adam', 'bfgs', 'cobyla', 'spsa', 'gradient_descent')),
    learning_rate FLOAT,
    convergence_threshold FLOAT DEFAULT 1e-6,
    max_iterations INTEGER DEFAULT 1000,
    current_iteration INTEGER DEFAULT 0,
    cost_function VARCHAR(100),
    regularization JSONB, -- Regularization parameters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VQA training history
CREATE TABLE vqa_training_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parameter_id UUID REFERENCES vqa_parameters(id) ON DELETE CASCADE,
    iteration INTEGER NOT NULL,
    cost_value FLOAT NOT NULL,
    gradient_norm FLOAT,
    parameter_snapshot FLOAT[],
    convergence_metric FLOAT,
    training_time INTERVAL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Cost function evaluations
CREATE TABLE cost_function_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parameter_id UUID REFERENCES vqa_parameters(id),
    job_id UUID REFERENCES simulation_jobs(id),
    parameter_values FLOAT[] NOT NULL,
    cost_value FLOAT NOT NULL,
    gradient_values FLOAT[],
    evaluation_time INTERVAL,
    num_shots INTEGER,
    statistical_uncertainty FLOAT,
    evaluation_method VARCHAR(50), -- parameter_shift, finite_diff, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- QUANTUM MACHINE LEARNING
-- ============================================================================

-- QML datasets
CREATE TABLE qml_datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_name VARCHAR(255) NOT NULL,
    dataset_type VARCHAR(50) CHECK (dataset_type IN ('classification', 'regression', 'clustering', 'generation')),
    num_samples INTEGER NOT NULL,
    num_features INTEGER NOT NULL,
    num_classes INTEGER, -- For classification
    feature_names TEXT[],
    target_names TEXT[],
    data_location TEXT, -- S3 path or local path
    data_format VARCHAR(20) CHECK (data_format IN ('numpy', 'csv', 'hdf5', 'parquet')),
    preprocessing JSONB, -- Normalization, encoding details
    train_test_split JSONB, -- Split configuration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    metadata JSONB
);

-- QML models
CREATE TABLE qml_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) CHECK (model_type IN ('vqc_classifier', 'vqc_regressor', 'qgan', 'qsvm', 'quantum_boltzmann')),
    circuit_id UUID REFERENCES quantum_circuits(id),
    parameter_id UUID REFERENCES vqa_parameters(id),
    dataset_id UUID REFERENCES qml_datasets(id),
    feature_map VARCHAR(50) CHECK (feature_map IN ('angle_embedding', 'amplitude_embedding', 'iqp_embedding')),
    ansatz_type VARCHAR(50),
    num_layers INTEGER,
    entangling_strategy VARCHAR(50),
    measurement_strategy VARCHAR(50),
    hyperparameters JSONB,
    model_state BYTEA, -- Serialized model
    is_trained BOOLEAN DEFAULT false,
    training_time INTERVAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- QML training metrics
CREATE TABLE qml_training_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES qml_models(id) ON DELETE CASCADE,
    epoch INTEGER NOT NULL,
    training_loss FLOAT,
    validation_loss FLOAT,
    training_accuracy FLOAT,
    validation_accuracy FLOAT,
    precision_score FLOAT,
    recall_score FLOAT,
    f1_score FLOAT,
    r2_score FLOAT, -- For regression
    mae FLOAT, -- Mean absolute error
    mse FLOAT, -- Mean squared error
    quantum_fidelity FLOAT,
    classical_baseline FLOAT,
    training_time INTERVAL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    additional_metrics JSONB
);

-- ============================================================================
-- QUANTUM WORKLOAD SCHEDULING
-- ============================================================================

-- Computational resources
CREATE TABLE quantum_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_name VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50) CHECK (resource_type IN ('quantum_simulator', 'quantum_hardware', 'classical_cpu', 'classical_gpu')),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    current_load INTEGER DEFAULT 0 CHECK (current_load >= 0),
    availability FLOAT DEFAULT 1.0 CHECK (availability >= 0 AND availability <= 1),
    cost_per_unit FLOAT DEFAULT 0,
    quantum_volume INTEGER, -- For quantum hardware
    gate_fidelity FLOAT, -- Average gate fidelity
    coherence_time FLOAT, -- T1/T2 times for quantum hardware
    connectivity JSONB, -- Qubit connectivity graph
    supported_gates TEXT[], -- Native gate set
    location VARCHAR(100),
    vendor VARCHAR(100),
    model VARCHAR(100),
    last_calibration TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline', 'retired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Resource allocation and scheduling
CREATE TABLE resource_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES simulation_jobs(id),
    resource_id UUID REFERENCES quantum_resources(id),
    allocated_capacity INTEGER NOT NULL,
    allocation_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    allocation_end TIMESTAMP WITH TIME ZONE,
    estimated_duration INTERVAL,
    actual_duration INTERVAL,
    priority_level INTEGER DEFAULT 5,
    queue_position INTEGER,
    allocation_efficiency FLOAT, -- Actual vs estimated resource usage
    preempted BOOLEAN DEFAULT false,
    cost FLOAT,
    scheduler_algorithm VARCHAR(50),
    allocation_metadata JSONB
);

-- ============================================================================
-- PERFORMANCE MONITORING AND ANALYTICS
-- ============================================================================

-- System performance metrics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resource_id UUID REFERENCES quantum_resources(id),
    job_id UUID REFERENCES simulation_jobs(id),
    metric_type VARCHAR(50) CHECK (metric_type IN ('throughput', 'latency', 'error_rate', 'utilization', 'fidelity')),
    metric_value FLOAT NOT NULL,
    metric_unit VARCHAR(20),
    measurement_window INTERVAL DEFAULT '1 minute',
    aggregation_method VARCHAR(20) CHECK (aggregation_method IN ('average', 'sum', 'max', 'min', 'percentile')),
    percentile_value FLOAT, -- For percentile aggregations
    tags JSONB, -- Additional metadata tags
    alert_threshold FLOAT,
    alert_triggered BOOLEAN DEFAULT false
);

-- Error tracking and analysis
CREATE TABLE error_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_category VARCHAR(50) CHECK (error_category IN ('hardware', 'software', 'network', 'quantum_decoherence', 'algorithm')),
    error_severity VARCHAR(20) CHECK (error_severity IN ('critical', 'high', 'medium', 'low', 'info')),
    error_code VARCHAR(50),
    error_message TEXT,
    error_context JSONB, -- Stack trace, parameters, etc.
    affected_jobs UUID[],
    affected_resources UUID[],
    resolution_status VARCHAR(50) DEFAULT 'open' CHECK (resolution_status IN ('open', 'investigating', 'resolved', 'wont_fix')),
    resolution_time TIMESTAMP WITH TIME ZONE,
    mitigation_actions TEXT[],
    root_cause TEXT,
    prevention_measures TEXT[]
);

-- ============================================================================
-- QUANTUM ALGORITHM BENCHMARKING
-- ============================================================================

-- Benchmark suites
CREATE TABLE benchmark_suites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suite_name VARCHAR(255) NOT NULL,
    suite_version VARCHAR(50),
    description TEXT,
    benchmark_type VARCHAR(50) CHECK (benchmark_type IN ('quantum_volume', 'randomized_benchmarking', 'process_tomography', 'algorithm_specific')),
    target_metrics TEXT[], -- What metrics this benchmark measures
    reference_values JSONB, -- Known theoretical or classical results
    complexity_scaling JSONB, -- Scaling behavior analysis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    public BOOLEAN DEFAULT false
);

-- Benchmark results
CREATE TABLE benchmark_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suite_id UUID REFERENCES benchmark_suites(id),
    resource_id UUID REFERENCES quantum_resources(id),
    job_id UUID REFERENCES simulation_jobs(id),
    benchmark_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    num_qubits INTEGER,
    circuit_depth INTEGER,
    success_probability FLOAT CHECK (success_probability >= 0 AND success_probability <= 1),
    quantum_volume INTEGER,
    fidelity_score FLOAT,
    runtime_seconds FLOAT,
    gate_error_rate FLOAT,
    readout_error_rate FLOAT,
    crosstalk_score FLOAT,
    calibration_drift FLOAT,
    environmental_conditions JSONB, -- Temperature, magnetic field, etc.
    comparison_baseline FLOAT, -- Classical or ideal quantum result
    quantum_advantage FLOAT, -- Speedup or advantage factor
    statistical_significance FLOAT,
    raw_results JSONB,
    analysis_notes TEXT
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Quantum circuits indexes
CREATE INDEX idx_quantum_circuits_type ON quantum_circuits(circuit_type);
CREATE INDEX idx_quantum_circuits_qubits ON quantum_circuits(num_qubits);
CREATE INDEX idx_quantum_circuits_created ON quantum_circuits(created_at);
CREATE INDEX idx_quantum_circuits_tags ON quantum_circuits USING GIN(tags);

-- Quantum states indexes
CREATE INDEX idx_quantum_states_qubits ON quantum_states(num_qubits);
CREATE INDEX idx_quantum_states_circuit ON quantum_states(circuit_id);
CREATE INDEX idx_quantum_states_entropy ON quantum_states(entanglement_entropy);

-- Simulation jobs indexes
CREATE INDEX idx_simulation_jobs_status ON simulation_jobs(status);
CREATE INDEX idx_simulation_jobs_type ON simulation_jobs(job_type);
CREATE INDEX idx_simulation_jobs_submitted ON simulation_jobs(submitted_at);
CREATE INDEX idx_simulation_jobs_priority ON simulation_jobs(priority);

-- Error tracking indexes
CREATE INDEX idx_error_tracking_timestamp ON error_tracking(error_timestamp);
CREATE INDEX idx_error_tracking_category ON error_tracking(error_category);
CREATE INDEX idx_error_tracking_severity ON error_tracking(error_severity);

-- Performance metrics indexes
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(metric_timestamp);
CREATE INDEX idx_performance_metrics_resource ON performance_metrics(resource_id);
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);

-- QML models indexes
CREATE INDEX idx_qml_models_type ON qml_models(model_type);
CREATE INDEX idx_qml_models_trained ON qml_models(is_trained);
CREATE INDEX idx_qml_models_dataset ON qml_models(dataset_id);

-- Resource allocation indexes
CREATE INDEX idx_resource_allocations_job ON resource_allocations(job_id);
CREATE INDEX idx_resource_allocations_resource ON resource_allocations(resource_id);
CREATE INDEX idx_resource_allocations_start ON resource_allocations(allocation_start);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active simulation jobs with resource allocation
CREATE VIEW active_jobs_with_resources AS
SELECT 
    sj.id,
    sj.job_name,
    sj.job_type,
    sj.status,
    sj.submitted_at,
    sj.started_at,
    qr.resource_name,
    qr.resource_type,
    ra.allocated_capacity,
    ra.allocation_start
FROM simulation_jobs sj
JOIN resource_allocations ra ON sj.id = ra.job_id
JOIN quantum_resources qr ON ra.resource_id = qr.id
WHERE sj.status IN ('running', 'pending');

-- Resource utilization summary
CREATE VIEW resource_utilization_summary AS
SELECT 
    qr.id,
    qr.resource_name,
    qr.resource_type,
    qr.capacity,
    qr.current_load,
    ROUND((qr.current_load::FLOAT / qr.capacity * 100), 2) as utilization_percent,
    qr.availability,
    COUNT(ra.id) as active_allocations
FROM quantum_resources qr
LEFT JOIN resource_allocations ra ON qr.id = ra.resource_id 
    AND ra.allocation_end IS NULL
WHERE qr.status = 'active'
GROUP BY qr.id, qr.resource_name, qr.resource_type, qr.capacity, qr.current_load, qr.availability;

-- Recent error correction statistics
CREATE VIEW error_correction_stats AS
SELECT 
    ecc.code_name,
    ecc.code_type,
    COUNT(es.id) as total_syndromes,
    COUNT(CASE WHEN es.success THEN 1 END) as successful_corrections,
    ROUND(COUNT(CASE WHEN es.success THEN 1 END)::FLOAT / COUNT(es.id) * 100, 2) as success_rate,
    AVG(EXTRACT(EPOCH FROM es.correction_time)) as avg_correction_time_ms
FROM error_correction_codes ecc
LEFT JOIN error_syndromes es ON ecc.id = es.code_id
WHERE es.measurement_time >= NOW() - INTERVAL '24 hours'
GROUP BY ecc.id, ecc.code_name, ecc.code_type;

-- VQA training progress summary
CREATE VIEW vqa_training_progress AS
SELECT 
    vp.id,
    vp.parameter_name,
    vp.optimization_method,
    vp.current_iteration,
    vp.max_iterations,
    ROUND(vp.current_iteration::FLOAT / vp.max_iterations * 100, 2) as progress_percent,
    MIN(vth.cost_value) as best_cost,
    AVG(vth.cost_value) as avg_cost,
    MAX(vth.timestamp) as last_update
FROM vqa_parameters vp
LEFT JOIN vqa_training_history vth ON vp.id = vth.parameter_id
GROUP BY vp.id, vp.parameter_name, vp.optimization_method, vp.current_iteration, vp.max_iterations;

-- ============================================================================
-- FUNCTIONS FOR QUANTUM OPERATIONS
-- ============================================================================

-- Function to calculate quantum state fidelity
CREATE OR REPLACE FUNCTION calculate_fidelity(
    state1_real FLOAT[],
    state1_imag FLOAT[],
    state2_real FLOAT[],
    state2_imag FLOAT[]
) RETURNS FLOAT AS $$
DECLARE
    overlap_real FLOAT := 0;
    overlap_imag FLOAT := 0;
    i INTEGER;
BEGIN
    IF array_length(state1_real, 1) != array_length(state2_real, 1) THEN
        RAISE EXCEPTION 'State vectors must have same dimension';
    END IF;
    
    FOR i IN 1..array_length(state1_real, 1) LOOP
        overlap_real := overlap_real + (state1_real[i] * state2_real[i] + state1_imag[i] * state2_imag[i]);
        overlap_imag := overlap_imag + (state1_imag[i] * state2_real[i] - state1_real[i] * state2_imag[i]);
    END LOOP;
    
    RETURN sqrt(overlap_real * overlap_real + overlap_imag * overlap_imag);
END;
$$ LANGUAGE plpgsql;

-- Function to estimate quantum circuit complexity
CREATE OR REPLACE FUNCTION estimate_circuit_complexity(circuit_json JSONB) RETURNS INTEGER AS $$
DECLARE
    gate_count INTEGER := 0;
    gate JSONB;
BEGIN
    FOR gate IN SELECT * FROM jsonb_array_elements(circuit_json->'gates') LOOP
        -- Count gates with different complexity weights
        CASE (gate->>'type')
            WHEN 'single_qubit' THEN gate_count := gate_count + 1;
            WHEN 'two_qubit' THEN gate_count := gate_count + 3;
            WHEN 'multi_qubit' THEN gate_count := gate_count + (gate->'qubits')::jsonb->array_length(gate->'qubits', 1);
            ELSE gate_count := gate_count + 1;
        END CASE;
    END LOOP;
    
    RETURN gate_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS FOR DATA CONSISTENCY
-- ============================================================================

-- Update quantum states normalization
CREATE OR REPLACE FUNCTION check_state_normalization() RETURNS TRIGGER AS $$
DECLARE
    norm FLOAT;
    i INTEGER;
BEGIN
    norm := 0;
    
    -- Calculate norm squared
    FOR i IN 1..array_length(NEW.state_vector_real, 1) LOOP
        norm := norm + NEW.state_vector_real[i] * NEW.state_vector_real[i] + 
                     NEW.state_vector_imag[i] * NEW.state_vector_imag[i];
    END LOOP;
    
    -- Update normalization factor
    NEW.normalization_factor := sqrt(norm);
    
    -- Check if state is properly normalized
    IF abs(NEW.normalization_factor - 1.0) > 0.01 THEN
        RAISE WARNING 'Quantum state not properly normalized: norm = %', NEW.normalization_factor;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_state_normalization
    BEFORE INSERT OR UPDATE ON quantum_states
    FOR EACH ROW EXECUTE FUNCTION check_state_normalization();

-- Update resource current_load automatically
CREATE OR REPLACE FUNCTION update_resource_load() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE quantum_resources 
        SET current_load = current_load + NEW.allocated_capacity
        WHERE id = NEW.resource_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE quantum_resources 
        SET current_load = current_load - OLD.allocated_capacity
        WHERE id = OLD.resource_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_resource_load
    AFTER INSERT OR DELETE ON resource_allocations
    FOR EACH ROW EXECUTE FUNCTION update_resource_load();

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert some basic quantum gates
INSERT INTO quantum_gates (gate_name, gate_symbol, num_qubits, gate_matrix_real, gate_matrix_imag, gate_type) VALUES
('Pauli-X', 'X', 1, ARRAY[0,1,1,0], ARRAY[0,0,0,0], 'pauli'),
('Pauli-Y', 'Y', 1, ARRAY[0,0,0,0], ARRAY[0,-1,1,0], 'pauli'),
('Pauli-Z', 'Z', 1, ARRAY[1,0,0,-1], ARRAY[0,0,0,0], 'pauli'),
('Hadamard', 'H', 1, ARRAY[0.7071,0.7071,0.7071,-0.7071], ARRAY[0,0,0,0], 'rotation'),
('CNOT', 'CX', 2, ARRAY[1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0], ARRAY[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 'controlled');

-- Insert basic error correction codes
INSERT INTO error_correction_codes (code_name, code_type, num_physical_qubits, num_logical_qubits, code_distance, threshold_error_rate) VALUES
('Steane Code', 'steane', 7, 1, 3, 0.01),
('Shor Code', 'shor', 9, 1, 3, 0.01),
('Surface Code d=3', 'surface', 17, 1, 3, 0.01),
('Surface Code d=5', 'surface', 49, 1, 5, 0.01);

-- Insert sample quantum resources
INSERT INTO quantum_resources (resource_name, resource_type, capacity, cost_per_unit, quantum_volume, gate_fidelity, location) VALUES
('IBM Quantum Simulator', 'quantum_simulator', 32, 0.0, NULL, 0.999, 'Cloud'),
('IonQ Quantum Computer', 'quantum_hardware', 32, 100.0, 64, 0.995, 'AWS Braket'),
('Classical HPC Cluster', 'classical_cpu', 1000, 1.0, NULL, NULL, 'On-premise'),
('GPU Cluster V100', 'classical_gpu', 128, 5.0, NULL, NULL, 'On-premise');

COMMENT ON DATABASE current_database() IS 'Quantum Computing Cloud Platform Database - Stores quantum circuits, states, error correction codes, simulation results, and ML models for fault-tolerant quantum computing over cloud infrastructure.';
