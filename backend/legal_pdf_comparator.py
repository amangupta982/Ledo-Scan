#!/usr/bin/env python3
"""
Legal PDF Comparator - Hackathon Project
=========================================

This script compares TWO legal/financial PDF documents (contracts, agreements, policies, etc.)
and provides a structured comparison:

1. Extracts text from both PDFs.
2. Sends text to Gemini API for clause-by-clause comparison.
3. Generates a summary comparison table.
4. Chooses the best document and explains why.

Author: Hackathon Team
Date: September 2025
"""

import os
import json
import time
from typing import Dict, List
from dotenv import load_dotenv

# PDF processing
import pdfplumber

# PDF generation
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors

# AI integration
import google.generativeai as genai

# Load environment variables
load_dotenv()


class LegalPDFComparator:
    """Main class for comparing two legal documents"""

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("Gemini API key is required. Set GEMINI_API_KEY in .env or pass api_key.")

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def extract_text(self, pdf_path: str, max_pages: int = 5) -> str:
        """
        Extract plain text from a PDF (limited to first few pages for efficiency).
        """
        text_content = []
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages[:max_pages]):
                text = page.extract_text()
                if text:
                    text_content.append(text.strip())
        return "\n".join(text_content)

    def compare_documents(self, pdf_a: str, pdf_b: str) -> Dict:
        """
        Compare two PDF documents using Gemini API.
        """
        print("📄 Extracting text from documents...")
        text_a = self.extract_text(pdf_a)
        text_b = self.extract_text(pdf_b)

        if not text_a or not text_b:
            raise ValueError("One or both PDFs contain no extractable text.")

        print("🤖 Sending documents to Gemini for comparison...")

        comparison_prompt = f"""
        You are a legal and financial document comparison AI.
        Compare the following two documents and output JSON only.

        Document A:
        {text_a[:5000]}

        Document B:
        {text_b[:5000]}

        Instructions:
        1. Identify key clauses or aspects.
        2. Summarize each document's stance.
        3. Create a comparison table.
        4. List advantages of each document.
        5. Choose the best document overall and explain why.

        Output in this exact JSON format:
        {{
          "comparison_table": [
            {{"aspect": "Interest Rate", "document_a": "Fixed 8%", "document_b": "Variable 7-10%"}},
            {{"aspect": "Repayment Term", "document_a": "5 years", "document_b": "10 years"}}
          ],
          "advantages_a": ["Stable fixed interest", "Shorter repayment term"],
          "advantages_b": ["Flexible repayment", "Lower entry cost"],
          "best_choice": "Document A",
          "reasoning": "Document A offers stability and lower long-term risk."
        }}
        """

        response = self.model.generate_content(comparison_prompt)
        response_text = response.text

        try:
            json_start = response_text.find("{")
            json_end = response_text.rfind("}") + 1
            result = json.loads(response_text[json_start:json_end])
        except Exception as e:
            raise ValueError(f"Failed to parse Gemini response: {str(e)}\nResponse was:\n{response_text}")

        return result

    def generate_summary_pdf(self, comparison_result: Dict, pdf_a: str, pdf_b: str, output_path: str):
        """
        Generate a summary PDF with comparison table and recommendation.
        """
        print("📋 Generating comparison summary PDF...")

        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        # Title
        title_style = ParagraphStyle(
            "Title",
            parent=styles["Heading1"],
            fontSize=20,
            alignment=1,
            textColor=colors.darkblue,
            spaceAfter=20,
        )
        story.append(Paragraph("📑 Legal Document Comparison Summary", title_style))
        story.append(Spacer(1, 12))

        # Document Info
        story.append(Paragraph("📂 Compared Documents", styles["Heading2"]))
        story.append(Paragraph(f"<b>Document A:</b> {os.path.basename(pdf_a)}", styles["Normal"]))
        story.append(Paragraph(f"<b>Document B:</b> {os.path.basename(pdf_b)}", styles["Normal"]))
        story.append(Spacer(1, 20))

        # Comparison Table
        story.append(Paragraph("🔎 Comparison Table", styles["Heading2"]))
        table_data = [["Aspect", "Document A", "Document B"]]
        for row in comparison_result.get("comparison_table", []):
            table_data.append([row["aspect"], row["document_a"], row["document_b"]])

        table = Table(table_data, colWidths=[2*inch, 2.5*inch, 2.5*inch])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold")
        ]))
        story.append(table)
        story.append(Spacer(1, 20))

        # Advantages
        story.append(Paragraph("✅ Advantages of Document A", styles["Heading2"]))
        for adv in comparison_result.get("advantages_a", []):
            story.append(Paragraph(f"- {adv}", styles["Normal"]))
        story.append(Spacer(1, 12))

        story.append(Paragraph("✅ Advantages of Document B", styles["Heading2"]))
        for adv in comparison_result.get("advantages_b", []):
            story.append(Paragraph(f"- {adv}", styles["Normal"]))
        story.append(Spacer(1, 20))

        # Best Choice
        story.append(Paragraph("🏆 Best Choice", styles["Heading2"]))
        story.append(Paragraph(f"<b>{comparison_result.get('best_choice')}</b>", styles["Normal"]))
        story.append(Paragraph(comparison_result.get("reasoning", ""), styles["Normal"]))

        doc.build(story)
        print(f"✅ Comparison summary PDF saved: {output_path}")


def main():
    print("🏆 Legal PDF Comparator - Demo Run")
    try:
        comparator = LegalPDFComparator()

        pdf_a = "document_a.pdf"
        pdf_b = "document_b.pdf"

        if not os.path.exists(pdf_a) or not os.path.exists(pdf_b):
            print("❌ Please place two PDFs named 'document_a.pdf' and 'document_b.pdf' in the current directory.")
            return

        result = comparator.compare_documents(pdf_a, pdf_b)
        comparator.generate_summary_pdf(result, pdf_a, pdf_b, "comparison_summary.pdf")

    except Exception as e:
        print(f"💥 Error: {str(e)}")


if __name__ == "__main__":
    main()