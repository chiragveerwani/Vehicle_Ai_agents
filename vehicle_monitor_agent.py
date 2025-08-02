# vehicle_monitor_agent.py
import random
import time
import json
from datetime import datetime

class VehicleMonitorAgent:
    def __init__(self):
        self.vehicle_data = {
            "emission": 100.0,             # 100% good
            "tire_wear": 0.0,              # 0% wear = new
            "brake_condition": 100.0,
            "fuel_efficiency": 20.0,       # km/L
            "spark_plug_health": 100.0,
            "general_score": 100.0,
        }
        self.tick_count = 0  # weeks simulated

    def degrade(self):
        """Simulate one week of wear and tear"""
        self.vehicle_data["emission"] -= random.uniform(1, 2.5)
        self.vehicle_data["tire_wear"] += random.uniform(1, 2.5)
        self.vehicle_data["brake_condition"] -= random.uniform(1, 3)
        self.vehicle_data["fuel_efficiency"] -= random.uniform(0.1, 0.5)
        self.vehicle_data["spark_plug_health"] -= random.uniform(1, 2)

        # General score is average of all key systems
        scores = [
            self.vehicle_data["emission"],
            100 - self.vehicle_data["tire_wear"],
            self.vehicle_data["brake_condition"],
            self.vehicle_data["fuel_efficiency"] * 5,  # scaled
            self.vehicle_data["spark_plug_health"]
        ]
        self.vehicle_data["general_score"] = sum(scores) / len(scores)

    def check_alerts(self):
        alerts = []
        if self.vehicle_data["emission"] < 70:
            alerts.append("High emission levels detected.")
        if self.vehicle_data["tire_wear"] > 60:
            alerts.append("Tire wear is high.")
        if self.vehicle_data["brake_condition"] < 60:
            alerts.append("Brake condition is poor.")
        if self.vehicle_data["fuel_efficiency"] < 15:
            alerts.append("Fuel efficiency is low.")
        if self.vehicle_data["spark_plug_health"] < 60:
            alerts.append("Spark plug needs inspection.")
        return alerts

    def generate_weekly_data(self):
        self.degrade()
        self.tick_count += 1
        alerts = self.check_alerts()
        output = {
            "timestamp": datetime.now().isoformat(),
            "week": self.tick_count,
            "vehicle_data": self.vehicle_data.copy(),
            "alerts": alerts
        }
        return output

if __name__ == "__main__":
    agent = VehicleMonitorAgent()
    for _ in range(5):  # simulate 5 weeks
        data = agent.generate_weekly_data()
        print(json.dumps(data, indent=2))
        time.sleep(1)  # Simulate passage of time
