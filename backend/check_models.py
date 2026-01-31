import os
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv

# Load env
load_dotenv(find_dotenv(), override=True)
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("No API Key found.")
else:
    print(f"Using Key: {api_key[:4]}...")
    genai.configure(api_key=api_key)

    print("\n--- Available GenerateContent Models ---")
    try:
        found = False
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                found = True
        if not found:
            print("No models found supporting generateContent.")
    except Exception as e:
        print(f"Error listing models: {e}")
