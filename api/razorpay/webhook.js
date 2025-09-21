import crypto from 'crypto';
import { 
  updateOrderInFirebase, 
  logWebhookEvent, 
  getOrderByPaymentId,
  createOrderInFirebase 
} from './firebase-admin.js';

// Razorpay webhook handler for Vercel serverless functions
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the webhook signature from headers
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    if (!webhookSignature) {
      console.error('No webhook signature provided');
      return res.status(400).json({ error: 'No signature provided' });
    }

    // Get the raw body
    const body = JSON.stringify(req.body);
    
    // Verify the webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Parse the webhook payload
    const event = req.body;
    const { event: eventType, payload } = event;

    console.log(`Received webhook event: ${eventType}`);

    // Log the webhook event for debugging
    await logWebhookEvent(eventType, payload.payment?.entity?.id, payload);

    // Handle different webhook events
    switch (eventType) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      
      case 'payment.authorized':
        await handlePaymentAuthorized(payload.payment.entity);
        break;
      
      case 'order.paid':
        await handleOrderPaid(payload.order.entity, payload.payment.entity);
        break;
      
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    // Acknowledge receipt of the webhook
    res.status(200).json({ status: 'success', event: eventType });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Handle successful payment capture
async function handlePaymentCaptured(payment) {
  try {
    console.log('Processing captured payment:', payment.id);
    
    const webhookData = {
      paymentId: payment.id,
      amount: payment.amount / 100, // Convert from paise to rupees
      currency: payment.currency,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      capturedAt: new Date(payment.created_at * 1000),
      notes: payment.notes,
      fee: payment.fee ? payment.fee / 100 : 0,
      tax: payment.tax ? payment.tax / 100 : 0
    };

    // Update existing order status to completed
    const updated = await updateOrderInFirebase(payment.id, 'Completed', webhookData);
    
    if (!updated) {
      // If no existing order found, check if we need to create one
      console.log('No existing order found, payment may have been processed directly');
      
      // You might want to create a new order record here if needed
      // This handles cases where webhook arrives before frontend creates the order
    }

    console.log('Payment captured and processed successfully');
    
  } catch (error) {
    console.error('Error handling payment capture:', error);
    throw error;
  }
}

// Handle failed payments
async function handlePaymentFailed(payment) {
  try {
    console.log('Processing failed payment:', payment.id);
    
    const webhookData = {
      paymentId: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      failedAt: new Date(payment.created_at * 1000),
      errorCode: payment.error_code,
      errorDescription: payment.error_description,
      errorSource: payment.error_source,
      errorStep: payment.error_step,
      errorReason: payment.error_reason,
      notes: payment.notes
    };

    // Update order status to failed
    await updateOrderInFirebase(payment.id, 'Failed', webhookData);
    
    console.log('Payment failure processed successfully');
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

// Handle authorized payments (for manual capture)
async function handlePaymentAuthorized(payment) {
  try {
    console.log('Processing authorized payment:', payment.id);
    
    const webhookData = {
      paymentId: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      authorizedAt: new Date(payment.created_at * 1000),
      notes: payment.notes
    };

    // Update order status to authorized (pending manual capture)
    await updateOrderInFirebase(payment.id, 'Authorized', webhookData);
    
    console.log('Payment authorization processed successfully');
    
  } catch (error) {
    console.error('Error handling payment authorization:', error);
    throw error;
  }
}

// Handle order paid event (when an order is fully paid)
async function handleOrderPaid(order, payment) {
  try {
    console.log('Processing paid order:', order.id, 'with payment:', payment.id);
    
    const webhookData = {
      orderId: order.id,
      paymentId: payment.id,
      amount: order.amount / 100,
      amountPaid: order.amount_paid / 100,
      currency: order.currency,
      status: order.status,
      paidAt: new Date(payment.created_at * 1000),
      notes: order.notes
    };

    // Update order status to completed
    await updateOrderInFirebase(payment.id, 'Completed', webhookData);
    
    console.log('Order paid event processed successfully');
    
  } catch (error) {
    console.error('Error handling order paid event:', error);
    throw error;
  }
}
