document.addEventListener("DOMContentLoaded", function () {
  // Navigation item click handler
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // For demonstration purposes - simulate loading progress
  const progressBars = document.querySelectorAll(".progress-fill");
  progressBars.forEach((bar) => {
    const originalWidth = bar.style.width;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.transition = "width 1s ease";
      bar.style.width = originalWidth;
    }, 300);
  });

  // Button click handlers
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      // For demonstration purposes
      button.style.opacity = "0.8";
      setTimeout(() => {
        button.style.opacity = "1";
      }, 200);
    });
  });

  // Update buttons
  const updateButtons = document.querySelectorAll(".update-btn");
  updateButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event bubbling
      button.textContent = "Updating...";
      setTimeout(() => {
        button.textContent = "Updated!";
        setTimeout(() => {
          button.textContent = "Update";
        }, 1500);
      }, 1000);
    });
  });
});

// Dark mode functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get the dark mode icon and toggle button
  const darkModeIcon = document.getElementById("darkModeIcon");

  const darkModeToggler = document.getElementById("darkModeToggler");
  const body = document.body;

  // Check stored preference and apply dark mode if needed
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    body.classList.add("dark-mode");
    if (darkModeIcon) {
      darkModeIcon.className = "fas fa-sun"; // Change icon to sun when dark mode is active
    }
  }

  // Toggle dark mode on icon click
  darkModeToggler.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    const darkModeEnabled = body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", darkModeEnabled);

    // Update the icon accordingly
    darkModeIcon.className = darkModeEnabled ? "fas fa-sun" : "fas fa-moon";

    // Log for debugging
    console.log(
      "Dark mode toggled. Current state:",
      darkModeEnabled ? "Dark" : "Light"
    );
  });
});

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", function () {
  // Clear session data (e.g., token)
  localStorage.removeItem("authToken");
  alert("You have been logged out.");
  // Redirect to login page
  window.location.href = "../html/auth.html";
});
