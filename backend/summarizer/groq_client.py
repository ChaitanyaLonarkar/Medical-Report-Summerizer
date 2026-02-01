import os
import json
import re
from groq import Groq
from .prompts import SYSTEM_PROMPT
from dotenv import load_dotenv, find_dotenv

# Load environment variables
from pathlib import Path

# Build path to .env file relative to this script
# this script is in backend/summarizer/groq_client.py
# .env is in backend/.env
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / '.env'

if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
    print(f"Loading .env from: {env_path}")
else:
    print(f"WARNING: .env file not found at {env_path}")
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
            "lab_data": [],
            "dynamic_charts": None
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
  }},
  "vital_trends": [{{
    "time": "str", 
    "hr": int, 
    "sbp": int, 
    "dbp": int, 
    "spo2": int,
    "temp": float
  }}],
  "dynamic_charts": [
    {{
      "chart_type": "str", 
      "title": "str",
      "x_label": "str",
      "y_label": "str",
      "data": [{{ "label": "str", "value": float, "value2": float, "fullMark": float }}],
      "x_axis_key": "label",
      "data_key": "value",
      "data_key_2": "value2"
    }}
  ],
  "personalized_guidance": {{
    "next_steps": ["str"],
    "lifestyle_tips": [{{ "topic": "str", "advice": "str" }}],
    "faq": [{{ "question": "str", "answer": "str" }}]
  }}
}}

INSTRUCTIONS FOR DYNAMIC CHARTS:
Create a dashboard-like experience by generating multiple charts if valid data exists.
- 'chart_type' options: 'bar', 'line', 'pie', 'area', 'composed' (bar+line), 'radar', 'radial'.
- 'composed': Use for comparing two metrics (e.g., 'value' vs 'value2') or trends.
- 'radar': Great for multi-variable assessment (e.g., "Health Score" across 5 categories).
- 'radial': Use for single percentage/gauge values (e.g., "Risk Level").
- If extracted data supports it, create 2-3 distinct charts (e.g., one for Vitals trend, one for Lab comparison).
- 'data_key_2' is optional, used for 'composed' charts (2nd metric).

INSTRUCTIONS FOR PERSONALIZED GUIDANCE:
- NEXT STEPS: FIRST, extract any explicit follow-up instructions, appointments, or plan mentioned in the report (e.g., "Return in 2 weeks", "Consult Cardiologist"). If none are explicit, suggest logical next steps based strictly on the diagnosis and abnormal findings.
- Provide tailored 'lifestyle_tips' based on findings (e.g., "Low sugar" -> "Diabetes diet tips", "Low iron" -> "Iron-rich foods"). Include simple actionable advice on food, sleep, or hydration.
- Generate 'faq' with 3-5 common questions a patient might have about this specific report, and provide clear, reassuring ANSWERS based on the findings.

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
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            temperature=0.1, 
        )

        content = chat_completion.choices[0].message.content
        print("\n\n=== DEBUG: LLM RAW RESPONSE ===\n")
        print(content)
        print("\n===============================\n")
        return content

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return json.dumps({
            "patient_profile": {},
            "sections": { "chief_complaint": f"Error generating summary: {str(e)}" },
            "medications": [],
            "timeline": [],
            "lab_data": [],
            "dynamic_charts": None
        })

