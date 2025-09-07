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
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
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
      razorpay_signature
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

    // Fetch payment row using transaction_id, fallback to razorpay_order_id
    let paymentRow: any = null;
    let paymentErr: any = null;
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('transaction_id', razorpay_order_id)
        .single();
      paymentRow = data; paymentErr = error || null;
    } catch (_) {}

    if (!paymentRow) {
      const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();
      paymentRow = paymentRow || data;
    }

    if (!paymentRow) {
      console.error('Payment record not found for order:', razorpay_order_id);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // Create appointment only after successful payment
    let appointmentId: string | null = paymentRow.appointment_id || null;

    if (!appointmentId) {
      const intent = paymentRow.metadata?.intent || {};

      // Helpers
      const toHHMMSS = (t: string) => (t && /^\d{2}:\d{2}:\d{2}$/.test(t) ? t : `${t || '00:00'}:00`);
      const addMinutes = (time: string, mins: number) => {
        const [h, m] = (time || '00:00').split(':').map((x: string) => parseInt(x, 10));
        const d = new Date(0, 0, 0, h || 0, m || 0, 0);
        d.setMinutes(d.getMinutes() + (mins || 45));
        const hh = `${d.getHours()}`.padStart(2, '0');
        const mm = `${d.getMinutes()}`.padStart(2, '0');
        return `${hh}:${mm}:00`;
      };

      const start_time = toHHMMSS(String(intent.start_time || '00:00'));
      const duration = Number(intent.duration) || 45;
      const end_time = addMinutes(start_time, duration);

      const insertRow: any = {
        booking_ref: (intent.booking_ref as string) || `AUTO-${Date.now()}`,
        client_id: intent.client_id || null,
        client_name: intent.client_name || null,
        client_email: intent.client_email || null,
        client_phone: intent.client_phone || null,
        provider_id: intent.provider_id || null,
        slot_id: intent.slot_id || null,
        appointment_date: intent.appointment_date,
        start_time,
        end_time,
        duration,
        session_type: intent.session_type || null,
        session_mode: intent.session_mode || null,
        listener_session_type: intent.service === 'listening' ? (intent.listener_session_type || intent.session_mode || 'audio') : null,
        is_emergency: !!intent.is_emergency,
        preferred_language: intent.preferred_language || null,
        client_message: intent.client_message || null,
        status: intent.service === 'listening' ? 'scheduled' : 'confirmed',
        amount: Number(intent.amount) || paymentRow.amount || 0,
        payment_status: 'completed',
        payment_id: razorpay_payment_id,
      };

      const { data: created, error: apptErr } = await supabase
        .from('appointments')
        .insert(insertRow)
        .select('id')
        .single();

      if (apptErr) {
        console.error('Failed to create appointment after payment:', apptErr, 'insertRow:', insertRow);
      } else {
        appointmentId = created.id;
      }
    }

    // Update payment status and link appointment
    try {
      await supabase
        .from('payments')
        .update({
          payment_method: 'razorpay',
          status: 'completed',
          completed_at: new Date().toISOString(),
          razorpay_payment_id: razorpay_payment_id,
          appointment_id: appointmentId,
        })
        .eq('transaction_id', razorpay_order_id);
    } catch (e) {
      console.warn('Payment update warning:', e);
    }

    // If appointment exists and is online, attach stream id (optional)
    if (appointmentId) {
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*, slot:slots(*)')
        .eq('id', appointmentId)
        .single();

      if (appointment?.session_mode === 'online' || appointment?.slot?.session_mode === 'online') {
        const streamCallId = `call_${appointment.id}`;
        await supabase
          .from('appointments')
          .update({
            stream_call_id: streamCallId,
          })
          .eq('id', appointmentId);
      }
    }

    return NextResponse.json({
      success: true,
      payment_id: razorpay_payment_id,
      appointment_id: appointmentId,
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
