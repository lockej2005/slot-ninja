require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('node-mailjet');

const mailjet = new Client({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  "https://dpgcqisatsodbyhqzvdi.supabase.co",
  process.env.SUPABASE_SECRET_KEY
);

const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
  const userId = req.body.userId;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1P4gL1P1v3Dm1cKPy2RY1nkQ', // Use your actual price ID
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
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session && session.payment_status === 'paid' && session.metadata.userId === userId) {
      const { data, error } = await supabase
        .from('users')
        .update({ paid: true })
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error updating user payment status:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }

      res.json({ paymentVerified: true, userId: userId });
    } else {
      res.json({ paymentVerified: false });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/confirm-booking', async (req, res) => {
  const { customerName, customerEmail, customerPhone, listingId, businessEmail } = req.body;

  try {
    const { data: updatedListing, error: updateError } = await supabase
      .from('listings')
      .update({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
      })
      .eq('id', listingId)
      .single();

    if (updateError) {
      console.error('Error updating listing:', updateError.message);
      res.status(500).json({ message: 'Error updating listing', error: updateError });
      return;
    }

    // Fetch the complete listing data
    const { data: listingData, error: fetchError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();
    console.log(listingData)
    if (fetchError) {
      console.error('Error fetching listing data:', fetchError.message);
      res.status(500).json({ message: 'Error fetching listing data', error: fetchError });
      return;
    }

    // Send confirmation email to customer and business
    await sendConfirmationEmail(customerEmail, businessEmail, listingData);
    res.json({ message: 'Booking confirmed and email sent!' });
  } catch (error) {
    console.error('Error during booking confirmation:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
});

function sendConfirmationEmail(customerEmail, businessEmail, bookingDetails) {
  console.log(bookingDetails)
  const request = mailjet.post("send", {'version': 'v3.1'}).request({
    "Messages": [
      {
        "From": {
          "Email": "your-email@example.com",
          "Name": "Your Business Name"
        },
        "To": [
          { "Email": customerEmail, "Name": "Customer Name" },
          { "Email": businessEmail, "Name": "Business Name" }
        ],
        "Subject": "Your Booking Confirmation",
        "TextPart": `Dear Customer, your booking for ${bookingDetails.title} is confirmed.`,
        "HTMLPart": `<h3>Dear Customer,</h3><p>Your booking for <strong>${bookingDetails.title}</strong> is confirmed.</p>`
      }
    ]
  });

  return request
    .then(result => console.log('Email sent successfully', result.body))
    .catch(err => console.error('Failed to send email', err.statusCode));
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
