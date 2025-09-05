/**
 * Razorpay Integration for Client Web
 * Test Mode Configuration
 */

import crypto from 'crypto';

// Razorpay Test Credentials
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RDdW9qvO6iNMIW';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '86N1d0ibtUHCV3ikxnTl3HWe';

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

// Verify Razorpay signature
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const text = `${orderId}|${paymentId}`;
  const generated = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  
  return generated === signature;
};

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
  appointmentId: string,
  userDetails: {
    name: string;
    email: string;
    phone: string;
  },
  onSuccess: (response: RazorpayResponse) => void,
  onError: (error: unknown) => void
): Promise<void> => {
  try {
    // Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Create order via API
    const orderResponse = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        appointmentId,
      }),
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create payment order');
    }

    const orderData = await orderResponse.json();

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
          onError(new Error('Payment cancelled by user'));
        },
      },
    };

    // Open Razorpay checkout
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
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
