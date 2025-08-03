import time
import os
import json
import random
import sys
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_REQUEST_PATH = os.path.join(BASE_DIR, "service_requests.json")
USER_PREFS_PATH = os.path.join(BASE_DIR, "user_preferences.json")
SCHEDULED_APPTS_PATH = os.path.join(BASE_DIR, "scheduled_appointments.json")

# Simulated workshop availability
AVAILABLE_SLOTS = [
    "Mon 10:00 AM", "Mon 03:00 PM",
    "Wed 11:00 AM", "Thu 02:00 PM",
    "Fri 09:00 AM", "Sat 01:00 PM"
]

# Simple cost table per service
COST_TABLE = {
    "emission":        2000,
    "tire_wear":       4000,
    "brake_condition": 3000,
    "fuel_efficiency": 1500,
    "spark_plug_health": 1000,
    "general_score":   500
}

def load_user_prefs():
    try:
        with open(USER_PREFS_PATH, encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[SchedulerAgent] ❌ Error loading user preferences: {e}")
        return {"preferred_time_slots": []}

def score_slot(slot, urgency_score, user_slots):
    score = urgency_score  # Start with urgency as base

    for pref in user_slots:
        if not pref.strip():
            continue  # Skip empty or whitespace-only strings
        if slot.startswith(pref.split()[0]):
            score += 2

    return score


def choose_slot(urgency_score, user_slots):
    scored = [(score_slot(s, urgency_score, user_slots), s) for s in AVAILABLE_SLOTS]
    scored.sort(key=lambda x: x[0])
    return scored[0][1]

def bundle_cost(services):
    return sum(COST_TABLE.get(s, 1000) for s in services)

def main():
    print("[SchedulerAgent] ✅ Waiting for service requests…")
    last_week = -1
    scheduled = []

    if os.path.exists(SCHEDULED_APPTS_PATH):
        try:
            with open(SCHEDULED_APPTS_PATH, encoding='utf-8') as f:
                scheduled = json.load(f)
        except Exception as e:
            print(f"[SchedulerAgent] ❌ Error loading previous appointments: {e}")
            scheduled = []

    while True:
        if os.path.exists(SERVICE_REQUEST_PATH):
            try:
                with open(SERVICE_REQUEST_PATH, encoding='utf-8') as f:
                    req = json.load(f)
            except Exception as e:
                print(f"[SchedulerAgent] ❌ Error reading service request: {e}")
                time.sleep(60)
                continue

            week = req.get("week")
            services = req.get("required_services", [])

            if week != last_week and services:
                print(f"\n📬 New request for week {week}: {services}")
                user_prefs = load_user_prefs()
                user_slots = user_prefs.get("preferred_time_slots", [])

                urgency = len(services) * 2
                slot = choose_slot(urgency, user_slots)
                cost = bundle_cost(services)

                appt = {
                    "week": week,
                    "slot": slot,
                    "services": services,
                    "estimated_cost": cost,
                    "confirmed": True
                }
                scheduled.append(appt)

                try:
                    with open(SCHEDULED_APPTS_PATH, "w", encoding="utf-8") as f:
                        json.dump(scheduled, f, indent=2, ensure_ascii=False)
                except Exception as e:
                    print(f"[SchedulerAgent] ❌ Error saving scheduled appointments: {e}")

                print("📅 Scheduled:", services)
                print("⏰ Slot:", slot)
                print("💰 Est. Cost:", cost)

                last_week = week

        time.sleep(60)

if __name__ == "__main__":
    main()
