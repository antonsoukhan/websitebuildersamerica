import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.json();
  const amount = body.amount || 14900; // fallback if none sent

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Website Package",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get("origin")}/success`,
    cancel_url: `${req.headers.get("origin")}/cancel`,
  });

  return Response.json({ id: session.id });
}
