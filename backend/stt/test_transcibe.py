from transcribe import *
from utils import *

def main():
    file_path = "./consultation_x1_combined_dialogue.mp3"
    clinical_note = asyncio.run(transcribe(file_path))

    # Print the extracted clinical note
    print_note(clinical_note)
    write_json_to_file(clinical_note.dict(), "test_clinical_note.json")

if __name__ == "__main__":
    main()