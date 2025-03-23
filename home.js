// Modal

document.addEventListener("DOMContentLoaded", () => {
  // Get modal elements
  const modal = document.getElementById("contactModal");
  const contactLink = document.querySelectorAll("a[href='#contact']");
  const closeModal = document.querySelector(".close");

  // Show modal when contact link is clicked
  contactLink.forEach((link) =>
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default anchor behavior
      modal.style.display = "flex";
    })
  );

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
