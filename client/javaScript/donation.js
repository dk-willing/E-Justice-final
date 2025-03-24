// Contact Modal
document.addEventListener('DOMContentLoaded', () => {
  // Contact Modal Elements
  const contactModal = document.getElementById('contactModal');
  const contactLink = document.querySelector('#contactUs');
  const closeContactModal = contactModal?.querySelector('.close');

  // Show contact modal when contact link is clicked
  if (contactLink) {
    contactLink.addEventListener('click', function (event) {
      event.preventDefault();
      contactModal.style.display = 'flex';
    });
  }

  // Close contact modal when close button is clicked
  if (closeContactModal) {
    closeContactModal.addEventListener('click', function () {
      contactModal.style.display = 'none';
    });
  }

  // Close contact modal when clicking outside content
  window.addEventListener('click', function (event) {
    if (event.target === contactModal) {
      contactModal.style.display = 'none';
    }
  });

  // Donate Buttons
  const donateBtn = document.getElementById('donateBtn');
  const donateBtn2 = document.getElementById('donateBtn2');

  // Event Listeners for Donate Buttons
  if (donateBtn)
    donateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createPaymentPage();
    });

  if (donateBtn2)
    donateBtn2.addEventListener('click', (e) => {
      e.preventDefault();
      createPaymentPage();
    });

  // Handle verification response from Paystack callback
  const urlParams = new URLSearchParams(window.location.search);
  const reference = urlParams.get('reference');
  if (reference) {
    verifyPayment(reference);
  }
});

// Payment Integration with Backend API
const API_BASE_URL = 'http://localhost:5000/api';

async function createPaymentPage() {
  try {
    const requestBody = {
      metadata: { source: 'donation_page' },
    };

    const response = await fetch(
      `${API_BASE_URL}/payments/create-payment-page`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Redirect to the Paystack Payment Page
      window.location.href = data.payment_page_url;
    } else {
      alert(data.message || 'Failed to create payment page.');
    }
  } catch (error) {
    console.error('Error creating payment page:', error);
    alert('Error creating payment page. Please try again.');
  }
}

async function verifyPayment(reference) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payments/verify?reference=${reference}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert('Payment verified successfully!');
      // Redirect to the donation page client-side
      window.location.href = '../html/donation.html';
    } else {
      alert(data.message || 'Payment verification failed.');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    alert('Error verifying payment. Please contact support.');
  }
}
