import json

def refine_transcript(raw_transcript_json):
    """
    Refines a raw transcript JSON into a chat-like format.
    This function processes transcription data by transforming speaker monologues
    into a conversational format, where each speaker is identified as "Person X".
    Parameters:
    ----------
    raw_transcript_json : str
        JSON string containing raw transcript data with monologues, speakers, and text elements.
    Returns:
    -------
    tuple
        A tuple containing two elements:
        - str: The complete conversation as a single string with speakers and their text separated by newlines
        - list: A list of individual chat lines, each formatted as "Person X: [text]"
    """
    # --- Load raw transcript ---
    transcript = raw_transcript_json

    # --- Convert to chat format ---
    chat_lines = []
    for mono in transcript["monologues"]:
        speaker = f"Person {mono['speaker'] + 1}"  # speaker 0 → Person 1
        text_parts = [el["value"] for el in mono["elements"]]
        text = "".join(text_parts).strip()
        chat_lines.append(f"{speaker}: {text}")

    return ("\n".join(chat_lines))
