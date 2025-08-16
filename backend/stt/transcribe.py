import time
import json
import asyncio
from rev_ai import apiclient
from dotenv import load_dotenv
import os

from utils import *
from refine import refine_transcript
from processing import extract_clinical_note, print_note

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
    job = client.submit_job_local_file(file_path)
    print(f"Job submitted with id: {job.id}")

    return job.id

def poll_job_status(job_id):
    """Poll the job status until it is finished."""
    job_details = client.get_job_details(job_id)
    return job_details.status    

def poll_until_done(job_id, timeout=300):
    """Poll the job status until it is finished or times out."""
    start_time = time.time()
    while True:
        job = client.get_job_details(job_id)
        if job.status == "transcribed":
            print("Job completed.")
            return
        elif job.status == "failed":
            raise RuntimeError("Transcription job failed.")
        elif time.time() - start_time > timeout:
            raise TimeoutError("Polling timed out before transcription finished.")
        time.sleep(5)  # wait before polling again

def get_transcript_json(job_id):
    """Get the transcript in JSON format."""
    transcript = client.get_transcript_json(job_id)
    print(f"Transcript retrieved for job id: {job_id}")
    return transcript

def submit_clinical_json(transcript_json):
    """Submit the transcript JSON to Gemini for processing;"""

async def transcribe(file_path):
    """Main function to handle the transcription process."""
    print(f"Starting transcription for file: {file_path}")

    # Submit audio file for processing
    job_id = submit_audio_file(file_path)

    # Wait for job to complete
    print("Waiting for transcription to complete...")
    poll_until_done(job_id)

    # Get the completed transcript
    transcription_json = get_transcript_json(job_id)

    # Refine the transcript into a chat-like format
    refined_transcript = refine_transcript(transcription_json)

    # Create clinical note from refined transcript
    clinical_note = extract_clinical_note(refined_transcript)

    print("Transcription and processing complete.")
    return clinical_note

def write_to_file(transcript, file_path):
    """Write the transcript to a file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(transcript, f, ensure_ascii=False, indent=2)
    print(f"Transcript saved to {file_path}")

 
