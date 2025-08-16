import time
import json
from rev_ai import apiclient
from dotenv import load_dotenv
import os

load_dotenv()  # Loads variables from .env into the environment
token = os.getenv('REV_AI_TOKEN')

# --- Config ---
TOKEN = token  # replace with your Rev AI token
FILEPATH = "./consultation_x1_combined_dialogue.mp3"
RAW_TRANSCRIPT_FILE = "transcript_raw.json"

# --- Initialize client ---
client = apiclient.RevAiAPIClient(TOKEN)

# --- Submit job ---
job = client.submit_job_local_file(FILEPATH)
job_id = job.id
print(f"Job submitted with id: {job_id}")

# --- Poll until finished ---
while True:
    job_details = client.get_job_details(job_id)
    if job_details.status == "transcribed":
        break
    elif job_details.status == "failed":
        raise RuntimeError(f"Transcription failed: {job_details.failure_detail}")
    print(f"Job status: {job_details.status}... waiting")
    time.sleep(5)

# --- Get transcript ---
transcript = client.get_transcript_json(job_id)

# --- Save raw transcript ---
with open(RAW_TRANSCRIPT_FILE, "w", encoding="utf-8") as f:
    json.dump(transcript, f, ensure_ascii=False, indent=2)

print(f"Saved raw transcript to {RAW_TRANSCRIPT_FILE}")