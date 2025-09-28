
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // loads STRIPE_KEY from .env

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_KEY, { apiVersion: "2022-11-15" });

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success!" });
});

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "USD",
      });

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(403).json({ message: "Total must be greater than 0" });
  }
});


app.listen(3000, (err)=>{
    if(err) throw err
    console.log("Sever running on port 3000, https://localhost:3000");
})