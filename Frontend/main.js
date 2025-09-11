// Wait until the entire HTML document is loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
  
  // --- DOM Element Selections ---
  // FAQ
  const faqQuestions = document.querySelectorAll(".faq-question");

  // Drag & Drop Upload
  const dropArea = document.getElementById("drop-area");
  const fileElem = document.getElementById("fileElem");
  
  // Results Display
  const resultsArea = document.getElementById("results-area");
  const riskSummaryText = document.getElementById("risk-summary-text");
  const highlightedPdfLink = document.getElementById("highlighted-pdf-link");
  const summaryPdfLink = document.getElementById("summary-pdf-link");

  // Camera Scan
  const scanNowBtn = document.getElementById("scanNowBtn");
  const scanInput = document.getElementById("scanInput");
  const cameraModal = document.getElementById("cameraModal");
  const closeCameraBtn = document.getElementById("closeCamera");
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const captureBtn = document.getElementById("captureBtn");
  const retakeBtn = document.getElementById("retakeBtn");
  const saveBtn = document.getElementById("saveBtn");
  const scanResultMsg = document.getElementById("scanResultMsg");

  // Auth Modal
  const authModal = document.getElementById("authModal");
  const signInShow = document.getElementById("signInShow");
  const signUpShow = document.getElementById("signUpShow");
  const closeAuth = document.getElementById("closeAuth");
  const authTitle = document.getElementById("authTitle");
  const authForm = document.getElementById("authForm");
  const switchAuthMode = document.getElementById("switchAuthMode");
  const signUpLink = document.getElementById("signUpLink");
  const btnGoogle = document.querySelector(".btn-google");
  const btnPhone = document.querySelector(".btn-phone");

  // --- Global Variables ---
  let stream; // For the camera stream

  // --- Functions ---

  function handleFiles(files) {
    const file = files[0];
    if (!file) return;

    // Show a loading state
    if (dropArea) dropArea.innerHTML = `<p class="upload-desc">⏳ Analyzing, please wait...</p>`;
    if (resultsArea) resultsArea.style.display = "none";

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          if (riskSummaryText) {
            riskSummaryText.innerText = 
              `High Risk: ${data.risk_summary.red} clauses\n` +
              `Moderate Risk: ${data.risk_summary.yellow} clauses\n` +
              `Safe: ${data.risk_summary.green} clauses`;
          }
          if (highlightedPdfLink) highlightedPdfLink.href = data.highlighted_pdf;
          if (summaryPdfLink) summaryPdfLink.href = data.summary_pdf;
          
          if (resultsArea) resultsArea.style.display = "block";
          if (dropArea) dropArea.innerHTML = `<p class="upload-desc">✅ Analysis complete. Upload another file.</p>`;
        } else {
          alert("❌ Analysis Error: " + data.error);
          if (dropArea) dropArea.innerHTML = `<p class="upload-desc">❌ Error. Please try again.</p>`;
        }
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        alert("⚠️ Upload failed: " + (err.error || err.message));
        if (dropArea) dropArea.innerHTML = `<p class="upload-desc">⚠️ Upload failed. Check connection.</p>`;
      });
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (video) video.srcObject = null;
  }

  function openCameraModal() {
    if (!cameraModal || !video || !canvas) return;
    cameraModal.style.display = "flex";
    if (scanResultMsg) scanResultMsg.innerText = "";
    canvas.style.display = "none";
    video.style.display = "block";
    if (captureBtn) captureBtn.style.display = "inline-block";
    if (retakeBtn) retakeBtn.style.display = "none";
    if (saveBtn) saveBtn.style.display = "none";

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        video.srcObject = s;
        video.play();
      })
      .catch((err) => {
        if (scanResultMsg) {
            scanResultMsg.style.color = "red";
            scanResultMsg.innerText = "Error accessing camera: " + err.message;
        }
        if (captureBtn) captureBtn.style.display = "none";
      });
  }
  
  function showAuthForm(mode) {
    if (!authModal) return;
    authModal.style.display = "flex";
    if (mode === "signIn") {
      if (authTitle) authTitle.innerText = "Sign In";
      if (switchAuthMode) switchAuthMode.innerHTML = 'New user? <a href="#" id="signUpLink">Sign Up</a>';
    } else {
      if (authTitle) authTitle.innerText = "Sign Up";
      if (switchAuthMode) switchAuthMode.innerHTML = 'Already have an account? <a href="#">Sign In</a>';
    }
  }

  function addRippleEffect(btn) {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      let rect = btn.getBoundingClientRect();
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
      ripple.style.left = (e.clientX - rect.left - rect.width / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - rect.height / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  // --- Event Listeners ---

  // FAQ Accordion
  if (faqQuestions) {
    faqQuestions.forEach(function (q) {
      q.addEventListener("click", function () {
        const ans = this.nextElementSibling;
        const isVisible = ans.style.display === "block";
        document.querySelectorAll(".faq-answer").forEach((a) => (a.style.display = "none"));
        ans.style.display = isVisible ? "none" : "block";
      });
    });
  }

  // Drag & Drop Upload
  if (dropArea && fileElem) {
    dropArea.addEventListener("click", () => fileElem.click());
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        if (eventName === 'dragenter' || eventName === 'dragover') {
            dropArea.classList.add("drag-active");
        } else {
            dropArea.classList.remove("drag-active");
        }
      }, false);
    });
    dropArea.addEventListener("drop", (e) => handleFiles(e.dataTransfer.files));
    fileElem.addEventListener("change", () => handleFiles(fileElem.files));
  }

  // Camera Scan Logic
  if (scanNowBtn) {
    scanNowBtn.addEventListener("click", () => {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        if (isMobile && scanInput) {
            scanInput.click();
        } else {
            openCameraModal();
        }
    });
  }
  if (scanInput) {
    scanInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) alert(`Scanned file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        scanInput.value = "";
    });
  }
  if (closeCameraBtn) closeCameraBtn.addEventListener("click", () => {
    stopCamera();
    if (cameraModal) cameraModal.style.display = "none";
  });
  if (captureBtn) captureBtn.addEventListener("click", () => {
    if (!canvas || !video) return;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
    video.style.display = "none";
    captureBtn.style.display = "none";
    if (retakeBtn) retakeBtn.style.display = "inline-block";
    if (saveBtn) saveBtn.style.display = "inline-block";
    if (scanResultMsg) scanResultMsg.innerText = "";
  });
  if (retakeBtn) retakeBtn.addEventListener("click", () => {
    if (scanResultMsg) scanResultMsg.innerText = "";
    if (canvas) canvas.style.display = "none";
    if (video) video.style.display = "block";
    if (captureBtn) captureBtn.style.display = "inline-block";
    retakeBtn.style.display = "none";
    if (saveBtn) saveBtn.style.display = "none";
  });
  if (saveBtn) saveBtn.addEventListener("click", () => {
    if (!canvas) return;
    canvas.toBlob((blob) => {
        if (!blob) {
            if(scanResultMsg) {
                scanResultMsg.style.color = "red";
                scanResultMsg.innerText = "Could not save scan.";
            }
            return;
        }
        alert(`Scanned image saved. Size: ${(blob.size / 1024).toFixed(2)} KB`);
        stopCamera();
        if (cameraModal) cameraModal.style.display = "none";
    }, "image/jpeg", 0.95);
  });

  // Auth Modal Logic
  if (signInShow) signInShow.onclick = () => showAuthForm("signIn");
  if (signUpShow) signUpShow.onclick = () => showAuthForm("signUp");
  if (closeAuth) closeAuth.onclick = () => (authModal.style.display = "none");
  if (switchAuthMode) switchAuthMode.onclick = () => authTitle.innerText === "Sign In" ? showAuthForm("signUp") : showAuthForm("signIn");
  if (signUpLink) signUpLink.addEventListener("click", (e) => {
    e.preventDefault();
    showAuthForm("signUp");
  });
  if (authForm) authForm.onsubmit = function (e) {
    e.preventDefault();
    alert("Auth action successful (mock)!");
    authModal.style.display = "none";
  };
  if(btnGoogle) btnGoogle.onclick = () => alert("Google Sign In/Up (mock - integrate real API for production!)");
  if(btnPhone) btnPhone.onclick = () => alert("Phone OTP Sign In/Up (mock - integrate real API for production!)");

  // Add Ripple Effect to buttons
  document.querySelectorAll('.nav-btn, .modal-action-btn, .btn-google, .btn-phone, .get-started-btn, .scan-circular-btn').forEach(addRippleEffect);

});