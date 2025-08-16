from refine import *
from utils import *

RAW_TRANSCRIPT_FILE = "transcript_raw.json"

raw_transcript = read_json_from_file(RAW_TRANSCRIPT_FILE)

refined_transcript = refine_transcript(raw_transcript)

print("Refined Transcript:")
print(refined_transcript[0])