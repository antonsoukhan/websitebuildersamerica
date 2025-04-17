"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? "success" : "error");
    if (res.ok) setForm({ name: "", email: "", message: "" });
  };

  return (
    <section
      className="section-contact u-margin-top-huge u-margin-bottom-huge"
      id="contact"
    >
      <div className="heading-container">
        <span className="heading-4 subtitle">Contact</span>
        <h2 className="heading-2 u-margin-bottom-medium">Let's Get in Touch</h2>
        <p className="paragraph-medium u-margin-bottom-large">
          Have a question or want to start a project? Reach out now!
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="input"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-message">
          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            name="message"
            required
            className="input"
            rows="6"
            value={form.message}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn">
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>

        {status === "success" && (
          <p
            className="u-center-text"
            style={{ color: "green", marginTop: "2rem" }}
          >
            Thanks for your message!
          </p>
        )}
        {status === "error" && (
          <p
            className="u-center-text"
            style={{ color: "red", marginTop: "2rem" }}
          >
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </section>
  );
}
