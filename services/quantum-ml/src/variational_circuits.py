"""
Variational Quantum Circuit Machine Learning Service
Implements VQCs with careful tuning of cost functions on complex vector spaces
"""

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from typing import List, Dict, Tuple, Optional, Any, Callable, Union
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import logging
import time
import json
from abc import ABC, abstractmethod
import matplotlib.pyplot as plt
from scipy.optimize import minimize
import pennylane as qml
from pennylane import numpy as pnp
import redis
import pickle

logger = logging.getLogger(__name__)

class OptimizationMethod(Enum):
    """Optimization methods for VQC training"""
    ADAM = "adam"
    GRADIENT_DESCENT = "gradient_descent"
    BFGS = "bfgs"
    SPSA = "spsa"  # Simultaneous Perturbation Stochastic Approximation
    COBYLA = "cobyla"
    PARAMETER_SHIFT = "parameter_shift"

class CircuitArchitecture(Enum):
    """VQC architecture types"""
    HARDWARE_EFFICIENT = "hardware_efficient"
    REAL_AMPLITUDES = "real_amplitudes"
    TWO_LOCAL = "two_local"
    QAOA = "qaoa"
    VARIATIONAL_QUANTUM_EIGENSOLVER = "vqe"
    QUANTUM_APPROXIMATE_OPTIMIZATION = "qaoa"
    QUANTUM_NEURAL_NETWORK = "qnn"

@dataclass
class VQCParameters:
    """Parameters for Variational Quantum Circuit"""
    num_qubits: int
    num_layers: int
    architecture: CircuitArchitecture
    entangling_gates: List[str] = field(default_factory=lambda: ["cx"])
    rotation_gates: List[str] = field(default_factory=lambda: ["ry", "rz"])
    parameter_initialization: str = "random"  # random, zeros, pi_half
    
@dataclass
class TrainingConfig:
    """Configuration for VQC training"""
    learning_rate: float = 0.01
    max_iterations: int = 1000
    convergence_threshold: float = 1e-6
    optimization_method: OptimizationMethod = OptimizationMethod.ADAM
    batch_size: int = 32
    validation_split: float = 0.2
    early_stopping_patience: int = 50
    
@dataclass
class CostFunction:
    """Cost function specification for VQC optimization"""
    name: str
    function: Callable
    gradient_method: str = "auto"  # auto, finite_diff, parameter_shift
    regularization_weight: float = 0.0
    
class QuantumFeatureMap(ABC):
    """Abstract base class for quantum feature maps"""
    
    @abstractmethod
    def encode(self, classical_data: np.ndarray, qubits: List[int]) -> qml.QNode:
        """Encode classical data into quantum states"""
        pass

class AngleEmbedding(QuantumFeatureMap):
    """Angle embedding feature map"""
    
    def encode(self, classical_data: np.ndarray, qubits: List[int]) -> None:
        """Encode data as rotation angles"""
        for i, qubit in enumerate(qubits):
            if i < len(classical_data):
                qml.RY(classical_data[i], wires=qubit)

class AmplitudeEmbedding(QuantumFeatureMap):
    """Amplitude embedding feature map"""
    
    def encode(self, classical_data: np.ndarray, qubits: List[int]) -> None:
        """Encode data as quantum state amplitudes"""
        # Normalize data for valid quantum state
        normalized_data = classical_data / np.linalg.norm(classical_data)
        
        # Pad to power of 2 if necessary
        n_qubits = len(qubits)
        required_length = 2**n_qubits
        
        if len(normalized_data) < required_length:
            padded_data = np.zeros(required_length)
            padded_data[:len(normalized_data)] = normalized_data
            normalized_data = padded_data
        elif len(normalized_data) > required_length:
            normalized_data = normalized_data[:required_length]
        
        qml.AmplitudeEmbedding(normalized_data, wires=qubits, normalize=True)

class IQPEmbedding(QuantumFeatureMap):
    """Instantaneous Quantum Polynomial (IQP) embedding"""
    
    def encode(self, classical_data: np.ndarray, qubits: List[int]) -> None:
        """Encode using IQP circuits"""
        # Hadamard layer
        for qubit in qubits:
            qml.Hadamard(wires=qubit)
        
        # Data encoding with Z rotations
        for i, qubit in enumerate(qubits):
            if i < len(classical_data):
                qml.RZ(classical_data[i], wires=qubit)
        
        # Entangling layer
        for i in range(len(qubits) - 1):
            qml.CNOT(wires=[qubits[i], qubits[i + 1]])
            if i < len(classical_data):
                qml.RZ(classical_data[i] * classical_data[(i + 1) % len(classical_data)], 
                       wires=qubits[i + 1])
            qml.CNOT(wires=[qubits[i], qubits[i + 1]])

class VariationalQuantumCircuit:
    """Variational Quantum Circuit implementation"""
    
    def __init__(self, parameters: VQCParameters, feature_map: QuantumFeatureMap = None):
        self.parameters = parameters
        self.feature_map = feature_map or AngleEmbedding()
        
        # Initialize quantum device
        self.device = qml.device('default.qubit', wires=parameters.num_qubits)
        
        # Initialize variational parameters
        self.num_parameters = self._calculate_num_parameters()
        self.variational_params = self._initialize_parameters()
        
        # Create quantum circuit
        self.qnode = self._create_circuit()
        
    def _calculate_num_parameters(self) -> int:
        """Calculate number of variational parameters"""
        if self.parameters.architecture == CircuitArchitecture.HARDWARE_EFFICIENT:
            # Each layer has rotation gates for each qubit + entangling gates
            params_per_layer = len(self.parameters.rotation_gates) * self.parameters.num_qubits
            return params_per_layer * self.parameters.num_layers
        elif self.parameters.architecture == CircuitArchitecture.TWO_LOCAL:
            # Two rotation gates per qubit per layer
            params_per_layer = 2 * self.parameters.num_qubits
            return params_per_layer * self.parameters.num_layers
        else:
            # Default: one parameter per qubit per layer
            return self.parameters.num_qubits * self.parameters.num_layers
    
    def _initialize_parameters(self) -> np.ndarray:
        """Initialize variational parameters"""
        if self.parameters.parameter_initialization == "random":
            return np.random.uniform(0, 2*np.pi, self.num_parameters)
        elif self.parameters.parameter_initialization == "zeros":
            return np.zeros(self.num_parameters)
        elif self.parameters.parameter_initialization == "pi_half":
            return np.full(self.num_parameters, np.pi/2)
        else:
            return np.random.uniform(0, 2*np.pi, self.num_parameters)
    
    def _create_circuit(self) -> qml.QNode:
        """Create the variational quantum circuit"""
        
        @qml.qnode(self.device, interface='autograd')
        def circuit(params, classical_input=None):
            # Feature map encoding
            if classical_input is not None:
                self.feature_map.encode(classical_input, list(range(self.parameters.num_qubits)))
            
            # Variational layers
            param_idx = 0
            for layer in range(self.parameters.num_layers):
                # Rotation gates
                for qubit in range(self.parameters.num_qubits):
                    for gate_type in self.parameters.rotation_gates:
                        if gate_type == "rx":
                            qml.RX(params[param_idx], wires=qubit)
                        elif gate_type == "ry":
                            qml.RY(params[param_idx], wires=qubit)
                        elif gate_type == "rz":
                            qml.RZ(params[param_idx], wires=qubit)
                        param_idx += 1
                
                # Entangling gates
                for i in range(self.parameters.num_qubits - 1):
                    for gate_type in self.parameters.entangling_gates:
                        if gate_type == "cx" or gate_type == "cnot":
                            qml.CNOT(wires=[i, i + 1])
                        elif gate_type == "cz":
                            qml.CZ(wires=[i, i + 1])
                        elif gate_type == "iswap":
                            qml.ISWAP(wires=[i, i + 1])
            
            # Return expectation values for classification/regression
            return [qml.expval(qml.PauliZ(i)) for i in range(self.parameters.num_qubits)]
        
        return circuit
    
    def forward(self, classical_input: np.ndarray) -> np.ndarray:
        """Forward pass through VQC"""
        return np.array(self.qnode(self.variational_params, classical_input))
    
    def update_parameters(self, new_params: np.ndarray):
        """Update variational parameters"""
        self.variational_params = new_params.copy()

class VQCOptimizer:
    """Optimizer for Variational Quantum Circuits"""
    
    def __init__(self, vqc: VariationalQuantumCircuit, training_config: TrainingConfig):
        self.vqc = vqc
        self.config = training_config
        self.training_history = {
            'loss': [],
            'validation_loss': [],
            'parameters': [],
            'gradients': []
        }
        
        # Initialize optimizer based on method
        if training_config.optimization_method == OptimizationMethod.ADAM:
            self.torch_optimizer = optim.Adam([torch.tensor(vqc.variational_params, requires_grad=True)], 
                                            lr=training_config.learning_rate)
        elif training_config.optimization_method == OptimizationMethod.GRADIENT_DESCENT:
            self.torch_optimizer = optim.SGD([torch.tensor(vqc.variational_params, requires_grad=True)], 
                                           lr=training_config.learning_rate)
    
    def compute_cost_function(self, parameters: np.ndarray, 
                            X: np.ndarray, y: np.ndarray, 
                            cost_function: CostFunction) -> float:
        """Compute cost function value"""
        self.vqc.update_parameters(parameters)
        
        total_cost = 0.0
        batch_size = min(self.config.batch_size, len(X))
        
        for i in range(0, len(X), batch_size):
            batch_X = X[i:i+batch_size]
            batch_y = y[i:i+batch_size]
            
            batch_cost = 0.0
            for x, target in zip(batch_X, batch_y):
                prediction = self.vqc.forward(x)
                batch_cost += cost_function.function(prediction, target)
            
            total_cost += batch_cost / len(batch_X)
        
        # Add regularization
        if cost_function.regularization_weight > 0:
            regularization = cost_function.regularization_weight * np.sum(parameters**2)
            total_cost += regularization
        
        return total_cost / (len(X) // batch_size + (1 if len(X) % batch_size > 0 else 0))
    
    def compute_gradient(self, parameters: np.ndarray, 
                        X: np.ndarray, y: np.ndarray, 
                        cost_function: CostFunction) -> np.ndarray:
        """Compute gradient using parameter shift rule or finite differences"""
        
        if cost_function.gradient_method == "parameter_shift":
            return self._parameter_shift_gradient(parameters, X, y, cost_function)
        elif cost_function.gradient_method == "finite_diff":
            return self._finite_difference_gradient(parameters, X, y, cost_function)
        else:
            # Auto-differentiation (if supported)
            return self._autograd_gradient(parameters, X, y, cost_function)
    
    def _parameter_shift_gradient(self, parameters: np.ndarray,
                                X: np.ndarray, y: np.ndarray,
                                cost_function: CostFunction) -> np.ndarray:
        """Compute gradient using parameter shift rule"""
        gradient = np.zeros_like(parameters)
        shift = np.pi / 2
        
        for i in range(len(parameters)):
            # Forward shift
            params_plus = parameters.copy()
            params_plus[i] += shift
            cost_plus = self.compute_cost_function(params_plus, X, y, cost_function)
            
            # Backward shift
            params_minus = parameters.copy()
            params_minus[i] -= shift
            cost_minus = self.compute_cost_function(params_minus, X, y, cost_function)
            
            # Parameter shift rule
            gradient[i] = (cost_plus - cost_minus) / 2
        
        return gradient
    
    def _finite_difference_gradient(self, parameters: np.ndarray,
                                  X: np.ndarray, y: np.ndarray,
                                  cost_function: CostFunction) -> np.ndarray:
        """Compute gradient using finite differences"""
        gradient = np.zeros_like(parameters)
        epsilon = 1e-6
        
        for i in range(len(parameters)):
            params_plus = parameters.copy()
            params_plus[i] += epsilon
            cost_plus = self.compute_cost_function(params_plus, X, y, cost_function)
            
            params_minus = parameters.copy()
            params_minus[i] -= epsilon
            cost_minus = self.compute_cost_function(params_minus, X, y, cost_function)
            
            gradient[i] = (cost_plus - cost_minus) / (2 * epsilon)
        
        return gradient
    
    def _autograd_gradient(self, parameters: np.ndarray,
                          X: np.ndarray, y: np.ndarray,
                          cost_function: CostFunction) -> np.ndarray:
        """Compute gradient using automatic differentiation"""
        # This would use PennyLane's autograd capabilities
        # Simplified implementation here
        return self._finite_difference_gradient(parameters, X, y, cost_function)
    
    def train(self, X_train: np.ndarray, y_train: np.ndarray,
             X_val: np.ndarray, y_val: np.ndarray,
             cost_function: CostFunction) -> Dict[str, Any]:
        """Train the VQC using specified optimization method"""
        
        start_time = time.time()
        best_loss = float('inf')
        patience_counter = 0
        
        logger.info(f"Starting VQC training with {self.config.optimization_method.name}")
        
        for iteration in range(self.config.max_iterations):
            # Compute current loss
            current_loss = self.compute_cost_function(
                self.vqc.variational_params, X_train, y_train, cost_function
            )
            
            # Compute validation loss
            val_loss = self.compute_cost_function(
                self.vqc.variational_params, X_val, y_val, cost_function
            )
            
            # Store history
            self.training_history['loss'].append(current_loss)
            self.training_history['validation_loss'].append(val_loss)
            self.training_history['parameters'].append(self.vqc.variational_params.copy())
            
            # Check convergence
            if abs(current_loss - best_loss) < self.config.convergence_threshold:
                logger.info(f"Converged at iteration {iteration}")
                break
            
            # Early stopping
            if val_loss < best_loss:
                best_loss = val_loss
                patience_counter = 0
            else:
                patience_counter += 1
                if patience_counter >= self.config.early_stopping_patience:
                    logger.info(f"Early stopping at iteration {iteration}")
                    break
            
            # Compute gradient and update parameters
            if self.config.optimization_method in [OptimizationMethod.ADAM, OptimizationMethod.GRADIENT_DESCENT]:
                gradient = self.compute_gradient(
                    self.vqc.variational_params, X_train, y_train, cost_function
                )
                self.training_history['gradients'].append(gradient.copy())
                
                # PyTorch optimization step
                self.torch_optimizer.zero_grad()
                params_tensor = torch.tensor(self.vqc.variational_params, requires_grad=True)
                params_tensor.grad = torch.tensor(gradient)
                self.torch_optimizer.step()
                
                self.vqc.update_parameters(params_tensor.detach().numpy())
                
            elif self.config.optimization_method == OptimizationMethod.BFGS:
                # Use scipy optimization
                result = minimize(
                    fun=lambda p: self.compute_cost_function(p, X_train, y_train, cost_function),
                    x0=self.vqc.variational_params,
                    method='BFGS',
                    options={'maxiter': 10}  # Limit iterations per update
                )
                self.vqc.update_parameters(result.x)
            
            elif self.config.optimization_method == OptimizationMethod.SPSA:
                # Simultaneous Perturbation Stochastic Approximation
                self._spsa_update(X_train, y_train, cost_function, iteration)
            
            # Log progress
            if iteration % 10 == 0:
                logger.info(f"Iteration {iteration}: Loss = {current_loss:.6f}, Val Loss = {val_loss:.6f}")
        
        training_time = time.time() - start_time
        
        return {
            'final_loss': current_loss,
            'final_validation_loss': val_loss,
            'training_time': training_time,
            'iterations': len(self.training_history['loss']),
            'converged': abs(current_loss - best_loss) < self.config.convergence_threshold,
            'history': self.training_history
        }
    
    def _spsa_update(self, X: np.ndarray, y: np.ndarray, 
                    cost_function: CostFunction, iteration: int):
        """SPSA optimization update"""
        # SPSA parameters
        a = self.config.learning_rate
        c = 0.1
        alpha = 0.602
        gamma = 0.101
        
        # Calculate step sizes
        ak = a / ((iteration + 1) ** alpha)
        ck = c / ((iteration + 1) ** gamma)
        
        # Generate random perturbation
        delta = 2 * np.random.randint(0, 2, size=len(self.vqc.variational_params)) - 1
        
        # Evaluate cost at perturbed points
        params_plus = self.vqc.variational_params + ck * delta
        params_minus = self.vqc.variational_params - ck * delta
        
        cost_plus = self.compute_cost_function(params_plus, X, y, cost_function)
        cost_minus = self.compute_cost_function(params_minus, X, y, cost_function)
        
        # SPSA gradient estimate
        gradient_estimate = (cost_plus - cost_minus) / (2 * ck * delta)
        
        # Update parameters
        new_params = self.vqc.variational_params - ak * gradient_estimate
        self.vqc.update_parameters(new_params)

class VQCClassifier:
    """Variational Quantum Circuit Classifier"""
    
    def __init__(self, vqc_parameters: VQCParameters, training_config: TrainingConfig):
        self.vqc = VariationalQuantumCircuit(vqc_parameters, AngleEmbedding())
        self.optimizer = VQCOptimizer(self.vqc, training_config)
        self.is_trained = False
        
        # Define classification cost function
        self.cost_function = CostFunction(
            name="cross_entropy",
            function=self._cross_entropy_loss,
            gradient_method="parameter_shift"
        )
    
    def _cross_entropy_loss(self, prediction: np.ndarray, target: float) -> float:
        """Cross-entropy loss for binary classification"""
        # Convert VQC output to probability
        prob = (prediction[0] + 1) / 2  # Map from [-1, 1] to [0, 1]
        prob = np.clip(prob, 1e-10, 1 - 1e-10)  # Avoid log(0)
        
        if target == 1:
            return -np.log(prob)
        else:
            return -np.log(1 - prob)
    
    def fit(self, X_train: np.ndarray, y_train: np.ndarray,
           X_val: np.ndarray = None, y_val: np.ndarray = None) -> Dict[str, Any]:
        """Train the VQC classifier"""
        
        # Use validation split if not provided
        if X_val is None or y_val is None:
            split_idx = int(len(X_train) * (1 - self.optimizer.config.validation_split))
            X_val = X_train[split_idx:]
            y_val = y_train[split_idx:]
            X_train = X_train[:split_idx]
            y_train = y_train[:split_idx]
        
        training_result = self.optimizer.train(X_train, y_train, X_val, y_val, self.cost_function)
        self.is_trained = True
        
        return training_result
    
    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Predict class probabilities"""
        if not self.is_trained:
            raise ValueError("Model must be trained before prediction")
        
        probabilities = []
        for x in X:
            output = self.vqc.forward(x)
            prob = (output[0] + 1) / 2  # Map from [-1, 1] to [0, 1]
            probabilities.append([1 - prob, prob])
        
        return np.array(probabilities)
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict class labels"""
        probabilities = self.predict_proba(X)
        return (probabilities[:, 1] > 0.5).astype(int)

class VQCRegressor:
    """Variational Quantum Circuit Regressor"""
    
    def __init__(self, vqc_parameters: VQCParameters, training_config: TrainingConfig):
        self.vqc = VariationalQuantumCircuit(vqc_parameters, AngleEmbedding())
        self.optimizer = VQCOptimizer(self.vqc, training_config)
        self.is_trained = False
        
        # Define regression cost function
        self.cost_function = CostFunction(
            name="mse",
            function=self._mse_loss,
            gradient_method="parameter_shift"
        )
    
    def _mse_loss(self, prediction: np.ndarray, target: float) -> float:
        """Mean squared error loss"""
        # Use first qubit expectation value as prediction
        pred_value = prediction[0]
        return (pred_value - target) ** 2
    
    def fit(self, X_train: np.ndarray, y_train: np.ndarray,
           X_val: np.ndarray = None, y_val: np.ndarray = None) -> Dict[str, Any]:
        """Train the VQC regressor"""
        
        # Normalize targets to [-1, 1] range for VQC output
        self.y_min = np.min(y_train)
        self.y_max = np.max(y_train)
        y_train_normalized = 2 * (y_train - self.y_min) / (self.y_max - self.y_min) - 1
        
        if X_val is None or y_val is None:
            split_idx = int(len(X_train) * (1 - self.optimizer.config.validation_split))
            X_val = X_train[split_idx:]
            y_val = y_train_normalized[split_idx:]
            X_train = X_train[:split_idx]
            y_train_normalized = y_train_normalized[:split_idx]
        else:
            y_val = 2 * (y_val - self.y_min) / (self.y_max - self.y_min) - 1
        
        training_result = self.optimizer.train(X_train, y_train_normalized, X_val, y_val, self.cost_function)
        self.is_trained = True
        
        return training_result
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict target values"""
        if not self.is_trained:
            raise ValueError("Model must be trained before prediction")
        
        predictions = []
        for x in X:
            output = self.vqc.forward(x)
            # Denormalize prediction
            pred_normalized = output[0]
            pred = (pred_normalized + 1) * (self.y_max - self.y_min) / 2 + self.y_min
            predictions.append(pred)
        
        return np.array(predictions)

class VQCMLService:
    """Main service for Variational Quantum Circuit Machine Learning"""
    
    def __init__(self, redis_url: str = None):
        self.models: Dict[str, Union[VQCClassifier, VQCRegressor]] = {}
        self.redis_client = redis.Redis.from_url(redis_url) if redis_url else None
        
    async def create_classifier(self, model_id: str, 
                              vqc_parameters: VQCParameters,
                              training_config: TrainingConfig) -> str:
        """Create a new VQC classifier"""
        classifier = VQCClassifier(vqc_parameters, training_config)
        self.models[model_id] = classifier
        
        logger.info(f"Created VQC classifier {model_id}")
        return model_id
    
    async def create_regressor(self, model_id: str,
                             vqc_parameters: VQCParameters, 
                             training_config: TrainingConfig) -> str:
        """Create a new VQC regressor"""
        regressor = VQCRegressor(vqc_parameters, training_config)
        self.models[model_id] = regressor
        
        logger.info(f"Created VQC regressor {model_id}")
        return model_id
    
    async def train_model(self, model_id: str,
                         X_train: np.ndarray, y_train: np.ndarray,
                         X_val: np.ndarray = None, y_val: np.ndarray = None) -> Dict[str, Any]:
        """Train a VQC model"""
        if model_id not in self.models:
            raise ValueError(f"Model {model_id} not found")
        
        model = self.models[model_id]
        training_result = model.fit(X_train, y_train, X_val, y_val)
        
        # Cache training result
        if self.redis_client:
            cache_key = f"training_result:{model_id}"
            self.redis_client.setex(cache_key, 3600, pickle.dumps(training_result))
        
        logger.info(f"Training completed for model {model_id}")
        return training_result
    
    async def predict(self, model_id: str, X: np.ndarray) -> np.ndarray:
        """Make predictions with a trained model"""
        if model_id not in self.models:
            raise ValueError(f"Model {model_id} not found")
        
        model = self.models[model_id]
        predictions = model.predict(X)
        
        return predictions
    
    async def predict_proba(self, model_id: str, X: np.ndarray) -> np.ndarray:
        """Get prediction probabilities (for classifiers)"""
        if model_id not in self.models:
            raise ValueError(f"Model {model_id} not found")
        
        model = self.models[model_id]
        if not isinstance(model, VQCClassifier):
            raise ValueError(f"Model {model_id} is not a classifier")
        
        probabilities = model.predict_proba(X)
        return probabilities
    
    async def evaluate_model(self, model_id: str,
                           X_test: np.ndarray, y_test: np.ndarray) -> Dict[str, float]:
        """Evaluate model performance"""
        if model_id not in self.models:
            raise ValueError(f"Model {model_id} not found")
        
        model = self.models[model_id]
        predictions = model.predict(X_test)
        
        if isinstance(model, VQCClassifier):
            # Classification metrics
            accuracy = np.mean(predictions == y_test)
            
            # Compute confusion matrix elements
            tp = np.sum((predictions == 1) & (y_test == 1))
            tn = np.sum((predictions == 0) & (y_test == 0))
            fp = np.sum((predictions == 1) & (y_test == 0))
            fn = np.sum((predictions == 0) & (y_test == 1))
            
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1_score = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
            
            return {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1_score
            }
        
        else:  # Regressor
            # Regression metrics
            mse = np.mean((predictions - y_test) ** 2)
            mae = np.mean(np.abs(predictions - y_test))
            
            # R-squared
            ss_res = np.sum((y_test - predictions) ** 2)
            ss_tot = np.sum((y_test - np.mean(y_test)) ** 2)
            r2_score = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
            
            return {
                'mse': mse,
                'mae': mae,
                'r2_score': r2_score,
                'rmse': np.sqrt(mse)
            }
    
    def get_model_info(self, model_id: str) -> Dict[str, Any]:
        """Get information about a model"""
        if model_id not in self.models:
            raise ValueError(f"Model {model_id} not found")
        
        model = self.models[model_id]
        
        info = {
            'model_id': model_id,
            'model_type': 'classifier' if isinstance(model, VQCClassifier) else 'regressor',
            'num_qubits': model.vqc.parameters.num_qubits,
            'num_layers': model.vqc.parameters.num_layers,
            'architecture': model.vqc.parameters.architecture.name,
            'num_parameters': model.vqc.num_parameters,
            'is_trained': model.is_trained
        }
        
        return info
    
    def list_models(self) -> List[Dict[str, Any]]:
        """List all models in the service"""
        return [self.get_model_info(model_id) for model_id in self.models.keys()]

# Example usage and testing
async def example_vqc_ml():
    """Example of using VQC ML service"""
    
    service = VQCMLService()
    
    # Generate synthetic dataset
    np.random.seed(42)
    n_samples = 100
    n_features = 4
    
    X = np.random.randn(n_samples, n_features)
    y_classification = (X[:, 0] + X[:, 1] > 0).astype(int)  # Simple classification rule
    y_regression = X[:, 0] ** 2 + X[:, 1] ** 2  # Simple regression target
    
    # Split data
    split_idx = int(0.8 * n_samples)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_class_train, y_class_test = y_classification[:split_idx], y_classification[split_idx:]
    y_reg_train, y_reg_test = y_regression[:split_idx], y_regression[split_idx:]
    
    # Create and train classifier
    vqc_params = VQCParameters(
        num_qubits=4,
        num_layers=3,
        architecture=CircuitArchitecture.HARDWARE_EFFICIENT
    )
    
    training_config = TrainingConfig(
        learning_rate=0.1,
        max_iterations=100,
        optimization_method=OptimizationMethod.ADAM
    )
    
    # Classification
    classifier_id = await service.create_classifier("test_classifier", vqc_params, training_config)
    class_training_result = await service.train_model(classifier_id, X_train, y_class_train)
    class_metrics = await service.evaluate_model(classifier_id, X_test, y_class_test)
    
    print("Classification Results:")
    print(f"Training completed in {class_training_result['training_time']:.2f}s")
    print(f"Final loss: {class_training_result['final_loss']:.4f}")
    print(f"Test accuracy: {class_metrics['accuracy']:.4f}")
    print(f"Test F1-score: {class_metrics['f1_score']:.4f}")
    
    # Regression
    regressor_id = await service.create_regressor("test_regressor", vqc_params, training_config)
    reg_training_result = await service.train_model(regressor_id, X_train, y_reg_train)
    reg_metrics = await service.evaluate_model(regressor_id, X_test, y_reg_test)
    
    print("\nRegression Results:")
    print(f"Training completed in {reg_training_result['training_time']:.2f}s")
    print(f"Final loss: {reg_training_result['final_loss']:.4f}")
    print(f"Test MSE: {reg_metrics['mse']:.4f}")
    print(f"Test R²: {reg_metrics['r2_score']:.4f}")
    
    # List all models
    models = service.list_models()
    print(f"\nCreated models: {[model['model_id'] for model in models]}")

if __name__ == "__main__":
    asyncio.run(example_vqc_ml())
