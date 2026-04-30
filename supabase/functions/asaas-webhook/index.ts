import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const body = await req.json()
    console.log("Webhook recebido do Asaas:", body.event)

    // Eventos que indicam pagamento bem-sucedido
    const successEvents = ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]

    if (successEvents.includes(body.event)) {
      const payment = body.payment
      const userId = payment.externalReference // O ID que enviamos no create-subscription

      if (!userId) {
        console.error("Webhook ignorado: externalReference (userId) não encontrado.")
        return new Response("No userId", { status: 200 })
      }

      // Configura o cliente do Supabase com a Service Role (para ignorar RLS e atualizar o plano)
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // 1. Atualiza ou cria a assinatura na tabela 'subscriptions'
      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan: 'pro',
          status: 'active',
          billing_cycle: payment.subscription ? 'monthly' : 'onetime',
          current_period_end: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(), // +31 dias
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

      if (subError) throw subError

      console.log(`Plano Pro liberado com sucesso para o usuário: ${userId}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Erro no Webhook:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
