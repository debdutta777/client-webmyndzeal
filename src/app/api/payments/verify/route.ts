/**
 * API Route: Verify Razorpay Payment
 * Verifies payment signature and updates payment status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

interface PaymentRow {
  appointment_id?: string | null;
  metadata?: { intent?: Record<string, unknown> } | null;
  amount?: number | null;
}

interface AppointmentInsert {
  booking_ref: string;
  client_id: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  provider_id: string | null;
  slot_id: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  session_type: string | null;
  session_mode: string | null;
  listener_session_type: string | null;
  is_emergency: boolean;
  preferred_language: string | null;
  client_message: string | null;
  status: string;
  amount: number;
  payment_status: 'completed';
  payment_id: string;
}

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
    let paymentRow: PaymentRow | null = null;
    try {
      const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('transaction_id', razorpay_order_id)
        .single();
      paymentRow = data as PaymentRow | null;
    } catch {}

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
      const intentRaw = (paymentRow.metadata?.intent ?? {}) as Record<string, unknown>;
      const getStr = (k: string) => (typeof intentRaw[k] === 'string' ? (intentRaw[k] as string) : null);
      const getNum = (k: string) => (typeof intentRaw[k] === 'number' ? (intentRaw[k] as number) : null);
      const getBool = (k: string) => (typeof intentRaw[k] === 'boolean' ? (intentRaw[k] as boolean) : false);

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

      const start_time = toHHMMSS(String(getStr('start_time') ?? '00:00'));
      const duration = getNum('duration') ?? 45;
      const end_time = addMinutes(start_time, duration);

      const lstRaw = getStr('listener_session_type');
      const tierRaw = getStr('tier');
      const mapTier: Record<string, string> = { active: 'active_support', empathetic: 'empathetic', communicators: 'effective_communicators' };
      const allowed = new Set(['active_support','empathetic','effective_communicators']);
      const normalizedListenerType = allowed.has(String(lstRaw)) ? String(lstRaw) : (tierRaw && mapTier[tierRaw] ? mapTier[tierRaw] : null);

      const insertRow: AppointmentInsert = {
        booking_ref: getStr('booking_ref') ?? `AUTO-${Date.now()}`,
        client_id: getStr('client_id'),
        client_name: getStr('client_name'),
        client_email: getStr('client_email'),
        client_phone: getStr('client_phone'),
        provider_id: getStr('provider_id'),
        slot_id: getStr('slot_id'),
        appointment_date: getStr('appointment_date') ?? new Date().toISOString().split('T')[0],
        start_time,
        end_time,
        duration,
        session_type: getStr('session_type'),
        session_mode: getStr('session_mode'),
        listener_session_type: (getStr('service') === 'listening') ? normalizedListenerType : null,
        is_emergency: getBool('is_emergency'),
        preferred_language: getStr('preferred_language'),
        client_message: getStr('client_message'),
        status: (getStr('service') === 'listening') ? 'scheduled' : 'confirmed',
        amount: (getNum('amount') ?? paymentRow.amount ?? 0),
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
