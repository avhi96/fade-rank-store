import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
let firebaseApp;

export function initializeFirebaseAdmin() {
  if (!firebaseApp) {
    try {
      // Check if Firebase Admin is already initialized
      firebaseApp = admin.apps.find(app => app.name === 'webhook-admin') || admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
      }, 'webhook-admin');
      
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  }
  return firebaseApp;
}

// Get Firestore instance
export function getFirestore() {
  const app = initializeFirebaseAdmin();
  return admin.firestore(app);
}

// Update order status in Firebase
export async function updateOrderInFirebase(paymentId, status, additionalData = {}) {
  try {
    const db = getFirestore();
    
    // Search in both collections: productOrders and orders
    const collections = ['productOrders', 'orders'];
    const updatePromises = [];

    for (const collectionName of collections) {
      const ordersRef = db.collection(collectionName);
      const query = ordersRef.where('paymentId', '==', paymentId);
      const snapshot = await query.get();
      
      if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.update(doc.ref, { 
            status: status,
            webhookProcessedAt: admin.firestore.FieldValue.serverTimestamp(),
            webhookData: additionalData,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          });
        });
        
        updatePromises.push(batch.commit());
        console.log(`Found ${snapshot.docs.length} orders in ${collectionName} for payment ${paymentId}`);
      }
    }

    if (updatePromises.length === 0) {
      console.log('No matching orders found for payment:', paymentId);
      return false;
    }

    await Promise.all(updatePromises);
    console.log('Order status updated successfully in Firebase');
    return true;
    
  } catch (error) {
    console.error('Error updating order in Firebase:', error);
    throw error;
  }
}

// Create a new order record (for webhook-initiated orders)
export async function createOrderInFirebase(orderData) {
  try {
    const db = getFirestore();
    
    const orderRecord = {
      ...orderData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'webhook',
      webhookProcessedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add to both collections for consistency
    const promises = [
      db.collection('productOrders').add(orderRecord),
      db.collection('orders').add({
        ...orderRecord,
        type: 'shop'
      })
    ];

    await Promise.all(promises);
    console.log('Order created successfully from webhook');
    return true;
    
  } catch (error) {
    console.error('Error creating order in Firebase:', error);
    throw error;
  }
}

// Get order by payment ID
export async function getOrderByPaymentId(paymentId) {
  try {
    const db = getFirestore();
    
    // Search in productOrders first
    const ordersRef = db.collection('productOrders');
    const query = ordersRef.where('paymentId', '==', paymentId);
    const snapshot = await query.get();
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }
    
    return null;
  } catch (error) {
    console.error('Error getting order by payment ID:', error);
    throw error;
  }
}

// Log webhook events for debugging
export async function logWebhookEvent(eventType, paymentId, data) {
  try {
    const db = getFirestore();
    
    await db.collection('webhookLogs').add({
      eventType,
      paymentId,
      data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      processed: true
    });
    
    console.log('Webhook event logged successfully');
  } catch (error) {
    console.error('Error logging webhook event:', error);
    // Don't throw error for logging failures
  }
}
