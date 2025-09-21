# 🔗 Razorpay Webhook Setup Guide

## Current Status: ✅ WEBHOOK IMPLEMENTATION COMPLETE

Your Razorpay webhook is now properly implemented using Vercel serverless functions. Here's everything you need to know:

## 📁 Files Created

### 1. **`api/razorpay/webhook.js`** - Main webhook handler
- Verifies webhook signatures for security
- Handles payment events (captured, failed, authorized)
- Updates Firebase orders automatically
- Comprehensive error handling and logging

### 2. **`api/razorpay/firebase-admin.js`** - Firebase Admin integration
- Server-side Firebase operations
- Order status updates
- Webhook event logging
- Secure Firebase Admin SDK initialization

### 3. **`api/package.json`** - Dependencies
- Firebase Admin SDK for server-side operations

## 🔧 Environment Variables Required

Add these to your `.env` file and Vercel environment variables:

```bash
# Razorpay Webhook Secret (get from Razorpay Dashboard)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Firebase Admin SDK (for server-side operations)
FIREBASE_PROJECT_ID=fademart-32de5
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fademart-32de5.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

## 🚀 Setup Instructions

### Step 1: Get Firebase Admin Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `fademart-32de5`
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Extract these values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### Step 2: Configure Razorpay Webhook
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **Webhooks**
3. Click **Create Webhook**
4. Set webhook URL: `https://your-domain.vercel.app/api/razorpay/webhook`
5. Select these events:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `payment.authorized`
   - ✅ `order.paid`
6. Set webhook secret (save this for environment variables)
7. Click **Create Webhook**

### Step 3: Deploy to Vercel
1. Add environment variables to Vercel:
   ```bash
   vercel env add RAZORPAY_WEBHOOK_SECRET
   vercel env add FIREBASE_PROJECT_ID
   vercel env add FIREBASE_CLIENT_EMAIL
   vercel env add FIREBASE_PRIVATE_KEY
   ```
2. Deploy your application:
   ```bash
   vercel --prod
   ```

### Step 4: Test Webhook
1. Use Razorpay's webhook testing tool in the dashboard
2. Make a test payment to verify functionality
3. Monitor webhook logs in Vercel functions dashboard

## 🔍 How It Works

### Payment Flow with Webhook:
1. **User makes payment** → Razorpay processes payment
2. **Razorpay sends webhook** → Your serverless function receives it
3. **Signature verification** → Ensures webhook is from Razorpay
4. **Firebase update** → Order status updated in database
5. **Response sent** → Razorpay receives confirmation

### Webhook Events Handled:
- **`payment.captured`** → Payment successful → Order status: "Completed"
- **`payment.failed`** → Payment failed → Order status: "Failed"
- **`payment.authorized`** → Payment authorized → Order status: "Authorized"
- **`order.paid`** → Order fully paid → Order status: "Completed"

## 🛡️ Security Features

✅ **Signature Verification** - All webhooks verified with HMAC SHA256
✅ **Environment Variables** - Sensitive data secured
✅ **Error Handling** - Comprehensive error logging
✅ **Firebase Admin** - Server-side database operations
✅ **Event Logging** - All webhook events logged for debugging

## 📊 Monitoring & Debugging

### Check Webhook Logs:
1. **Vercel Functions** → View function logs
2. **Firebase Console** → Check `webhookLogs` collection
3. **Razorpay Dashboard** → Webhook delivery status

### Common Issues:
- **Signature mismatch** → Check webhook secret
- **Firebase errors** → Verify admin credentials
- **Order not found** → Check payment ID matching

## 🧪 Testing Checklist

- [ ] Webhook URL accessible: `/api/razorpay/webhook`
- [ ] Environment variables configured
- [ ] Firebase Admin SDK working
- [ ] Razorpay webhook configured
- [ ] Test payment processes correctly
- [ ] Order status updates in Firebase
- [ ] Webhook events logged properly

## 🎯 Benefits of This Implementation

1. **Security** → Server-side payment verification
2. **Reliability** → Automatic order status updates
3. **Scalability** → Serverless architecture
4. **Monitoring** → Complete webhook event logging
5. **Error Handling** → Robust error management
6. **Compliance** → Proper payment flow validation

## 🔄 Next Steps

1. **Deploy to production** with environment variables
2. **Configure Razorpay webhook** with your domain
3. **Test with real payments** to verify functionality
4. **Monitor webhook logs** for any issues
5. **Set up alerts** for webhook failures (optional)

Your Razorpay webhook is now production-ready! 🎉

## 📞 Support

If you encounter any issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test webhook signature verification
4. Check Firebase Admin permissions
5. Review Razorpay webhook delivery logs
