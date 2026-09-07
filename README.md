# JF FORGES — STORE V4

**MY FINAL BEGINNING.**

V4 keeps the JF FORGES visual/product foundation from V3 and adds the backend architecture needed for a real store:
- Supabase database schema
- Row Level Security policies
- Secure admin role model
- Server-side order creation
- Server-side payment initialization adapter
- Payment webhook verification
- Destination-based shipping table
- Production go-live checklist

The existing `index.html`, `style.css`, `script.js` and actual product mockups remain included.

V4 is intentionally not preloaded with anyone's private API keys. Connect your own Supabase, payment provider, domain and fulfillment accounts using `docs/GO_LIVE.md`.
