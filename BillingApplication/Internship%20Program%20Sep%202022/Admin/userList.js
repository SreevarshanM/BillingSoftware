const product = document.querySelector(".product");
const waitingBtn = document.querySelector(".waiting-btn");
const approvedBtn = document.querySelector(".approved-btn");
const rejectBtn = document.querySelector(".reject-btn");
const listTitle = document.querySelector(".list-title");
const columnNames = document.querySelector(".column-name");
import { BACKEND_BASE_URL } from "../environmentModule.js";
const baseUrl = BACKEND_BASE_URL;
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
const token = window.sessionStorage.getItem("token");

const approveUser = (e) => {
  const username = e.target.closest("td").id;
  const url = `${baseUrl}/updateUser`;
  const data = {
    username,
    status: "Approved",
  };
  fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        alert("Sucessfully Approved!", "success");
        renderWaiting();
      } else {
        throw new Error("Not Updated");
      }
    })
    .catch((err) => alert(err, "danger"));
};

const rejectUser = (e) => {
  const username = e.target.closest("td").id;
  const url = `${baseUrl}/updateUser`;
  const data = {
    username,
    status: "Rejected",
  };
  fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        alert("Sucessfully Rejected!", "success");
        renderWaiting();
      } else {
        throw new Error("Not Updated");
      }
    })
    .catch((err) => alert(err, "danger"));
};

const renderHtml = () => {
  const url = `${baseUrl}/getApproved`;
  listTitle.textContent = "APPROVED LIST";
  columnNames.innerHTML = ` <tr>
  <th scope="col">#</th>
  <th scope="col">Name</th>
  <th scope="col">Email</th>
  <th scope="col">Date</th>
  
</tr>`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 401) {
        // window.location.replace(
        //   "http://127.0.0.1:5500/Internship%2520Program%2520Sep%25202022/ERROR/401err"
        // );
        window.location.href = "../ERROR/401error.html";
      }
      if (data.status === 403) {
        window.location.href = "../ERROR/403Error.html";
      }
      if (!data) {
        throw new Error(data.message);
      }
      product.innerHTML = "";
      let productsHtml = "";
      let num = 1;

      data.forEach((ele) => {
        productsHtml += `<tr>
        <th scope="row">${num}</th>
        <td>${ele.username}</td>
        <td>${ele.email}</td>
        <td>${ele.createdAt}</td>
        </tr>`;
        num = num + 1;
      });
      product.insertAdjacentHTML("afterbegin", productsHtml);
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
};
renderHtml();

const renderWaiting = (e) => {
  const url = `${baseUrl}/getWaiting`;
  listTitle.textContent = "WAITING LIST";
  columnNames.innerHTML = `   <tr>
  <th scope="col">#</th>
  <th scope="col">Name</th>
  <th scope="col">Email</th>
  <th scope="col">Date</th>
  <th scope="col">Approval</th>
  </tr>`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      product.innerHTML = "";
      let waitingHtml = "";
      let num = 1;

      data.forEach((ele) => {
        waitingHtml += `<tr>
        <th scope="row">${num}</th>
        <td>${ele.username}</td>
        <td>${ele.email}</td>
        <td>${ele.createdAt}</td>
        <td id="${ele.username}"><button type="submit" class="btn-yes btn-submit btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="yes-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </button>
        <button type="submit" class="btn-no btn-submit btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="no-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      </button>
        </td>
        </tr>`;
        num = num + 1;
      });
      product.insertAdjacentHTML("afterbegin", waitingHtml);
      const yesBtn = document.querySelectorAll(".btn-yes");
      const noBtn = document.querySelectorAll(".btn-no");
      yesBtn.forEach((ele) => {
        ele.addEventListener("click", approveUser);
      });
      noBtn.forEach((ele) => {
        ele.addEventListener("click", rejectUser);
      });
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const renderReject = (e) => {
  const url = `${baseUrl}/getRejected`;
  listTitle.textContent = "REJECTED LIST";
  columnNames.innerHTML = ` <tr>
  <th scope="col">#</th>
  <th scope="col">Name</th>
  <th scope="col">Email</th>
  <th scope="col">Date</th>
  
</tr>`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      product.innerHTML = "";
      let rejectedHtml = "";
      let num = 1;

      data.forEach((ele) => {
        rejectedHtml += `<tr>
        <th scope="row">${num}</th>
        <td>${ele.username}</td>
        <td>${ele.email}</td>
        <td>${ele.createdAt}</td>
      </tr>`;
        num = num + 1;
      });
      product.insertAdjacentHTML("afterbegin", rejectedHtml);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

waitingBtn.addEventListener("click", renderWaiting);
approvedBtn.addEventListener("click", renderHtml);
rejectBtn.addEventListener("click", renderReject);
