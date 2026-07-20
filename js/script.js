// ============================================
//  js/script.js  —  EventHub general utilities
// ============================================

console.log("EventHub loaded.");

// ── LOGIN PAGE: Toggle Login ↔ Register panels ──
const container   = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn    = document.querySelector('.login-btn');

if (container && registerBtn && loginBtn) {
  registerBtn.addEventListener('click', () => {
    container.classList.add('active');
  });

  loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
  });
}

// ── OTHER PAGES: Auth guard — redirect to login if not logged in ──
// Only runs on pages that are NOT login.html
const isLoginPage = window.location.pathname.includes("login.html");

if (!isLoginPage && !localStorage.getItem("student")) {
window.location.replace("login.html");
}

// ── Show logged-in student email in navbar (if element exists) ──
const navEmail = document.getElementById("navEmail");
if (navEmail) {
  navEmail.innerText = localStorage.getItem("studentEmail") || "";
}

// ── Logout function (called from navbar logout button) ──
function logout() {
  localStorage.removeItem("student");
  localStorage.removeItem("studentEmail");
  sessionStorage.clear();
 window.location.replace("login.html");
}
// In js/script.js
function togglePassword() {
  const input    = document.getElementById("loginPassword");
  const lockicon = document.getElementById("lockToggle");
  const shackle  = document.getElementById("lockShackle");

  const isHidden = input.type === "password";

  if (isHidden) {
    // Unlock — show password
    input.type = "text";
    lockicon.classList.add("lock-open");

    // Animate shackle lifting up
    shackle.setAttribute("d", "M8 11V6a4 4 0 0 1 8 0v2");
  } else {
    // Lock — hide password
    input.type = "password";
    lockicon.classList.remove("lock-open");

    // Animate shackle closing
    shackle.setAttribute("d", "M8 11V7a4 4 0 0 1 8 0v4");
  }
}
// In js/script.js
function togglePassword2() {
  const input    = document.getElementById("registerPassword");
  const lockicon = document.getElementById("lockToggle2");
  const shackle  = document.getElementById("lockShackle2");

  const isHidden = input.type === "password";

  if (isHidden) {
    // Unlock — show password
    input.type = "text";
    lockicon.classList.add("lock-open");

    // Animate shackle lifting up
    shackle.setAttribute("d", "M8 11V6a4 4 0 0 1 8 0v2");
  } else {
    // Lock — hide password
    input.type = "password";
    lockicon.classList.remove("lock-open");

    // Animate shackle closing
    shackle.setAttribute("d", "M8 11V7a4 4 0 0 1 8 0v4");
  }
}
