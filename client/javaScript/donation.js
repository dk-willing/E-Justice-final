// Modal

document.addEventListener("DOMContentLoaded", () => {
  // Get modal elements
  const modal = document.getElementById("contactModal");
  const contactLink = document.querySelector("#contactUs");
  const closeModal = document.querySelector(".close");

  // Show modal when contact link is clicked
  contactLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    modal.style.display = "flex";
  });

  // Close modal when close button is clicked
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

const paymentModal = document.getElementById("payment-modal");
const openModalBtn = document.querySelectorAll("a[href='payment.html']");
const closeModalBtn = document.querySelector(".close");
const cardForm = document.getElementById("card-form");
const mobileForm = document.getElementById("mobile-form");
const tabs = document.querySelectorAll(".tab");

function openModal(e) {
  e.preventDefault();
  paymentModal.style.display = "flex";
}

function closeModal() {
  paymentModal.style.display = "none";
}

function showForm(form) {
  tabs.forEach((tab) => tab.classList.remove("active"));

  if (form === "card") {
    cardForm.style.display = "block";
    mobileForm.style.display = "none";
    tabs[0].classList.add("active");
  } else {
    cardForm.style.display = "none";
    mobileForm.style.display = "block";
    tabs[1].classList.add("active");
  }
}

openModalBtn.forEach((link) => link.addEventListener("click", openModal));
closeModalBtn.addEventListener("click", closeModal);

tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    showForm(this.textContent.toLowerCase());
  });
});

window.addEventListener("click", function (event) {
  if (event.target === paymentModal) {
    closeModal();
  }
});
