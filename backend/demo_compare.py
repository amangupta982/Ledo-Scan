#!/usr/bin/env python3
"""
Demo script for Legal PDF Comparator
====================================

Shows how to compare two PDF documents and generate
a comparison summary with Gemini AI.
"""

import os
from legal_pdf_comparator import LegalPDFComparator

def demo_comparison():
    print("🎯 Legal PDF Comparator - Demo")
    print("=" * 40)

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("⚠️ GEMINI_API_KEY not configured in environment")
        return

    try:
        comparator = LegalPDFComparator()
    except Exception as e:
        print(f"❌ Failed to initialize comparator: {e}")
        return

    pdf_a = "document_a.pdf"
    pdf_b = "document_b.pdf"

    if not (os.path.exists(pdf_a) and os.path.exists(pdf_b)):
        print("📄 Missing PDFs. Place 'document_a.pdf' and 'document_b.pdf' in this folder.")
        return

    print("🚀 Comparing documents...")
    results = comparator.compare_documents(pdf_a, pdf_b)

    if results:
        print("✅ Comparison completed.")
        comparator.generate_summary_pdf(results, pdf_a, pdf_b, "comparison_summary.pdf")

        print("\n📊 Best Choice:", results.get("best_choice"))
        print("Reason:", results.get("reasoning"))

if __name__ == "__main__":
    demo_comparison()