# Contact form handler

A Cloudflare Worker that receives the website's contact form and emails each message to you through
[Cloudflare Email Service](https://developers.cloudflare.com/email-service/). Reply to the email and your
answer goes straight to the visitor.

It is not part of the website: GitHub Pages only serves files, so the form posts here instead.

## What you need

- A Cloudflare account on the **Workers Paid** plan (Email Service requires it).
- A domain that uses **Cloudflare DNS**, to send from.
- The address that should receive messages, added and verified in your Cloudflare account.

## Set it up

1. **Onboard the sending domain.** In the Cloudflare dashboard: Compute, Email Service, Email Sending,
   Onboard Domain. Cloudflare adds the SPF, DKIM, DMARC and bounce records. Allow up to 15 minutes.
2. **Choose the sender.** In `wrangler.jsonc`, set `CONTACT_FROM` to an address on that domain,
   for example `contact@yourdomain.com`. It doesn't need a mailbox.
3. **Install and sign in.**
   ```bash
   cd contact-worker
   npm install
   npx wrangler login
   ```
4. **Set where messages go.** This stays secret and out of the repository:
   ```bash
   npx wrangler secret put CONTACT_TO
   ```
5. **Deploy.**
   ```bash
   npm run deploy
   ```
   Wrangler prints the Worker's address, for example `https://mailhouse-contact.yourname.workers.dev`.
6. **Switch the form on.** In `index.html`, find the contact section: put that address in the form's
   `action`, and remove `hidden` from the `<section id="contact">` and from the Contact links in the
   header and footer. Push to `main`.

## Try it

Send a message from the live site. If nothing arrives, check spam, then the Worker's logs
(`npx wrangler tail`, or Workers & Pages, mailhouse-contact, Logs in the dashboard).

To test locally, run `npx wrangler dev` here and `python3 -m http.server 8000` in the site folder, and point
the form's `action` at the local Worker address while you test.

## What it does with a message

- Accepts posts only from the origins in `ALLOWED_ORIGINS`.
- Allows five messages a minute from one connection.
- Quietly drops bots that fill in a hidden field or submit in under three seconds.
- Checks the name, the email address and the message length, and tells the visitor what to fix.
- Sends you one plain-text email with the visitor as Reply-To. It stores nothing.
- Works without JavaScript: the visitor is sent back to the site with a confirmation or an error.
