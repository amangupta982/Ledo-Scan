#!/usr/bin/env python3
"""
Legal PDF Risk Analyzer - Hackathon Project
============================================

This script analyzes legal PDF documents and highlights text based on risk classification:
- Red: Highly dangerous clauses
- Yellow: Moderate risk clauses  
- Green: Safe clauses

Author: Hackathon Team
Date: September 2025
"""

import os
import json
import re
import time
from typing import List, Dict, Tuple
from dotenv import load_dotenv

# PDF processing libraries
import pdfplumber
import fitz  # PyMuPDF

# PDF generation for summary
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors

# AI integration
import google.generativeai as genai

# Load environment variables
load_dotenv()

class LegalPDFAnalyzer:
    """Main class for analyzing and highlighting legal PDF documents"""
    
    def __init__(self, api_key: str = None):
        """
        Initialize the analyzer with Gemini API credentials
        
        Args:
            api_key (str): Gemini API key (if None, loads from environment)
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key is required. Set GEMINI_API_KEY environment variable or pass api_key parameter.")
        
        # Configure Gemini AI
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Color mapping for highlights
        self.color_map = {
            'red': (1.0, 0.0, 0.0),      # RGB for red
            'yellow': (1.0, 1.0, 0.0),   # RGB for yellow
            'green': (0.0, 1.0, 0.0)     # RGB for green
        }
    
    def extract_text(self, pdf_path: str) -> List[Dict[str, any]]:
        """
        Extract text from PDF document with position information
        
        Args:
            pdf_path (str): Path to the PDF file
            
        Returns:
            List[Dict]: List of text blocks with content and position info
        """
        print("📄 Extracting text from PDF...")
        text_blocks = []
        
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    # Extract text with bounding boxes
                    words = page.extract_words(keep_blank_chars=True)
                    
                    if not words:
                        continue
                    
                    # Group words into paragraphs/clauses
                    paragraphs = self._group_words_into_paragraphs(words)
                    
                    for para_idx, paragraph in enumerate(paragraphs):
                        if len(paragraph['text'].strip()) > 50:  # Only analyze substantial text
                            text_blocks.append({
                                'page': page_num,
                                'paragraph_id': para_idx,
                                'text': paragraph['text'],
                                'bbox': paragraph['bbox'],  # (x0, y0, x1, y1)
                                'classification': None  # Will be filled by classify_text()
                            })
            
            print(f"✅ Extracted {len(text_blocks)} text blocks from {len(pdf.pages)} pages")
            return text_blocks
            
        except Exception as e:
            print(f"❌ Error extracting text: {str(e)}")
            raise
    
    def _group_words_into_paragraphs(self, words: List[Dict]) -> List[Dict]:
        """
        Group individual words into logical paragraphs based on position
        
        Args:
            words (List[Dict]): List of word objects with position info
            
        Returns:
            List[Dict]: List of paragraph objects
        """
        if not words:
            return []
        
        paragraphs = []
        current_para = {'text': '', 'bbox': None}
        current_y = words[0]['top']
        line_height = 15  # Approximate line height threshold
        
        for word in words:
            # Check if we're on a new paragraph (significant vertical gap)
            if abs(word['top'] - current_y) > line_height * 1.5:
                # Save current paragraph if it has content
                if current_para['text'].strip():
                    paragraphs.append(current_para)
                
                # Start new paragraph
                current_para = {
                    'text': word['text'],
                    'bbox': [word['x0'], word['top'], word['x1'], word['bottom']]
                }
            else:
                # Add word to current paragraph
                current_para['text'] += ' ' + word['text']
                if current_para['bbox']:
                    # Expand bounding box
                    current_para['bbox'][0] = min(current_para['bbox'][0], word['x0'])
                    current_para['bbox'][1] = min(current_para['bbox'][1], word['top'])
                    current_para['bbox'][2] = max(current_para['bbox'][2], word['x1'])
                    current_para['bbox'][3] = max(current_para['bbox'][3], word['bottom'])
                else:
                    current_para['bbox'] = [word['x0'], word['top'], word['x1'], word['bottom']]
            
            current_y = word['top']
        
        # Don't forget the last paragraph
        if current_para['text'].strip():
            paragraphs.append(current_para)
        
        return paragraphs
    
    def classify_text(self, text_blocks: List[Dict[str, any]]) -> List[Dict[str, any]]:
        """
        Send text blocks to Gemini API for risk classification
        
        Args:
            text_blocks (List[Dict]): List of text blocks to classify
            
        Returns:
            List[Dict]: Text blocks with classification results
        """
        print("🤖 Classifying text with Gemini AI...")
        
        # Prepare the prompt for Gemini
        system_prompt = """
        You are a legal risk assessment AI. Analyze the following legal text clauses and classify each one as:
        - RED: Highly dangerous/risky clauses (severe penalties, unfair terms, major liabilities)
        - YELLOW: Moderate risk clauses (standard terms with some concerns)
        - GREEN: Safe clauses (standard, favorable, or neutral terms)
        
        Return your analysis as JSON in this exact format:
        {
            "classifications": [
                {
                    "clause_id": 0,
                    "risk_level": "RED|YELLOW|GREEN",
                    "reasoning": "Brief explanation of the classification"
                }
            ]
        }
        """
        
        for i in range(0, len(text_blocks), 5):  # Process in batches of 5
            batch = text_blocks[i:i+5]
            
            # Prepare batch prompt
            batch_prompt = system_prompt + "\n\nAnalyze these clauses:\n\n"
            for idx, block in enumerate(batch):
                batch_prompt += f"Clause {idx}: {block['text']}\n\n"
            
            try:
                print(f"📡 Processing batch {i//5 + 1}/{(len(text_blocks) + 4)//5}...")
                
                # Send to Gemini
                response = self.model.generate_content(batch_prompt)
                
                # Parse JSON response
                try:
                    # Extract JSON from response
                    response_text = response.text
                    json_start = response_text.find('{')
                    json_end = response_text.rfind('}') + 1
                    json_str = response_text[json_start:json_end]
                    
                    result = json.loads(json_str)
                    classifications = result.get('classifications', [])
                    
                    # Apply classifications to text blocks
                    for j, classification in enumerate(classifications):
                        if i + j < len(text_blocks):
                            risk_level = classification.get('risk_level', 'YELLOW').lower()
                            text_blocks[i + j]['classification'] = {
                                'risk_level': risk_level,
                                'reasoning': classification.get('reasoning', 'No reasoning provided')
                            }
                            
                except json.JSONDecodeError as e:
                    print(f"⚠️  JSON parse error for batch {i//5 + 1}: {str(e)}")
                    # Fallback: classify as yellow (moderate risk)
                    for j in range(len(batch)):
                        if i + j < len(text_blocks):
                            text_blocks[i + j]['classification'] = {
                                'risk_level': 'yellow',
                                'reasoning': 'Classification failed - defaulted to moderate risk'
                            }
                
                # Rate limiting
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ Error classifying batch {i//5 + 1}: {str(e)}")
                # Fallback classification
                for j in range(len(batch)):
                    if i + j < len(text_blocks):
                        text_blocks[i + j]['classification'] = {
                            'risk_level': 'yellow',
                            'reasoning': f'API error - defaulted to moderate risk: {str(e)}'
                        }
        
        # Print classification summary
        risk_counts = {'red': 0, 'yellow': 0, 'green': 0}
        for block in text_blocks:
            if block['classification']:
                risk_level = block['classification']['risk_level']
                risk_counts[risk_level] = risk_counts.get(risk_level, 0) + 1
        
        print(f"✅ Classification complete:")
        print(f"   🔴 Red (High Risk): {risk_counts['red']} clauses")
        print(f"   🟡 Yellow (Moderate Risk): {risk_counts['yellow']} clauses")
        print(f"   🟢 Green (Safe): {risk_counts['green']} clauses")
        
        return text_blocks
    
    def highlight_pdf(self, pdf_path: str, text_blocks: List[Dict[str, any]], output_path: str):
        """
        Create highlighted PDF based on risk classifications
        
        Args:
            pdf_path (str): Original PDF file path
            text_blocks (List[Dict]): Classified text blocks
            output_path (str): Path for the highlighted output PDF
        """
        print("🎨 Creating highlighted PDF...")
        
        try:
            # Open the PDF with PyMuPDF
            doc = fitz.open(pdf_path)
            
            # Group text blocks by page for efficient processing
            blocks_by_page = {}
            for block in text_blocks:
                page_num = block['page']
                if page_num not in blocks_by_page:
                    blocks_by_page[page_num] = []
                blocks_by_page[page_num].append(block)
            
            # Process each page
            for page_num in blocks_by_page:
                page = doc[page_num]
                
                for block in blocks_by_page[page_num]:
                    if not block['classification'] or not block['bbox']:
                        continue
                    
                    risk_level = block['classification']['risk_level']
                    if risk_level not in self.color_map:
                        continue
                    
                    # Convert bbox coordinates
                    x0, y0, x1, y1 = block['bbox']
                    rect = fitz.Rect(x0, y0, x1, y1)
                    
                    # Add highlight annotation
                    highlight = page.add_highlight_annot(rect)
                    highlight.set_colors({"stroke": self.color_map[risk_level]})
                    highlight.update()
                    
                    print(f"   📍 Page {page_num + 1}: Highlighted {risk_level} clause")
            
            # Save the highlighted PDF
            doc.save(output_path)
            doc.close()
            
            print(f"✅ Highlighted PDF saved to: {output_path}")
            
        except Exception as e:
            print(f"❌ Error highlighting PDF: {str(e)}")
            raise
    
    def generate_summary_pdf(self, text_blocks: List[Dict[str, any]], pdf_path: str, summary_output_path: str):
        """
        Generate a user-friendly summary PDF of the document analysis
        
        Args:
            text_blocks (List[Dict]): Classified text blocks
            pdf_path (str): Original PDF file path
            summary_output_path (str): Path for the summary PDF
        """
        print("📋 Generating user-friendly summary PDF...")
        
        try:
            # Get document summary from AI
            document_summary = self._generate_document_summary(text_blocks)
            
            # Create PDF document
            doc = SimpleDocTemplate(summary_output_path, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []
            
            # Custom styles
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                textColor=colors.darkblue,
                alignment=1  # Center alignment
            )
            
            header_style = ParagraphStyle(
                'CustomHeader',
                parent=styles['Heading2'],
                fontSize=16,
                spaceAfter=12,
                textColor=colors.darkgreen
            )
            
            # Title
            story.append(Paragraph("📄 Legal Document Summary", title_style))
            story.append(Spacer(1, 12))
            
            # Document info
            story.append(Paragraph("📂 Document Information", header_style))
            doc_info = f"""
            <b>Original File:</b> {os.path.basename(pdf_path)}<br/>
            <b>Analysis Date:</b> {time.strftime('%Y-%m-%d %H:%M:%S')}<br/>
            <b>Total Clauses Analyzed:</b> {len(text_blocks)}<br/>
            """
            story.append(Paragraph(doc_info, styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Risk Summary
            risk_counts = {'red': 0, 'yellow': 0, 'green': 0}
            for block in text_blocks:
                if block['classification']:
                    risk_level = block['classification']['risk_level']
                    risk_counts[risk_level] = risk_counts.get(risk_level, 0) + 1
            
            story.append(Paragraph("⚠️ Risk Analysis Summary", header_style))
            
            # Risk summary table
            risk_data = [
                ['Risk Level', 'Count', 'Percentage'],
                ['🔴 High Risk', str(risk_counts['red']), f"{(risk_counts['red']/len(text_blocks)*100):.1f}%"],
                ['🟡 Moderate Risk', str(risk_counts['yellow']), f"{(risk_counts['yellow']/len(text_blocks)*100):.1f}%"],
                ['🟢 Safe', str(risk_counts['green']), f"{(risk_counts['green']/len(text_blocks)*100):.1f}%"]
            ]
            
            risk_table = Table(risk_data, colWidths=[2*inch, 1*inch, 1*inch])
            risk_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(risk_table)
            story.append(Spacer(1, 20))
            
            # Document Summary from AI
            story.append(Paragraph("🤖 AI-Generated Summary", header_style))
            story.append(Paragraph(document_summary, styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Key Risk Areas
            high_risk_clauses = [block for block in text_blocks if block['classification'] and block['classification']['risk_level'] == 'red']
            if high_risk_clauses:
                story.append(Paragraph("🚨 High Risk Areas", header_style))
                for i, clause in enumerate(high_risk_clauses[:5], 1):  # Show top 5
                    reasoning = clause['classification']['reasoning']
                    story.append(Paragraph(f"<b>{i}.</b> {reasoning}", styles['Normal']))
                story.append(Spacer(1, 20))
            
            # Recommendations
            story.append(Paragraph("💡 Recommendations", header_style))
            recommendations = self._generate_recommendations(risk_counts, len(text_blocks))
            story.append(Paragraph(recommendations, styles['Normal']))
            
            # Build PDF
            doc.build(story)
            print(f"✅ Summary PDF saved to: {summary_output_path}")
            
        except Exception as e:
            print(f"❌ Error generating summary PDF: {str(e)}")
            raise
    
    def _generate_document_summary(self, text_blocks: List[Dict[str, any]]) -> str:
        """Generate an overall document summary using AI"""
        try:
            # Combine all text for summary
            full_text = " ".join([block['text'][:200] for block in text_blocks[:10]])  # First 10 blocks, 200 chars each
            
            summary_prompt = f"""
            Please provide a clear, simple summary of this legal document in 2-3 paragraphs that a non-lawyer can understand.
            Focus on:
            1. What type of document this is
            2. Main purpose and key terms
            3. Important obligations or rights
            
            Document text: {full_text}
            
            Write in simple, plain English avoiding legal jargon.
            """
            
            response = self.model.generate_content(summary_prompt)
            return response.text
            
        except Exception as e:
            return f"Could not generate AI summary. Error: {str(e)}"
    
    def _generate_recommendations(self, risk_counts: Dict[str, int], total_clauses: int) -> str:
        """Generate recommendations based on risk analysis"""
        high_risk_pct = (risk_counts['red'] / total_clauses * 100) if total_clauses > 0 else 0
        
        if high_risk_pct > 20:
            return """
            <b>⚠️ High Risk Document:</b> This document contains significant risk factors. 
            Strongly recommend legal review before signing. Pay special attention to highlighted red sections.
            """
        elif high_risk_pct > 5:
            return """
            <b>🟡 Moderate Risk Document:</b> This document has some areas of concern. 
            Review yellow highlighted sections carefully and consider legal consultation for red areas.
            """
        else:
            return """
            <b>✅ Low Risk Document:</b> This document appears relatively standard. 
            Still recommended to review highlighted sections and understand all terms before signing.
            """
    
    def analyze_legal_document(self, pdf_path: str, output_path: str = "highlighted_output.pdf") -> Dict[str, any]:
        """
        Complete workflow: extract, classify, and highlight legal PDF
        
        Args:
            pdf_path (str): Path to input PDF
            output_path (str): Path for highlighted output PDF
            
        Returns:
            Dict: Analysis results and statistics
        """
        print("🚀 Starting Legal PDF Analysis...")
        print(f"📂 Input PDF: {pdf_path}")
        print(f"📂 Output PDF: {output_path}")
        print("-" * 50)
        
        try:
            # Step 1: Extract text from PDF
            text_blocks = self.extract_text(pdf_path)
            
            if not text_blocks:
                print("⚠️  No text found in PDF")
                return {'success': False, 'error': 'No text extracted'}
            
            # Step 2: Classify text with Gemini AI
            classified_blocks = self.classify_text(text_blocks)
            
            # Step 3: Create highlighted PDF
            self.highlight_pdf(pdf_path, classified_blocks, output_path)
            
            # Step 4: Generate summary PDF
            summary_path = output_path.replace('.pdf', '_summary.pdf')
            self.generate_summary_pdf(classified_blocks, pdf_path, summary_path)
            
            # Generate summary report
            risk_summary = {'red': 0, 'yellow': 0, 'green': 0}
            for block in classified_blocks:
                if block['classification']:
                    risk_level = block['classification']['risk_level']
                    risk_summary[risk_level] = risk_summary.get(risk_level, 0) + 1
            
            print("\n" + "=" * 50)
            print("📊 ANALYSIS COMPLETE!")
            print("=" * 50)
            print(f"📄 Total clauses analyzed: {len(classified_blocks)}")
            print(f"🔴 High risk clauses: {risk_summary['red']}")
            print(f"🟡 Moderate risk clauses: {risk_summary['yellow']}")
            print(f"🟢 Safe clauses: {risk_summary['green']}")
            print(f"💾 Highlighted PDF: {output_path}")
            print(f"📋 Summary PDF: {summary_path}")
            
            return {
                'success': True,
                'total_clauses': len(classified_blocks),
                'risk_summary': risk_summary,
                'output_file': output_path,
                'summary_file': summary_path,
                'detailed_results': classified_blocks
            }
            
        except Exception as e:
            print(f"💥 Analysis failed: {str(e)}")
            return {'success': False, 'error': str(e)}


def main():
    """
    Demo function - shows how to use the Legal PDF Analyzer
    """
    print("🏆 Legal PDF Risk Analyzer - Hackathon Demo")
    print("=" * 50)
    
    # Example usage
    try:
        # Initialize analyzer (make sure to set GEMINI_API_KEY environment variable)
        analyzer = LegalPDFAnalyzer()
        
        # Analyze a legal PDF (replace with your PDF path)
        pdf_path = "sample_legal_document.pdf"  # Update this path
        
        if not os.path.exists(pdf_path):
            print(f"❌ PDF file not found: {pdf_path}")
            print("📝 Please place your legal PDF in the same directory and update the path")
            return
        
        # Run the complete analysis
        results = analyzer.analyze_legal_document(
            pdf_path=pdf_path,
            output_path="highlighted_legal_document.pdf"
        )
        
        if results['success']:
            print("\n🎉 SUCCESS! Your legal document has been analyzed and highlighted.")
            print(f"📁 Check the highlighted PDF: {results['output_file']}")
        else:
            print(f"\n❌ Analysis failed: {results['error']}")
            
    except ValueError as e:
        print(f"⚙️  Configuration error: {str(e)}")
        print("💡 Tip: Create a .env file with your GEMINI_API_KEY")
    except Exception as e:
        print(f"💥 Unexpected error: {str(e)}")


if __name__ == "__main__":
    main()