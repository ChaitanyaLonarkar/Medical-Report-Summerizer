import os
from groq import Groq

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
        model="llama3-70b-8192",  # free + strong reasoning
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

    return response.choices[0].message.content

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

