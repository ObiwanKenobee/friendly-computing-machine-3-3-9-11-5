"""
Quantum-Classical Hybrid Workload Scheduler
Uses queueing theory and Markov Decision Processes for optimal resource allocation
"""

import numpy as np
import asyncio
import logging
import time
from typing import Dict, List, Optional, Tuple, Any, Set
from dataclasses import dataclass, field
from enum import Enum
import heapq
from collections import defaultdict
import redis
import json
import uuid
from datetime import datetime, timedelta
import aiohttp
import kubernetes_asyncio as k8s

logger = logging.getLogger(__name__)

class ResourceType(Enum):
    """Types of computational resources in hybrid quantum-classical system"""
    QUANTUM_SIMULATOR = "quantum_simulator"
    CLASSICAL_CPU = "classical_cpu" 
    CLASSICAL_GPU = "classical_gpu"
    QUANTUM_HARDWARE = "quantum_hardware"
    MEMORY_INTENSIVE = "memory_intensive"

class JobPriority(Enum):
    """Job priority levels"""
    CRITICAL = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4
    BACKGROUND = 5

class JobStatus(Enum):
    """Job execution status"""
    PENDING = "pending"
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

@dataclass
class Resource:
    """Computational resource in the quantum-classical hybrid system"""
    id: str
    resource_type: ResourceType
    capacity: int  # Number of concurrent jobs
    current_load: int = 0
    availability: float = 1.0  # 0.0 to 1.0
    cost_per_unit: float = 1.0
    quantum_fidelity: Optional[float] = None  # For quantum resources
    coherence_time: Optional[float] = None    # For quantum resources
    
    def utilization(self) -> float:
        """Current resource utilization"""
        return self.current_load / self.capacity if self.capacity > 0 else 0.0
    
    def available_capacity(self) -> int:
        """Available capacity considering availability"""
        return max(0, int(self.capacity * self.availability) - self.current_load)

@dataclass
class QuantumJob:
    """Quantum computation job with resource requirements"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    circuit_depth: int = 0
    num_qubits: int = 0
    num_shots: int = 1000
    estimated_runtime: float = 0.0  # seconds
    priority: JobPriority = JobPriority.NORMAL
    required_resources: Set[ResourceType] = field(default_factory=set)
    max_wait_time: Optional[float] = None  # seconds
    quantum_fidelity_threshold: float = 0.95
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    status: JobStatus = JobStatus.PENDING
    result: Optional[Dict] = None
    assigned_resources: List[str] = field(default_factory=list)
    
    def estimated_cost(self, resources: Dict[str, Resource]) -> float:
        """Estimate job execution cost"""
        cost = 0.0
        for resource_id in self.assigned_resources:
            if resource_id in resources:
                resource = resources[resource_id]
                cost += resource.cost_per_unit * self.estimated_runtime
        return cost
    
    def is_expired(self) -> bool:
        """Check if job has exceeded maximum wait time"""
        if self.max_wait_time is None:
            return False
        wait_time = (datetime.now() - self.created_at).total_seconds()
        return wait_time > self.max_wait_time

class MarkovDecisionProcess:
    """MDP for optimal quantum workload scheduling decisions"""
    
    def __init__(self, resources: Dict[str, Resource], discount_factor: float = 0.95):
        self.resources = resources
        self.discount_factor = discount_factor
        self.state_values: Dict[str, float] = {}
        self.policy: Dict[str, str] = {}  # state -> action
        
    def get_state_representation(self, jobs: List[QuantumJob]) -> str:
        """Convert current system state to string representation"""
        # Simplified state representation
        resource_loads = []
        for resource in self.resources.values():
            resource_loads.append(f"{resource.id}:{resource.utilization():.2f}")
        
        job_counts = defaultdict(int)
        for job in jobs:
            if job.status in [JobStatus.PENDING, JobStatus.QUEUED]:
                job_counts[job.priority] += 1
        
        priority_counts = [f"{priority.name}:{count}" for priority, count in job_counts.items()]
        
        return "|".join(resource_loads + priority_counts)
    
    def calculate_reward(self, action: str, current_state: str, jobs: List[QuantumJob]) -> float:
        """Calculate reward for taking action in current state"""
        # Reward factors:
        # 1. Resource utilization efficiency
        # 2. Job priority completion
        # 3. Quantum fidelity achievement
        # 4. Cost optimization
        
        utilization_reward = self._calculate_utilization_reward()
        priority_reward = self._calculate_priority_reward(jobs)
        fidelity_reward = self._calculate_fidelity_reward(jobs)
        cost_penalty = self._calculate_cost_penalty(jobs)
        
        total_reward = (
            0.3 * utilization_reward +
            0.4 * priority_reward + 
            0.2 * fidelity_reward -
            0.1 * cost_penalty
        )
        
        return total_reward
    
    def _calculate_utilization_reward(self) -> float:
        """Reward based on resource utilization efficiency"""
        total_utilization = 0.0
        for resource in self.resources.values():
            # Penalize both under-utilization and over-utilization
            util = resource.utilization()
            if util < 0.3:
                total_utilization += util * 0.5  # Penalty for under-use
            elif util > 0.9:
                total_utilization += (1.0 - util) * 0.5  # Penalty for over-use
            else:
                total_utilization += 1.0  # Optimal range
        
        return total_utilization / len(self.resources)
    
    def _calculate_priority_reward(self, jobs: List[QuantumJob]) -> float:
        """Reward based on job priority completion"""
        priority_weights = {
            JobPriority.CRITICAL: 10.0,
            JobPriority.HIGH: 5.0,
            JobPriority.NORMAL: 1.0,
            JobPriority.LOW: 0.5,
            JobPriority.BACKGROUND: 0.1
        }
        
        completed_reward = 0.0
        waiting_penalty = 0.0
        
        for job in jobs:
            weight = priority_weights.get(job.priority, 1.0)
            
            if job.status == JobStatus.COMPLETED:
                completed_reward += weight
            elif job.status in [JobStatus.PENDING, JobStatus.QUEUED]:
                wait_time = (datetime.now() - job.created_at).total_seconds()
                waiting_penalty += weight * (wait_time / 3600.0)  # Hours
        
        return completed_reward - waiting_penalty
    
    def _calculate_fidelity_reward(self, jobs: List[QuantumJob]) -> float:
        """Reward based on quantum fidelity achievement"""
        fidelity_reward = 0.0
        total_quantum_jobs = 0
        
        for job in jobs:
            if ResourceType.QUANTUM_SIMULATOR in job.required_resources or \
               ResourceType.QUANTUM_HARDWARE in job.required_resources:
                total_quantum_jobs += 1
                
                if job.status == JobStatus.COMPLETED and job.result:
                    achieved_fidelity = job.result.get('fidelity', 0.0)
                    if achieved_fidelity >= job.quantum_fidelity_threshold:
                        fidelity_reward += 1.0
                    else:
                        fidelity_reward += achieved_fidelity
        
        return fidelity_reward / max(1, total_quantum_jobs)
    
    def _calculate_cost_penalty(self, jobs: List[QuantumJob]) -> float:
        """Penalty based on resource costs"""
        total_cost = 0.0
        for job in jobs:
            if job.status == JobStatus.RUNNING:
                total_cost += job.estimated_cost(self.resources)
        return total_cost / 1000.0  # Normalize cost

class QueueingTheoryAnalyzer:
    """Queueing theory analysis for workload optimization"""
    
    def __init__(self):
        self.arrival_rates: Dict[ResourceType, float] = {}
        self.service_rates: Dict[ResourceType, float] = {}
        self.queue_lengths: Dict[ResourceType, List[int]] = defaultdict(list)
        
    def analyze_mm1_queue(self, arrival_rate: float, service_rate: float) -> Dict[str, float]:
        """M/M/1 queue analysis for resource utilization"""
        if service_rate <= arrival_rate:
            return {"utilization": 1.0, "avg_queue_length": float('inf'), "avg_wait_time": float('inf')}
        
        rho = arrival_rate / service_rate  # Utilization
        avg_queue_length = rho / (1 - rho)
        avg_wait_time = rho / (service_rate * (1 - rho))
        
        return {
            "utilization": rho,
            "avg_queue_length": avg_queue_length,
            "avg_wait_time": avg_wait_time,
            "throughput": arrival_rate
        }
    
    def analyze_mmk_queue(self, arrival_rate: float, service_rate: float, num_servers: int) -> Dict[str, float]:
        """M/M/k queue analysis for multi-server resources"""
        rho = arrival_rate / service_rate
        
        if rho >= num_servers:
            return {"utilization": 1.0, "avg_queue_length": float('inf'), "avg_wait_time": float('inf')}
        
        # Erlang C formula for M/M/k queue
        p0 = self._calculate_p0_mmk(rho, num_servers)
        pc = self._calculate_pc_mmk(rho, num_servers, p0)
        
        avg_queue_length = pc * rho / (num_servers - rho)
        avg_wait_time = pc / (service_rate * num_servers - arrival_rate)
        
        return {
            "utilization": rho / num_servers,
            "avg_queue_length": avg_queue_length,
            "avg_wait_time": avg_wait_time,
            "probability_wait": pc,
            "throughput": arrival_rate
        }
    
    def _calculate_p0_mmk(self, rho: float, k: int) -> float:
        """Calculate P0 for M/M/k queue"""
        sum_term = sum(rho**n / np.math.factorial(n) for n in range(k))
        erlang_term = (rho**k / np.math.factorial(k)) * (k / (k - rho))
        return 1 / (sum_term + erlang_term)
    
    def _calculate_pc_mmk(self, rho: float, k: int, p0: float) -> float:
        """Calculate Pc (probability of waiting) for M/M/k queue"""
        return (rho**k / np.math.factorial(k)) * (k / (k - rho)) * p0

class HybridWorkloadScheduler:
    """Main scheduler for quantum-classical hybrid workloads"""
    
    def __init__(self, redis_url: str = None, k8s_config_file: str = None):
        self.resources: Dict[str, Resource] = {}
        self.job_queues: Dict[JobPriority, List[QuantumJob]] = {
            priority: [] for priority in JobPriority
        }
        self.running_jobs: Dict[str, QuantumJob] = {}
        self.completed_jobs: List[QuantumJob] = []
        
        # Components
        self.mdp = MarkovDecisionProcess({})
        self.queueing_analyzer = QueueingTheoryAnalyzer()
        
        # External connections
        self.redis_client = redis.Redis.from_url(redis_url) if redis_url else None
        self.k8s_config_file = k8s_config_file
        
        # Scheduling parameters
        self.scheduling_interval = 5.0  # seconds
        self.is_running = False
        
    async def initialize(self):
        """Initialize scheduler with resource discovery"""
        await self._discover_resources()
        self.mdp = MarkovDecisionProcess(self.resources)
        
    async def _discover_resources(self):
        """Discover available computational resources"""
        if self.k8s_config_file:
            await self._discover_k8s_resources()
        else:
            # Default test resources
            self._create_default_resources()
    
    async def _discover_k8s_resources(self):
        """Discover Kubernetes resources for quantum workloads"""
        try:
            await k8s.config.load_kube_config(config_file=self.k8s_config_file)
            v1 = k8s.client.CoreV1Api()
            
            nodes = await v1.list_node()
            for node in nodes.items:
                node_name = node.metadata.name
                labels = node.metadata.labels or {}
                
                # Quantum simulator nodes
                if labels.get('workload-type') == 'quantum-simulation':
                    resource = Resource(
                        id=f"quantum-sim-{node_name}",
                        resource_type=ResourceType.QUANTUM_SIMULATOR,
                        capacity=8,  # Based on node specs
                        cost_per_unit=10.0,
                        quantum_fidelity=0.99,
                        coherence_time=100.0
                    )
                    self.resources[resource.id] = resource
                
                # Classical GPU nodes
                elif labels.get('node-class') == 'gpu-accelerated':
                    resource = Resource(
                        id=f"gpu-{node_name}",
                        resource_type=ResourceType.CLASSICAL_GPU,
                        capacity=4,
                        cost_per_unit=5.0
                    )
                    self.resources[resource.id] = resource
                
                # Classical CPU nodes
                else:
                    resource = Resource(
                        id=f"cpu-{node_name}",
                        resource_type=ResourceType.CLASSICAL_CPU,
                        capacity=16,
                        cost_per_unit=1.0
                    )
                    self.resources[resource.id] = resource
                    
        except Exception as e:
            logger.error(f"Failed to discover K8s resources: {e}")
            self._create_default_resources()
    
    def _create_default_resources(self):
        """Create default test resources"""
        self.resources = {
            "quantum-sim-1": Resource(
                id="quantum-sim-1",
                resource_type=ResourceType.QUANTUM_SIMULATOR,
                capacity=4,
                cost_per_unit=10.0,
                quantum_fidelity=0.99,
                coherence_time=100.0
            ),
            "quantum-sim-2": Resource(
                id="quantum-sim-2", 
                resource_type=ResourceType.QUANTUM_SIMULATOR,
                capacity=8,
                cost_per_unit=15.0,
                quantum_fidelity=0.995,
                coherence_time=150.0
            ),
            "gpu-cluster-1": Resource(
                id="gpu-cluster-1",
                resource_type=ResourceType.CLASSICAL_GPU,
                capacity=16,
                cost_per_unit=5.0
            ),
            "cpu-cluster-1": Resource(
                id="cpu-cluster-1",
                resource_type=ResourceType.CLASSICAL_CPU,
                capacity=32,
                cost_per_unit=1.0
            )
        }
    
    async def submit_job(self, job: QuantumJob) -> str:
        """Submit job to scheduler"""
        job.status = JobStatus.QUEUED
        self.job_queues[job.priority].append(job)
        
        # Cache job in Redis if available
        if self.redis_client:
            job_data = {
                'id': job.id,
                'priority': job.priority.name,
                'status': job.status.name,
                'created_at': job.created_at.isoformat(),
                'num_qubits': job.num_qubits,
                'estimated_runtime': job.estimated_runtime
            }
            await self.redis_client.hset(f"job:{job.id}", mapping=job_data)
        
        logger.info(f"Job {job.id} submitted with priority {job.priority.name}")
        return job.id
    
    async def start_scheduling(self):
        """Start the main scheduling loop"""
        self.is_running = True
        logger.info("Starting quantum workload scheduler")
        
        while self.is_running:
            try:
                await self._scheduling_cycle()
                await asyncio.sleep(self.scheduling_interval)
            except Exception as e:
                logger.error(f"Scheduling cycle error: {e}")
                await asyncio.sleep(1.0)
    
    async def _scheduling_cycle(self):
        """Execute one scheduling cycle"""
        # Update resource availability
        await self._update_resource_status()
        
        # Check for completed jobs
        await self._check_completed_jobs()
        
        # Remove expired jobs
        self._remove_expired_jobs()
        
        # Schedule new jobs using MDP
        await self._schedule_jobs_mdp()
        
        # Update queueing theory metrics
        self._update_queueing_metrics()
    
    async def _update_resource_status(self):
        """Update current resource availability and load"""
        for resource in self.resources.values():
            # Simulate resource availability changes
            resource.availability = min(1.0, resource.availability + np.random.normal(0, 0.01))
            resource.availability = max(0.0, resource.availability)
    
    async def _check_completed_jobs(self):
        """Check for jobs that have completed execution"""
        completed_job_ids = []
        
        for job_id, job in self.running_jobs.items():
            # Simulate job completion based on estimated runtime
            if job.started_at:
                elapsed = (datetime.now() - job.started_at).total_seconds()
                if elapsed >= job.estimated_runtime:
                    job.status = JobStatus.COMPLETED
                    job.completed_at = datetime.now()
                    
                    # Free up resources
                    for resource_id in job.assigned_resources:
                        if resource_id in self.resources:
                            self.resources[resource_id].current_load -= 1
                    
                    self.completed_jobs.append(job)
                    completed_job_ids.append(job_id)
                    
                    logger.info(f"Job {job_id} completed after {elapsed:.2f}s")
        
        # Remove completed jobs from running jobs
        for job_id in completed_job_ids:
            del self.running_jobs[job_id]
    
    def _remove_expired_jobs(self):
        """Remove jobs that have exceeded maximum wait time"""
        for priority in JobPriority:
            expired_jobs = []
            for i, job in enumerate(self.job_queues[priority]):
                if job.is_expired():
                    job.status = JobStatus.CANCELLED
                    expired_jobs.append(i)
                    logger.warning(f"Job {job.id} expired after waiting too long")
            
            # Remove expired jobs (in reverse order to maintain indices)
            for i in reversed(expired_jobs):
                del self.job_queues[priority][i]
    
    async def _schedule_jobs_mdp(self):
        """Schedule jobs using Markov Decision Process optimization"""
        all_pending_jobs = []
        for priority in JobPriority:
            all_pending_jobs.extend(self.job_queues[priority])
        
        if not all_pending_jobs:
            return
        
        current_state = self.mdp.get_state_representation(all_pending_jobs + list(self.running_jobs.values()))
        
        # Sort jobs by priority and wait time
        all_pending_jobs.sort(key=lambda j: (j.priority.value, j.created_at))
        
        for job in all_pending_jobs:
            # Find best resource allocation
            best_allocation = self._find_best_resource_allocation(job)
            
            if best_allocation:
                await self._assign_job_to_resources(job, best_allocation)
                
                # Remove from queue
                self.job_queues[job.priority].remove(job)
    
    def _find_best_resource_allocation(self, job: QuantumJob) -> Optional[List[str]]:
        """Find optimal resource allocation for job using cost-benefit analysis"""
        candidate_resources = []
        
        for resource_id, resource in self.resources.items():
            if (resource.resource_type in job.required_resources and
                resource.available_capacity() > 0):
                
                # Calculate allocation score
                score = self._calculate_allocation_score(job, resource)
                candidate_resources.append((resource_id, score))
        
        if not candidate_resources:
            return None
        
        # Sort by score (higher is better)
        candidate_resources.sort(key=lambda x: x[1], reverse=True)
        
        # Select best resource(s)
        selected_resources = [candidate_resources[0][0]]
        
        # For jobs requiring multiple resource types, add complementary resources
        required_types = job.required_resources.copy()
        selected_type = self.resources[selected_resources[0]].resource_type
        required_types.discard(selected_type)
        
        for resource_type in required_types:
            best_complement = None
            best_complement_score = -1
            
            for resource_id, resource in self.resources.items():
                if (resource.resource_type == resource_type and 
                    resource.available_capacity() > 0 and
                    resource_id not in selected_resources):
                    
                    score = self._calculate_allocation_score(job, resource)
                    if score > best_complement_score:
                        best_complement = resource_id
                        best_complement_score = score
            
            if best_complement:
                selected_resources.append(best_complement)
        
        return selected_resources
    
    def _calculate_allocation_score(self, job: QuantumJob, resource: Resource) -> float:
        """Calculate allocation score for job-resource pairing"""
        # Factors: availability, cost, fidelity (for quantum), utilization
        score = 0.0
        
        # Availability score (0-1)
        availability_score = resource.availability
        score += 0.3 * availability_score
        
        # Utilization score (prefer balanced utilization)
        util = resource.utilization()
        if util < 0.7:
            utilization_score = 1.0 - abs(0.5 - util)
        else:
            utilization_score = 1.0 - util
        score += 0.2 * utilization_score
        
        # Cost score (lower cost is better)
        cost_score = 1.0 / (1.0 + resource.cost_per_unit)
        score += 0.2 * cost_score
        
        # Quantum fidelity score (for quantum jobs)
        if (resource.quantum_fidelity and 
            resource.resource_type in [ResourceType.QUANTUM_SIMULATOR, ResourceType.QUANTUM_HARDWARE]):
            if resource.quantum_fidelity >= job.quantum_fidelity_threshold:
                fidelity_score = resource.quantum_fidelity
            else:
                fidelity_score = 0.0  # Insufficient fidelity
            score += 0.3 * fidelity_score
        else:
            score += 0.3  # Neutral for non-quantum resources
        
        return score
    
    async def _assign_job_to_resources(self, job: QuantumJob, resource_ids: List[str]):
        """Assign job to selected resources and start execution"""
        job.assigned_resources = resource_ids
        job.status = JobStatus.RUNNING
        job.started_at = datetime.now()
        
        # Update resource load
        for resource_id in resource_ids:
            if resource_id in self.resources:
                self.resources[resource_id].current_load += 1
        
        # Add to running jobs
        self.running_jobs[job.id] = job
        
        logger.info(f"Job {job.id} assigned to resources: {resource_ids}")
        
        # Simulate job execution by calling appropriate service
        asyncio.create_task(self._execute_job(job))
    
    async def _execute_job(self, job: QuantumJob):
        """Execute job on assigned resources (simulation)"""
        try:
            # Simulate job execution
            await asyncio.sleep(job.estimated_runtime)
            
            # Simulate result generation
            job.result = {
                'success': True,
                'fidelity': np.random.uniform(0.95, 0.999) if job.quantum_fidelity_threshold else None,
                'execution_time': job.estimated_runtime,
                'resource_utilization': {
                    rid: self.resources[rid].utilization() for rid in job.assigned_resources
                }
            }
            
            logger.info(f"Job {job.id} execution completed successfully")
            
        except Exception as e:
            job.status = JobStatus.FAILED
            job.result = {'success': False, 'error': str(e)}
            logger.error(f"Job {job.id} execution failed: {e}")
    
    def _update_queueing_metrics(self):
        """Update queueing theory metrics for system optimization"""
        for resource_type in ResourceType:
            # Calculate arrival and service rates
            resources_of_type = [r for r in self.resources.values() if r.resource_type == resource_type]
            
            if not resources_of_type:
                continue
            
            # Estimate arrival rate from queue lengths
            queue_length = sum(
                len([j for j in jobs if resource_type in j.required_resources])
                for jobs in self.job_queues.values()
            )
            
            # Estimate service rate from resource capacity
            total_capacity = sum(r.capacity for r in resources_of_type)
            avg_service_time = 300.0  # 5 minutes average
            service_rate = total_capacity / avg_service_time
            
            # Analyze queue performance
            if len(resources_of_type) == 1:
                metrics = self.queueing_analyzer.analyze_mm1_queue(
                    arrival_rate=queue_length / 60.0,  # per minute
                    service_rate=service_rate
                )
            else:
                metrics = self.queueing_analyzer.analyze_mmk_queue(
                    arrival_rate=queue_length / 60.0,
                    service_rate=service_rate,
                    num_servers=len(resources_of_type)
                )
            
            logger.debug(f"Queue metrics for {resource_type.name}: {metrics}")
    
    async def stop_scheduling(self):
        """Stop the scheduling loop"""
        self.is_running = False
        logger.info("Quantum workload scheduler stopped")
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get current system status and metrics"""
        pending_jobs = sum(len(jobs) for jobs in self.job_queues.values())
        
        resource_status = {}
        for resource_id, resource in self.resources.items():
            resource_status[resource_id] = {
                'type': resource.resource_type.name,
                'utilization': resource.utilization(),
                'available_capacity': resource.available_capacity(),
                'current_load': resource.current_load
            }
        
        return {
            'timestamp': datetime.now().isoformat(),
            'pending_jobs': pending_jobs,
            'running_jobs': len(self.running_jobs),
            'completed_jobs': len(self.completed_jobs),
            'resources': resource_status,
            'scheduler_running': self.is_running
        }

# Example usage
async def main():
    """Example usage of the quantum workload scheduler"""
    scheduler = HybridWorkloadScheduler()
    await scheduler.initialize()
    
    # Submit some test jobs
    jobs = [
        QuantumJob(
            circuit_depth=10,
            num_qubits=4,
            estimated_runtime=30.0,
            priority=JobPriority.HIGH,
            required_resources={ResourceType.QUANTUM_SIMULATOR}
        ),
        QuantumJob(
            circuit_depth=20,
            num_qubits=8,
            estimated_runtime=120.0,
            priority=JobPriority.NORMAL,
            required_resources={ResourceType.QUANTUM_SIMULATOR, ResourceType.CLASSICAL_GPU}
        ),
        QuantumJob(
            circuit_depth=5,
            num_qubits=2,
            estimated_runtime=10.0,
            priority=JobPriority.CRITICAL,
            required_resources={ResourceType.QUANTUM_SIMULATOR}
        )
    ]
    
    for job in jobs:
        await scheduler.submit_job(job)
    
    # Start scheduler
    scheduler_task = asyncio.create_task(scheduler.start_scheduling())
    
    # Run for 5 minutes
    await asyncio.sleep(300)
    
    # Stop scheduler
    await scheduler.stop_scheduling()
    scheduler_task.cancel()
    
    # Print final status
    status = scheduler.get_system_status()
    print(f"Final system status: {json.dumps(status, indent=2)}")

if __name__ == "__main__":
    asyncio.run(main())
