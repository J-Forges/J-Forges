# JF FORGES — V4 GO-LIVE CHECKLIST

This package is a production-ready architecture scaffold, but it is NOT connected to your private accounts yet. That final connection requires your own Supabase/project, domain and payment-provider credentials.

## 1) Create the backend
1. Create a Supabase project.
2. Open SQL Editor and run `backend/supabase/schema.sql`.
3. Create your first user in Supabase Auth.
4. In `profiles`, change that user's role to `admin`.
5. Create a Storage bucket for product images (for example `product-images`).

## 2) Configure the website
Copy `.env.example` to your deployment environment and fill in:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Never expose the service-role key or payment secret in frontend JavaScript.

## 3) Deploy Edge Functions
Using Supabase CLI:
- `supabase functions deploy create-order`
- `supabase functions deploy create-payment`
- `supabase functions deploy payment-webhook`

Set secrets in Supabase:
- `PAYSTACK_SECRET_KEY`
- `STORE_URL`

## 4) Payment provider
The included adapter uses Paystack's transaction initialization endpoint and keeps the secret server-side. Before going live, confirm your business/product/fulfillment model and supported currencies with the provider, then configure the provider webhook URL to point to `payment-webhook`.

## 5) Shipping
Insert your real shipping rates into `shipping_rates`. Example:
- ZA = your South African rate
- US = your US rate
- GB = your UK rate

For POD, compare the configured customer-facing rate with your actual Printify shipping costs and decide whether you want flat-rate, destination-based, or free-over-X shipping.

## 6) Printify fulfillment
Start manually while volume is low: paid JF order -> create/submit the matching Printify order -> save tracking number in `orders`.

Later, add a secure Printify server-side integration so paid orders can be sent to fulfillment automatically. Do NOT put a Printify API token in the browser.

## 7) Admin security
- Use Supabase Auth, not the old V3 demo password.
- Keep RLS enabled.
- Only users with `profiles.role = 'admin'` can modify products/orders/shipping.
- Enable MFA for the admin account if available on your chosen Supabase plan.

## 8) Domain + launch
Deploy the frontend to a host such as Vercel/Netlify/Cloudflare Pages, add your custom JF domain, set environment variables, then test:
1. mobile browsing
2. product selection
3. cart
4. shipping calculation
5. test payment
6. payment webhook
7. admin order status
8. fulfillment + tracking

## Important
The included V4 does not magically create accounts or a live payment account. Your credentials and provider onboarding are required before real money can move. The architecture is designed so those connections can be added without rebuilding the JF visual identity.
