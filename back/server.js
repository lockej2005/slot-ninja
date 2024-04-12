require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

const recurringPriceId = 'price_1P4gL1P1v3Dm1cKPy2RY1nkQ';  // Use your actual price ID

app.post('/create-checkout-session', async (req, res) => {
    const userId = req.body.userId; // Receive user ID from frontend

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: recurringPriceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `http://localhost:3001/business/dashboard?user_id=${userId}`,
            cancel_url: 'http://localhost:3001/cancel',
            metadata: {
                userId: userId
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Failed to create a checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
