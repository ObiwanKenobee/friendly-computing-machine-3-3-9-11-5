"""
Fault-Tolerant Quantum Computing Service
Implements stabilizer codes, Shor codes, and topological quantum error correction
"""

import numpy as np
import scipy.sparse as sp
from typing import List, Dict, Tuple, Optional, Any, Set
from dataclasses import dataclass
from enum import Enum
import asyncio
import logging
import time
import json
from abc import ABC, abstractmethod
import networkx as nx
from collections import defaultdict

logger = logging.getLogger(__name__)

class ErrorType(Enum):
    """Types of quantum errors"""
    BIT_FLIP = "bit_flip"      # X error
    PHASE_FLIP = "phase_flip"  # Z error
    BOTH = "both"              # Y error
    MEASUREMENT = "measurement"
    DECOHERENCE = "decoherence"

class CorrectionCode(Enum):
    """Types of quantum error correction codes"""
    STEANE_7 = "steane_7"           # 7-qubit Steane code
    SHOR_9 = "shor_9"               # 9-qubit Shor code
    SURFACE = "surface"             # Surface code
    COLOR = "color"                 # Color code
    REPETITION = "repetition"       # Simple repetition code
    STABILIZER = "stabilizer"       # General stabilizer code

@dataclass
class QubitError:
    """Represents an error on a specific qubit"""
    qubit_id: int
    error_type: ErrorType
    timestamp: float
    probability: float
    corrected: bool = False

@dataclass
class SyndromeResult:
    """Result of syndrome measurement"""
    syndrome: np.ndarray
    measured_qubits: List[int]
    measurement_time: float
    confidence: float

class QuantumErrorCorrector(ABC):
    """Abstract base class for quantum error correction codes"""
    
    def __init__(self, code_distance: int):
        self.code_distance = code_distance
        self.num_physical_qubits = 0
        self.num_logical_qubits = 0
        self.stabilizer_generators = []
        self.logical_operators = []
        
    @abstractmethod
    def encode(self, logical_state: np.ndarray) -> np.ndarray:
        """Encode logical qubit state into physical qubits"""
        pass
    
    @abstractmethod
    def decode(self, physical_state: np.ndarray) -> np.ndarray:
        """Decode physical qubits back to logical state"""
        pass
    
    @abstractmethod
    def measure_syndrome(self, physical_state: np.ndarray) -> SyndromeResult:
        """Measure error syndrome"""
        pass
    
    @abstractmethod
    def correct_errors(self, physical_state: np.ndarray, syndrome: SyndromeResult) -> np.ndarray:
        """Apply error correction based on syndrome"""
        pass

class SteaneCodeCorrector(QuantumErrorCorrector):
    """7-qubit Steane code implementation"""
    
    def __init__(self):
        super().__init__(code_distance=3)
        self.num_physical_qubits = 7
        self.num_logical_qubits = 1
        
        # Steane code stabilizer generators (Pauli operators)
        self.x_stabilizers = [
            [1, 1, 1, 1, 0, 0, 0],  # X₁X₂X₃X₄
            [1, 1, 0, 0, 1, 1, 0],  # X₁X₂X₅X₆  
            [1, 0, 1, 0, 1, 0, 1]   # X₁X₃X₅X₇
        ]
        
        self.z_stabilizers = [
            [1, 1, 1, 1, 0, 0, 0],  # Z₁Z₂Z₃Z₄
            [1, 1, 0, 0, 1, 1, 0],  # Z₁Z₂Z₅Z₆
            [1, 0, 1, 0, 1, 0, 1]   # Z₁Z₃Z₅Z₇
        ]
        
        # Logical operators
        self.logical_x = [1, 1, 1, 1, 1, 1, 1]  # X̄ = X₁X₂X₃X₄X₅X₆X₇
        self.logical_z = [1, 1, 1, 1, 1, 1, 1]  # Z̄ = Z₁Z₂Z₃Z₄Z₅Z₆Z₇
        
        # Syndrome lookup table for error correction
        self._build_syndrome_table()
    
    def _build_syndrome_table(self):
        """Build lookup table mapping syndromes to error patterns"""
        self.syndrome_table = {}
        
        # Single qubit X errors
        for i in range(7):
            x_syndrome = tuple((sum(stab[j] for j in range(7) if j == i) % 2) for stab in self.x_stabilizers)
            self.syndrome_table[x_syndrome] = ('X', i)
        
        # Single qubit Z errors  
        for i in range(7):
            z_syndrome = tuple((sum(stab[j] for j in range(7) if j == i) % 2) for stab in self.z_stabilizers)
            self.syndrome_table[z_syndrome] = ('Z', i)
        
        # No error
        self.syndrome_table[(0, 0, 0)] = ('I', -1)
    
    def encode(self, logical_state: np.ndarray) -> np.ndarray:
        """Encode single logical qubit into 7 physical qubits"""
        if logical_state.shape[0] != 2:
            raise ValueError("Input must be a single qubit state")
        
        # Steane code encoding circuit (simplified)
        # |0⟩_L → |0000000⟩ + |1111111⟩ (for computational basis)
        # |1⟩_L → |0000000⟩ - |1111111⟩
        
        alpha, beta = logical_state[0], logical_state[1]
        
        # Encoded states
        zero_logical = np.zeros(2**7, dtype=complex)
        one_logical = np.zeros(2**7, dtype=complex)
        
        # |0⟩_L codeword
        zero_logical[0b0000000] = 1/np.sqrt(8)
        zero_logical[0b1010101] = 1/np.sqrt(8) 
        zero_logical[0b0110011] = 1/np.sqrt(8)
        zero_logical[0b1100110] = 1/np.sqrt(8)
        zero_logical[0b0001111] = 1/np.sqrt(8)
        zero_logical[0b1011010] = 1/np.sqrt(8)
        zero_logical[0b0111100] = 1/np.sqrt(8)
        zero_logical[0b1101001] = 1/np.sqrt(8)
        
        # |1⟩_L codeword (complement)
        one_logical[0b1111111] = 1/np.sqrt(8)
        one_logical[0b0101010] = 1/np.sqrt(8)
        one_logical[0b1001100] = 1/np.sqrt(8)
        one_logical[0b0011001] = 1/np.sqrt(8)
        one_logical[0b1110000] = 1/np.sqrt(8)
        one_logical[0b0100101] = 1/np.sqrt(8)
        one_logical[0b1000011] = 1/np.sqrt(8)
        one_logical[0b0010110] = 1/np.sqrt(8)
        
        return alpha * zero_logical + beta * one_logical
    
    def decode(self, physical_state: np.ndarray) -> np.ndarray:
        """Decode 7 physical qubits to logical qubit"""
        # Project onto logical subspace
        logical_zero_proj = self._get_logical_projector(0)
        logical_one_proj = self._get_logical_projector(1)
        
        zero_amplitude = np.sqrt(np.real(physical_state.conj().T @ logical_zero_proj @ physical_state))
        one_amplitude = np.sqrt(np.real(physical_state.conj().T @ logical_one_proj @ physical_state))
        
        # Normalize
        norm = np.sqrt(zero_amplitude**2 + one_amplitude**2)
        if norm > 0:
            return np.array([zero_amplitude/norm, one_amplitude/norm], dtype=complex)
        else:
            return np.array([1.0, 0.0], dtype=complex)
    
    def _get_logical_projector(self, logical_bit: int) -> np.ndarray:
        """Get projector onto logical |0⟩ or |1⟩ subspace"""
        proj = np.zeros((2**7, 2**7), dtype=complex)
        
        if logical_bit == 0:
            # Project onto |0⟩_L subspace
            codewords = [0b0000000, 0b1010101, 0b0110011, 0b1100110, 
                        0b0001111, 0b1011010, 0b0111100, 0b1101001]
        else:
            # Project onto |1⟩_L subspace  
            codewords = [0b1111111, 0b0101010, 0b1001100, 0b0011001,
                        0b1110000, 0b0100101, 0b1000011, 0b0010110]
        
        for cw in codewords:
            proj[cw, cw] = 1.0/8
            
        return proj
    
    def measure_syndrome(self, physical_state: np.ndarray) -> SyndromeResult:
        """Measure X and Z stabilizer syndromes"""
        start_time = time.time()
        
        # Simulate syndrome measurement (in practice this would be done via ancilla qubits)
        x_syndrome = []
        z_syndrome = []
        
        # X stabilizer measurements
        for stabilizer in self.x_stabilizers:
            # Expectation value of stabilizer operator
            measurement = self._measure_pauli_operator(physical_state, stabilizer, 'X')
            x_syndrome.append(int(measurement < 0))  # Convert eigenvalue to syndrome bit
        
        # Z stabilizer measurements  
        for stabilizer in self.z_stabilizers:
            measurement = self._measure_pauli_operator(physical_state, stabilizer, 'Z')
            z_syndrome.append(int(measurement < 0))
        
        syndrome = np.array(x_syndrome + z_syndrome)
        
        return SyndromeResult(
            syndrome=syndrome,
            measured_qubits=list(range(7)),
            measurement_time=time.time() - start_time,
            confidence=0.95  # Simplified confidence estimate
        )
    
    def _measure_pauli_operator(self, state: np.ndarray, operator_bits: List[int], pauli_type: str) -> float:
        """Measure expectation value of Pauli operator"""
        # Simplified measurement - in practice would use proper Pauli matrix calculations
        N = len(operator_bits)
        
        # Build Pauli operator matrix
        if pauli_type == 'X':
            single_op = np.array([[0, 1], [1, 0]])
        else:  # pauli_type == 'Z'
            single_op = np.array([[1, 0], [0, -1]])
        
        identity = np.array([[1, 0], [0, 1]])
        
        # Tensor product construction
        operator = np.array([[1]], dtype=complex)
        for i in range(N):
            if operator_bits[i] == 1:
                operator = np.kron(operator, single_op)
            else:
                operator = np.kron(operator, identity)
        
        # Expectation value
        expectation = np.real(state.conj().T @ operator @ state)
        return expectation
    
    def correct_errors(self, physical_state: np.ndarray, syndrome: SyndromeResult) -> np.ndarray:
        """Apply error correction based on measured syndrome"""
        x_syndrome = tuple(syndrome.syndrome[:3])
        z_syndrome = tuple(syndrome.syndrome[3:])
        
        corrected_state = physical_state.copy()
        
        # Correct X errors
        if x_syndrome in self.syndrome_table:
            error_type, qubit = self.syndrome_table[x_syndrome]
            if error_type == 'X' and qubit >= 0:
                corrected_state = self._apply_pauli_correction(corrected_state, qubit, 'X')
        
        # Correct Z errors
        if z_syndrome in self.syndrome_table:
            error_type, qubit = self.syndrome_table[z_syndrome]
            if error_type == 'Z' and qubit >= 0:
                corrected_state = self._apply_pauli_correction(corrected_state, qubit, 'Z')
        
        return corrected_state
    
    def _apply_pauli_correction(self, state: np.ndarray, qubit: int, pauli_type: str) -> np.ndarray:
        """Apply Pauli correction to specific qubit"""
        N = int(np.log2(len(state)))
        
        if pauli_type == 'X':
            # Bit flip on qubit
            corrected = state.copy()
            for i in range(len(state)):
                # Flip bit at position 'qubit'
                flipped_i = i ^ (1 << (N-1-qubit))
                corrected[i] = state[flipped_i]
        else:  # pauli_type == 'Z'
            # Phase flip on qubit
            corrected = state.copy()
            for i in range(len(state)):
                if (i >> (N-1-qubit)) & 1:
                    corrected[i] *= -1
        
        return corrected

class ShorCodeCorrector(QuantumErrorCorrector):
    """9-qubit Shor code implementation"""
    
    def __init__(self):
        super().__init__(code_distance=3)
        self.num_physical_qubits = 9
        self.num_logical_qubits = 1
        
        # Shor code stabilizers
        self.stabilizers = [
            # Z₁Z₂, Z₂Z₃ (first block)
            [0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 0, 0],
            # Z₄Z₅, Z₅Z₆ (second block)  
            [0, 0, 0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0],
            # Z₇Z₈, Z₈Z₉ (third block)
            [0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 1, 1],
            # X₁X₂X₃X₄X₅X₆, X₄X₅X₆X₇X₈X₉
            [1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1]
        ]
    
    def encode(self, logical_state: np.ndarray) -> np.ndarray:
        """Encode logical qubit using Shor code"""
        alpha, beta = logical_state[0], logical_state[1]
        
        # Shor code encoding:
        # |0⟩_L → (|000⟩ + |111⟩)(|000⟩ + |111⟩)(|000⟩ + |111⟩)/2√2
        # |1⟩_L → (|000⟩ - |111⟩)(|000⟩ - |111⟩)(|000⟩ - |111⟩)/2√2
        
        encoded_state = np.zeros(2**9, dtype=complex)
        
        # |0⟩_L codeword
        zero_terms = [
            0b000000000, 0b000111111, 0b111000111, 0b111111000
        ]
        
        # |1⟩_L codeword  
        one_terms = [
            0b000000000, -0b000111111, -0b111000111, 0b111111000
        ]
        
        norm = 1.0 / (2 * np.sqrt(2))
        
        for term in zero_terms:
            encoded_state[term] += alpha * norm
            
        for i, term in enumerate(one_terms):
            if i == 0:
                encoded_state[term] += beta * norm
            else:
                encoded_state[abs(term)] += beta * norm * (1 if term > 0 else -1)
        
        return encoded_state
    
    def decode(self, physical_state: np.ndarray) -> np.ndarray:
        """Decode Shor code to logical state"""
        # Simplified decoding via majority vote in logical subspace
        zero_proj = self._get_shor_projector(0)
        one_proj = self._get_shor_projector(1)
        
        zero_amp = np.sqrt(np.real(physical_state.conj().T @ zero_proj @ physical_state))
        one_amp = np.sqrt(np.real(physical_state.conj().T @ one_proj @ physical_state))
        
        norm = np.sqrt(zero_amp**2 + one_amp**2)
        if norm > 0:
            return np.array([zero_amp/norm, one_amp/norm], dtype=complex)
        else:
            return np.array([1.0, 0.0], dtype=complex)
    
    def _get_shor_projector(self, logical_bit: int) -> np.ndarray:
        """Get projector for Shor code logical subspace"""
        proj = np.zeros((2**9, 2**9), dtype=complex)
        
        if logical_bit == 0:
            states = [0b000000000, 0b000111111, 0b111000111, 0b111111000]
            coeff = 1.0 / 8  # Normalization
        else:
            states = [(0b000000000, 1), (0b000111111, -1), (0b111000111, -1), (0b111111000, 1)]
            coeff = 1.0 / 8
        
        if logical_bit == 0:
            for state in states:
                proj[state, state] = coeff
        else:
            for state, sign in states:
                proj[state, state] = coeff * sign
        
        return proj
    
    def measure_syndrome(self, physical_state: np.ndarray) -> SyndromeResult:
        """Measure Shor code syndrome"""
        syndrome = []
        
        for stabilizer in self.stabilizers:
            measurement = self._measure_pauli_operator(physical_state, stabilizer, 'Z')
            syndrome.append(int(measurement < 0))
        
        return SyndromeResult(
            syndrome=np.array(syndrome),
            measured_qubits=list(range(9)),
            measurement_time=0.001,  # Simulated
            confidence=0.95
        )
    
    def correct_errors(self, physical_state: np.ndarray, syndrome: SyndromeResult) -> np.ndarray:
        """Correct errors in Shor code"""
        # Simplified error correction based on syndrome pattern
        corrected_state = physical_state.copy()
        
        # Implement Shor code error correction logic
        # This is a simplified version - full implementation would handle all error patterns
        
        return corrected_state

class SurfaceCodeCorrector(QuantumErrorCorrector):
    """Surface code implementation for topological error correction"""
    
    def __init__(self, distance: int):
        super().__init__(code_distance=distance)
        self.distance = distance
        self.num_physical_qubits = 2 * distance**2 - 1
        self.num_logical_qubits = 1
        
        self.lattice = self._build_surface_lattice()
        self.stabilizers = self._generate_surface_stabilizers()
        
    def _build_surface_lattice(self) -> nx.Graph:
        """Build surface code lattice graph"""
        G = nx.Graph()
        
        # Add data qubits and syndrome qubits
        for i in range(self.distance):
            for j in range(self.distance):
                # Data qubit positions
                if (i + j) % 2 == 0:
                    G.add_node((i, j, 'data'))
                else:
                    G.add_node((i, j, 'syndrome'))
        
        # Add edges between data and syndrome qubits
        for i in range(self.distance):
            for j in range(self.distance):
                if (i + j) % 2 == 1:  # Syndrome qubit
                    # Connect to neighboring data qubits
                    for di, dj in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        ni, nj = i + di, j + dj
                        if 0 <= ni < self.distance and 0 <= nj < self.distance:
                            if (ni + nj) % 2 == 0:  # Data qubit
                                G.add_edge((i, j, 'syndrome'), (ni, nj, 'data'))
        
        return G
    
    def _generate_surface_stabilizers(self) -> List[List[int]]:
        """Generate surface code stabilizer generators"""
        stabilizers = []
        
        # X-type stabilizers (vertex operators)
        # Z-type stabilizers (plaquette operators)
        
        # Simplified implementation
        for node in self.lattice.nodes():
            if node[2] == 'syndrome':
                stabilizer = [0] * self.num_physical_qubits
                # Set bits for connected data qubits
                neighbors = list(self.lattice.neighbors(node))
                for neighbor in neighbors:
                    if neighbor[2] == 'data':
                        qubit_index = self._node_to_qubit_index(neighbor)
                        stabilizer[qubit_index] = 1
                
                if len(neighbors) > 0:
                    stabilizers.append(stabilizer)
        
        return stabilizers
    
    def _node_to_qubit_index(self, node: Tuple[int, int, str]) -> int:
        """Convert lattice node to linear qubit index"""
        i, j, node_type = node
        if node_type == 'data':
            return i * self.distance + j
        else:
            return -1  # Syndrome qubits don't have direct indices
    
    def encode(self, logical_state: np.ndarray) -> np.ndarray:
        """Encode logical state into surface code"""
        # Surface code encoding is complex and typically done through 
        # a sequence of stabilizer measurements
        # This is a simplified placeholder
        
        encoded_state = np.zeros(2**self.num_physical_qubits, dtype=complex)
        encoded_state[0] = logical_state[0]  # |0⟩_L
        encoded_state[-1] = logical_state[1]  # |1⟩_L (simplified)
        
        return encoded_state
    
    def decode(self, physical_state: np.ndarray) -> np.ndarray:
        """Decode surface code using minimum weight perfect matching"""
        # This would implement the full MWPM decoder
        # Simplified version here
        
        return np.array([1.0, 0.0], dtype=complex)
    
    def measure_syndrome(self, physical_state: np.ndarray) -> SyndromeResult:
        """Measure surface code syndrome"""
        syndrome = []
        
        for stabilizer in self.stabilizers:
            measurement = self._measure_pauli_operator(physical_state, stabilizer, 'Z')
            syndrome.append(int(measurement < 0))
        
        return SyndromeResult(
            syndrome=np.array(syndrome),
            measured_qubits=list(range(self.num_physical_qubits)),
            measurement_time=0.002,
            confidence=0.98
        )
    
    def correct_errors(self, physical_state: np.ndarray, syndrome: SyndromeResult) -> np.ndarray:
        """Correct errors using minimum weight perfect matching"""
        # Implement MWPM algorithm for surface code
        # This is a placeholder for the complex decoding algorithm
        
        return physical_state

class FaultTolerantQuantumService:
    """Main service for fault-tolerant quantum computing"""
    
    def __init__(self):
        self.error_correctors: Dict[CorrectionCode, QuantumErrorCorrector] = {
            CorrectionCode.STEANE_7: SteaneCodeCorrector(),
            CorrectionCode.SHOR_9: ShorCodeCorrector(),
        }
        
        self.error_history: List[QubitError] = []
        self.correction_statistics = defaultdict(int)
        
    async def encode_logical_qubit(self, logical_state: np.ndarray, 
                                 code_type: CorrectionCode) -> np.ndarray:
        """Encode logical qubit with specified error correction code"""
        if code_type not in self.error_correctors:
            if code_type == CorrectionCode.SURFACE:
                # Create surface code corrector on demand
                self.error_correctors[code_type] = SurfaceCodeCorrector(distance=3)
            else:
                raise ValueError(f"Unsupported code type: {code_type}")
        
        corrector = self.error_correctors[code_type]
        encoded_state = corrector.encode(logical_state)
        
        logger.info(f"Encoded logical qubit using {code_type.name} code")
        return encoded_state
    
    async def simulate_errors(self, physical_state: np.ndarray, 
                            error_rate: float = 0.001) -> Tuple[np.ndarray, List[QubitError]]:
        """Simulate quantum errors on physical qubits"""
        num_qubits = int(np.log2(len(physical_state)))
        errors = []
        noisy_state = physical_state.copy()
        
        for qubit in range(num_qubits):
            # Simulate different error types
            if np.random.random() < error_rate:
                error_type = np.random.choice([ErrorType.BIT_FLIP, ErrorType.PHASE_FLIP, ErrorType.BOTH])
                
                error = QubitError(
                    qubit_id=qubit,
                    error_type=error_type,
                    timestamp=time.time(),
                    probability=error_rate
                )
                errors.append(error)
                
                # Apply error to state
                if error_type == ErrorType.BIT_FLIP:
                    noisy_state = self._apply_bit_flip(noisy_state, qubit)
                elif error_type == ErrorType.PHASE_FLIP:
                    noisy_state = self._apply_phase_flip(noisy_state, qubit)
                elif error_type == ErrorType.BOTH:
                    noisy_state = self._apply_bit_flip(noisy_state, qubit)
                    noisy_state = self._apply_phase_flip(noisy_state, qubit)
        
        self.error_history.extend(errors)
        return noisy_state, errors
    
    def _apply_bit_flip(self, state: np.ndarray, qubit: int) -> np.ndarray:
        """Apply bit flip (X) error to specific qubit"""
        num_qubits = int(np.log2(len(state)))
        flipped_state = state.copy()
        
        for i in range(len(state)):
            flipped_i = i ^ (1 << (num_qubits - 1 - qubit))
            flipped_state[i] = state[flipped_i]
        
        return flipped_state
    
    def _apply_phase_flip(self, state: np.ndarray, qubit: int) -> np.ndarray:
        """Apply phase flip (Z) error to specific qubit"""
        num_qubits = int(np.log2(len(state)))
        flipped_state = state.copy()
        
        for i in range(len(state)):
            if (i >> (num_qubits - 1 - qubit)) & 1:
                flipped_state[i] *= -1
        
        return flipped_state
    
    async def perform_error_correction(self, noisy_state: np.ndarray, 
                                     code_type: CorrectionCode) -> Tuple[np.ndarray, SyndromeResult]:
        """Perform complete error correction cycle"""
        corrector = self.error_correctors[code_type]
        
        # Measure syndrome
        syndrome = corrector.measure_syndrome(noisy_state)
        
        # Correct errors based on syndrome
        corrected_state = corrector.correct_errors(noisy_state, syndrome)
        
        # Update statistics
        self.correction_statistics[code_type] += 1
        
        logger.info(f"Error correction completed using {code_type.name}, syndrome: {syndrome.syndrome}")
        
        return corrected_state, syndrome
    
    async def full_error_correction_cycle(self, logical_state: np.ndarray,
                                        code_type: CorrectionCode,
                                        error_rate: float = 0.001,
                                        num_cycles: int = 1) -> Dict[str, Any]:
        """Complete fault-tolerant quantum computation cycle"""
        results = {
            'initial_logical_state': logical_state.tolist(),
            'code_type': code_type.name,
            'error_rate': error_rate,
            'cycles': []
        }
        
        # Encode logical state
        current_state = await self.encode_logical_qubit(logical_state, code_type)
        
        for cycle in range(num_cycles):
            cycle_start = time.time()
            
            # Simulate errors
            noisy_state, errors = await self.simulate_errors(current_state, error_rate)
            
            # Perform error correction
            corrected_state, syndrome = await self.perform_error_correction(noisy_state, code_type)
            
            # Decode to check logical fidelity
            corrector = self.error_correctors[code_type]
            decoded_state = corrector.decode(corrected_state)
            
            # Calculate fidelity
            fidelity = np.abs(np.vdot(logical_state, decoded_state))**2
            
            cycle_result = {
                'cycle': cycle,
                'errors_detected': len(errors),
                'syndrome': syndrome.syndrome.tolist(),
                'logical_fidelity': float(fidelity),
                'cycle_time': time.time() - cycle_start
            }
            
            results['cycles'].append(cycle_result)
            current_state = corrected_state
        
        # Final decode
        final_logical_state = self.error_correctors[code_type].decode(current_state)
        results['final_logical_state'] = final_logical_state.tolist()
        results['final_fidelity'] = float(np.abs(np.vdot(logical_state, final_logical_state))**2)
        
        return results
    
    def get_error_statistics(self) -> Dict[str, Any]:
        """Get comprehensive error correction statistics"""
        error_counts = defaultdict(int)
        for error in self.error_history:
            error_counts[error.error_type.name] += 1
        
        return {
            'total_errors': len(self.error_history),
            'error_breakdown': dict(error_counts),
            'correction_attempts': dict(self.correction_statistics),
            'average_error_rate': len(self.error_history) / max(1, time.time() - 
                                  (self.error_history[0].timestamp if self.error_history else time.time()))
        }

# Example usage and testing
async def test_fault_tolerance():
    """Test fault-tolerant quantum computing service"""
    service = FaultTolerantQuantumService()
    
    # Test logical qubit states
    test_states = [
        np.array([1.0, 0.0], dtype=complex),  # |0⟩
        np.array([0.0, 1.0], dtype=complex),  # |1⟩
        np.array([1/np.sqrt(2), 1/np.sqrt(2)], dtype=complex),  # |+⟩
    ]
    
    for i, state in enumerate(test_states):
        print(f"\nTesting logical state {i}: {state}")
        
        # Test Steane code
        steane_result = await service.full_error_correction_cycle(
            state, CorrectionCode.STEANE_7, error_rate=0.01, num_cycles=5
        )
        print(f"Steane code final fidelity: {steane_result['final_fidelity']:.4f}")
        
        # Test Shor code
        shor_result = await service.full_error_correction_cycle(
            state, CorrectionCode.SHOR_9, error_rate=0.01, num_cycles=5
        )
        print(f"Shor code final fidelity: {shor_result['final_fidelity']:.4f}")
    
    # Print statistics
    stats = service.get_error_statistics()
    print(f"\nError correction statistics: {json.dumps(stats, indent=2)}")

if __name__ == "__main__":
    asyncio.run(test_fault_tolerance())
