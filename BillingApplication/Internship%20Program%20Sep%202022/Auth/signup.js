"use strict";
import { BACKEND_BASE_URL } from "../environmentModule.js";
const submitbtn = document.querySelector(".btn-submit");
const alertContainer = document.querySelector(".alert-container");
const alert = (msg, status) => {
  const alertMsg = ` <div class="alert alert-${status} alert-dismissible fade show" role="alert">
  ${msg}
  <button
    type="button"
    class="btn-close"
    data-bs-dismiss="alert"
    aria-label="Close"
  ></button>
</div>`;
  alertContainer.innerHTML = alertMsg;
};

submitbtn.addEventListener("click", (e) => {
  e.preventDefault();
  const username = document.getElementById("firstName").value;
  const password = document.getElementById("password1").value;
  const password2 = document.getElementById("password2").value;
  const email = document.getElementById("email").value;
  const date = new Date().toJSON().slice(0, 10);
  if (password === password2) {
    const data = {
      username,
      email,
      password,
      status: "Waiting",
      createdAt: date,
    };
    const url = `${BACKEND_BASE_URL}/signup`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          alert("Request Sent To Admin", "success");
          window.location.replace(
            "http://127.0.0.1:5500/Internship%2520Program%2520Sep%25202022/Auth/Login.html"
          );
        } else {
          throw new Error("Something Went Wrong!!");
        }
      })
      .catch((err) => alert(`${err}`, "danger"));
  } else {
    alert("Password's Don't Match!!!", "danger");
  }
});
