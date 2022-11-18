const product = document.querySelector(".product");
const Modal = document.getElementById("staticBackdrop");
const filterBtn = document.querySelector(".filter-products");
const filterList = document.querySelector(".filter-box");
const categoryBtn = document.querySelector(".filter-category");
const quantityBtn = document.querySelector(".filter-quantity");
import { BACKEND_BASE_URL } from "../environmentModule.js";
const newestBtn = document.querySelector(".filter-newest");
const baseUrl = BACKEND_BASE_URL;
const alertContainer = document.querySelector(".alert-container");
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
const renderHtml = (filter = "category") => {
  const url = `${baseUrl}/products?sort=${filter}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status === 401) {
        window.location.href = "../ERROR/401error.html";
      }
      if (data.status === 403) {
        window.location.href = "../ERROR/403Error.html";
      }
      product.innerHTML = "";
      let productsHtml = "";
      let num = 1;

      data.forEach((ele) => {
        productsHtml += `<tr>
      <th scope="row">${num}</th>
      <td>${ele.productname}</td>
      <td>${ele.category}</td>
      <td>${ele.brandname}</td>
      <td>${ele.quantity}</td>
      <td>${ele.unit}</td>
      <td>${ele.MRP}</td>
      <td>${ele.expirydate}</td>
    </tr>`;
        num = num + 1;
      });
      product.insertAdjacentHTML("afterbegin", productsHtml);
      return true;
    })
    .catch((err) => {
      console.log(err);
      // window.location.replace("http://127.0.0.1:5500/401error.html");
    });
};
renderHtml();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////CALLBACK FUNCTIONS ///////////////////////////////////////////////////

//////////////////////////////////////////PRODUCT CREATION CALLBACK////////////////////////////////////////////

const createProduct = () => {
  const url = `${baseUrl}/createProduct`;
  const productname = document.getElementById("productName").value;
  const category = document.getElementById("category").value;
  const unit = document.getElementById("unit").value;
  const unitprice = document.getElementById("unitPrice").value;
  const quantity = document.getElementById("quantity").value;
  const MRP = document.getElementById("MRP").value;
  const brandname = document.getElementById("brandName").value;
  const manufacturedate = document.getElementById("manufactureDate").value;
  const expirydate = document.getElementById("expiryDate").value;
  const data = {
    productname,
    category,
    unit,
    unitprice,
    quantity,
    MRP,
    brandname,
    manufacturedate,
    expirydate,
  };

  Object.keys(data).forEach((key) => {
    console.log(data[key]);
    if (data[key] === "") {
      alert("All Fields Are Must!", "danger");
      return;
    } else if (data[key] < 0) {
      alert(`${key} Must be greater than or equal to zero`, "danger");
      return;
    }
  });

  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        alert("sucessfully Created!!", "success");
        renderHtml();
        return;
      } else {
        console.log(data.status);
        throw new Error("Not Created");
      }
    })
    .catch((err) => {
      alert(err, "danger");
    });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////UPDATE PRODUCT CALLBACK///////////////////////////////////////////////////////////

const updateProduct = (productName) => {
  try {
    const url = `${baseUrl}/updateProduct`;
    const category = document.getElementById("category").value;
    const unit = document.getElementById("unit").value;
    const unitprice = document.getElementById("unitPrice").value;
    const quantity = document.getElementById("quantity").value;
    const MRP = document.getElementById("MRP").value;
    const brandname = document.getElementById("brandName").value;
    const manufacturedate = document.getElementById("manufactureDate").value;
    const expirydate = document.getElementById("expiryDate").value;
    const data = {
      category,
      unit,
      unitprice,
      quantity,
      MRP,
      brandname,
      manufacturedate,
      expirydate,
    };
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        delete data[key];
      } else if (data[key] < 0) {
        throw `${key} Must be greater than or equal to zero`;
      }
    });
    if (Object.keys(data).length === 0) {
      throw "NO changes Entered";
    }

    data["productname"] = productName;
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
          renderHtml();
          alert("sucessfully updated!", "success");
          return;
        } else {
          throw new Error("Not Updated");
        }
      })
      .catch((err) => {
        alert(err, "danger");
      });
  } catch (err) {
    alert(err, "danger");
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////FILTER PRODUCTS CALLBACK///////////////////////////////////////////////////

filterBtn.addEventListener("click", (e) => {
  filterList.classList.toggle("display");
});

const filterProducts = (e) => {
  if (e.target.id === "filter-category") {
    renderHtml("category");
  } else if (e.target.id === "filter-quantity") {
    renderHtml("-quantity");
  } else {
    renderHtml("-createdAt");
  }
};
categoryBtn.addEventListener("click", filterProducts);
quantityBtn.addEventListener("click", filterProducts);
newestBtn.addEventListener("click", filterProducts);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////DELETE PRODUCT CALLBACK//////////////////////////////////////////////////

const deleteProduct = (productname) => {
  const url = `${baseUrl}/deleteProduct`;
  const data = {
    productname,
  };
  fetch(url, {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        alert("Sucessfully Deleted!", "success");
        renderHtml();
      } else {
        throw new Error("Product Name Not Found");
      }
    })
    .catch((err) => alert(err, "danger"));
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////MODALS//////////////////////////////////////////////////////////////////

Modal.addEventListener("show.bs.modal", (event) => {
  // Button that triggered the modal
  const button = event.relatedTarget;
  // Extract info from data-bs-btn* attributes
  const btnType = button.getAttribute("data-bs-btn");
  const heading = document.getElementById("ModalHeading");
  const modalBody = document.querySelector(".modal-body");
  const submitBtn = document.querySelector(".btn-submit");
  const updateBtn = document.querySelector(".btn-update");
  const findBtn = document.querySelector(".btn-find");
  const deleteBtn = document.querySelector(".btn-delete");

  let html = "";
  if (btnType === "add") {
    ///////////////////////////////////////////////////ADD PRODUCTS///////////////////////////////////////////////////////////
    heading.textContent = "Add Product";
    updateBtn.classList.add("display");
    findBtn.classList.add("display");
    deleteBtn.classList.add("display");
    submitBtn.classList.remove("display");
    ////////DISPLAYING THE FORM FOR ADD PRODUCTS
    html = `<form>
    <div class="form-group">
      <label for="productName">Product Name</label>
      <input
        type="text"
        class="form-control"
        id="productName"
        name="productName"
        placeholder="Dairy Milk"
      />
    </div>
    <div class="form-group">
      <label for="category">category</label>
      <input
        type="text"
        class="form-control"
        id="category"
        name="category"
        placeholder="Choclate"
      />
    </div>
    <div class="form-group">
      <label for="unit">unit</label>
      <input
        type="text"
        class="form-control"
        id="unit"
        name="unit"
        placeholder="gram"
      />
    </div>
    <div class="form-group">
      <label for="unitPrice">unitPrice</label>
      <input
        type="number"
        class="form-control"
        id="unitPrice"
        name="unitPrice"
        placeholder="35"
      />
    </div>
    <div class="form-group">
      <label for="quantity">Quantity</label>
      <input
        type="number"
        class="form-control"
        id="quantity"
        name="quantity"
        placeholder="50"
      />
    </div>
    <div class="form-group">
      <label for="MRP">MRP</label>
      <input
        type="number"
        class="form-control"
        id="MRP"
        name="MRP"
        placeholder="40"
      />
    </div>
    <div class="form-group">
      <label for="brandName">Brand Name</label>
      <input
        type="text"
        class="form-control"
        id="brandName"
        name="brandName"
        placeholder="Cadbury"
      />
    </div>
    <div class="form-group">
      <label for="manufactureDate">manufacture Date</label>
      <input
        type="text"
        class="form-control"
        id="manufactureDate"
        name="manufactureDate"
        placeholder="2022-10-21"
      />
    </div>
    <div class="form-group">
      <label for="expiryDate">Expiry Date</label>
      <input
        type="text"
        class="form-control"
        id="expiryDate"
        name="expiryDate"
        placeholder="2023-10-21"
      />
    </div>
  </form>`;
    submitBtn.addEventListener("click", createProduct);
  } else if (btnType === "update") {
    //////////////////////////////////////////////////UPDATE PRODUCTS///////////////////////////////////////////////////////////
    heading.textContent = "Update Product";
    submitBtn.classList.add("display");
    updateBtn.classList.add("display");
    deleteBtn.classList.add("display");
    findBtn.classList.remove("display");
    //////////////////////////////////////////////FORM FOR FIND PRODUCT///////////////////////////////////////////////////////////
    html = `<div class="form-group">
    <label for="productName"
      >Enter Product Name For Updation :</label
    >
    <input
      type="text"
      class="form-control"
      id="productName"
      name="productName"
      placeholder="Dairy Milk"
    />
  </div>`;

    findBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const productname = document.getElementById("productName").value;
      if (!productname) {
        alert("Product Not Found");
        return;
      }
      const url = `${BACKEND_BASE_URL}/checkProduct?productname=${productname}`;
      fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            //////////////////////////////////////////////FORM FOR UPDATE PRODUCT///////////////////////////////////////////////////////////
            html = `<form>
            <div class="form-group">
              <label for="category">category</label>
              <input
                type="text"
                class="form-control"
                id="category"
                name="category"
                placeholder="Choclate"
              />
            </div>
            <div class="form-group">
              <label for="unit">unit</label>
              <input
                type="text"
                class="form-control"
                id="unit"
                name="unit"
                placeholder="gram"
              />
            </div>
            <div class="form-group">
              <label for="unitPrice">unitPrice</label>
              <input
                type="number"
                class="form-control"
                id="unitPrice"
                name="unitPrice"
                placeholder="35"
              />
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input
                type="number"
                class="form-control"
                id="quantity"
                name="quantity"
                placeholder="50"
              />
            </div>
            <div class="form-group">
              <label for="MRP">MRP</label>
              <input
                type="number"
                class="form-control"
                id="MRP"
                name="MRP"
                placeholder="40"
              />
            </div>
            <div class="form-group">
              <label for="brandName">Brand Name</label>
              <input
                type="text"
                class="form-control"
                id="brandName"
                name="brandName"
                placeholder="Cadbury"
              />
            </div>
            <div class="form-group">
              <label for="manufactureDate">manufacture Date</label>
              <input
                type="text"
                class="form-control"
                id="manufactureDate"
                name="manufactureDate"
                placeholder="2022-10-21"
              />
            </div>
            <div class="form-group">
              <label for="expiryDate">Expiry Date</label>
              <input
                type="text"
                class="form-control"
                id="expiryDate"
                name="expiryDate"
                placeholder="2023-10-21"
              />
            </div>
          </form>`;
            modalBody.innerHTML = "";
            modalBody.insertAdjacentHTML("afterbegin", html);
            updateBtn.addEventListener("click", (e) => {
              updateProduct(productname);
              // console.log(e);
            });
            findBtn.classList.add("display");
            updateBtn.classList.remove("display");
          } else {
            throw new Error("product not found");
          }
        })
        .catch((err) => alert(err));
    });
  } else if (btnType === "delete") {
    ///////////////////////////////////////////////////DELETE PRODUCTS///////////////////////////////////////////////////////////
    heading.textContent = "Delete Product";
    submitBtn.classList.add("display");
    updateBtn.classList.add("display");
    findBtn.classList.add("display");
    deleteBtn.classList.remove("display");
    ////////////////////////////////////////////////FORM FOR DELETE PRODUCT/////////////////////////////////////////////////////
    html = `<div class="form-group">
    <label for="productName"
      >Enter Product Name For Updation :</label
    >
    <input
      type="text"
      class="form-control"
      id="productName"
      name="productName"
      placeholder="Dairy Milk"
    />
  </div>`;
    deleteBtn.addEventListener("click", (e) => {
      const productname = document.getElementById("productName").value;
      if (!productname) {
        alert("Product Not Found");
        return;
      }
      deleteProduct(productname);
    });
  }
  ///////////////////////DISPLAY THE MODAL BODY /////////////////////////////
  modalBody.innerHTML = "";
  modalBody.insertAdjacentHTML("afterbegin", html);
});
