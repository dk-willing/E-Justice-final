document.addEventListener("DOMContentLoaded", function () {
  // Category filtering functionality
  const categoryFilters = document.querySelectorAll(".category-filter");
  const resourceCards = document.querySelectorAll(".resource-card");

  // Add event listeners to all category filters
  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", function () {
      // Remove active class from all filters
      categoryFilters.forEach((f) => f.classList.remove("active"));

      // Add active class to clicked filter
      this.classList.add("active");

      // Get selected category
      const selectedCategory = this.getAttribute("data-category");

      // Show/hide resource cards based on category
      resourceCards.forEach((card) => {
        if (selectedCategory === "all") {
          card.style.display = "block"; // Show all cards
        } else {
          // Show card if it matches the selected category, hide otherwise
          if (card.getAttribute("data-category") === selectedCategory) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        }
      });
    });
  });

  // Search functionality
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");

  // Function to perform search
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    // If search term is empty, reset to show all items
    if (searchTerm === "") {
      resourceCards.forEach((card) => {
        card.style.display = "block";
      });

      // Reset category filter to "All"
      categoryFilters.forEach((f) => f.classList.remove("active"));
      document.querySelector('[data-category="all"]').classList.add("active");

      return;
    }

    // Search through each card's content
    resourceCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();

      // Show card if it contains the search term, hide otherwise
      if (cardText.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Add event listener to search button
  searchBtn.addEventListener("click", performSearch);

  // Add event listener for Enter key in search input
  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  // Dark mode toggle
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");

      // Save preference to localStorage
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
      } else {
        localStorage.setItem("darkMode", "disabled");
      }
    });
  }

  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  // Action buttons hover effect
  const actionButtons = document.querySelectorAll(".action-btn");
  actionButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
});

// Modal 2
document.addEventListener("DOMContentLoaded", function () {
  const searchModal = document.getElementById("searchModal");
  const openSearchBtn = document.getElementById("openSearch");
  const closeSearchBtn = document.getElementById("closeSearch");

  // Open Modal
  openSearchBtn.addEventListener("click", function () {
    searchModal.style.display = "flex";
  });

  // Close Modal
  closeSearchBtn.addEventListener("click", function () {
    searchModal.style.display = "none";
  });

  // Close Modal when clicking outside the box
  window.addEventListener("click", function (event) {
    if (event.target === searchModal) {
      searchModal.style.display = "none";
    }
  });
});
