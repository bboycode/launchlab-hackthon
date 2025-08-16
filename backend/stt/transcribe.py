import time
import json
from rev_ai import apiclient
from dotenv import load_dotenv
import os

load_dotenv()
token = os.getenv('REV_AI_TOKEN')

# --- Config ---
TOKEN = token
FILEPATH = "./consultation_x1_combined_dialogue.mp3"
RAW_TRANSCRIPT_FILE = "transcript_raw.json"

# --- Initialize client ---
client = apiclient.RevAiAPIClient(TOKEN)

def submit_audio_file(file_path):
    """Submit an audio file for transcription."""
    with open(file_path, 'rb') as audio_file:
        job = client.submit_job_local_file(audio_file)
    print(f"Job submitted with id: {job_id}")

    return job.id

def poll_job_status(job_id):
    """Poll the job status until it is finished."""
    job_details = client.get_job_details(job_id)
    if job_details.status in ["transcribed", "failed"]:
        return job_details
    print(f"Job status: {job_details.status}... waiting")
    time.sleep(5)

def get_transcript_json(job_id):
    """Get the transcript in JSON format."""
    transcript = client.get_transcript_json(job_id)
    print(f"Transcript retrieved for job id: {job_id}")
    return transcript

def write_to_file(transcript, file_path):
    """Write the transcript to a file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(transcript, f, ensure_ascii=False, indent=2)
    print(f"Transcript saved to {file_path}")
