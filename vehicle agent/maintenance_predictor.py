import json
import time
import os
import statistics
import sys
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HISTORY_PATH = os.path.join(BASE_DIR, "vehicle_history.json")
SERVICE_REQUEST_PATH = os.path.join(BASE_DIR, "service_requests.json")

WARNING_THRESHOLDS = {
    "emission": 60.0,
    "tire_wear": 75.0,
    "brake_condition": 45.0,
    "fuel_efficiency": 15.0,
    "spark_plug_health": 50.0,
    "general_score": 60.0
}

ROLLING_WINDOW = 5  # weeks
TREND_DROP_THRESHOLD = {
    "emission": 1.5,
    "brake_condition": 1.5,
    "fuel_efficiency": 0.2,
    "spark_plug_health": 1.5,
    "general_score": 1.5
}

def safe_load_json(path, retries=3, delay=1):
    """Tries to load JSON safely, with retry on decode errors or empty file."""
    for _ in range(retries):
        if not os.path.exists(path) or os.path.getsize(path) == 0:
            time.sleep(delay)
            continue
        try:
            with open(path, "r", encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            time.sleep(delay)
    return None  # give up

def median_trend(values):
    if len(values) < 2:
        return 0
    diffs = [values[i] - values[i + 1] for i in range(len(values) - 1)]
    return statistics.median(diffs)

def analyze_trend(history_slice):
    degraded_fields = []

    for key in WARNING_THRESHOLDS:
        try:
            values = [entry["vehicle_data"][key] for entry in history_slice]
        except KeyError:
            print(f"⚠️ Warning: Missing key `{key}` in some entries. Skipping...")
            continue

        current_value = values[-1]

        if key == "tire_wear":
            if current_value > WARNING_THRESHOLDS[key]:
                degraded_fields.append(key)
        else:
            median_drop = median_trend(values[::-1])
            if current_value < WARNING_THRESHOLDS[key] or median_drop > TREND_DROP_THRESHOLD.get(key, 1.0):
                degraded_fields.append(key)

    return degraded_fields

def log_service_request(week, timestamp, issues):
    data = {
        "week": week,
        "timestamp": timestamp,
        "required_services": issues
    }
    try:
        with open(SERVICE_REQUEST_PATH, "w", encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("📤 Service request logged.")
    except Exception as e:
        print(f"❌ Failed to write service request: {e}")

def main():
    print("[MaintenancePredictorAgent] 🔧 Starting trend analysis...\n")
    last_processed_week = -1

    while True:
        history = safe_load_json(HISTORY_PATH)
        if not history:
            print("⏳ Waiting for valid vehicle history data...")
            time.sleep(60)
            continue

        latest_record = history[-1]
        current_week = latest_record.get("week", 0)

        if current_week == last_processed_week:
            time.sleep(60)
            continue

        print(f"\n[Week {current_week}] 🔍 Analyzing trends...")

        history_slice = history[-ROLLING_WINDOW:] if len(history) >= ROLLING_WINDOW else history

        issues = analyze_trend(history_slice)

        if issues:
            print("⚠️  Maintenance Needed For:", issues)
            log_service_request(current_week, latest_record["timestamp"], issues)
        else:
            print("✅ No urgent maintenance predicted.")

        last_processed_week = current_week
        time.sleep(60)

if __name__ == "__main__":
    main()
