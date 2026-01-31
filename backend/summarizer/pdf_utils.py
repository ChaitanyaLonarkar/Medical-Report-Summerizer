# Logic for extracting text from PDFs using PyMuPDF
import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_file_stream):
    """
    Extracts text from a PDF file stream (InMemoryUploadedFile).
    Returns a list of chunks/pages:
    [
        {"chunk_id": "P1-C1", "page": 1, "text": "..."}
    ]
    """
    doc = fitz.open(stream=pdf_file_stream.read(), filetype="pdf")
    chunks = []
    
    for page_num, page in enumerate(doc, start=1):
        text = page.get_text()
        if text.strip():  # Only add if there is text
            chunks.append({
                "chunk_id": f"P{page_num}-C1",
                "page": page_num,
                "text": text
            })
            
    return chunks
