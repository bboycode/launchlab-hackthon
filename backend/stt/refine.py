import json

RAW_TRANSCRIPT_FILE = "transcript_raw.json"
CHAT_TRANSCRIPT_FILE = "chat_transcript.txt"

# --- Load raw transcript ---
with open(RAW_TRANSCRIPT_FILE, "r", encoding="utf-8") as f:
    transcript = json.load(f)

# --- Convert to chat format ---
chat_lines = []
for mono in transcript["monologues"]:
    speaker = f"Person {mono['speaker'] + 1}"  # speaker 0 → Person 1
    text_parts = [el["value"] for el in mono["elements"]]
    text = "".join(text_parts).strip()
    chat_lines.append(f"{speaker}: {text}")

# --- Save chat transcript ---
with open(CHAT_TRANSCRIPT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(chat_lines))

print(f"Saved chat transcript to {CHAT_TRANSCRIPT_FILE}")
