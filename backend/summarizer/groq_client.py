import os
import re # Regex for JSON extraction
import json
import google.generativeai as genai
from .prompts import SYSTEM_PROMPT
from dotenv import load_dotenv, find_dotenv

# Use find_dotenv to look up directory tree, and override to reload if file changed
dot_env_path = find_dotenv()
if dot_env_path:
    load_dotenv(dot_env_path, override=True)
else:
    # Fallback to standard load if find fails (e.g. if in root)
    load_dotenv(override=True)

# Try fetching the key
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("CRITICAL WARNING: GEMINI_API_KEY not found in environment variables.")
else:
    print(f"Gemini API Key loaded: {api_key[:4]}...{api_key[-4:]}")

# Initialize Gemini client
if api_key:
    genai.configure(api_key=api_key)

# Use a model with a large context window and JSON capabilities
# gemini-2.0-flash is current and fast
model = genai.GenerativeModel('gemini-2.0-flash',
                              generation_config={"response_mime_type": "application/json"})

def summarize_medical_chunks(chunks):
    """
    chunks: List of dicts
    [
        {
            "chunk_id": "P2-C1",
            "page": 2,
            "text": "Hemoglobin is 9.8 g/dL..."
        }
    ]
    """
    
    # 1. Prepare Full Text
    # Gemini 1.5 Flash has a massive context window (1M tokens), so we don't need to chunk/batch heavily 
    # unless the document is essentially infinite. A typical medical record fits easily.
    chunks_text = [
        f"[Chunk {c['chunk_id']} | Page {c['page']}]\n{c['text']}" for c in chunks
    ]
    full_text = "\n\n".join(chunks_text)
    
    # 2. Build Prompt (Optimized for minimal tokens)
    # concise schema definition ensures correct output without verbose instructions
    prompt = f"""
{SYSTEM_PROMPT}

Extract medical data from the text below into specific JSON format. Use 'null' for missing fields. Infer medication types (e.g., 'Antibiotic').

REQUIRED JSON STRUCTURE:
{{
  "patient_profile": {{ "name": "str", "age": "str", "gender": "str", "location": "str", "phone": "str", "email": "str", "doctor": "str", "primary_diagnosis": "str" }},
  "sections": {{
    "chief_complaint": "str",
    "diagnosis_details": "str", 
    "key_findings": [{{ "text": "str", "page": int }}],
    "treatment_plan": ["str"],
    "vital_signs": {{ "bp": "str", "hr": "str", "temp": "str", "spo2": "str", "resp": "str" }}
  }},
  "medications": [{{ "name": "str", "dose": "str", "frequency": "str", "type": "str" }}],
  "timeline": [{{ "date": "YYYY-MM-DD", "event": "str" }}],
  "lab_data": [{{ "test_name": "str", "value": float, "unit": "str" }}]
}}

DOCUMENT TEXT:
{full_text}
"""

    try:
        # 3. Call Gemini API
        response = model.generate_content(prompt)
        
        # 4. Extract and Return JSON
        content = response.text
        
        # Although we requested JSON mime type, strictly ensure we return just the JSON string
        # Sometimes models add markdown ```json wrapper even with mime type set
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
             return match.group(0)
        
        return content

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        # Return a valid empty JSON structure on error to prevent frontend crash
        return json.dumps({
            "patient_profile": {},
            "sections": { "chief_complaint": f"Error generating summary: {str(e)}" },
            "medications": [],
            "timeline": [],
            "lab_data": []
        })

