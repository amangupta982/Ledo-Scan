# legal_pdf_comparator.py
import os
import json
from typing import Dict
from dotenv import load_dotenv

import pdfplumber
import google.generativeai as genai

# No need for reportlab here as we are sending JSON to the frontend
# All reportlab imports have been removed.

load_dotenv()

class LegalPDFComparator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required. Set GEMINI_API_KEY in .env or pass api_key.")

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash") # Using pro for higher quality legal analysis

    def extract_text(self, pdf_path: str, max_pages: int = 5) -> str:
        text_content = []
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages[:max_pages]):
                text = page.extract_text()
                if text:
                    text_content.append(text.strip())
        return "\n".join(text_content)

    def compare_documents(self, pdf_a_path: str, pdf_b_path: str) -> Dict:
        print("📄 Extracting text from documents...")
        text_a = self.extract_text(pdf_a_path)
        text_b = self.extract_text(pdf_b_path)

        if not text_a or not text_b:
            raise ValueError("One or both PDFs contain no extractable text.")

        print("🤖 Sending documents to Gemini for comparison...")
        comparison_prompt = f"""
        You are a meticulous legal and financial document comparison AI. Your audience values clarity and precision.
        Compare the two documents provided and return ONLY a single, valid JSON object. Do not include any text before or after the JSON.

        Document A:
        ---
        {text_a[:6000]}
        ---

        Document B:
        ---
        {text_b[:6000]}
        ---

        Instructions:
        1. Identify at least 4-5 key legal or financial clauses/aspects present in the documents (e.g., Liability, Termination Clause, Payment Terms, Confidentiality).
        2. For each aspect, provide a concise summary of each document's position in the comparison table.
        3. List the distinct advantages for each document.
        4. Determine which document is superior or more favorable overall and provide a clear, actionable reason.

        Your response must be in this exact JSON format:
        {{
          "comparison_table": [
            {{"aspect": "Clause Name", "document_a": "Summary of Document A's position.", "document_b": "Summary of Document B's position."}}
          ],
          "advantages_a": ["Advantage 1", "Advantage 2"],
          "advantages_b": ["Advantage 1", "Advantage 2"],
          "best_choice": "Document A",
          "reasoning": "A concise explanation of why this document is the better choice."
        }}
        """

        response = self.model.generate_content(comparison_prompt)
        
        try:
            # Clean the response to only get the JSON part
            response_text = response.text.strip()
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start != -1 and json_end != -1:
                clean_json = response_text[json_start:json_end]
                result = json.loads(clean_json)
            else:
                raise ValueError("No JSON object found in the response.")
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing Gemini response: {e}")
            print(f"Raw response was:\n{response.text}")
            raise ValueError(f"Failed to parse Gemini response.")
            
        # Add original filenames for display on the frontend
        result['filename_a'] = os.path.basename(pdf_a_path)
        result['filename_b'] = os.path.basename(pdf_b_path)

        return result