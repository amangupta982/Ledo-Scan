// compare.js

// State - we will store the full file object now
let file1_obj = null;
let file2_obj = null;

// === EVENT LISTENERS (DOM ready) ===
document.addEventListener('DOMContentLoaded', () => {
    // File inputs
    const fileInput1 = document.getElementById('file1');
    const fileInput2 = document.getElementById('file2');
    fileInput1.addEventListener('change', (e) => handleFileSelect(e, 1));
    fileInput2.addEventListener('change', (e) => handleFileSelect(e, 2));

    // Upload buttons
    document.querySelector('[data-upload="1"]').addEventListener('click', () => fileInput1.click());
    document.querySelector('[data-upload="2"]').addEventListener('click', () => fileInput2.click());

    // Drag & drop
    setupDropzone('drop1', 1);
    setupDropzone('drop2', 2);

    // Compare button
    document.getElementById('compareBtn').addEventListener('click', compareNow);
    
    // Re-compare button
    document.getElementById('recompareBtn').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
// Camera modal for any [data-scan] button that also wants camera capture
document.querySelectorAll('[data-scan]').forEach(btn => {
  btn.addEventListener('click', function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          // Create modal container
          let modal = document.createElement('div');
          modal.style.position = 'fixed';
          modal.style.top = '50%';
          modal.style.left = '50%';
          modal.style.transform = 'translate(-50%, -50%)';
          modal.style.background = 'var(--surface)';
          modal.style.padding = '20px';
          modal.style.borderRadius = '16px';
          modal.style.boxShadow = '0 10px 36px rgba(0,0,0,0.15)';
          modal.style.zIndex = 10000;
          modal.style.textAlign = 'center';

          // Create video element for live camera feed
          let video = document.createElement('video');
          video.autoplay = true;
          video.srcObject = stream;
          video.style.width = '320px';
          video.style.borderRadius = '10px';
          modal.appendChild(video);

          // Create canvas for captured image, hidden initially
          let canvas = document.createElement('canvas');
          canvas.style.display = 'none';
          canvas.style.borderRadius = '10px';
          modal.appendChild(canvas);

          // Create controls container
          let controls = document.createElement('div');
          controls.style.marginTop = '15px';
          modal.appendChild(controls);

          // Capture button
          let captureBtn = document.createElement('button');
          captureBtn.textContent = 'Capture';
          styleButton(captureBtn);
          controls.appendChild(captureBtn);

          // Retake button
          let retakeBtn = document.createElement('button');
          retakeBtn.textContent = 'Retake';
          styleButton(retakeBtn);
          retakeBtn.style.display = 'none';
          controls.appendChild(retakeBtn);

          // Save button
          let saveBtn = document.createElement('button');
          saveBtn.textContent = 'Save Image';
          styleButton(saveBtn);
          saveBtn.style.display = 'none';
          controls.appendChild(saveBtn);

          // Close button
          let closeBtn = document.createElement('button');
          closeBtn.textContent = 'Close Camera';
          styleButton(closeBtn);
          controls.appendChild(closeBtn);

          // Capture click event
          captureBtn.onclick = () => {
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 240;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            video.style.display = 'none';
            canvas.style.display = 'block';
            captureBtn.style.display = 'none';
            retakeBtn.style.display = 'inline-block';
            saveBtn.style.display = 'inline-block';
          };

          // Retake click event
          retakeBtn.onclick = () => {
            video.style.display = 'block';
            canvas.style.display = 'none';
            captureBtn.style.display = 'inline-block';
            retakeBtn.style.display = 'none';
            saveBtn.style.display = 'none';
          };

          // Save click event
          saveBtn.onclick = () => {
            canvas.toBlob(blob => {
              if (!blob) {
                alert('Could not save image.');
                return;
              }
              alert(`Image captured! Size: ${Math.round(blob.size / 1024)} KB`);
              // Add your custom save/upload logic here if needed
              closeBtn.click();
            }, 'image/jpeg', 0.95);
          };

          // Close click event
          closeBtn.onclick = () => {
            try { stream.getTracks().forEach(track => track.stop()); } catch(e){}
            if (document.body.contains(modal)) document.body.removeChild(modal);
          };

          // Add modal to the page
          document.body.appendChild(modal);
          

          // Helper to style buttons uniformly
          function styleButton(button) {
            button.style.margin = '0 8px 10px 8px';
            button.style.padding = '10px 16px';
            button.style.borderRadius = '12px';
            button.style.border = 'none';
            button.style.background = 'var(--primary)';
            button.style.color = 'white';
            button.style.cursor = 'pointer';
            button.style.fontWeight = '600';
            button.style.fontSize = '1rem';
          }
        })
        .catch(err => {
          alert('Could not access the camera: ' + (err && err.message ? err.message : err));
        });
    } else {
      alert('Camera access is not supported by your browser.');
    }
  });
});

// === FILE HANDLING ===
function handleFileSelect(event, which) {
    const file = event.target.files?.[0];
    if (!file) return;
    updateFileState(file, which);
}

function updateFileState(file, which) {
    if (which === 1) {
        file1_obj = file;
    } else {
        file2_obj = file;
    }
    const metaEl = document.getElementById(`meta${which}`);
    if (metaEl) metaEl.textContent = `${file.name} • ${(file.size/1024).toFixed(1)} KB`;
}

function setupDropzone(id, which) {
    const dz = document.getElementById(id);
    if (!dz) return;
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evName => {
        dz.addEventListener(evName, e => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    dz.addEventListener('dragover', () => dz.classList.add('dragover'));
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', (e) => {
        dz.classList.remove('dragover');
        const file = e.dataTransfer?.files?.[0];
        if (file) updateFileState(file, which);
    });
}


// === API CALL & DISPLAY LOGIC ===
async function compareNow() {
    if (!file1_obj || !file2_obj) {
        alert('Please select two documents to compare.');
        return;
    }

    const compareBtn = document.getElementById('compareBtn');
    const resultsSection = document.getElementById('results');
    const summaryCard = document.getElementById('summaryCard');

    // **Enhancement: Add loading state**
    const originalBtnText = compareBtn.innerHTML;
    compareBtn.disabled = true;
    compareBtn.innerHTML = `<span class="spinner"></span> Comparing...`;
    resultsSection.classList.add('hidden'); // Hide old results

    const formData = new FormData();
    formData.append('file1', file1_obj);
    formData.append('file2', file2_obj);

    try {
        const response = await fetch('/compare', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server error');
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        alert(`An error occurred: ${error.message}`);
        summaryCard.innerHTML = `<p style="color:var(--removed);">Error: ${error.message}</p>`;
        resultsSection.classList.remove('hidden');
    } finally {
        // Restore button after completion or error
        compareBtn.disabled = false;
        compareBtn.innerHTML = originalBtnText;
    }
}

function displayResults(data) {
    const resultsSection = document.getElementById('results');

    // Clear previous results
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    
    // Hide default previews, we will show a table instead
    document.querySelector('.preview-grid').style.display = 'none';
    
    // Populate summary card
    const summaryCard = document.getElementById('summaryCard');
    summaryCard.innerHTML = `
        <div class="summary-head">
          <h3>🏆 Comparison Result</h3>
          <div class="score">
            <span>${data.best_choice}</span>
            <small>Recommended</small>
          </div>
        </div>
        <p class="reasoning">${data.reasoning}</p>
        
        <div class="advantages-grid">
            <div class="advantages-col">
                <h4>Advantages of ${data.filename_a}</h4>
                <ul>${data.advantages_a.map(adv => `<li>${adv}</li>`).join('')}</ul>
            </div>
            <div class="advantages-col">
                <h4>Advantages of ${data.filename_b}</h4>
                <ul>${data.advantages_b.map(adv => `<li>${adv}</li>`).join('')}</ul>
            </div>
        </div>
        
        <div class="summary-actions">
          <button id="downloadBtn" class="btn btn-secondary" type="button" style="display:none;">Download Report (PDF)</button>
          <button id="recompareBtn" class="btn ghost" type="button">Compare New Files</button>
        </div>
    `;

    // Create and inject the comparison table
    let tableHTML = `
        <h2 class="section-title">Clause-by-Clause Comparison</h2>
        <div class="comparison-table-wrapper">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Aspect / Clause</th>
                        <th>${data.filename_a}</th>
                        <th>${data.filename_b}</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.comparison_table.map(row => `
                        <tr>
                            <td data-label="Aspect">${row.aspect}</td>
                            <td data-label="${data.filename_a}">${row.document_a}</td>
                            <td data-label="${data.filename_b}">${row.document_b}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    // Insert table before the summary card
    summaryCard.insertAdjacentHTML('beforebegin', tableHTML);

    // Show results and scroll to them
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Re-attach listener for the new "recompare" button
    summaryCard.querySelector('#recompareBtn').addEventListener('click', () => {
        window.location.reload(); // Simple way to reset the page
    });
}