import os
import time
import uuid  # ### NEW CODE START ### - Added for unique temporary filenames
from flask import Flask, request, jsonify, send_from_directory, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Make sure legal_pdf_analyzer.py is in the same directory or accessible
from legal_pdf_analyzer import LegalPDFAnalyzer
# ### NEW CODE START ###
# Import the new comparator class. Make sure legal_pdf_comparator.py is in the same folder.
from legal_pdf_comparator import LegalPDFComparator
# ### NEW CODE END ###

# ========================
# App Configuration
# ========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_FOLDER = os.path.join(BASE_DIR, "../Frontend")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__, static_folder=FRONTEND_FOLDER)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Allow CORS
CORS(app, resources={r"/*": {"origins": "*"}})

ALLOWED_EXTENSIONS = {"pdf"}

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# PDF analyzer instance (Your existing code - UNCHANGED)
try:
    analyzer = LegalPDFAnalyzer()
except ValueError as e:
    print(f"CRITICAL ERROR: Failed to initialize LegalPDFAnalyzer. {e}")
    print("Please ensure your GEMINI_API_KEY is set in your .env file.")
    analyzer = None

# ========================
# Frontend Routes (Your existing code - UNCHANGED)
# ========================
@app.route("/")
def index():
    return send_from_directory(FRONTEND_FOLDER, "main.html")

@app.route("/<path:filename>")
def serve_frontend(filename):
    file_path = os.path.join(FRONTEND_FOLDER, filename)
    if os.path.isfile(file_path):
        return send_from_directory(FRONTEND_FOLDER, filename)
    else:
        # Fallback to main.html for SPA-like behavior
        return send_from_directory(FRONTEND_FOLDER, "main.html")

# ========================
# API Routes
# ========================

# --- Your existing /analyze route - UNCHANGED ---
@app.route("/analyze", methods=["POST"])
def analyze_pdf():
    if not analyzer:
        return jsonify({"success": False, "error": "Analyzer is not configured. Check server logs."}), 500

    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file provided"}), 400

    file = request.files["file"]

    if not file or file.filename == "":
        return jsonify({"success": False, "error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"success": False, "error": "Invalid file type. Only PDFs allowed"}), 400

    try:
        # Save uploaded PDF
        filename = secure_filename(file.filename)
        input_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(input_path)

        # Generate unique output filenames with timestamp
        timestamp = int(time.time())
        base_name = os.path.splitext(filename)[0]
        highlighted_name = f"{base_name}_{timestamp}_highlighted.pdf"
        summary_name = f"{base_name}_{timestamp}_summary.pdf"

        highlighted_path = os.path.join(app.config["UPLOAD_FOLDER"], highlighted_name)
        summary_path = os.path.join(app.config["UPLOAD_FOLDER"], summary_name)
        
        # We will now call the analysis steps manually to have full control
        text_blocks = analyzer.extract_text(pdf_path=input_path)
        if not text_blocks:
            return jsonify({"success": False, "error": "No text could be extracted from the PDF."}), 400
        
        classified_blocks = analyzer.classify_text(text_blocks=text_blocks)
        
        analyzer.highlight_pdf(
            pdf_path=input_path, 
            text_blocks=classified_blocks, 
            output_path=highlighted_path
        )

        analyzer.generate_summary_pdf(
            text_blocks=classified_blocks,
            pdf_path=input_path,
            summary_output_path=summary_path
        )
        
        risk_summary = {'red': 0, 'yellow': 0, 'green': 0}
        for block in classified_blocks:
            if block.get('classification'):
                risk_level = block['classification']['risk_level']
                risk_summary[risk_level] = risk_summary.get(risk_level, 0) + 1
        
        results = {
            'success': True,
            'total_clauses': len(classified_blocks),
            'risk_summary': risk_summary,
            "highlighted_pdf": url_for("serve_file", filename=highlighted_name, _external=True),
            "summary_pdf": url_for("serve_file", filename=summary_name, _external=True)
        }
        
        return jsonify(results)

    except Exception as e:
        print(f"An error occurred during analysis: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# ### NEW CODE START ###
# --- This is the new, completely separate route for the document comparison ---
@app.route("/compare", methods=["POST"])
def compare_pdfs():
    if 'file1' not in request.files or 'file2' not in request.files:
        return jsonify({"error": "Two files are required for comparison"}), 400

    file1 = request.files['file1']
    file2 = request.files['file2']

    if not file1 or not file2 or not allowed_file(file1.filename) or not allowed_file(file2.filename):
        return jsonify({"error": "Two valid PDF files are required"}), 400

    # Create a temporary sub-directory for comparison files to keep them separate
    temp_compare_dir = os.path.join(app.config["UPLOAD_FOLDER"], "temp_compare")
    os.makedirs(temp_compare_dir, exist_ok=True)

    # Use unique filenames to avoid conflicts during simultaneous requests
    filename1 = str(uuid.uuid4()) + "_" + secure_filename(file1.filename)
    filename2 = str(uuid.uuid4()) + "_" + secure_filename(file2.filename)
    
    path1 = os.path.join(temp_compare_dir, filename1)
    path2 = os.path.join(temp_compare_dir, filename2)
    
    file1.save(path1)
    file2.save(path2)

    try:
        # We create the comparator instance here, only when needed
        comparator = LegalPDFComparator()
        comparison_result = comparator.compare_documents(path1, path2)
        return jsonify(comparison_result)
    except Exception as e:
        print(f"An error occurred during comparison: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        # IMPORTANT: Clean up the temporary files after the request is complete
        if os.path.exists(path1):
            os.remove(path1)
        if os.path.exists(path2):
            os.remove(path2)
# ### NEW CODE END ###


# --- Your existing /uploads/<path:filename> route - UNCHANGED ---
@app.route("/uploads/<path:filename>")
def serve_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# ========================
# Main (Your existing code - UNCHANGED)
# ========================
if __name__ == "__main__":
    app.run(debug=True, port=5000)