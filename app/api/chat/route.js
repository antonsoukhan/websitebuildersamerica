// app/api/chat/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// -------------------------
// In-memory session store
// sessions[sid] = {
//   turns: [{ role: "user"|"assistant", content: string }],
//   lastEmailHash: string,
//   confirmationsSentTo: Set<string>   // customer emails already confirmed
// }
// -------------------------
const sessions = Object.create(null);

// --- Helpers ---
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
  // Trim stray trailing punctuation on phones like “612-839-0429.”
  const phone =
    text
      .match(phoneRegex)?.[0]
      ?.trim()
      ?.replace(/[^\d+()\-.\s]/g, "") || null;
  return { email, phone, contactKey: email || phone || null };
}

function appointmentConfirmed(text) {
  return /(we have you scheduled|you are scheduled|appointment.*confirmed|see you|looking forward to speaking|booking.*confirmed|confirmed for)/i.test(
    text || ""
  );
}

function createTransport() {
  // Reliable Gmail SMTP (requires App Password)
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // e.g. websitebuildersamerica@gmail.com
      pass: process.env.EMAIL_PASS, // Gmail App Password (not your login)
    },
  });
}

async function sendAdminTranscriptEmail({
  transcript,
  sid,
  turns,
  email,
  phone,
  subject,
}) {
  const transporter = createTransport();
  const to = process.env.LEAD_EMAIL_TO || process.env.EMAIL_USER;

  const header =
    `Session: ${sid}\n` +
    `Turns: ${turns}\n` +
    `${email ? "Email: " + email + "\n" : ""}` +
    `${phone ? "Phone: " + phone + "\n" : ""}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: `${header}\n\nFull Conversation:\n\n${transcript}`,
  });

  console.log("[chat/email] admin transcript sent →", to, subject);
}

async function sendCustomerConfirmationEmail(customerEmail) {
  if (!customerEmail) return;
  const transporter = createTransport();

  const text = `
Hi there,

Thanks for chatting with Website Builders America!
We’ve received your message and will reach out shortly.

If you’d like to speed things up, you can also call or text us:
(612) 839-0429
https://websitebuildersamerica.com

Best,
Website Builders America
`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: "We’ve received your message — Website Builders America",
    text,
  });

  console.log("[chat/email] customer confirmation sent →", customerEmail);
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

    // Initialize session bucket
    if (!sessions[sid]) {
      sessions[sid] = {
        turns: [],
        lastEmailHash: "",
        confirmationsSentTo: new Set(),
      };
    }

    const MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo"; // cheap default

    const systemMessage = `
You are a helpful assistant for Website Builders America (websitebuildersamerica.com).
Collect full name, email, phone, website type, and preferred day/time.
Only say "you'll receive an email confirmation" if the user has provided an email address.
Be concise, friendly, and professional.
    `.trim();

    // 1) Get assistant reply unless this is finalize-only
    let assistantReply = "";
    if (!finalize && typeof message === "string" && message.length) {
      const serverContext = sessions[sid].turns.slice(-12); // keep token usage low
      const openaiRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: "system", content: systemMessage },
              ...serverContext,
              { role: "user", content: message },
            ],
          }),
        }
      );

      const data = await openaiRes.json();
      if (data?.error) {
        console.error("[chat/openai-error]", data.error);
        assistantReply = "Sorry, something went wrong.";
      } else {
        assistantReply = data?.choices?.[0]?.message?.content || "No response";
      }
    }

    // 2) Append new turn(s) to server-side log
    if (message) sessions[sid].turns.push({ role: "user", content: message });
    if (assistantReply)
      sessions[sid].turns.push({ role: "assistant", content: assistantReply });

    // 3) Build FULL transcript from server storage
    const transcript = sessions[sid].turns
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    const { email, phone, contactKey } = extractContact(transcript);
    const confirmedNow = assistantReply && appointmentConfirmed(assistantReply);
    const hash = hashText(transcript);

    console.log("[chat]", {
      sid,
      finalize,
      confirmedNow,
      contactKey,
      email,
      phone,
      turns: sessions[sid].turns.length,
    });

    // 4) Decide when to email you (admin)
    //    - First contact captured → "New Chatbot Lead Captured"
    //    - Appointment confirmed (with contact) → "Chatbot Appointment Confirmed"
    //    - Finalize (always) → "Chatbot Transcript (Finalized)"
    let shouldEmailAdmin = false;
    let adminSubject = "New Chatbot Lead Captured";

    if (contactKey && !sessions[sid].emailedOnFirstContact) {
      shouldEmailAdmin = true;
      adminSubject = "New Chatbot Lead Captured";
      sessions[sid].emailedOnFirstContact = true;
    }
    if (!shouldEmailAdmin && confirmedNow && contactKey) {
      shouldEmailAdmin = true;
      adminSubject = "Chatbot Appointment Confirmed";
    }
    if (!shouldEmailAdmin && finalize) {
      shouldEmailAdmin = true;
      adminSubject = "Chatbot Transcript (Finalized)";
    }

    // 5) Send admin transcript email (de-duped by transcript hash)
    if (shouldEmailAdmin) {
      if (sessions[sid].lastEmailHash !== hash) {
        await sendAdminTranscriptEmail({
          transcript,
          sid,
          turns: sessions[sid].turns.length,
          email,
          phone,
          subject: adminSubject,
        });
        sessions[sid].lastEmailHash = hash;
      } else {
        console.log("[chat/email] admin skipped (same transcript hash)");
      }
    } else {
      console.log("[chat/email] admin not sent (no trigger met)");
    }

    // 6) Send customer confirmation email once we have their email
    if (email && !sessions[sid].confirmationsSentTo.has(email)) {
      try {
        await sendCustomerConfirmationEmail(email);
        sessions[sid].confirmationsSentTo.add(email);
      } catch (e) {
        console.error("[chat/email] customer confirmation failed:", e);
      }
    }

    // 7) Respond to client
    return NextResponse.json({ reply: assistantReply || "" });
  } catch (err) {
    console.error("[chat/error]", err);
    return NextResponse.json(
      { reply: "Sorry, something went wrong." },
      { status: 500 }
    );
  }
}
