# 🎉 Razorpay Payment Testing on Localhost

## ✅ Everything is Ready!

I've fixed the payment integration. The Razorpay checkout will now actually trigger when you book an appointment!

## 🚀 Quick Test Guide

### Step 1: Start the Application
Your app is already running on: **http://localhost:3001**

### Step 2: Test Booking Flow

1. **Navigate to any service page:**
   - http://localhost:3001/services/counselling
   - http://localhost:3001/services/psychiatrists
   - http://localhost:3001/services/psychologists
   - http://localhost:3001/services/listening (Anonymous listening sessions)

2. **Select a provider** and click "Book Appointment"

3. **Choose a time slot** from available options

4. **Fill booking details:**
   - Select session type
   - Choose session mode (video/audio/in-person)
   - Add any notes (optional)

5. **Click "Proceed to Payment"**

### Step 3: Razorpay Checkout

When you click Pay, the **Razorpay checkout modal will open** with:
- Your test amount
- Business name: MyndZeal
- Test mode indicator

### Step 4: Test Card Details

Use these **test cards** in the Razorpay modal:

#### ✅ Successful Payment:
- **Card Number:** `4111 1111 1111 1111`
- **Expiry:** Any future date (e.g., `12/25`)
- **CVV:** Any 3 digits (e.g., `123`)
- **Name:** Any name

#### ❌ Failed Payment:
- **Card Number:** `4000 0000 0000 0002`
- **Expiry:** Any future date
- **CVV:** Any 3 digits

#### 📱 Test UPI:
- **UPI ID:** `success@razorpay`

### Step 5: Complete Payment

1. Enter the test card details
2. Click "Pay ₹[Amount]"
3. Wait for processing
4. You'll be redirected to dashboard on success

## 🔍 Verify Payment Success

### Check Browser Console
Open DevTools (F12) and look for:
- "Payment successful" messages
- Order ID and Payment ID

### Check Database (Supabase)
1. Go to your Supabase dashboard
2. Check these tables:
   - **appointments** - Status should be "confirmed"
   - **payments** - Should have a new record with status "completed"

## 🐛 Troubleshooting

### "Razorpay is not defined"
- Refresh the page - the script needs to load
- Check console for any script loading errors

### Payment doesn't open
- Check if you're logged in
- Make sure an appointment was created (check Supabase)
- Look for errors in browser console

### Payment succeeds but appointment not confirmed
- The `/api/payments/verify` endpoint verifies and updates the status
- Check Network tab in DevTools for API calls
- Check Supabase for payment records

## 🎯 What's Happening Behind the Scenes

1. **Appointment Creation:** Creates appointment with "pending" status
2. **Order Creation:** Creates Razorpay order via `/api/payments/create-order`
3. **Checkout Opens:** Razorpay modal loads with order details
4. **Payment Processing:** You enter test card details
5. **Verification:** Backend verifies signature via `/api/payments/verify`
6. **Status Update:** Appointment marked as "confirmed"
7. **Redirect:** User sent to dashboard with success message

## 📝 Test Scenarios

### ✅ Happy Path
1. Book appointment → Pay with success card → Verify booking confirmed

### ❌ Payment Failure
1. Book appointment → Use failure card → Verify appointment deleted

### 🚫 Payment Cancellation
1. Book appointment → Close Razorpay modal → Verify appointment deleted

## 💡 Tips

- **No Real Money:** Test mode means no actual charges
- **Instant Processing:** Test payments process immediately
- **Multiple Tests:** You can test as many times as you want
- **Check Logs:** Browser console shows detailed payment flow

## 🔗 Useful Links

- **Your App:** http://localhost:3001
- **Razorpay Dashboard:** https://dashboard.razorpay.com (to see test transactions)
- **Test Cards Reference:** https://razorpay.com/docs/payments/payments/test-card-details/

## ⚠️ Important Notes

1. **Test Mode Only:** Your keys are in test mode - no real payments
2. **Webhook Optional:** Webhooks work but aren't required for basic testing
3. **Local Only:** This setup works perfectly on localhost

## 🎊 You're Ready!

Go ahead and test the payment flow. The Razorpay checkout will now open when you try to book an appointment!

If you face any issues, check:
1. Browser console for JavaScript errors
2. Network tab for failed API calls
3. Supabase dashboard for database records
