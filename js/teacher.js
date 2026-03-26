document.addEventListener("DOMContentLoaded", function () {

  /* LOGIN FORM */
  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (email === "admin@schoolhub.local" && password === "EventHub@123") {
        localStorage.setItem("admin", "true");
        window.location.href = "dashboard.html"; // relative, works from admin/login.html
      } else {
        alert("Invalid email or password.");
      }
    });
  }

});

/* LOGOUT */
function logout() {
  localStorage.removeItem("admin");
  window.location.href = "../index.html";
}
