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
        files = request.FILES.getlist('files')
        
        if not files:
            # Fallback to single 'file' key if 'files' is not present
            single_file = request.data.get('file')
            if single_file:
                files = [single_file]
            else:
                return Response({"error": "No files provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            all_chunks = []
            for file_obj in files:
                # 1. Extract Text from each file
                chunks = extract_text_from_pdf(file_obj)
                if chunks:
                    all_chunks.extend(chunks)
            
            if not all_chunks:
                 return Response({"error": "Could not extract text from any of the PDFs"}, status=status.HTTP_400_BAD_REQUEST)

            # 2. Summarize the combined chunks
            summary_json_str = summarize_medical_chunks(all_chunks)
            
            try:
                summary_data = json.loads(summary_json_str)
            except json.JSONDecodeError:
                summary_data = {"raw_summary": summary_json_str, "note": "LLM did not return strict JSON"}

            return Response(summary_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
