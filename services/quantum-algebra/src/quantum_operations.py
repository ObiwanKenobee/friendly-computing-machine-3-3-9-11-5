"""
Quantum Linear Algebra Operations Service
Implements unitary matrix operations and tensor decomposition for quantum gate simulation
"""

import numpy as np
import scipy.linalg as la
from scipy.sparse import csr_matrix, kron
from typing import List, Tuple, Optional, Dict, Any
import asyncio
import logging
from dataclasses import dataclass
from enum import Enum
import tensorly as tl
from tensorly.decomposition import parafac, tucker
import redis
import json
import time

logger = logging.getLogger(__name__)

class GateType(Enum):
    """Quantum gate types with their mathematical representations"""
    PAULI_X = "pauli_x"
    PAULI_Y = "pauli_y" 
    PAULI_Z = "pauli_z"
    HADAMARD = "hadamard"
    CNOT = "cnot"
    PHASE = "phase"
    T_GATE = "t_gate"
    QFT = "qft"
    GROVER_DIFFUSER = "grover_diffuser"
    CUSTOM = "custom"

@dataclass
class QuantumGate:
    """Represents a quantum gate with its unitary matrix"""
    gate_type: GateType
    qubits: List[int]
    parameters: Optional[Dict[str, float]] = None
    matrix: Optional[np.ndarray] = None
    
class QuantumCircuit:
    """Quantum circuit with optimized tensor operations"""
    
    def __init__(self, num_qubits: int):
        self.num_qubits = num_qubits
        self.gates: List[QuantumGate] = []
        self.state_vector = np.zeros(2**num_qubits, dtype=complex)
        self.state_vector[0] = 1.0  # |0...0⟩ initial state
        
    def add_gate(self, gate: QuantumGate):
        """Add gate to circuit with validation"""
        if max(gate.qubits) >= self.num_qubits:
            raise ValueError(f"Gate qubit index exceeds circuit size")
        self.gates.append(gate)

class QuantumLinearAlgebra:
    """High-performance quantum linear algebra operations"""
    
    def __init__(self, redis_client: Optional[redis.Redis] = None):
        self.redis_client = redis_client
        self.gate_cache: Dict[str, np.ndarray] = {}
        
        # Precompute standard gate matrices
        self._initialize_standard_gates()
        
    def _initialize_standard_gates(self):
        """Initialize standard quantum gate matrices"""
        # Pauli gates
        self.gate_cache['pauli_x'] = np.array([[0, 1], [1, 0]], dtype=complex)
        self.gate_cache['pauli_y'] = np.array([[0, -1j], [1j, 0]], dtype=complex)
        self.gate_cache['pauli_z'] = np.array([[1, 0], [0, -1]], dtype=complex)
        
        # Hadamard gate
        self.gate_cache['hadamard'] = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
        
        # CNOT gate (2-qubit)
        self.gate_cache['cnot'] = np.array([
            [1, 0, 0, 0],
            [0, 1, 0, 0], 
            [0, 0, 0, 1],
            [0, 0, 1, 0]
        ], dtype=complex)
        
        # T gate
        self.gate_cache['t_gate'] = np.array([[1, 0], [0, np.exp(1j * np.pi / 4)]], dtype=complex)
        
    def get_gate_matrix(self, gate_type: GateType, parameters: Dict[str, float] = None) -> np.ndarray:
        """Get gate matrix with caching for performance"""
        cache_key = f"{gate_type.value}_{str(parameters) if parameters else 'none'}"
        
        if cache_key in self.gate_cache:
            return self.gate_cache[cache_key]
            
        if gate_type == GateType.PHASE:
            theta = parameters.get('theta', 0) if parameters else 0
            matrix = np.array([[1, 0], [0, np.exp(1j * theta)]], dtype=complex)
        elif gate_type == GateType.QFT:
            n = parameters.get('n_qubits', 2) if parameters else 2
            matrix = self._qft_matrix(n)
        elif gate_type == GateType.GROVER_DIFFUSER:
            n = parameters.get('n_qubits', 2) if parameters else 2
            matrix = self._grover_diffuser_matrix(n)
        else:
            matrix = self.gate_cache.get(gate_type.value)
            
        if matrix is not None:
            self.gate_cache[cache_key] = matrix
            
        return matrix
    
    def _qft_matrix(self, n: int) -> np.ndarray:
        """Generate Quantum Fourier Transform matrix"""
        N = 2**n
        matrix = np.zeros((N, N), dtype=complex)
        omega = np.exp(2j * np.pi / N)
        
        for i in range(N):
            for j in range(N):
                matrix[i, j] = omega**(i * j) / np.sqrt(N)
                
        return matrix
    
    def _grover_diffuser_matrix(self, n: int) -> np.ndarray:
        """Generate Grover diffuser (amplitude amplification) matrix"""
        N = 2**n
        # 2|s⟩⟨s| - I where |s⟩ is uniform superposition
        s = np.ones(N) / np.sqrt(N)
        return 2 * np.outer(s, s.conj()) - np.eye(N)
    
    def tensor_product_gates(self, gates: List[np.ndarray]) -> np.ndarray:
        """Efficient tensor product of multiple gates using sparse matrices"""
        if not gates:
            return np.eye(1)
            
        result = csr_matrix(gates[0])
        for gate in gates[1:]:
            result = kron(result, csr_matrix(gate))
            
        return result.toarray()
    
    def apply_gate_to_circuit(self, circuit: QuantumCircuit, gate: QuantumGate) -> np.ndarray:
        """Apply gate to quantum circuit state using optimized tensor operations"""
        gate_matrix = self.get_gate_matrix(gate.gate_type, gate.parameters)
        
        if gate_matrix is None:
            raise ValueError(f"Unknown gate type: {gate.gate_type}")
            
        # Build full circuit gate matrix using tensor products
        full_gate = self._build_full_gate_matrix(gate_matrix, gate.qubits, circuit.num_qubits)
        
        # Apply gate to state vector
        circuit.state_vector = full_gate @ circuit.state_vector
        
        return circuit.state_vector
    
    def _build_full_gate_matrix(self, gate_matrix: np.ndarray, 
                               target_qubits: List[int], 
                               num_qubits: int) -> np.ndarray:
        """Build full circuit gate matrix from gate acting on subset of qubits"""
        if len(target_qubits) == 1:
            return self._single_qubit_full_matrix(gate_matrix, target_qubits[0], num_qubits)
        elif len(target_qubits) == 2:
            return self._two_qubit_full_matrix(gate_matrix, target_qubits, num_qubits)
        else:
            return self._multi_qubit_full_matrix(gate_matrix, target_qubits, num_qubits)
    
    def _single_qubit_full_matrix(self, gate: np.ndarray, target: int, num_qubits: int) -> np.ndarray:
        """Efficient single-qubit gate expansion"""
        matrices = []
        for i in range(num_qubits):
            if i == target:
                matrices.append(gate)
            else:
                matrices.append(np.eye(2))
        return self.tensor_product_gates(matrices)
    
    def _two_qubit_full_matrix(self, gate: np.ndarray, targets: List[int], num_qubits: int) -> np.ndarray:
        """Efficient two-qubit gate expansion"""
        if abs(targets[0] - targets[1]) == 1:
            # Adjacent qubits - direct tensor product
            matrices = []
            for i in range(num_qubits):
                if i == min(targets):
                    matrices.append(gate)
                    i += 1  # Skip next qubit
                elif i == max(targets):
                    continue  # Already handled
                else:
                    matrices.append(np.eye(2))
            return self.tensor_product_gates(matrices)
        else:
            # Non-adjacent qubits - use permutation matrices
            return self._multi_qubit_full_matrix(gate, targets, num_qubits)
    
    def _multi_qubit_full_matrix(self, gate: np.ndarray, targets: List[int], num_qubits: int) -> np.ndarray:
        """General multi-qubit gate expansion using permutation"""
        N = 2**num_qubits
        full_matrix = np.eye(N, dtype=complex)
        
        # This is a simplified implementation - in practice, we'd use more efficient
        # permutation and partial trace operations for very large systems
        for i in range(N):
            for j in range(N):
                # Extract target qubit states
                i_bits = [(i >> k) & 1 for k in range(num_qubits)]
                j_bits = [(j >> k) & 1 for k in range(num_qubits)]
                
                # Check if non-target qubits match
                if all(i_bits[k] == j_bits[k] for k in range(num_qubits) if k not in targets):
                    # Extract target subspace indices
                    i_target = sum(i_bits[targets[k]] * (2**k) for k in range(len(targets)))
                    j_target = sum(j_bits[targets[k]] * (2**k) for k in range(len(targets)))
                    
                    full_matrix[i, j] = gate[i_target, j_target]
                    
        return full_matrix

class TensorDecompositionOptimizer:
    """Tensor decomposition for quantum simulation complexity reduction"""
    
    def __init__(self):
        self.decomposition_cache: Dict[str, Tuple] = {}
        
    def decompose_circuit_tensor(self, circuit: QuantumCircuit, 
                                method: str = "parafac") -> Tuple[List[np.ndarray], float]:
        """Decompose circuit tensor to reduce classical simulation complexity"""
        cache_key = self._circuit_hash(circuit)
        
        if cache_key in self.decomposition_cache:
            return self.decomposition_cache[cache_key]
            
        # Convert circuit to tensor representation
        circuit_tensor = self._circuit_to_tensor(circuit)
        
        if method == "parafac":
            factors = parafac(circuit_tensor, rank=min(8, circuit.num_qubits))
            compression_ratio = self._calculate_compression_ratio(circuit_tensor, factors)
        elif method == "tucker":
            core, factors = tucker(circuit_tensor, rank=[2] * circuit_tensor.ndim)
            factors = [core] + factors
            compression_ratio = self._calculate_compression_ratio(circuit_tensor, factors)
        else:
            raise ValueError(f"Unknown decomposition method: {method}")
            
        result = (factors, compression_ratio)
        self.decomposition_cache[cache_key] = result
        
        return result
    
    def _circuit_to_tensor(self, circuit: QuantumCircuit) -> np.ndarray:
        """Convert quantum circuit to tensor representation for decomposition"""
        # Simplified tensor representation - in practice this would be more sophisticated
        state_tensor = circuit.state_vector.reshape([2] * circuit.num_qubits)
        return state_tensor
    
    def _circuit_hash(self, circuit: QuantumCircuit) -> str:
        """Generate hash for circuit caching"""
        gate_data = []
        for gate in circuit.gates:
            gate_data.append(f"{gate.gate_type.value}_{gate.qubits}_{gate.parameters}")
        return str(hash(tuple(gate_data)))
    
    def _calculate_compression_ratio(self, original: np.ndarray, factors: List[np.ndarray]) -> float:
        """Calculate compression ratio achieved by tensor decomposition"""
        original_size = original.size
        compressed_size = sum(factor.size for factor in factors)
        return original_size / compressed_size

class QuantumSimulationService:
    """Main service for quantum algorithm simulation with cloud optimization"""
    
    def __init__(self, redis_url: str = None):
        self.linear_algebra = QuantumLinearAlgebra(
            redis.Redis.from_url(redis_url) if redis_url else None
        )
        self.tensor_optimizer = TensorDecompositionOptimizer()
        self.simulation_cache: Dict[str, Dict] = {}
        
    async def simulate_circuit(self, circuit: QuantumCircuit, 
                              shots: int = 1000,
                              optimize: bool = True) -> Dict[str, Any]:
        """Simulate quantum circuit with optional tensor optimization"""
        start_time = time.time()
        
        # Apply tensor decomposition optimization if requested
        if optimize and circuit.num_qubits > 4:
            factors, compression_ratio = self.tensor_optimizer.decompose_circuit_tensor(circuit)
            logger.info(f"Tensor compression ratio: {compression_ratio:.2f}")
        
        # Apply gates sequentially
        for gate in circuit.gates:
            self.linear_algebra.apply_gate_to_circuit(circuit, gate)
            
        # Calculate measurement probabilities
        probabilities = np.abs(circuit.state_vector)**2
        
        # Simulate measurements
        outcomes = np.random.choice(
            len(probabilities), 
            size=shots, 
            p=probabilities
        )
        
        # Count measurement results
        counts = {}
        for outcome in outcomes:
            bit_string = format(outcome, f'0{circuit.num_qubits}b')
            counts[bit_string] = counts.get(bit_string, 0) + 1
            
        simulation_time = time.time() - start_time
        
        result = {
            'counts': counts,
            'probabilities': probabilities.tolist(),
            'state_vector': circuit.state_vector.tolist(),
            'simulation_time': simulation_time,
            'num_qubits': circuit.num_qubits,
            'num_gates': len(circuit.gates),
            'shots': shots
        }
        
        # Cache result if Redis is available
        if self.linear_algebra.redis_client:
            cache_key = f"simulation_{self.tensor_optimizer._circuit_hash(circuit)}"
            self.linear_algebra.redis_client.setex(
                cache_key, 
                3600,  # 1 hour TTL
                json.dumps(result, default=str)
            )
            
        return result
    
    async def batch_simulate(self, circuits: List[QuantumCircuit], 
                           shots_per_circuit: int = 1000) -> List[Dict[str, Any]]:
        """Batch simulation of multiple circuits for cloud efficiency"""
        tasks = [
            self.simulate_circuit(circuit, shots_per_circuit) 
            for circuit in circuits
        ]
        return await asyncio.gather(*tasks)

# Example usage and testing functions
def create_qft_circuit(n_qubits: int) -> QuantumCircuit:
    """Create Quantum Fourier Transform circuit"""
    circuit = QuantumCircuit(n_qubits)
    
    # Add QFT gates
    for i in range(n_qubits):
        circuit.add_gate(QuantumGate(GateType.HADAMARD, [i]))
        for j in range(i + 1, n_qubits):
            circuit.add_gate(QuantumGate(
                GateType.PHASE, 
                [j], 
                parameters={'theta': np.pi / (2**(j-i))}
            ))
    
    return circuit

def create_grover_circuit(n_qubits: int, target_state: int) -> QuantumCircuit:
    """Create Grover's algorithm circuit"""
    circuit = QuantumCircuit(n_qubits)
    
    # Initialize superposition
    for i in range(n_qubits):
        circuit.add_gate(QuantumGate(GateType.HADAMARD, [i]))
    
    # Grover iterations (simplified)
    iterations = int(np.pi * np.sqrt(2**n_qubits) / 4)
    for _ in range(iterations):
        # Oracle (simplified - marks target state)
        target_bits = format(target_state, f'0{n_qubits}b')
        for i, bit in enumerate(target_bits):
            if bit == '0':
                circuit.add_gate(QuantumGate(GateType.PAULI_X, [i]))
        
        # Multi-controlled Z gate (simplified)
        circuit.add_gate(QuantumGate(GateType.PAULI_Z, [n_qubits-1]))
        
        for i, bit in enumerate(target_bits):
            if bit == '0':
                circuit.add_gate(QuantumGate(GateType.PAULI_X, [i]))
        
        # Diffuser
        circuit.add_gate(QuantumGate(
            GateType.GROVER_DIFFUSER, 
            list(range(n_qubits)),
            parameters={'n_qubits': n_qubits}
        ))
    
    return circuit

if __name__ == "__main__":
    # Example usage
    service = QuantumSimulationService()
    
    # Test QFT circuit
    qft_circuit = create_qft_circuit(3)
    result = asyncio.run(service.simulate_circuit(qft_circuit))
    print(f"QFT simulation completed in {result['simulation_time']:.3f}s")
    print(f"Top measurement outcomes: {sorted(result['counts'].items(), key=lambda x: x[1], reverse=True)[:5]}")
