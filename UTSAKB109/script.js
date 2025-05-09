// script.js (revisi dengan fungsi showProductDetail lengkap)
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99000,
    image: "images/gambar1.jpg",
  },
  { id: 2, name: "Smart Watch", price: 149000, image: "images/gambar2.jpg" },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 79000,
    image: "images/gambar3.jpg",
  },
  { id: 4, name: "Wireless Mouse", price: 29000, image: "images/gambar4.jpg" },
  {
    id: 5,
    name: "Power Bank 10000mAh",
    price: 119000,
    image: "images/gambar5.jpg",
  },
  {
    id: 6,
    name: "USB Flash Drive 64GB",
    price: 59000,
    image: "images/gambar6.jpg",
  },
  {
    id: 7,
    name: "Laptop Stand Aluminum",
    price: 89000,
    image: "images/gambar7.jpg",
  },
  {
    id: 8,
    name: "Keyboard Bluetooth",
    price: 99000,
    image: "images/gambar8.jpg",
  },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function renderProducts() {
  const search = DOMPurify.sanitize(
    document.getElementById("search").value.toLowerCase()
  );
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products
    .filter((p) => p.name.toLowerCase().includes(search))
    .forEach((product) => {
      const isWishlisted = wishlist.some((w) => w.id === product.id);
      productList.innerHTML += `
      <div class="col-12 col-sm-6 mb-4">
        <div class="card product-card">
          <img src="${product.image}" class="card-img-top" alt="${
        product.name
      }" onerror="this.src='images/default.jpg'">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Rp${product.price.toLocaleString()}</p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-success btn-sm" onclick='showProductDetail(${JSON.stringify(
                product
              )})'>
                <i class="fas fa-eye"></i> Detail
              </button>
              <button class="btn btn-light btn-sm" onclick='toggleWishlist(${JSON.stringify(
                product
              )})'>
                <i class="${
                  isWishlisted ? "fas text-danger" : "far"
                } fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;
    });
}

function showProductDetail(product) {
  console.log("Detail:", product);
  document.getElementById("detail-title").innerText = product.name;
  document.getElementById("detail-image").src = product.image;
  document.getElementById(
    "detail-price"
  ).innerText = `Rp${product.price.toLocaleString()}`;
  document.getElementById("detail-cart-btn").onclick = () => addToCart(product);
  document.getElementById("detail-wishlist-btn").onclick = () =>
    toggleWishlist(product);

  const isWishlisted = wishlist.some((w) => w.id === product.id);
  const icon = document
    .getElementById("detail-wishlist-btn")
    .querySelector("i");
  icon.className = isWishlisted ? "fas fa-heart text-danger" : "far fa-heart";

  const modal = new bootstrap.Modal(document.getElementById("detailModal"));
  modal.show();
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  showToast("Ditambahkan ke keranjang!");
  animateCart();
}

function animateCart() {
  const cartPanel = document.querySelector(".cart-panel");
  cartPanel.classList.add("animate-add");
  setTimeout(() => cartPanel.classList.remove("animate-add"), 400);
}

function animateWishlist() {
  const modal = document.getElementById("wishlistModal");
  modal.classList.add("animate-add");
  setTimeout(() => modal.classList.remove("animate-add"), 400);
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  let total = 0;
  cartList.innerHTML = "";
  cart.forEach((item, index) => {
    total += item.price;
    cartList.innerHTML += `<li>${
      item.name
    } - Rp${item.price.toLocaleString()} <span class="remove" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></span></li>`;
  });
  document.getElementById("total").innerText = total.toLocaleString();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  showToast("Item dihapus dari keranjang.");
}

function checkout() {
  if (cart.length === 0) return alert("Keranjang kosong!");
  alert("Terima kasih telah berbelanja!");
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  showToast("Checkout berhasil!");
}

function toggleWishlist(product) {
  const index = wishlist.findIndex((p) => p.id === product.id);
  if (index === -1) wishlist.push(product);
  else wishlist.splice(index, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderProducts();
  renderWishlist();
  showToast("Wishlist diperbarui.");
  animateWishlist();
}

function renderWishlist() {
  const content = document.getElementById("wishlist-content");
  if (wishlist.length === 0)
    return (content.innerHTML = "<p>Wishlist kosong.</p>");
  content.innerHTML = wishlist
    .map(
      (item) =>
        `<div class="d-flex justify-content-between mb-2"><span>${
          item.name
        }</span><button class="btn btn-sm btn-danger" onclick='toggleWishlist(${JSON.stringify(
          item
        )})'>Hapus</button></div>`
    )
    .join("");
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "on" : "off");
  const icon = document.querySelector('button[onclick="toggleDarkMode()"] i');
  if (icon) icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
}

function showToast(message) {
  const container = document.querySelector(".toast-container");
  const toast = document.createElement("div");
  toast.className = "toast align-items-center text-bg-primary border-0 show";
  toast.role = "alert";
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast"></button></div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

window.onload = () => {
  renderProducts();
  renderCart();
  renderWishlist();
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "on") {
    document.body.classList.add("dark-mode");
    const icon = document.querySelector('button[onclick="toggleDarkMode()"] i');
    if (icon) icon.className = "fas fa-sun";
  }
};
