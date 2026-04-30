// Edge Function: get-invoices
// Busca o histórico de cobranças do usuário no ASAAS
// Deploy: supabase functions deploy get-invoices

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY") ?? "";
const ASAAS_BASE    = Deno.env.get("ASAAS_BASE_URL") ?? "https://api.asaas.com/v3";
const SUPABASE_URL  = Deno.env.get("SUPABASE_URL")   ?? "";
const SUPABASE_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Autenticar o usuário via JWT do Supabase
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Token não informado");

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authErr || !user) throw new Error("Não autorizado");

    // 2. Buscar o asaas_customer_id na tabela subscriptions
    const { data: sub, error: subErr } = await supabase
      .from("subscriptions")
      .select("asaas_customer_id, asaas_subscription_id, plan")
      .eq("user_id", user.id)
      .single();

    if (subErr || !sub) throw new Error("Assinatura não encontrada");
    if (sub.plan !== "pro") {
      return new Response(JSON.stringify({ invoices: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!sub.asaas_customer_id) throw new Error("Cliente ASAAS não vinculado");

    // 3. Buscar cobranças no ASAAS
    const asaasRes = await fetch(
      `${ASAAS_BASE}/payments?customer=${sub.asaas_customer_id}&limit=20&offset=0`,
      {
        headers: {
          "access_token": ASAAS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!asaasRes.ok) {
      const errText = await asaasRes.text();
      throw new Error(`ASAAS error ${asaasRes.status}: ${errText}`);
    }

    const asaasData = await asaasRes.json();
    const invoices  = (asaasData.data || []).map((charge: any) => ({
      id:          charge.id,
      dueDate:     charge.dueDate,
      value:       charge.value,
      status:      charge.status,       // RECEIVED | CONFIRMED | PENDING | OVERDUE | REFUNDED
      invoiceUrl:  charge.invoiceUrl || null,
      billingType: charge.billingType,
      description: charge.description || "LB Finance Pro",
    }));

    return new Response(JSON.stringify({ invoices }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
