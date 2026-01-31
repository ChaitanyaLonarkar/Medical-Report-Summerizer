# Client for interacting with Groq LLM API
import os
import re # Regex for JSON extraction
from groq import Groq
from .prompts import SYSTEM_PROMPT
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

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

    prompt = build_prompt(chunks)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # free + strong reasoning
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.0,     # critical → no creativity
        max_tokens=800
    )

    content = response.choices[0].message.content
    
    # Extract JSON object using regex
    match = re.search(r'\{.*\}', content, re.DOTALL)
    if match:
        return match.group(0)
        
    return content


def build_prompt(chunks):
    formatted_chunks = []

    for chunk in chunks:
        formatted_chunks.append(
            f"""
[Chunk ID: {chunk['chunk_id']}]
[Page: {chunk['page']}]
Text:
{chunk['text']}
"""
        )

    joined_chunks = "\n".join(formatted_chunks)

    return f"""
You are given redacted medical document chunks.

TASK:
- Create a structured summary
- Use bullet points
- Each bullet MUST reference source page numbers
- ONLY include information explicitly present

OUTPUT FORMAT (JSON ONLY):

{{
  "summary": [
    {{
      "section": "Key Findings",
      "points": [
        {{
          "text": "Factual statement here",
          "pages": [2]
        }}
      ]
    }}
  ]
}}

MEDICAL DOCUMENT CHUNKS:
{joined_chunks}
"""
