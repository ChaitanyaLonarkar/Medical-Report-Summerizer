import os
import json
import re
from groq import Groq
from .prompts import SYSTEM_PROMPT
from dotenv import load_dotenv, find_dotenv

# Load environment variables
dot_env_path = find_dotenv()
if dot_env_path:
    load_dotenv(dot_env_path, override=True)
else:
    load_dotenv(override=True)

# Initialize Groq client
api_key = os.getenv("GROQ_API_KEY")
client = None
if api_key:
    client = Groq(api_key=api_key)
else:
    print("WARNING: GROQ_API_KEY not found.")

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
    if not client:
        return json.dumps({
            "patient_profile": {},
            "sections": { "chief_complaint": "Error: GROQ_API_KEY not configured." },
            "medications": [],
            "timeline": [],
            "lab_data": []
        })

    try:
        # 1. Prepare Full Text
        chunks_text = [
            f"[Chunk {c['chunk_id']} | Page {c['page']}]\n{c['text']}" for c in chunks
        ]
        full_text = "\n\n".join(chunks_text)

        # 2. Build User Prompt
        user_instructions = f"""
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
  "medications": [{{ "name": "str", "dose": "str", "frequency": "str", "type": "str", "quantity": int }}],
  "timeline": [{{ "date": "YYYY-MM-DD", "event": "str" }}],
  "lab_data": [{{ "test_name": "str", "value": float, "unit": "str" }}],
  "billing_summary": {{
    "total_bill": "str",
    "medicine_cost": "str",
    "breakdown": [{{ "category": "str", "amount": float, "currency": "str" }}]
  }},
  "medicine_tracking": {{
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "total_days": int
  }}
}}

DOCUMENT TEXT:
{full_text}
"""
        # 3. Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT + "\n\nPlease output valid JSON only."
                },
                {
                    "role": "user",
                    "content": user_instructions
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.1, 
        )

        content = chat_completion.choices[0].message.content
        return content

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return json.dumps({
            "patient_profile": {},
            "sections": { "chief_complaint": f"Error generating summary: {str(e)}" },
            "medications": [],
            "timeline": [],
            "lab_data": []
        })

