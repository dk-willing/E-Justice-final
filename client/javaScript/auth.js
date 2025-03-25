const BASE_URL = "http://localhost:5000/api";
const AUTH_URL = `${BASE_URL}/auth`;

function switchTab(tab) {
  const sliderBall = document.querySelector(".slider-ball");
  const loginButton = document.querySelector(".tab[onclick*='login']");
  const registerButton = document.querySelector(".tab[onclick*='register']");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const welcomeText = document.getElementById("welcome-text");

  if (
    !sliderBall ||
    !loginButton ||
    !registerButton ||
    !loginForm ||
    !registerForm ||
    !welcomeText
  ) {
    console.error("One or more DOM elements are missing in switchTab");
    return;
  }

  if (tab === "login") {
    sliderBall.classList.remove("register");
    sliderBall.style.left = "5px";
    sliderBall.classList.add("login");
    loginButton.classList.add("active");
    registerButton.classList.remove("active");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    document.body.classList.remove("register-padding");
    document.body.classList.add("login-padding");
    document.body.style.padding = "10px";
    welcomeText.textContent = "Welcome Back\nAccess Justice, Anytime, Anywhere";
  } else if (tab === "register") {
    sliderBall.classList.remove("login");
    sliderBall.style.left = "calc(67% + 5px)"; // Move ball to the right
    sliderBall.classList.add("register");
    registerButton.classList.add("active");
    loginButton.classList.remove("active");
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    document.body.classList.remove("login-padding");
    document.body.classList.add("register-padding");
    document.body.style.padding = "150px";
    welcomeText.textContent =
      "Join Our Platform\nCreate an account to access legal services.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const userTypeRadios = document.querySelectorAll('input[name="userType"]');
  const lawyerFields = document.getElementById("lawyer-fields");
  const togglePasswordIcons = document.querySelectorAll(".toggle-password");

  // Theme toggle
  function setTheme(theme) {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme);
    const rightSection = document.querySelector(".right-section");

    if (rightSection) {
      rightSection.classList.remove("light-mode", "dark-mode");
      rightSection.classList.add(theme);
    }

    const themeIcon = themeToggle.querySelector("i");
    if (!themeIcon) {
      console.error("Theme icon element is missing");
      return;
    }

    themeIcon.className =
      theme === "light-mode" ? "ri-contrast-2-fill" : "ri-sun-line";
    localStorage.setItem("theme", theme);
  }

  function toggleTheme() {
    document.body.classList.contains("light-mode")
      ? setTheme("dark-mode")
      : setTheme("light-mode");
  }

  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme || "light-mode");
  themeToggle.addEventListener("click", toggleTheme);

  // Show/hide lawyer fields
  if (!lawyerFields) {
    console.error("Lawyer fields element is missing");
  } else {
    const selectedUserType = document.querySelector(
      'input[name="userType"]:checked'
    )?.value;
    lawyerFields.style.display =
      selectedUserType === "LAWYER" ? "block" : "none";

    userTypeRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        lawyerFields.style.display =
          radio.value === "LAWYER" ? "block" : "none";
      });
    });
  }

  // Password visibility toggle
  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = icon.nextElementSibling;
      if (!input || !input.type) {
        console.error("Password input element is missing or invalid");
        return;
      }
      const eyeIcon = icon.querySelector("i");
      if (!eyeIcon) {
        console.error("Eye icon element is missing");
        return;
      }

      if (input.type === "password") {
        input.type = "text";
        eyeIcon.className = "ri-eye-line";
      } else {
        input.type = "password";
        eyeIcon.className = "ri-eye-off-line";
      }
    });
  });

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const jsonData = Object.fromEntries(formData);

    try {
      const response = await axios.post(`${AUTH_URL}/signin`, {
        email: jsonData.email,
        password: jsonData.password,
      });

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      if (jsonData.remember === "on") {
        document.cookie = `authToken=${token}; max-age=${30 * 24 * 60 * 60}`;
      }
      console.log("Login successful:", user);

      if (user.role === "CITIZEN") {
        window.location.href = "../html/citizen-dashboard.html";
      } else if (user.role === "LAWYER") {
        window.location.href = "../html/lawyer-dashboard.html";
      } else {
        throw new Error("Unknown user role");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data,
        error.response?.status
      );
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  });

  // Register
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const jsonData = Object.fromEntries(formData);

    const userData = new FormData();
    userData.append("name", jsonData.fullName);
    userData.append("email", jsonData.email);
    userData.append("phone", jsonData.phone);
    userData.append("location", jsonData.location);
    userData.append("password", jsonData.password);
    userData.append("role", jsonData.userType);

    if (jsonData.userType === "LAWYER") {
      alert("Please wait while we verify your provided documents.Thank You.");
      userData.append("specialization", jsonData.specialization || "");
      userData.append(
        "experience",
        jsonData.experience ? parseInt(jsonData.experience) : 0
      );
      userData.append("licenseNumber", jsonData.licenseNumber || "");
      userData.append(
        "verificationDocument",
        formData.get("verificationDocument")
      );
    }

    try {
      const response = await axios.post(`${AUTH_URL}/signup`, userData);

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      console.log("Registration successful:", user);

      if (user.role === "CITIZEN") {
        window.location.href = "../html/citizen-dashboard.html";
      } else if (user.role === "LAWYER") {
        window.location.href = "../html/lawyer-dashboard.html";
      } else {
        throw new Error("Unknown user role");
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data,
        error.response?.status
      );
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  });

  // Check if already logged in
  const token = localStorage.getItem("authToken");
  if (token) {
    axios
      .get(`${AUTH_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const user = response.data.user;
        if (user.role === "CITIZEN") {
          window.location.href = "../html/citizen-dashboard.html";
        } else if (user.role === "LAWYER") {
          window.location.href = "../html/lawyer-dashboard.html";
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching user profile:",
          error.response?.data,
          error.response?.status
        );
        localStorage.removeItem("authToken");
      });
  }
});
