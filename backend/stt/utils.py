import json

def write_json_to_file(input, file_path):
    """Write the transcript to a file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(input, f, ensure_ascii=False, indent=2)
    print(f"Transcript saved to {file_path}")

def read_json_from_file(file_path):
    """Read a JSON file and return its content."""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def read_string_from_file(file_path):
    """Read a string from a file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = f.read()
    return data

def write_string_to_file(input, file_path):
    """Write a string to a file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(input)
    print(f"String saved to {file_path}")