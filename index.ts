// Paystack adapter. Keep the secret key server-side in Supabase secrets.
// Deploy: supabase functions deploy create-payment
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { order_id } = await req.json();
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: order, error } = await admin.from('orders').select('*').eq('id', order_id).single();
    if (error || !order) throw new Error('Order not found.');
    const secret = Deno.env.get('PAYSTACK_SECRET_KEY'); if (!secret) throw new Error('Payment provider is not configured.');
    const response = await fetch('https://api.paystack.co/transaction/initialize', { method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: order.email, amount: Math.round(Number(order.total_zar) * 100), currency: 'ZAR', callback_url: `${Deno.env.get('STORE_URL')}/payment-success?order=${order.id}`, metadata: { order_id: order.id, order_number: order.order_number } }) });
    const result = await response.json();
    if (!result.status) throw new Error(result.message || 'Payment initialization failed.');
    await admin.from('orders').update({ payment_reference: result.data.reference }).eq('id', order.id);
    return new Response(JSON.stringify({ authorization_url: result.data.authorization_url, reference: result.data.reference }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) { return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Payment failed' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }); }
});
