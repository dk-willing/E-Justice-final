document.addEventListener("DOMContentLoaded", () => {
  //Hamburger menu functionality
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("show");

      // Update ARIA attributes for accessibility
      let expanded = hamburger.classList.contains("active");
      hamburger.setAttribute("aria-expanded", expanded);
    });
  }

  const dropdown = document.querySelector(".dropdown");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdown && dropdownMenu) {
    dropdown.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.toggle("active");
      dropdownMenu.classList.toggle("show");
    });
  }
});

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
