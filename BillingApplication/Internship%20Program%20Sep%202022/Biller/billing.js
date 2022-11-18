"use strict";
import { BACKEND_BASE_URL } from "../environmentModule.js";
const product = document.querySelector(".product");
const baseUrl = BACKEND_BASE_URL;
const alertContainer = document.querySelector(".alert-container");
const btnSearch = document.querySelector(".btn-search");
const btnRefresh = document.querySelector(".refresh-btn");
const btnCart = document.querySelector(".cart-btn");
const btnProduct = document.querySelector(".product-btn");
const btnCheckout = document.querySelector(".checkout-btn");
const columnTitle = document.querySelector(".column-title");
let shoppingCart = [];

const alert = (msg, status) => {
  if (!status) {
    status = "danger";
  }
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

//////////RENDERING THE PRODUCTS ////////////
const renderHtml = (productname = "All") => {
  let url;
  if (productname !== "All") {
    url = `${baseUrl}/products?productname=${productname}`;
  } else url = `${baseUrl}/products`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Error: No Products Found") {
        throw new Error(" No Products Found");
      }
      if (data.status === 401) {
        window.location.href = "../ERROR/401error.html";
      }
      if (data.status === 403) {
        window.location.href = "../ERROR/403Error.html";
      }
      product.innerHTML = "";
      let productsHtml = "";
      let num = 1;
      columnTitle.innerHTML = "";
      columnTitle.innerHTML = `  <tr>
      <th scope="col">Product</th>
      <th scope="col">Category</th>
      <th scope="col">BrandName</th>
      <th scope="col">Unit</th>
      <th scope="col">MRP</th>
      <th scope="col">Quantity</th>
    </tr>`;

      data.forEach((ele) => {
        productsHtml += `<tr>
      <td>${ele.productname}</td>
      <td>${ele.category}</td>
      <td>${ele.brandname}</td>
      <td>${ele.unit}</td>
      <td>${ele.MRP}</td>
      <td id='${ele.productname}'><div class="quantity-input-box">
      <button class="minus-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="minus-svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
        </svg>
      </button>
      <input
        type="number"
        class="form-control inp-${ele.productname}"
        id="product-${num}"
        name="inp"
        min="0"
        placeholder="0"
      />
      <button class="plus-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="plus-svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div></td>
      
    </tr>`;
        num = num + 1;
      });

      product.insertAdjacentHTML("afterbegin", productsHtml);
      const plusBtn = document.querySelectorAll(".plus-btn");
      const minusBtn = document.querySelectorAll(".minus-btn");
      plusBtn.forEach((ele) => {
        ele.addEventListener("click", (e) => {
          const quantity = e.target.closest(".plus-btn").previousElementSibling;
          quantity.value++;
          const product = e.target.closest(".plus-btn").closest("td").id;
          addCart(product);
        });
      });
      minusBtn.forEach((ele) => {
        ele.addEventListener("click", (e) => {
          const quantity = e.target.closest(".minus-btn").nextElementSibling;
          if (quantity.value <= 1) quantity.value = 0;
          else quantity.value--;
          const product = e.target.closest(".minus-btn").closest("td").id;
          removeCart(product);
        });
      });

      return true;
    })
    .catch((err) => {
      alert(err, "danger");
      renderHtml();
      // window.location.replace("http://127.0.0.1:5500/401error.html");
    });
};
renderHtml();

const addCart = (productName) => {
  let flag = 1;
  shoppingCart.forEach((ele) => {
    if (ele.productName === productName) {
      ele.quantity++;
      flag = 0;
    }
  });
  if (flag)
    fetch(`${baseUrl}/products?productname=${productName}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const [product] = data;
        shoppingCart.push({
          productName: product.productname,
          quantity: 1,
          MRP: product.MRP,
        });
      });

  console.log(shoppingCart);
};

const removeCart = (productName) => {
  if (shoppingCart.length === 0) {
    alert("Shopping Cart is Empty", "danger");
    return;
  }
  shoppingCart.forEach((ele) => {
    if (ele.productName === productName) {
      if (ele.quantity === 0) {
        alert("No items Added", "danger");
        return;
      }
      ele.quantity--;
      if (ele.quantity === 0) {
        shoppingCart.splice(shoppingCart.indexOf(ele), 1);
        // shoppingCart = shoppingCart.filter((ele) => {
        //   return ele.quantity > 0;
        // });
        alert("Item Removed From Cart", "success");
      }
    }
  });
  console.log(shoppingCart);
};

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();
  const searchText = document.querySelector(".mr-2");
  renderHtml(searchText.value);
});

btnRefresh.addEventListener("click", (e) => {
  btnCheckout.classList.add("hidden");
  renderHtml();
});
btnProduct.addEventListener("click", (e) => {
  btnCheckout.classList.add("hidden");
  renderHtml();
});

const renderCart = () => {
  columnTitle.innerHTML = "";
  columnTitle.innerHTML = ` <tr>
  <th scope="col">#</th>
  
  <th scope="col">Product</th>
  <th scope="col">MRP</th>
  <th scope="col">Quantity</th>
  <th scope="col">Price</th>
</tr>`;
  product.innerHTML = "";
  let num = 1;
  let productsHtml = ``;
  shoppingCart.forEach((ele) => {
    productsHtml += `<tr>
    <th scope="row">${num}</th>
    <td>${ele.productName}</td>
      <td>${ele.MRP}</td>
      <td id='${ele.productName}'><div class="quantity-input-box">
      <button class="minus-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="minus-svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
        </svg>
      </button>
      <input
        type="number"
        class="form-control"
        id="inp-${ele.productname}"
        name="inp-${ele.productname}"
        min="0"
        value="${ele.quantity}"
        placeholder="0"
      />
      <button class="plus-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="plus-svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div></td>
    <td> 💲${ele.quantity * ele.MRP}</td>
      
    </tr>`;
    num++;
  });
  product.innerHTML = productsHtml;
  btnCheckout.classList.remove("hidden");
  renderTotal();
  const plusBtn = document.querySelectorAll(".plus-btn");
  const minusBtn = document.querySelectorAll(".minus-btn");
  plusBtn.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      const quantity = e.target.closest(".plus-btn").previousElementSibling;
      quantity.value++;
      const product = e.target.closest(".plus-btn").closest("td").id;
      console.log(product);
      addCart(product);
      renderTotal(1);
    });
  });
  minusBtn.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      const quantity = e.target.closest(".minus-btn").nextElementSibling;
      if (quantity.value < 1) quantity.value = 0;
      else quantity.value--;
      const product = e.target.closest(".minus-btn").closest("td").id;
      console.log(product);
      removeCart(product);
      renderTotal(1);
      renderCart();
    });
  });
};

btnCart.addEventListener("click", renderCart);

const renderTotal = (flag = 0) => {
  const total = totalPrice();
  console.log(product.lastChild);
  if (flag) {
    product.removeChild(product.lastElementChild);
  }
  if (shoppingCart.length === 0) return;
  const renderHtml = `<tr><td></td>
   <td></td>
   <td></td>
   <td>TOTAL</td>
   <td>💲${total}</td></tr>`;
  product.insertAdjacentHTML("beforeend", renderHtml);
};

const totalPrice = function () {
  if (shoppingCart.length === 0) return;
  return shoppingCart
    .map((ele) => {
      return ele.quantity * ele.MRP;
    })
    .reduce((acc, curr) => acc + curr);
};

const checkout = async (e) => {
  try {
    if (shoppingCart.length === 0) {
      throw new Error("Shopping list is Empty");
    }
    const url = `${baseUrl}/updateProduct`;
    shoppingCart.forEach((product) => {
      const data = {
        productname: product.productName,
        quantity: -product.quantity,
      };
      console.log(data);
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (!data.status) {
            console.log("sree");
            throw new Error(data.message);
          }
          alert("Sucessfully Bill Generated", "success");
          shoppingCart = [];
        })
        .catch((err) => alert(`${err}`, "danger"));
    });
  } catch (error) {
    console.log(error);
    alert(`${error}`, "danger");
  }
};

btnCheckout.addEventListener("click", checkout);
