import time
import os
import json
import statistics
import sys
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HISTORY_PATH = os.path.join(BASE_DIR, "vehicle_history.json")
USER_PREFS_PATH = os.path.join(BASE_DIR, "user_preferences.json")
COACH_LOG_PATH = os.path.join(BASE_DIR, "coach_log.json")

BADGE_THRESHOLDS = {
    "Eco Driver": 90,
    "Smooth Operator": 95
}
WINDOW_SIZE = 5  # weeks

def load_json(path, default):
    try:
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"[DriverCoachAgent] ❌ Failed to load {path}: {e}")
    return default

def save_json(path, data):
    try:
        with open(path, "w", encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[DriverCoachAgent] ❌ Failed to save {path}: {e}")

def evaluate_driver():
    history = load_json(HISTORY_PATH, [])
    if len(history) < WINDOW_SIZE:
        print("[DriverCoachAgent] ℹ️ Not enough data to evaluate yet.")
        return None

    recent = history[-WINDOW_SIZE:]

    fuel_eff = [r["vehicle_data"]["fuel_efficiency"] for r in recent]
    brake_cnd = [r["vehicle_data"]["brake_condition"] for r in recent]
    general = [r["vehicle_data"]["general_score"] for r in recent]

    avg_fuel_drop = round(max(0, fuel_eff[0] - fuel_eff[-1]), 2)
    avg_brake_drop = round(max(0, brake_cnd[0] - brake_cnd[-1]), 2)
    avg_general = round(statistics.mean(general), 2)

    tips = []
    badges = []

    if avg_fuel_drop > 2:
        tips.append("Your fuel efficiency dropped by >2% recently — try smoother acceleration.")
    if avg_brake_drop > 3:
        tips.append("Brake condition fell >3% — avoid hard braking to extend pad life.")

    if avg_general >= BADGE_THRESHOLDS["Eco Driver"]:
        badges.append("Eco Driver")
    if statistics.mean(brake_cnd) >= BADGE_THRESHOLDS["Smooth Operator"]:
        badges.append("Smooth Operator")

    return {
        "avg_fuel_drop": avg_fuel_drop,
        "avg_brake_drop": avg_brake_drop,
        "avg_general_score": avg_general,
        "tips": tips,
        "badges": badges
    }

def main():
    print("[DriverCoachAgent] 🚦 Running coaching analysis loop...")
    last_eval_week = -1
    coach_log = load_json(COACH_LOG_PATH, {})

    while True:
        history = load_json(HISTORY_PATH, [])
        if not history:
            time.sleep(60)
            continue

        current_week = history[-1].get("week", -1)
        if current_week != last_eval_week:
            feedback = evaluate_driver()
            if feedback:
                print(f"\n[Week {current_week}] 📊 Coaching Feedback Summary:")
                print("🔁 Fuel Drop:", feedback["avg_fuel_drop"], "%")
                print("🛑 Brake Drop:", feedback["avg_brake_drop"], "%")
                print("📈 General Score:", feedback["avg_general_score"])

                for tip in feedback["tips"]:
                    print("💡 Tip:", tip)
                for badge in feedback["badges"]:
                    print("🏅 Badge Earned:", badge)

                coach_log[str(current_week)] = feedback
                save_json(COACH_LOG_PATH, coach_log)

            last_eval_week = current_week

        time.sleep(60)

if __name__ == "__main__":
    main()
