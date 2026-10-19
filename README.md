# Eshme-Commerce

Eshme-Commerce helps aspiring sellers organize the work of launching and operating an online store. It combines sourced niche research, supplier term comparison, product records, channel planning, campaigns, leads, conversations, orders, and subscriber consent in one workspace.

The public site explains the service and its current pricing. Signed-in records are stored per account in Cloudflare D1. Store and social integrations are shown as manual workflows until their platform credentials and approvals are configured. Payment processing is inactive; the Payments area records transactions manually.

## Development

Requires Node.js 22.13 or newer. Install dependencies with `npm ci`, generate migrations with `npm run db:generate` when the schema changes, and start a local server with `npm run dev`. The local server provides a loopback-only sign-in flow for development. Build with `npm run build`.

The site uses the Sites hosting manifest in `.openai/hosting.json`. The D1 binding is named `DB`. Authentication is handled by the hosting platform, and API requests always scope records to the signed-in user ID.

## Current service terms

The first 30 days are free. Subscription pricing is coming soon. Access remains free until billing is enabled, and no payment method is required. External stores, marketing tools, and payment providers may have their own fees.
