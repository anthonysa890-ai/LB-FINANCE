import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Puxa o usuário logado pelo token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Usuário não autenticado')

    const { personalInfo, paymentInfo } = await req.json()
    
    const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')
    const ASAAS_URL = Deno.env.get('ASAAS_BASE_URL') || 'https://www.asaas.com/api/v3'

    const headers = { 'access_token': ASAAS_API_KEY!, 'Content-Type': 'application/json' }

    // 1. Criar/Buscar Cliente
    let customerId;
    const cleanCpf = personalInfo.cpf.replace(/\D/g, '');
    const searchRes = await fetch(`${ASAAS_URL}/customers?cpfCnpj=${cleanCpf}`, { headers });
    const searchData = await searchRes.json();
    
    if (searchData.data?.length > 0) {
      customerId = searchData.data[0].id;
    } else {
      const customerRes = await fetch(`${ASAAS_URL}/customers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: personalInfo.name,
          cpfCnpj: cleanCpf,
          email: personalInfo.email,
          phone: personalInfo.phone.replace(/\D/g, ''),
          externalReference: user.id // Vincula o ID do Supabase no Asaas
        })
      });
      const customerData = await customerRes.json();
      customerId = customerData.id;
    }

    // 2. Criar Assinatura
    const [expiryMonth, expiryYear] = paymentInfo.expiry.split('/');
    const subscriptionRes = await fetch(`${ASAAS_URL}/subscriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer: customerId,
        billingType: 'CREDIT_CARD',
        cycle: 'MONTHLY',
        value: 9.99,
        nextDueDate: new Date().toISOString().split('T')[0],
        description: "Plano Pro - LB Finance",
        externalReference: user.id, // CRÍTICO: Para o Webhook saber quem é o usuário
        creditCard: {
          holderName: paymentInfo.cardName,
          number: paymentInfo.cardNumber.replace(/\D/g, ''),
          expiryMonth,
          expiryYear: `20${expiryYear}`,
          ccv: paymentInfo.cvv
        },
        creditCardHolderInfo: {
          name: personalInfo.name,
          email: personalInfo.email,
          cpfCnpj: cleanCpf,
          postalCode: '01001-000',
          addressNumber: '123',
          phone: personalInfo.phone.replace(/\D/g, '')
        }
      })
    });

    const subData = await subscriptionRes.json();
    if (!subscriptionRes.ok) throw new Error(subData.errors?.[0]?.description || 'Erro no Asaas');

    return new Response(JSON.stringify({ success: true, subscriptionId: subData.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
