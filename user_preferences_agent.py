# user_preference_agent.py

import json
import os

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

    with open(PREF_FILE, "w") as f:
        json.dump(preferences, f, indent=2)

    print("\n✅ Preferences saved to user_preferences.json")
    return preferences

def get_user_preferences():
    if not os.path.exists(PREF_FILE):
        return collect_user_preferences()

    with open(PREF_FILE, "r") as f:
        return json.load(f)

if __name__ == "__main__":
    collect_user_preferences()
