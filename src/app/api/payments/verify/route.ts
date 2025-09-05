/**
 * API Route: Verify Razorpay Payment
 * Verifies payment signature and updates payment status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

export async function POST(request: NextRequest) {
  // Initialize services inside the handler
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '86N1d0ibtUHCV3ikxnTl3HWe';
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // appointment_id is not used in this route
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update payment record
    const { data: payment, error: paymentUpdateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (paymentUpdateError) {
      console.error('Failed to update payment:', paymentUpdateError);
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      );
    }

    // Update appointment status to confirmed
    const { error: appointmentError } = await supabase
      .from('appointments')
      .update({
        status: 'confirmed',
        payment_status: 'completed',
        payment_id: razorpay_payment_id,
      })
      .eq('id', payment.appointment_id);

    if (appointmentError) {
      console.error('Failed to update appointment:', appointmentError);
      // Payment is successful, so we don't fail the request
    }

    // Generate Stream call ID for online appointments
    const { data: appointment } = await supabase
      .from('appointments')
      .select('*, slot:slots(*)')
      .eq('id', payment.appointment_id)
      .single();

    if (appointment?.session_mode === 'online' || appointment?.slot?.session_mode === 'online') {
      const streamCallId = `call_${appointment.id}`;
      
      await supabase
        .from('appointments')
        .update({
          stream_call_id: streamCallId,
        })
        .eq('id', payment.appointment_id);
    }

    return NextResponse.json({
      success: true,
      payment_id: razorpay_payment_id,
      appointment_id: payment.appointment_id,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
