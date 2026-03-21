document.addEventListener("DOMContentLoaded", function () {

  /* LOGIN FORM */

  const form = document.getElementById("loginForm");

  if (form) {

    form.addEventListener("submit", function (e) {

      e.preventDefault();

      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;

      if (email === "admin@schoolhub.local" && password === "EventHub@123") {

        localStorage.setItem("admin", "true");

        window.location.href = "dashboard.html";

      } else {

        alert("Invalid login");

      }

    });

  }

  /* PROTECT DASHBOARD */

  if (window.location.pathname.includes("dashboard.html")) {

    if (localStorage.getItem("admin") !== "true") {

      window.location.href = "admin.html";

    }

  }

});


/* LOGOUT */

function logout() {

  localStorage.removeItem("admin");

  window.location.href = "index.html";

}
