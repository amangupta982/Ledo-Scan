// app.js (updated for backend integration)

// State
let doc1 = { name: null, text: "" };
let doc2 = { name: null, text: "" };

// Helpers
const $ = (q) => document.querySelector(q);
const setText = (el, v) => { if (el) el.textContent = v; };

function preventDefaults(e){ e.preventDefault(); e.stopPropagation(); }
function highlightDZ(el, on){ if (el) el.classList.toggle('dragover', on); }

// Basic tokenizer (words + punctuation separators)
function tokenize(text){
  return String(text || "")
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(\s+|[.,;:!?()\[\]{}"“”'’\-–—])/g)
    .filter(Boolean);
}

// Jaccard similarity of unique words
function similarityPercent(aText, bText){
  const toWords = (t) => new Set(String(t || "").toLowerCase().match(/[a-z0-9]+/gi) || []);
  const A = toWords(aText), B = toWords(bText);
  const inter = new Set([...A].filter(x => B.has(x)));
  const union = new Set([...A, ...B]);
  return union.size ? Math.round((inter.size / union.size) * 100) : 100;
}

// Very lightweight diff: mark tokens as added/removed; mark "modified" when same token exists but moved significantly
function diffMarkup(aText, bText){
  const a = tokenize(aText);
  const b = tokenize(bText);

  const aIndex = new Map();
  a.forEach((tok, i) => { if(!aIndex.has(tok)) aIndex.set(tok, []); aIndex.get(tok).push(i); });

  const bIndex = new Map();
  b.forEach((tok, i) => { if(!bIndex.has(tok)) bIndex.set(tok, []); bIndex.get(tok).push(i); });

  function minDistance(arrA, arrB){
    if (!Array.isArray(arrA) || !Array.isArray(arrB)) return Infinity;
    let min = Infinity;
    for (let ia of arrA) {
      for (let ib of arrB) {
        const d = Math.abs(ia - ib);
        if (d < min) min = d;
      }
    }
    return min;
  }

  const aHtml = a.map((tok, i) => {
    if (!bIndex.has(tok)) return `<span class="removed">${escapeHtml(tok)}</span>`;
    const moved = minDistance([i], bIndex.get(tok)) > 5;
    return moved ? `<span class="modified">${escapeHtml(tok)}</span>` : escapeHtml(tok);
  }).join('');

  const bHtml = b.map((tok, i) => {
    if (!aIndex.has(tok)) return `<span class="added">${escapeHtml(tok)}</span>`;
    const moved = minDistance(aIndex.get(tok), [i]) > 5;
    return moved ? `<span class="modified">${escapeHtml(tok)}</span>` : escapeHtml(tok);
  }).join('');

  const removed = a.filter(t => !bIndex.has(t)).slice(0,6);
  const added = b.filter(t => !aIndex.has(t)).slice(0,6);
  const modified = [];
  a.forEach((tok, i) => {
    if (bIndex.has(tok)) {
      if (minDistance([i], bIndex.get(tok)) > 5) modified.push(tok);
    }
  });

  const bullets = [
    `${added.length} additions detected`,
    `${removed.length} removals detected`,
    `${modified.slice(0,6).length} potential modifications`
  ];

  return {
    aHtml, bHtml,
    bullets,
    samples: { added, removed, modified: modified.slice(0,6) }
  };
}

function escapeHtml(s){
  return String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

// UI Wiring
function init(){
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('show');
  });

  document.querySelectorAll('[data-upload]').forEach(btn => {
    btn.addEventListener('click', () => {
      const which = btn.getAttribute('data-upload');
      document.getElementById(`file${which}`).click();
    });
  });

  ['1','2'].forEach(n => {
    const input = document.getElementById(`file${n}`);
    if (!input) return;
    input.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await readFileToState(file, n);
      const metaEl = document.getElementById(`meta${n}`);
      if (metaEl) metaEl.textContent = `${file.name} • ${(file.size/1024).toFixed(1)} KB`;
    });
  });

  document.querySelectorAll('[data-scan]').forEach(btn => {
    btn.addEventListener('click', () => {
      const n = btn.getAttribute('data-scan');
      const sample = sampleText(parseInt(n,10));
      const name = `Scanned_${n}.txt`;
      if (n === '1'){
        doc1 = { name, text: sample };
        setText(document.getElementById('meta1'), `${name} • simulated`);
      } else {
        doc2 = { name, text: sample };
        setText(document.getElementById('meta2'), `${name} • simulated`);
      }
    });
  });

  setupDropzone('drop1', 1);
  setupDropzone('drop2', 2);

  const compareBtn = document.getElementById('compareBtn');
  compareBtn?.addEventListener('click', compareNow);

  document.getElementById('downloadBtn')?.addEventListener('click', downloadReport);
  document.getElementById('recompareBtn')?.addEventListener('click', resetResults);

  setupTheme();
}

function setupDropzone(id, which){
  const dz = document.getElementById(id);
  if (!dz) return;
  ['dragenter','dragover','dragleave','drop'].forEach(ev => {
    dz.addEventListener(ev, preventDefaults, false);
  });
  dz.addEventListener('dragover', () => highlightDZ(dz, true));
  dz.addEventListener('dragleave', () => highlightDZ(dz, false));
  dz.addEventListener('drop', async (e) => {
    highlightDZ(dz, false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    await readFileToState(file, which);
    const metaEl = document.getElementById(`meta${which}`);
    if (metaEl) metaEl.textContent = `${file.name} • ${(file.size/1024).toFixed(1)} KB`;
  });
}

async function readFileToState(file, which){
  let text;
  if (typeof file.text === 'function') {
    text = await file.text();
  } else {
    text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
  if (which === 1 || which === '1') {
    doc1 = { name: file.name, file };
  } else {
    doc2 = { name: file.name, file };
  }
}

function sampleText(which){
  const base = "LedoCompare helps teams review documents quickly and accurately with instant highlights and clear summaries.";
  if (which === 1) {
    return base + " It focuses on reliability and an intuitive interface.";
  } else {
    return "LedoCompare enables teams to review files rapidly and precisely with instant highlights and concise summaries. It emphasizes performance and a simple, modern interface.";
  }
}

// ✅ Updated compareNow function (backend integration)
async function compareNow(){
  if (!doc1.file || !doc2.file) {
    alert("Please upload both PDF documents before comparing.");
    return;
  }

  const compareBtn = document.getElementById('compareBtn');
  compareBtn.disabled = true;
  compareBtn.textContent = "Comparing...";

  try {
    const formData = new FormData();
    formData.append("doc1", doc1.file, doc1.file.name);
    formData.append("doc2", doc2.file, doc2.file.name);

    const response = await fetch("http://127.0.0.1:8000/compare", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Server error: ${response.status} – ${msg}`);
    }

    const result = await response.json();
    displayComparison(result);

  } catch (error) {
    alert("Failed to compare documents: " + error.message);
    console.error(error);
  } finally {
    compareBtn.disabled = false;
    compareBtn.textContent = "Compare Documents Now";
  }
}
// ✅ New displayComparison function
function displayComparison(result){
  const similarityEl = document.getElementById('similarity');
  const preview1 = document.getElementById('preview1');
  const preview2 = document.getElementById('preview2');
  const ul = document.getElementById('keyDiffs');
  const suggestedEl = document.getElementById('suggestedDoc');
  const resultsEl = document.getElementById('results');

  preview1.innerHTML = "";
  preview2.innerHTML = "";
  ul.innerHTML = "";

  const table = result.comparison_table || {};

  for (const key in table) {
    const item = table[key];

    const li = document.createElement('li');
    li.innerHTML = `<strong>${capitalize(key)}:</strong> Better choice: ${item.better_choice || 'N/A'}`;
    ul.appendChild(li);

    const value1 = item.value_doc1 || "Not provided.";
    const value2 = item.value_doc2 || "Not provided.";

    const section = document.createElement('div');
    section.innerHTML = `
      <h3>${capitalize(key)}</h3>
      <div style="display: flex; gap: 10px;">
        <div style="flex: 1; border: 1px solid #ddd; padding: 10px; border-radius: 8px;">
          <strong>Document 1:</strong><br>${escapeHtml(value1)}
        </div>
        <div style="flex: 1; border: 1px solid #ddd; padding: 10px; border-radius: 8px;">
          <strong>Document 2:</strong><br>${escapeHtml(value2)}
        </div>
      </div>
    `;
    preview1.appendChild(section.cloneNode(true));
    preview2.appendChild(section.cloneNode(true));
  }

  similarityEl.textContent = "Comparison Complete";
  suggestedEl.textContent = result.final_recommendation || "—";
  resultsEl.classList.remove('hidden');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(s){
  return String(s || '').replace(/[&<>"']/g, function(c){
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c];
  });
}

function resetResults(){
  const resultsEl = document.getElementById('results');
  if (resultsEl) resultsEl.classList.add('hidden');
  const preview1 = document.getElementById('preview1');
  const preview2 = document.getElementById('preview2');
  if (preview1) preview1.innerHTML = '';
  if (preview2) preview2.innerHTML = '';
  const ul = document.getElementById('keyDiffs');
  if (ul) ul.innerHTML = '';
  const similarityEl = document.getElementById('similarity');
  if (similarityEl) similarityEl.textContent = '0%';
  const suggestedEl = document.getElementById('suggestedDoc');
  if (suggestedEl) suggestedEl.textContent = '—';
}

function downloadReport(){
  const sim = document.getElementById('similarity')?.textContent || '0%';
  const diffs = [...document.querySelectorAll('#keyDiffs li')].map(li => li.textContent || '');

  const style = `
    <style>
      body{font-family:Arial,Helvetica,sans-serif; padding:24px}
      h1{margin:0 0 6px}
      h2{margin:18px 0 8px}
      .muted{color:#555}
      .code{white-space:pre-wrap; border:1px solid #ddd; padding:12px; border-radius:8px}
      .added{background:#e8f7ee; color:#0a6c2d; padding:0 2px}
      .removed{text-decoration:line-through; background:#fde8e8; color:#9b1c1c; padding:0 2px}
      .modified{background:#fff6db; color:#7a5200; padding:0 2px}
    </style>
  `;
  const html = `
    <html><head><meta charset="utf-8"><title>Document Compare Report</title>${style}</head><body>
    <h1>Document Compare Report</h1>
    <div class="muted">Generated by LedoCompare</div>
    <h2>Similarity</h2>
    <p><strong>${escapeHtml(sim)}</strong></p>
    <h2>Key Differences</h2>
    <ul>${diffs.map(d=>`<li>${escapeHtml(d)}</li>`).join('')}</ul>
    <h2>Preview (Doc 1)</h2>
    <div class="code">${document.getElementById('preview1')?.innerHTML || ''}</div>
    <h2>Preview (Doc 2)</h2>
    <div class="code">${document.getElementById('preview2')?.innerHTML || ''}</div>
    <script>window.onload = () => { try { window.print(); } catch(e) {} };</script>
    </body></html>
  `;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win || win.closed) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compare-report.html';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    return;
  }
  win.document.write(html);
  win.document.close();
}

function setupTheme(){
  const toggle = document.getElementById('themeToggle');
  const key = 'doc-compare-theme';
  const saved = localStorage.getItem(key);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initial = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initial);
  if (toggle) toggle.checked = initial === 'dark';

  toggle?.addEventListener('change', () => {
    const mode = toggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(key, mode);
  });
}

// Init
document.addEventListener('DOMContentLoaded', init);

// Camera modal for any [data-scan] button that also wants camera capture
document.querySelectorAll('[data-scan]').forEach(btn => {
  btn.addEventListener('click', function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
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

          let video = document.createElement('video');
          video.autoplay = true;
          video.srcObject = stream;
          video.style.width = '320px';
          video.style.borderRadius = '10px';
          modal.appendChild(video);

          let canvas = document.createElement('canvas');
          canvas.style.display = 'none';
          canvas.style.borderRadius = '10px';
          modal.appendChild(canvas);

          let controls = document.createElement('div');
          controls.style.marginTop = '15px';
          modal.appendChild(controls);

          let captureBtn = document.createElement('button');
          captureBtn.textContent = 'Capture';
          styleButton(captureBtn);
          controls.appendChild(captureBtn);

          let retakeBtn = document.createElement('button');
          retakeBtn.textContent = 'Retake';
          styleButton(retakeBtn);
          retakeBtn.style.display = 'none';
          controls.appendChild(retakeBtn);

          let saveBtn = document.createElement('button');
          saveBtn.textContent = 'Save Image';
          styleButton(saveBtn);
          saveBtn.style.display = 'none';
          controls.appendChild(saveBtn);

          let closeBtn = document.createElement('button');
          closeBtn.textContent = 'Close Camera';
          styleButton(closeBtn);
          controls.appendChild(closeBtn);

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

          retakeBtn.onclick = () => {
            video.style.display = 'block';
            canvas.style.display = 'none';
            captureBtn.style.display = 'inline-block';
            retakeBtn.style.display = 'none';
            saveBtn.style.display = 'none';
          };

          saveBtn.onclick = () => {
            canvas.toBlob(blob => {
              const file = new File([blob], `Scan_${Date.now()}.png`, { type: 'image/png' });
              const n = btn.getAttribute('data-scan');
              readFileToState(file, n);
              const metaEl = document.getElementById(`meta${n}`);
              if (metaEl) metaEl.textContent = `${file.name} • captured image`;
              closeCamera();
            }, 'image/png');
          };

          closeBtn.onclick = closeCamera;

          function closeCamera(){
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(modal);
          }

          document.body.appendChild(modal);
        })
        .catch(err => {
          alert("Camera access denied or not available.");
        });
    }
  });
});

function styleButton(btn){
  btn.style.margin = '4px';
  btn.style.padding = '8px 16px';
  btn.style.border = 'none';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';
  btn.style.background = 'var(--primary)';
  btn.style.color = 'white';
}
