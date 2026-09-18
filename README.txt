JF FORGES V3 — LAST CLEAN BUILD

This package is the corrected customer store + private admin build.

PUBLIC STORE:
- No Admin button is shown to customers.
- Bundled JF product photos are used with relative asset paths, so GitHub Pages can load them.
- 7 JF products are bundled: Signature Tee, Signature Hoodie, Black Hoodie, Forged Crewneck, Varsity Jacket, Forged Beanie, Everyday Tote.
- Product detail has color, size, size-specific price, gallery and BACK TO STORE HOME.
- Bag has quantity +/- and remove.
- Checkout supports WhatsApp or Email.
- The customer store does NOT trust old browser product localStorage, so an old broken prototype cannot overwrite the bundled catalog.

PRIVATE ADMIN:
- Open /admin.html directly.
- Supabase Auth protects the admin.
- Drag products to arrange them globally.
- Upload photos, choose a color, remove mistaken photos, and move photos left/right.
- Edit names, descriptions, colors, sizes and each size price.
- Store settings and orders are stored in Supabase.

IMPORTANT FOR GLOBAL ADMIN:
GitHub Pages is static hosting. Global product/order/photo changes require Supabase.
1. Create a Supabase project.
2. Run supabase-schema.sql.
3. Create an Email/Password Auth user for yourself.
4. Put that user's UUID into the admin profile INSERT shown at the bottom of supabase-schema.sql.
5. Put your Supabase Project URL and anon/public key into supabase-config.js.
6. Never put a service_role key in the website.
7. Upload EVERYTHING in this folder to the ROOT of the GitHub Pages repository (index.html must be at the root of the published folder).
8. Wait for GitHub Pages to publish, then test the normal store URL in Incognito.
9. Open /admin.html for private management.

FAST PUBLISH CHECK:
After uploading, the homepage must show the real JF clothing photos. If you still see the old "PRIVATE AREA / JF Admin" on the public homepage, GitHub is still serving an old index.html or the wrong publishing folder.
