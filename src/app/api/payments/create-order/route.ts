/**
 * API Route: Create Razorpay Order
 * Creates a payment order for appointment booking
 */

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  // Initialize services inside the handler to avoid build-time issues
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RDdW9qvO6iNMIW',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '86N1d0ibtUHCV3ikxnTl3HWe',
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    const { amount, appointmentId } = await request.json();

    if (!amount || !appointmentId) {
      return NextResponse.json(
        { error: 'Amount and appointment ID are required' },
        { status: 400 }
      );
    }

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${appointmentId}`,
      notes: {
        appointment_id: appointmentId,
        booking_ref: appointment.booking_ref,
      },
    };

    const order = await razorpay.orders.create(options);

    // Store order details in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        appointment_id: appointmentId,
        client_id: appointment.client_id,
        provider_id: appointment.provider_id,
        amount: amount,
        currency: 'INR',
        gateway: 'razorpay',
        razorpay_order_id: order.id,
        status: 'pending',
        base_amount: appointment.amount,
      });

    if (paymentError) {
      console.error('Failed to store payment record:', paymentError);
      // Continue anyway - payment can still be processed
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
