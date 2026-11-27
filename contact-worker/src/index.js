// Mailhouse Central website: contact form handler.
//
// Receives the contact form from the website and emails it to you through
// Cloudflare Email Service. Replying to the email answers the visitor.
//
// Settings (see contact-worker/README.md):
//   CONTACT_TO       secret  where messages are delivered (a verified address)
//   CONTACT_FROM     var     sender, on your onboarded domain
//   SITE_URL         var     the website, for the no-JavaScript redirect back
//   ALLOWED_ORIGINS  var     comma-separated origins allowed to post

const LIMITS = { name: 100, email: 254, topic: 60, message: 5000 };
const TOPICS = ["Access to Central", "Pricing", "The Mailhouse plugin", "Something else"];
const MIN_FILL_MS = 3000; // a person takes longer than this to fill the form in

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const cors = allowed.includes(origin)
      ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
      : {};

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...cors,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
    if (request.method !== "POST") {
      return new Response("Send the contact form with POST.", { status: 405, headers: { Allow: "POST, OPTIONS" } });
    }

    const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
    const reply = (ok, status, error) => {
      if (wantsJson) {
        return Response.json(ok ? { ok: true } : { ok: false, error }, { status, headers: cors });
      }
      // No JavaScript: send the visitor back to the site with the outcome in the address.
      const back = (env.SITE_URL || "/").replace(/#.*$/, "") + (ok ? "#contact-sent" : "#contact-failed");
      return Response.redirect(back, 303);
    };

    // Browsers always send Origin on a cross-site POST. Refuse other websites.
    if (origin && !allowed.includes(origin)) return reply(false, 403, "This form only accepts messages from mailhousecentral.com.");

    if (env.CONTACT_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
      if (!success) return reply(false, 429, "Too many messages from your connection. Wait a minute and send it again.");
    }

    let form;
    try {
      form = await request.formData();
    } catch {
      return reply(false, 400, "The form didn't arrive in a readable format. Reload the page and send it again.");
    }

    const field = (k) => String(form.get(k) || "").trim();
    // Spam traps: a hidden field people never see, and a form filled in impossibly fast.
    // Both get a normal-looking success so bots learn nothing.
    if (field("website_url")) return reply(true, 200);
    const started = Number(field("started"));
    if (started && Date.now() - started < MIN_FILL_MS) return reply(true, 200);

    const oneLine = (s) => s.replace(/[\r\n\t]+/g, " ");
    const name = oneLine(field("name")).slice(0, LIMITS.name);
    const email = oneLine(field("email")).slice(0, LIMITS.email);
    const topicRaw = oneLine(field("topic")).slice(0, LIMITS.topic);
    const topic = TOPICS.includes(topicRaw) ? topicRaw : "Something else";
    const message = field("message");

    if (!name) return reply(false, 422, "Add your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(false, 422, "Check your email address. We need it to reply.");
    if (message.length < 10) return reply(false, 422, "Write a little more in your message.");
    if (message.length > LIMITS.message) return reply(false, 422, `Shorten your message to ${LIMITS.message} characters.`);

    if (!env.EMAIL || !env.CONTACT_TO || !env.CONTACT_FROM) {
      console.error("contact: EMAIL binding, CONTACT_TO or CONTACT_FROM is missing");
      return reply(false, 500, "The contact form isn't set up yet. Try again later.");
    }

    const text =
      `${message}\n\n` +
      `-- \n` +
      `From: ${name} <${email}>\n` +
      `Topic: ${topic}\n` +
      `Sent from the contact form on mailhousecentral.com. Reply to this email to answer ${name}.`;

    try {
      await env.EMAIL.send({
        to: env.CONTACT_TO,
        from: { email: env.CONTACT_FROM, name: "Mailhouse Central website" },
        replyTo: { email, name },
        subject: `${topic}: ${name}`,
        text,
      });
    } catch (err) {
      console.error("contact: send failed", err && (err.code || err.message || err));
      return reply(false, 502, "Your message couldn't be sent just now. Try again in a few minutes.");
    }

    return reply(true, 200);
  },
};
