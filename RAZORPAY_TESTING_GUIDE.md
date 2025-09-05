# Razorpay Payment Gateway Testing Guide

## Current Implementation Status ✅

### 1. Environment Variables Configured
✅ **Test Mode Keys Added to .env:**
- `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RDdW9qvO6iNMIW`
- `RAZORPAY_KEY_SECRET=86N1d0ibtUHCV3ikxnTl3HWe`

### 2. Code Implementation
✅ **Backend API Routes:**
- `/api/payments/create-order` - Creates Razorpay order
- `/api/payments/verify` - Verifies payment signature

✅ **Frontend Integration:**
- Payment flow in service provider booking pages
- Razorpay SDK integration in `/lib/razorpay.ts`
- Payment UI components in booking flows

✅ **Database Tables:**
- `payments` table configured in Supabase
- Stores order details and payment status

## ⚠️ Issues Found in Current Implementation

### 1. Payment Flow Not Connected to Razorpay
**Problem:** The current `handlePayment` function in booking pages directly creates appointments without actually processing payments through Razorpay.

**Current Code (Line 118-148 in counselling/[providerId]/page.tsx):**
```javascript
const handlePayment = async () => {
  // Currently just books appointment without payment
  await bookAppointment({...});
  router.push('/dashboard?booking=success');
}
```

**Required Fix:** Need to integrate actual Razorpay payment flow.

## 🔧 Razorpay Dashboard Configuration

### Required Settings in Razorpay Dashboard

1. **Login to Razorpay Dashboard**
   - Go to https://dashboard.razorpay.com
   - Use your test mode credentials

2. **Webhook Configuration (Important!)**
   - Navigate to: Settings → Webhooks
   - Add webhook endpoint: `https://yourdomain.com/api/payments/webhook`
   - Select events:
     - ✅ payment.authorized
     - ✅ payment.captured
     - ✅ payment.failed
     - ✅ order.paid
   - Note: Webhook secret will be needed for signature verification

3. **Payment Methods**
   - Navigate to: Settings → Payment Methods
   - Enable in test mode:
     - ✅ Cards
     - ✅ UPI
     - ✅ Wallets (Paytm, PhonePe, etc.)
     - ✅ NetBanking

4. **Business Settings**
   - Navigate to: Settings → Configuration
   - Set business details:
     - Business Name: MyndZeal
     - Category: Healthcare Services
     - Sub-category: Mental Health Services

5. **Test Cards for Testing**
   Use these test cards in test mode:
   - **Success:** 4111 1111 1111 1111
   - **Failure:** 4000 0000 0000 0002
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date

## 🛠️ Implementation Fixes Required

### Fix 1: Update Payment Handler
Create a proper payment flow in the booking pages:

```typescript
// In src/app/services/counselling/[providerId]/page.tsx (and similar files)

import { initializePayment } from '@/lib/razorpay';

const handlePayment = async () => {
  if (!selectedSlot || !formattedProvider) return;
  
  setProcessing(true);
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // First create the appointment in pending status
    const appointmentData = {
      provider_id: providerId,
      slot_id: selectedSlot.id,
      client_id: user.id,
      appointment_date: selectedSlot.date,
      appointment_time: selectedSlot.time,
      session_type: selectedSlot.sessionType,
      session_mode: sessionMode,
      notes,
      fee: selectedSlot.fee,
      status: 'pending', // Important: Set as pending
      payment_status: 'pending'
    };
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
      
    if (error) throw error;
    
    // Get user details for Razorpay
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', user.id)
      .single();
    
    // Initialize Razorpay payment
    await initializePayment(
      selectedSlot.fee,
      appointment.id,
      {
        name: profile?.full_name || '',
        email: profile?.email || user.email || '',
        phone: profile?.phone || ''
      },
      async (response) => {
        // Payment successful - verify on backend
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            appointment_id: appointment.id
          })
        });
        
        if (verifyRes.ok) {
          router.push('/dashboard?booking=success');
        } else {
          throw new Error('Payment verification failed');
        }
      },
      (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      }
    );
    
  } catch (error) {
    console.error('Booking failed:', error);
    alert('Failed to initialize payment. Please try again.');
  } finally {
    setProcessing(false);
  }
};
```

### Fix 2: Add Webhook Handler
Create webhook route at `src/app/api/payments/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');
      
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const event = JSON.parse(body);
    
    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        // Update payment and appointment status
        await handlePaymentCaptured(event.payload.payment.entity, supabase);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity, supabase);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentCaptured(payment: any, supabase: any) {
  // Update payment record
  await supabase
    .from('payments')
    .update({
      status: 'completed',
      razorpay_payment_id: payment.id,
      completed_at: new Date().toISOString()
    })
    .eq('razorpay_order_id', payment.order_id);
    
  // Update appointment status
  const { data: paymentRecord } = await supabase
    .from('payments')
    .select('appointment_id')
    .eq('razorpay_order_id', payment.order_id)
    .single();
    
  if (paymentRecord) {
    await supabase
      .from('appointments')
      .update({
        status: 'confirmed',
        payment_status: 'completed'
      })
      .eq('id', paymentRecord.appointment_id);
  }
}

async function handlePaymentFailed(payment: any, supabase: any) {
  // Update payment record
  await supabase
    .from('payments')
    .update({
      status: 'failed',
      failed_at: new Date().toISOString()
    })
    .eq('razorpay_order_id', payment.order_id);
    
  // Update appointment status
  const { data: paymentRecord } = await supabase
    .from('payments')
    .select('appointment_id')
    .eq('razorpay_order_id', payment.order_id)
    .single();
    
  if (paymentRecord) {
    await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        payment_status: 'failed'
      })
      .eq('id', paymentRecord.appointment_id);
  }
}
```

### Fix 3: Add Webhook Secret to .env
```bash
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_dashboard
```

## 📋 Testing Checklist

### Pre-Testing Setup
- [ ] Verify test keys are in .env file
- [ ] Implement the payment handler fixes above
- [ ] Create webhook handler route
- [ ] Configure webhook in Razorpay dashboard
- [ ] Add webhook secret to .env

### Testing Flow

1. **Book an Appointment:**
   - Navigate to any service provider page
   - Select a time slot
   - Fill in booking details
   - Click "Proceed to Payment"

2. **Payment Page Testing:**
   - [ ] Verify Razorpay checkout modal opens
   - [ ] Check business name displays correctly
   - [ ] Verify amount matches booking fee
   - [ ] Test with success card: 4111 1111 1111 1111
   - [ ] Test with failure card: 4000 0000 0000 0002

3. **Post-Payment Verification:**
   - [ ] Check appointment status in database
   - [ ] Verify payment record created
   - [ ] Check redirect to dashboard
   - [ ] Verify success message displays

4. **Error Scenarios:**
   - [ ] Test payment cancellation
   - [ ] Test network failure
   - [ ] Test invalid card details
   - [ ] Verify error messages display correctly

### Database Verification
Check in Supabase:
```sql
-- Check payment records
SELECT * FROM payments 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Check appointment status
SELECT * FROM appointments 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

## 🐛 Troubleshooting

### Common Issues

1. **"Razorpay is not defined"**
   - Ensure Razorpay script loads properly
   - Check browser console for script errors

2. **Payment signature verification fails**
   - Verify RAZORPAY_KEY_SECRET matches dashboard
   - Check order_id and payment_id are correct

3. **Webhook not receiving events**
   - Use ngrok for local testing: `ngrok http 3000`
   - Update webhook URL in dashboard
   - Check webhook secret matches

4. **Amount mismatch errors**
   - Ensure amount is in paise (multiply by 100)
   - Check currency is set to INR

## 📱 Mobile Testing
- Test on mobile browsers
- Verify UPI flow works
- Check responsive design of payment modal

## 🚀 Production Checklist
Before going live:
- [ ] Replace test keys with live keys
- [ ] Update webhook URL to production domain
- [ ] Enable all required payment methods
- [ ] Complete KYC in Razorpay dashboard
- [ ] Test with small real payment
- [ ] Set up payment failure notifications
- [ ] Configure refund policies

## 📞 Support
- Razorpay Support: https://razorpay.com/support/
- API Documentation: https://razorpay.com/docs/api/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/
