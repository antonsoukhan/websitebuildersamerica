"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function CheckoutButton({ amount = 49900, label, style }) {
  const handleClick = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();
    const stripe = await stripePromise;

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <button className="btn" onClick={handleClick} style={style}>
      {label}
    </button>
  );
}
