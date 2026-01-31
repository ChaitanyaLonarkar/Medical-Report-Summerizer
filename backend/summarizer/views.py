from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .pdf_utils import extract_text_from_pdf
from .groq_client import summarize_medical_chunks
import json

# Create your views here.

class ProcessPDFView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')
        
        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 1. Extract Text
            chunks = extract_text_from_pdf(file_obj)
            
            if not chunks:
                 return Response({"error": "Could not extract text from PDF"}, status=status.HTTP_400_BAD_REQUEST)

            # 2. Summarize
            # note: summarize_medical_chunks returns a JSON string, need to parse it or pass it through
            summary_json_str = summarize_medical_chunks(chunks)
            
            # The LLM prompt asks for JSON output. 
            # It might perform better if we try to parse it to ensure it is valid JSON before sending back
            try:
                summary_data = json.loads(summary_json_str)
            except json.JSONDecodeError:
                # If LLM failed to give pure JSON, return raw content or handle error
                summary_data = {"raw_summary": summary_json_str, "note": "LLM did not return strict JSON"}

            return Response(summary_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
