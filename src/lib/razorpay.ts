/**
 * Razorpay Integration for Client Web
 * Test Mode Configuration
 */

// Razorpay Test Credentials
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RDdW9qvO6iNMIW';

type RazorpayConstructor = new (options: RazorpayOptions) => { open(): void };

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Note: Signature verification should be done on the server side only
// This function is removed from client-side code

// Razorpay options interface
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Initialize Razorpay payment
export const initializePayment = async (
  amount: number,
  intent: Record<string, unknown>,
  userDetails: {
    name: string;
    email: string;
    phone: string;
  },
  onSuccess: (response: RazorpayResponse) => void,
  onError: (error: unknown) => void
): Promise<void> => {
  try {
    console.log('Initializing payment with intent:', intent, 'Amount:', amount);
    
    // Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Razorpay SDK failed to load');
    }
    console.log('Razorpay script loaded successfully');

    // Create order via API
    console.log('Creating order via API...');
    const orderResponse = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        intent,
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json().catch(() => ({}));
      console.error('Order creation failed:', errorData);
      throw new Error(errorData.error || 'Failed to create payment order');
    }

    const orderData = await orderResponse.json();
    console.log('Order created successfully:', orderData);

    // Initialize Razorpay
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'MyndZeal',
      description: 'Session Booking Payment',
      order_id: orderData.id,
      handler: onSuccess,
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      theme: {
        color: '#8BA872',
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled by user');
          onError(new Error('Payment cancelled by user'));
        },
      },
    };

    console.log('Opening Razorpay checkout with options:', options);
    
    // Check if Razorpay is available
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not available on window object');
    }
    
    // Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();
    console.log('Razorpay checkout opened');
  } catch (error) {
    console.error('Payment initialization error:', error);
    onError(error);
  }
};

// Format amount for display (paise to rupees)
export const formatAmount = (amountInPaise: number): string => {
  const amountInRupees = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amountInRupees);
};
