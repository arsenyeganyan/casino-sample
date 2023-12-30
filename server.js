//configs
const dotenv = require('dotenv');
dotenv.config();

//imports
const cors = require('cors');
const express = require('express');
const app = express();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//middleware
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount, 
            currency,
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
        console.log('Payment successful!');
    } catch(e) {
        console.error(e.message);
        res.status(500).send('Internal Server Error');
    }
})

const PORT = process.env.PORT || 4400;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});