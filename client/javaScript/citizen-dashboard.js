// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize sidebar navigation
  initSidebar();

  // Initialize search functionality
  initSearch();

  // Initialize case cards
  initCaseCards();

  // Initialize AI assistant
  initAIAssistant();

  // Initialize appointment actions
  initAppointments();

  // Initialize document downloads
  initDocuments();

  // Add animation effects to dashboard elements
  animateDashboardElements();
});

// Sidebar navigation functionality
function initSidebar() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // Prevent default action if it's just a placeholder link
      if (this.getAttribute("href") === "#") {
        e.preventDefault();
      }
    });
  });
}

// Search functionality
function initSearch() {
  const searchInput = document.querySelector(".search-bar input");
  const searchIcon = document.querySelector(".search-bar i");

  if (searchInput && searchIcon) {
    // Search on Enter key
    searchInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        performSearch(this.value);
      }
    });

    // Search on icon click
    searchIcon.addEventListener("click", function () {
      performSearch(searchInput.value);
    });
  }

  // Notification bell animation
  const notificationBell = document.querySelector(".notifications i");
  if (notificationBell) {
    notificationBell.addEventListener("click", function () {
      this.classList.add("animated");
      setTimeout(() => {
        this.classList.remove("animated");
      }, 1000);

      alert("You have 3 new notifications");
    });
  }
}

// Search function
function performSearch(query) {
  if (!query || query.trim() === "") {
    alert("Please enter a search term");
    return;
  }

  // In a real application, this would connect to a backend search
  console.log("Searching for:", query);
  alert(`Searching for: ${query}`);
}

// Case cards functionality
function initCaseCards() {
  // Message buttons
  const messageButtons = document.querySelectorAll(".action-btn.message");
  messageButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const lawyerName =
        this.closest(".case-details").querySelector("h4").textContent;
      alert(`Opening message window to ${lawyerName}`);
    });
  });

  // Details buttons
  const detailButtons = document.querySelectorAll(".action-btn.details");
  detailButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const caseType =
        this.closest(".case-card").querySelector(".case-type").textContent;
      alert(`Viewing details for case: ${caseType}`);
    });
  });

  // Submit new case button
  const submitCaseBtn = document.querySelector(".submit-case .btn");
  if (submitCaseBtn) {
    submitCaseBtn.addEventListener("click", function () {
      alert("Opening new case submission form");
    });
  }

  // Case progress animation
  const progressBars = document.querySelectorAll(".progress-bar");
  progressBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = "0";
    setTimeout(() => {
      bar.style.transition = "width 1s ease-in-out";
      bar.style.width = width;
    }, 300);
  });
}

// AI Assistant functionality
function initAIAssistant() {
  const aiInput = document.querySelector(".ai-input input");
  const sendBtn = document.querySelector(".send-btn");
  const suggestionBtns = document.querySelectorAll(".suggestion-btn");

  // Send question on button click
  if (sendBtn && aiInput) {
    sendBtn.addEventListener("click", function () {
      askQuestion(aiInput.value);
      aiInput.value = "";
    });

    // Send question on Enter key
    aiInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        askQuestion(this.value);
        this.value = "";
      }
    });
  }

  // Suggestion buttons
  suggestionBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const question = this.querySelector("span").textContent;
      askQuestion(question);
    });
  });
}

// Ask AI Assistant a question
function askQuestion(question) {
  if (!question || question.trim() === "") {
    alert("Please enter a question");
    return;
  }

  // In a real application, this would connect to an AI backend
  console.log("Question:", question);

  // For demonstration, show a simulated response
  const responses = {
    "Basic contracts":
      "Basic contracts require offer, acceptance, consideration, and the intention to create legal relations.",
    "Rent agreements":
      "Rent agreements should specify the term, rent amount, security deposit, and maintenance responsibilities.",
    "Court process":
      "The court process typically involves filing a complaint, discovery, pre-trial motions, trial, and potentially appeals.",
    "Your rights":
      "Your fundamental rights include the right to equality, freedom of speech, and protection under the law.",
  };

  // Check if we have a canned response
  let response = "";
  for (const key in responses) {
    if (question.toLowerCase().includes(key.toLowerCase())) {
      response = responses[key];
      break;
    }
  }

  // Default response if no match
  if (!response) {
    response =
      "I'm an AI assistant simulation. In the real application, I would provide specific legal information related to your question.";
  }

  alert(`AI Assistant: ${response}`);
}

// Appointment functionality
function initAppointments() {
  const rescheduleButtons = document.querySelectorAll(
    ".appointment-actions .btn"
  );
  rescheduleButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const appointmentTitle =
        this.closest(".appointment-card").querySelector("h4").textContent;
      const buttonText = this.textContent.trim();

      if (buttonText === "Reschedule") {
        alert(`Opening reschedule form for: ${appointmentTitle}`);
      } else if (buttonText === "Directions") {
        alert(`Showing directions to: High Court, Accra`);
      }
    });
  });

  // Book appointment button
  const bookAppointmentBtn = document.querySelector(
    ".appointments .btn.outline"
  );
  if (bookAppointmentBtn) {
    bookAppointmentBtn.addEventListener("click", function () {
      alert("Opening appointment booking form");
    });
  }
}

// Document functionality
function initDocuments() {
  const downloadButtons = document.querySelectorAll(".download-btn");
  downloadButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const documentName =
        this.closest(".document-card").querySelector("h4").textContent;
      alert(`Downloading ${documentName}`);
    });
  });
}

// Animation effects for dashboard elements
function animateDashboardElements() {
  // Animate section headers on scroll
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Add CSS for animations
  const style = document.createElement("style");
  style.textContent = `
          .section {
              opacity: 0;
              transform: translateY(20px);
              transition: opacity 0.5s ease, transform 0.5s ease;
          }
          
          .section.visible {
              opacity: 1;
              transform: translateY(0);
          }
          
          .notifications i.animated {
              animation: bell-ring 0.5s ease;
          }
          
          @keyframes bell-ring {
              0%, 100% { transform: rotate(0); }
              20%, 60% { transform: rotate(15deg); }
              40%, 80% { transform: rotate(-15deg); }
          }
      `;
  document.head.appendChild(style);

  // Animate welcome section buttons
  const actionButtons = document.querySelectorAll(".action-buttons .btn");
  actionButtons.forEach((btn, index) => {
    btn.style.opacity = "0";
    btn.style.transform = "translateY(20px)";
    btn.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    btn.style.transitionDelay = `${index * 0.2}s`;

    setTimeout(() => {
      btn.style.opacity = "1";
      btn.style.transform = "translateY(0)";
    }, 300);
  });
}

// Listen for the emergency help button click
document.addEventListener("DOMContentLoaded", function () {
  const emergencyBtn = document.querySelector(".btn.emergency");
  if (emergencyBtn) {
    emergencyBtn.addEventListener("click", function () {
      alert(
        "EMERGENCY LEGAL ASSISTANCE LINE: +233-20-000-0000\n\nThis will connect you to a legal professional immediately."
      );
    });
  }

  // Action buttons in welcome section
  const bookConsultationBtn = document.querySelector(
    ".action-buttons .btn.primary"
  );
  if (bookConsultationBtn) {
    bookConsultationBtn.addEventListener("click", function () {
      alert("Opening consultation booking form");
    });
  }

  const viewAllCasesBtn = document.querySelector(
    ".action-buttons .btn.secondary"
  );
  if (viewAllCasesBtn) {
    viewAllCasesBtn.addEventListener("click", function () {
      alert("Loading all your legal cases");
    });
  }
});

// Additional script for dark mode functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get the dark mode icon
  const darkModeIcon = document.getElementById("darkModeIcon");

  // Check if dark mode is already enabled (from the head script)
  if (document.body.classList.contains("dark-mode")) {
    // Update icon to sun
    if (darkModeIcon) {
      darkModeIcon.className = "fas fa-sun";
    }
  }

  // Log for debugging
  console.log(
    "Dark mode initialized. Current state:",
    document.body.classList.contains("dark-mode") ? "Dark" : "Light"
  );
});

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", function () {
  // Clear session data (e.g., token)
  localStorage.removeItem("authToken");
  alert("You have been logged out.");
  // Redirect to login page
  window.location.href = "../html/auth.html";
});
