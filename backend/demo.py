#!/usr/bin/env python3
"""
Demo script for Legal PDF Analyzer
==================================

This script demonstrates how to use the Legal PDF Analyzer
for hackathon presentations and testing.
"""

import os
from legal_pdf_analyzer import LegalPDFAnalyzer

def demo_analysis():
    """
    Demonstration of the PDF analysis workflow
    """
    print("🎯 Legal PDF Risk Analyzer - Demo")
    print("=" * 40)
    
    # Check if API key is configured
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("⚠️  GEMINI_API_KEY not found in environment")
        print("📝 Steps to configure:")
        print("   1. Copy .env.example to .env")
        print("   2. Add your Gemini API key to .env")
        print("   3. Get API key from: https://makersuite.google.com/app/apikey")
        return
    
    # Initialize the analyzer
    try:
        analyzer = LegalPDFAnalyzer()
        print("✅ Analyzer initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize analyzer: {e}")
        return
    
    # Look for PDF files in the current directory
    pdf_files = [f for f in os.listdir('.') if f.endswith('.pdf')]
    
    if not pdf_files:
        print("📄 No PDF files found in current directory")
        print("💡 Add a legal PDF file to test the analyzer")
        
        # Create a sample text file with instructions
        create_sample_instructions()
        return
    
    # Analyze the first PDF found
    pdf_path = pdf_files[0]
    print(f"📂 Found PDF: {pdf_path}")
    
    output_path = f"highlighted_{pdf_path}"
    
    # Run the analysis
    print("\n🚀 Starting analysis...")
    results = analyzer.analyze_legal_document(pdf_path, output_path)
    
    if results['success']:
        print("\n🎉 Analysis completed successfully!")
        print_results_summary(results)
    else:
        print(f"\n❌ Analysis failed: {results['error']}")

def print_results_summary(results):
    """Print a formatted summary of analysis results"""
    print("\n📊 ANALYSIS RESULTS")
    print("-" * 30)
    print(f"Total clauses: {results['total_clauses']}")
    print(f"🔴 High risk: {results['risk_summary']['red']}")
    print(f"🟡 Moderate risk: {results['risk_summary']['yellow']}")
    print(f"🟢 Safe: {results['risk_summary']['green']}")
    print(f"💾 Output file: {results['output_file']}")
    
    # Calculate risk percentage
    total = results['total_clauses']
    if total > 0:
        high_risk_pct = (results['risk_summary']['red'] / total) * 100
        print(f"\n📈 High risk percentage: {high_risk_pct:.1f}%")

def create_sample_instructions():
    """Create instructions for testing"""
    instructions = """
Legal PDF Analyzer - Testing Instructions
=========================================

To test this analyzer, you need:

1. A PDF file containing legal text (contracts, agreements, etc.)
2. A Gemini API key configured in .env file

Steps:
1. Place your legal PDF in this directory
2. Copy .env.example to .env
3. Add your Gemini API key to .env
4. Run: python demo.py

The analyzer will:
- Extract text from your PDF
- Classify each clause by risk level using AI
- Create a highlighted version with color coding:
  🔴 Red = High risk clauses
  🟡 Yellow = Moderate risk clauses  
  🟢 Green = Safe clauses

Perfect for hackathon demos! 🏆
"""
    
    with open('TESTING_INSTRUCTIONS.txt', 'w') as f:
        f.write(instructions)
    
    print("📝 Created TESTING_INSTRUCTIONS.txt")

if __name__ == "__main__":
    demo_analysis()