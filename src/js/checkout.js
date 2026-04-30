document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations
    setTimeout(() => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => el.classList.add('active'));
    }, 100);

    // Inputs
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvvInput = document.getElementById('cardCvv');
    const form = document.getElementById('paymentForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successModal = document.getElementById('successModal');
    const cardBrandIcon = document.getElementById('cardBrandIcon');

    // ── MASKS ──

    // Card Number Mask & Basic Brand Detection
    cardNumberInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        
        // Add spaces every 4 digits
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formattedValue;

        // Detect Brand
        if (value.startsWith('4')) {
            cardBrandIcon.className = 'fa-brands fa-cc-visa card-brand-icon';
            cardBrandIcon.style.color = '#1a1f71';
        } else if (/^5[1-5]/.test(value)) {
            cardBrandIcon.className = 'fa-brands fa-cc-mastercard card-brand-icon';
            cardBrandIcon.style.color = '#ff5f00';
        } else if (/^3[47]/.test(value)) {
            cardBrandIcon.className = 'fa-brands fa-cc-amex card-brand-icon';
            cardBrandIcon.style.color = '#002663';
        } else {
            cardBrandIcon.className = 'fa-regular fa-credit-card card-brand-icon';
            cardBrandIcon.style.color = 'var(--text-muted)';
        }
    });

    // Expiry Mask (MM/AA)
    cardExpiryInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        
        if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
        }
        e.target.value = value;
    });

    // CVV Mask
    cardCvvInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        e.target.value = value;
    });

    // ── FORM SUBMISSION ──
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset state
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
        
        // Basic Validation

        if (cardNumberInput.value.length < 19) { // 16 digits + 3 spaces
            showError("Número de cartão incompleto.");
            cardNumberInput.focus();
            return;
        }

        if (cardExpiryInput.value.length < 5) {
            showError("Data de validade incompleta.");
            cardExpiryInput.focus();
            return;
        }

        // Real API Call to backend -> Asaas
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processando Pagamento...';

        // Puxar dados da sessão do Supabase
        const SUPABASE_URL = 'https://ijaztxvquuhmcscylgzo.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqYXp0eHZxdXVobWNzY3lsZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDk2NjksImV4cCI6MjA5MjAyNTY2OX0.sJDBshc0xFK21jukhdxi461z_loQDR509wOY-nrK514';
        const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
        
        if(!sb) {
            showError("Erro interno: Supabase não carregado.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Assinar Agora';
            return;
        }

        const { data: { session } } = await sb.auth.getSession();
        
        if (!session) {
            showError("Você precisa estar logado para assinar.");
            setTimeout(() => window.location.href = 'login.html', 2000);
            return;
        }

        const meta = session.user.user_metadata || {};
        if (!meta.cpf || !meta.phone || !meta.full_name) {
            showError("Seu perfil está incompleto. Redirecionando...");
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }

        const personalInfo = {
            name: meta.full_name,
            email: session.user.email,
            cpf: meta.cpf,
            phone: meta.phone
        };

        const paymentInfo = {
            cardNumber: cardNumberInput.value,
            cardName: document.getElementById('cardName').value,
            expiry: cardExpiryInput.value,
            cvv: cardCvvInput.value
        };

        const SUPABASE_FN_URL = 'https://ijaztxvquuhmcscylgzo.supabase.co/functions/v1/create-subscription';

        fetch(SUPABASE_FN_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ personalInfo, paymentInfo })
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao processar pagamento.');
            }
            return data;
        })
        .then(data => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Assinar Agora';
            
            // Show Success
            successModal.classList.add('active');
        })
        .catch(error => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Assinar Agora';
            showError(error.message);
        });
    });

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.style.display = 'block';
        // Add a slight shake animation
        errorMessage.style.animation = 'none';
        errorMessage.offsetHeight; /* trigger reflow */
        errorMessage.style.animation = 'shake 0.4s';
    }
});
