const cors = require("cors");
const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

app.post("/create-payment-intent", async (req, res) => {
  const customer = await stripe.customers.create({
    email: "amargithub@gmail",
  });
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
      
    },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customerId: customer.id,
    paymentIntentId: paymentIntent.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
