import os
import json

def load_json_files(folder_path):
    """
    Loads all JSON files from a specified directory into a dictionary.
    
    Args:
        folder_path (str): Path to the directory containing JSON files
    """
    data_dict = {}

    # Verify the folder exists before processing
    if not os.path.exists(folder_path):
        raise FileNotFoundError(f"Folder '{folder_path}' does not exist.")

    for filename in os.listdir(folder_path):
        if filename.endswith(".json"):
            file_path = os.path.join(folder_path, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    data_dict[os.path.splitext(filename)[0]] = json.load(file)
            except json.JSONDecodeError as e:
                print(f"Error reading {filename}: {e}")

    return data_dict