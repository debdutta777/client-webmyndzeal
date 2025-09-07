/**
 * API Route: Create Razorpay Order
 * Creates a payment order for appointment booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PaymentInsert {
  appointment_id: string | null;
  client_id: string | null;
  provider_id: string | null;
  amount: number;
  currency: 'INR';
  gateway: 'razorpay';
  transaction_id: string;
  status: 'pending' | 'completed' | 'failed';
  base_amount: number;
  created_at: string;
  metadata: { intent: Record<string, unknown> };
}

export async function POST(request: NextRequest) {
  console.log('Create order API called');
  try {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

    if (!key_id || !key_secret) {
      console.error('Razorpay keys missing');
      return NextResponse.json({ error: 'Razorpay configuration missing' }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { amount, intent } = await request.json();

    if (!amount || !intent) {
      return NextResponse.json(
        { error: 'Amount and intent are required' },
        { status: 400 }
      );
    }

    // Create Razorpay order via REST API
    // Razorpay limits receipt length to 40 chars. Keep prefix 'receipt_' (8) + 32-char suffix.
    const rawSuffix = `${Date.now()}_${(intent.client_id || 'guest')}`;
    const receiptSuffix = String(rawSuffix).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
    const body = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${receiptSuffix}`,
      notes: {
        intent: 'appointment',
      },
    };

    const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    console.log('Creating Razorpay order with body:', body);

    const rpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const order = await rpRes.json().catch(() => ({}));

    if (!rpRes.ok) {
      console.error('Razorpay order API failed:', rpRes.status, order);
      return NextResponse.json({ error: order.error?.description || 'Failed to create order at Razorpay' }, { status: 500 });
    }

    console.log('Razorpay order created:', order);

    // Store order details with intent (appointment will be created after verification)
    const paymentData: PaymentInsert = {
      appointment_id: null,
      client_id: (intent.client_id as string) || null,
      provider_id: (intent.provider_id as string) || null,
      amount: amount,
      currency: 'INR',
      gateway: 'razorpay',
      transaction_id: order.id, // Razorpay order id
      status: 'pending',
      base_amount: Number(intent?.amount) || amount,
      created_at: new Date().toISOString(),
      metadata: { intent },
    };

    const { error: paymentError } = await supabase
      .from('payments')
      .insert(paymentData);

    if (paymentError) {
      console.error('Failed to store payment record:', paymentError);
      console.error('Payment data:', paymentData);
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
