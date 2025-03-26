document.addEventListener("DOMContentLoaded", function () {
  const cases = [
    {
      id: 1,
      title: "Property Dispute - Land Ownership",
      status: "open",
      date: "2025-03-15",
      description: "Dispute over land ownership in Accra Central",
      lawyer: "Kwame Asante",
    },
    {
      id: 2,
      title: "Employment Contract Breach",
      status: "closed",
      date: "2025-02-10",
      description: "Unlawful termination of employment contract",
      lawyer: "Ama Serwaa",
    },
    {
      id: 3,
      title: "Divorce Settlement",
      status: "open",
      date: "2025-03-20",
      description: "Negotiating terms of divorce settlement",
      lawyer: "Yaw Boateng",
    },
  ];

  const activeCasesContainer = document.getElementById("active-cases");
  const closedCasesContainer = document.getElementById("closed-cases");

  function showCaseDetails(caseItem) {
    alert(
      `Case Details:\n\nTitle: ${caseItem.title}\nStatus: ${caseItem.status}\nDate: ${caseItem.date}\nLawyer: ${caseItem.lawyer}\nDescription: ${caseItem.description}`
    );
  }

  cases.forEach((caseItem) => {
    const caseCard = document.createElement("div");
    caseCard.className = "case-card";

    const statusClass =
      caseItem.status === "open" ? "status-open" : "status-closed";
    const statusText = caseItem.status === "open" ? "Open" : "Closed";

    caseCard.innerHTML = `
            <div class="case-status ${statusClass}">${statusText}</div>
            <h4>${caseItem.title}</h4>
            <p><strong>Date:</strong> ${caseItem.date}</p>
            <p><strong>Lawyer:</strong> ${caseItem.lawyer}</p>
            <p>${caseItem.description}</p>
            <div class="case-actions">
                <button class="action-btn btn-primary view-details">View Details</button>
                <button class="action-btn btn-secondary">Message Lawyer</button>
            </div>
        `;

    // Add click event listener to view details button
    caseCard.querySelector(".view-details").addEventListener("click", () => {
      showCaseDetails(caseItem);
    });

    if (caseItem.status === "open") {
      activeCasesContainer.appendChild(caseCard);
    } else {
      closedCasesContainer.appendChild(caseCard);
    }
  });
}); // Update case.js
const messageModal = document.getElementById("messageModal");
const messageForm = document.getElementById("messageForm");

function showMessageLawyer(lawyerName) {
  document.getElementById(
    "messageLawyerTitle"
  ).textContent = `Message ${lawyerName}`;
  messageModal.style.display = "block";
}

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
