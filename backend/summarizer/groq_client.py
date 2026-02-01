import os
import json
import logging
from groq import Groq
from .prompts import SYSTEM_PROMPT
from dotenv import load_dotenv

# Configure Logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load environment variables
from pathlib import Path

# Build path to .env file relative to this script
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / '.env'

if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
    logger.info(f"Loading .env from: {env_path}")
else:
    logger.warning(f"WARNING: .env file not found at {env_path}")
    load_dotenv(override=True)

# Manage API Keys with Rotation
GROQ_KEYS = []
# 1. Add primary key
if os.getenv("GROQ_API_KEY"):
    GROQ_KEYS.append(os.getenv("GROQ_API_KEY"))

# 2. Add any other keys matching pattern GROQ_API_KEY_*
for key, value in os.environ.items():
    if key.startswith("GROQ_API_KEY_") and value:
        GROQ_KEYS.append(value)

# Deduplicate and Filter
GROQ_KEYS = list(set([k for k in GROQ_KEYS if k and k.strip()]))

# Models to try in order (Failover strategy)
GROQ_MODELS = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"]

if not GROQ_KEYS:
    logger.warning("WARNING: No GROQ_API_KEYs found in environment.")
else:
    logger.info(f"Loaded {len(GROQ_KEYS)} Groq API keys for rotation.")

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
    if not GROQ_KEYS:
        return json.dumps({
            "insufficient_data": True,
            "patient_profile": {},
            "sections": { "chief_complaint": "Error: No GROQ_API_KEYs configured." },
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

IMPORTANT: If the provided text does not contain sufficient or valid medical information (e.g., if it is gibberish, too short, or unrelated to a medical report), set "insufficient_data" to true.

REQUIRED JSON STRUCTURE:
{{
  "insufficient_data": boolean,
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
        # 3. Call Groq API with Key Rotation & Model Fallback
        last_exception = None
        
        # Prepare messages once
        messages_payload = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT + "\n\nPlease output valid JSON only."
            },
            {
                "role": "user",
                "content": user_instructions
            }
        ]

        for i, api_key in enumerate(GROQ_KEYS):
            try:
                temp_client = Groq(api_key=api_key)
                
                for model in GROQ_MODELS:
                    try:
                        logger.info(f"Calling Groq API | Key Index: {i+1} | Model: {model}")
                        chat_completion = temp_client.chat.completions.create(
                            messages=messages_payload,
                            model=model,
                            response_format={"type": "json_object"},
                            temperature=0.1, 
                        )

                        content = chat_completion.choices[0].message.content
                        # logger.info(f"Summarization successful with Key #{i+1} and Model {model}")
                        return content
                    
                    except Exception as e:
                        logger.error(f"FAILED: Key #{i+1} | Model {model} -> {str(e)}")
                        last_exception = e
                        continue # Try next model
                        
            except Exception as outer_e:
                logger.critical(f"Critical Error with Key #{i+1}: {outer_e}")
                last_exception = outer_e
                continue # Try next key
        
        # If loop exits, all keys/models failed
        if last_exception:
            raise last_exception
        else:
            raise Exception("Unknown error: All API keys and models failed.")

    except Exception as e:
        logger.exception(f"Error calling Groq API: {e}")
        return json.dumps({
            "insufficient_data": True,
            "patient_profile": {},
            "sections": { "chief_complaint": f"Error generating summary: {str(e)}" },
            "medications": [],
            "timeline": [],
            "lab_data": [],
            "dynamic_charts": None
        })

