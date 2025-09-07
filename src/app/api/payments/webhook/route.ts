/**
 * Razorpay Webhook Handler
 * Processes payment events from Razorpay
 * Note: For local testing, you can use ngrok to expose this endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Webhook secret - you'll get this from Razorpay dashboard
  // For now, we'll make it optional for local testing
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    // If webhook secret is configured, verify signature
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
        
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }
    
    const event = JSON.parse(body);
    console.log('Webhook event received:', event.event);
    
    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
      case 'payment.authorized':
        // Payment successful
        await handlePaymentSuccess(event.payload.payment.entity, supabase);
        break;
        
      case 'payment.failed':
        // Payment failed
        await handlePaymentFailed(event.payload.payment.entity, supabase);
        break;
        
      case 'order.paid':
        // Order paid successfully
        console.log('Order paid:', event.payload.order.entity);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

type PaymentEntity = {
  id: string;
  order_id: string;
  error_description?: string;
  error_reason?: string;
  [key: string]: unknown;
};

async function handlePaymentSuccess(payment: PaymentEntity, supabase: SupabaseClient) {
  try {
    console.log('Processing successful payment:', payment.id);
    
    // Update payment record
    const { data: paymentRecord, error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        razorpay_payment_id: payment.id,
        completed_at: new Date().toISOString(),
        metadata: payment
      })
      .eq('razorpay_order_id', payment.order_id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating payment:', updateError);
      return;
    }
    
    // Update appointment status
    if (paymentRecord?.appointment_id) {
      // Determine if this is a listening appointment (no provider/slot, audio/video mode)
      const { data: appt } = await supabase
        .from('appointments')
        .select('id, listener_session_type, provider_id, slot_id, session_mode')
        .eq('id', paymentRecord.appointment_id)
        .single();

      const isListening = !!appt && (
        !!appt.listener_session_type ||
        (!appt.provider_id && !appt.slot_id && (appt.session_mode === 'audio' || appt.session_mode === 'video'))
      );

      const newStatus = isListening ? 'scheduled' : 'confirmed';

      const { error: appointmentError } = await supabase
        .from('appointments')
        .update({
          status: newStatus,
          payment_status: 'completed',
          payment_id: payment.id
        })
        .eq('id', paymentRecord.appointment_id);
        
      if (appointmentError) {
        console.error('Error updating appointment:', appointmentError);
      } else {
        console.log(`Appointment ${newStatus}:`, paymentRecord.appointment_id);
      }
    }
  } catch (error) {
    console.error('Error in handlePaymentSuccess:', error);
  }
}

async function handlePaymentFailed(payment: PaymentEntity, supabase: SupabaseClient) {
  try {
    console.log('Processing failed payment:', payment.id);
    
    // Update payment record
    const { data: paymentRecord, error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString(),
        failure_reason: payment.error_description || payment.error_reason || 'Unknown',
        metadata: payment
      })
      .eq('razorpay_order_id', payment.order_id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating payment:', updateError);
      return;
    }
    
    // Update appointment status
    if (paymentRecord?.appointment_id) {
      const { error: appointmentError } = await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          cancellation_reason: 'Payment failed'
        })
        .eq('id', paymentRecord.appointment_id);
        
      if (appointmentError) {
        console.error('Error updating appointment:', appointmentError);
      } else {
        console.log('Appointment cancelled due to payment failure:', paymentRecord.appointment_id);
      }
    }
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error);
  }
}

// Optional: GET endpoint for webhook verification (some payment gateways require this)
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Razorpay webhook endpoint is active' 
  });
}
