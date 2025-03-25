// Base URL for the backend API
const API_BASE_URL = '/api';

// Modals
document.addEventListener('DOMContentLoaded', function () {
  const openModalBtn = document.querySelectorAll('#openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('consultationModal');
  const bookingForm = document.getElementById('bookingForm');

  // Open Modal
  openModalBtn.forEach((btn) =>
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      modal.style.display = 'flex';
    })
  );

  // Close Modal
  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  // Close Modal When Clicking Outside
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Handle Form Submission
  bookingForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page reload

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value;

    console.log('Consultation Booked:', { name, email, date, message });

    alert('Your consultation has been booked!');

    modal.style.display = 'none';
    bookingForm.reset();
  });
});

// Modal 2
document.addEventListener('DOMContentLoaded', function () {
  const searchModal = document.getElementById('searchModal');
  const openSearchBtn = document.getElementById('openSearch');
  const closeSearchBtn = document.getElementById('closeSearch');

  // Open Modal
  openSearchBtn.addEventListener('click', function () {
    searchModal.style.display = 'flex';
  });

  // Close Modal
  closeSearchBtn.addEventListener('click', function () {
    searchModal.style.display = 'none';
  });

  // Close Modal when clicking outside the box
  window.addEventListener('click', function (event) {
    if (event.target === searchModal) {
      searchModal.style.display = 'none';
    }
  });
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function () {
  // Check if the user is authenticated
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('You are not logged in. Redirecting to login page...');
    window.location.href = '../html/auth.html';
    return;
  }

  // Initialize sidebar navigation
  initSidebar();

  // Initialize search functionality
  initSearch();

  // Initialize case cards (fetch cases dynamically)
  await initCaseCards();

  // Initialize AI assistant
  initAIAssistant();

  // Initialize appointment actions
  initAppointments();

  // Initialize document downloads
  initDocuments();

  // Add animation effects to dashboard elements
  animateDashboardElements();

  // Fetch user profile to update the UI
  await fetchUserProfile(token);
});

// Fetch user profile to display name and role
async function fetchUserProfile(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data.user;
    console.log('User Profile:', user);

    // Update the UI with user details
    document.getElementById('user-name').textContent = user.name || 'User';
    document.getElementById('user-role').textContent = user.role || 'Citizen';
    document.getElementById('welcome-message').textContent = `Welcome back, ${
      user.name || 'User'
    }!`;

    // Optionally update the profile image if the backend provides a URL
    if (user.profileImage) {
      document.getElementById('profile-img').src = user.profileImage;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '../html/auth.html';
    } else {
      alert('Failed to load user profile. Please try again later.');
    }
  }
}

// Sidebar navigation functionality
function initSidebar() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item) => {
    item.addEventListener('click', function (e) {
      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove('active'));

      // Add active class to clicked item
      this.classList.add('active');

      // Prevent default action if it's just a placeholder link
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
      }
    });
  });
}

// Search functionality
function initSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const searchIcon = document.querySelector('.search-bar i');

  if (searchInput && searchIcon) {
    // Search on Enter key
    searchInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        performSearch(this.value);
      }
    });

    // Search on icon click
    searchIcon.addEventListener('click', function () {
      performSearch(searchInput.value);
    });
  }

  // Notification bell animation
  const notificationBell = document.querySelector('.notifications i');
  if (notificationBell) {
    notificationBell.addEventListener('click', function () {
      this.classList.add('animated');
      setTimeout(() => {
        this.classList.remove('animated');
      }, 1000);

      alert('You have 3 new notifications');
    });
  }
}

// Search function
function performSearch(query) {
  if (!query || query.trim() === '') {
    alert('Please enter a search term');
    return;
  }

  console.log('Searching for:', query);
  alert(`Searching for: ${query}`);
}

// Case cards functionality
async function initCaseCards() {
  // Fetch cases from the backend
  await fetchCases();

  // Message buttons
  const messageButtons = document.querySelectorAll('.action-btn.message');
  messageButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const lawyerName =
        this.closest('.case-details').querySelector('h4').textContent;
      alert(`Opening message window to ${lawyerName}`);
    });
  });

  // Details buttons
  const detailButtons = document.querySelectorAll('.action-btn.details');
  detailButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const caseType =
        this.closest('.case-card').querySelector('.case-type').textContent;
      alert(`Viewing details for case: ${caseType}`);
    });
  });

  // Assign buttons
  const assignButtons = document.querySelectorAll('.action-btn.assign');
  assignButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const caseId = this.closest('.case-card').dataset.caseId;
      const lawyerId = prompt('Enter the Lawyer ID to assign this case to:');
      if (lawyerId) {
        assignCase(caseId, lawyerId);
      } else {
        alert('Please provide a Lawyer ID.');
      }
    });
  });

  // Submit new case button
  const submitCaseBtn = document.querySelector('#submit-case-btn');
  if (submitCaseBtn) {
    submitCaseBtn.addEventListener('click', function () {
      const caseTitle = prompt('Enter the title of your new case:');
      const caseDescription = prompt('Enter a brief description of your case:');

      if (caseTitle && caseDescription) {
        submitNewCase(caseTitle, caseDescription);
      } else {
        alert('Please provide both a title and description for the case.');
      }
    });
  }

  // Case progress animation
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.transition = 'width 1s ease-in-out';
      bar.style.width = width;
    }, 300);
  });
}

// Fetch cases from the backend
async function fetchCases() {
  const token = localStorage.getItem('authToken');
  const caseCardsContainer = document.getElementById('case-cards');

  try {
    const response = await axios.get(`${API_BASE_URL}/cases/client`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cases = response.data.cases || [];
    console.log('Fetched Cases:', cases);

    // Clear existing case cards
    caseCardsContainer.innerHTML = '';

    if (cases.length === 0) {
      caseCardsContainer.innerHTML = '<p>No active cases found.</p>';
      return;
    }

    // Dynamically create case cards
    cases.forEach((caseItem) => {
      const caseCard = document.createElement('div');
      caseCard.classList.add('case-card');
      caseCard.dataset.caseId = caseItem.id; // Store case ID for assignment

      // Determine status class
      let statusClass = 'pending';
      let statusText = caseItem.status;
      if (caseItem.status === 'OPEN') {
        statusClass = 'pending';
        statusText = 'Open';
      } else if (caseItem.status === 'ASSIGNED') {
        statusClass = 'active';
        statusText = 'Active';
      } else if (caseItem.status === 'CLOSED') {
        statusClass = 'finalizing';
        statusText = 'Closed';
      }

      // Determine progress (for demonstration; adjust based on backend data)
      const progress =
        caseItem.status === 'OPEN'
          ? 20
          : caseItem.status === 'ASSIGNED'
          ? 80
          : 95;

      caseCard.innerHTML = `
        <div class="case-type">${caseItem.title || 'Untitled Case'}</div>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${progress}%"></div>
          <span class="progress-text">${progress}%</span>
        </div>
        <div class="case-details">
          <div class="lawyer-info">
            <img src="${
              caseItem.lawyerImage || '../images/harvey.jpeg'
            }" alt="Lawyer" />
            <div>
              <p>Assigned Lawyer:</p>
              <h4>${caseItem.lawyerName || 'Unassigned'}</h4>
            </div>
          </div>
          <div class="case-actions">
            <button class="action-btn message">
              <i class="fas fa-comment"></i>
            </button>
            <button class="action-btn details">
              <i class="fas fa-info-circle"></i>
            </button>
            ${
              caseItem.status === 'OPEN'
                ? `<button class="action-btn assign">
                     <i class="fas fa-user-plus"></i>
                   </button>`
                : ''
            }
          </div>
        </div>
        <div class="case-status">
          <span class="status ${statusClass}">${statusText}</span>
        </div>
      `;

      caseCardsContainer.appendChild(caseCard);
    });

    // Reinitialize event listeners for the new case cards
    const messageButtons = document.querySelectorAll('.action-btn.message');
    messageButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const lawyerName =
          this.closest('.case-details').querySelector('h4').textContent;
        alert(`Opening message window to ${lawyerName}`);
      });
    });

    const detailButtons = document.querySelectorAll('.action-btn.details');
    detailButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const caseType =
          this.closest('.case-card').querySelector('.case-type').textContent;
        alert(`Viewing details for case: ${caseType}`);
      });
    });

    const assignButtons = document.querySelectorAll('.action-btn.assign');
    assignButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const caseId = this.closest('.case-card').dataset.caseId;
        const lawyerId = prompt('Enter the Lawyer ID to assign this case to:');
        if (lawyerId) {
          assignCase(caseId, lawyerId);
        } else {
          alert('Please provide a Lawyer ID.');
        }
      });
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '../html/auth.html';
    } else {
      caseCardsContainer.innerHTML =
        '<p>Failed to load cases. Please try again later.</p>';
    }
  }
}

// Submit a new case to the backend
async function submitNewCase(title, description) {
  const token = localStorage.getItem('authToken');

  try {
    const response = await axios.post(
      `${API_BASE_URL}/cases/create`,
      {
        title,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    alert('Case submitted successfully!');
    console.log('New Case Response:', response.data);

    // Refresh the case list
    await fetchCases();
  } catch (error) {
    console.error('Error submitting case:', error);
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '../html/auth.html';
    } else {
      alert('Failed to submit case. Please try again later.');
    }
  }
}

// Assign a case to a lawyer
async function assignCase(caseId, lawyerId) {
  const token = localStorage.getItem('authToken');

  try {
    const response = await axios.put(
      `${API_BASE_URL}/cases/assign/${caseId}`,
      { lawyerId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    alert('Case assigned successfully!');
    console.log('Case Assignment Response:', response.data);

    // Refresh the case list
    await fetchCases();
  } catch (error) {
    console.error('Error assigning case:', error);
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '../html/auth.html';
    } else {
      alert(
        error.response?.data?.message ||
          'Failed to assign case. Please try again later.'
      );
    }
  }
}

// AI Assistant functionality
function initAIAssistant() {
  const aiInput = document.querySelector('.ai-input input');
  const sendBtn = document.querySelector('.send-btn');
  const suggestionBtns = document.querySelectorAll('.suggestion-btn');

  // Send question on button click
  if (sendBtn && aiInput) {
    sendBtn.addEventListener('click', function () {
      askQuestion(aiInput.value);
      aiInput.value = '';
    });

    // Send question on Enter key
    aiInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        askQuestion(this.value);
        this.value = '';
      }
    });
  }

  // Suggestion buttons
  suggestionBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const question = this.querySelector('span').textContent;
      askQuestion(question);
    });
  });
}

// Ask AI Assistant a question
function askQuestion(question) {
  if (!question || question.trim() === '') {
    alert('Please enter a question');
    return;
  }

  // In a real application, this would connect to an AI backend
  console.log('Question:', question);

  // For demonstration, show a simulated response
  const responses = {
    'Basic contracts':
      'Basic contracts require offer, acceptance, consideration, and the intention to create legal relations.',
    'Rent agreements':
      'Rent agreements should specify the term, rent amount, security deposit, and maintenance responsibilities.',
    'Court process':
      'The court process typically involves filing a complaint, discovery, pre-trial motions, trial, and potentially appeals.',
    'Your rights':
      'Your fundamental rights include the right to equality, freedom of speech, and protection under the law.',
  };

  // Check if we have a canned response
  let response = '';
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
    '.appointment-actions .btn'
  );
  rescheduleButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const appointmentTitle =
        this.closest('.appointment-card').querySelector('h4').textContent;
      const buttonText = this.textContent.trim();

      if (buttonText === 'Reschedule') {
        alert(`Opening reschedule form for: ${appointmentTitle}`);
      } else if (buttonText === 'Directions') {
        alert(`Showing directions to: High Court, Accra`);
      }
    });
  });

  // Book appointment button
  const bookAppointmentBtn = document.querySelector(
    '.appointments .btn.outline'
  );
  if (bookAppointmentBtn) {
    bookAppointmentBtn.addEventListener('click', function () {
      alert('Opening appointment booking form');
    });
  }
}

// Document functionality
function initDocuments() {
  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const documentName =
        this.closest('.document-card').querySelector('h4').textContent;
      alert(`Downloading ${documentName}`);
    });
  });
}

// Animation effects for dashboard elements
function animateDashboardElements() {
  // Animate section headers on scroll
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
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
  const style = document.createElement('style');
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
  const actionButtons = document.querySelectorAll('.action-buttons .btn');
  actionButtons.forEach((btn, index) => {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(20px)';
    btn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    btn.style.transitionDelay = `${index * 0.2}s`;

    setTimeout(() => {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    }, 300);
  });
}

// Listen for the emergency help button click
document.addEventListener('DOMContentLoaded', function () {
  const emergencyBtn = document.querySelector('.btn.emergency');
  if (emergencyBtn) {
    emergencyBtn.addEventListener('click', function () {
      alert(
        'EMERGENCY LEGAL ASSISTANCE LINE: +233-20-000-0000\n\nThis will connect you to a legal professional immediately.'
      );
    });
  }

  // Action buttons in welcome section
  // const bookConsultationBtn = document.querySelector(
  //   ".action-buttons .btn.primary"
  // );
  // if (bookConsultationBtn) {
  //   bookConsultationBtn.addEventListener("click", function () {
  //     alert("Opening consultation booking form");
  //   });
  // }

  const viewAllCasesBtn = document.querySelector(
    '.action-buttons .btn.secondary'
  );
  if (viewAllCasesBtn) {
    viewAllCasesBtn.addEventListener('click', function () {
      alert('Loading all your legal cases');
    });
  }
});

// Additional script for dark mode functionality
document.addEventListener('DOMContentLoaded', function () {
  // Get the dark mode icon
  const darkModeIcon = document.getElementById('darkModeIcon');

  // Check if dark mode is already enabled (from the head script)
  if (document.body.classList.contains('dark-mode')) {
    // Update icon to sun
    if (darkModeIcon) {
      darkModeIcon.className = 'fas fa-sun';
    }
  }

  // Log for debugging
  console.log(
    'Dark mode initialized. Current state:',
    document.body.classList.contains('dark-mode') ? 'Dark' : 'Light'
  );
});

// Logout functionality
document
  .getElementById('logout-btn')
  .addEventListener('click', async function () {
    const token = localStorage.getItem('authToken');

    try {
      // Notify the backend to invalidate the token
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear session data (e.g., token)
      localStorage.removeItem('authToken');
      alert('You have been logged out.');
      // Redirect to login page
      window.location.href = '../html/auth.html';
    }
  });
