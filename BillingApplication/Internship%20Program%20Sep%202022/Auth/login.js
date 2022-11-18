"use strict";
const loginbtn = document.querySelector(".btn-login");
const alertContainer = document.querySelector(".alert-container");
import { BACKEND_BASE_URL } from "../environmentModule.js";

console.log(BACKEND_BASE_URL);

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
/////ADMIN STATIC LOGIN ////////
const admin = "admin";
const adminPassword = "1234";

loginbtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("request sent");
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username === "" || password === "") {
    alert("Error:Enter Field Values", "danger");
    return;
  }
  const url = `${BACKEND_BASE_URL}/login`;
  const data = {
    username,
    password,
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (!data.status) {
        throw new Error(data.message);
      }
      const token = data.token;
      window.sessionStorage.setItem("token", token);
      if (data.role === "admin") {
        alert("Sucessfully Login !!", "success");

        // window.location.replace(
        //   "http://127.0.0.1:5500/Internship%2520Program%2520Sep%25202022/Admin/home-admin.html"
        // );
        window.location.href = "../Admin/home-admin.html";
        return;
      }
      alert("Sucessfully Login !!", "success");
      // window.location.replace(
      //   "http://127.0.0.1:5500/Internship%2520Program%2520Sep%25202022/Biller/home-biller.html"
      // );
      window.location.href = "../Biller/home-biller.html";
    })
    .catch((err) => {
      alert(err, "danger");
    });
});
