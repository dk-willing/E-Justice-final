const API_URL = 'http://localhost:5000/api/auth';

function switchTab(tab) {
  const sliderBall = document.querySelector('.slider-ball');
  const loginButton = document.querySelector(".tab[onclick*='login']");
  const registerButton = document.querySelector(".tab[onclick*='register']");
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const welcomeText = document.getElementById('welcome-text');

  if (tab === 'login') {
    sliderBall.style.left = '5px';
    loginButton.classList.add('active');
    registerButton.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    welcomeText.textContent = 'Welcome Back\nAccess Justice, Anytime, Anywhere';
  } else if (tab === 'register') {
    sliderBall.style.left = 'calc(65% + 5px)';
    // sliderBall.style.right = '5px';
    registerButton.classList.add('active');
    loginButton.classList.remove('active');
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    welcomeText.textContent =
      'Join Our Platform\nCreate an account to access legal services.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const dashboard = document.getElementById('dashboard');
  const userInfo = document.getElementById('user-info');
  const logoutBtn = document.getElementById('logout');
  const userTypeRadios = document.querySelectorAll('input[name="userType"]');
  const lawyerFields = document.getElementById('lawyer-fields');
  const togglePasswordIcons = document.querySelectorAll('.toggle-password');

  // Theme toggle
  function setTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(theme);
    const rightSection = document.querySelector('.right-section');

    if (rightSection) {
      rightSection.classList.remove('light-mode', 'dark-mode');
      rightSection.classList.add(theme);
    }

    const themeIcon = themeToggle.querySelector('i');
    themeIcon.innerHTML = '';

    themeIcon.innerHTML =
      theme === 'light-mode'
        ? '<i class="ri-contrast-2-fill"></i>'
        : '<i class="ri-sun-line"></i>';
    localStorage.setItem('theme', theme);
  }

  function toggleTheme() {
    document.body.classList.contains('light-mode')
      ? setTheme('dark-mode')
      : setTheme('light-mode');
  }

  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme || 'light-mode');
  themeToggle.addEventListener('click', toggleTheme);

  // Show/hide lawyer fields
  userTypeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      lawyerFields.style.display = radio.value === 'LAWYER' ? 'block' : 'none';
    });
  });

  // Password visibility toggle
  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const input = icon.nextElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility';
      } else {
        input.type = 'password';
        icon.textContent = 'lock';
      }
    });
  });

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const jsonData = Object.fromEntries(formData);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      showDashboard();
    } catch (error) {
      alert(error.message);
    }
  });

  // Register
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      showDashboard();
    } catch (error) {
      alert(error.message);
    }
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    dashboard.style.display = 'none';
    document.querySelector('.auth-container').style.display = 'block';
  });

  // Show dashboard
  async function showDashboard() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userInfo.textContent = `Logged in as ${payload.userId}`;
      document.querySelector('.auth-container').style.display = 'none';
      dashboard.style.display = 'block';
    } catch (error) {
      alert('Invalid token');
      localStorage.removeItem('token');
    }
  }

  if (localStorage.getItem('token')) showDashboard();
});
