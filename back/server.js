require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  "https://dpgcqisatsodbyhqzvdi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwZ2NxaXNhdHNvZGJ5aHF6dmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzNTkzMDQsImV4cCI6MjAyNzkzNTMwNH0.z0KnzmXkpS6N3VCskbyYVIg72zz6F3nqfR9otJvjxoA"
);

const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

const recurringPriceId = 'price_1P4gL1P1v3Dm1cKPy2RY1nkQ'; // Use your actual price ID

app.post('/create-checkout-session', async (req, res) => {
  const userId = req.body.userId;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: recurringPriceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `http://localhost:3001/payment-success?user_id=${userId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:3001/cancel',
      metadata: { userId: userId }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
});

app.get('/verify-payment', async (req, res) => {
  const userId = req.query.user_id;
  const sessionId = req.query.session_id;
  try {
    console.log("Getting session for sessionId:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session && session.payment_status === 'paid' && session.metadata.userId === userId) {
      console.log("Payment is verified, updating user status in database...");
      const data = await supabase
        .from('users')
        .update({ paid: true })
        .eq('id', userId)
        .single();
      console.log(data)
      if (data.error) {
        console.error('Error updating user payment status:', data.error.message);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }

      console.log("User data after payment update:", data);
      res.json({ paymentVerified: true, userId: userId });

    } else {
      console.log("Payment not verified for sessionId:", sessionId);
      res.json({ paymentVerified: false });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});