const userBtn = document.getElementById("user-btn");
const lawyerBtn = document.getElementById("lawyer-btn");
const loginSection = document.getElementById("login-section");
const loginTitle = document.getElementById("login-title");
const backBtn = document.getElementById("back-btn");
const requestFile = document.getElementById("request-file");
const fileNameDisplay = document.getElementById("file-name");

requestFile.addEventListener("change", () => {
  if (requestFile.files.length > 0) {
    fileNameDisplay.textContent = `Attached: ${requestFile.files[0].name}`;
  } else {
    fileNameDisplay.textContent = "";
  }
});

userBtn.addEventListener("click", () => {
  loginSection.classList.remove("hidden");
  loginTitle.textContent = "User Sign In";
});

lawyerBtn.addEventListener("click", () => {
  loginSection.classList.remove("hidden");
  loginTitle.textContent = "Lawyer Sign In";
});

backBtn.addEventListener("click", () => {
  loginSection.classList.add("hidden");
});
const loginForm = document.querySelector("#login-section form");
const userInterface = document.getElementById("user-interface");
const lawyerInterface = document.getElementById("lawyer-interface");
const requestMessage = document.getElementById("request-message");
const sendRequestBtn = document.getElementById("send-request");
const requestStatus = document.getElementById("request-status");
const requestsList = document.getElementById("requests-list");

let currentRole = "";

// Modify login clicks to set role
userBtn.addEventListener("click", () => {
  loginSection.classList.remove("hidden");
  loginTitle.textContent = "User Sign In";
  currentRole = "user";
});

lawyerBtn.addEventListener("click", () => {
  loginSection.classList.remove("hidden");
  loginTitle.textContent = "Lawyer Sign In";
  currentRole = "lawyer";
});

// On form submit → show respective interface
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginSection.classList.add("hidden");

  if (currentRole === "user") {
    userInterface.classList.remove("hidden");
    lawyerInterface.classList.add("hidden");
  } else if (currentRole === "lawyer") {
    lawyerInterface.classList.remove("hidden");
    userInterface.classList.add("hidden");
  }
});

// User sends request
sendRequestBtn.addEventListener("click", () => {
  const message = requestMessage.value.trim();
  const file = requestFile.files[0];

  if (message === "" && !file) {
    requestStatus.textContent = "Please enter a request or attach a file.";
    requestStatus.style.color = "red";
    return;
  }

  requestStatus.textContent = "Request sent. Please wait for the response.";
  requestStatus.style.color = "green";
  requestMessage.value = "";
  requestFile.value = "";
  fileNameDisplay.textContent = "";

  const requestItem = document.createElement("div");
  requestItem.className = "request-item";

  let fileInfo = file ? `<p><strong>📎 File:</strong> ${file.name}</p>` : "";

  requestItem.innerHTML = `
    <p>${message || "(No message)"}</p>
    ${fileInfo}
    <button class="btn-outline accept">Accept</button>
    <button class="btn-outline reject">Reject</button>
  `;

  requestsList.appendChild(requestItem);

  requestItem.querySelector(".accept").addEventListener("click", () => {
    requestItem.innerHTML = `<p class="accepted">✅ Request accepted</p>`;
  });

  requestItem.querySelector(".reject").addEventListener("click", () => {
    requestItem.innerHTML = `<p class="rejected">❌ Request rejected</p>`;
  });
});


  // Show status to user
  requestStatus.textContent = "Request sent. Please wait for the response.";
  requestStatus.style.color = "green";
  requestMessage.value = "";

  // Add request to lawyer’s list
  const requestItem = document.createElement("div");
  requestItem.className = "request-item";
  requestItem.innerHTML = `
    <p>${message}</p>
    <button class="btn-outline accept">Accept</button>
    <button class="btn-outline reject">Reject</button>
  `;

  requestsList.appendChild(requestItem);

  // Add event listeners for accept/reject
  requestItem.querySelector(".accept").addEventListener("click", () => {
    requestItem.innerHTML = `<p class="accepted">✅ Request accepted</p>`;
  });

  requestItem.querySelector(".reject").addEventListener("click", () => {
    requestItem.innerHTML = `<p class="rejected">❌ Request rejected</p>`;
  });


