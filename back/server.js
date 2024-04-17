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
        price: 'price_1P6UZsP1v3Dm1cKPqjrDbF0t', // Use your actual price ID
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `https://slotninja.app/payment-success?user_id=${userId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://slotninja.app/cancel',
      metadata: { userId: userId }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
});

app.all('/test', (req, res) => {
  res.send('Hello from /test');
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
  const { customerName, customerEmail, customerPhone, listingId, business, listing } = req.body;

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
    await sendConfirmationEmail(customerEmail, business, listing);
    res.json({ message: 'Booking confirmed and email sent!' });
  } catch (error) {
    console.error('Error during booking confirmation:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
});

function sendConfirmationEmail(customerEmail, business, listing) {
  
  const request = mailjet.post("send", {'version': 'v3.1'}).request({
    "Messages": [
      {
        "From": {
          "Email": "josh.locke@outlook.com",
          "Name": "Slot Ninja"
        },
        "To": [
          { "Email": customerEmail, "Name": "Customer Name" },
          { "Email": business.email, "Name": business.Name }
        ],
        "Subject": "Your Booking Confirmation",
        "TextPart": `Dear Customer, your booking for ${listing.title} is confirmed.`,
        "HTMLPart": `<h3>Dear Customer,</h3>
                     <p>Your booking for <strong>${listing.title}</strong> is confirmed.</p>
                     <h4>Booking Details:</h4>
                     <p><strong>Title:</strong> ${listing.title}</p>
                     <p><strong>Description:</strong> ${listing.description}</p>
                     <p><strong>Category:</strong> ${listing.category}</p>
                     <p><strong>Location:</strong> ${listing.location}</p>
                     <p><strong>Date:</strong> ${new Date(listing.startTime).toLocaleDateString()} from ${new Date(listing.startTime).toLocaleTimeString()} to ${new Date(listing.endTime).toLocaleTimeString()}</p>
                     <p><strong>Price:</strong> $${listing.price}</p>
                     <br>
                     <p>Thank you for choosing us for your ${listing.category} needs.</p>`
      }
    ]
  });

  return request
    .then(result => console.log('Email sent successfully', result.body))
    .catch(err => {
      console.error('Failed to send email:', err.statusCode, err.message);
      throw err; // Rethrow the error to handle it in the calling function
    });}

app.listen(4040, () => {
  console.log('Server running on port 4040');
});
