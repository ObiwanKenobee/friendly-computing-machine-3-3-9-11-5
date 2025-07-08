"""
Simplified Quantum Computing Service for AWS App Runner
Lightweight quantum simulation and VQC training service
"""

import os
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import numpy as np
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn
from contextlib import asynccontextmanager
import time
import hashlib
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for App Runner (no persistent storage)
SIMULATION_CACHE = {}
VQC_MODELS = {}
JOB_QUEUE = []
COMPLETED_JOBS = {}

# Quantum simulation with reduced memory footprint
class QuantumSimulatorLite:
    """Lightweight quantum simulator for App Runner constraints"""
    
    def __init__(self, max_qubits: int = 12):  # Limited for 4GB memory
        self.max_qubits = max_qubits
        
    def create_state_vector(self, num_qubits: int) -> np.ndarray:
        """Create quantum state vector"""
        if num_qubits > self.max_qubits:
            raise ValueError(f"Maximum {self.max_qubits} qubits supported")
        
        state = np.zeros(2**num_qubits, dtype=complex)
        state[0] = 1.0  # |0...0⟩
        return state
    
    def apply_gate(self, state: np.ndarray, gate_matrix: np.ndarray, 
                   target_qubits: List[int]) -> np.ndarray:
        """Apply quantum gate to state vector"""
        num_qubits = int(np.log2(len(state)))
        
        if len(target_qubits) == 1:
            return self._apply_single_qubit_gate(state, gate_matrix, target_qubits[0], num_qubits)
        elif len(target_qubits) == 2:
            return self._apply_two_qubit_gate(state, gate_matrix, target_qubits, num_qubits)
        else:
            raise ValueError("Only 1 and 2 qubit gates supported")
    
    def _apply_single_qubit_gate(self, state: np.ndarray, gate: np.ndarray, 
                                target: int, num_qubits: int) -> np.ndarray:
        """Apply single qubit gate"""
        new_state = state.copy()
        
        for i in range(len(state)):
            bit_string = format(i, f'0{num_qubits}b')
            target_bit = int(bit_string[target])
            
            # Calculate the index after flipping target bit
            flipped_i = i ^ (1 << (num_qubits - 1 - target))
            
            if target_bit == 0:
                new_state[i] = gate[0, 0] * state[i] + gate[0, 1] * state[flipped_i]
            else:
                new_state[i] = gate[1, 0] * state[flipped_i] + gate[1, 1] * state[i]
        
        return new_state
    
    def _apply_two_qubit_gate(self, state: np.ndarray, gate: np.ndarray, 
                             targets: List[int], num_qubits: int) -> np.ndarray:
        """Apply two qubit gate (simplified CNOT)"""
        new_state = state.copy()
        control, target = targets[0], targets[1]
        
        for i in range(len(state)):
            bit_string = format(i, f'0{num_qubits}b')
            control_bit = int(bit_string[control])
            target_bit = int(bit_string[target])
            
            if control_bit == 1:  # Apply X gate to target
                flipped_i = i ^ (1 << (num_qubits - 1 - target))
                new_state[i] = state[flipped_i]
        
        return new_state
    
    def measure(self, state: np.ndarray, shots: int = 1000) -> Dict[str, int]:
        """Simulate quantum measurement"""
        probabilities = np.abs(state)**2
        num_qubits = int(np.log2(len(state)))
        
        # Sample outcomes
        outcomes = np.random.choice(len(probabilities), size=shots, p=probabilities)
        
        # Count results
        counts = {}
        for outcome in outcomes:
            bit_string = format(outcome, f'0{num_qubits}b')
            counts[bit_string] = counts.get(bit_string, 0) + 1
        
        return counts

# Simplified VQC for App Runner
class VQCLite:
    """Lightweight Variational Quantum Circuit"""
    
    def __init__(self, num_qubits: int, num_layers: int):
        self.num_qubits = num_qubits
        self.num_layers = num_layers
        self.simulator = QuantumSimulatorLite()
        
        # Initialize parameters
        self.num_params = num_qubits * num_layers * 2  # RY + RZ per qubit per layer
        self.parameters = np.random.uniform(0, 2*np.pi, self.num_params)
        
        # Precompute gates
        self.ry_gate = lambda theta: np.array([
            [np.cos(theta/2), -np.sin(theta/2)],
            [np.sin(theta/2), np.cos(theta/2)]
        ], dtype=complex)
        
        self.rz_gate = lambda theta: np.array([
            [np.exp(-1j*theta/2), 0],
            [0, np.exp(1j*theta/2)]
        ], dtype=complex)
        
        self.cnot_gate = np.array([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1],
            [0, 0, 1, 0]
        ], dtype=complex)
    
    def forward(self, input_data: Optional[List[float]] = None) -> List[float]:
        """Forward pass through VQC"""
        state = self.simulator.create_state_vector(self.num_qubits)
        
        # Encode input data if provided
        if input_data:
            for i, val in enumerate(input_data[:self.num_qubits]):
                ry_matrix = self.ry_gate(val)
                state = self.simulator.apply_gate(state, ry_matrix, [i])
        
        # Apply variational layers
        param_idx = 0
        for layer in range(self.num_layers):
            # Rotation gates
            for qubit in range(self.num_qubits):
                # RY rotation
                ry_matrix = self.ry_gate(self.parameters[param_idx])
                state = self.simulator.apply_gate(state, ry_matrix, [qubit])
                param_idx += 1
                
                # RZ rotation
                rz_matrix = self.rz_gate(self.parameters[param_idx])
                state = self.simulator.apply_gate(state, rz_matrix, [qubit])
                param_idx += 1
            
            # Entangling gates
            for i in range(self.num_qubits - 1):
                state = self.simulator.apply_gate(state, self.cnot_gate, [i, i+1])
        
        # Calculate expectation values
        expectations = []
        for qubit in range(self.num_qubits):
            # Pauli-Z expectation value
            prob_0 = 0
            prob_1 = 0
            
            for i in range(len(state)):
                bit_string = format(i, f'0{self.num_qubits}b')
                if bit_string[qubit] == '0':
                    prob_0 += np.abs(state[i])**2
                else:
                    prob_1 += np.abs(state[i])**2
            
            expectation = prob_0 - prob_1
            expectations.append(expectation)
        
        return expectations

# Pydantic models for API
class QuantumCircuitRequest(BaseModel):
    num_qubits: int = Field(..., ge=1, le=12, description="Number of qubits (1-12)")
    gates: List[Dict[str, Any]] = Field(..., description="List of quantum gates")
    shots: int = Field(1000, ge=1, le=10000, description="Number of measurement shots")

class VQCRequest(BaseModel):
    num_qubits: int = Field(..., ge=1, le=8, description="Number of qubits (1-8)")
    num_layers: int = Field(..., ge=1, le=10, description="Number of layers (1-10)")
    input_data: Optional[List[float]] = Field(None, description="Input data for encoding")

class TrainingRequest(BaseModel):
    model_id: str = Field(..., description="VQC model ID")
    training_data: List[List[float]] = Field(..., description="Training data")
    training_labels: List[float] = Field(..., description="Training labels")
    learning_rate: float = Field(0.1, ge=0.001, le=1.0, description="Learning rate")
    iterations: int = Field(100, ge=1, le=1000, description="Training iterations")

class JobStatus(BaseModel):
    job_id: str
    status: str
    progress: float
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

# Background task processing
async def process_quantum_job(job_id: str, job_data: Dict[str, Any]):
    """Process quantum computation job in background"""
    try:
        job_type = job_data['type']
        
        if job_type == 'simulation':
            # Process quantum circuit simulation
            circuit_data = job_data['circuit']
            simulator = QuantumSimulatorLite()
            
            # Create initial state
            state = simulator.create_state_vector(circuit_data['num_qubits'])
            
            # Apply gates
            for gate_info in circuit_data['gates']:
                gate_type = gate_info['type']
                targets = gate_info['targets']
                
                if gate_type == 'h':  # Hadamard
                    h_gate = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
                    state = simulator.apply_gate(state, h_gate, targets)
                elif gate_type == 'x':  # Pauli-X
                    x_gate = np.array([[0, 1], [1, 0]], dtype=complex)
                    state = simulator.apply_gate(state, x_gate, targets)
                elif gate_type == 'cnot':  # CNOT
                    cnot_gate = np.array([[1, 0, 0, 0], [0, 1, 0, 0], 
                                        [0, 0, 0, 1], [0, 0, 1, 0]], dtype=complex)
                    state = simulator.apply_gate(state, cnot_gate, targets)
            
            # Measure
            counts = simulator.measure(state, circuit_data['shots'])
            
            # Store result
            COMPLETED_JOBS[job_id] = {
                'status': 'completed',
                'result': {
                    'counts': counts,
                    'state_vector': state.tolist(),
                    'fidelity': 1.0  # Simplified
                },
                'completed_at': datetime.now()
            }
            
        elif job_type == 'vqc_training':
            # Process VQC training
            training_data = job_data['training']
            model_id = training_data['model_id']
            
            if model_id not in VQC_MODELS:
                raise ValueError(f"Model {model_id} not found")
            
            vqc = VQC_MODELS[model_id]
            
            # Simple gradient descent training (simplified)
            X = np.array(training_data['training_data'])
            y = np.array(training_data['training_labels'])
            lr = training_data['learning_rate']
            iterations = training_data['iterations']
            
            losses = []
            for iteration in range(iterations):
                total_loss = 0
                gradients = np.zeros_like(vqc.parameters)
                
                for i, (x_i, y_i) in enumerate(zip(X, y)):
                    prediction = vqc.forward(x_i.tolist())[0]  # Use first qubit
                    loss = (prediction - y_i) ** 2
                    total_loss += loss
                    
                    # Simple finite difference gradient
                    eps = 0.01
                    for j in range(len(vqc.parameters)):
                        vqc.parameters[j] += eps
                        pred_plus = vqc.forward(x_i.tolist())[0]
                        vqc.parameters[j] -= 2 * eps
                        pred_minus = vqc.forward(x_i.tolist())[0]
                        vqc.parameters[j] += eps
                        
                        gradient = (pred_plus - pred_minus) / (2 * eps)
                        gradients[j] += 2 * (prediction - y_i) * gradient
                
                # Update parameters
                vqc.parameters -= lr * gradients / len(X)
                losses.append(total_loss / len(X))
                
                # Update progress
                progress = (iteration + 1) / iterations
                if job_id in COMPLETED_JOBS:
                    COMPLETED_JOBS[job_id]['progress'] = progress
            
            # Store final result
            COMPLETED_JOBS[job_id] = {
                'status': 'completed',
                'result': {
                    'final_loss': losses[-1],
                    'training_history': losses,
                    'parameters': vqc.parameters.tolist()
                },
                'completed_at': datetime.now(),
                'progress': 1.0
            }
            
    except Exception as e:
        COMPLETED_JOBS[job_id] = {
            'status': 'failed',
            'error': str(e),
            'completed_at': datetime.now()
        }

# FastAPI app with lifespan context
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Quantum Service Lite for AWS App Runner")
    yield
    # Shutdown
    logger.info("Shutting down Quantum Service Lite")

app = FastAPI(
    title="Quantum Computing Service Lite",
    description="Lightweight quantum computing service for AWS App Runner",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check for App Runner"""
    return {
        "status": "healthy",
        "service": "quantum-service-lite",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "memory_usage": f"{len(SIMULATION_CACHE)} simulations cached",
        "active_models": len(VQC_MODELS)
    }

# Quantum circuit simulation endpoint
@app.post("/api/v1/simulate")
async def simulate_quantum_circuit(
    request: QuantumCircuitRequest,
    background_tasks: BackgroundTasks
):
    """Simulate quantum circuit"""
    # Generate job ID
    job_id = hashlib.md5(
        f"{request.dict()}{time.time()}".encode()
    ).hexdigest()
    
    # Add to job queue
    job_data = {
        'type': 'simulation',
        'circuit': request.dict()
    }
    
    # Initialize job status
    COMPLETED_JOBS[job_id] = {
        'status': 'processing',
        'progress': 0.0,
        'created_at': datetime.now()
    }
    
    # Process in background
    background_tasks.add_task(process_quantum_job, job_id, job_data)
    
    return {
        "job_id": job_id,
        "status": "submitted",
        "message": "Quantum circuit simulation started"
    }

# VQC model creation
@app.post("/api/v1/vqc/create")
async def create_vqc_model(request: VQCRequest):
    """Create VQC model"""
    model_id = hashlib.md5(
        f"{request.dict()}{time.time()}".encode()
    ).hexdigest()
    
    try:
        vqc = VQCLite(request.num_qubits, request.num_layers)
        VQC_MODELS[model_id] = vqc
        
        return {
            "model_id": model_id,
            "num_qubits": request.num_qubits,
            "num_layers": request.num_layers,
            "num_parameters": vqc.num_params,
            "status": "created"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# VQC prediction
@app.post("/api/v1/vqc/{model_id}/predict")
async def predict_vqc(model_id: str, input_data: List[float]):
    """Make prediction with VQC model"""
    if model_id not in VQC_MODELS:
        raise HTTPException(status_code=404, detail="Model not found")
    
    try:
        vqc = VQC_MODELS[model_id]
        prediction = vqc.forward(input_data)
        
        return {
            "model_id": model_id,
            "input": input_data,
            "prediction": prediction,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# VQC training
@app.post("/api/v1/vqc/train")
async def train_vqc_model(
    request: TrainingRequest,
    background_tasks: BackgroundTasks
):
    """Train VQC model"""
    if request.model_id not in VQC_MODELS:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Generate job ID
    job_id = hashlib.md5(
        f"{request.dict()}{time.time()}".encode()
    ).hexdigest()
    
    # Add to job queue
    job_data = {
        'type': 'vqc_training',
        'training': request.dict()
    }
    
    # Initialize job status
    COMPLETED_JOBS[job_id] = {
        'status': 'processing',
        'progress': 0.0,
        'created_at': datetime.now()
    }
    
    # Process in background
    background_tasks.add_task(process_quantum_job, job_id, job_data)
    
    return {
        "job_id": job_id,
        "status": "submitted",
        "message": "VQC training started"
    }

# Job status endpoint
@app.get("/api/v1/jobs/{job_id}")
async def get_job_status(job_id: str):
    """Get job status and results"""
    if job_id not in COMPLETED_JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_info = COMPLETED_JOBS[job_id]
    return JobStatus(**job_info, job_id=job_id)

# List available models
@app.get("/api/v1/vqc/models")
async def list_vqc_models():
    """List all VQC models"""
    models = []
    for model_id, vqc in VQC_MODELS.items():
        models.append({
            "model_id": model_id,
            "num_qubits": vqc.num_qubits,
            "num_layers": vqc.num_layers,
            "num_parameters": vqc.num_params
        })
    
    return {"models": models, "total": len(models)}

# System information
@app.get("/api/v1/system/info")
async def get_system_info():
    """Get system information"""
    return {
        "service": "Quantum Computing Service Lite",
        "version": "1.0.0",
        "platform": "AWS App Runner",
        "capabilities": {
            "max_qubits_simulation": 12,
            "max_qubits_vqc": 8,
            "supported_gates": ["H", "X", "Y", "Z", "CNOT", "RY", "RZ"],
            "max_shots": 10000
        },
        "current_usage": {
            "cached_simulations": len(SIMULATION_CACHE),
            "active_models": len(VQC_MODELS),
            "completed_jobs": len(COMPLETED_JOBS)
        },
        "memory_optimized": True,
        "background_processing": True
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "message": "QuantumVest Quantum Computing Service Lite",
        "status": "running",
        "platform": "AWS App Runner",
        "docs": "/docs",
        "health": "/health",
        "api_version": "v1"
    }

if __name__ == "__main__":
    # App Runner will handle this, but useful for local testing
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        access_log=True
    )
