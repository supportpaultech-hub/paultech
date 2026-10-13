// Helper function to load Razorpay Checkout Script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Function to trigger Official Razorpay Standard Popup Modal
export const openRazorpayPopup = async ({
  amount = 1000,
  title = "Industrial Internship Registration",
  candidateName = "",
  candidateEmail = "",
  candidatePhone = "",
  onSuccess,
  onFailure,
  onDismiss
}) => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!keyId || keyId.trim() === '') {
    if (onFailure) {
      onFailure('Razorpay Key ID missing! Please add VITE_RAZORPAY_KEY_ID in frontend/.env file.');
    }
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    if (onFailure) {
      onFailure('Failed to load Razorpay SDK script. Please check your internet connection.');
    }
    return;
  }

  const options = {
    key: keyId.trim(),
    amount: amount * 100, // Amount in paise (1000 INR = 100000 paise)
    currency: 'INR',
    name: 'PaulTech Software Services',
    description: title,
    image: 'https://paultech-website.onrender.com/logo.png',
    prefill: {
      name: candidateName,
      email: candidateEmail,
      contact: candidatePhone
    },
    notes: {
      purpose: title,
      candidate: candidateName
    },
    theme: {
      color: '#f97316' // Orange theme matching website
    },
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id || `RZP-${Date.now()}`,
          orderId: response.razorpay_order_id || '',
          signature: response.razorpay_signature || '',
          paymentMethod: 'Razorpay Gateway',
          amount: amount
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss();
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      if (onFailure) {
        onFailure(response.error?.description || 'Payment Failed');
      }
    });
    rzp.open();
  } catch (err) {
    console.error('Error opening Razorpay popup modal:', err);
    if (onFailure) onFailure('Error launching Razorpay Gateway.');
  }
};
