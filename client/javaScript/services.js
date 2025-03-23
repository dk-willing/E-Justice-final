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
