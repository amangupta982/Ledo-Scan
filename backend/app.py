import os
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from legal_pdf_analyzer import LegalPDFAnalyzer

# Flask app setup
app = Flask(__name__)
CORS(app)  # Allow all origins for development

# Upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Allowed extensions
ALLOWED_EXTENSIONS = {"pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# Analyzer instance (make sure GEMINI_API_KEY is set in .env)
analyzer = LegalPDFAnalyzer()

@app.route("/analyze", methods=["POST"])
def analyze_pdf():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        input_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(input_path)

        # Unique output names
        timestamp = int(time.time())
        highlighted_name = f"{os.path.splitext(filename)[0]}_{timestamp}_highlighted.pdf"
        summary_name = f"{os.path.splitext(filename)[0]}_{timestamp}_summary.pdf"

        highlighted_path = os.path.join(app.config["UPLOAD_FOLDER"], highlighted_name)
        summary_path = os.path.join(app.config["UPLOAD_FOLDER"], summary_name)

        # Run analyzer
        results = analyzer.analyze_legal_document(
            pdf_path=input_path,
            output_path=highlighted_path
        )

        if not results["success"]:
            return jsonify({"success": False, "error": results["error"]}), 500

        # Update results to include file URLs
        results.update({
            "highlighted_pdf": f"http://127.0.0.1:5000/uploads/{highlighted_name}",
            "summary_pdf": f"http://127.0.0.1:5000/uploads/{summary_name}"
        })

        return jsonify(results)

    return jsonify({"success": False, "error": "Invalid file type"}), 400

@app.route("/uploads/<path:filename>")
def serve_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

if __name__ == "__main__":
    app.run(debug=True, port=5000)