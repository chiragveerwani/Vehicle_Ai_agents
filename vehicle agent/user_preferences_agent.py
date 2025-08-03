
import json
import os
import sys

# Ensure proper UTF-8 output in console
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PREF_FILE = os.path.join(BASE_DIR, "user_preferences.json")

def collect_user_preferences():
    print("🛠️  Welcome to Vehicle AI System — Let's Configure Your Profile\n")

    driving_style = input("Enter your driving style (eco / normal / aggressive): ").lower()
    environment = input("Enter your typical environment (city / highway / off-road): ").lower()

    print("\nEnter your preferred service time slots (type 'done' when finished):")
    preferred_time_slots = []
    while True:
        slot = input("Preferred Slot (e.g. 'Monday AM', 'Friday PM'): ")
        if slot.lower() == "done":
            break
        preferred_time_slots.append(slot)

    preferences = {
        "driving_style": driving_style,
        "environment": environment,
        "preferred_time_slots": preferred_time_slots
    }

    # ✅ Use UTF-8 to avoid encoding errors
    with open(PREF_FILE, "w", encoding="utf-8") as f:
        json.dump(preferences, f, indent=2, ensure_ascii=False)

    print("\n✅ Preferences saved to user_preferences.json")
    return preferences

def get_user_preferences():
    if not os.path.exists(PREF_FILE):
        return collect_user_preferences()

    try:
        with open(PREF_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ Error reading preferences: {e}")
        return collect_user_preferences()

if __name__ == "__main__":
    collect_user_preferences()
