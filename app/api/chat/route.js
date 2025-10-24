// app/api/chat/route.js
export const runtime = "nodejs"; // ensure Node runtime (smtp works)

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/** Session store (in-memory per server instance):
 * sessions[sid] = { emailed: boolean, lastHash: string, sentForContacts: Set<string> }
 */
const sessions = Object.create(null);

function hashText(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return String(h);
}

const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phoneRegex =
  /(?:^|\s)(\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}(?:\s|$)/;

function extractContact(text) {
  const email = text.match(emailRegex)?.[0] || null;
  // Trim whitespace + stray punctuation on phones like “612-839-0429.”
  const phone =
    text
      .match(phoneRegex)?.[0]
      ?.trim()
      ?.replace(/[^\d+()\-. \s]/g, "") || null;
  const contactKey = email || phone || null;
  return { email, phone, contactKey };
}

function appointmentConfirmed(text) {
  return /(we have you scheduled|you are scheduled|appointment.*confirmed|see you|looking forward to speaking|booking.*confirmed|confirmed for)/i.test(
    text
  );
}

async function sendEmail(subject, text) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // e.g. websitebuildersamerica@gmail.com
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  const to = process.env.LEAD_EMAIL_TO || process.env.EMAIL_USER;
  console.log("[chat/email] sending →", { to, subject });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}

export async function POST(req) {
  try {
    const {
      sessionId,
      message,
      conversation = [],
      finalize = false,
    } = await req.json();
    const sid = sessionId || "anon";
    if (!sessions[sid])
      sessions[sid] = {
        emailed: false,
        lastHash: "",
        sentForContacts: new Set(),
      };

    const systemMessage = `
      You are a helpful assistant for Website Builders America (websitebuildersamerica.com).
      You can build ANY type of website. Your goal is to book a consultation.
      Politely gather: full name, email, phone, website type, preferred day/time.
      Only confirm the appointment when email + phone + website type + time are present.
      Be concise, friendly, and professional.
    `;

    let assistantReply = "";

    // Only call OpenAI when NOT finalize-only
    if (!finalize && typeof message === "string" && message.length) {
      const openaiRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemMessage },
              ...conversation,
              { role: "user", content: message },
            ],
          }),
        }
      );

      const data = await openaiRes.json();
      assistantReply = data?.choices?.[0]?.message?.content || "No response";
    }

    // Build transcript including the latest turn (if present)
    const full = [
      ...conversation,
      ...(message ? [{ role: "user", content: message }] : []),
      ...(assistantReply
        ? [{ role: "assistant", content: assistantReply }]
        : []),
    ];

    const transcript = full
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const { email, phone, contactKey } = extractContact(transcript);
    const confirmedNow =
      !!assistantReply && appointmentConfirmed(assistantReply);
    const hash = hashText(transcript);

    console.log("[chat]", {
      sid,
      finalize,
      confirmedNow,
      contactKey,
      hash,
      turns: full.length,
    });

    // =========================
    // WHEN TO EMAIL (always include FULL transcript)
    // =========================
    // A) First time we detect a contact in this session  -> "New Chatbot Lead Captured"
    // B) Appointment confirmed by assistant (has contact)-> "Chatbot Appointment Confirmed"
    // C) finalize:true (on close/inactivity)             -> "Chatbot Transcript (Finalized)"  [NO contact required]
    let shouldSend = false;
    let subject = "New Chatbot Lead Captured";

    if (contactKey && !sessions[sid].sentForContacts.has(contactKey)) {
      shouldSend = true;
      subject = "New Chatbot Lead Captured";
    }
    if (!shouldSend && confirmedNow && contactKey) {
      shouldSend = true;
      subject = "Chatbot Appointment Confirmed";
    }
    if (!shouldSend && finalize) {
      shouldSend = true;
      subject = "Chatbot Transcript (Finalized)";
    }

    if (shouldSend) {
      // De-dupe identical transcript emails
      if (sessions[sid].lastHash === hash) {
        console.log("[chat/email] skipped (same transcript hash)");
      } else {
        const header =
          `Session: ${sid}\n` +
          `Turns: ${full.length}\n` +
          `${email ? "Email: " + email + "\n" : ""}` +
          `${phone ? "Phone: " + phone + "\n" : ""}`;

        await sendEmail(
          subject,
          `${header}\n\nFull Conversation:\n\n${transcript}`
        );

        sessions[sid].lastHash = hash;
        sessions[sid].emailed = true;
        if (contactKey) sessions[sid].sentForContacts.add(contactKey);
        console.log("[chat/email] sent OK");
      }
    } else {
      console.log("[chat/email] not sent (no trigger met)");
    }

    return NextResponse.json({ reply: assistantReply || "" });
  } catch (err) {
    console.error("[chat/error]", err);
    return NextResponse.json(
      { reply: "Sorry, something went wrong." },
      { status: 500 }
    );
  }
}
