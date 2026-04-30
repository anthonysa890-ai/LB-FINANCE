require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

// Asaas Sandbox URL
const ASAAS_URL = 'https://sandbox.asaas.com/api/v3';

app.use(cors());
app.use(express.json());

// Rota de Teste
app.get('/api/status', (req, res) => {
    res.json({ status: 'Servidor Rodando', asaasConfigured: !!ASAAS_API_KEY });
});

// Headers padrão para o Asaas
const getAsaasHeaders = () => ({
    headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json'
    }
});

// ── ROTA PRINCIPAL DE CHECKOUT ──
app.post('/api/checkout', async (req, res) => {
    try {
        const { personalInfo, paymentInfo } = req.body;
        
        // 1. Criar ou Buscar Cliente no Asaas
        let customerId;
        const cleanCpf = personalInfo.cpf.replace(/\D/g, '');
        
        try {
            // Tenta buscar o cliente primeiro
            const searchResponse = await axios.get(`${ASAAS_URL}/customers?cpfCnpj=${cleanCpf}`, getAsaasHeaders());
            
            if (searchResponse.data.data && searchResponse.data.data.length > 0) {
                customerId = searchResponse.data.data[0].id;
            } else {
                // Se não existir, cria um novo
                const customerResponse = await axios.post(`${ASAAS_URL}/customers`, {
                    name: personalInfo.name,
                    cpfCnpj: cleanCpf,
                    email: personalInfo.email,
                    phone: personalInfo.phone.replace(/\D/g, '')
                }, getAsaasHeaders());
                
                customerId = customerResponse.data.id;
            }
        } catch (customerError) {
            console.error('Erro ao buscar/criar cliente:', customerError.response?.data || customerError.message);
            const asaasErrors = customerError.response?.data?.errors;
            let errorMessage = 'Erro ao cadastrar cliente. Verifique o CPF/E-mail.';
            if (asaasErrors && asaasErrors.length > 0) {
                errorMessage = asaasErrors[0].description; // Retorna o erro real do Asaas (ex: "CPF inválido")
            }
            return res.status(400).json({ error: errorMessage });
        }

        // 2. Criar a Assinatura com Cartão de Crédito
        try {
            const [expiryMonth, expiryYear] = paymentInfo.expiry.split('/');
            
            const subscriptionResponse = await axios.post(`${ASAAS_URL}/subscriptions`, {
                customer: customerId,
                billingType: 'CREDIT_CARD',
                cycle: 'MONTHLY',
                value: 9.99,
                nextDueDate: new Date().toISOString().split('T')[0], // Hoje
                description: "Plano Pro - LB Finance",
                creditCard: {
                    holderName: paymentInfo.cardName,
                    number: paymentInfo.cardNumber.replace(/\D/g, ''),
                    expiryMonth: expiryMonth,
                    expiryYear: `20${expiryYear}`, // Converte AA para AAAA
                    ccv: paymentInfo.cvv
                },
                creditCardHolderInfo: {
                    name: personalInfo.name,
                    email: personalInfo.email,
                    cpfCnpj: personalInfo.cpf.replace(/\D/g, ''),
                    postalCode: '01001-000', // Mock de CEP necessário pro Asaas
                    addressNumber: '123',
                    phone: personalInfo.phone.replace(/\D/g, '')
                }
            }, getAsaasHeaders());

            return res.json({
                success: true,
                subscriptionId: subscriptionResponse.data.id,
                status: subscriptionResponse.data.status
            });

        } catch (subError) {
            console.error('Erro ao criar assinatura:', subError.response?.data || subError.message);
            const asaasErrors = subError.response?.data?.errors;
            let errorMessage = 'Erro ao processar pagamento.';
            if (asaasErrors && asaasErrors.length > 0) {
                errorMessage = asaasErrors[0].description;
            }
            return res.status(400).json({ error: errorMessage });
        }

    } catch (error) {
        console.error('Erro interno:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});
