import random
from datetime import datetime, timezone
from typing import Dict, Any, List

class FederatedLearningDemonstrator:
    """
    Software-only Federated Learning Engine for AERIS.
    Simulates Flower / PyTorch federated training iterations across city nodes (Hyderabad, Bengaluru, Chennai).
    Demonstrates model weight aggregation without sharing raw local datasets.
    """

    def __init__(self):
        self.current_round = 12
        self.global_accuracy = 90.1
        self.global_loss = 0.089
        self.cities = {
            "Hyderabad": {"samples": 18450, "loss": 0.098, "accuracy": 89.4},
            "Bengaluru": {"samples": 21200, "loss": 0.092, "accuracy": 88.8},
            "Chennai": {"samples": 15600, "loss": 0.104, "accuracy": 87.9}
        }

    def execute_training_round(self) -> Dict[str, Any]:
        """
        Simulates 1 round of federated aggregation.
        Each client trains locally, sends updated model weights, and server computes FedAvg.
        """
        self.current_round += 1

        # Simulate local updates
        for city, metrics in self.cities.items():
            metrics["accuracy"] = min(98.0, round(metrics["accuracy"] + random.uniform(0.1, 0.4), 2))
            metrics["loss"] = max(0.02, round(metrics["loss"] - random.uniform(0.002, 0.006), 4))
            metrics["samples"] += random.randint(50, 200)

        # FedAvg weighted accuracy
        total_samples = sum(m["samples"] for m in self.cities.values())
        weighted_acc = sum(m["accuracy"] * m["samples"] for m in self.cities.values()) / total_samples
        self.global_accuracy = min(99.0, round(weighted_acc + 0.3, 2))
        self.global_loss = round(sum(m["loss"] * m["samples"] for m in self.cities.values()) / total_samples, 4)

        return self.get_status()

    def get_status(self) -> Dict[str, Any]:
        city_list = []
        for name, metrics in self.cities.items():
            city_list.append({
                "city": name,
                "sample_count": metrics["samples"],
                "local_loss": metrics["loss"],
                "local_accuracy": metrics["accuracy"],
                "data_privacy": "100% On-Premises / Raw Data Kept Local"
            })

        return {
            "current_round": self.current_round,
            "global_accuracy": self.global_accuracy,
            "global_loss": self.global_loss,
            "participating_cities": list(self.cities.keys()),
            "city_metrics": city_list,
            "aggregation_strategy": "FedAvg (Federated Averaging)",
            "status": "Active / Training Round Complete",
            "last_updated": datetime.now(timezone.utc).isoformat()
        }

federated_engine = FederatedLearningDemonstrator()
