/* LOGOUT */
function logout() {
  localStorage.removeItem("admin");
  window.location.href = "../login.html";
}