import time
import json
from datetime import datetime
import random
import os
from user_preferences_agent import get_user_preferences  # ← imports user prefs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CURRENT_DATA_PATH = os.path.join(BASE_DIR, "vehicle_data.json")
HISTORY_DATA_PATH = os.path.join(BASE_DIR, "vehicle_history.json")


def simulate_vehicle_data(prev_data=None, week=1):
    preferences = get_user_preferences()
    style = preferences.get("driving_style", "normal")
    env = preferences.get("environment", "city")

    # Driving style effects
    if style == "eco":
        brake_drop = random.uniform(0.3, 0.6)
        fuel_eff_drop = random.uniform(0.05, 0.15)
        emission_drop = random.uniform(1.0, 1.5)
        spark_drop = random.uniform(0.3, 0.6)
        tire_multiplier = 0.9
    elif style == "aggressive":
        brake_drop = random.uniform(1.0, 1.5)
        fuel_eff_drop = random.uniform(0.3, 0.5)
        emission_drop = random.uniform(0.3, 0.6)
        spark_drop = random.uniform(0.6, 1.0)
        tire_multiplier = 1.5
    else:  # normal
        brake_drop = random.uniform(0.6, 1.0)
        fuel_eff_drop = random.uniform(0.15, 0.3)
        emission_drop = random.uniform(0.6, 1.0)
        spark_drop = random.uniform(0.4, 0.7)
        tire_multiplier = 1.0

    # Environment effects
    if env == "city":
        emission_drop *= 1.2
        brake_drop *= 1.3
        env_tire_multiplier = 1.2
    elif env == "highway":
        fuel_eff_drop *= 0.8
        brake_drop *= 0.8
        emission_drop *= 0.9
        env_tire_multiplier = 0.8
    elif env == "off-road":
        fuel_eff_drop *= 1.4
        brake_drop *= 1.2
        env_tire_multiplier = 1.6
    else:
        env_tire_multiplier = 1.0

    base_tire_increase = random.uniform(0.4, 0.6)
    tire_increase = base_tire_increase * tire_multiplier * env_tire_multiplier

    if prev_data:
        emission = max(prev_data["emission"] - emission_drop, 10)
        tire_wear = min(prev_data["tire_wear"] + tire_increase, 100)
        brake_condition = max(prev_data["brake_condition"] - brake_drop, 10)
        fuel_efficiency = max(prev_data["fuel_efficiency"] - fuel_eff_drop, 5)
        spark_plug_health = max(prev_data["spark_plug_health"] - spark_drop, 10)
    else:
        emission = random.uniform(90, 100)
        tire_wear = random.uniform(0, 2)
        brake_condition = random.uniform(90, 100)
        fuel_efficiency = random.uniform(18, 22)
        spark_plug_health = random.uniform(90, 100)

    general_score = (
        emission * 0.2 +
        (100 - tire_wear) * 0.15 +
        brake_condition * 0.2 +
        fuel_efficiency * 0.15 +
        spark_plug_health * 0.3
    )

    return {
        "emission": round(emission, 2),
        "tire_wear": round(tire_wear, 2),
        "brake_condition": round(brake_condition, 2),
        "fuel_efficiency": round(fuel_efficiency, 2),
        "spark_plug_health": round(spark_plug_health, 2),
        "general_score": round(general_score, 2)
    }


def main():
    print("[VehicleMonitorAgent] ✅ Simulation started...\n")
    week = 0
    prev_data = None

    # Load existing history or start fresh
    if os.path.exists(HISTORY_DATA_PATH):
        try:
            with open(HISTORY_DATA_PATH, "r", encoding="utf-8") as f:
                history = json.load(f)
            if history:
                prev_data = history[-1]["vehicle_data"]
                week = history[-1]["week"]
        except Exception as e:
            print(f"[VehicleMonitorAgent] ⚠️ Failed to load history: {e}")
            history = []
    else:
        history = []

    while week < 60:
        week += 1
        current_data = simulate_vehicle_data(prev_data, week)
        prev_data = current_data

        record = {
            "timestamp": str(datetime.now()),
            "week": week,
            "vehicle_data": current_data,
            "alerts": []
        }

        # write current snapshot
        with open(CURRENT_DATA_PATH, "w", encoding="utf-8") as f:
            json.dump(record, f, indent=2, ensure_ascii=False)

        # append to history
        history.append(record)
        with open(HISTORY_DATA_PATH, "w", encoding="utf-8") as hf:
            json.dump(history, hf, indent=2, ensure_ascii=False)

        print(f"[VehicleMonitorAgent] [Week {week}] Vehicle data saved.")
        time.sleep(60)


if __name__ == "__main__":
    main()
