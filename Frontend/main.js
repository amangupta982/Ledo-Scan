document.addEventListener("DOMContentLoaded", function () {
  // --- DOM Elements ---
  const dropArea = document.getElementById("drop-area");
  const getStartedBtn = document.getElementById("getStartedBtn");
  const analysisSection = document.getElementById("analysis-results");
  const scanNowBtn = document.getElementById("scanNowBtn");
  let lastUploadedFile = null;

  // Store Original Drop Area HTML for the reset functionality
  const originalDropAreaHTML = dropArea.innerHTML;

  // --- File Handling ---
  function handleFiles(files) {
    const file = files[0];
    if (!file) {
      alert("No file provided.");
      return;
    }
    if (!file.type.startsWith("application/pdf") && !file.type.startsWith("image/")) {
      alert("Please select a valid PDF or Image file.");
      return;
    }

    lastUploadedFile = file;
    // MODIFIED: Simplified message for when a file is selected
    dropArea.innerHTML = `<p class="upload-success">"${file.name}" is ready. <br>Click "Get Started Instantly" to analyze.</p>`;
  }
  
  // --- Initial Event Listeners for Upload ---
  let fileElem = document.getElementById("fileElem");
  if (fileElem) fileElem.addEventListener("change", () => handleFiles(fileElem.files));

  if (dropArea) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.toggle("drag-active", eventName === "dragenter" || eventName === "dragover");
      });
    });
    dropArea.addEventListener("drop", e => handleFiles(e.dataTransfer.files));
  }
  
  // NEW: Function to reset the UI for a new upload
  function resetForNewUpload() {
      dropArea.innerHTML = originalDropAreaHTML;
      lastUploadedFile = null;
      analysisSection.style.display = 'none';
      
      // We must re-find the new file input element after resetting the HTML and re-attach its listener
      let newFileElem = document.getElementById("fileElem");
      if (newFileElem) {
        newFileElem.addEventListener("change", () => handleFiles(newFileElem.files));
      }
  }

  // --- Tab Switching Logic (Unchanged) ---
  const tabsContainer = analysisSection.querySelector('.tabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-button')) {
        const tabName = e.target.dataset.tab;
        
        analysisSection.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        analysisSection.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        analysisSection.querySelector(`#${tabName}-content`).classList.add('active');
      }
    });
  }

  // --- Analysis API Call (MODIFIED with new UI enhancements) ---
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      if (!lastUploadedFile) {
        alert("Please upload or scan a document before starting analysis.");
        return;
      }

      // MODIFIED: Use the new animated loader
      dropArea.innerHTML = `
        <div class="loading-container">
          <span>Analyzing your document</span>
          <div class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>`;
      
      analysisSection.style.display = 'none';

      const formData = new FormData();
      formData.append("file", lastUploadedFile);

      fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      })
      .then(response => {
        if (!response.ok) return response.json().then(err => { throw new Error(err.error) });
        return response.json();
      })
      .then(data => {
        if (data.success) {
          populateResults(data);
          analysisSection.style.display = 'block';
          
          // MODIFIED: Use the new success message with "Upload Another" button
          dropArea.innerHTML = `
            <div class="upload-success-box">
              <h4>✅ Analysis Complete!</h4>
              <p>Your results are ready below.</p>
              <button id="upload-another-btn">Upload Another Document</button>
            </div>
          `;
          // NEW: Add event listener for the new button
          document.getElementById('upload-another-btn').addEventListener('click', resetForNewUpload);

        } else {
          throw new Error(data.error);
        }
      })
      .catch(error => {
        console.error("Analysis failed:", error);
        alert(`❌ Analysis Error: ${error.message}`);
        dropArea.innerHTML = `<p class="upload-error">❌ Error occurred. Please try again.</p>`;
      });
    });
  }
  
  // --- UI Population Functions (Unchanged) ---
  function populateResults(data) { /* ... This function is unchanged ... */ }
  function populateChart(riskSummary, totalClauses) { /* ... This function is unchanged ... */ }
  function populateClauses(clauses) { /* ... This function is unchanged ... */ }
    // Full function definitions are included below for completeness
    function populateResults(data) { analysisSection.querySelector("#analysis-filename").textContent = `Analysis for: ${lastUploadedFile.name}`; analysisSection.querySelector("#highlightedPreview").src = data.highlighted_pdf; analysisSection.querySelector("#highlightedDownload").href = data.highlighted_pdf; analysisSection.querySelector("#summaryPreview").src = data.summary_pdf; analysisSection.querySelector("#summaryDownload").href = data.summary_pdf; populateChart(data.risk_summary, data.total_clauses); populateClauses(data.detailed_results); }
    function populateChart(riskSummary, totalClauses) { const chartElement = analysisSection.querySelector("#risk-chart"); const legendElement = analysisSection.querySelector("#chart-legend"); analysisSection.querySelector("#total-clauses-chart").textContent = totalClauses; const colors = { red: '#dc3545', yellow: '#ffc107', green: '#28a740' }; const labels = { red: 'High Risk', yellow: 'Moderate Risk', green: 'Safe' }; let gradientString = 'conic-gradient('; let legendHTML = ''; let currentDegree = 0; ['red', 'yellow', 'green'].forEach(key => { if (riskSummary[key] > 0) { const percentage = (riskSummary[key] / totalClauses) * 100; const nextDegree = currentDegree + (percentage * 3.6); gradientString += `${colors[key]} ${currentDegree}deg ${nextDegree}deg, `; legendHTML += `<div class="legend-item"><div class="legend-color" style="background-color: ${colors[key]};"></div><span>${labels[key]}: ${riskSummary[key]}</span></div>`; currentDegree = nextDegree; } }); gradientString = gradientString.slice(0, -2) + ')'; if (currentDegree === 0) { gradientString = 'conic-gradient(#E9ECEF 0deg 360deg)'; } chartElement.style.background = gradientString; legendElement.innerHTML = legendHTML; }
    function populateClauses(clauses) { const clauseListElement = analysisSection.querySelector("#clause-list"); if (!clauses || clauses.length === 0) { clauseListElement.innerHTML = "<p>No detailed clause analysis available.</p>"; return; } const riskStyles = { red: { label: 'High Risk', color: '#dc3545' }, yellow: { label: 'Moderate Risk', color: '#ffc107' }, green: { label: 'Safe', color: '#28a740' } }; let clausesHTML = clauses.map((clause, index) => { const riskLevel = clause.classification?.risk_level || 'yellow'; const style = riskStyles[riskLevel]; const reasoning = clause.classification?.reasoning || clause.text; return `<div class="clause-item"><div class="clause-header">Clause ${index + 1}<span class="risk-tag" style="background-color:${style.color};">${style.label}</span></div><p class="clause-text">${reasoning}</p></div>`; }).join(''); clauseListElement.innerHTML = clausesHTML; }

  // --- Camera Functionality (Unchanged) ---
  if (scanNowBtn) {
    scanNowBtn.addEventListener('click', openCameraModal);
  }
  function openCameraModal() { /* ... This function is unchanged ... */ }
    // Full function definition is included below for completeness
    function openCameraModal() { if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { alert("Camera API is not supported by your browser."); return; } const modalOverlay = document.createElement('div'); modalOverlay.className = 'camera-modal-overlay'; modalOverlay.innerHTML = `<div class="camera-modal-content"><h3>Scan Document</h3><video id="camera-view" autoplay playsinline></video><canvas id="capture-canvas"></canvas><div class="camera-controls"><button class="camera-btn capture-btn">Capture</button><button class="camera-btn retake-btn">Retake</button><button class="camera-btn save-btn">Save</button><button class="camera-btn close-btn">Close</button></div></div>`; document.body.appendChild(modalOverlay); const video = document.getElementById('camera-view'); const canvas = document.getElementById('capture-canvas'); const captureBtn = modalOverlay.querySelector('.capture-btn'); const retakeBtn = modalOverlay.querySelector('.retake-btn'); const saveBtn = modalOverlay.querySelector('.save-btn'); const closeBtn = modalOverlay.querySelector('.close-btn'); let stream = null; navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(s => { stream = s; video.srcObject = stream; modalOverlay.classList.add('visible'); }).catch(err => { console.error("Camera Error:", err); alert("Could not access the camera. Please ensure you have given permission."); document.body.removeChild(modalOverlay); }); const closeModal = () => { if (stream) { stream.getTracks().forEach(track => track.stop()); } document.body.removeChild(modalOverlay); }; captureBtn.addEventListener('click', () => { canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height); video.style.display = 'none'; canvas.style.display = 'block'; captureBtn.style.display = 'none'; retakeBtn.style.display = 'inline-block'; saveBtn.style.display = 'inline-block'; }); retakeBtn.addEventListener('click', () => { video.style.display = 'block'; canvas.style.display = 'none'; captureBtn.style.display = 'inline-block'; retakeBtn.style.display = 'none'; saveBtn.style.display = 'none'; }); saveBtn.addEventListener('click', () => { canvas.toBlob(blob => { const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); const fileName = `scan_${timestamp}.jpeg`; const scannedFile = new File([blob], fileName, { type: 'image/jpeg' }); handleFiles([scannedFile]); closeModal(); }, 'image/jpeg', 0.9); }); closeBtn.addEventListener('click', closeModal); }


  // ==========================================================
  // --- NEW: AUTHENTICATION MODAL LOGIC ---
  // ==========================================================
  const signInShowBtn = document.getElementById('signInShow');
  const signUpShowBtn = document.getElementById('signUpShow');
  
  const signInModal = document.getElementById('signInModal');
  const signUpModal = document.getElementById('signUpModal');

  const switchToSignUpLink = document.getElementById('switchToSignUp');
  const switchToSignInLink = document.getElementById('switchToSignIn');

  // Function to close all modals
  const closeAllModals = () => {
    document.querySelectorAll('.auth-modal-overlay').forEach(modal => {
      modal.classList.remove('visible');
    });
  };

  // Open Sign In Modal
  if (signInShowBtn) {
    signInShowBtn.addEventListener('click', () => {
      closeAllModals();
      if (signInModal) signInModal.classList.add('visible');
    });
  }

  // Open Sign Up Modal
  if (signUpShowBtn) {
    signUpShowBtn.addEventListener('click', () => {
      closeAllModals();
      if (signUpModal) signUpModal.classList.add('visible');
    });
  }
  
  // Switch from Sign In to Sign Up
  if (switchToSignUpLink) {
    switchToSignUpLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
      if (signUpModal) signUpModal.classList.add('visible');
    });
  }

  // Switch from Sign Up to Sign In
  if (switchToSignInLink) {
    switchToSignInLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
      if (signInModal) signInModal.classList.add('visible');
    });
  }

  // Add close functionality to all modals
  document.querySelectorAll('.auth-modal-overlay').forEach(modal => {
    const closeBtn = modal.querySelector('.close-btn');
    
    // Close with the 'x' button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeAllModals);
    }
    
    // Close by clicking on the background overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });
});