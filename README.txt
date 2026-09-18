JF FORGES V3 FIXED

This version fixes the two problems you found:
1. Customers no longer see an Admin button. Admin is a separate admin.html page.
2. The store can use Supabase so product order, photos, prices and settings are shared between normal browsers, Incognito and other devices.

The original V3 product photos are bundled in assets/ and loaded into the six original products:
JF Signature Tee, JF Signature Hoodie, JF Forged Crewneck, JF Varsity Jacket, JF Forged Beanie and JF Everyday Tote.

IMPORTANT:
GitHub Pages alone cannot save Admin changes globally. You must connect Supabase.

SETUP:
1. Create a Supabase project.
2. Open SQL Editor and run supabase-schema.sql.
3. Create an Email/Password Auth user for yourself.
4. Copy that user's UUID and run the final INSERT comment in supabase-schema.sql with your UUID.
5. Open Project Settings > API and copy the Project URL and anon/public key into supabase-config.js.
6. NEVER put a service_role key in the website.
7. Upload index.html, admin.html, script.js, admin.js, style.css, supabase-config.js, products.seed.json and assets/ to your GitHub Pages repo.
8. Open your normal store URL for customers.
9. Open your store URL + /admin.html for yourself.

After Supabase is connected:
- Drag products in Admin and press SAVE ORDER: everyone sees the same order.
- Upload photos from your phone: they are stored in cloud storage.
- Remove mistaken photos.
- Assign photos to a colour.
- Edit names, categories, badges, descriptions, colours, sizes and size-specific prices.
- Orders are stored in the database.
- Customers still only see the public store.

Fallback:
If Supabase is not configured, the public store uses bundled products and browser localStorage. In that fallback mode Admin cloud editing is disabled. This is intentional so you do not mistake local browser changes for global publishing.
