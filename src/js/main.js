// ── STATE ──
const _cachedPlan = JSON.parse(localStorage.getItem('lb_plan_cache') || '{}');

const appState = {
    user: { id: null, name: '', email: '', cpf: '', phone: '', status: 'Starter' },
    smartAlertShown: false,
    transactions: [],
    categories: [],
    accounts: [],
    cards: [],
    recurring: [],
    goals: [],
    editingCardIndex: null,
    currentEntryType: 'expense',
    currentCatView: 'expense',
    currentRecType: 'expense',
    editingCatIndex: null,
    editingAccIndex: null,
    editingRecIndex: null,
    catSort: 'alpha',
    entryRegime: 'Variável',
    entryOccurrence: 'Única',
    isSignUp: false,
    quickEntryType: 'expense',
    reportsView: 'overview',
    plan: _cachedPlan.plan || 'basic',
    planStatus: _cachedPlan.status || 'inactive',
    planEnd: _cachedPlan.end || null,
    planCycle: _cachedPlan.cycle || null,
    planStart: _cachedPlan.start || null,
    paymentMethod: null,
};

export const ICONS_SET = ["🍔", "🚗", "🏠", "💊", "🎮", "📚", "👕", "🛒", "💻", "💰", "✈️", "🎵", "📈", "💼", "🎁", "🌟", "🏋️", "☕", "🎯", "🔧"];
export const COLORS_SET = ["var(--accent)", "var(--accent-2)", "#A855F7", "#C084FC", "#DC2626", "#059669", "#EA580C", "#4B5563"];



import './subscription-ux.js';

// --- INICIALIZAÇÃO GLOBAL ---
window.appState = appState;
console.log('App State carregado:', appState);

// ── DIAGNÓSTICO GLOBAL DE ERROS ──
        window.onerror = function (msg, url, line, col, error) {
            if (typeof showToast === 'function') {
                showToast('Erro de Sistema: ' + msg + ' (Linha: ' + line + ')', 'error');
            }
            return false;
        };
        window.onunhandledrejection = function (event) {
            if (typeof showToast === 'function') {
                showToast('Erro de Promessa: ' + (event.reason || 'desconhecido'), 'error');
            }
        };

        // ── SUPABASE ──
        const SUPABASE_URL = 'https://ijaztxvquuhmcscylgzo.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqYXp0eHZxdXVobWNzY3lsZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDk2NjksImV4cCI6MjA5MjAyNTY2OX0.sJDBshc0xFK21jukhdxi461z_loQDR509wOY-nrK514';

        let _supabase;
        try {
            if (typeof supabase !== 'undefined') {
                _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            } else {
                console.error('Erro Crítico: Biblioteca Supabase não carregada.');
            }
        } catch (e) {
            console.error('Erro ao inicializar cliente Supabase:', e);
        }

        // Aviso visível se a chave parece inválida
        window.addEventListener('DOMContentLoaded', () => {
            if (!SUPABASE_KEY.startsWith('eyJ')) {
                setTimeout(() => {
                    showToast('⚠️ Chave Supabase inválida! Vá em Settings → API e substitua pela "anon public" key (começa com eyJ...).', 'error');
                }, 1500);
            }
        });

        // ── STATE ──
        const _cachedPlan = JSON.parse(localStorage.getItem('lb_plan_cache') || '{}');
        Object.assign(appState, {
            user: { id: null, name: '', email: '', cpf: '', phone: '', status: 'Starter' },
            smartAlertShown: false,
            transactions: [],
            categories: [],
            accounts: [],
            cards: [],
            recurring: [],
            goals: [],
            editingCardIndex: null,
            currentEntryType: 'expense',
            currentCatView: 'expense',
            currentRecType: 'expense',
            editingCatIndex: null,
            editingAccIndex: null,
            editingRecIndex: null,
            catSort: 'alpha',
            entryRegime: 'Variável',
            entryOccurrence: 'Única',
            isSignUp: false,
            quickEntryType: 'expense',
            reportsView: 'overview', // 'overview' | 'income' | 'expense'
            plan: _cachedPlan.plan || 'basic',           // 'basic' | 'pro'
            planStatus: _cachedPlan.status || 'inactive',  // 'active' | 'overdue' | 'cancelled' | 'inactive'
            planEnd: _cachedPlan.end || null,
            planCycle: _cachedPlan.cycle || null,
            planStart: _cachedPlan.start || null,
            paymentMethod: null,
        });

        const ICONS_SET = ["🍔", "🚗", "🏠", "💊", "🎮", "📚", "👕", "🛒", "💻", "💰", "✈️", "🎵", "📈", "💼", "🎁", "🌟", "🏋️", "☕", "🎯", "🔧"];
        const COLORS_SET = ["var(--accent)", "var(--accent-2)", "#A855F7", "#C084FC", "#DC2626", "#059669", "#EA580C", "#4B5563"];

        let selIcon = ICONS_SET[0], selColor = COLORS_SET[0];
        let accSelColor = COLORS_SET[0];

        // ── TOAST PREMIUM ──
        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;

            let icon = 'info';
            if (type === 'success') icon = 'check-circle';
            if (type === 'error') icon = 'alert-circle';

            toast.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
            container.appendChild(toast);
            if (typeof lucide !== 'undefined') lucide.createIcons();

            setTimeout(() => {
                toast.classList.add('removing');
                setTimeout(() => toast.remove(), 400);
            }, 4000);
        }

        // ── CONFETTI FEEDBACK ──
        function triggerConfetti() {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
            const randomInRange = (min, max) => Math.random() * (max - min) + min;
            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }

        // ── SMART ALERTS LOGIC ──
        function checkInactivity() {
            const last = localStorage.getItem('last_active_finance');
            if (last) {
                const diff = Date.now() - parseInt(last);
                const hours = diff / (1000 * 60 * 60);
                if (hours > 48) {
                    setTimeout(() => {
                        showToast("Você esqueceu de anotar algo hoje? Mantenha sua saúde financeira em dia! 🚀", "info");
                    }, 2000);
                }
            }
        }

        function updateSmartAlerts() {
            const totalBalance = appState.accounts.reduce((s, a) => s + Number(a.balance), 0);
            const now = new Date();
            const year = now.getUTCFullYear();
            const month = now.getUTCMonth() + 1;

            const launchedRecTitles = appState.transactions
                .filter(t => {
                    const d = new Date(t.date);
                    return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
                })
                .map(t => (t.description || '').toLowerCase());

            const pendingRecs = appState.recurring.filter(r => {
                if (!r.active || r.type !== 'expense') return false;
                if (!isRecValid(r, year, month)) return false;
                const alreadyLaunched = launchedRecTitles.some(desc => desc.includes(r.name.toLowerCase()));
                return !alreadyLaunched;
            });

            let simulatedBal = totalBalance;
            let crisisRec = null;
            const sortedRecs = [...pendingRecs].sort((a, b) => a.day_of_month - b.day_of_month);

            for (const rec of sortedRecs) {
                simulatedBal -= Number(rec.amount);
                if (simulatedBal < 0) { crisisRec = rec; break; }
            }

            if (crisisRec) {
                const today = now.getUTCDate();
                const daysLeft = crisisRec.day_of_month - today;
                let message = "";
                if (daysLeft < 0) {
                    message = `Urgente: Seu saldo já está comprometido por contas vencidas (ex: ${crisisRec.name}).`;
                } else if (daysLeft === 0) {
                    message = `Atenção: Seu saldo ficará negativo hoje com o pagamento de ${crisisRec.name}.`;
                } else if (daysLeft <= 15) {
                    message = `Aviso: Seu saldo poderá ficar negativo em ${daysLeft} dias devido a gastos como ${crisisRec.name}.`;
                }
                if (message && !appState.smartAlertShown) {
                    appState.smartAlertShown = true;
                    setTimeout(() => { showToast(message, 'error'); }, 2000);
                }
            }
        }

        // ── AUTH ──
        function toggleAuthMode() {
            appState.isSignUp = !appState.isSignUp;
            document.getElementById('auth-title').innerText = appState.isSignUp ? 'Criar Nova Conta' : 'Bem-vindo de volta!';
            document.getElementById('auth-subtitle').innerText = appState.isSignUp ? 'Comece sua jornada financeira premium' : 'Acesse sua conta do LB finance';
            document.getElementById('auth-submit-btn').innerText = appState.isSignUp ? 'Cadastrar e Acessar' : 'Entrar no Sistema';
            document.getElementById('auth-toggle-text').innerText = appState.isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?';
            document.getElementById('auth-toggle-link').innerText = appState.isSignUp ? ' Fazer Login' : ' Criar uma agora';
        }

        async function handleAuthAction() {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-pass').value;

            if (!email || !password) return showToast('Preencha email e senha!', 'error');
            if (!_supabase) return showToast('Erro: serviço não carregado. Recarregue a página.', 'error');

            const btn = document.getElementById('auth-submit-btn');
            btn.disabled = true;
            const originalText = btn.innerText;
            btn.innerText = 'Entrando...';

            try {
                if (appState.isSignUp) {
                    const { error } = await _supabase.auth.signUp({ email, password });
                    if (error) throw error;
                    showToast('Conta criada! Verifique seu email para confirmar o cadastro.', 'success');
                } else {
                    const { error } = await _supabase.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                    await checkSession();
                }
            } catch (err) {
                console.error('Erro de autenticação:', err);
                showToast('Erro ao entrar: ' + (err.message || 'Verifique email e senha.'), 'error');
                window.location.href = 'login.html';
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }

        async function checkSession() {
            if (!_supabase) return;

            // Restaurar estado do sidebar
            if (localStorage.getItem('sidebar_collapsed') === 'true') {
                document.querySelector('.sidebar').classList.add('collapsed');
                document.body.classList.add('sidebar-collapsed');
            }

            try {
                const { data: { session }, error } = await _supabase.auth.getSession();
                if (error) throw error;

                if (session) {
                    appState.user.id = session.user.id;
                    appState.user.email = session.user.email;

                    const meta = session.user.user_metadata || {};
                    if (!meta.cpf) {
                        setTimeout(() => {
                            const modal = document.getElementById('completeProfileModal');
                            if (modal) {
                                modal.style.display = 'flex';
                                if (meta.full_name) {
                                    document.getElementById('cp-name').value = meta.full_name;
                                }
                            }
                        }, 500);
                    }

                    // Esconde a tela de login
                    const authScreen = document.getElementById('auth-screen');
                    if (authScreen) authScreen.style.display = 'none';

                    showToast('Acesso autorizado! Carregando dados...', 'success');

                    // Se temos cache, já atualizamos a UI para evitar flicker do Pro para Básico
                    if (appState.plan === 'pro') {
                        updateUI();
                        updatePlanBadge();
                    }

                    try {
                        await syncAllData();
                        await loadUserPlan();
                        updateUI();

                        // Se havia pagamento pendente, inicia polling automático
                        const pendingTs = localStorage.getItem('lb_payment_pending');
                        if (pendingTs && appState.plan !== 'pro') {
                            const elapsed = Date.now() - parseInt(pendingTs, 10);
                            if (elapsed < 10 * 60 * 1000) { // até 10 min
                                setTimeout(() => _startPaymentPolling(), 3000);
                            } else {
                                localStorage.removeItem('lb_payment_pending');
                            }
                        }
                    } catch (syncErr) {
                        console.error('Erro na sincronização:', syncErr);
                        showToast('Erro ao carregar dados. Verifique sua conexão.', 'error');
                        updateUI();
                    }
                } else {
                    window.location.href = 'login.html';
                    // Se estiver via file://, avisar o usuário
                    if (location.protocol === 'file:') {
                        showToast('Nota: Recomendamos usar um servidor local (Live Server) para evitar problemas de login.', 'info');
                    }
                }
            } catch (err) {
                console.error('Erro ao verificar sessão:', err);
                showToast('Erro ao conectar com Supabase. Verifique sua conexão e chaves de API.', 'error');
                window.location.href = 'login.html';
            }
        }

        /* ══════════════════════════════════════
           PLANOS — modal + checkout
        ══════════════════════════════════════ */
        const SUPABASE_FN = 'https://ijaztxvquuhmcscylgzo.supabase.co/functions/v1';
        let _planCycle = 'monthly'; // 'monthly' | 'yearly'

        function openPlanModal() {
            if (appState.plan === 'pro') { switchTab('assinatura'); return; }
            _planCycle = 'monthly';
            _updateCycleUI();
            const m = document.getElementById('modal-planos');
            m.style.display = 'flex';
            setTimeout(() => m.classList.add('active'), 10);
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        function closePlanModal() {
            const m = document.getElementById('modal-planos');
            m.classList.remove('active');
            setTimeout(() => m.style.display = 'none', 200);
        }
        function togglePlanCycle() {
            _planCycle = _planCycle === 'monthly' ? 'yearly' : 'monthly';
            _updateCycleUI();
        }
        function _updateCycleUI() {
            const price  = document.getElementById('plan-price');
            const period = document.getElementById('plan-period');
            const note   = document.getElementById('plan-annual-note');
            const togM   = document.getElementById('tog-mensal');
            const togA   = document.getElementById('tog-anual');
            const yearly = _planCycle === 'yearly';

            if (price)  price.textContent = yearly ? 'R$ 99,99' : 'R$ 9,99';
            if (period) period.textContent = yearly ? '/ano' : '/mês';
            if (note)   note.textContent = yearly ? 'Equivale a R$ 8,33/mês' : 'Cobrado mensalmente';

            if (togM) { togM.style.background = yearly ? 'transparent' : '#fff'; togM.style.color = yearly ? 'rgba(255,255,255,0.6)' : 'var(--accent-2)'; }
            if (togA) { togA.style.background = yearly ? '#fff' : 'transparent'; togA.style.color = yearly ? 'var(--accent-2)' : 'rgba(255,255,255,0.6)'; }
        }

        function openCheckoutModal() {
            window.location.href = 'checkout.html';
        }
        function closeCheckoutModal() {
            const m = document.getElementById('modal-checkout');
            if(m) {
                m.classList.remove('active');
                setTimeout(() => m.style.display = 'none', 200);
            }
        }

        function maskCPF(el) {
            let v = el.value.replace(/\D/g,'').slice(0,11);
            v = v.replace(/(\d{3})(\d)/,'$1.$2')
                 .replace(/(\d{3})(\d)/,'$1.$2')
                 .replace(/(\d{3})(\d{1,2})$/,'$1-$2');
            el.value = v;
        }
        function maskPhone(el) {
            let v = el.value.replace(/\D/g,'').slice(0,11);
            v = v.replace(/(\d{2})(\d)/,'($1) $2')
                 .replace(/(\d{5})(\d{1,4})$/,'$1-$2');
            el.value = v;
        }

        async function submitCheckout() {
            const name  = document.getElementById('co-name')?.value.trim();
            const cpf   = document.getElementById('co-cpf')?.value.replace(/\D/g,'');
            const phone = document.getElementById('co-phone')?.value.replace(/\D/g,'');
            const email = appState.user.email;

            if (!name || name.length < 3) return showToast('Informe seu nome completo.','error');
            if (!cpf || cpf.length !== 11)   return showToast('CPF inválido.','error');
            if (!phone || phone.length < 10) return showToast('Telefone inválido.','error');

            const btn = document.getElementById('co-btn');
            const lbl = document.getElementById('co-btn-label');
            if (btn) btn.disabled = true;
            if (lbl) lbl.textContent = 'Processando...';

            try {
                const { data: { session } } = await _supabase.auth.getSession();
                const res = await fetch(`${SUPABASE_FN}/create-subscription`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        billing_cycle: _planCycle,
                        name, email,
                        cpfCnpj: cpf,
                        phone,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erro ao criar assinatura.');

                closeCheckoutModal();

                // Marca pagamento como pendente para polling automático
                localStorage.setItem('lb_payment_pending', Date.now().toString());

                const openPayment = (url) => {
                    showToast('✅ Assinatura criada! Redirecionando para o pagamento...', 'success');
                    setTimeout(() => {
                        window.open(url, '_blank');
                        // Inicia polling automático após abrir o link
                        _startPaymentPolling();
                    }, 700);
                });

                if (data.paymentUrl) {
                    openPayment(data.paymentUrl);
                } else if (data.subscriptionId) {
                    try {
                        const { data: { session: s2 } } = await _supabase.auth.getSession();
                        const r2 = await fetch(`${SUPABASE_FN}/get-payment-url?subscriptionId=${data.subscriptionId}`, {
                            headers: { 'Authorization': `Bearer ${s2.access_token}` }
                        });
                        const d2 = await r2.json();
                        if (d2.paymentUrl) {
                            openPayment(d2.paymentUrl);
                        } else {
                            showToast('Link de pagamento enviado para o seu email.', 'success');
                            _startPaymentPolling();
                        }
                    } catch(_) {
                        showToast('Link de pagamento enviado para o seu email.', 'success');
                        _startPaymentPolling();
                    }
                }
            } catch(e) {
                showToast(e.message, 'error');
            } finally {
                if (btn) btn.disabled = false;
                if (lbl) lbl.textContent = 'Pagar com segurança →';
            }
        }

        // Polling automático: verifica o pagamento a cada 15s por até 10 minutos
        let _pollTimer = null;
        function _startPaymentPolling() {
            if (_pollTimer) return; // já rodando
            let attempts = 0;
            const MAX = 40; // 40 × 15s = 10 min

            console.log('🔄 LB Finance: iniciando verificação automática de pagamento...');

            _pollTimer = setInterval(async () => {
                attempts++;
                if (attempts > MAX) {
                    clearInterval(_pollTimer); _pollTimer = null;
                    localStorage.removeItem('lb_payment_pending');
                    return;
                }
                try {
                    const result = await window._syncPlanFromASAAS(false);
                    if (result && result.plan === 'pro') {
                        clearInterval(_pollTimer); _pollTimer = null;
                        // _syncPlanFromASAAS já chama _showProWelcome quando muda para pro
                    }
                } catch(_) { /* silencioso */ }
            }, 15000);
        }
        window._startPaymentPolling = _startPaymentPolling;

        function _showProWelcome() {
            const m     = document.getElementById('modal-pro-welcome');
            const inner = document.getElementById('modal-pro-welcome-inner');
            if (!m) return;
            m.style.display = 'flex';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (inner) { inner.style.transform = 'scale(1) translateY(0)'; inner.style.opacity = '1'; }
                });
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
            // Confetti
            if (typeof window.confetti === 'function') {
                setTimeout(() => window.confetti({ particleCount: 140, spread: 90, origin: { y: 0.5 } }), 300);
                setTimeout(() => window.confetti({ particleCount: 60,  spread: 60, origin: { x: 0.2, y: 0.6 } }), 700);
                setTimeout(() => window.confetti({ particleCount: 60,  spread: 60, origin: { x: 0.8, y: 0.6 } }), 900);
            }
        }
        function _closeProWelcome() {
            const m     = document.getElementById('modal-pro-welcome');
            const inner = document.getElementById('modal-pro-welcome-inner');
            if (!m) return;
            if (inner) { inner.style.transform = 'scale(.92) translateY(24px)'; inner.style.opacity = '0'; }
            setTimeout(() => { m.style.display = 'none'; }, 320);
            // Redireciona para a aba assinatura após fechar
            switchTab('assinatura');
        }
        window._showProWelcome  = _showProWelcome;
        window._closeProWelcome = _closeProWelcome;

        // Quando o usuário volta para a aba do app após pagar no ASAAS
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && appState.plan !== 'pro') {
                const pendingTs = localStorage.getItem('lb_payment_pending');
                if (pendingTs) {
                    const elapsed = Date.now() - parseInt(pendingTs, 10);
                    if (elapsed < 10 * 60 * 1000) {
                        // Faz sync imediato ao voltar para o app
                        window._syncPlanFromASAAS(false).catch(() => {});
                    } else {
                        localStorage.removeItem('lb_payment_pending');
                    }
                }
            }
        });

        function _legacyUpdateSubscriptionUI_UNUSED() {

            const isPro   = appState.plan === 'pro';
            const status  = appState.planStatus;
            const cycle   = appState.planCycle;
            const end     = appState.planEnd ? new Date(appState.planEnd).toLocaleDateString('pt-BR') : null;

            // ── Hero card
            const nameEl   = document.getElementById('sub-plan-name');
            const badgeEl  = document.getElementById('sub-plan-status-badge');
            const metaEl   = document.getElementById('sub-plan-meta');
            const actionsEl= document.getElementById('sub-plan-actions');

            if (nameEl)  nameEl.textContent = isPro ? 'Pro' : 'Básico';

            if (badgeEl) {
                const map = { active:'● Ativo', overdue:'⚠ Em atraso', cancelled:'✕ Cancelado', inactive:'Gratuito' };
                badgeEl.textContent = map[status] || 'Gratuito';
                const styles = {
                    active:    { bg:'rgba(16,185,129,0.15)', color:'#34d399', border:'rgba(52,211,153,0.3)' },
                    overdue:   { bg:'rgba(245,158,11,0.15)', color:'#fbbf24', border:'rgba(251,191,36,0.3)' },
                    cancelled: { bg:'rgba(239,68,68,0.12)',  color:'#f87171', border:'rgba(248,113,113,0.3)' },
                    inactive:  { bg:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', border:'rgba(255,255,255,0.2)' },
                });
                const s = styles[status] || styles.inactive;
                badgeEl.style.background = s.bg;
                badgeEl.style.color      = s.color;
                badgeEl.style.border     = `1px solid ${s.border}`;
            }
            if (metaEl) metaEl.textContent = isPro && end
                ? `${cycle==='yearly'?'Plano Anual':'Plano Mensal'} · Renova em ${end}`
                : 'Sem cobrança — plano gratuito';

            const syncBtn = `<button id="sub-sync-btn" onclick="triggerPlanSync(this)" style="padding:8px 14px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);backdrop-filter:blur(6px);border-radius:10px;font-size:0.73rem;font-weight:700;cursor:pointer;color:rgba(255,255,255,0.7);transition:all .15s;display:flex;align-items:center;gap:5px;" onmouseover="this.style.background='rgba(255,255,255,0.14)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'"><i data-lucide="refresh-cw" style="width:12px;height:12px;"></i>Verificar</button>`;
            if (actionsEl) actionsEl.innerHTML = isPro
                ? `<div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button onclick="openPlanModal()" style="padding:9px 18px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.1);backdrop-filter:blur(6px);border-radius:11px;font-size:0.78rem;font-weight:700;cursor:pointer;color:rgba(255,255,255,0.85);transition:all .15s;" onmouseover="this.style.background='rgba(255,255,255,0.18)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">Gerenciar plano</button>
                    ${syncBtn}
                  </div>`
                : `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                    <button onclick="openPlanModal()" style="padding:10px 22px;background:#fff;color:var(--accent);border:none;border-radius:12px;font-weight:800;font-size:0.83rem;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);transition:all .15s;" onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.28)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.2)'">Fazer upgrade →</button>
                    ${syncBtn}
                  </div>`;

            // ── Limites de uso
            const limBody = document.getElementById('sub-limits-body');
            if (limBody) {
                const txCount  = countTxThisMonth();
                const catCount = (appState.categories||[]).length;
                const txMax    = isPro ? null : 40;
                const catMax   = isPro ? null : 7;
                limBody.innerHTML = [
                    { icon:'repeat', label:'Lançamentos', sub:'este mês', val:txCount, max:txMax },
                    { icon:'tag',    label:'Categorias',  sub:'total',    val:catCount, max:catMax },
                ].map(item => {
                    const pct      = item.max ? Math.min(100, Math.round(item.val/item.max*100)) : 0;
                    const over     = item.max && item.val >= item.max;
                    const warn     = !over && pct > 75;
                    const barColor = over ? '#ef4444' : warn ? '#f59e0b' : 'var(--accent-2)';
                    const numColor = over ? '#ef4444' : warn ? '#d97706' : 'var(--text-muted)';
                    return `<div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                            <div style="display:flex;align-items:center;gap:7px;">
                                <i data-lucide="${item.icon}" style="width:13px;height:13px;color:var(--accent-2);flex-shrink:0;"></i>
                                <div>
                                    <div style="font-size:0.8rem;font-weight:700;color:var(--text-main);line-height:1.1;">${item.label}</div>
                                    <div style="font-size:0.66rem;color:var(--text-muted);">${item.sub}</div>
                                </div>
                            </div>
                            <span style="font-size:0.82rem;font-weight:800;color:${numColor};">${item.val}${item.max ? '<span style="font-weight:400;color:var(--text-muted);"> / '+item.max+'</span>' : ''}</span>
                        </div>
                        ${item.max
                            ? `<div style="height:5px;background:#f1f5f9;border-radius:10px;overflow:hidden;">
                                <div style="height:100%;width:${pct}%;background:${barColor};border-radius:10px;transition:width .6s cubic-bezier(.2,.8,.3,1);"></div>
                               </div>
                               ${over ? `<div style="font-size:0.66rem;color:#ef4444;font-weight:700;margin-top:5px;">Limite atingido · <span style="cursor:pointer;text-decoration:underline;" onclick="openPlanModal()">Fazer upgrade</span></div>` : ''}`
                            : `<div style="display:flex;align-items:center;gap:4px;font-size:0.72rem;color:#10b981;font-weight:700;margin-top:2px;"><i data-lucide="infinity" style="width:11px;height:11px;"></i> Ilimitado</div>`
                        }
                    </div>`;
                }).join('');
            }

            // ── Lista de features
            const featGrid = document.getElementById('sub-features-grid');
            const FEATURES = [
                ['layout-dashboard', 'Dashboard',            true,   true],
                ['repeat',           'Lançamentos',           true,   isPro ? 'Ilimitados' : 'Até 40/mês'],
                ['tag',              'Categorias',            true,   isPro ? 'Ilimitadas' : 'Até 7'],
                ['target',           'Metas e orçamento',     true,   true],
                ['bar-chart-2',      'Carteira',              isPro,  isPro],
                ['activity',         'Indicadores',           isPro,  isPro],
                ['newspaper',        'Notícias',              isPro,  isPro],
                ['trending-up',      'Comparativo CDI',       isPro,  isPro],
                ['headphones',       'Suporte',               true,   isPro ? 'Prioritário' : 'Padrão'],
            ];
            if (featGrid) featGrid.innerHTML = FEATURES.map(([icon, label, hasIt, detail]) => {
                const active = hasIt === true || (typeof detail === 'string' && detail !== 'Padrão' && detail !== false);
                const text   = detail === true ? 'Incluído' : detail === false ? 'Bloqueado' : detail;
                return `<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f8f9fc;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:22px;height:22px;border-radius:6px;background:${hasIt?'linear-gradient(135deg,#ede9fe,#ddd6fe)':'#f8f9fc'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <i data-lucide="${icon}" style="width:11px;height:11px;color:${hasIt?'var(--accent-2)':'#d1d5db'};"></i>
                        </div>
                        <span style="font-size:0.78rem;font-weight:${hasIt?'600':'400'};color:${hasIt?'var(--text-main)':'#c4c4d4'};">${label}</span>
                    </div>
                    <span style="font-size:0.7rem;font-weight:700;color:${!hasIt?'#d1d5db':active&&text!=='Padrão'?'var(--accent-2)':'#64748b'};background:${!hasIt?'transparent':active&&text!=='Padrão'?'rgba(124,58,237,0.08)':'#f1f5f9'};padding:2px 8px;border-radius:6px;">${text}</span>
                </div>`;
            }).join('');

            // ── Histórico de faturas
            const invBody = document.getElementById('sub-invoices-body');
            if (invBody) {
                if (!isPro) {
                    invBody.innerHTML = `
                        <div style="display:flex;flex-direction:column;align-items:center;padding:28px 16px;gap:10px;">
                            <div style="width:48px;height:48px;border-radius:14px;background:#f8f9fc;display:flex;align-items:center;justify-content:center;">
                                <i data-lucide="receipt" style="width:22px;height:22px;color:#d1d5db;"></i>
                            </div>
                            <div style="font-size:0.85rem;font-weight:600;color:var(--text-muted);">Nenhuma fatura</div>
                            <div style="font-size:0.75rem;color:var(--text-muted);text-align:center;max-width:260px;line-height:1.5;">Você está no plano gratuito. Faça upgrade para o Pro e acompanhe seu histórico aqui.</div>
                            <button onclick="openPlanModal()" style="margin-top:4px;padding:8px 20px;background:var(--primary-gradient);color:#fff;border:none;border-radius:10px;font-size:0.78rem;font-weight:700;cursor:pointer;">Ver planos →</button>
                        </div>`;
                } else {
                    invBody.innerHTML = `
                        <div style="display:flex;flex-direction:column;align-items:center;padding:28px 16px;gap:10px;">
                            <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#ede9fe,#ddd6fe);display:flex;align-items:center;justify-content:center;">
                                <i data-lucide="check-circle" style="width:22px;height:22px;color:var(--accent-2);"></i>
                            </div>
                            <div style="font-size:0.85rem;font-weight:600;color:var(--text-main);">Histórico de faturas</div>
                            <div style="font-size:0.75rem;color:var(--text-muted);text-align:center;max-width:280px;line-height:1.5;">Suas faturas são gerenciadas pelo ASAAS. Acesse o portal para ver o histórico completo.</div>
                            <a href="https://sandbox.asaas.com" target="_blank" style="margin-top:4px;padding:8px 20px;background:#f8f9fc;color:var(--accent);border:1px solid #ddd6fe;border-radius:10px;font-size:0.78rem;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:5px;">
                                <i data-lucide="external-link" style="width:12px;height:12px;"></i>Ver no portal ASAAS
                            </a>
                        </div>`;
                }
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // window.updateSubscriptionUI — defined in subscription-ux.js
        window.openPlanModal     = openPlanModal;
        window.closePlanModal    = closePlanModal;
        window.togglePlanCycle   = togglePlanCycle;
        window.openCheckoutModal = openCheckoutModal;
        window.closeCheckoutModal= closeCheckoutModal;
        window.submitCheckout    = submitCheckout;
        window.maskCPF           = maskCPF;
        window.maskPhone         = maskPhone;
        window.switchTabGated    = switchTabGated;

        async function loadUserPlan() {
            if (!appState.user.id || !_supabase) return;
            try {
                // Primeira tentativa: lê do Supabase local
                const { data, error } = await _supabase
                    .from('subscriptions')
                    .select('plan, status, current_period_end, billing_cycle, created_at')
                    .eq('user_id', appState.user.id)
                    .maybeSingle();

                if (data && data.plan === 'pro' && data.status === 'active') {
                    appState.plan       = 'pro';
                    appState.planStatus = 'active';
                    appState.planEnd    = data.current_period_end;
                    appState.planCycle  = data.billing_cycle;
                    appState.planStart  = data.created_at || null;

                    // Salvar no cache
                    localStorage.setItem('lb_plan_cache', JSON.stringify({
                        plan: appState.plan,
                        status: appState.planStatus,
                        end: appState.planEnd,
                        cycle: appState.planCycle,
                        start: appState.planStart
                    }));

                    updatePlanBadge();
                    return; // SUCESSO: Se é pro no banco, para aqui.
                }

                // Se não está ativo localmente no banco, tenta sincronizar com ASAAS
                try {
                    await _syncPlanFromASAAS();
                } catch (e) {
                    console.warn('syncPlan falhou, definindo como basic:', e);
                    appState.plan = 'basic';
                    appState.planStatus = 'inactive';
                }

                updatePlanBadge();
            } catch(e) {
                console.warn('loadUserPlan erro crítico:', e);
                appState.plan = 'basic';
                updatePlanBadge();
            }
        }

        async function _syncPlanFromASAAS(showToastMsg = false) {
            // Se já somos PRO e ativos, não precisamos que o Asaas nos diga o contrário
            if (appState.plan === 'pro' && appState.planStatus === 'active') {
                return { plan: 'pro', status: 'active' };
            }

            try {
                const { data: { session } } = await _supabase.auth.getSession();
                if (!session) return;
                const res  = await fetch(`${SUPABASE_FN}/sync-subscription`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Erro na sincronização');

                const wasBasic = appState.plan !== 'pro';
                
                // Só atualizamos se o Asaas confirmar que é PRO 
                // ou se o usuário realmente não for PRO no banco.
                if (data.plan === 'pro' || appState.plan !== 'pro') {
                    appState.plan       = data.plan;
                    appState.planStatus = data.status;
                }
                appState.planEnd    = data.end   || null;
                appState.planCycle  = data.cycle || null;
                appState.planStart  = data.start || null;

                // Salvar no cache após sync
                localStorage.setItem('lb_plan_cache', JSON.stringify({
                    plan: appState.plan,
                    status: appState.planStatus,
                    end: appState.planEnd,
                    cycle: appState.planCycle,
                    start: appState.planStart
                }));

                // Atualiza badge da sidebar
                updatePlanBadge();

                // Atualiza aba assinatura
                if (typeof window.updateSubscriptionUI === 'function') window.updateSubscriptionUI();

                if (data.plan === 'pro' && wasBasic && !localStorage.getItem('lb_pro_welcomed')) {
                    // Primeira vez que ativa o Pro neste dispositivo: mostra boas-vindas
                    localStorage.removeItem('lb_payment_pending');
                    localStorage.setItem('lb_pro_welcomed', '1');
                    _showProWelcome();
                } else if (showToastMsg) {
                    if (data.plan === 'pro') {
                        showToast('✅ Plano Pro já está ativo!', 'success');
                    } else {
                        showToast('Nenhum pagamento confirmado encontrado.', 'error');
                    }
                }

                return data;
            } catch(e) {
                if (showToastMsg) showToast('Erro ao verificar: ' + e.message, 'error');
                throw e;
            }
        }

        window._syncPlanFromASAAS = _syncPlanFromASAAS;

        async function triggerPlanSync(btn) {
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i data-lucide="loader" style="width:12px;height:12px;animation:spin 1s linear infinite;"></i>Verificando...';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
            try {
                await _syncPlanFromASAAS(true);
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i data-lucide="refresh-cw" style="width:12px;height:12px;"></i>Verificar';
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
            }
        }
        window.triggerPlanSync = triggerPlanSync;

        function updatePlanBadge() {
            const badge = document.getElementById('sidebar-plan-badge');
            if (!badge) return;
            if (appState.plan === 'pro') {
                badge.textContent = 'PRO';
                badge.style.background = 'var(--primary-gradient)';
                badge.style.color = '#fff';
            } else {
                badge.textContent = 'Básico';
                badge.style.background = 'rgba(255,255,255,0.1)';
                badge.style.color = 'rgba(255,255,255,0.6)';
            }
            // Esconde badge PRO dos nav links se já for pro
            document.querySelectorAll('.nav-pro-badge').forEach(el => {
                el.style.display = appState.plan === 'pro' ? 'none' : '';
            });
        }

        async function handleLogout() {
            await _supabase.auth.signOut();
            // Limpar cache do plano
            localStorage.removeItem('lb_plan_cache');
            // Limpar campos de login para evitar autopreenchimento da sessão anterior
            const le = document.getElementById('login-email');
            const lp = document.getElementById('login-pass');
            if (le) le.value = '';
            if (lp) lp.value = '';
            // Resetar estado do usuário em memória
            appState.user = { id: null, name: '', email: '', status: 'Free' };
            appState.transactions = [];
            appState.categories = [];
            appState.accounts = [];
            appState.recurring = [];
            appState.goals = [];
            window.location.href = 'login.html';
        }

        // ── SYNC ──
        async function syncAllData() {
            if (!appState.user.id || !_supabase) return;

            console.log('Iniciando sincronização resiliente...');

            // Função auxiliar para carregar uma tabela com segurança
            const safeFetch = async (tableName, query) => {
                try {
                    const { data, error } = await query;
                    if (error) {
                        if (error.code === '42P01') {
                            console.error(`ERRO CRÍTICO: A tabela '${tableName}' não existe no seu banco de dados Supabase.`);
                            console.warn(`Ação Sugerida: Execute o script SQL correspondente para criar a tabela '${tableName}'.`);
                        } else if (error.code === 'PGRST116' && tableName === 'profiles') {
                            return null; // Perfil não encontrado é esperado para novos usuários
                        } else {
                            console.warn(`Aviso ao carregar ${tableName}:`, error.message);
                        }
                        return null;
                    }
                    return data;
                } catch (e) {
                    console.error(`Falha inesperada ao tentar acessar a tabela '${tableName}':`, e);
                    return null;
                }
            });

            // 1. Perfil (Individual)
            const profile = await safeFetch('profiles', _supabase.from('profiles').select('*').eq('id', appState.user.id).single());
            if (profile) {
                appState.user.name = profile.full_name || 'Usuário';
                appState.user.cpf = profile.cpf || '';
                appState.user.phone = profile.phone || '';
            } else if (appState.user.id) {
                // Criar perfil se não existir
                await _supabase.from('profiles').insert([{ id: appState.user.id, full_name: 'Usuário' }]).select();
                appState.user.name = 'Usuário';
            }

            // 2. Categorias (Individual)
            const cats = await safeFetch('categories', _supabase.from('categories').select('*').eq('user_id', appState.user.id));
            appState.categories = cats || [];
            if (cats !== null && appState.categories.length === 0 && appState.user.id) {
                const defaults = [
                    { user_id: appState.user.id, name: 'Alimentação', icon: '🍔', color: '#FFB547', budget: 1500, type: 'expense' },
                    { user_id: appState.user.id, name: 'Transporte', icon: '🚗', color: '#3B82F6', budget: 800, type: 'expense' },
                    { user_id: appState.user.id, name: 'Saúde', icon: '💊', color: '#FF5A7E', budget: 500, type: 'expense' },
                    { user_id: appState.user.id, name: 'Salário', icon: '💰', color: '#00D4AA', budget: 0, type: 'income' }
                ];
                const { error: catInsertError } = await _supabase.from('categories').insert(defaults).select();
                if (catInsertError) showToast('Erro ao criar categorias padrão: ' + catInsertError.message, 'error');
                const refreshedCats = await safeFetch('categories', _supabase.from('categories').select('*').eq('user_id', appState.user.id));
                appState.categories = refreshedCats || [];
            }

            // 3. Contas (Individual)
            const accs = await safeFetch('accounts', _supabase.from('accounts').select('*').eq('user_id', appState.user.id));
            appState.accounts = accs || [];
            // Garantir conta "Dinheiro Vivo"
            if (accs !== null) {
                const hasCash = appState.accounts.some(a => a.name === 'Dinheiro Vivo');
                if (!hasCash) {
                    const cashAcc = { user_id: appState.user.id, name: 'Dinheiro Vivo', color: '#10B981', balance: 0 };
                    const { error: accInsertError } = await _supabase.from('accounts').insert([cashAcc]).select();
                    if (accInsertError) showToast('Erro ao criar conta Dinheiro Vivo: ' + accInsertError.message, 'error');
                    const refreshedAccs = await safeFetch('accounts', _supabase.from('accounts').select('*').eq('user_id', appState.user.id));
                    appState.accounts = refreshedAccs || [];
                }
            }

            // 3.5 Cartões (Individual)
            const cardsData = await safeFetch('cards', _supabase.from('cards').select('*').eq('user_id', appState.user.id).order('created_at', { ascending: true }));
            appState.cards = cardsData || [];

            // 4. Transações (Individual)
            const txs = await safeFetch('transactions', _supabase.from('transactions').select('*').eq('user_id', appState.user.id).order('date', { ascending: false }));
            appState.transactions = txs || [];

            // 5. Recorrentes (Individual)
            const recs = await safeFetch('recurring', _supabase.from('recurring').select('*').eq('user_id', appState.user.id));
            appState.recurring = recs || [];

            // 6. Metas (Individual)
            const goalsData = await safeFetch('goals', _supabase.from('goals').select('*').eq('user_id', appState.user.id).order('created_at', { ascending: false }));
            appState.goals = goalsData || [];

            // Inicializações Pós-Sync
            try {
                updateSmartAlerts();
                checkInactivity();
                localStorage.setItem('last_active_finance', Date.now().toString());
            } catch (e) {
                console.warn('Alerta: Algumas funções de automação falharam após a sincronização.', e);
            }

            console.log('Sincronização concluída.');
        }


        // Forçar renderização de ícones Lucide
        function forceIcons() {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                console.log('Lucide icons rendered.');
            }
        }


        function updateUI() {
            console.log('Atualizando UI...');
            try {
                const hour = new Date().getHours();
                const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
                const rawFirstName = (appState.user.name || 'Usuário').split(' ')[0].toLowerCase();
                const firstName = rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);
                const dashGreeting = document.getElementById('dash-greeting');
                if (dashGreeting) dashGreeting.innerText = `${greeting}, ${firstName}`;

                const sideName = document.getElementById('side-user-name');
                if (sideName) sideName.innerText = appState.user.name || 'Usuário';

                const sideEmail = document.getElementById('side-user-email');
                if (sideEmail) sideEmail.innerText = appState.user.email || 'Email não definido';

                const sideAvatar = document.getElementById('side-user-avatar');
                if (sideAvatar) sideAvatar.innerText = (appState.user.name || 'US').substring(0, 2).toUpperCase();

                const cfgAvatarBig = document.getElementById('cfg-avatar-big');
                if (cfgAvatarBig) cfgAvatarBig.innerText = (appState.user.name || 'US').substring(0, 2).toUpperCase();

                // Campos de configuração (opcionais)
                ['cfg-name', 'cfg-email', 'cfg-cpf', 'cfg-phone'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = appState.user[id.split('-')[1]] || '';
                });

                // Funções de renderização protegidas
                const safeRun = (fnName) => {
                    try { if (typeof window[fnName] === 'function') window[fnName](); }
                    catch (e) { console.warn('Falha em ' + fnName, e); }
                });

                populateMonthFilters();
                safeRun('renderSettingsAccounts');
                safeRun('renderBankCards');
                safeRun('updateEntryCategories');
                safeRun('updateEntryGoalsList');
                safeRun('populateHistoryFilters');
                safeRun('initDashboard');

                if (typeof lucide !== 'undefined') lucide.createIcons();
                console.log('UI Atualizada com sucesso.');
            } catch (err) {
                console.error('Erro crítico no updateUI:', err);
            }
        }

        // ── PROFILE ──
        async function saveProfile() {
            const updates = {
                id: appState.user.id,
                full_name: document.getElementById('cfg-name').value,
                cpf: document.getElementById('cfg-cpf').value,
                phone: document.getElementById('cfg-phone').value
            });
            const { error } = await _supabase.from('profiles').upsert(updates);
            if (error) return showToast('Erro ao salvar perfil!', 'error');
            appState.user.name = updates.full_name;
            updateUI();
            showToast('Perfil atualizado com sucesso!');
        }

        // ── SEGURANÇA E DADOS ──

        function toggleSecCard(id) {
            const card = document.getElementById(id);
            if (!card) return;
            card.classList.toggle('open');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        async function changePassword() {
            const newPwd = document.getElementById('cfg-new-password').value;
            const confirm = document.getElementById('cfg-confirm-password').value;
            if (!newPwd || newPwd.length < 6) return showToast('A senha precisa ter pelo menos 6 caracteres.', 'error');
            if (newPwd !== confirm) return showToast('As senhas não coincidem.', 'error');
            const { error } = await _supabase.auth.updateUser({ password: newPwd });
            if (error) return showToast('Erro ao alterar senha: ' + error.message, 'error');
            document.getElementById('cfg-new-password').value = '';
            document.getElementById('cfg-confirm-password').value = '';
            showToast('Senha alterada com sucesso! 🔒');
        }

        let _2faFactorId = null, _2faChallengeId = null;

        async function toggle2FA() {
            const qrBox = document.getElementById('twofa-qr-box');
            if (qrBox.style.display !== 'none') {
                qrBox.style.display = 'none';
                return;
            }
            try {
                const { data, error } = await _supabase.auth.mfa.enroll({ factorType: 'totp' });
                if (error) throw error;
                _2faFactorId = data.id;
                document.getElementById('twofa-qr-img').innerHTML =
                    `<img src="${data.totp.qr_code}" style="width:160px;height:160px;border-radius:12px;border:2px solid var(--border);">
                 <div style="margin-top:8px;font-size:0.7rem;color:var(--text-sub);word-break:break-all;padding:0 8px;">${data.totp.secret}</div>`;
                qrBox.style.display = 'block';
                document.getElementById('twofa-toggle-btn').style.display = 'none';
                lucide.createIcons();
            } catch (err) {
                showToast('Erro ao iniciar 2FA: ' + err.message, 'error');
            }
        }

        async function verify2FA() {
            const code = document.getElementById('twofa-code').value.trim();
            if (!code || code.length !== 6) return showToast('Digite o código de 6 dígitos.', 'error');
            try {
                const { data: ch, error: chErr } = await _supabase.auth.mfa.challenge({ factorId: _2faFactorId });
                if (chErr) throw chErr;
                const { error: vErr } = await _supabase.auth.mfa.verify({ factorId: _2faFactorId, challengeId: ch.id, code });
                if (vErr) throw vErr;
                document.getElementById('twofa-qr-box').style.display = 'none';
                document.getElementById('twofa-status-box').innerHTML =
                    `<div style="display:flex;align-items:center;gap:8px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:10px;padding:10px 14px;">
                    <i data-lucide="shield-check" style="width:16px;height:16px;color:#059669;"></i>
                    <span style="font-size:0.82rem;font-weight:600;color:#059669;">2FA ativado com sucesso!</span>
                 </div>`;
                document.getElementById('twofa-toggle-btn').style.display = 'none';
                lucide.createIcons();
                showToast('Autenticação em duas etapas ativada! 🛡️');
            } catch (err) {
                showToast('Código inválido ou expirado.', 'error');
            }
        }

        function exportDataCSV() {
            const txs = appState.transactions;
            if (!txs || txs.length === 0) return showToast('Nenhuma transação para exportar.', 'error');
            const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            const header = ['Data', 'Descrição', 'Categoria', 'Conta', 'Tipo', 'Valor (R$)', 'Regime', 'Ocorrência'];
            const rows = txs.map(t => {
                const d = new Date(t.date + 'T00:00:00');
                const dateStr = `${String(d.getDate()).padStart(2, '0')}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`;
                const tipo = t.type === 'income' ? 'Receita' : (t.goal_id ? 'Meta' : 'Despesa');
                const valor = Number(t.val).toFixed(2).replace('.', ',');
                return [dateStr, t.description || '-', t.category || '-', t.account || '-', tipo, valor, t.regime || '-', t.occurrence || '-']
                    .map(v => `"${String(v).replace(/"/g, '""')}"`).join(';');
            });
            const csv = '\uFEFF' + [header.join(';'), ...rows].join('\r\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const now = new Date();
            a.href = url;
            a.download = `LBFinance_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            showToast(`${txs.length} transações exportadas com sucesso! 📊`);
        }

        /* ── Export Dropdown (Histórico) ── */
        function toggleExportMenu(e) {
            e.stopPropagation();
            const menu = document.getElementById('export-dropdown');
            const btn  = document.getElementById('export-toggle-btn');
            if (!menu) return;
            const isOpen = menu.style.display === 'flex';
            // Fecha outros dropdowns do sistema
            document.querySelectorAll('.month-select-menu').forEach(m => m.style.display = 'none');
            document.querySelectorAll('.month-select-container').forEach(c => c.classList.remove('open'));
            if (isOpen) {
                menu.style.display = 'none';
                btn.style.transform = '';
                btn.textContent = '+';
            } else {
                const rect = btn.getBoundingClientRect();
                menu.style.top  = (rect.bottom + 6) + 'px';
                menu.style.left = (rect.right - 180) + 'px';
                menu.style.display = 'flex';
                btn.style.transform = 'rotate(45deg)';
            }
        }
        // Fecha o menu de exportação ao clicar fora
        document.addEventListener('click', () => {
            const menu = document.getElementById('export-dropdown');
            const btn  = document.getElementById('export-toggle-btn');
            if (menu && menu.style.display === 'flex') {
                menu.style.display = 'none';
                if (btn) { btn.style.transform = ''; btn.textContent = '+'; }
            }
        });

        function _getFilteredHistoryTx() {
            const search   = (document.getElementById('hist-search')?.value || '').toLowerCase();
            const typeF    = document.getElementById('hist-type')?.value  || '';
            const catF     = document.getElementById('hist-cat')?.value   || '';
            const accF     = document.getElementById('hist-acc')?.value   || '';
            const monthF   = document.getElementById('hist-month')?.value || '';
            return (appState.transactions || []).filter(t => {
                if (typeF  && t.type   !== typeF) return false;
                if (catF   && t.category !== catF) return false;
                if (accF   && t.account  !== accF) return false;
                if (monthF && !t.date?.startsWith(monthF)) return false;
                if (search && !(t.description || '').toLowerCase().includes(search) &&
                              !(t.category    || '').toLowerCase().includes(search)) return false;
                return true;
            }).sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        function exportHistoryExcel() {
            document.getElementById('export-dropdown').style.display = 'none';
            document.getElementById('export-toggle-btn').style.transform = '';
            document.getElementById('export-toggle-btn').textContent = '+';
            const txs = _getFilteredHistoryTx();
            if (!txs.length) return showToast('Nenhuma transação para exportar.', 'error');
            const header = ['Data', 'Descrição', 'Categoria', 'Conta', 'Tipo', 'Valor (R$)'];
            const rows = txs.map(t => {
                const d = new Date(t.date + 'T00:00:00');
                const dateStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
                const tipo = t.type === 'income' ? 'Receita' : (t.goal_id ? 'Meta' : 'Despesa');
                const valor = Number(t.val).toFixed(2).replace('.', ',');
                return [dateStr, t.description||'-', t.category||'-', t.account||'-', tipo, valor]
                    .map(v => `"${String(v).replace(/"/g,'""')}"`).join(';');
            });
            const csv = '\uFEFF' + [header.join(';'), ...rows].join('\r\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `LBFinance_Historico_${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
            showToast(`${txs.length} transações exportadas para Excel! 📊`);
        }

        function exportHistoryPDF() {
            document.getElementById('export-dropdown').style.display = 'none';
            document.getElementById('export-toggle-btn').style.transform = '';
            document.getElementById('export-toggle-btn').textContent = '+';
            const txs = _getFilteredHistoryTx();
            if (!txs.length) return showToast('Nenhuma transação para exportar.', 'error');
            const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
            const now = new Date();
            const rows = txs.map(t => {
                const d = new Date(t.date + 'T00:00:00');
                const dateStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
                const tipo = t.type === 'income' ? 'Receita' : (t.goal_id ? 'Meta' : 'Despesa');
                const color = t.type === 'income' ? '#059669' : '#e11d48';
                const sinal = t.type === 'income' ? '+' : '-';
                return `<tr>
                    <td>${dateStr}</td>
                    <td>${t.description || '-'}</td>
                    <td>${t.category || '-'}</td>
                    <td>${t.account  || '-'}</td>
                    <td><span style="background:${color}18;color:${color};padding:2px 8px;border-radius:20px;font-size:0.75rem;font-weight:700;">${tipo}</span></td>
                    <td style="color:${color};font-weight:700;text-align:right;">${sinal} ${Number(t.val).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                </tr>`;
            }).join('');
            const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
            <title>Histórico LB Finance</title>
            <style>
                body{font-family:'Segoe UI',sans-serif;color:#1e293b;padding:32px;background:#f8fafc;}
                h1{font-size:1.4rem;font-weight:800;color:#5317a6;margin:0 0 4px;}
                .sub{color:#64748b;font-size:0.82rem;margin-bottom:24px;}
                table{width:100%;border-collapse:collapse;font-size:0.82rem;}
                thead th{background:#5317a6;color:#fff;padding:10px 12px;text-align:left;font-weight:700;}
                thead th:last-child{text-align:right;}
                tbody tr:nth-child(even){background:#f1f5f9;}
                tbody td{padding:9px 12px;border-bottom:1px solid #e2e8f0;vertical-align:middle;}
                tfoot td{padding:10px 12px;font-weight:800;border-top:2px solid #5317a6;}
                @media print{body{padding:0;}}
            </style></head><body>
            <h1>Histórico de Transações — LB Finance</h1>
            <div class="sub">Gerado em ${String(now.getDate()).padStart(2,'0')}/${MONTHS[now.getMonth()]}/${now.getFullYear()} · ${txs.length} transações</div>
            <table><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Conta</th><th>Tipo</th><th style="text-align:right;">Valor</th></tr></thead>
            <tbody>${rows}</tbody></table></body></html>`;
            const w = window.open('', '_blank');
            w.document.write(html);
            w.document.close();
            setTimeout(() => w.print(), 400);
        }

        function confirmResetAccount() {
            openConfirmModal(
                'Resetar Conta',
                'Isso apagará TODAS as suas transações permanentemente. Categorias e contas serão mantidas. Esta ação não pode ser desfeita.',
                async () => {
                    try {
                        const { error } = await _supabase.from('transactions').delete().eq('user_id', appState.user.id);
                        if (error) throw error;
                        await syncAllData();
                        switchTab('dashboard');
                        showToast('Conta resetada. Histórico apagado.');
                    } catch (err) {
                        showToast('Erro ao resetar conta: ' + err.message, 'error');
                    }
                },
                'danger'
            );
        }

        // ── MONTH FILTERS ──
        function initModernSelect(id) {
            const el = document.getElementById(id);
            if (!el || el.dataset.modernized) return;
            el.dataset.modernized = 'true';
            el.style.display = 'none';

            const container = document.createElement('div');
            container.className = 'month-select-container';

            const button = document.createElement('div');
            button.className = 'month-select-button';
            button.textContent = el.options[el.selectedIndex]?.text || '';
            container.appendChild(button);

            const menu = document.createElement('div');
            menu.className = 'month-select-menu';
            document.body.appendChild(menu);

            function renderOptions() {
                menu.innerHTML = '';
                Array.from(el.options).forEach(optEl => {
                    const opt = document.createElement('div');
                    opt.className = 'month-select-option' + (optEl.value === el.value ? ' active' : '');
                    opt.textContent = optEl.text;
                    opt.onclick = (e) => {
                        e.stopPropagation();
                        el.value = optEl.value;
                        button.textContent = optEl.text;
                        closeMenu();
                        el.dispatchEvent(new Event('change'));
                    });
                    menu.appendChild(opt);
                });
            }

            function openMenu() {
                // Fecha todos os outros
                document.querySelectorAll('.month-select-menu').forEach(m => { m.style.display = 'none'; });
                document.querySelectorAll('.month-select-container').forEach(c => c.classList.remove('open'));
                // Renderiza opções atualizadas
                renderOptions();
                const rect = button.getBoundingClientRect();
                menu.style.top = (rect.bottom + 4) + 'px';
                menu.style.left = rect.left + 'px';
                menu.style.minWidth = rect.width + 'px';
                menu.style.display = 'flex';
                container.classList.add('open');
            }

            function closeMenu() {
                menu.style.display = 'none';
                container.classList.remove('open');
            }

            button.onclick = (e) => {
                e.stopPropagation();
                container.classList.contains('open') ? closeMenu() : openMenu();
            });

            // Sincroniza o texto do botão quando o select muda por JS
            el.addEventListener('change', () => {
                button.textContent = el.options[el.selectedIndex]?.text || '';
            });

            el.parentNode.insertBefore(container, el);

            if (!window._modernSelectDocListener) {
                document.addEventListener('click', () => {
                    document.querySelectorAll('.month-select-menu').forEach(m => m.style.display = 'none');
                    document.querySelectorAll('.month-select-container').forEach(c => c.classList.remove('open'));
                });
                window._modernSelectDocListener = true;
            }
        }

        function populateMonthFilters() {
            const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const now = new Date();
            const endDate = new Date(2026, 11, 1);
            const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1);
            
            const monthList = [];
            let current = new Date(endDate);
            while (current >= startDate) {
                const val = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
                const label = `${MONTHS[current.getMonth()]} / ${current.getFullYear()}`;
                monthList.push({ val, label });
                current.setMonth(current.getMonth() - 1);
            }

            const currentMonthVal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const ids = ['dash-month-filter', 'dash-month-filter-mobile', 'summary-month-filter', 'budget-month-filter', 'reports-month-filter', 'comp-month-a', 'comp-month-b'];

            ids.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.innerHTML = monthList.map(m => `<option value="${m.val}">${m.label}</option>`).join('');
                let initialVal = currentMonthVal;
                if (id === 'comp-month-b') {
                    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    initialVal = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
                }
                el.value = initialVal;
                initModernSelect(id);
            });
        }

        // ── DASHBOARD ──
        function initDashboard() {
            const desktopEl = document.getElementById('dash-month-filter');
            const mobileEl = document.getElementById('dash-month-filter-mobile');
            const filterVal = (desktopEl && desktopEl.value) || (mobileEl && mobileEl.value);
            if (!filterVal) return;
            /* Mantém os dois selects sincronizados */
            if (desktopEl && desktopEl.value !== filterVal) desktopEl.value = filterVal;
            if (mobileEl && mobileEl.value !== filterVal) mobileEl.value = filterVal;
            const [year, month] = filterVal.split('-').map(Number);

            const filteredTx = appState.transactions.filter(t => {
                const d = new Date(t.date);
                return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
            });

            const inc = filteredTx.filter(t => t.type === 'income' && !t.is_invoice_payment).reduce((s, t) => s + Number(t.val), 0);
            // Despesas exibidas em relatórios: incluem compras em cartão, EXCLUEM pagamentos de fatura (são transferências)
            const exp = filteredTx.filter(t => (t.type === 'expense' || t.type === 'goal') && !t.is_invoice_payment).reduce((s, t) => s + Number(t.val), 0);
            // Despesas que afetam saldo bancário: EXCLUEM compras em cartão (ficam na fatura), INCLUEM pagamentos de fatura
            const expBank = filteredTx.filter(t => (t.type === 'expense' || t.type === 'goal') && (!t.card_id || t.is_invoice_payment)).reduce((s, t) => s + Number(t.val), 0);
            // Aportes em investimentos do mês
            const invest = filteredTx.filter(t => t.category === 'Investimentos' && t.type === 'expense').reduce((s, t) => s + Number(t.val), 0);
            const investEl = document.getElementById('dash-invest');
            const investFooter = document.getElementById('dash-invest-footer');
            if (investEl) investEl.innerText = fmtBRL(invest);
            if (investFooter) {
                const pct = inc > 0 ? ((invest / inc) * 100).toFixed(1) : '0.0';
                investFooter.innerHTML = invest > 0
                    ? `<i data-lucide="trending-up"></i> <span>${pct}% da receita</span>`
                    : `<i data-lucide="minus"></i> <span>Nenhum aporte</span>`;
            }
            const accountsTotal = appState.accounts.reduce((s, a) => s + Number(a.balance), 0);
            const bal = accountsTotal + inc - expBank;

            // Calcular Taxa de Economia
            const savingsRate = inc > 0 ? ((inc - exp) / inc) * 100 : 0;
            const rateEl = document.getElementById('dash-saving-rate');
            const statusEl = document.getElementById('dash-saving-status');

            rateEl.innerText = `${savingsRate.toFixed(1)}%`;
            if (savingsRate >= 20) {
                statusEl.className = 'stat-footer up';
                statusEl.innerHTML = `<i data-lucide="trending-up"></i> <span>Excelente</span>`;
            } else if (savingsRate >= 10) {
                statusEl.className = 'stat-footer';
                statusEl.innerHTML = `<i data-lucide="minus"></i> <span>Regular</span>`;
            } else {
                statusEl.className = 'stat-footer down';
                statusEl.innerHTML = `<i data-lucide="trending-down"></i> <span>Baixa</span>`;
            }

            updateBalanceUI(bal, inc, exp);

            // Balance trend indicator
            const trendEl = document.getElementById('dash-balance-trend');
            if (bal >= 0) {
                trendEl.className = 'stat-footer up';
                trendEl.innerHTML = `<i data-lucide="trending-up"></i><span>Saldo positivo</span>`;
            } else {
                trendEl.className = 'stat-footer down';
                trendEl.innerHTML = `<i data-lucide="trending-down"></i><span>Saldo negativo</span>`;
            }

            renderBudgetProgress(filteredTx);
            renderRecentTx(filteredTx);
            initCharts(filteredTx);
            renderInvoiceAlerts();
            renderDashCardsSummary();
            lucide.createIcons();
        }

        // Resumo compacto de cartões no Dashboard
        function renderDashCardsSummary() {
            const wrap = document.getElementById('dash-cards-summary-wrap');
            const grid = document.getElementById('dash-cards-summary');
            if (!wrap || !grid) return;
            if (!appState.cards.length) { wrap.style.display = 'none'; return; }
            wrap.style.display = 'block';
            grid.innerHTML = appState.cards.map((c, i) => {
                const info = getCardInvoiceInfo(c);
                const totalDue = info.open + info.closed;
                const usedPct = c.credit_limit > 0 ? Math.min(100, (info.totalUsed / Number(c.credit_limit)) * 100) : 0;
                const barColor = usedPct > 90 ? '#EF4444' : usedPct > 70 ? '#F59E0B' : '#10B981';
                const isPaid = (info.open + info.closed) <= 0.01;

                return `
                <div style="background:var(--bg-panel); border-radius:18px; box-shadow:0 2px 12px rgba(0,0,0,0.06); display:flex; align-items:stretch; overflow:hidden; cursor:pointer; transition:box-shadow 0.2s, transform 0.2s;" onclick="switchTab('cartoes'); setTimeout(()=>openInvoiceModal('${c.id}'),150)" onmouseenter="this.style.boxShadow='0 6px 24px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)'" onmouseleave="this.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'; this.style.transform='translateY(0)'">

                    <!-- Faixa lateral colorida -->
                    <div style="width:6px; flex-shrink:0; background:${c.color}; border-radius:18px 0 0 18px;"></div>

                    <!-- Conteúdo compacto -->
                    <div style="flex:1; padding:16px 20px; display:flex; align-items:center; gap:20px; min-width:0;">

                        <!-- Ícone do cartão -->
                        <div style="width:44px; height:44px; border-radius:12px; background:${c.color}18; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <i data-lucide="credit-card" style="width:20px; height:20px; color:${c.color};"></i>
                        </div>

                        <!-- Info principal -->
                        <div style="flex:1; min-width:0;">
                            <div style="font-size:0.9rem; font-weight:700; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.name}</div>
                            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">Limite: ${fmtBRL(Number(c.credit_limit))} · ${usedPct.toFixed(0)}% usado</div>
                            <!-- Barra de progresso fina -->
                            <div style="height:3px; background:#f1f5f9; border-radius:10px; margin-top:7px; overflow:hidden;">
                                <div style="height:100%; width:${usedPct}%; background:${barColor}; border-radius:10px; transition:width 0.4s ease;"></div>
                            </div>
                        </div>

                        <!-- Valores das faturas -->
                        <div style="display:flex; gap:16px; flex-shrink:0; text-align:right;">
                            <div>
                                <div style="font-size:0.62rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.4px;">Aberta</div>
                                <div style="font-size:0.95rem; font-weight:800; color:var(--accent-2); margin-top:2px;">${fmtBRL(info.open)}</div>
                            </div>
                            <div>
                                <div style="font-size:0.62rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.4px;">Fechada</div>
                                <div style="font-size:0.95rem; font-weight:800; color:var(--danger); margin-top:2px;">${fmtBRL(info.closed)}</div>
                            </div>
                        </div>

                        <!-- Badge/ação -->
                        <div style="flex-shrink:0;">
                            ${isPaid ? `
                            <div style="display:inline-flex; align-items:center; gap:5px; background:#ECFDF5; color:#059669; font-size:0.75rem; font-weight:700; padding:6px 14px; border-radius:20px;">
                                <i data-lucide="check" style="width:13px; height:13px;"></i> Paga
                            </div>` : `
                            <button style="display:inline-flex; align-items:center; gap:5px; background:var(--accent-2); color:white; font-size:0.75rem; font-weight:700; padding:6px 14px; border-radius:20px; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(139,92,246,0.3);" onclick="event.stopPropagation(); switchTab('cartoes'); setTimeout(()=>payInvoiceFromCard('${c.id}'),150)">
                                <i data-lucide="arrow-up-right" style="width:13px; height:13px;"></i> Pagar
                            </button>`}
                        </div>

                        <!-- Ações rápidas -->
                        <div style="display:flex; gap:4px; flex-shrink:0;">
                            <div onclick="event.stopPropagation(); switchTab('cartoes'); setTimeout(()=>openCardModal(${i}),150)" title="Editar" style="width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); cursor:pointer; transition:background 0.15s;" onmouseenter="this.style.background='#f1f5f9'" onmouseleave="this.style.background='transparent'">
                                <i data-lucide="edit-2" style="width:14px; height:14px;"></i>
                            </div>
                            <div onclick="event.stopPropagation(); switchTab('cartoes'); setTimeout(()=>deleteCard(${i}),150)" title="Apagar" style="width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); cursor:pointer; transition:background 0.15s;" onmouseenter="this.style.background='#fee2e2'; this.style.color='#ef4444'" onmouseleave="this.style.background='transparent'; this.style.color='var(--text-muted)'">
                                <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // Mostra alertas no dashboard quando há faturas próximas do vencimento ou em atraso
        function renderInvoiceAlerts() {
            const container = document.getElementById('dash-invoice-alerts');
            if (!container) return;
            const today = new Date();
            const alerts = [];

            appState.cards.forEach(card => {
                const unpaidMonths = getUnpaidInvoiceMonths(card);
                unpaidMonths.forEach(invMonth => {
                    const balance = getInvoiceBalance(card, invMonth);
                    if (balance < 0.01) return;
                    // Data de vencimento: due_day do mês SEGUINTE ao invoice_month
                    const [y, m] = invMonth.split('-').map(Number);
                    let dueY = y, dueM = m + 1;
                    if (dueM > 12) { dueM = 1; dueY += 1; }
                    const dueDate = new Date(dueY, dueM - 1, card.due_day);
                    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                    // Só alerta se: vencido, vence hoje, ou vence nos próximos 5 dias
                    if (diffDays > 5) return;
                    alerts.push({ card, invMonth, balance, dueDate, diffDays });
                });
            });

            if (!alerts.length) {
                container.style.display = 'none';
                container.innerHTML = '';
                return;
            }
            container.style.display = 'block';
            container.innerHTML = alerts.map(a => {
                const overdue = a.diffDays < 0;
                const dueToday = a.diffDays === 0;
                const bg = overdue ? '#FEE2E2' : (dueToday ? '#FEF3C7' : '#EDE9FE');
                const border = overdue ? '#EF4444' : (dueToday ? '#F59E0B' : 'var(--accent-2)');
                const icon = overdue ? 'alert-triangle' : (dueToday ? 'alert-circle' : 'clock');
                const msg = overdue
                    ? `Vencida há ${Math.abs(a.diffDays)} dia(s)`
                    : (dueToday ? 'Vence hoje!' : `Vence em ${a.diffDays} dia(s)`);
                return `
                <div style="background:${bg}; border-left:4px solid ${border}; padding:14px 16px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <i data-lucide="${icon}" style="width:24px; height:24px; color:${border};"></i>
                        <div>
                            <div style="font-weight:800; color:var(--text-main);">Fatura ${a.card.name} — ${msg}</div>
                            <div style="font-size:0.875rem; color:var(--text-sub); margin-top:2px;">
                                ${fmtBRL(a.balance)} · vence em ${a.dueDate.toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="padding:8px 16px; font-size:0.8125rem;" onclick="openInvoiceFromAlert('${a.card.id}', '${a.invMonth}')">
                        <i data-lucide="check-circle" style="width:14px; height:14px;"></i> Pagar Agora
                    </button>
                </div>`;
            }).join('');
        }

        // Atalho: clica "Pagar Fatura" direto no card → abre modal de pagamento da fatura mais antiga em aberto
        function payInvoiceFromCard(cardId, monthVal) {
            const card = appState.cards.find(c => c.id === cardId);
            if (!card) return;
            const unpaid = getUnpaidInvoiceMonths(card);
            if (!unpaid.length) return showToast('Sem faturas em aberto neste cartão.', 'info');
            // Se o mês selecionado estiver em aberto, usa ele; senão, usa o mais antigo
            const target = (monthVal && unpaid.includes(monthVal)) ? monthVal : unpaid[0];
            _currentInvoiceCardId = cardId;
            _currentInvoiceMonth = target;
            openPayInvoicePrompt();
        }

        function openInvoiceFromAlert(cardId, invMonth) {
            switchTab('cartoes');
            setTimeout(() => {
                openInvoiceModal(cardId);
                _currentInvoiceMonth = invMonth;
                const card = appState.cards.find(c => c.id === cardId);
                if (card) {
                    const allMonths = [...new Set(appState.transactions.filter(t => t.card_id === cardId && t.invoice_month).map(t => t.invoice_month))].sort();
                    renderInvoiceMonthTabs(card, allMonths, getUnpaidInvoiceMonths(card));
                    renderInvoiceContent(card);
                }
            }, 200);
        }

        function updateBalanceUI(bal, inc, exp) {
            const isHidden = localStorage.getItem('hide_balance') === 'true';
            const displayBal = isHidden ? '••••••' : fmtBRL(bal);
            const displayInc = isHidden ? '••••••' : fmtBRL(inc);
            const displayExp = isHidden ? '••••••' : fmtBRL(exp);

            document.getElementById('dash-balance').innerText = displayBal;
            document.getElementById('dash-income').innerText = displayInc;
            document.getElementById('dash-expense').innerText = displayExp;

            // Garantir que apenas o footer de despesas tenha a cor vermelha
            const expFooter = document.getElementById('dash-expense-footer');
            if (expFooter) expFooter.className = 'stat-footer red-trend';

            const btn = document.getElementById('hide-balance-btn');
            if (btn) {
                btn.innerHTML = `<i data-lucide="${isHidden ? 'eye-off' : 'eye'}" style="width:16px;"></i>`;
                lucide.createIcons();
            }
        }

        function toggleHideBalance() {
            const current = localStorage.getItem('hide_balance') === 'true';
            localStorage.setItem('hide_balance', !current);
            initDashboard(); forceIcons();
        }

        function renderBudgetProgress(filteredTx) {
            const list = document.getElementById('budget-progress-list');
            const cats = appState.categories.filter(c => c.type === 'expense' && Number(c.budget) > 0);
            if (cats.length === 0) {
                list.innerHTML = '<div class="empty-state"><p>Nenhuma categoria com orçamento atribuído.</p></div>';
                return;
            }
            list.innerHTML = cats.map(c => {
                const spent = filteredTx.filter(t => t.category === c.name && !t.is_invoice_payment).reduce((s, t) => s + Number(t.val), 0);
                const p = c.budget > 0 ? (spent / c.budget) * 100 : 0;
                const progress = Math.min(p, 100);
                const over = c.budget > 0 && spent > c.budget;

                const barColor = over ? 'var(--danger)' : c.color;
                return `<div class="budget-item">
                <div class="budget-icon">${c.icon}</div>
                <div class="budget-info">
                    <div class="budget-top">
                        <span class="budget-name">${c.name}</span>
                        <span class="budget-vals" style="color:var(--text-sub)">
                            ${fmtBRL(spent)} ${c.budget > 0 ? '/ ' + fmtBRL(c.budget) : ''}
                        </span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill" style="width:${progress}%; background:${barColor}; ${over ? 'box-shadow:0 0 6px rgba(255,90,126,0.4)' : ''}"></div>
                    </div>
                </div>
            </div>`;

            }).join('');
        }


        function renderRecentTx(filteredTx) {
            const list = document.getElementById('recent-tx-list');
            const recent = filteredTx.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
            if (recent.length === 0) {
                list.innerHTML = '<div class="tx-empty">Sem transações neste mês.</div>';
                return;
            }
            list.innerHTML = recent.map(t => {
                const cat = appState.categories.find(c => c.name === t.category);
                const icon = cat ? cat.icon : '💳';
                const date = new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'short' });
                const isInc = t.type === 'income';
                const displayDesc = (t.description && t.description !== '-') ? t.description : t.category;
                const displayMeta = (t.description && t.description !== '-') ? `${t.category} · ${date}` : date;

                return `<div class="tx-item">
                <div class="tx-icon">${icon}</div>
                <div class="tx-info">
                    <div class="tx-desc">${displayDesc}</div>
                    <div class="tx-meta">${displayMeta}</div>
                </div>

                <div class="tx-amount ${t.type}">${isInc ? '+' : '-'} ${fmtBRL(Number(t.val))}</div>
            </div>`;
            }).join('');
        }

        // ── BANK CARDS ──
        // Converte hex em versão mais escura para o gradiente
        function darkenHex(hex, amount = 40) {
            let c = hex.replace('#', '');
            if (c.length === 3) c = c.split('').map(x => x + x).join('');
            let r = Math.max(0, parseInt(c.slice(0, 2), 16) - amount);
            let g = Math.max(0, parseInt(c.slice(2, 4), 16) - amount);
            let b = Math.max(0, parseInt(c.slice(4, 6), 16) - amount);
            return `rgb(${r},${g},${b})`;
        }

        function openAccountDetails(id) {
            // Por enquanto, apenas abre a aba de transações filtrada por essa conta
            switchTab('historico');
            const acc = appState.accounts.find(a => a.id === id);
            if (acc) {
                document.getElementById('filter-account').value = acc.name;
                renderHistoryTable();
            }
        }

        function renderBankCards() {
            const row = document.getElementById('bank-cards-row');
            const addBtn = `
            <div style="min-width:160px; height:190px; cursor:pointer; border:2px dashed #E2E8F0; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94A3B8; transition:all 0.3s ease; margin-left:8px;" 
                 onclick="switchTab('configuracoes')"
                 onmouseover="this.style.borderColor='var(--accent)'; this.style.color='var(--accent)'"
                 onmouseout="this.style.borderColor='#E2E8F0'; this.style.color='#94A3B8'">
                <div style="width:36px; height:36px; border-radius:50%; border:2px solid currentColor; display:flex; align-items:center; justify-content:center; margin-bottom:8px;">
                    <i data-lucide="plus" style="width:20px;"></i>
                </div>
                <span style="font-size:0.75rem; font-weight:700;">Adicionar Conta</span>
            </div>`;

            if (appState.accounts.length === 0) {
                row.innerHTML = addBtn;
                lucide.createIcons();
                return;
            }

            const sortedAccs = [...appState.accounts].sort((a, b) => {
                if (a.name === 'Dinheiro Vivo') return -1;
                if (b.name === 'Dinheiro Vivo') return 1;
                return 0;
            });

            const cardsHTML = sortedAccs.map((acc, i) => {
                if (acc.name === 'Dinheiro Vivo') {
                    return `
                    <div class="cash-card" onclick="openAccountDetails('${acc.id}')">
                        <div class="cash-card-pattern"></div>
                        <div class="cash-card-content">
                            <div class="cash-card-header">
                                <div class="cash-card-icon">
                                    <i data-lucide="wallet"></i>
                                </div>
                                <div class="cash-card-label">Saldo em Dinheiro</div>
                            </div>
                            <div class="cash-card-balance">${fmtBRL(acc.balance)}</div>
                            <div class="cash-badge">
                                <i data-lucide="check" style="width:12px;"></i>
                                DISPONÍVEL AGORA
                            </div>
                        </div>
                    </div>`;
                }

                const holder = (appState.user.name || 'Usuário').toUpperCase();
                const num = `.... .... .... 0000`;
                const gradient = `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`; // Estilo All Black premium fosco

                return `
                <div class="bank-card-container">
                    <div class="bank-card-inner">
                        <div class="bank-card-front" style="background: ${gradient};">
                            <div class="bc-top">
                                <div class="bc-chip"></div>
                                <div class="bc-mc-logo">
                                    <div class="bc-mc-circles"><span></span><span></span></div>
                                    <div class="bc-mc-label">MASTERCARD</div>
                                </div>
                            </div>
                            <div class="bc-number" style="font-size: 1.25rem; letter-spacing: 6px; opacity:0.85;">${num}</div>
                            <div class="bc-footer">
                                <div class="bc-stack">
                                    <div class="bc-holder-label">Card Holder</div>
                                    <div class="bc-holder-name">${holder}</div>
                                </div>
                                <div class="bc-stack" style="align-items:flex-end">
                                    <div class="bc-exp-label">${acc.name.toUpperCase()}</div>
                                    <div class="bc-exp-val">12/27</div>
                                </div>
                            </div>
                        </div>
                        <div class="bank-card-back" style="background: ${gradient};">
                            <div class="bc-mag-strip"></div>
                            <div class="bc-cvv-area">
                                <div style="background:white; height:32px; width:100%; border-radius:4px; display:flex; align-items:center; justify-content:flex-end; padding-right:12px; color:#1a1054; font-weight:800; font-family:monospace;">***</div>
                                <div style="font-size:0.55rem; color:rgba(255,255,255,0.6); margin-top:8px; text-transform:uppercase; letter-spacing:1px;">Customer Service: 0800 123 4567</div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');

            row.innerHTML = cardsHTML + addBtn;
            lucide.createIcons();
        }


        // ── SUMMARY ──
        function renderSummaryTab() {
            const filterVal = document.getElementById('summary-month-filter').value;
            if (!filterVal) return;
            const [year, month] = filterVal.split('-').map(Number);

            // Popular o select de contas mantendo a seleção atual
            const accSel = document.getElementById('summary-account-filter');
            const currentAcc = accSel.value;
            accSel.innerHTML = '<option value="">Contas</option>' +
                appState.accounts.map(a => `<option value="${a.name}"${a.name === currentAcc ? ' selected' : ''}>${a.name}</option>`).join('');
            const selectedAcc = accSel.value;

            const filteredTx = appState.transactions.filter(t => {
                const d = new Date(t.date);
                const matchMonth = d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
                const matchAcc = !selectedAcc || t.account === selectedAcc;
                return matchMonth && matchAcc;
            });

            let totalInc = 0, totalExp = 0;

            const renderList = (type) => {
                return appState.categories.filter(c => c.type === type).map(c => {
                    const catTxs = filteredTx.filter(t => t.category === c.name && t.type === type && !t.goal_id && !t.is_invoice_payment);
                    const total = catTxs.reduce((s, t) => s + Number(t.val), 0);
                    if (type === 'income') totalInc += total; else totalExp += total;
                    if (total === 0) return '';
                    const color = type === 'income' ? 'var(--accent)' : 'var(--danger)';
                    return `<div class="card cat-card">
                    <div class="cat-icon" style="background:${c.color}18;">${c.icon}</div>
                    <div class="cat-info"><div class="cat-name">${c.name}</div><div class="cat-meta">${catTxs.length} transações</div></div>
                    <div style="font-family:'Outfit',sans-serif; font-weight:800; font-size:1rem; color:${color};">${type === 'income' ? '+' : '-'} ${fmtBRL(total)}</div>
                </div>`;
                }).join('');
            });

            const incH = renderList('income');
            const expH = renderList('expense');
            document.getElementById('summary-income-list').innerHTML = incH || '<div class="empty-state"><p>Sem receitas neste mês.</p></div>';
            document.getElementById('summary-expense-list').innerHTML = expH || '<div class="empty-state"><p>Sem despesas neste mês.</p></div>';
            document.getElementById('summary-total-income').innerText = fmtBRL(totalInc);
            document.getElementById('summary-total-expense').innerText = fmtBRL(totalExp);
        }

        // ── CHARTS ──
        let mChart, pChart;
        function initCharts(data) {
            if (mChart) mChart.destroy();
            if (pChart) pChart.destroy();

            Chart.defaults.color = '#1A1054';
            Chart.defaults.borderColor = 'rgba(26, 16, 84, 0.05)';
            Chart.defaults.font.family = 'Outfit, sans-serif';

            // Weekly split
            const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
            const weekInc = [0, 0, 0, 0];
            const weekExp = [0, 0, 0, 0];

            data.forEach(t => {
                if (t.is_invoice_payment) return; // pagamentos de fatura são transferências, não entram nos gráficos
                const dateObj = new Date(t.date + 'T00:00:00'); // Ensure local date parsing
                const day = dateObj.getDate();
                const idx = Math.min(Math.floor((day - 1) / 7), 3);
                if (t.type === 'income') weekInc[idx] += Number(t.val);
                else if (t.type === 'expense') weekExp[idx] += Number(t.val);
            });

            const ctxM = document.getElementById('chart-main').getContext('2d');
            mChart = new Chart(ctxM, {
                type: 'line',
                data: {
                    labels: weeks,
                    datasets: [
                        {
                            label: 'Receitas',
                            data: weekInc,
                            borderColor: 'var(--accent)',
                            backgroundColor: 'rgba(83, 23, 166, 0.08)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 4,
                            pointBackgroundColor: 'var(--accent)',
                            pointRadius: 4,
                            pointHoverRadius: 7
                        },
                        {
                            label: 'Despesas',
                            data: weekExp,
                            borderColor: '#F43F5E',
                            backgroundColor: 'rgba(244, 63, 94, 0.08)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 4,
                            pointBackgroundColor: '#F43F5E',
                            pointRadius: 4,
                            pointHoverRadius: 7
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.03)' } },
                        x: { grid: { display: false } }
                    }
                }
            });

            const ctxP = document.getElementById('chart-pie').getContext('2d');
            const expCats = appState.categories.filter(c => c.type === 'expense');
            const pieDataArr = expCats.map(c => data.filter(t => t.category === c.name && !t.is_invoice_payment).reduce((s, t) => s + Number(t.val), 0));
            const hasPieData = pieDataArr.some(v => v > 0);

            pChart = new Chart(ctxP, {
                type: 'doughnut',
                data: {
                    labels: expCats.map(c => c.name),
                    datasets: [{
                        data: hasPieData ? pieDataArr : [1],
                        backgroundColor: hasPieData ? expCats.map(c => c.color) : ['rgba(83, 23, 166, 0.05)'],
                        borderWidth: 2,
                        borderColor: '#FFFFFF',
                        hoverOffset: 12
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '72%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1A1054',
                            padding: 12,
                            cornerRadius: 8,
                            titleFont: { size: 14, weight: '800' },
                            bodyFont: { size: 13 },
                            displayColors: true,
                            callbacks: {
                                label: (ctx) => ` ${fmtBRL(ctx.raw)}`
                            }
                        }
                    }
                }
            });
        }

        async function scrollToHistoryFilter(catName) {
            await switchTab('historico');
            const catSelect = document.getElementById('hist-cat');
            if (catSelect) {
                catSelect.value = catName;
                // Chamamos render direto sem populate para manter o valor
                renderHistoryTable(true);
            }
            showToast(`Filtrando por: ${catName}`, 'info');


            // Scroll suave até os filtros
            setTimeout(() => {
                const hHeader = document.querySelector('#tab-historico .page-header');
                if (hHeader) hHeader.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }


        // ── ACCOUNTS ──
        function renderSettingsAccounts() {
            document.getElementById('settings-acc-list').innerHTML = appState.accounts.map((acc, i) => `
            <div class="acc-item">
                <div class="acc-dot" style="background:${acc.color}; box-shadow:0 0 6px ${acc.color}60;"></div>
                <div style="flex:1;">
                    <div style="font-weight:700; font-size:0.875rem; color:var(--text-main);">${acc.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Saldo: ${fmtBRL(Number(acc.balance))}</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <div class="icon-action" onclick="openAccModal(${i})"><i data-lucide="edit-2"></i></div>
                    <div class="icon-action danger" onclick="deleteAcc(${i})"><i data-lucide="trash-2"></i></div>
                </div>
            </div>`).join('');
            lucide.createIcons();
        }

        function openAccModal(index = null) {
            appState.editingAccIndex = index;
            if (index !== null) {
                const acc = appState.accounts[index];
                document.getElementById('acc-name-in').value = acc.name;
                document.getElementById('acc-balance-in').value = acc.balance;
                accSelColor = acc.color;
            } else {
                document.getElementById('acc-name-in').value = '';
                document.getElementById('acc-balance-in').value = '';
                accSelColor = COLORS_SET[0];
            }
            document.getElementById('modal-acc').classList.add('active');
            renderAccountColorPicker();
        }

        function closeAccModal() { document.getElementById('modal-acc').classList.remove('active'); }

        function renderAccountColorPicker() {
            document.getElementById('acc-color-picker').innerHTML = COLORS_SET.map(c =>
                `<div class="pick-color ${c === accSelColor ? 'active' : ''}" style="background:${c}" onclick="accSelColor='${c}';renderAccountColorPicker()"></div>`
            ).join('');
        }

        async function saveAccAction() {
            const name = document.getElementById('acc-name-in').value.trim();
            const balance = parseFloat(document.getElementById('acc-balance-in').value) || 0;
            if (!name) return showToast('Informe o nome da conta!', 'error');
            if (!appState.user.id) return showToast('Usuário não autenticado.', 'error');

            const accObj = { user_id: appState.user.id, name, balance, color: accSelColor };
            try {
                let error;
                if (appState.editingAccIndex !== null) {
                    accObj.id = appState.accounts[appState.editingAccIndex].id;
                    ({ error } = await _supabase.from('accounts').upsert(accObj));
                } else {
                    ({ error } = await _supabase.from('accounts').insert(accObj));
                }
                if (error) throw error;
                closeAccModal();
                await syncAllData();
                updateUI();
                showToast('Conta salva com sucesso!');
            } catch (err) {
                console.error('Erro ao salvar conta:', err);
                showToast('Erro ao salvar conta: ' + (err.message || err), 'error');
            }
        }

        async function deleteAcc(i) {
            if (appState.accounts[i].name === 'Dinheiro Vivo') {
                return showToast('A conta "Dinheiro Vivo" é necessária para o sistema e não pode ser excluída.', 'error');
            }
            if (confirm('Deseja excluir esta conta?')) {
                try {
                    const { error } = await _supabase.from('accounts').delete().eq('id', appState.accounts[i].id);
                    if (error) throw error;
                    await syncAllData();
                    renderSettingsAccounts();
                    renderBankCards();
                    showToast('Conta removida.');
                } catch (err) {
                    console.error('Erro ao excluir conta:', err);
                    showToast('Erro ao excluir conta: ' + (err.message || err), 'error');
                }
            }
        }

        // ── QUICK ENTRY (SHIFT + L) ──
        // Move o formulário REAL da aba Lançamento para dentro do modal — assim sempre
        // estamos em sincronia com qualquer recurso da aba (cartões, metas, parcelas,
        // regime, ocorrência…). Ao fechar, o formulário volta ao seu lugar original.
        let _quickEntryOpen = false;
        function openQuickEntryModal() {
            if (!appState.user.id) return;
            if (_quickEntryOpen) return;
            const host = document.getElementById('entry-form-host');
            const mount = document.getElementById('quick-entry-mount');
            if (!host || !mount) return;
            // Move o formulário pra dentro do modal
            mount.appendChild(host);
            // Pré-configura tipo (mantém o último tipo escolhido, default = despesa)
            try {
                if (typeof setEntryTab === 'function') {
                    setEntryTab(appState.currentEntryType || appState.quickEntryType || 'expense');
                }
                const dateInput = document.getElementById('e-date');
                if (dateInput && !dateInput.value) dateInput.valueAsDate = new Date();
            } catch (e) { console.warn('Quick entry init:', e); }
            document.getElementById('modal-quick-entry').classList.add('active');
            _quickEntryOpen = true;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            setTimeout(() => {
                const v = document.getElementById('e-value');
                if (v) { v.focus(); v.select && v.select(); }
            }, 120);
        }

        function closeQuickEntryModal() {
            const modal = document.getElementById('modal-quick-entry');
            if (!modal) return;
            modal.classList.remove('active');
            if (!_quickEntryOpen) return;
            // Devolve o formulário ao lugar original (antes do anchor)
            const host = document.getElementById('entry-form-host');
            const anchor = document.getElementById('entry-form-anchor');
            if (host && anchor && anchor.parentNode) {
                anchor.parentNode.insertBefore(host, anchor);
            }
            _quickEntryOpen = false;
        }

        // Após salvar pela aba normal ou pelo atalho, garante que o form volte pro lugar
        // se ele estiver dentro do modal (chamado por handleSaveEntry após sucesso).
        function _ensureEntryFormBackHome() {
            if (_quickEntryOpen) closeQuickEntryModal();
        }

        function setQuickEntryType(type) {
            appState.quickEntryType = type;
            document.getElementById('modal-quick-btn-exp').className = 'toggle-btn' + (type === 'expense' ? ' active expense' : '');
            document.getElementById('modal-quick-btn-inc').className = 'toggle-btn' + (type === 'income' ? ' active income' : '');
            const cats = appState.categories.filter(c => c.type === type);
            document.getElementById('qe-cat').innerHTML = cats.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('');
        }

        async function saveQuickEntryAction() {
            const val = parseFloat(document.getElementById('qe-value').value);
            const desc = document.getElementById('qe-desc').value || 'Gasto Rápido';
            const date = document.getElementById('qe-date').value;
            const cat = document.getElementById('qe-cat').value;
            const acc = document.getElementById('qe-acc').value;

            if (!val || !cat || !acc) return showToast('Preencha os campos obrigatórios!', 'error');
            if (!checkPlanLimit('transaction')) return;

            try {
                const tx = {
                    user_id: appState.user.id,
                    date,
                    val,
                    category: cat,
                    account: acc,
                    description: desc,
                    type: appState.quickEntryType,
                    regime: 'Variável',
                    occurrence: 'Única'
                });
                const { error } = await _supabase.from('transactions').insert(tx);
                if (error) throw error;

                closeQuickEntryModal();
                await syncAllData();
                updateUI();
                showToast('Lançamento rápido concluído!', 'success');
                triggerConfetti();
            } catch (err) {
                showToast('Erro: ' + err.message, 'error');
            }
        }

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.key.toUpperCase() === 'L') {
                e.preventDefault();
                openQuickEntryModal();
            }
            if (e.key === 'Escape') {
                closeQuickEntryModal();
                closeCatModal();
                closeAccModal();
                closeRecurringModal();
            }
        });

        // ── TRANSACTIONS ──

        function setRegime(val) {
            appState.entryRegime = val;
            document.querySelectorAll('#e-regime .toggle-btn').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
        }

        function setOccurrence(val) {
            appState.entryOccurrence = val;
            document.querySelectorAll('#e-occurrence .toggle-btn').forEach(b => b.classList.remove('active'));
            event.currentTarget.classList.add('active');
            document.getElementById('row-installments').style.display = val === 'Parcelas' ? 'block' : 'none';
        }

        function setEntryTab(type) {
            appState.currentEntryType = type;
            document.getElementById('l-btn-income').className = 'toggle-btn' + (type === 'income' ? ' active income' : '');
            document.getElementById('l-btn-expense').className = 'toggle-btn' + (type === 'expense' ? ' active expense' : '');
            document.getElementById('l-btn-goal').className = 'toggle-btn' + (type === 'goal' ? ' active' : '');

            // Ajustar labels e visibilidade
            const labelAcc = document.getElementById('label-e-acc');
            const groupGoal = document.getElementById('group-e-goal');
            const groupRegimeOcc = document.getElementById('group-regime-occurrence');
            const groupCat = document.getElementById('group-e-cat');

            // Remove 'required' se categoria estiver oculta
            const eCatSelect = document.getElementById('e-cat');

            if (type === 'goal') {
                labelAcc.innerText = 'Conta de Origem (Saída)';
                groupGoal.style.display = 'block';
                groupRegimeOcc.style.display = 'none';
                groupCat.style.display = 'none';
                eCatSelect.removeAttribute('required');
            } else if (type === 'income') {
                labelAcc.innerText = 'Conta';
                groupGoal.style.display = 'none';
                groupRegimeOcc.style.display = 'none';
                groupCat.style.display = 'block';
                eCatSelect.setAttribute('required', 'true');
            } else {
                labelAcc.innerText = 'Conta';
                groupGoal.style.display = 'none';
                groupRegimeOcc.style.display = 'grid';
                groupCat.style.display = 'block';
                eCatSelect.setAttribute('required', 'true');
            }

            // Resetar para padrão em receitas e metas para evitar parcelamentos acidentais invisíveis
            if (type !== 'expense') {
                setRegime('Variável');
                setOccurrence('Única');
            }

            updateEntryCategories();
        }

        function updateEntryGoalsList() {
            const sel = document.getElementById('e-goal');
            if (!sel) return;
            const activeGoals = appState.goals.filter(g => g.status === 'active');
            sel.innerHTML = '<option value="">Selecione uma meta...</option>' +
                activeGoals.map(g => `<option value="${g.id}">${g.icon} ${g.name}</option>`).join('');
        }

        async function handleSaveEntry(e) {
            if (e) e.preventDefault();

            const rawVal = parseFloat(document.getElementById('e-value').value);
            const dateStr = document.getElementById('e-date').value;
            const cat = document.getElementById('e-cat').value;
            const accRaw = document.getElementById('e-acc').value;
            const desc = document.getElementById('e-desc').value || '-';
            const installments = parseInt(document.getElementById('e-installments').value) || 1;

            const needsCat = appState.currentEntryType !== 'goal';
            if (!rawVal || (needsCat && !cat) || !accRaw) return showToast('Preencha todos os campos!', 'error');
            if (!checkPlanLimit('transaction')) return;

            // Detectar se é cartão
            const isCard = accRaw.startsWith('card:');
            const cardId = isCard ? accRaw.slice(5) : null;
            const card = isCard ? appState.cards.find(c => c.id === cardId) : null;
            const accName = isCard ? card?.name : accRaw.replace(/^acc:/, '');

            const btn = document.getElementById('btn-save-entry');
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader"></i> Salvando...';
            lucide.createIcons();

            try {
                // CARTÃO DE CRÉDITO: distribui em faturas (1+ parcelas), não afeta saldo bancário
                if (isCard) {
                    const totalParcels = Math.max(1, installments);
                    const valPerInstallment = rawVal / totalParcels;
                    const baseDate = new Date(dateStr + 'T00:00:00');
                    const baseInvoice = computeInvoiceMonth(baseDate, card.closing_day); // {year, month}
                    const txs = [];
                    for (let i = 0; i < totalParcels; i++) {
                        const invY = baseInvoice.year + Math.floor((baseInvoice.month - 1 + i) / 12);
                        const invM = ((baseInvoice.month - 1 + i) % 12) + 1;
                        const invMonthStr = `${invY}-${String(invM).padStart(2, '0')}`;
                        // Data da transação: usa data original na 1ª, e dia 1 do mês da fatura nas seguintes (apenas referência)
                        const txDate = i === 0 ? dateStr : `${invMonthStr}-01`;
                        txs.push({
                            user_id: appState.user.id,
                            date: txDate,
                            val: valPerInstallment,
                            category: cat,
                            account: accName,
                            description: totalParcels > 1 ? `${desc} (${i + 1}/${totalParcels})` : desc,
                            type: 'expense',
                            regime: 'Variável',
                            occurrence: totalParcels > 1 ? 'Parcelas' : 'Única',
                            card_id: cardId,
                            installment_num: totalParcels > 1 ? i + 1 : null,
                            installment_total: totalParcels > 1 ? totalParcels : null,
                            invoice_month: invMonthStr,
                            is_invoice_payment: false
                        });
                    }
                    const { error } = await _supabase.from('transactions').insert(txs);
                    if (error) throw error;
                } else if (appState.entryOccurrence === 'Parcelas') {
                    const txs = [];
                    const valPerInstallment = rawVal / installments;
                    for (let i = 1; i <= installments; i++) {
                        const d = new Date(dateStr + 'T00:00:00');
                        d.setMonth(d.getMonth() + (i - 1));
                        txs.push({
                            user_id: appState.user.id,
                            date: d.toISOString().split('T')[0],
                            val: valPerInstallment,
                            category: cat,
                            account: accName,
                            description: `${desc} (${i}/${installments})`,
                            type: appState.currentEntryType,
                            regime: appState.entryRegime,
                            occurrence: 'Parcelas'
                        });
                    }
                    const { error } = await _supabase.from('transactions').insert(txs);
                    if (error) throw error;
                } else {
                    const tx = {
                        user_id: appState.user.id,
                        date: dateStr,
                        val: rawVal,
                        category: cat,
                        account: accName,
                        description: desc,
                        type: appState.currentEntryType === 'goal' ? 'expense' : appState.currentEntryType,
                        regime: appState.entryRegime,
                        occurrence: appState.entryOccurrence,
                        goal_id: appState.currentEntryType === 'goal' ? document.getElementById('e-goal').value : null
                    });

                    if (appState.currentEntryType === 'goal' && !tx.goal_id) {
                        btn.disabled = false;
                        btn.innerHTML = '<i data-lucide="save"></i> Salvar Lançamento';
                        return showToast('Selecione a meta de destino!', 'error');
                    }

                    const { error } = await _supabase.from('transactions').insert(tx);
                    if (error) throw error;
                }

                // Lógica Especial: Se for Regime "Fixo", garantir que exista na tabela de recorrentes
                // (não aplicável a despesas em cartão de crédito)
                if (!isCard && appState.entryRegime === 'Fixo' && appState.entryOccurrence === 'Única') {
                    const alreadyExists = appState.recurring.some(r => r.name === desc && r.amount === rawVal);
                    if (!alreadyExists) {
                        const d = new Date(dateStr + 'T00:00:00');
                        const recObj = {
                            user_id: appState.user.id,
                            name: desc,
                            amount: rawVal,
                            day_of_month: d.getDate(),
                            category: cat,
                            account: accName,
                            type: appState.currentEntryType,
                            active: true
                        });
                        await _supabase.from('recurring').insert(recObj);
                    }
                }

                await syncAllData();
                showToast('Lançamento realizado com sucesso!', 'success');
                triggerConfetti();
                // Zerar o formulário após salvar
                document.getElementById('e-value').value = '';
                document.getElementById('e-desc').value = '';
                document.getElementById('e-date').value = new Date().toISOString().split('T')[0];
                updateEntryCategories();
                // Se o formulário foi aberto pelo atalho rápido, fecha o modal e devolve o form ao lugar
                if (typeof _ensureEntryFormBackHome === 'function') _ensureEntryFormBackHome();


            } catch (err) {
                console.error('Erro ao salvar lançamento:', err);
                showToast('Erro ao salvar lançamento: ' + err.message, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="save"></i> Salvar Lançamento';
                lucide.createIcons();
            }
        }

        // ── CATEGORIES ──
        async function saveCatAction() {
            const name = document.getElementById('cat-name-in').value.trim();
            const budget = parseFloat(document.getElementById('cat-budget-in').value) || 0;
            if (!name) return showToast('Informe o nome da categoria!', 'error');
            if (!appState.user.id) return showToast('Usuário não autenticado.', 'error');
            if (appState.editingCatIndex === null && !checkPlanLimit('category')) return;

            const cObj = { user_id: appState.user.id, name, icon: selIcon, color: selColor, budget, type: appState.currentCatView };
            try {
                let error;
                if (appState.editingCatIndex !== null) {
                    cObj.id = appState.categories[appState.editingCatIndex].id;
                    ({ error } = await _supabase.from('categories').upsert(cObj));
                } else {
                    ({ error } = await _supabase.from('categories').insert(cObj));
                }
                if (error) throw error;
                document.getElementById('modal-cat').classList.remove('active');
                await syncAllData();
                renderCategoryGrid();
                showToast('Categoria salva!', 'success');
                triggerConfetti();
            } catch (err) {
                console.error('Erro ao salvar categoria:', err);
                showToast('Erro ao salvar categoria: ' + (err.message || err), 'error');
            }
        }


        // ── RECURRING ──
        function toggleRecEndDate(show) {
            document.getElementById('rec-end-date-wrap').style.display = show ? 'block' : 'none';
            if (!show) document.getElementById('rec-end-date').value = '';
        }

        function isRecValid(r, year, month) {
            if (!r.end_date) return true; // Vitalícia
            const [eYear, eMonth] = r.end_date.split('-').map(Number);
            if (year < eYear) return true;
            if (year > eYear) return false;
            return month <= eMonth; // Ativa até o mês especificado inclusive
        }

        function openRecurringModal(index = null) {
            appState.editingRecIndex = index;
            const cats = appState.categories.filter(c => c.type === appState.currentRecType);
            document.getElementById('rec-cat').innerHTML = cats.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('');
            document.getElementById('rec-acc').innerHTML = appState.accounts.map(a => `<option value="${a.name}">${a.name}</option>`).join('');

            if (index !== null) {
                const r = appState.recurring[index];
                document.getElementById('rec-name').value = r.name;
                document.getElementById('rec-amount').value = r.amount;
                document.getElementById('rec-day').value = r.day_of_month;
                setRecType(r.type);
                document.getElementById('rec-cat').value = r.category;
                document.getElementById('rec-acc').value = r.account;

                if (r.end_date) {
                    document.getElementById('rec-dur-limit').checked = true;
                    document.getElementById('rec-end-date').value = r.end_date;
                    toggleRecEndDate(true);
                } else {
                    document.getElementById('rec-dur-life').checked = true;
                    toggleRecEndDate(false);
                }
            } else {
                document.getElementById('rec-name').value = '';
                document.getElementById('rec-amount').value = '';
                document.getElementById('rec-day').value = '1';
                setRecType('expense');
                document.getElementById('rec-dur-life').checked = true;
                toggleRecEndDate(false);
            }
            document.getElementById('modal-recurring').classList.add('active');
        }


        function closeRecurringModal() { document.getElementById('modal-recurring').classList.remove('active'); }

        function setRecType(type) {
            appState.currentRecType = type;
            document.getElementById('rec-btn-exp').className = 'toggle-btn expense' + (type === 'expense' ? ' active' : '');
            document.getElementById('rec-btn-inc').className = 'toggle-btn income' + (type === 'income' ? ' active' : '');
            const cats = appState.categories.filter(c => c.type === type);
            document.getElementById('rec-cat').innerHTML = cats.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('');
        }

        async function saveRecurringAction() {
            const name = document.getElementById('rec-name').value;
            const amount = parseFloat(document.getElementById('rec-amount').value);
            const day = parseInt(document.getElementById('rec-day').value);
            const cat = document.getElementById('rec-cat').value;
            const acc = document.getElementById('rec-acc').value;

            if (!name || isNaN(amount) || isNaN(day)) return showToast('Preencha os campos obrigatórios!', 'error');

            const isLimited = document.getElementById('rec-dur-limit').checked;
            const endDate = isLimited ? document.getElementById('rec-end-date').value : null;

            if (isLimited && !endDate) return showToast('Selecione uma data de término!', 'error');

            const recObj = {
                user_id: appState.user.id,
                name, amount, day_of_month: day,
                category: cat, account: acc,
                type: appState.currentRecType,
                end_date: endDate,
                active: true
            });


            let result;
            if (appState.editingRecIndex !== null) {
                recObj.id = appState.recurring[appState.editingRecIndex].id;
                result = await _supabase.from('recurring').upsert(recObj);
            } else {
                result = await _supabase.from('recurring').insert(recObj);
            }

            if (result.error) {
                console.error('Erro ao salvar recorrente:', result.error);
                return showToast('Erro ao salvar no banco de dados: ' + result.error.message, 'error');
            }

            closeRecurringModal();
            await syncAllData();

            // Auto-lançar no mês atual se o dia já chegou e ainda não foi lançado
            if (appState.editingRecIndex === null) { // Só ao CRIAR, não ao editar
                await autoLaunchRecurring(recObj);
            }

            renderRecurringList();
            showToast('Conta recorrente salva!');
        }

        // Auto-lança a transação do recorrente no mês atual se o dia já passou
        async function autoLaunchRecurring(recObj) {
            const now = new Date();
            const today = now.getDate();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            if (recObj.day_of_month > today) return; // Ainda não venceu este mês
            if (!isRecValid(recObj, currentYear, currentMonth)) return; // Já expirou


            // Verificar se já existe uma transação para este recorrente neste mês
            const alreadyExists = appState.transactions.some(t => {
                const td = new Date(t.date);
                return (td.getUTCMonth() + 1) === currentMonth &&
                    td.getUTCFullYear() === currentYear &&
                    (t.description || '').includes(recObj.name);
            });
            if (alreadyExists) return;

            // Gerar a transação com a data de vencimento deste mês
            const dueDay = Math.min(recObj.day_of_month, new Date(currentYear, currentMonth, 0).getDate());
            const dueDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dueDay).padStart(2, '0')}`;

            const tx = {
                user_id: appState.user.id,
                date: dueDate,
                val: recObj.amount,
                category: recObj.category,
                account: recObj.account,
                description: `Recorrente: ${recObj.name}`,
                type: recObj.type,
                regime: 'Fixo',
                occurrence: 'Única'
            });

            const { error } = await _supabase.from('transactions').insert(tx);
            if (!error) {
                await syncAllData();
                initDashboard();
                showToast(`Lançamento de "${recObj.name}" gerado automaticamente!`);
            }
        }

        // Lança manualmente um recorrente no mês atual
        async function launchRecurringNow(index) {
            const r = appState.recurring[index];
            if (!r) return;
            await autoLaunchRecurring(r);
            // Se autoLaunch não fez nada (ainda não venceu), forçar lançamento hoje
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            const alreadyExists = appState.transactions.some(t => {
                const td = new Date(t.date);
                return (td.getUTCMonth() + 1) === currentMonth &&
                    td.getUTCFullYear() === currentYear &&
                    (t.description || '').includes(r.name);
            });
            if (!alreadyExists) {
                const todayStr = new Date().toISOString().split('T')[0];
                const tx = {
                    user_id: appState.user.id, date: todayStr, val: r.amount,
                    category: r.category, account: r.account,
                    description: `Recorrente: ${r.name}`, type: r.type, regime: 'Fixo', occurrence: 'Única'
                });
                const { error } = await _supabase.from('transactions').insert(tx);
                if (!error) {
                    await syncAllData();
                    initDashboard();
                    showToast(`Lançamento de "${r.name}" realizado!`);
                } else {
                    showToast('Erro ao lançar: ' + error.message, 'error');
                }
            } else {
                showToast(`"${r.name}" já foi lançado este mês.`, 'error');
            }
            renderRecurringList();
        }

        async function toggleRecurringStatus(index) {
            const r = appState.recurring[index];
            const { error } = await _supabase.from('recurring').update({ active: !r.active }).eq('id', r.id);
            if (error) return showToast('Erro ao atualizar status.', 'error');
            await syncAllData();
            renderRecurringList();
        }

        async function deleteRecurring(index) {
            if (confirm('Deseja excluir esta conta recorrente?')) {
                const r = appState.recurring[index];
                try {
                    const { error } = await _supabase.from('recurring').delete().eq('id', r.id);
                    if (error) throw error;
                    await syncAllData();
                    renderRecurringList();
                    showToast('Removido com sucesso.');
                } catch (err) {
                    console.error('Erro ao excluir recorrente:', err);
                    showToast('Erro ao excluir: ' + (err.message || err), 'error');
                }
            }
        }

        function renderRecurringList() {
            const activeList = document.getElementById('rec-active-list');
            const pausedList = document.getElementById('rec-paused-list');
            if (!activeList || !pausedList) return;

            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            const filtered = appState.recurring.filter(r => isRecValid(r, currentYear, currentMonth));

            const ativas = filtered.filter(r => r.active);
            const pausadas = filtered.filter(r => !r.active);

            const renderItems = (items, container) => {
                if (items.length === 0) {
                    container.innerHTML = '<div class="empty-state"><p>Nenhuma conta.</p></div>';
                    return;
                }
                container.innerHTML = items.map(r => {
                    const originalIndex = appState.recurring.indexOf(r);
                    const cat = appState.categories.find(c => c.name === r.category);
                    const icon = cat ? cat.icon : '🔄';

                    const alreadyLaunched = appState.transactions.some(t => {
                        const td = new Date(t.date);
                        return (td.getUTCMonth() + 1) === currentMonth &&
                            td.getUTCFullYear() === currentYear &&
                            (t.description || '').includes(r.name);
                    });

                    const statusBadge = alreadyLaunched
                        ? `<span class="chip" style="font-size:0.65rem; background:rgba(83,23,166,0.1); color:var(--accent);">✓ Lançado</span>`
                        : `<span class="chip" style="font-size:0.65rem; background:rgba(123,75,191,0.1); color:var(--accent-2);">Pendente</span>`;

                    const validityText = r.end_date
                        ? `Até ${r.end_date.split('-').reverse().join('/')}`
                        : 'Vitalícia';

                    return `<div class="card cat-card" style="flex-direction:column; align-items:stretch; gap:12px;">
                    <div style="display:flex; align-items:center; gap:16px;">
                        <div class="cat-icon" style="background:var(--accent-light);">${icon}</div>
                        <div class="cat-info">
                            <div class="cat-name" style="display:flex; align-items:center; gap:8px;">
                                ${r.name}
                                <div class="icon-action danger" style="padding:4px;" onclick="deleteRecurring(${originalIndex})">
                                    <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
                                </div>
                            </div>
                            <div class="cat-meta">Vence dia ${r.day_of_month} · ${r.account}</div>
                            <div class="cat-meta" style="color:var(--accent); font-weight:600; font-size:0.7rem; margin-top:2px;">
                                <i data-lucide="calendar" style="width:10px; height:10px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
                                ${validityText}
                            </div>
                        </div>
                        <div style="margin-left:auto; text-align:right;">
                            <div style="font-weight:800; color:${r.type === 'income' ? 'var(--accent-2)' : 'var(--danger)'}; margin-bottom:4px;">
                                ${r.type === 'income' ? '+' : '-'} ${fmtBRL(r.amount)}
                            </div>
                            ${statusBadge}
                        </div>
                    </div>
                    <div style="display:flex; gap:8px; margin-top:4px;">
                        <button class="btn btn-ghost" style="flex:1; padding:6px; font-size:0.75rem;" onclick="openRecurringModal(${originalIndex})">Editar</button>
                        <button class="btn btn-ghost" style="flex:1; padding:6px; font-size:0.75rem;" onclick="toggleRecurringStatus(${originalIndex})">${r.active ? 'Pausar' : 'Reativar'}</button>
                        ${!alreadyLaunched && r.active ? `<button class="btn btn-primary" style="flex:1; padding:6px; font-size:0.75rem;" onclick="launchRecurringNow(${originalIndex})">Lançar agora</button>` : ''}
                    </div>
                </div>`;
                }).join('');
            });

            renderItems(ativas, activeList);
            renderItems(pausadas, pausedList);
            lucide.createIcons();
        }

        async function deleteCat(i) {
            const cat = appState.categories[i];
            openConfirmModal(
                'Excluir Categoria',
                `Tem certeza que deseja excluir a categoria "${cat.name}"? Isso não apagará as movimentações, mas elas ficarão sem categoria.`,
                async () => {
                    try {
                        await _supabase.from('categories').delete().eq('id', cat.id);
                        await syncAllData();
                        renderCategoryGrid();
                        showToast('Categoria removida com sucesso!');
                    } catch (err) {
                        console.error('Erro ao excluir categoria:', err);
                        showToast('Erro ao excluir categoria.', 'error');
                    }
                }
            );
        }

        // ── UI UTILS ──

        /* Sincroniza bottom nav — chama após qualquer troca de aba */
        const BOTTOM_NAV_TABS = ['dashboard', 'historico', 'lancamento', 'orcamento'];
        function syncBottomNav(id) {
            BOTTOM_NAV_TABS.forEach(tab => {
                const el = document.getElementById('bn-' + tab);
                if (el) el.classList.toggle('active', tab === id);
            });
            /* "Mais" fica inativo quando uma aba conhecida está ativa */
            const menuBtn = document.getElementById('bn-menu');
            if (menuBtn) menuBtn.classList.toggle('active', !BOTTOM_NAV_TABS.includes(id));
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        /* Navegação mobile via bottom nav (fecha sidebar antes) */
        function switchTabMobile(id) {
            const sb = document.querySelector('.sidebar');
            if (sb) sb.classList.remove('mobile-open');
            switchTab(id);
        }

        /* Sincroniza o select de mês do mobile header */
        function syncMonthFilters(value) {
            const desktop = document.getElementById('dash-month-filter');
            const mobile = document.getElementById('dash-month-filter-mobile');
            if (desktop && desktop.value !== value) desktop.value = value;
            if (mobile && mobile.value !== value) mobile.value = value;
            initDashboard();
        }

        function switchTabGated(id) {
            const PRO_TABS = ['indicadores', 'noticias', 'investimentos'];
            if (PRO_TABS.includes(id) && appState.plan !== 'pro') {
                openPlanModal(); return;
            }
            switchTab(id);
        }

        /* ── Limites do plano Básico ── */
        function countTxThisMonth() {
            const now = new Date();
            const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
            return (appState.transactions||[]).filter(t => (t.date||'').slice(0,7) === ym).length;
        }
        function checkPlanLimit(type) {
            if (appState.plan === 'pro') return true;
            if (type === 'transaction' && countTxThisMonth() >= 40) {
                showToast('Limite de 40 lançamentos mensais atingido. Faça upgrade para o Pro! 🚀','error');
                setTimeout(openPlanModal, 1800);
                return false;
            }
            if (type === 'category' && (appState.categories||[]).filter(c=>c.type===appState.currentCatView).length >= 7) {
                showToast('Limite de 7 categorias atingido. Faça upgrade para o Pro! 🚀','error');
                setTimeout(openPlanModal, 1800);
                return false;
            }
            return true;
        }

        async function switchTab(id) {
            document.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-' + id).classList.add('active');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

            // Find link and its group
            const link = document.querySelector(`[onclick^="switchTab('${id}')"]`);
            if (link) {
                link.classList.add('active');
                const group = link.closest('.nav-group');
                if (group) {
                    if (!group.classList.contains('expanded')) {
                        toggleNavGroup(group.id);
                    }
                } else {
                    // If switching to a top-level tab (Dashboard), close all groups
                    document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('expanded'));
                }
            }

            /* Atualiza bottom nav e rola para o topo */
            syncBottomNav(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            await syncAllData();
            if (id === 'dashboard') initDashboard();
            if (id === 'recorrentes') renderRecurringList();
            if (id === 'orcamento') await renderBudgetTab();
            if (id === 'relatorios') await renderReportsTab();
            if (id === 'comparativo') await renderComparisonTab();
            if (id === 'resumo') renderSummaryTab();
            if (id === 'categorias') renderCategoryGrid();
            if (id === 'cartoes') renderCardsTab();
            if (id === 'historico') renderHistoryTable();
            if (id === 'configuracoes') updateUI();
            if (id === 'assinatura') {
                // 1. Renderiza com dados locais imediatamente
                if (typeof window.updateSubscriptionUI === 'function') window.updateSubscriptionUI();
                // 2. Em paralelo: busca dados atualizados do Asaas e forma de pagamento
                Promise.allSettled([
                    typeof window._syncPlanFromASAAS === 'function'
                        ? window._syncPlanFromASAAS(false).then(() => { if (typeof window.updateSubscriptionUI === 'function') window.updateSubscriptionUI(); })
                        : Promise.resolve(),
                    typeof window.loadPaymentMethod === 'function'
                        ? window.loadPaymentMethod().then(() => { if (typeof window._renderPaymentDisplay === 'function') window._renderPaymentDisplay(appState.plan === 'pro'); })
                        : Promise.resolve(),
                ]).catch(() => {});
            }


            if (id === 'metas') renderMetasTab();
            if (id === 'investimentos') {
                if (typeof renderInvestimentosTab === 'function') {
                    try { await renderInvestimentosTab(); } catch (e) { console.error('Render investimentos:', e); }
                } else {
                    console.warn('renderInvestimentosTab não está definida — verifique o script de investimentos.');
                }
            }
            if (id === 'indicadores') {
                if (typeof renderIndicadoresTab === 'function') {
                    try { await renderIndicadoresTab(); } catch (e) { console.error('Render indicadores:', e); }
                }
            }
            if (id === 'noticias') {
                if (typeof renderNoticiasTab === 'function') {
                    try { await renderNoticiasTab(); } catch (e) { console.error('Render noticias:', e); }
                }
            }
            if (id === 'lancamento') {
                updateEntryCategories();
                maybeShowShortcutTip();
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function toggleNavGroup(groupId) {
            const target = document.getElementById(groupId);
            const alreadyExpanded = target.classList.contains('expanded');

            // Comportamento Accordion: Fecha todos os outros
            document.querySelectorAll('.nav-group').forEach(g => {
                g.classList.remove('expanded');
            });

            // Toggle o atual
            if (!alreadyExpanded) {
                target.classList.add('expanded');
            }
        }


        /* ── Dropdown customizado de categoria — funções JS ── */
        function toggleCatDropdown() {
            const btn  = document.getElementById('cat-dropdown-btn');
            const menu = document.getElementById('cat-dropdown-menu');
            if (!btn || !menu) return;
            const isOpen = menu.classList.contains('open');
            closeCatDropdown();
            if (!isOpen) {
                btn.classList.add('open');
                menu.classList.add('open');
            }
        }

        function closeCatDropdown() {
            const btn  = document.getElementById('cat-dropdown-btn');
            const menu = document.getElementById('cat-dropdown-menu');
            if (btn)  btn.classList.remove('open');
            if (menu) menu.classList.remove('open');
        }

        function selectCatDropdownItem(name, icon) {
            // Atualiza o label visual
            const label = document.getElementById('cat-dropdown-label');
            if (label) {
                label.textContent = (icon ? icon + '  ' : '') + name;
                label.style.color = 'var(--text-main)';
            }
            // Marca o selected no select nativo (para o form ler)
            const sel = document.getElementById('e-cat');
            if (sel) sel.value = name;
            // Destaca o item selecionado
            document.querySelectorAll('#cat-dropdown-menu .cat-dropdown-item').forEach(el => {
                el.classList.toggle('selected', el.querySelector('span:last-child')?.textContent === name);
            });
            closeCatDropdown();
        }

        // Fechar ao clicar fora
        document.addEventListener('click', function(e) {
            const wrap = document.getElementById('cat-dropdown-wrap');
            if (wrap && !wrap.contains(e.target)) closeCatDropdown();
            const wrapAcc = document.getElementById('acc-dropdown-wrap');
            if (wrapAcc && !wrapAcc.contains(e.target)) closeAccDropdown();
        });

        function toggleAccDropdown() {
            const btn  = document.getElementById('acc-dropdown-btn');
            const menu = document.getElementById('acc-dropdown-menu');
            if (!btn || !menu) return;
            const isOpen = menu.classList.contains('open');
            closeAccDropdown();
            if (!isOpen) { btn.classList.add('open'); menu.classList.add('open'); }
        }

        function closeAccDropdown() {
            const btn  = document.getElementById('acc-dropdown-btn');
            const menu = document.getElementById('acc-dropdown-menu');
            if (btn)  btn.classList.remove('open');
            if (menu) menu.classList.remove('open');
        }

        function selectAccDropdownItem(value, label, icon) {
            const lbl = document.getElementById('acc-dropdown-label');
            if (lbl) { lbl.textContent = (icon ? icon + '  ' : '') + label; lbl.style.color = 'var(--text-main)'; }
            const sel = document.getElementById('e-acc');
            if (sel) { sel.value = value; handleEntryAccountChange(); }
            document.querySelectorAll('#acc-dropdown-menu .cat-dropdown-item').forEach(el => {
                el.classList.toggle('selected', el.getAttribute('onclick')?.includes(value));
            });
            closeAccDropdown();
        }

        function updateEntryCategories() {

            const cats = appState.categories.filter(c => c.type === appState.currentEntryType);

            // Atualiza o select nativo oculto (usado pela lógica de save)
            document.getElementById('e-cat').innerHTML = '<option value="">Selecione...</option>' + cats.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('');

            // Reseta o dropdown customizado
            const label = document.getElementById('cat-dropdown-label');
            if (label) { label.textContent = 'Selecione...'; label.style.color = '#94a3b8'; }
            document.getElementById('e-cat').value = '';

            // Popula o menu customizado
            const menu = document.getElementById('cat-dropdown-menu');
            if (menu) {
                menu.innerHTML = cats.map(c => `
                    <div class="cat-dropdown-item" onclick="selectCatDropdownItem('${c.name.replace(/'/g, "\'")}', '${(c.icon||'').replace(/'/g, "\'")}')">
                        <span class="cat-dropdown-icon">${c.icon || ''}</span>
                        <span>${c.name}</span>
                    </div>`).join('');
            }
            const selAcc = document.getElementById('e-acc');
            const accOpts = appState.accounts.length > 0
                ? appState.accounts.map(acc => `<option value="acc:${acc.name}">${acc.name}</option>`).join('')
                : '<option value="acc:Dinheiro">Dinheiro</option>';
            // Cartões só fazem sentido em despesas (não em receita ou meta)
            const showCards = appState.currentEntryType === 'expense' && appState.cards.length > 0;
            const cardOpts = showCards
                ? appState.cards.map(c => `<option value="card:${c.id}">💳 ${c.name}${c.last4 ? ' ••' + c.last4 : ''}</option>`).join('')
                : '';
            let html = `<optgroup label="Contas Bancárias">${accOpts}</optgroup>`;
            if (cardOpts) html += `<optgroup label="Cartões de Crédito">${cardOpts}</optgroup>`;
            selAcc.innerHTML = html;
            handleEntryAccountChange();

            // ── Popula o dropdown customizado de conta ──
            const accMenu = document.getElementById('acc-dropdown-menu');
            const accLabel = document.getElementById('acc-dropdown-label');
            if (accLabel) { accLabel.textContent = 'Selecione...'; accLabel.style.color = '#94a3b8'; }
            if (accMenu) {
                let menuHTML = '';

                // Grupo: Contas Bancárias
                menuHTML += '<div class="cat-dropdown-group-label">Contas Bancárias</div>';
                const accs = appState.accounts.length > 0 ? appState.accounts : [{ name: 'Dinheiro', icon: '💵' }];
                menuHTML += accs.map(acc => `
                    <div class="cat-dropdown-item" onclick="selectAccDropdownItem('acc:${acc.name.replace(/'/g, "'")}', '${(acc.name).replace(/'/g, "'")}', '${(acc.icon||'🏦').replace(/'/g, "'")}')">
                        <span class="cat-dropdown-acc-icon" style="background:${acc.color ? acc.color+'18' : '#ede9fe'};">${acc.icon || '🏦'}</span>
                        <span>${acc.name}</span>
                    </div>`).join('');

                // Grupo: Cartões (só em despesa)
                if (showCards) {
                    menuHTML += '<div class="cat-dropdown-group-label">Cartões de Crédito</div>';
                    menuHTML += appState.cards.map(c => `
                        <div class="cat-dropdown-item" onclick="selectAccDropdownItem('card:${c.id}', '${c.name.replace(/'/g, "'")}${c.last4 ? ' ••'+c.last4 : ''}', '💳')">
                            <span class="cat-dropdown-acc-icon" style="background:${c.color ? c.color+'18' : '#ede9fe'};">
                                <i data-lucide="credit-card" style="width:14px;height:14px;color:${c.color||'var(--accent-2)'};"></i>
                            </span>
                            <span>${c.name}${c.last4 ? ' <span style="color:var(--text-muted);font-size:0.8rem;">••'+c.last4+'</span>' : ''}</span>
                        </div>`).join('');
                }

                accMenu.innerHTML = menuHTML;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }

        function handleEntryAccountChange() {
            const selAcc = document.getElementById('e-acc');
            const val = selAcc.value;
            const isCard = val && val.startsWith('card:');
            const occGroup = document.getElementById('group-regime-occurrence');
            const rowInst = document.getElementById('row-installments');
            // Em despesa com cartão, força mostrar campo de parcelas e oculta regime/ocorrência
            if (isCard && appState.currentEntryType === 'expense') {
                if (occGroup) occGroup.style.display = 'none';
                if (rowInst) rowInst.style.display = 'block';
                const inst = document.getElementById('e-installments');
                if (inst && (!inst.value || inst.value < 1)) inst.value = 1;
                if (inst) inst.min = 1;
            } else {
                // Comportamento normal (controlado por setOccurrence)
                if (occGroup && appState.currentEntryType === 'expense') occGroup.style.display = 'grid';
                if (rowInst) rowInst.style.display = appState.entryOccurrence === 'Parcelas' ? 'block' : 'none';
                const inst = document.getElementById('e-installments');
                if (inst) inst.min = 2;
            }
        }

        appState.catSort = 'alpha';
        function setCatSort(val) {
            appState.catSort = val;
            document.getElementById('c-sort-alpha').classList.toggle('active', val === 'alpha');
            document.getElementById('c-sort-spent').classList.toggle('active', val === 'spent');
            renderCategoryGrid();
        }

        function switchCatList(type) {
            appState.currentCatView = type;
            document.getElementById('c-tab-exp').className = 'toggle-btn expense' + (type === 'expense' ? ' active' : '');
            document.getElementById('c-tab-inc').className = 'toggle-btn income' + (type === 'income' ? ' active' : '');

            // Se mudar para receitas, desabilitar filtro de "mais gastas" se estiver ativo
            if (type === 'income' && appState.catSort === 'spent') {
                setCatSort('alpha');
            }

            renderCategoryGrid();
        }

        function renderCategoryGrid() {
            const grid = document.getElementById('cat-grid');
            let cats = appState.categories.filter(c => c.type === appState.currentCatView);

            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const monthTxs = appState.transactions.filter(t => {
                const d = new Date(t.date);
                return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
            });

            // Aplicar ordenação
            if (appState.catSort === 'alpha') {
                cats.sort((a, b) => a.name.localeCompare(b.name));
            } else {
                cats.sort((a, b) => {
                    const spentA = monthTxs.filter(t => t.category === a.name).reduce((s, t) => s + Number(t.val), 0);
                    const spentB = monthTxs.filter(t => t.category === b.name).reduce((s, t) => s + Number(t.val), 0);
                    return spentB - spentA;
                });
            }

            if (cats.length === 0) {
                grid.innerHTML = '<div class="empty-state" style="grid-column:span 4;"><p>Nenhuma categoria criada.</p></div>';
                return;
            }

            if (!document.getElementById('cat-flip-style')) {
                const style = document.createElement('style');
                style.id = 'cat-flip-style';
                style.innerHTML = '.cat-card-inner.is-flipped { transform: rotateY(180deg); }';
                document.head.appendChild(style);
            }

            const totalMonthExp = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.val), 0);
            const totalMonthInc = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.val), 0);

            grid.innerHTML = cats.map(c => {
                const spent = monthTxs.filter(t => t.category === c.name).reduce((s, t) => s + Number(t.val), 0);
                const p = c.budget > 0 ? Math.min((spent / c.budget) * 100, 100) : 0;
                const over = c.budget > 0 && spent > c.budget;
                const barColor = over ? 'var(--danger)' : c.color;
                const gi = appState.categories.indexOf(c);
                
                let pctOfTotal = 0;
                let totalRef = 0;
                if (c.type === 'expense') {
                    pctOfTotal = totalMonthExp > 0 ? ((spent / totalMonthExp) * 100).toFixed(1) : 0;
                    totalRef = totalMonthExp;
                } else {
                    pctOfTotal = totalMonthInc > 0 ? ((spent / totalMonthInc) * 100).toFixed(1) : 0;
                    totalRef = totalMonthInc;
                }

                return `<div class="card cat-card" style="padding:0; background:transparent!important; border:none!important; perspective:1000px; cursor:pointer;" onclick="this.querySelector('.cat-card-inner').classList.toggle('is-flipped')">
                    <div class="cat-card-inner" style="position:relative; width:100%; transition:transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style:preserve-3d;">
                        
                        <!-- FRONT -->
                        <div class="cat-card-front" style="min-height:124px; background:var(--bg-sidebar); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:18px 20px; display:flex; flex-direction:column; align-items:stretch; justify-content:center; gap:12px; backface-visibility:hidden; -webkit-backface-visibility:hidden;">
                            <div style="display:flex; align-items:center; gap:16px;">
                                <div class="cat-icon" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08);">${c.icon}</div>
                                <div class="cat-info">
                                    <div class="cat-name">${c.name}</div>
                                    <div class="cat-meta">${c.type === 'expense' ? 'Meta: ' + fmtBRL(c.budget) : 'Receita'}</div>
                                </div>
                                <div class="cat-actions" style="margin-left:auto; display:flex; align-items:center; gap:2px;" onclick="event.stopPropagation()">
                                    <div id="cat-action-menu-${gi}" class="cat-action-menu" style="display:flex; overflow:hidden; transition:max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease; max-width:0; opacity:0; align-items:center; gap:2px; pointer-events:none;">
                                        <div onclick="openCatModal(${gi})" style="display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:8px; cursor:pointer; color:#f1f5f9; transition:var(--transition);" onmouseenter="this.style.background='rgba(83,23,166,0.2)';this.style.color='var(--accent)'" onmouseleave="this.style.background='';this.style.color='#f1f5f9'" title="Editar">
                                            <i data-lucide="edit-3" style="width:15px; height:15px;"></i>
                                        </div>
                                        <div onclick="deleteCat(${gi})" style="display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:8px; cursor:pointer; color:var(--danger); transition:var(--transition);" onmouseenter="this.style.background='rgba(244,63,94,0.15)'" onmouseleave="this.style.background=''" title="Apagar">
                                            <i data-lucide="trash-2" style="width:15px; height:15px;"></i>
                                        </div>
                                    </div>
                                    <div id="cat-action-btn-${gi}" onclick="toggleCatActionMenu(event, ${gi})" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.4rem; color:rgba(255,255,255,0.5); transition:transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='rgba(255,255,255,0.5)'">
                                        +
                                    </div>
                                </div>
                            </div>
                            ${c.type === 'expense' ? `
                            <div style="margin-top:4px;">
                                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:6px; color:var(--text-sub);">
                                    <span>${fmtBRL(spent)} gastos</span>
                                    <span style="font-weight:700; color:var(--accent);">${p.toFixed(0)}%</span>
                                </div>
                                <div class="progress-track" style="height:4px;">
                                    <div class="progress-fill" style="width:${p}%; background:var(--accent);"></div>
                                </div>
                            </div>` : ''}
                        </div>

                        <!-- BACK -->
                        <div class="cat-card-back" style="min-height:124px; position:absolute; top:0; left:0; width:100%; height:100%; background:var(--bg-sidebar); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:18px 20px; display:flex; flex-direction:column; align-items:center; justify-content:center; backface-visibility:hidden; -webkit-backface-visibility:hidden; transform:rotateY(180deg);">
                            <div style="font-size:0.75rem; color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; text-align:center;">Participação no Mês</div>
                            <div style="font-size:2.2rem; font-weight:800; color:${c.color}; text-shadow: 0 2px 14px ${c.color}30;">${pctOfTotal}%</div>
                            <div style="font-size:0.75rem; color:rgba(255,255,255,0.4); margin-top:2px;">de ${fmtBRL(totalRef)} ${c.type === 'expense' ? 'gastos totais' : 'recebidos'}</div>
                        </div>

                    </div>
                </div>`;
            }).join('');
            lucide.createIcons();
            
            // Inicia a animação dinâmica de virar cards sozinhos
            startRandomCatFlip();
        }

        let catFlipInterval = null;
        let activeFlippedCard = null;

        function startRandomCatFlip() {
            if (catFlipInterval) clearInterval(catFlipInterval);
            if (activeFlippedCard) {
                activeFlippedCard.classList.remove('is-flipped');
                activeFlippedCard = null;
            }
            
            const flipLogic = () => {
                const tab = document.getElementById('tab-categorias');
                if (!tab || !tab.classList.contains('active')) {
                    clearInterval(catFlipInterval);
                    return;
                }

                if (activeFlippedCard) {
                    activeFlippedCard.classList.remove('is-flipped');
                    activeFlippedCard = null;
                }

                const cards = document.querySelectorAll('.cat-card-inner');
                if (!cards || cards.length === 0) return;

                const unflippedCards = Array.from(cards).filter(c => !c.classList.contains('is-flipped'));
                if (unflippedCards.length === 0) return;

                const randomCard = unflippedCards[Math.floor(Math.random() * unflippedCards.length)];
                randomCard.classList.add('is-flipped');
                activeFlippedCard = randomCard;

                setTimeout(() => {
                    if (activeFlippedCard === randomCard && tab.classList.contains('active')) {
                        randomCard.classList.remove('is-flipped');
                        activeFlippedCard = null;
                    }
                }, 3500);
            });

            // Vira o primeiro card quase que imediatamente (2 seg) após entrar na aba
            setTimeout(() => {
                const tab = document.getElementById('tab-categorias');
                if (tab && tab.classList.contains('active')) {
                    flipLogic();
                }
            }, 2000);
            
            // E continua o loop a cada 7 segundos
            catFlipInterval = setInterval(flipLogic, 7000); 
        }

        function toggleCatActionMenu(e, gi) {
            e.stopPropagation();
            const menu = document.getElementById(`cat-action-menu-${gi}`);
            const btn = document.getElementById(`cat-action-btn-${gi}`);
            if (!menu || !btn) return;
            
            const isOpen = menu.style.maxWidth !== '0px' && menu.style.maxWidth !== '0';
            
            // Fecha todos os outros
            document.querySelectorAll('.cat-action-menu').forEach(m => {
                m.style.maxWidth = '0';
                m.style.opacity = '0';
                m.style.pointerEvents = 'none';
            });
            document.querySelectorAll('[id^="cat-action-btn-"]').forEach(b => b.style.transform = '');
            
            if (!isOpen) {
                menu.style.maxWidth = '80px'; // Largura suficiente para os ícones
                menu.style.opacity = '1';
                menu.style.pointerEvents = 'auto';
                btn.style.transform = 'rotate(45deg)';
            }
        }

        if (!window._catMenuListenerAdded) {
            document.addEventListener('click', () => {
                document.querySelectorAll('.cat-action-menu').forEach(m => {
                    m.style.maxWidth = '0';
                    m.style.opacity = '0';
                    m.style.pointerEvents = 'none';
                });
                document.querySelectorAll('[id^="cat-action-btn-"]').forEach(b => b.style.transform = '');
            });
            window._catMenuListenerAdded = true;
        }

        function openCatModal(index = null) {
            appState.editingCatIndex = index;
            document.getElementById('cat-modal-title').innerText = index !== null ? 'Editar Categoria' : 'Nova Categoria';
            if (index !== null) {
                const c = appState.categories[index];
                document.getElementById('cat-name-in').value = c.name;
                document.getElementById('cat-budget-in').value = c.budget || '';
                selIcon = c.icon;
                selColor = c.color;
                setModalCatType(c.type);
            } else {
                document.getElementById('cat-name-in').value = '';
                document.getElementById('cat-budget-in').value = '';
                setModalCatType(appState.currentCatView);
            }
            document.getElementById('modal-cat').classList.add('active');
            renderCategoryPicker();
        }

        function closeCatModal() { document.getElementById('modal-cat').classList.remove('active'); }

        function setModalCatType(type) {
            appState.currentCatView = type;
            document.getElementById('m-btn-exp').className = 'toggle-btn expense' + (type === 'expense' ? ' active' : '');
            document.getElementById('m-btn-inc').className = 'toggle-btn income' + (type === 'income' ? ' active' : '');
            document.getElementById('row-budget').style.display = type === 'income' ? 'none' : 'block';
            document.getElementById('label-cat-name').innerText = type === 'income' ? 'Nome da Identificação' : 'Nome da Categoria';
        }

        function togglePickerPopover(e, id) {
            e.stopPropagation();
            const popover = document.getElementById(id);
            if (!popover) return;
            const isOpen = popover.style.display === 'block';
            document.querySelectorAll('.picker-popover').forEach(p => p.style.display = 'none');
            if (!isOpen) popover.style.display = 'block';
        }

        if (!window._pickerPopoverListener) {
            document.addEventListener('click', () => {
                document.querySelectorAll('.picker-popover').forEach(p => p.style.display = 'none');
            });
            window._pickerPopoverListener = true;
        }

        function renderCategoryPicker() {
            document.getElementById('icon-picker').innerHTML = ICONS_SET.map(i =>
                `<div class="pick-item ${i === selIcon ? 'active' : ''}" onclick="selIcon='${i}'; document.querySelectorAll('.picker-popover').forEach(p=>p.style.display='none'); renderCategoryPicker()">${i}</div>`
            ).join('');
            document.getElementById('color-picker').innerHTML = COLORS_SET.map(c =>
                `<div class="pick-color ${c === selColor ? 'active' : ''}" style="background:${c}" onclick="selColor='${c}'; document.querySelectorAll('.picker-popover').forEach(p=>p.style.display='none'); renderCategoryPicker()"></div>`
            ).join('');

            const iconBtn = document.getElementById('btn-icon-picker');
            if (iconBtn) iconBtn.innerText = selIcon;
            
            const colorPreview = document.getElementById('preview-color');
            if (colorPreview) colorPreview.style.background = selColor;
        }

        // ── CARDS (Cartões de Crédito) ──
        const CARD_COLORS = ["var(--accent)", "var(--accent-2)", "#A855F7", "#0EA5E9", "#EF4444", "#F59E0B", "#10B981", "#1F2937"];
        let selCardColor = CARD_COLORS[0];

        function openCardModal(index = null) {
            appState.editingCardIndex = index;
            document.getElementById('card-modal-title').innerText = index !== null ? 'Editar Cartão' : 'Novo Cartão';
            // Popular select de conta padrão
            const defAccSel = document.getElementById('card-default-acc-in');
            defAccSel.innerHTML = '<option value="">— Nenhuma (escolho na hora) —</option>' +
                appState.accounts.map(a => `<option value="${a.name}">${a.name}</option>`).join('');
            if (index !== null) {
                const c = appState.cards[index];
                document.getElementById('card-name-in').value = c.name || '';
                document.getElementById('card-bank-in').value = c.bank || '';
                document.getElementById('card-last4-in').value = c.last4 || '';
                document.getElementById('card-limit-in').value = c.credit_limit || '';
                document.getElementById('card-closing-in').value = c.closing_day || '';
                document.getElementById('card-due-in').value = c.due_day || '';
                defAccSel.value = c.default_payment_account || '';
                selCardColor = c.color || CARD_COLORS[0];
            } else {
                ['card-name-in', 'card-bank-in', 'card-last4-in', 'card-limit-in', 'card-closing-in', 'card-due-in']
                    .forEach(id => document.getElementById(id).value = '');
                defAccSel.value = '';
                selCardColor = CARD_COLORS[0];
            }
            renderCardColorPicker();
            document.getElementById('modal-card').classList.add('active');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function closeCardModal() { document.getElementById('modal-card').classList.remove('active'); }

        function renderCardColorPicker() {
            document.getElementById('card-color-picker').innerHTML = CARD_COLORS.map(c =>
                `<div class="pick-color ${c === selCardColor ? 'active' : ''}" style="background:${c}" onclick="selCardColor='${c}';renderCardColorPicker()"></div>`
            ).join('');
        }

        async function saveCardAction() {
            const name = document.getElementById('card-name-in').value.trim();
            const bank = document.getElementById('card-bank-in').value.trim();
            const last4 = document.getElementById('card-last4-in').value.trim();
            const credit_limit = parseFloat(document.getElementById('card-limit-in').value) || 0;
            const closing_day = parseInt(document.getElementById('card-closing-in').value) || 1;
            const due_day = parseInt(document.getElementById('card-due-in').value) || 10;
            if (!name) return showToast('Informe o nome do cartão!', 'error');
            if (closing_day < 1 || closing_day > 31) return showToast('Dia de fechamento inválido!', 'error');
            if (due_day < 1 || due_day > 31) return showToast('Dia de vencimento inválido!', 'error');

            const default_payment_account = document.getElementById('card-default-acc-in').value || null;
            const payload = { user_id: appState.user.id, name, bank, last4, credit_limit, closing_day, due_day, color: selCardColor, default_payment_account };
            let error;
            if (appState.editingCardIndex !== null) {
                const id = appState.cards[appState.editingCardIndex].id;
                ({ error } = await _supabase.from('cards').update(payload).eq('id', id));
            } else {
                ({ error } = await _supabase.from('cards').insert([payload]));
            }
            if (error) return showToast('Erro ao salvar cartão: ' + error.message, 'error');
            showToast('Cartão salvo!');
            closeCardModal();
            await syncAllData();
            renderCardsTab();
        }

        async function deleteCard(index) {
            const c = appState.cards[index];
            const hasTxs = appState.transactions.some(t => t.card_id === c.id);
            const warning = hasTxs ? '\n\n⚠️ Existem transações associadas a este cartão. Elas continuarão no histórico, mas perderão o vínculo.' : '';
            openConfirmModal(
                `Excluir cartão "${c.name}"`,
                `Tem certeza que deseja excluir este cartão?${warning}`,
                async () => {
                    const { error } = await _supabase.from('cards').delete().eq('id', c.id);
                    if (error) return showToast('Erro ao excluir: ' + error.message, 'error');
                    showToast('Cartão excluído!');
                    await syncAllData();
                    renderCardsTab();
                }
            );
        }

        // Dado uma data de compra e o dia de fechamento do cartão, retorna o mês da fatura ({year, month})
        // Se a compra ocorre depois do fechamento, ela vai para a fatura do mês seguinte.
        function computeInvoiceMonth(date, closingDay) {
            const d = (date instanceof Date) ? date : new Date(date + 'T00:00:00');
            let y = d.getFullYear();
            let m = d.getMonth() + 1; // 1..12
            if (d.getDate() > closingDay) {
                m += 1;
                if (m > 12) { m = 1; y += 1; }
            }
            return { year: y, month: m };
        }

        function currentInvoiceMonthStr(card) {
            const { year, month } = computeInvoiceMonth(new Date(), card.closing_day);
            return `${year}-${String(month).padStart(2, '0')}`;
        }

        // Calcula a fatura aberta/fechada de um cartão usando invoice_month
        // Pagamentos de fatura são representados por transações com is_invoice_payment=true
        // que abatem o saldo da fatura daquele invoice_month.
        function getCardInvoiceInfo(card) {
            const cardTxs = appState.transactions.filter(t => t.card_id === card.id);
            const purchases = cardTxs.filter(t => !t.is_invoice_payment);
            const payments = cardTxs.filter(t => t.is_invoice_payment);
            const currentInv = currentInvoiceMonthStr(card);

            // Soma compras por invoice_month
            const buyByMonth = {};
            purchases.forEach(t => {
                if (!t.invoice_month) return;
                buyByMonth[t.invoice_month] = (buyByMonth[t.invoice_month] || 0) + Number(t.val);
            });
            // Soma pagamentos por invoice_month
            const payByMonth = {};
            payments.forEach(t => {
                if (!t.invoice_month) return;
                payByMonth[t.invoice_month] = (payByMonth[t.invoice_month] || 0) + Number(t.val);
            });

            let open = 0, closed = 0, future = 0;
            Object.keys(buyByMonth).forEach(m => {
                const balance = buyByMonth[m] - (payByMonth[m] || 0);
                if (balance <= 0) return;
                if (m === currentInv) open += balance;
                else if (m < currentInv) closed += balance;
                else future += balance;
            });
            const totalUsed = open + closed + future;
            return { open, closed, future, totalUsed, available: Math.max(0, Number(card.credit_limit) - totalUsed) };
        }

        // Retorna lista de invoice_months com saldo > 0 (não pagos) para o cartão
        function getUnpaidInvoiceMonths(card) {
            const info = {};
            appState.transactions.filter(t => t.card_id === card.id).forEach(t => {
                if (!t.invoice_month) return;
                if (!info[t.invoice_month]) info[t.invoice_month] = 0;
                info[t.invoice_month] += t.is_invoice_payment ? -Number(t.val) : Number(t.val);
            });
            return Object.keys(info).filter(m => info[m] > 0.01).sort();
        }

        function getInvoiceBalance(card, invoiceMonth) {
            return appState.transactions
                .filter(t => t.card_id === card.id && t.invoice_month === invoiceMonth)
                .reduce((s, t) => s + (t.is_invoice_payment ? -Number(t.val) : Number(t.val)), 0);
        }

        // ── INVOICE MODAL & PAYMENT ──
        let _currentInvoiceCardId = null;
        let _currentInvoiceMonth = null;

        function openInvoiceModal(cardId, initialMonth = null) {
            const card = appState.cards.find(c => c.id === cardId);
            if (!card) return;
            _currentInvoiceCardId = cardId;
            // Lista todos os invoice_months existentes para esse cartão
            const allMonths = [...new Set(appState.transactions
                .filter(t => t.card_id === cardId && t.invoice_month)
                .map(t => t.invoice_month))].sort();
            const currentInv = currentInvoiceMonthStr(card);
            // Default: mês selecionado ou atual se houver, senão a fatura mais antiga não paga
            const unpaid = getUnpaidInvoiceMonths(card);
            if (initialMonth) {
                _currentInvoiceMonth = initialMonth;
            } else {
                _currentInvoiceMonth = allMonths.includes(currentInv) ? currentInv : (unpaid[0] || allMonths[0] || currentInv);
            }

            document.getElementById('invoice-modal-title').innerText = `Fatura — ${card.name}`;
            renderInvoiceMonthTabs(card, allMonths, unpaid);
            renderInvoiceContent(card);
            document.getElementById('modal-invoice').classList.add('active');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function closeInvoiceModal() {
            document.getElementById('modal-invoice').classList.remove('active');
            _currentInvoiceCardId = null;
            _currentInvoiceMonth = null;
        }

        function renderInvoiceMonthTabs(card, months, unpaid) {
            const wrap = document.getElementById('invoice-month-tabs');
            const sel = document.getElementById('invoice-month-select');
            if (!months.length) {
                if (wrap) wrap.innerHTML = '';
                if (sel) sel.innerHTML = '<option>Sem faturas</option>';
                return;
            }
            // Ordena: aberta primeiro, depois fechadas em aberto, depois pagas (descendente por mês)
            const currentInv = currentInvoiceMonthStr(card);
            const sorted = [...months].sort((a, b) => {
                if (a === currentInv) return -1;
                if (b === currentInv) return 1;
                const aUnpaid = unpaid.includes(a), bUnpaid = unpaid.includes(b);
                if (aUnpaid !== bUnpaid) return aUnpaid ? -1 : 1;
                return b.localeCompare(a);
            });

            // Dropdown completo (TODAS as faturas, inclusive quitadas)
            if (sel) {
                sel.innerHTML = sorted.map(m => {
                    const [y, mo] = m.split('-');
                    const label = new Date(y, mo - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                    const balance = getInvoiceBalance(card, m);
                    const isUnpaid = unpaid.includes(m);
                    const status = m === currentInv ? '🟣 Em aberto' : (isUnpaid ? '🔴 Em atraso' : '✅ Quitada');
                    return `<option value="${m}" ${m === _currentInvoiceMonth ? 'selected' : ''}>${label.charAt(0).toUpperCase() + label.slice(1)} — ${status} (${fmtBRL(Math.abs(balance))})</option>`;
                }).join('');
            }

            // Tabs rápidas: só mostra abertas + atrasadas (pagas ficam só no dropdown)
            const tabsToShow = sorted.filter(m => unpaid.includes(m) || m === currentInv);
            wrap.innerHTML = tabsToShow.map(m => {
                const [y, mo] = m.split('-');
                const label = new Date(y, mo - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                const isActive = m === _currentInvoiceMonth;
                const isUnpaid = unpaid.includes(m);
                const isCurrent = m === currentInv;
                const balance = getInvoiceBalance(card, m);
                let style = 'padding:6px 12px; font-size:0.75rem;';
                if (isUnpaid && !isCurrent && !isActive) style += 'border-color:var(--danger); color:var(--danger);';
                if (isCurrent && !isActive) style += 'border-color:var(--accent); color:var(--accent);';
                return `<button class="toggle-btn ${isActive ? 'active' : ''}" style="${style}" onclick="selectInvoiceMonth('${m}')">
                    ${label}${isCurrent ? ' (aberta)' : ''} · ${fmtBRL(balance)}
                </button>`;
            }).join('');
        }

        function selectInvoiceMonth(m) {
            _currentInvoiceMonth = m;
            const card = appState.cards.find(c => c.id === _currentInvoiceCardId);
            const allMonths = [...new Set(appState.transactions.filter(t => t.card_id === card.id && t.invoice_month).map(t => t.invoice_month))].sort();
            const unpaid = getUnpaidInvoiceMonths(card);
            renderInvoiceMonthTabs(card, allMonths, unpaid);
            renderInvoiceContent(card);
        }

        function renderInvoiceContent(card) {
            const txs = appState.transactions
                .filter(t => t.card_id === card.id && t.invoice_month === _currentInvoiceMonth)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            const balance = getInvoiceBalance(card, _currentInvoiceMonth);
            const hasPayments = txs.some(t => t.is_invoice_payment);
            document.getElementById('invoice-total').innerText = fmtBRL(Math.max(0, balance));

            const payBtn = document.getElementById('btn-pay-invoice');
            const reverseBtn = document.getElementById('btn-reverse-invoice');
            payBtn.style.display = 'inline-flex';
            if (balance > 0.01) {
                payBtn.disabled = false;
                payBtn.innerHTML = '<i data-lucide="check-circle"></i> Pagar Fatura';
            } else {
                payBtn.disabled = true;
                payBtn.innerHTML = '<i data-lucide="check"></i> Fatura quitada';
            }
            // Mostra estornar quando há pelo menos um pagamento registrado nesta fatura
            reverseBtn.style.display = hasPayments ? 'inline-flex' : 'none';

            const tbody = document.getElementById('invoice-tx-rows');
            if (!txs.length) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">Sem transações nesta fatura.</td></tr>`;
                return;
            }
            tbody.innerHTML = txs.map(t => {
                const cat = appState.categories.find(c => c.name === t.category);
                const icon = cat ? cat.icon : '💳';
                const date = new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                const isPay = t.is_invoice_payment;
                const valColor = isPay ? 'var(--accent-2)' : 'var(--danger)';
                const sign = isPay ? '−' : '';
                const installmentBadge = (t.installment_total > 1) ? ` <span style="font-size:0.7rem; color:var(--text-muted);">(${t.installment_num}/${t.installment_total})</span>` : '';
                // Pagamentos de fatura não podem ser excluídos individualmente (use "Estornar Pagamento")
                const actionBtn = isPay
                    ? `<span title="Use 'Estornar Pagamento' acima" style="color:var(--text-muted); cursor:not-allowed;"><i data-lucide="lock" style="width:14px; height:14px;"></i></span>`
                    : `<button class="icon-action danger" onclick="deleteCardTxFromInvoice('${t.id}')" title="Excluir lançamento" style="border:none; background:transparent; cursor:pointer; padding:4px;"><i data-lucide="trash-2" style="width:16px; height:16px; color:var(--danger);"></i></button>`;
                return `<tr style="border-bottom:1px solid var(--border);">
                    <td style="padding:8px;">${date}</td>
                    <td style="padding:8px;">${isPay ? '💸 Pagamento' : (t.description || '-')}${installmentBadge}</td>
                    <td style="padding:8px;">${icon} ${t.category || (isPay ? 'Pagamento de fatura' : '-')}</td>
                    <td style="padding:8px; text-align:right; font-weight:700; color:${valColor};">${sign}${fmtBRL(Number(t.val))}</td>
                    <td style="padding:8px; text-align:center;">${actionBtn}</td>
                </tr>`;
            }).join('');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function openPayInvoicePrompt() {
            const card = appState.cards.find(c => c.id === _currentInvoiceCardId);
            if (!card) return;
            const balance = getInvoiceBalance(card, _currentInvoiceMonth);
            if (balance <= 0.01) return showToast('Esta fatura já está quitada.', 'info');
            document.getElementById('pay-invoice-amount').value = balance.toFixed(2);
            const accSel = document.getElementById('pay-invoice-account');
            accSel.innerHTML = appState.accounts.map(a => `<option value="${a.name}">${a.name} (${fmtBRL(Number(a.balance))})</option>`).join('');
            // Pré-seleciona conta padrão do cartão, se houver
            if (card.default_payment_account && appState.accounts.some(a => a.name === card.default_payment_account)) {
                accSel.value = card.default_payment_account;
            }
            document.getElementById('modal-pay-invoice').classList.add('active');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function closePayInvoiceModal() { document.getElementById('modal-pay-invoice').classList.remove('active'); }

        async function confirmPayInvoice() {
            const card = appState.cards.find(c => c.id === _currentInvoiceCardId);
            if (!card) return;
            const amount = parseFloat(document.getElementById('pay-invoice-amount').value);
            const accName = document.getElementById('pay-invoice-account').value;
            if (!amount || !accName) return showToast('Selecione a conta!', 'error');

            // ── VALIDAÇÃO DE SALDO ──
            const acc = appState.accounts.find(a => a.name === accName);
            if (acc && Number(acc.balance) < amount) {
                return showToast(`Saldo insuficiente! A conta "${accName}" tem ${fmtBRL(Number(acc.balance))} e a fatura é ${fmtBRL(amount)}.`, 'error');
            }

            // Cria transação de pagamento (transferência): is_invoice_payment=true
            // type='expense' para que afete o saldo da conta bancária; mas é filtrado dos relatórios.
            const payTx = {
                user_id: appState.user.id,
                date: new Date().toISOString().split('T')[0],
                val: amount,
                category: 'Pagamento de Fatura',
                account: accName,
                description: `Pagamento fatura ${card.name} (${_currentInvoiceMonth})`,
                type: 'expense',
                regime: 'Variável',
                occurrence: 'Única',
                card_id: card.id,
                invoice_month: _currentInvoiceMonth,
                is_invoice_payment: true
            });

            // ── Atualização OTIMISTA: aplica localmente antes do round-trip pro servidor ──
            const tempId = 'tmp-' + Date.now();
            const optimisticTx = { ...payTx, id: tempId, created_at: new Date().toISOString() };
            appState.transactions.push(optimisticTx);
            const prevBal = acc ? Number(acc.balance) : null;
            if (acc) acc.balance = Number(acc.balance) - amount;

            // Re-renderiza imediatamente o dashboard e o card pra dar feedback instantâneo
            closePayInvoiceModal();
            showToast('Fatura paga com sucesso!');
            refreshCardStatusEverywhere(card);

            // Persiste no Supabase
            const { data: inserted, error } = await _supabase.from('transactions').insert(payTx).select().single();
            if (error) {
                // Rollback otimista
                appState.transactions = appState.transactions.filter(t => t.id !== tempId);
                if (acc && prevBal !== null) acc.balance = prevBal;
                refreshCardStatusEverywhere(card);
                return showToast('Erro ao pagar fatura: ' + error.message, 'error');
            }
            // Substitui o id temporário pelo id real
            const idx = appState.transactions.findIndex(t => t.id === tempId);
            if (idx >= 0 && inserted) appState.transactions[idx] = inserted;

            // Atualiza saldo da conta bancária no servidor (em paralelo com o restante)
            if (acc) {
                _supabase.from('accounts').update({ balance: acc.balance }).eq('id', acc.id).then(() => { });
            }

            // Sincroniza em background pra reconciliar qualquer divergência
            syncAllData().then(() => refreshCardStatusEverywhere(card));
        }

        // Reaproveitado: re-renderiza tudo que mostra status de cartão/fatura
        function refreshCardStatusEverywhere(card) {
            try { if (typeof renderDashCardsSummary === 'function') renderDashCardsSummary(); } catch (e) { }
            try { if (typeof renderInvoiceAlerts === 'function') renderInvoiceAlerts(); } catch (e) { }
            try { if (typeof renderCardsTab === 'function') renderCardsTab(); } catch (e) { }
            if (card && _currentInvoiceCardId === card.id) {
                try {
                    const allMonths = [...new Set(appState.transactions.filter(t => t.card_id === card.id && t.invoice_month).map(t => t.invoice_month))].sort();
                    if (typeof renderInvoiceMonthTabs === 'function') renderInvoiceMonthTabs(card, allMonths, getUnpaidInvoiceMonths(card));
                    if (typeof renderInvoiceContent === 'function') renderInvoiceContent(card);
                } catch (e) { }
            }
        }

        // Estorna APENAS o pagamento mais recente da fatura selecionada — devolve o dinheiro
        // pra conta de origem. Para estornar pagamentos anteriores, é preciso clicar de novo
        // (sempre o último primeiro). Isso garante uma ordem cronológica reversa.
        async function reverseInvoicePayment() {
            const card = appState.cards.find(c => c.id === _currentInvoiceCardId);
            if (!card) return;
            const payments = appState.transactions.filter(t =>
                t.card_id === card.id && t.invoice_month === _currentInvoiceMonth && t.is_invoice_payment
            );
            if (!payments.length) return showToast('Não há pagamentos para estornar.', 'info');

            // Ordena do mais recente pro mais antigo (created_at DESC, fallback id/date)
            const sorted = [...payments].sort((a, b) => {
                const ka = a.created_at || a.date || '';
                const kb = b.created_at || b.date || '';
                if (kb !== ka) return kb.localeCompare(ka);
                return String(b.id).localeCompare(String(a.id));
            });
            const latest = sorted[0];
            const remaining = sorted.length - 1;

            const dateStr = latest.date ? new Date(latest.date + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
            const extra = remaining > 0
                ? `\n\nAinda restarão ${remaining} pagamento(s) anterior(es). Para estorná-los, clique novamente em "Estornar Pagamento" — sempre do mais recente para o mais antigo.`
                : '\n\nEste é o único pagamento desta fatura. Após o estorno, a fatura voltará a ficar em aberto.';

            openConfirmModal(
                'Estornar último pagamento',
                `Estornar o pagamento de ${fmtBRL(Number(latest.val))} feito em ${dateStr} da conta "${latest.account}"?${extra}`,
                async () => {
                    const acc = appState.accounts.find(a => a.name === latest.account);
                    if (acc) {
                        const newBal = Number(acc.balance) + Number(latest.val);
                        await _supabase.from('accounts').update({ balance: newBal }).eq('id', acc.id);
                    }
                    await _supabase.from('transactions').delete().eq('id', latest.id);
                    showToast(remaining > 0
                        ? `Pagamento estornado. Restam ${remaining} pagamento(s) — clique de novo se quiser estornar o anterior.`
                        : 'Pagamento estornado. Fatura reaberta para edição.');
                    await syncAllData();
                    renderInvoiceContent(card);
                    const allMonths = [...new Set(appState.transactions.filter(t => t.card_id === card.id && t.invoice_month).map(t => t.invoice_month))].sort();
                    renderInvoiceMonthTabs(card, allMonths, getUnpaidInvoiceMonths(card));
                    renderCardsTab();
                }
            );
        }

        // Excluir transação direto do extrato da fatura (com proteção e atualização da fatura)
        async function deleteCardTxFromInvoice(txId) {
            const tx = appState.transactions.find(t => t.id === txId);
            if (!tx) return;
            if (isCardTxOnPaidInvoice(tx)) {
                const card = appState.cards.find(c => c.id === tx.card_id);
                showToast(`Esta despesa pertence à fatura paga (${tx.invoice_month}). Estorne o pagamento primeiro com o botão "Estornar Pagamento".`, 'error');
                return;
            }
            const desc = (tx.description && tx.description !== '-') ? tx.description : tx.category;
            openConfirmModal(
                'Excluir lançamento da fatura',
                `Excluir "${desc}" no valor de ${fmtBRL(Number(tx.val))}?${tx.installment_total > 1 ? `\n\n⚠️ Esta é a parcela ${tx.installment_num}/${tx.installment_total}. As demais parcelas continuarão nas faturas seguintes — exclua-as separadamente se quiser remover todas.` : ''}`,
                async () => {
                    const { error } = await _supabase.from('transactions').delete().eq('id', txId);
                    if (error) return showToast('Erro ao excluir: ' + error.message, 'error');
                    showToast('Lançamento excluído!');
                    await syncAllData();
                    const card = appState.cards.find(c => c.id === tx.card_id);
                    if (card && _currentInvoiceCardId === card.id) {
                        const allMonths = [...new Set(appState.transactions.filter(t => t.card_id === card.id && t.invoice_month).map(t => t.invoice_month))].sort();
                        renderInvoiceMonthTabs(card, allMonths, getUnpaidInvoiceMonths(card));
                        renderInvoiceContent(card);
                    }
                    renderCardsTab();
                }
            );
        }

        // Verifica se uma transação de cartão pertence a uma fatura já paga (proteção contra exclusão direta)
        function isCardTxOnPaidInvoice(tx) {
            if (!tx.card_id || tx.is_invoice_payment) return false;
            const balance = appState.transactions
                .filter(t => t.card_id === tx.card_id && t.invoice_month === tx.invoice_month)
                .reduce((s, t) => s + (t.is_invoice_payment ? -Number(t.val) : Number(t.val)), 0);
            const hasPayment = appState.transactions.some(t =>
                t.card_id === tx.card_id && t.invoice_month === tx.invoice_month && t.is_invoice_payment
            );
            return hasPayment && balance < 0.01;
        }

        function renderCardsTab() {
            const grid = document.getElementById('cards-grid');
            if (!grid) return;
            if (!appState.cards.length) {
                grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
                    <i data-lucide="credit-card" style="width:48px;height:48px;opacity:0.4;"></i>
                    <p>Nenhum cartão cadastrado.</p>
                    <button class="btn btn-primary" onclick="openCardModal()" style="margin-top:12px;">
                        <i data-lucide="plus"></i> Adicionar Primeiro Cartão
                    </button>
                </div>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }

            // Mês atual para o filtro padrão
            const now = new Date();
            const defaultMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
            const defaultMonthLabel = now.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});

            grid.innerHTML = appState.cards.map((c, i) => {
                const info = getCardInvoiceInfo(c);
                const usedPct = c.credit_limit > 0 ? Math.min(100,(info.totalUsed/Number(c.credit_limit))*100) : 0;
                const barColor = 'linear-gradient(90deg, var(--accent), #f9a8d4)';
                const currentMonthStr = defaultMonth;
                const isPaidCurrentMonth = (appState.cards.find(cc=>cc.id===c.id)?.paid_invoices||[]).includes(currentMonthStr);
                const overlayHtml = isPaidCurrentMonth ? '<div class="invoice-paid-overlay" style="position:absolute;top:14px;right:14px;width:28px;height:28px;background:#10B981;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(16,185,129,0.4);pointer-events:none;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>' : '';

                return `
                <div class="card" style="padding:0; display:flex; flex-wrap:nowrap; align-items:stretch; gap:24px; border:none; border-radius:28px; box-shadow:0 12px 40px rgba(0,0,0,0.06); background:var(--bg-panel); transition:transform 0.2s; overflow:hidden; position:relative;">
                    
                    <!-- Bloco Colorido Esquerdo (Simulando Cartão Real Premium) -->
                    <div class="card-slide-new" style="width:300px; min-height:190px; background-color:${c.color}; background-image:linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 35%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.4) 100%); border-radius:24px; box-shadow:12px 0 32px -8px rgba(0,0,0,0.2), inset 1px 1px 1px rgba(255,255,255,0.3); display:flex; flex-direction:column; justify-content:space-between; padding:24px 28px; color:white; flex-shrink:0; position:relative; overflow:hidden; animation-delay: ${i * 0.2}s; z-index:2;">
                        
                        <!-- Textura Matte (Plástico Premium) -->
                        <div style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0.15; mix-blend-mode:overlay; pointer-events:none; background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E');"></div>
                        
                        <!-- Efeitos de Brilho e Reflexo 3D -->
                        <div style="position:absolute; top:-30%; left:-10%; width:150%; height:60%; background:linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 100%); transform:rotate(-15deg); pointer-events:none;"></div>
                        <div style="position:absolute; bottom:-40%; right:-20%; width:100%; height:100%; background:radial-gradient(circle at bottom right, rgba(0,0,0,0.2) 0%, transparent 60%); pointer-events:none;"></div>

                        <div class="bc-top" style="position:relative; z-index:1;">
                            <div class="bc-chip"></div>
                            <div class="bc-mc-logo">
                                <div class="bc-mc-circles"><span></span><span></span></div>
                                <div class="bc-mc-label">MASTERCARD</div>
                            </div>
                        </div>

                        <!-- Número do Cartão -->
                        <div class="bc-number" style="font-size: 1.25rem; letter-spacing: 6px; opacity:0.85; position:relative; z-index:1; margin-top:16px;">
                            .... .... .... ${c.last4 || '0000'}
                        </div>

                        <!-- Rodapé do Cartão -->
                        <div class="bc-footer" style="position:relative; z-index:1; margin-top:auto;">
                            <div class="bc-stack">
                                <div class="bc-holder-label">Card Holder</div>
                                <div class="bc-holder-name" style="text-shadow:0 1px 2px rgba(0,0,0,0.3);">${appState.user?.name ? appState.user.name.split(' ')[0].toUpperCase() : 'LB FINANCE'}</div>
                            </div>
                            <div class="bc-stack" style="align-items:flex-end">
                                <div class="bc-exp-label">${c.bank ? c.bank.toUpperCase() : 'BANCO'}</div>
                                <div class="bc-exp-val" style="text-shadow:0 1px 2px rgba(0,0,0,0.3);">${c.due_day.toString().padStart(2,'0')}/29</div>
                            </div>
                        </div>
                    </div>

                    <!-- Detalhes Direita -->
                    <div style="flex:1; padding:24px 32px 24px 8px; display:flex; flex-direction:column; justify-content:space-between; min-width:280px;">
                        
                        <!-- Header & Ações -->
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                            <div style="font-size:1.6rem; font-weight:800; color:var(--text-main); letter-spacing:-0.5px; line-height:1;">
                                ${c.name}
                            </div>
                            
                            <!-- Menu "+" de ações & Filtro -->
                            <div style="display:flex; gap:12px; align-items:center;" onclick="event.stopPropagation()">
                                
                                <div style="display:flex;align-items:center;justify-content:space-between;background:#f8faff;border:1px solid var(--accent);border-radius:999px;padding:4px 8px;margin:0;transition:all 0.15s;"
                                     onmouseenter="this.style.boxShadow='0 0 0 3px rgba(224,29,142,0.15)'"
                                     onmouseleave="this.style.borderColor='var(--accent)'; this.style.boxShadow='none'"
                                     onmousedown="this.style.transform='scale(0.97)'"
                                     onmouseup="this.style.transform='scale(1)'">
                                    <button onclick="changeCardMonth('${c.id}', -1)" style="border:none;background:transparent;cursor:pointer;padding:4px;color:var(--text-muted);display:flex;align-items:center;justify-content:center;border-radius:50%;transition:0.15s;" onmouseenter="this.style.background='rgba(224,29,142,0.1)';this.style.color='var(--accent)'" onmouseleave="this.style.background='transparent';this.style.color='var(--text-muted)'">
                                        <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
                                    </button>
                                    <span id="card-month-label-${c.id}" data-val="${defaultMonth}" style="font-size:0.75rem;font-weight:700;color:var(--text-main);user-select:none;text-transform:capitalize;margin:0 8px;transition:0.15s;">${defaultMonthLabel}</span>
                                    <button onclick="changeCardMonth('${c.id}', 1)" style="border:none;background:transparent;cursor:pointer;padding:4px;color:var(--text-muted);display:flex;align-items:center;justify-content:center;border-radius:50%;transition:0.15s;" onmouseenter="this.style.background='rgba(224,29,142,0.1)';this.style.color='var(--accent)'" onmouseleave="this.style.background='transparent';this.style.color='var(--text-muted)'">
                                        <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
                                    </button>
                                </div>
                                
                                <div style="position:relative;">
                                    <button id="card-menu-btn-${i}" onclick="event.stopPropagation(); toggleCardMenu(${i})"
                                        style="width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.03);border:none;color:var(--text-main);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.15s;"
                                        onmouseenter="this.style.background='rgba(0,0,0,0.08)'" onmouseleave="this.style.background='rgba(0,0,0,0.03)'">
                                        <i data-lucide="plus" style="width:18px;height:18px;"></i>
                                    </button>
                                    <div id="card-menu-${i}" style="display:none; flex-direction:column; gap:2px; position:absolute; top:44px; right:0; background:white; border-radius:12px; box-shadow:0 8px 28px rgba(0,0,0,0.12); padding:6px; z-index:9999; animation:fadeInUp 0.15s ease;">
                                        <div onclick="event.stopPropagation(); closecardMenu(${i}); openCardModal(${i})"
                                            style="width:38px;height:38px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-main);transition:background 0.12s;"
                                            onmouseenter="this.style.background='#f1f5f9'" onmouseleave="this.style.background='transparent'"
                                            title="Editar">
                                            <i data-lucide="edit-2" style="width:16px;height:16px;"></i>
                                        </div>
                                        <div onclick="event.stopPropagation(); closecardMenu(${i}); deleteCard(${i})"
                                            style="width:38px;height:38px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-main);transition:background 0.12s;"
                                            onmouseenter="this.style.background='#f1f5f9'" onmouseleave="this.style.background='transparent'"
                                            title="Excluir">
                                            <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Progress -->
                        <div style="margin-bottom:16px;">
                            <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:10px;">
                                <span style="color:#94a3b8; font-weight:500;">Uso do Limite: <span style="font-weight:700; color:var(--text-main);">${fmtBRL(info.totalUsed)}</span> <span style="color:#94a3b8; font-weight:500;">/ ${fmtBRL(Number(c.credit_limit))}</span></span>
                                <span style="font-weight:800; color:var(--accent);">${usedPct.toFixed(0)}%</span>
                            </div>
                            <div class="progress-track" style="height:10px; background:#f1f5f9; border-radius:5px; position:relative; overflow:visible;">
                                <!-- Brilho lateral igual à imagem -->
                                <div style="position:absolute; left:-12px; top:-8px; bottom:-8px; width:30px; background:radial-gradient(ellipse at center, rgba(224,29,142,0.2) 0%, transparent 70%); border-radius:50%; pointer-events:none;"></div>
                                <div class="progress-fill" style="width:${usedPct}%; background:${barColor}; border-radius:5px; position:relative; z-index:1;"></div>
                            </div>
                        </div>

                        <!-- Faturas & Pagar -->
                        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:auto;">
                            <div style="display:flex; gap:32px;">
                                <div>
                                    <div style="font-size:0.65rem; color:#64748B; text-transform:uppercase; font-weight:800; letter-spacing:0.5px; line-height:1.4;">ABERTA<br>(VENCE DIA ${c.due_day})</div>
                                    <div id="card-open-val-${c.id}" style="font-size:1.3rem; font-weight:800; color:#0f172a; margin-top:4px; letter-spacing:-0.5px;">${fmtBRL(info.open)}</div>
                                </div>
                                <div>
                                    <div style="font-size:0.65rem; color:#64748B; text-transform:uppercase; font-weight:800; letter-spacing:0.5px; line-height:1.4;">FECHADA<br>&nbsp;</div>
                                    <div id="card-closed-val-${c.id}" style="font-size:1.3rem; font-weight:800; color:var(--accent); margin-top:4px; letter-spacing:-0.5px;">${fmtBRL(info.closed)}</div>
                                </div>
                            </div>
                            <div style="flex-shrink:0; display:flex; gap:10px;">
                                <button id="card-pay-btn-${c.id}"
                                    onclick="event.stopPropagation(); payInvoiceFromCard('${c.id}', document.getElementById('card-month-label-${c.id}').getAttribute('data-val'))"
                                    style="height:40px;border-radius:999px;border:none;background:${isPaidCurrentMonth ? '#10B981' : 'var(--accent)'};color:white;font-size:0.8rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.15s;padding:0 16px;box-shadow:0 4px 14px rgba(224,29,142,0.3);"
                                    onmouseenter="this.style.filter='brightness(1.1)'"
                                    onmouseleave="this.style.filter='none'"
                                    onmousedown="this.style.transform='scale(0.95)'"
                                    onmouseup="this.style.transform='scale(1)'">
                                    <i data-lucide="${isPaidCurrentMonth ? 'check' : 'check-circle'}" style="width:14px;height:14px;"></i> ${isPaidCurrentMonth ? 'Pago ✔' : 'Pagar'}
                                </button>
                                <button onclick="event.stopPropagation(); openCardHistoryModal('${c.id}', document.getElementById('card-month-label-${c.id}').getAttribute('data-val'))"
                                    style="height:40px;border-radius:999px;border:1px solid var(--accent);background:transparent;color:var(--text-main);font-size:0.8rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.15s;padding:0 16px;"
                                    onmouseenter="this.style.color='var(--accent)';this.style.background='rgba(224,29,142,0.05)'"
                                    onmouseleave="this.style.borderColor='var(--accent)';this.style.color='var(--text-main)';this.style.background='transparent'"
                                    onmousedown="this.style.transform='scale(0.95)'"
                                    onmouseup="this.style.transform='scale(1)'">
                                    <i data-lucide="list" style="width:14px;height:14px;"></i> Histórico
                                </button>
                            </div>
                        </div>
                    </div>
                    ${overlayHtml}
                </div>`;
            }).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Fecha menus ao clicar fora
            document.addEventListener('click', function _cardMenuClose(e) {
                appState.cards.forEach((_,i) => {
                    const menu = document.getElementById(`card-menu-${i}`);
                    const btn  = document.getElementById(`card-menu-btn-${i}`);
                    if (menu && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
                        menu.style.display = 'none';
                    }
                });
            });
        }

        function toggleCardMenu(i) {
            const menu = document.getElementById(`card-menu-${i}`);
            if (!menu) return;
            menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
        }

        function closecardMenu(i) {
            const menu = document.getElementById(`card-menu-${i}`);
            if (menu) menu.style.display = 'none';
        }

        function changeCardMonth(cardId, offset) {
            const labelEl = document.getElementById(`card-month-label-${cardId}`);
            if (!labelEl) return;
            let currentVal = labelEl.getAttribute('data-val');
            let [y, m] = currentVal.split('-').map(Number);

            m += offset;
            if (m < 1) { m = 12; y--; }
            if (m > 12) { m = 1; y++; }

            const newVal = `${y}-${String(m).padStart(2, '0')}`;
            const dateObj = new Date(y, m - 1, 1);
            const newLabel = dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

            labelEl.setAttribute('data-val', newVal);
            labelEl.textContent = newLabel.charAt(0).toUpperCase() + newLabel.slice(1);

            renderCardRow(cardId, newVal);
            
            // Re-render icons se existirem botões dentro
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function renderCardRow(cardId, monthVal) {
            const card = appState.cards.find(c => c.id === cardId);
            if (!card) return;
            
            const txs = appState.transactions.filter(t =>
                t.card_id === cardId && !t.is_invoice_payment &&
                t.invoice_month === monthVal
            );
            const isPaid = (card.paid_invoices || []).includes(monthVal);
            const open   = isPaid ? 0 : txs.reduce((s,t) => s+Number(t.val), 0);
            const closed = isPaid ? txs.reduce((s,t) => s+Number(t.val), 0) : 0;
            
            const openEl   = document.getElementById(`card-open-val-${cardId}`);
            const closedEl = document.getElementById(`card-closed-val-${cardId}`);
            const payBtn   = document.getElementById(`card-pay-btn-${cardId}`);
            if (openEl)   openEl.textContent = fmtBRL(open);
            if (closedEl) closedEl.textContent = fmtBRL(closed);
            if (payBtn) {
                if (isPaid) {
                    payBtn.style.background = '#10B981';
                    payBtn.innerHTML = '✔ Pago';
                    payBtn.onclick = (e) => { e.stopPropagation(); };
                } else {
                    payBtn.style.background = 'var(--accent)';
                    payBtn.innerHTML = '✓ Pagar';
                    payBtn.onclick = (e) => { e.stopPropagation(); payInvoiceFromCard(cardId, monthVal); };
                }
            }

            // Atualiza o overlay de "Fatura Quitada" no card
            const cardEl = payBtn ? payBtn.closest('.card') : null;
            if (cardEl) {
                let overlay = cardEl.querySelector('.invoice-paid-overlay');
                if (isPaid && !overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'invoice-paid-overlay';
                    overlay.style.cssText = 'position:absolute;top:14px;right:14px;width:28px;height:28px;background:#10B981;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(16,185,129,0.4);pointer-events:none;';
                    overlay.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                    cardEl.appendChild(overlay);
                } else if (!isPaid && overlay) {
                    overlay.remove();
                }
            }
        }

        function openCardHistoryModal(cardId, monthVal) {
            const card = appState.cards.find(c => c.id === cardId);
            if (!card) return;
            const [y, m] = (monthVal || '').split('-').map(Number);
            const txs = appState.transactions.filter(t =>
                t.card_id === cardId && !t.is_invoice_payment &&
                t.invoice_month === monthVal
            ).sort((a,b) => new Date(b.date) - new Date(a.date));

            const monthLabel = y && m ? new Date(y, m-1, 1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}) : 'Todos';
            const total = txs.reduce((s,t)=>s+Number(t.val),0);

            const rows = txs.length ? txs.map(t => {
                const cat = appState.categories.find(c => c.name === t.category);
                const d = new Date(t.date+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});
                return `<tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:16px 20px 16px 32px; width:50px;"><span style="font-size:1.4rem;">${cat?.icon||'💳'}</span></td>
                    <td style="padding:16px 0;">
                        <div style="font-weight:700;font-size:1rem;color:var(--text-main); margin-bottom:2px;">${(t.description && t.description.trim() !== '-' && t.description.trim() !== '') ? t.description : t.category}</div>
                        <div style="font-size:0.85rem;font-weight:500;color:var(--text-muted);">${t.category||''}</div>
                    </td>
                    <td style="padding:16px 32px;text-align:right;white-space:nowrap;">
                        <div style="font-weight:800;font-size:1.05rem;color:var(--accent); margin-bottom:2px;">− ${fmtBRL(Number(t.val))}</div>
                        <div style="font-size:0.85rem;font-weight:500;color:var(--text-muted);">${d}</div>
                    </td>
                </tr>`;
            }).join('') : `<tr><td colspan="3" style="text-align:center;padding:32px;color:var(--text-muted);">Nenhuma transação neste mês.</td></tr>`;

            const monthLabelFmt = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
            document.getElementById('card-hist-title').innerHTML = `<span style="background:linear-gradient(135deg,var(--accent),#f9a8d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${card.name}</span><span style="color:var(--text-muted);font-weight:500;font-size:1.1rem;margin-left:10px;">·</span><span style="color:var(--text-muted);font-size:1.1rem;font-weight:700;margin-left:8px;">${monthLabelFmt}</span>`;
            document.getElementById('card-hist-count').textContent = `${txs.length} lançamento${txs.length!==1?'s':''}`;

            document.getElementById('card-hist-body').innerHTML       = rows;

            const isPaid = (card.paid_invoices || []).includes(monthVal);
            let footerHtml = `
                <div>
                   <div style="font-size:0.75rem; color:#64748b; font-weight:800; text-transform:uppercase; margin-bottom:2px;">TOTAL DA FATURA</div>
                   <div style="font-size:1.8rem; font-weight:800; color:var(--accent); letter-spacing:-0.5px; line-height:1.2;">${fmtBRL(total)}</div>
                </div>
                <div style="display:flex; gap:12px; align-items:center;">
            `;

            if (isPaid) {
                footerHtml += `
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
                        <div style="display:flex;align-items:center;gap:8px;padding:0 20px;height:44px;font-size:0.95rem;font-weight:800;border-radius:12px;background:#10B98118;color:#10B981;border:1.5px solid #10B98140;">
                            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>
                            Fatura Quitada
                        </div>
                        <button onclick="_currentInvoiceCardId='${cardId}';_currentInvoiceMonth='${monthVal}';reverseInvoicePayment()" style="padding:0 16px;height:36px;font-size:0.82rem;font-weight:700;border-radius:10px;background:rgba(244,63,94,0.06);color:var(--danger);border:1px solid rgba(244,63,94,0.2);cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.15s;" onmouseenter="this.style.background='rgba(244,63,94,0.12)'" onmouseleave="this.style.background='rgba(244,63,94,0.06)'" onmousedown="this.style.transform='scale(0.97)'" onmouseup="this.style.transform='scale(1)'">
                            <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='1 4 1 10 7 10'/><path d='M3.51 15a9 9 0 1 0 .49-3.51'/></svg>
                            Estornar Pagamento
                        </button>
                    </div>
                `;
            } else {
                footerHtml += `
                    <button onclick="closeCardHistoryModal(); payInvoiceFromCard('${cardId}', '${monthVal}')" style="padding:0 32px; height:44px; font-size:0.95rem; font-weight:800; border-radius:12px; background:linear-gradient(135deg, var(--accent), var(--accent-2)); color:white; border:none; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 4px 14px rgba(224,29,142,0.3); transition:all 0.15s;" onmouseenter="this.style.transform='translateY(-1px)'" onmouseleave="this.style.transform='translateY(0)'" onmousedown="this.style.transform='scale(0.97)'" onmouseup="this.style.transform='scale(1)'">
                        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg> Pagar Fatura
                    </button>
                `;
            }
            footerHtml += `</div>`;
            document.getElementById('card-hist-footer').innerHTML = footerHtml;
            document.getElementById('modal-card-history').classList.add('active');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function closeCardHistoryModal() {
            document.getElementById('modal-card-history').classList.remove('active');
        }


        // ── HISTORY TABLE ──
        function populateHistoryFilters() {
            const catEl = document.getElementById('hist-cat');
            if (catEl) catEl.innerHTML = '<option value="">Todas</option>' + appState.categories.map(c => `<option value="${c.name}">${c.icon} ${c.name}</option>`).join('');

            const accEl = document.getElementById('hist-acc');
            if (accEl) accEl.innerHTML = '<option value="">Todas</option>' + appState.accounts.map(a => `<option value="${a.name}">${a.name}</option>`).join('');

            const monthEl = document.getElementById('hist-month');
            if (monthEl) {
                const months = [...new Set(appState.transactions.map(t => t.date.slice(0, 7)))].sort().reverse();
                monthEl.innerHTML = '<option value="">Todos os meses</option>' + months.map(m => {
                    const [y, mo] = m.split('-');
                    const label = new Date(y, mo - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                    return `<option value="${m}">${label.charAt(0).toUpperCase() + label.slice(1)}</option>`;
                }).join('');
            }
            // Inicializa os dropdowns modernos (só executa uma vez por elemento)
            ['hist-type', 'hist-cat', 'hist-acc', 'hist-month'].forEach(id => initModernSelect(id));
        }

        function clearHistoryFilters() {
            const ids = ['hist-search', 'hist-type', 'hist-cat', 'hist-acc', 'hist-month'];
            ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            renderHistoryTable();
        }


        let onConfirmCallback = null;
        function openConfirmModal(title, msg, callback, type = 'danger') {
            document.getElementById('confirm-title').innerText = title;
            document.getElementById('confirm-msg').innerText = msg;
            onConfirmCallback = callback;
            const btn = document.getElementById('confirm-btn-action');
            const iconBox = document.getElementById('confirm-icon-box');

            if (type === 'danger') {
                btn.style.background = 'var(--danger)';
                btn.style.borderColor = 'var(--danger)';
                btn.innerText = 'Excluir';
                iconBox.style.background = 'rgba(244,63,94,0.1)';
                iconBox.style.color = 'var(--danger)';
            } else {
                btn.style.background = 'var(--accent)';
                btn.style.borderColor = 'var(--accent)';
                btn.innerText = 'Confirmar';
                iconBox.style.background = 'rgba(124,58,237,0.1)';
                iconBox.style.color = 'var(--accent)';
            }

            document.getElementById('modal-confirm').classList.add('active');
            if (window.lucide) window.lucide.createIcons();
        }

        function closeConfirmModal() {
            document.getElementById('modal-confirm').classList.remove('active');
            onConfirmCallback = null;
        }

        // Attach click event to the confirmation button
        window.addEventListener('DOMContentLoaded', () => {
            const btn = document.getElementById('confirm-btn-action');
            if (btn) {
                btn.onclick = () => {
                    if (onConfirmCallback) onConfirmCallback();
                    closeConfirmModal();
                });
            }
        });

        let txToDelete = null;

        function deleteTx(id) {
            const tx = appState.transactions.find(t => t.id === id);
            // Bloqueia exclusão de despesa em fatura já paga (ou parcialmente paga)
            if (tx && isCardTxOnPaidInvoice(tx)) {
                const card = appState.cards.find(c => c.id === tx.card_id);
                showToast(`Esta despesa pertence à fatura de ${card?.name || 'cartão'} (${tx.invoice_month}) que já foi paga. Estorne o pagamento na aba Cartões antes de excluir.`, 'error');
                return;
            }
            openConfirmModal(
                'Excluir Movimentação',
                'Tem certeza que deseja apagar esse registro? Esta ação não pode ser desfeita.',
                async () => {
                    try {
                        await _supabase.from('transactions').delete().eq('id', id);
                        appState.transactions = appState.transactions.filter(t => t.id !== id);
                        updateUI();
                        renderHistoryTable(true);
                        showToast('Movimentação excluída com sucesso!', 'success');
                    } catch (err) {
                        console.error('Erro ao excluir:', err);
                        showToast('Erro ao excluir lançamento.', 'error');
                    }
                }
            );
        }





        function renderHistoryTable(skipPopulate = false) {
            const savedCat = document.getElementById('hist-cat')?.value || '';
            const savedAcc = document.getElementById('hist-acc')?.value || '';
            const savedMonth = document.getElementById('hist-month')?.value || '';

            if (!skipPopulate) populateHistoryFilters();

            if (savedCat) document.getElementById('hist-cat').value = savedCat;
            if (savedAcc) document.getElementById('hist-acc').value = savedAcc;
            if (savedMonth) document.getElementById('hist-month').value = savedMonth;

            const search = (document.getElementById('hist-search')?.value || '').toLowerCase();
            const typeFilter = document.getElementById('hist-type')?.value || '';
            const catFilter = document.getElementById('hist-cat')?.value || '';
            const accFilter = document.getElementById('hist-acc')?.value || '';
            const monthFilter = document.getElementById('hist-month')?.value || '';

            let txs = [...appState.transactions];

            if (search) txs = txs.filter(t => (t.description || '').toLowerCase().includes(search) || t.category.toLowerCase().includes(search));
            if (typeFilter) txs = txs.filter(t => t.type === typeFilter);
            if (catFilter) txs = txs.filter(t => t.category === catFilter);
            if (accFilter) txs = txs.filter(t => t.account === accFilter);
            if (monthFilter) {
                const [y, m] = monthFilter.split('-').map(Number);
                txs = txs.filter(t => { const d = new Date(t.date); return d.getUTCFullYear() === y && (d.getUTCMonth() + 1) === m; });
            }

            const tbody = document.getElementById('history-rows');
            if (txs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:48px; color:var(--text-muted);">Nenhuma transação encontrada.</td></tr>`;
                return;
            }

            tbody.innerHTML = txs.map(t => {
                let icon = '💳';
                let catName = t.category || '--';
                let formattedType = t.type === 'income' ? '↑ Entrada' : (t.goal_id ? '🎯 Meta' : '↓ Saída');

                if (t.goal_id) {
                    const goalObj = appState.goals.find(g => g.id === t.goal_id);
                    if (goalObj) {
                        icon = goalObj.icon || '🎯';
                        catName = `Meta: ${goalObj.name}`;
                    } else {
                        catName = "Meta Excluída";
                    }
                } else {
                    const cat = appState.categories.find(c => c.name === t.category);
                    if (cat) icon = cat.icon;
                }

                const isInc = t.type === 'income';
                return `<tr>
                <td>${new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                <td><span class="chip ${t.type}">${formattedType}</span></td>
                <td style="color:var(--text-main); font-weight:500;">${(t.description && t.description !== '-') ? t.description : catName}</td>
                <td>${icon} ${catName}</td>

                <td>${t.account}</td>
                <td style="text-align:right; font-weight:800; font-family:'Outfit',sans-serif; color:${isInc ? 'var(--accent-2)' : 'var(--danger)'};">${isInc ? '+' : '-'} ${fmtBRL(Number(t.val))}</td>
                <td><div class="icon-action danger" onclick="deleteTx('${t.id}')"><i data-lucide="trash-2"></i></div></td>
            </tr>`;
            }).join('');
            lucide.createIcons();
        }

        // ── GOALS & METAS ──
        function openGoalModal(index = null) {
            appState.editingGoalIndex = index;
            document.getElementById('goal-modal-title').innerText = index !== null ? 'Editar Meta' : 'Nova Meta Financeira';

            if (index !== null) {
                const g = appState.goals[index];
                document.getElementById('goal-name').value = g.name;
                document.getElementById('goal-target').value = g.target_amount;
                document.getElementById('goal-deadline').value = g.deadline || '';
                selIcon = g.icon;
                selColor = g.color;
            } else {
                document.getElementById('goal-name').value = '';
                document.getElementById('goal-target').value = '';
                document.getElementById('goal-deadline').value = '';
                selIcon = '🎯';
                selColor = '#4E3CFA';
            }

            renderGoalIconPicker();
            document.getElementById('modal-goal').classList.add('active');
        }

        function closeGoalModal() {
            document.getElementById('modal-goal').classList.remove('active');
        }

        function renderGoalIconPicker() {
            const icons = ["🎯", "🏠", "🚗", "✈️", "💰", "🎓", "💍", "📱", "💻", "🎮", "🎸", "🍹", "🏥", "👶", "🐶"];
            document.getElementById('goal-icon-picker').innerHTML = icons.map(i =>
                `<div class="pick-item ${i === selIcon ? 'active' : ''}" onclick="selIcon='${i}';renderGoalIconPicker()">${i}</div>`
            ).join('');
            document.getElementById('goal-color-picker').innerHTML = COLORS_SET.map(c =>
                `<div class="pick-color ${c === selColor ? 'active' : ''}" style="background:${c}" onclick="selColor='${c}';renderGoalIconPicker()"></div>`
            ).join('');
        }

        async function saveGoalAction() {
            const name = document.getElementById('goal-name').value;
            const target = parseFloat(document.getElementById('goal-target').value);
            const deadline = document.getElementById('goal-deadline').value;

            if (!name || isNaN(target)) return showToast('Preencha os campos obrigatórios!', 'error');

            const goal = {
                user_id: appState.user.id,
                name,
                target_amount: target,
                deadline: deadline || null,
                icon: selIcon,
                color: selColor,
                status: 'active'
            });

            try {
                if (appState.editingGoalIndex !== null) {
                    const id = appState.goals[appState.editingGoalIndex].id;
                    const { error } = await _supabase.from('goals').update(goal).eq('id', id);
                    if (error) throw error;
                    showToast('Meta atualizada com sucesso!');
                } else {
                    const { error } = await _supabase.from('goals').insert([goal]);
                    if (error) throw error;
                    showToast('Meta criada com sucesso! 🚀');
                }
                closeGoalModal();
                await syncAllData();
                renderMetasTab();
            } catch (err) {
                if (err.code === '42P01') {
                    showToast('Erro: Tabela de Metas não encontrada! Cole o script SQL no Supabase e tente novamente.', 'error');
                } else {
                    showToast('Erro ao salvar meta: ' + err.message, 'error');
                }
            }
        }

        function renderMetasTab() {
            const grid = document.getElementById('goals-grid');
            const activeGoals = appState.goals.filter(g => g.status === 'active');

            // Calcular totais
            const totalSaved = appState.transactions
                .filter(t => !!t.goal_id)
                .reduce((s, t) => s + Number(t.val), 0);

            document.getElementById('goals-total-saved').innerText = fmtBRL(totalSaved);
            document.getElementById('goals-active-count').innerText = activeGoals.length;

            if (activeGoals.length === 0) {
                grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>Você ainda não tem metas ativas.</p></div>';
                return;
            }

            grid.innerHTML = activeGoals.map((g, i) => {
                const saved = appState.transactions
                    .filter(t => t.goal_id === g.id)
                    .reduce((s, t) => s + Number(t.val), 0);

                const progress = Math.min((saved / g.target_amount) * 100, 100);
                const remaining = Math.max(g.target_amount - saved, 0);
                const phase = progress >= 100 ? 4 : progress >= 75 ? 3 : progress >= 50 ? 2 : progress >= 25 ? 1 : 0;

                const today = new Date();
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(today.getMonth() - 3);
                const recentDeposits = appState.transactions
                    .filter(t => t.goal_id === g.id && new Date(t.date) >= threeMonthsAgo);
                const monthlyAvg = recentDeposits.length > 0
                    ? recentDeposits.reduce((s, t) => s + Number(t.val), 0) / 3 : 0;
                let timeEstimate = "Indefinido";
                if (monthlyAvg > 0 && remaining > 0) {
                    const months = Math.ceil(remaining / monthlyAvg);
                    timeEstimate = months > 12 ? `${(months / 12).toFixed(1)} anos` : `${months} mes${months > 1 ? 'es' : ''}`;
                }
                if (progress >= 100) timeEstimate = "Concluída! 🎉";

                const deadline = g.deadline
                    ? new Date(g.deadline + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
                    : null;

                return `
            <div style="
                background: #fff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                border: 1px solid rgba(0,0,0,0.06);
                display: flex;
                flex-direction: column;
                position: relative;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            " onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 28px rgba(0,0,0,0.1)'"
               onmouseleave="this.style.transform='';this.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'">

                <!-- Header colorido -->
                <div style="
                    background: linear-gradient(135deg, ${g.color}22 0%, ${g.color}0a 100%);
                    border-bottom: 1px solid ${g.color}20;
                    padding: 20px 20px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                ">
                    <div style="display:flex; gap:14px; align-items:center;">
                        <div style="
                            width: 52px; height: 52px;
                            border-radius: 16px;
                            background: ${g.color}18;
                            border: 1.5px solid ${g.color}30;
                            display: flex; align-items: center; justify-content: center;
                            font-size: 1.6rem;
                            flex-shrink: 0;
                        ">${g.icon}</div>
                        <div>
                            <div style="font-weight: 800; font-size: 1rem; color: var(--text-main); margin-bottom: 3px;">${g.name}</div>
                            <div style="font-size: 0.72rem; color: var(--text-sub); font-weight: 600;">
                                Alvo: <span style="color:${g.color}; font-weight:700;">${fmtBRL(g.target_amount)}</span>
                                ${deadline ? `&nbsp;·&nbsp;${deadline}` : ''}
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; gap:4px;">
                        <div class="icon-action" onclick="openGoalModal(${i})" style="width:30px;height:30px;"><i data-lucide="edit-3" style="width:14px;height:14px;"></i></div>
                        <div class="icon-action danger" onclick="deleteGoal('${g.id}')" style="width:30px;height:30px;"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></div>
                    </div>
                </div>

                <!-- Corpo -->
                <div style="padding: 20px; flex:1; display:flex; flex-direction:column; gap:16px;">

                    <!-- Progresso -->
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px;">
                            <div>
                                <span style="font-family:'Outfit',sans-serif; font-size:1.35rem; font-weight:900; color:var(--text-main);">${fmtBRL(saved)}</span>
                                <span style="font-size:0.75rem; color:var(--text-sub); margin-left:4px;">acumulados</span>
                            </div>
                            <span style="font-family:'Outfit',sans-serif; font-size:1.15rem; font-weight:900; color:${g.color};">${progress.toFixed(0)}%</span>
                        </div>
                        <div style="height:8px; background:${g.color}15; border-radius:50px; overflow:hidden;">
                            <div style="
                                height:100%; width:${progress}%;
                                background: linear-gradient(90deg, ${g.color}cc, ${g.color});
                                border-radius:50px;
                                box-shadow: 0 0 8px ${g.color}50;
                                transition: width 0.8s ease;
                            "></div>
                        </div>
                        <!-- Fases -->
                        <div style="display:flex; justify-content:space-between; margin-top:6px;">
                            ${['0%', '25%', '50%', '75%', '100%'].map((label, idx) => `
                                <span style="font-size:0.6rem; color:${phase >= idx ? g.color : 'var(--border)'}; font-weight:700;">${label}</span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Stats -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div style="
                            background: var(--bg-deep);
                            border-radius: 14px;
                            padding: 12px 14px;
                            border: 1px solid var(--border);
                        ">
                            <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-sub); margin-bottom:5px;">Faltam</div>
                            <div style="font-family:'Outfit',sans-serif; font-size:0.95rem; font-weight:800; color:${remaining > 0 ? 'var(--text-main)' : '#10B981'};">
                                ${remaining > 0 ? fmtBRL(remaining) : 'Meta atingida!'}
                            </div>
                        </div>
                        <div style="
                            background: var(--bg-deep);
                            border-radius: 14px;
                            padding: 12px 14px;
                            border: 1px solid var(--border);
                        ">
                            <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-sub); margin-bottom:5px;">Estimativa</div>
                            <div style="font-family:'Outfit',sans-serif; font-size:0.95rem; font-weight:800; color:var(--text-main);">${timeEstimate}</div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="
                    padding: 14px 20px;
                    border-top: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    background: var(--bg-deep);
                ">
                    <button onclick="redeemGoal('${g.id}', ${saved})" style="
                        display: inline-flex; align-items: center; gap: 7px;
                        background: linear-gradient(135deg, ${g.color}, ${g.color}cc);
                        color: white;
                        border: none; cursor: pointer;
                        padding: 8px 18px;
                        border-radius: 50px;
                        font-size: 0.8rem;
                        font-weight: 700;
                        font-family: 'Inter', sans-serif;
                        box-shadow: 0 4px 14px ${g.color}40;
                        transition: opacity 0.2s ease, transform 0.2s ease;
                    " onmouseenter="this.style.opacity='0.88';this.style.transform='scale(1.04)'"
                       onmouseleave="this.style.opacity='1';this.style.transform=''">
                        <i data-lucide="wallet" style="width:14px;height:14px;"></i>
                        Resgatar
                    </button>
                </div>

                ${phase === 4 ? `
                <div style="position:absolute;top:14px;right:-28px;background:linear-gradient(135deg,#F59E0B,#FBBF24);color:#000;padding:4px 44px;transform:rotate(45deg);font-size:0.6rem;font-weight:900;letter-spacing:1.5px;box-shadow:0 2px 8px rgba(245,158,11,0.4);">✦ CONCLUÍDA</div>
                ` : ''}
            </div>
            `;
            }).join('');

            // Disparar confetti se acabou de subir de fase (exemplo simples: verifica no dashboard se mudou)
            // updateNextReachEstimation();
            lucide.createIcons();
        }

        async function deleteGoal(id) {
            if (confirm('Deseja excluir esta meta? Todas as transações vinculadas continuarão no histórico, mas perderão a marcação da meta.')) {
                await _supabase.from('goals').delete().eq('id', id);
                await syncAllData();
                renderMetasTab();
                showToast('Meta removida.');
            }
        }

        let _redeemPending = null;

        function redeemGoal(id, amount) {
            if (amount <= 0) return showToast('Você ainda não tem saldo nesta meta para resgatar!', 'warning');
            const goal = appState.goals.find(g => g.id === id);
            _redeemPending = { id, amount };
            document.getElementById('redeem-confirm-goal-name').textContent = `${goal?.icon || '🎯'} ${goal?.name || 'Meta'}`;
            document.getElementById('redeem-confirm-amount').textContent = fmtBRL(amount);
            document.getElementById('modal-redeem-confirm').classList.add('active');
            lucide.createIcons();
        }

        function maybeShowShortcutTip() {
            const key = 'lb_shortcut_tip_dismissed';
            if (localStorage.getItem(key)) return;
            const banner = document.getElementById('shortcut-tip-banner');
            if (banner) {
                banner.style.display = 'flex';
                lucide.createIcons();
            }
        }

        function dismissShortcutTip() {
            localStorage.setItem('lb_shortcut_tip_dismissed', '1');
            const banner = document.getElementById('shortcut-tip-banner');
            if (!banner) return;
            banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-8px)';
            setTimeout(() => { banner.style.display = 'none'; }, 300);
        }

        function closeRedeemConfirmModal() {
            document.getElementById('modal-redeem-confirm').classList.remove('active');
            _redeemPending = null;
        }

        async function confirmRedeemGoal() {
            if (!_redeemPending) return;
            const { id, amount } = _redeemPending;
            const btn = document.getElementById('redeem-confirm-btn');
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader"></i> Processando...';
            lucide.createIcons();
            try {
                const goal = appState.goals.find(g => g.id === id);
                const tx = {
                    user_id: appState.user.id,
                    date: new Date().toISOString().split('T')[0],
                    val: amount,
                    category: 'Resgate de Meta',
                    account: appState.accounts[0]?.name || 'Conta Principal',
                    description: `Resgate: Meta ${goal?.name || ''}`,
                    type: 'income',
                    regime: 'Variável',
                    occurrence: 'Única'
                });
                await _supabase.from('transactions').insert([tx]);
                await _supabase.from('goals').update({ status: 'redeemed' }).eq('id', id);
                closeRedeemConfirmModal();
                showToast('Saldo resgatado com sucesso! 🎉');
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                await syncAllData();
                switchTab('dashboard');
            } catch (err) {
                showToast('Erro ao resgatar meta: ' + err.message, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i data-lucide="check-circle"></i> Confirmar Resgate';
                lucide.createIcons();
            }
        }

        // ── FORMAT ──
        function fmtBRL(v) {
            return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        // ── BUDGET ──
        async function renderBudgetTab() {
            const filterVal = document.getElementById('budget-month-filter').value;
            if (!filterVal) return;
            const [year, month] = filterVal.split('-').map(Number);

            const filteredTx = appState.transactions.filter(t => {
                const d = new Date(t.date);
                return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
            });

            const cats = appState.categories.filter(c => c.type === 'expense');
            let totalLimit = 0, totalSpent = 0;

            const rows = cats.map(c => {
                const spent = filteredTx.filter(t => t.category === c.name && !t.is_invoice_payment).reduce((s, t) => s + Number(t.val), 0);
                totalLimit += Number(c.budget);
                totalSpent += spent;

                const p = c.budget > 0 ? (spent / c.budget) * 100 : 0;
                const diff = Number(c.budget) - spent;

                let statusBadge = `<span class="chip" style="background:var(--accent-light); color:var(--accent); font-weight:700;">OK</span>`;
                if (p > 100) statusBadge = '<span class="chip expense">Excedido</span>';
                else if (p > 85) statusBadge = '<span class="chip" style="background:var(--warning-light); color:var(--warning)">Atenção</span>';

                const barColor = p > 100 ? 'var(--danger)' : p > 85 ? 'var(--warning)' : 'var(--accent)';

                return `<tr>
                <td style="cursor:pointer;" onclick="scrollToHistoryFilter('${c.name}')">

                    <div style="display:flex; align-items:center; gap:10px;">
                        <span>${c.icon}</span>
                        <span style="font-weight:600; color:var(--text-main)">${c.name}</span>
                    </div>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div style="font-size:0.875rem;">
                        ${fmtBRL(spent)} de 
                        <span class="editable-limit" onclick="makeLimitEditable(event, '${c.id}')" style="border-bottom:1px dashed var(--accent); cursor:pointer;">${fmtBRL(Number(c.budget))}</span>
                    </div>
                </td>
                <td>
                    <div class="progress-track" style="height:6px;">
                        <div class="progress-fill" style="width:${Math.min(p, 100)}%; background:${barColor};"></div>
                    </div>
                </td>
                <td style="text-align:right; font-weight:700; color:${diff < 0 ? 'var(--danger)' : 'var(--text-sub)'}">${fmtBRL(diff)}</td>
            </tr>`;
            }).join('');

            document.getElementById('budget-rows').innerHTML = rows;
            document.getElementById('b-total-limit').innerText = fmtBRL(totalLimit);
            document.getElementById('b-total-spent').innerText = fmtBRL(totalSpent);
            
            const avail = totalLimit - totalSpent;
            const availEl = document.getElementById('b-total-avail');
            const availStatus = document.getElementById('b-avail-status');
            const availIconBg = document.getElementById('b-avail-icon-bg');
            
            availEl.innerText = fmtBRL(avail);
            availEl.style.color = '#0f172a';
            if (avail < 0) {
                availStatus.innerText = 'Orçamento ultrapassado!';
                availStatus.style.color = 'var(--danger)';
            } else {
                availStatus.innerText = 'Saldo livre para gastos';
                availStatus.style.color = 'var(--text-muted)';
            }

            const totalP = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
            const totalBar = document.getElementById('b-total-progress');
            totalBar.style.width = Math.min(totalP, 100) + '%';

            // Projeção corrigida: Fixos contam 100%, Variáveis são projetados pelo ritmo diário
            const now = new Date();
            const daysInMonth = new Date(year, month, 0).getDate();
            const elapsedDays = (year === now.getFullYear() && month === (now.getMonth() + 1)) ? now.getDate() : daysInMonth;

            const fixedExpenses = filteredTx.filter(t => t.regime === 'Fixo' && t.type !== 'income' && !t.goal_id);
            const varExpenses = filteredTx.filter(t => t.regime !== 'Fixo' && t.type !== 'income' && !t.goal_id);
            const totalFixed = fixedExpenses.reduce((s, t) => s + Number(t.val), 0);
            const totalVar = varExpenses.reduce((s, t) => s + Number(t.val), 0);
            const varProjection = (totalVar / Math.max(1, elapsedDays)) * daysInMonth;
            const consumedPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
            const remainingDays = daysInMonth - elapsedDays;
            const alertBox = document.getElementById('budget-projection-alert');

            // Mostrar se consumiu > 80% ou se a projeção indica estouro
            if ((consumedPct > 80 || projection > totalLimit) && totalLimit > 0) {
                alertBox.style.display = 'block';
                document.getElementById('projection-text').innerHTML = `Atenção! Você já consumiu <span style="color:var(--accent); font-weight:900;">${consumedPct.toFixed(0)}%</span> do seu orçamento total e ainda faltam <span style="font-weight:900;">${remainingDays} dias</span> para o mês acabar.`;
            } else {
                alertBox.style.display = 'none';
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function makeLimitEditable(event, catId) {
            const el = event.target;
            const currentVal = el.innerText.replace(/[^\d,-]/g, '').replace(',', '.');
            const input = document.createElement('input');
            input.type = 'number';
            input.value = currentVal;
            input.style.width = '80px';
            input.style.padding = '4px 8px';
            input.style.borderRadius = '4px';

            const saveLimit = async () => {
                const newVal = parseFloat(input.value) || 0;
                const { error } = await _supabase.from('categories').update({ budget: newVal }).eq('id', catId);
                if (error) showToast('Erro ao atualizar limite.', 'error');
                else {
                    await syncAllData();
                    renderBudgetTab();
                    showToast('Limite atualizado!');
                }
            });

            input.onblur = saveLimit;
            input.onkeydown = (e) => { if (e.key === 'Enter') saveLimit(); };

            el.parentElement.replaceChild(input, el);
            input.focus();
        }

        // ── REPORTS ──
        const _reportsCharts = {}; // { key: ChartInstance }
        function _destroyChart(key) {
            if (_reportsCharts[key]) { try { _reportsCharts[key].destroy(); } catch (e) { } delete _reportsCharts[key]; }
        }
        function _txInMonth(year, month) {
            return appState.transactions.filter(t => {
                const d = new Date(t.date);
                return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month && !t.is_invoice_payment;
            });
        }
        function _prevMonth(year, month) {
            return month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
        }
        const _R_TOOLTIP = {
            backgroundColor: '#020117', titleColor: '#fff', bodyColor: '#9B8FFF',
            borderColor: 'rgba(78,60,250,0.3)', borderWidth: 1, padding: 12,
            cornerRadius: 10, displayColors: true, boxWidth: 10, boxHeight: 10
        });

        function setReportsView(view) {
            appState.reportsView = view;
            ['overview', 'income', 'expense'].forEach(v => {
                const el = document.getElementById('reports-view-' + v);
                if (el) el.style.display = (v === view) ? '' : 'none';
                const btn = document.getElementById('rv-btn-' + v);
                if (btn) {
                    const isActive = v === view;
                    let cls = 'toggle-btn' + (isActive ? ' active' : '');
                    if (v === 'income') cls += isActive ? ' income' : '';
                    if (v === 'expense') cls += isActive ? ' expense' : '';
                    btn.className = cls;
                }
            });
            renderReportsTab();
        }

        async function renderReportsTab() {
            const filterVal = document.getElementById('reports-month-filter').value;
            if (!filterVal || !filterVal.includes('-')) return;
            const [year, month] = filterVal.split('-').map(Number);

            const txs = _txInMonth(year, month);
            const prev = _prevMonth(year, month);
            const txsPrev = _txInMonth(prev.y, prev.m);

            const inc = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.val), 0);
            const exp = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.val), 0);
            const bal = inc - exp;
            const savings = inc > 0 ? ((inc - exp) / inc) * 100 : 0;
            const incPrev = txsPrev.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.val), 0);
            const expPrev = txsPrev.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.val), 0);

            // Top cards
            document.getElementById('r-total-income').innerText = fmtBRL(inc);
            document.getElementById('r-total-expense').innerText = fmtBRL(exp);
            document.getElementById('r-balance').innerText = fmtBRL(bal);
            document.getElementById('r-savings-rate').innerText = `${savings.toFixed(1)}%`;
            document.getElementById('r-tx-count').innerText = String(txs.length);
            document.getElementById('r-tx-avg').innerText = txs.length ? `Ticket médio: ${fmtBRL((inc + exp) / txs.length)}` : '—';

            const trend = (cur, prev, goodWhenUp = true) => {
                if (prev === 0) {
                    return { text: cur > 0 ? '▲ vs mês anterior' : '— vs mês anterior', cls: 'trend-flat' };
                }
                const diff = ((cur - prev) / prev) * 100;
                const sign = diff >= 0 ? '▲ +' : '▼ ';
                const isUp = diff >= 0;
                const positive = goodWhenUp ? isUp : !isUp;
                return {
                    text: `${sign}${Math.abs(diff).toFixed(1)}% vs mês anterior`,
                    cls: Math.abs(diff) < 0.05 ? 'trend-flat' : (positive ? 'trend-up' : 'trend-down')
                });
            });
            const applyTrend = (id, t) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.innerText = t.text;
                el.className = 'stat-footer ' + t.cls;
            });
            applyTrend('r-income-trend', trend(inc, incPrev, true));
            applyTrend('r-expense-trend', trend(exp, expPrev, false));
            applyTrend('r-balance-trend', trend(bal, incPrev - expPrev, true));
            document.getElementById('r-savings-bar').innerText = savings >= 20 ? '🟢 Excelente' : savings >= 10 ? '🟡 Razoável' : savings >= 0 ? '🟠 Apertado' : '🔴 Negativo';

            // Top categoria
            const expByCat = {};
            txs.filter(t => t.type === 'expense').forEach(t => {
                expByCat[t.category] = (expByCat[t.category] || 0) + Number(t.val);
            });
            const topCatEntry = Object.entries(expByCat).sort((a, b) => b[1] - a[1])[0];
            document.getElementById('r-top-cat').innerText = topCatEntry ? topCatEntry[0] : '-';
            document.getElementById('r-top-cat-val').innerText = topCatEntry ? fmtBRL(topCatEntry[1]) : '—';

            // Roteamento por view
            if (appState.reportsView === 'overview') renderReportsOverview(year, month, txs, txsPrev, inc, exp, incPrev, expPrev);
            else if (appState.reportsView === 'income') renderReportsIncome(txs);
            else if (appState.reportsView === 'expense') renderReportsExpense(txs, txsPrev);

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function renderReportsOverview(year, month, txs, txsPrev, inc, exp, incPrev, expPrev) {
            // Fluxo Diário (linha)
            const daysInMonth = new Date(year, month, 0).getDate();
            const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));
            const incPerDay = new Array(daysInMonth).fill(0);
            const expPerDay = new Array(daysInMonth).fill(0);
            txs.forEach(t => {
                const day = new Date(t.date).getUTCDate();
                if (t.type === 'income') incPerDay[day - 1] += Number(t.val);
                else if (t.type === 'expense') expPerDay[day - 1] += Number(t.val);
            });
            _destroyChart('flow');
            _reportsCharts.flow = new Chart(document.getElementById('chart-reports-flow'), {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        { label: 'Receitas', data: incPerDay, borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)', tension: 0.35, fill: true, pointRadius: 0, borderWidth: 2 },
                        { label: 'Despesas', data: expPerDay, borderColor: '#F43F5E', backgroundColor: 'rgba(244,63,94,0.15)', tension: 0.35, fill: true, pointRadius: 0, borderWidth: 2 }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { ..._R_TOOLTIP, callbacks: { label: ctx => `  ${ctx.dataset.label}: ${fmtBRL(ctx.parsed.y)}` } } },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                        y: { ticks: { callback: v => 'R$ ' + (v / 1000).toFixed(1) + 'k' }, grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                }
            });

            // Comparativo (barras agrupadas)
            _destroyChart('compare');
            _reportsCharts.compare = new Chart(document.getElementById('chart-reports-compare'), {
                type: 'bar',
                data: {
                    labels: ['Receitas', 'Despesas', 'Saldo'],
                    datasets: [
                        { label: 'Mês Anterior', data: [incPrev, expPrev, incPrev - expPrev], backgroundColor: 'rgba(155,143,255,0.55)', borderRadius: 8 },
                        { label: 'Mês Atual', data: [inc, exp, inc - exp], backgroundColor: 'rgba(78,60,250,0.85)', borderRadius: 8 }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { ..._R_TOOLTIP, callbacks: { label: ctx => `  ${ctx.dataset.label}: ${fmtBRL(ctx.parsed.y)}` } } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { ticks: { callback: v => 'R$ ' + (v / 1000).toFixed(1) + 'k' }, grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                }
            });

            // Despesas por dia da semana
            const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const expPerWeekday = new Array(7).fill(0);
            txs.filter(t => t.type === 'expense').forEach(t => {
                const wd = new Date(t.date).getUTCDay();
                expPerWeekday[wd] += Number(t.val);
            });
            _destroyChart('weekday');
            _reportsCharts.weekday = new Chart(document.getElementById('chart-reports-weekday'), {
                type: 'bar',
                data: {
                    labels: weekdayLabels,
                    datasets: [{ label: 'Gasto', data: expPerWeekday, backgroundColor: 'var(--accent-2)', borderRadius: 8, barThickness: 28 }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { ..._R_TOOLTIP, callbacks: { label: ctx => `  ${fmtBRL(ctx.parsed.y)}` } } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { ticks: { callback: v => 'R$ ' + (v / 1000).toFixed(1) + 'k' }, grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                }
            });

            // Saúde Financeira
            const savings = inc > 0 ? ((inc - exp) / inc) * 100 : 0;
            const fixedExp = txs.filter(t => t.type === 'expense' && t.regime === 'Fixo').reduce((s, t) => s + Number(t.val), 0);
            const varExp = exp - fixedExp;
            const fixedPct = exp > 0 ? (fixedExp / exp) * 100 : 0;
            const expVsInc = inc > 0 ? (exp / inc) * 100 : 0;
            const dailyAvgExp = exp / new Date(year, month, 0).getDate();

            const indicators = [
                { label: 'Taxa de Economia', value: `${savings.toFixed(1)}%`, hint: savings >= 20 ? 'Excelente' : savings >= 10 ? 'Bom' : savings >= 0 ? 'Apertado' : 'Negativo', color: savings >= 20 ? '#10B981' : savings >= 0 ? '#F59E0B' : '#F43F5E' },
                { label: 'Despesa Fixa / Total', value: `${fixedPct.toFixed(1)}%`, hint: `${fmtBRL(fixedExp)} de ${fmtBRL(exp)}`, color: 'var(--accent)' },
                { label: 'Comprometimento', value: `${expVsInc.toFixed(1)}%`, hint: expVsInc <= 70 ? 'Saudável' : expVsInc <= 90 ? 'Atenção' : 'Alto risco', color: expVsInc <= 70 ? '#10B981' : expVsInc <= 90 ? '#F59E0B' : '#F43F5E' },
                { label: 'Gasto Médio Diário', value: fmtBRL(dailyAvgExp), hint: 'Considerando o mês todo', color: 'var(--accent-2)' }
            ];
            document.getElementById('reports-health').innerHTML = indicators.map(i => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid rgba(0,0,0,0.06);">
                    <div>
                        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${i.label}</div>
                        <div style="font-size:0.7rem; color:var(--text-sub); margin-top:2px;">${i.hint}</div>
                    </div>
                    <div style="font-size:1.1rem; font-weight:800; color:${i.color};">${i.value}</div>
                </div>
            `).join('');
        }

        function renderReportsIncome(txs) {
            const incTxs = txs.filter(t => t.type === 'income');

            // Por categoria (barra horizontal)
            const cats = appState.categories.filter(c => c.type === 'income');
            const catLabels = [], catData = [], catColors = [];
            cats.forEach(c => {
                const total = incTxs.filter(t => t.category === c.name).reduce((s, t) => s + Number(t.val), 0);
                if (total > 0) { catLabels.push(c.name); catData.push(total); catColors.push(c.color || '#10B981'); }
            });
            _destroyChart('incCat');
            _reportsCharts.incCat = new Chart(document.getElementById('chart-reports-inc-cat'), {
                type: 'bar',
                data: { labels: catLabels, datasets: [{ data: catData, backgroundColor: catColors.map(c => c + 'CC'), borderRadius: 10, barThickness: 22 }] },
                options: {
                    indexAxis: 'y', maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { ..._R_TOOLTIP, callbacks: { label: ctx => `  ${fmtBRL(ctx.parsed.x)}` } } },
                    scales: { x: { ticks: { callback: v => 'R$ ' + (v / 1000).toFixed(1) + 'k' }, grid: { color: 'rgba(0,0,0,0.05)' } }, y: { grid: { display: false } } }
                }
            });

            // Por conta (donut)
            const accAgg = {};
            incTxs.forEach(t => { accAgg[t.account] = (accAgg[t.account] || 0) + Number(t.val); });
            const accLabels = Object.keys(accAgg);
            const accData = Object.values(accAgg);
            const accPalette = ['#10B981', 'var(--accent)', 'var(--accent-2)', '#A855F7', '#C084FC', '#059669', '#F59E0B'];
            _destroyChart('incAcc');
            _reportsCharts.incAcc = new Chart(document.getElementById('chart-reports-inc-acc'), {
                type: 'doughnut',
                data: { labels: accLabels, datasets: [{ data: accData, backgroundColor: accLabels.map((_, i) => accPalette[i % accPalette.length]), borderWidth: 2, borderColor: '#fff' }] },
                options: {
                    maintainAspectRatio: false, cutout: '60%',
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { ..._R_TOOLTIP, callbacks: { label: ctx => `  ${ctx.label}: ${fmtBRL(ctx.parsed)}` } } }
                }
            });

            // Top 5 Receitas
            const top = [...incTxs].sort((a, b) => Number(b.val) - Number(a.val)).slice(0, 5);
            document.getElementById('reports-top-inc').innerHTML = top.length ? top.map(t => {
                const c = appState.categories.find(cat => cat.name === t.category);
                const desc = (t.description && String(t.description).trim() && t.description !== '-') ? t.description : t.category;
                return `<div class="tx-item">
                    <div class="tx-icon">${c ? c.icon : '💰'}</div>
                    <div class="tx-info">
                        <div class="tx-desc">${desc}</div>
                        <div class="tx-meta">${t.category} • ${new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                    </div>
                    <div class="tx-amount" style="font-size:0.875rem; font-weight:700; color:#10B981;">+ ${fmtBRL(Number(t.val))}</div>
                </div>`;
            }).join('') : '<div class="tx-empty">Sem receitas neste mês</div>';

            // Estatísticas de receitas
            const total = incTxs.reduce((s, t) => s + Number(t.val), 0);
            const avg = incTxs.length ? total / incTxs.length : 0;
            const max = incTxs.reduce((m, t) => Math.max(m, Number(t.val)), 0);
            const recurring = incTxs.filter(t => t.regime === 'Fixo').reduce((s, t) => s + Number(t.val), 0);
            const stats = [
                { label: 'Total Recebido', value: fmtBRL(total), color: '#10B981' },
                { label: 'Quantidade de Entradas', value: incTxs.length, color: 'var(--accent)' },
                { label: 'Maior Receita Única', value: fmtBRL(max), color: 'var(--accent-2)' },
                { label: 'Receitas Fixas', value: fmtBRL(recurring), color: '#059669' },
                { label: 'Receita Média', value: fmtBRL(avg), color: '#A855F7' }
            ];
            document.getElementById('reports-inc-stats').innerHTML = stats.map(s => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid rgba(0,0,0,0.06);">
                    <span style="font-size:0.8rem; color:var(--text-sub); font-weight:600;">${s.label}</span>
                    <span style="font-size:1rem; font-weight:800; color:${s.color};">${s.value}</span>
                </div>
            `).join('');
        }

        function renderReportsExpense(txs, txsPrev) {
            const expTxs = txs.filter(t => t.type === 'expense');

            // Por categoria (barra horizontal)
            const cats = appState.categories.filter(c => c.type === 'expense');
            const catLabels = [], catData = [], catColors = [];
            cats.forEach(c => {
                const total = expTxs.filter(t => t.category === c.name).reduce((s, t) => s + Number(t.val), 0);
                if (total > 0) { catLabels.push(c.name); catData.push(total); catColors.push(c.color || '#F43F5E'); }
            });
            _destroyChart('expCat');
            _reportsCharts.expCat = new Chart(document.getElementById('chart-reports-exp-cat'), {
                type: 'bar',
                data: { labels: catLabels, datasets: [{ data: catData, backgroundColor: catColors.map(c => c + 'CC'), borderRadius: 10, barThickness: 22 }] },
                options: {
                    indexAxis: 'y', maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { ..._R_TOOLTIP, callbacks: { label: ctx => `  ${fmtBRL(ctx.parsed.x)}` } } },
                    scales: { x: { ticks: { callback: v => 'R$ ' + (v / 1000).toFixed(1) + 'k' }, grid: { color: 'rgba(0,0,0,0.05)' } }, y: { grid: { display: false } } }
                }
            });

            // Por conta (donut)
            const accAgg = {};
            expTxs.forEach(t => { accAgg[t.account] = (accAgg[t.account] || 0) + Number(t.val); });
            const accLabels = Object.keys(accAgg);
            const accData = Object.values(accAgg);
            const accPalette = ['#F43F5E', 'var(--accent)', 'var(--accent-2)', '#A855F7', '#C084FC', '#EA580C', '#DC2626'];
            _destroyChart('expAcc');
            _reportsCharts.expAcc = new Chart(document.getElementById('chart-reports-exp-acc'), {
                type: 'doughnut',
                data: { labels: accLabels, datasets: [{ data: accData, backgroundColor: accLabels.map((_, i) => accPalette[i % accPalette.length]), borderWidth: 2, borderColor: '#fff' }] },
                options: {
                    maintainAspectRatio: false, cutout: '60%',
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { ..._R_TOOLTIP, callbacks: { label: ctx => `  ${ctx.label}: ${fmtBRL(ctx.parsed)}` } } }
                }
            });

            // Top 5 Despesas
            const top = [...expTxs].sort((a, b) => Number(b.val) - Number(a.val)).slice(0, 5);
            document.getElementById('reports-top-exp').innerHTML = top.length ? top.map(t => {
                const c = appState.categories.find(cat => cat.name === t.category);
                const desc = (t.description && String(t.description).trim() && t.description !== '-') ? t.description : t.category;
                return `<div class="tx-item">
                    <div class="tx-icon">${c ? c.icon : '💳'}</div>
                    <div class="tx-info">
                        <div class="tx-desc">${desc}</div>
                        <div class="tx-meta">${t.category} • ${new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                    </div>
                    <div class="tx-amount" style="font-size:0.875rem; font-weight:700; color:#F43F5E;">- ${fmtBRL(Number(t.val))}</div>
                </div>`;
            }).join('') : '<div class="tx-empty">Sem despesas neste mês</div>';

            // Fixo vs Variável (donut)
            const fixedExp = expTxs.filter(t => t.regime === 'Fixo').reduce((s, t) => s + Number(t.val), 0);
            const varExp = expTxs.filter(t => t.regime !== 'Fixo').reduce((s, t) => s + Number(t.val), 0);
            _destroyChart('regime');
            _reportsCharts.regime = new Chart(document.getElementById('chart-reports-regime'), {
                type: 'doughnut',
                data: { labels: ['Fixo', 'Variável'], datasets: [{ data: [fixedExp, varExp], backgroundColor: ['var(--accent)', '#F59E0B'], borderWidth: 2, borderColor: '#fff' }] },
                options: {
                    maintainAspectRatio: false, cutout: '65%',
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { ..._R_TOOLTIP, callbacks: { label: ctx => `  ${ctx.label}: ${fmtBRL(ctx.parsed)}` } } }
                }
            });

            // Comparativo categorias com mês anterior (barras agrupadas)
            const expByCatCur = {}, expByCatPrev = {};
            expTxs.forEach(t => { expByCatCur[t.category] = (expByCatCur[t.category] || 0) + Number(t.val); });
            txsPrev.filter(t => t.type === 'expense').forEach(t => { expByCatPrev[t.category] = (expByCatPrev[t.category] || 0) + Number(t.val); });
            const allCats = [...new Set([...Object.keys(expByCatCur), ...Object.keys(expByCatPrev)])]
                .sort((a, b) => (expByCatCur[b] || 0) - (expByCatCur[a] || 0))
                .slice(0, 8);
            _destroyChart('catCompare');
            _reportsCharts.catCompare = new Chart(document.getElementById('chart-reports-cat-compare'), {
                type: 'bar',
                data: {
                    labels: allCats,
                    datasets: [
                        { label: 'Mês Anterior', data: allCats.map(c => expByCatPrev[c] || 0), backgroundColor: 'rgba(155,143,255,0.55)', borderRadius: 8 },
                        { label: 'Mês Atual', data: allCats.map(c => expByCatCur[c] || 0), backgroundColor: 'rgba(244,63,94,0.85)', borderRadius: 8 }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { ..._R_TOOLTIP, callbacks: { label: ctx => `  ${ctx.dataset.label}: ${fmtBRL(ctx.parsed.y)}` } } },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                        y: { ticks: { callback: v => 'R$ ' + (v / 1000).toFixed(1) + 'k' }, grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                }
            });
        }

        function exportToCSV() {
            const filterVal = document.getElementById('reports-month-filter').value;
            const [year, month] = filterVal.split('-').map(Number);
            const filteredTx = appState.transactions.filter(t => {
                const d = new Date(t.date);
                return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
            });

            if (filteredTx.length === 0) return showToast('Nenhuma transação para exportar!', 'error');

            let csv = 'Data,Tipo,Descricao,Categoria,Conta,Valor\n';
            filteredTx.forEach(t => {
                const date = new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                const type = t.type === 'income' ? 'Receita' : 'Despesa';
                csv += `"${date}","${type}","${t.description}","${t.category}","${t.account}","${Number(t.val).toFixed(2)}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `LB finance_${filterVal}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            document.body.removeChild(link);
        }

        // Lógica Discreta: Expansão por Hover
        function initSidebarHover() {
            const sb = document.querySelector('.sidebar');
            if (!sb) return;

            sb.addEventListener('mouseenter', () => {
                sb.classList.remove('collapsed');
                document.body.classList.remove('sidebar-collapsed');
                localStorage.setItem('sidebar_collapsed', 'false');
                if (window.lucide) window.lucide.createIcons();
                // Redimensionar gráficos
                if (window.mChart) mChart.resize();
                if (window.pChart) pChart.resize();
                if (window.rChart) rChart.resize();
                if (window.cChart) cChart.resize();
            });

            sb.addEventListener('mouseleave', () => {
                sb.classList.add('collapsed');
                document.body.classList.add('sidebar-collapsed');
                localStorage.setItem('sidebar_collapsed', 'true');
                if (window.lucide) window.lucide.createIcons();
                // Redimensionar gráficos
                if (window.mChart) mChart.resize();
                if (window.pChart) pChart.resize();
                if (window.rChart) rChart.resize();
                if (window.cChart) cChart.resize();
            });
        }

        // Auto-executa a inicialização do hover
        initSidebarHover();

        function toggleSidebar() {
            // Mantido para compatibilidade se necessário
            const sb = document.querySelector('.sidebar');
            const isCollapsed = sb.classList.toggle('collapsed');
            document.body.classList.toggle('sidebar-collapsed', isCollapsed);
            localStorage.setItem('sidebar_collapsed', isCollapsed);
            if (window.lucide) window.lucide.createIcons();
            if (window.mChart) mChart.resize();
            if (window.pChart) pChart.resize();
            if (window.rChart) rChart.resize();
            if (window.cChart) cChart.resize();
        }

        function toggleMobileMenu() {
            const sb = document.querySelector('.sidebar');
            sb.classList.toggle('mobile-open');
            if (window.lucide) window.lucide.createIcons();
        }

        // Fechar menu mobile ao clicar fora ou em um link
        document.addEventListener('click', (e) => {
            const sb = document.querySelector('.sidebar');
            const menuBtn = document.querySelector('.menu-toggle');
            const bnMenu = document.getElementById('bn-menu');
            if (window.innerWidth <= 1024 && sb.classList.contains('mobile-open')) {
                if (!sb.contains(e.target) && !menuBtn.contains(e.target) && !(bnMenu && bnMenu.contains(e.target))) {
                    sb.classList.remove('mobile-open');
                }
            }
        });

        // Fechar menu mobile ao trocar de aba
        const originalSwitchTab = switchTab;
        switchTab = async function (id) {
            const sb = document.querySelector('.sidebar');
            if (window.innerWidth <= 1024) {
                sb.classList.remove('mobile-open');
            }
            return originalSwitchTab(id);
        });

        // ── COMPARISON ──
        let cChart;
        async function renderComparisonTab() {
            const valA = document.getElementById('comp-month-a').value;
            const valB = document.getElementById('comp-month-b').value;
            if (!valA || !valB) return;

            const [yA, mA] = valA.split('-').map(Number);
            const [yB, mB] = valB.split('-').map(Number);

            const getSummary = (year, month) => {
                const txs = appState.transactions.filter(t => {
                    const d = new Date(t.date);
                    return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
                });
                const inc = txs.filter(t => t.type === 'income' && !t.is_invoice_payment).reduce((s, t) => s + Number(t.val), 0);
                const exp = txs.filter(t => t.type === 'expense' && !t.is_invoice_payment).reduce((s, t) => s + Number(t.val), 0);
                return { inc, exp, bal: inc - exp, txs };
            });

            const sumA = getSummary(yA, mA);
            const sumB = getSummary(yB, mB);

            const metrics = [
                { label: 'Receita', valA: sumA.inc, valB: sumB.inc, inverse: false },
                { label: 'Despesa', valA: sumA.exp, valB: sumB.exp, inverse: true },
                { label: 'Saldo', valA: sumA.bal, valB: sumB.bal, inverse: false },
                { label: 'Economia %', valA: sumA.inc > 0 ? (sumA.bal / sumA.inc) * 100 : 0, valB: sumB.inc > 0 ? (sumB.bal / sumB.inc) * 100 : 0, inverse: false, isPct: true }
            ];

            document.getElementById('comp-stats-grid').innerHTML = metrics.map(m => {
                const diff = m.valB - m.valA;
                const pct = m.valA !== 0 ? (diff / Math.abs(m.valA)) * 100 : 0;
                const isBetter = m.inverse ? diff < 0 : diff > 0;
                const icon = isBetter ? 'trending-up' : 'trending-down';
                const color = isBetter ? 'var(--accent-2)' : 'var(--danger)';

                return `
            <div class="card stat-card">
                <div class="stat-label">${m.label}</div>
                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:8px;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">A: ${m.isPct ? m.valA.toFixed(1) + '%' : fmtBRL(m.valA)}</div>
                    <div style="font-size:1.25rem; font-weight:800; color:var(--text-main);">${m.isPct ? m.valB.toFixed(1) + '%' : fmtBRL(m.valB)}</div>
                </div>
                <div class="stat-trend" style="color:${color}; margin-top:8px;">
                    <i data-lucide="${icon}"></i>
                    <span>${pct > 0 ? '+' : ''}${pct.toFixed(1)}% de variação</span>
                </div>
            </div>`;
            }).join('');

            // Gráfico de Barras Agrupadas
            const cats = appState.categories.filter(c => c.type === 'expense');
            const labels = [], dataA = [], dataB = [];
            cats.forEach(c => {
                const expA = sumA.txs.filter(t => t.category === c.name && !t.is_invoice_payment).reduce((s, t) => s + Number(t.val), 0);
                const expB = sumB.txs.filter(t => t.category === c.name && !t.is_invoice_payment).reduce((s, t) => s + Number(t.val), 0);
                if (expA > 0 || expB > 0) {
                    labels.push(c.name);
                    dataA.push(expA);
                    dataB.push(expB);
                }
            });

            if (cChart) cChart.destroy();
            cChart = new Chart(document.getElementById('chart-comparison'), {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Período A',
                            data: dataA,
                            backgroundColor: 'rgba(78, 60, 250, 0.75)',
                            borderColor: '#4E3CFA',
                            borderWidth: 0,
                            borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
                            borderSkipped: 'bottom',
                        },
                        {
                            label: 'Período B',
                            data: dataB,
                            backgroundColor: 'rgba(244, 63, 94, 0.65)',
                            borderColor: '#F43F5E',
                            borderWidth: 0,
                            borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
                            borderSkipped: 'bottom',
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    animation: { duration: 600, easing: 'easeOutQuart' },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 20,
                                font: { weight: '700', size: 12 }
                            }
                        },
                        tooltip: {
                            backgroundColor: '#020117',
                            titleColor: '#fff',
                            bodyColor: '#9B8FFF',
                            borderColor: 'rgba(78,60,250,0.3)',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 10,
                            callbacks: { label: ctx => `  ${fmtBRL(ctx.parsed.y)}` }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: { font: { size: 11, weight: '600' } }
                        },
                        y: {
                            grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                            border: { display: false },
                            ticks: { callback: v => 'R$ ' + (v / 1000).toFixed(1) + 'k', font: { size: 11 } }
                        }
                    }
                }
            });

            // Tabela de Variação
            const tableData = labels.map((name, i) => {
                const vA = dataA[i], vB = dataB[i];
                const diff = vB - vA;
                const pct = vA !== 0 ? (diff / vA) * 100 : 100;
                return { name, vA, vB, diff, pct };
            }).sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));

            document.getElementById('comp-rows').innerHTML = tableData.map(d => `
        <tr>
            <td style="font-weight:600; color:var(--text-main);">${d.name}</td>
            <td>${fmtBRL(d.vA)}</td>
            <td>${fmtBRL(d.vB)}</td>
            <td style="text-align:right; font-weight:700; color:var(--accent);">
                ${d.pct > 0 ? '↑' : '↓'} ${Math.abs(d.pct).toFixed(1)}%
            </td>
        </tr>`).join('') || '<tr><td colspan="4" style="text-align:center; padding:20px;">Sem dados</td></tr>';

            lucide.createIcons();
        }
        document.addEventListener('DOMContentLoaded', async () => {
            if (typeof lucide !== 'undefined') lucide.createIcons();
            await checkSession();
            setEntryTab('expense');
            document.getElementById('e-date').valueAsDate = new Date();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        // ── STRIPE ──
        const STRIPE_PUBLIC_KEY = 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX'; // Substitua pela sua chave pública do Stripe
        const stripeObj = typeof Stripe !== 'undefined' ? Stripe(STRIPE_PUBLIC_KEY) : null;

        async function handleSubscribe(planId) {
            if (!stripeObj) {
                showToast('Erro: Biblioteca Stripe não carregada.', 'error');
                return;
            }

            // IDs de Preço do Stripe (Atualizados para os novos valores)
            const PRICE_IDS = {
                pro: 'price_PRO_999_PLACEHOLDER',
                business: 'price_BUSINESS_2499_PLACEHOLDER'
            });

            const priceId = PRICE_IDS[planId];
            const priceLabel = planId === 'pro' ? 'R$ 9,99' : 'R$ 24,99';

            if (priceId.includes('PLACEHOLDER')) {
                showToast(`Plano ${planId.toUpperCase()} (${priceLabel}) selecionado. Configure seu ID no Stripe Dashboard!`, 'warning');
                console.warn(`Configure o ID ${priceId} no Stripe para habilitar pagamentos reais.`);
                return;
            }

            showToast(`Iniciando checkout para o plano ${planId.toUpperCase()} (${priceLabel})...`);
        }

(function () {
            'use strict';
            console.log('[INV] Script carregado');

            // ╔══════════════════════════════════════════════════════════════╗
            // ║  COLE AQUI SEU TOKEN GRATUITO DA BRAPI.DEV                  ║
            // ║  Crie em: https://brapi.dev/dashboard (Login com Google)    ║
            // ║  Plano grátis: 15.000 requisições/mês — compartilhado       ║
            // ║  por todos usuários do app. Upgrade R$9/mês = 1M requests.  ║
            // ╚══════════════════════════════════════════════════════════════╝
            var DEFAULT_BRAPI_TOKEN = ''; // Removido por segurança (Etapa 1)

            var invChartTipo = null, invChartConta = null, invChartRentab = null;

            // Configura legendas elegantes (bolinhas) em TODOS os gráficos do app
            if (typeof Chart !== 'undefined') {
                Chart.defaults.plugins.legend.labels.usePointStyle = true;
                Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
                Chart.defaults.plugins.legend.labels.boxWidth = 8;
                Chart.defaults.plugins.legend.labels.boxHeight = 8;
                Chart.defaults.plugins.legend.labels.padding = 12;
            }
            var _invSelType = 'acoes';
            var _invContaSelColor = 'var(--accent-2)';

            var TYPE_LABELS = { acoes: 'Ações', fiis: 'FIIs', etfs: 'ETFs', bdrs: 'BDRs', crypto: 'Crypto', renda_fixa: 'Renda Fixa', tesouro: 'Tesouro', poupanca: 'Poupança', exterior: 'Exterior', outros: 'Outros' };
            var TYPE_COLORS = { acoes: 'var(--accent)', fiis: '#10B981', etfs: '#F59E0B', bdrs: '#EC4899', crypto: '#3B82F6', renda_fixa: '#D97706', tesouro: '#14B8A6', poupanca: '#6EE7B7', exterior: '#6366F1', outros: '#94A3B8' };
            var CONTA_COLORS = ['var(--accent)', 'var(--accent-2)', '#a78bfa', '#10B981', '#059669', '#3B82F6', '#F59E0B', '#EC4899', '#EF4444', '#14B8A6'];
            var VAR_TYPES = ['acoes', 'fiis', 'etfs', 'bdrs', 'crypto', 'exterior'];

            function fmtBRL(v) { return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
            function fmtPct(v) { var n = Number(v || 0); return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'; }
            function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
            function setText(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
            function setClass(id, c) { var e = document.getElementById(id); if (e) e.className = c; }
            function setVal(id, v) { var e = document.getElementById(id); if (e) e.value = v; }
            function todayISO() { return new Date().toISOString().split('T')[0]; }

            async function fetchCDI() {
                try {
                    var ctrl = new AbortController();
                    var t = setTimeout(function () { ctrl.abort(); }, 6000);
                    var r = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1?formato=json', { signal: ctrl.signal });
                    clearTimeout(t);
                    if (!r.ok) return;
                    var d = await r.json();
                    if (d && d.length) {
                        var m = parseFloat(d[0].valor) / 100;
                        appState.cdiAnual = Math.pow(1 + m, 12) - 1;
                    }
                } catch (e) { console.warn('[INV] CDI falhou:', e.message); }
            }

            function getBrapiToken() {
                // Token do usuário (localStorage) tem prioridade; senão usa o padrão hardcoded
                try {
                    var userToken = localStorage.getItem('brapi_token');
                    if (userToken && userToken.trim()) return userToken.trim();
                } catch (e) { }
                return DEFAULT_BRAPI_TOKEN || '';
            }

            async function fetchCotacoes(symbols) {
                if (!symbols || !symbols.length) return { ok: false, reason: 'no_symbols' };
                try {
                    var ctrl = new AbortController();
                    var t = setTimeout(function () { ctrl.abort(); }, 8000);
                    var token = getBrapiToken();
                    var url = 'https://brapi.dev/api/quote/' + symbols.join(',') + '?fundamental=false';
                    if (token) url += '&token=' + encodeURIComponent(token);
                    var r = await fetch(url, { signal: ctrl.signal });
                    clearTimeout(t);
                    if (r.status === 401 || r.status === 402) return { ok: false, reason: 'token_required' };
                    if (r.status === 429) return { ok: false, reason: 'rate_limit' };
                    if (!r.ok) return { ok: false, reason: 'http_' + r.status };
                    var d = await r.json();
                    if (!appState.invCotacoes) appState.invCotacoes = {};
                    var found = 0;
                    (d.results || []).forEach(function (q) {
                        if (q.regularMarketPrice != null) {
                            appState.invCotacoes[q.symbol] = {
                                price: q.regularMarketPrice || 0,
                                change: q.regularMarketChangePercent || 0,
                                name: q.shortName || q.longName || q.symbol
                            });
                            found++;
                        }
                    });
                    return { ok: found > 0, reason: found > 0 ? 'ok' : 'not_found' };
                } catch (e) {
                    console.warn('[INV] brapi falhou:', e.message);
                    return { ok: false, reason: 'network' };
                }
            }

            function setBrapiToken() {
                var current = getBrapiToken();
                var token = prompt('Cole seu token gratuito do brapi.dev:\n\n(Crie em https://brapi.dev/dashboard — leva 30 segundos)\n\nDeixe vazio para remover.', current);
                if (token === null) return;
                try {
                    if (token.trim()) {
                        localStorage.setItem('brapi_token', token.trim());
                        showToast('Token salvo! As cotações agora funcionam sem limite.', 'success');
                    } else {
                        localStorage.removeItem('brapi_token');
                        showToast('Token removido.', 'info');
                    }
                } catch (e) { showToast('Erro ao salvar token.', 'error'); }
            }

            async function syncInvestimentos() {
                if (!_supabase || !appState.user || !appState.user.id) {
                    appState.invContas = appState.invContas || [];
                    appState.investimentos = appState.investimentos || [];
                    appState.invAccountEvents = appState.invAccountEvents || [];
                    return;
                }
                try {
                    var uid = appState.user.id;
                    var res = await Promise.all([
                        _supabase.from('investment_accounts').select('*').eq('user_id', uid),
                        _supabase.from('investments').select('*').eq('user_id', uid),
                        _supabase.from('investment_dividends').select('*').eq('user_id', uid),
                        _supabase.from('investment_account_events').select('*').eq('user_id', uid).order('event_date', { ascending: false })
                    ]);
                    var banner = document.getElementById('inv-setup-banner');
                    if (res[0].error || res[1].error) {
                        appState.invContas = appState.invContas || [];
                        appState.investimentos = appState.investimentos || [];
                        appState.invDividendos = appState.invDividendos || [];
                        appState.invAccountEvents = appState.invAccountEvents || [];
                        if (banner) banner.style.display = 'block';
                    } else {
                        appState.invContas = res[0].data || [];
                        appState.investimentos = res[1].data || [];
                        appState.invDividendos = res[2].error ? [] : (res[2].data || []);
                        appState.invAccountEvents = res[3].error ? [] : (res[3].data || []);
                        if (banner) banner.style.display = 'none';
                    }
                } catch (e) {
                    appState.invContas = appState.invContas || [];
                    appState.investimentos = appState.investimentos || [];
                    appState.invAccountEvents = appState.invAccountEvents || [];
                    console.warn('[INV] sync erro:', e.message);
                }
            }

            // Soma dos eventos de conta (saldo disponível)
            function calcSaldoContas(accountId) {
                var events = appState.invAccountEvents || [];
                if (accountId) events = events.filter(function(e) { return e.account_id === accountId; });
                return events.reduce(function(s, e) { return s + (e.amount || 0); }, 0);
            }

            function calcSaldoContasFiltered(accountId, yearMonth) {
                var events = appState.invAccountEvents || [];
                if (accountId) events = events.filter(function(e) { return e.account_id === accountId; });
                if (yearMonth) events = events.filter(function(e) { return (e.event_date || '').substring(0, 7) === yearMonth; });
                return events.reduce(function(s, e) { return s + (e.amount || 0); }, 0);
            }

            async function fetchCDIHistory(months) {
                try {
                    var ctrl = new AbortController();
                    var t = setTimeout(function () { ctrl.abort(); }, 6000);
                    var r = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/' + months + '?formato=json', { signal: ctrl.signal });
                    clearTimeout(t);
                    if (!r.ok) return [];
                    return await r.json();
                } catch (e) { console.warn('[INV] CDI history falhou:', e.message); return []; }
            }

            async function renderRentabilidadeChart() {
                var ct = document.getElementById('inv-chart-rentab');
                var em = document.getElementById('inv-chart-rentab-empty');
                var lblBadge = document.getElementById('inv-rentab-label');
                if (!ct) return;

                var investimentos = appState.investimentos || [];
                if (!investimentos.length) {
                    if (em) em.style.display = 'block';
                    ct.style.display = 'none';
                    if (lblBadge) lblBadge.textContent = '';
                    if (invChartRentab) { invChartRentab.destroy(); invChartRentab = null; }
                    return;
                }

                // Encontrar data mais antiga de compra
                var dates = investimentos.map(function (i) { return i.purchase_date ? new Date(i.purchase_date).getTime() : Date.now(); });
                var earliest = Math.min.apply(null, dates);
                var monthsAgo = Math.max(2, Math.ceil((Date.now() - earliest) / (1000 * 60 * 60 * 24 * 30)));

                // Aplica filtro de período
                var period = appState.invRentabPeriod || 'all';
                var now = new Date();
                var monthsSince2026 = Math.max(1, Math.ceil((now - new Date(2026, 0, 1)) / (1000*60*60*24*30)));
                var periodMap = { '1m': 1, '6m': 6, '1y': 12, '2026': monthsSince2026, 'all': 999 };
                var maxMonths = periodMap[period] || 999;
                var showMonths = Math.min(maxMonths, Math.max(2, monthsAgo + 1));

                var cdiHist = await fetchCDIHistory(showMonths);
                if (!cdiHist.length) {
                    if (em) { em.style.display = 'block'; em.textContent = 'Não foi possível buscar histórico do CDI'; }
                    ct.style.display = 'none';
                    return;
                }

                // Calcular total investido inicial (data mais antiga)
                var totalInvested = investimentos.reduce(function (s, inv) {
                    return s + ((inv.quantity || 1) * (inv.purchase_price || 0));
                }, 0);
                var currentValue = investimentos.reduce(function (s, inv) { return s + calcValue(inv); }, 0);

                // Preparar dados ordenados por data
                var purchasesList = investimentos.map(function (inv) {
                    return {
                        date: inv.purchase_date ? new Date(inv.purchase_date).getTime() : Date.now(),
                        amount: (inv.quantity || 1) * (inv.purchase_price || 0)
                    });
                }).sort(function (a, b) { return a.date - b.date; });

                // Build labels and data points
                var labels = [];
                var cdiData = [];
                var portfolioData = [];
                var cdiAccum = 0;

                cdiHist.forEach(function (month, idx) {
                    // Parse date "DD/MM/YYYY" → end of month timestamp
                    var parts = month.data.split('/');
                    var monthEnd = new Date(parseInt(parts[2]), parseInt(parts[1]), 0).getTime();

                    // Quanto foi investido até este mês
                    var investedUpTo = purchasesList
                        .filter(function (p) { return p.date <= monthEnd; })
                        .reduce(function (s, p) { return s + p.amount; }, 0);

                    // CDI acumula sobre o que estava investido
                    if (idx === 0) {
                        cdiAccum = investedUpTo;
                    } else {
                        // Adiciona novos aportes do mês
                        var prevInvested = purchasesList
                            .filter(function (p) {
                                var pp = cdiHist[idx - 1].data.split('/');
                                var prevMonthEnd = new Date(parseInt(pp[2]), parseInt(pp[1]), 0).getTime();
                                return p.date <= prevMonthEnd;
                            })
                            .reduce(function (s, p) { return s + p.amount; }, 0);
                        cdiAccum += (investedUpTo - prevInvested);
                        // Aplica rendimento CDI do mês
                        cdiAccum *= (1 + parseFloat(month.valor) / 100);
                    }

                    labels.push(parts[1] + '/' + parts[2].substring(2));
                    cdiData.push(cdiAccum);
                    portfolioData.push(investedUpTo);
                });

                // Substituir último ponto da carteira pelo valor atual real
                if (portfolioData.length > 0) {
                    portfolioData[portfolioData.length - 1] = currentValue;
                }

                // Calcular % de retorno (normalizado a partir do primeiro ponto)
                var base0 = portfolioData[0] || 1;
                var cdi0  = cdiData[0]  || 1;
                var portfolioPct = portfolioData.map(function(v) { return ((v / base0) - 1) * 100; });
                var cdiPct       = cdiData.map(function(v)       { return ((v / cdi0)  - 1) * 100; });

                // Valores finais para o header
                var portFinalPct = portfolioPct[portfolioPct.length - 1] || 0;
                var cdiFinalPct  = cdiPct[cdiPct.length - 1] || 0;
                var portFinalVal = portfolioData[portfolioData.length - 1] || 0;
                var portGain     = portFinalVal - base0;
                var vsRatio      = cdiFinalPct !== 0 ? (portFinalPct / cdiFinalPct) * 100 : 0;

                // Atualizar header do card
                var rentabDate = document.getElementById('rentab-date');
                var today = new Date();
                if (rentabDate) rentabDate.textContent = 'Até ' + today.toLocaleDateString('pt-BR');
                var rentabVal = document.getElementById('rentab-value');
                if (rentabVal) rentabVal.textContent = (portGain >= 0 ? '+' : '') + fmtBRL(portGain);
                var rentabPct = document.getElementById('rentab-pct');
                if (rentabPct) {
                    rentabPct.textContent = (portFinalPct >= 0 ? '↑ ' : '↓ ') + Math.abs(portFinalPct).toFixed(2).replace('.', ',') + '%';
                    rentabPct.style.color = portFinalPct >= 0 ? '#10B981' : '#F43F5E';
                }
                var vsCdiTxt = document.getElementById('rentab-vs-cdi-text');
                if (vsCdiTxt) vsCdiTxt.textContent = vsRatio.toFixed(2).replace('.', ',') + '% do CDI';
                var cdiLegend = document.getElementById('rentab-cdi-final');
                if (cdiLegend) {
                    cdiLegend.textContent = (cdiFinalPct >= 0 ? '↑ ' : '↓ ') + Math.abs(cdiFinalPct).toFixed(2).replace('.', ',') + '%';
                    cdiLegend.style.color = cdiFinalPct >= 0 ? '#10B981' : '#F43F5E';
                }

                if (em) em.style.display = 'none';
                ct.style.display = 'block';

                if (invChartRentab) { invChartRentab.destroy(); invChartRentab = null; }

                // Gradiente roxo para fill da carteira
                var ctx2d = ct.getContext('2d');
                var grad = ctx2d.createLinearGradient(0, 0, 0, 200);
                grad.addColorStop(0,   'rgba(109,40,217,0.28)');
                grad.addColorStop(0.6, 'rgba(109,40,217,0.08)');
                grad.addColorStop(1,   'rgba(109,40,217,0)');

                invChartRentab = new Chart(ct, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Carteira',
                                data: portfolioPct,
                                borderColor: 'var(--accent-2)',
                                backgroundColor: grad,
                                borderWidth: 2,
                                tension: 0.4,
                                fill: true,
                                pointRadius: 0,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: 'var(--accent-2)',
                                pointHoverBorderColor: 'var(--accent-2)',
                                pointHoverBorderWidth: 2
                            },
                            {
                                label: 'CDI',
                                data: cdiPct,
                                borderColor: '#818cf8',
                                backgroundColor: 'transparent',
                                borderWidth: 1.5,
                                borderDash: [5, 4],
                                tension: 0.4,
                                pointRadius: 0,
                                pointHoverRadius: 4,
                                pointHoverBackgroundColor: '#818cf8'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(15,23,42,0.95)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderWidth: 1,
                                padding: 12,
                                titleColor: 'rgba(255,255,255,0.5)',
                                titleFont: { size: 11, weight: '600' },
                                bodyFont: { size: 13, weight: '700' },
                                callbacks: {
                                    title: function(items) { return items[0].label; },
                                    label: function(ctx) {
                                        var val = ctx.parsed.y;
                                        var arrow = val >= 0 ? '↑' : '↓';
                                        var color = val >= 0 ? '#10B981' : '#F43F5E';
                                        return ctx.dataset.label + '  ' + arrow + ' ' + Math.abs(val).toFixed(2).replace('.', ',') + '%';
                                    },
                                    labelColor: function(ctx) {
                                        return { borderColor: 'transparent', backgroundColor: ctx.datasetIndex === 0 ? 'var(--accent-2)' : '#818cf8' };
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                display: true,
                                ticks: { display: false },
                                grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false }
                            },
                            x: {
                                grid: { display: false },
                                ticks: {
                                    color: 'rgba(0,0,0,0.35)',
                                    font: { size: 10 },
                                    maxRotation: 0,
                                    maxTicksLimit: 6
                                }
                            }
                        }
                    }
                });
            }

            function calcDivsForInv(invId) {
                var qtd = 0, total = 0;
                (appState.invDividendos || []).forEach(function (d) {
                    if (d.investment_id === invId) {
                        var inv = (appState.investimentos || []).find(function (i) { return i.id === invId; });
                        var qty = inv && inv.quantity ? inv.quantity : 1;
                        total += (d.value_per_share || 0) * qty;
                        qtd++;
                    }
                });
                return { count: qtd, total: total };
            }

            function calcTotalDivs() {
                var total = 0;
                (appState.investimentos || []).forEach(function (inv) {
                    total += calcDivsForInv(inv.id).total;
                });
                return total;
            }

            function calcValue(inv) {
                var qtd = inv.quantity || 1;
                var price = inv.purchase_price || 0;
                var invested = qtd * price;
                if (VAR_TYPES.indexOf(inv.type) >= 0) {
                    var cot = (appState.invCotacoes || {})[inv.symbol];
                    return cot ? qtd * cot.price : invested;
                }
                var cdi = appState.cdiAnual || 0.1065;
                var rate = (inv.rate_pct || 100) / 100;
                var base;
                if (inv.rate_index === 'PRE') base = rate;
                else if (inv.rate_index === 'POUPANCA') base = cdi * 0.7;
                else base = cdi * rate;
                var purchaseDate = inv.purchase_date ? new Date(inv.purchase_date) : new Date();
                var days = Math.max(0, (Date.now() - purchaseDate.getTime()) / 86400000);
                return invested * Math.pow(1 + base, days / 365);
            }

            async function renderInvestimentosTab() {
                console.log('[INV] renderInvestimentosTab chamado');
                try {
                    if (!appState.invCotacoes) appState.invCotacoes = {};
                    if (!appState.invFilter) appState.invFilter = 'todos';
                    if (!appState.invContaFil) appState.invContaFil = 'todas';

                    await syncInvestimentos();

                    var symbols = (appState.investimentos || [])
                        .filter(function (i) { return VAR_TYPES.indexOf(i.type) >= 0; })
                        .map(function (i) { return i.symbol; })
                        .filter(Boolean);

                    await Promise.all([
                        symbols.length ? fetchCotacoes(symbols) : Promise.resolve(),
                        appState.cdiAnual == null ? fetchCDI() : Promise.resolve()
                    ]);

                    renderKPIs();
                    renderContasRow();
                    renderCharts();
                    renderRentabilidadeChart();
                    renderTable();
                    updateCDIBadge();
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                } catch (e) {
                    console.error('[INV] Erro no render:', e);
                }
            }

            function renderKPIs() {
                var totInv = 0, totAtual = 0;
                (appState.investimentos || []).forEach(function (inv) {
                    var invested = (inv.quantity || 1) * (inv.purchase_price || 0);
                    var current = calcValue(inv);
                    totInv += invested;
                    totAtual += current;
                });

                var totSaldo = calcSaldoContas(null);
                var totProventos = (appState.invAccountEvents || [])
                    .filter(function(e) { return e.type === 'provento'; })
                    .reduce(function(s, e) { return s + (e.amount || 0); }, 0);

                var pl = totAtual - totInv;
                var plPct = totInv > 0 ? (pl / totInv) * 100 : 0;
                var totPatrimonio = totSaldo + totAtual;

                setText('inv-kpi-patrimonio', fmtBRL(totPatrimonio));
                setText('inv-kpi-saldo', fmtBRL(totSaldo));
                setText('inv-kpi-saldo-sub', totProventos > 0
                    ? 'inclui ' + fmtBRL(totProventos) + ' em proventos'
                    : 'capital disponível em contas');
                setText('inv-kpi-investido', fmtBRL(totAtual));
                setText('inv-kpi-rent-pct', fmtPct(plPct));
                setText('inv-kpi-rent-sub', fmtBRL(Math.abs(pl)) + ' ' + (pl >= 0 ? 'de ganho' : 'de perda') + ' sobre ' + fmtBRL(totInv));

                setClass('inv-kpi-rent-pct', 'inv-kpi-value ' + (plPct >= 0 ? 'positive' : 'negative'));

                var badge = document.getElementById('inv-kpi-rent-badge');
                if (badge && totInv > 0) {
                    badge.textContent = (pl >= 0 ? '▲ ' : '▼ ') + fmtBRL(Math.abs(pl));
                    badge.style.display = 'inline-flex';
                    badge.className = 'inv-kpi-badge ' + (pl >= 0 ? 'pos' : 'neg');
                } else if (badge) {
                    badge.style.display = 'none';
                }
            }

            function renderContasRow() {
                var row = document.getElementById('inv-contas-list');
                if (!row) return;

                var accVal = {};
                var accCount = {};
                (appState.invContas || []).forEach(function (c) { accVal[c.id] = 0; accCount[c.id] = 0; });
                (appState.investimentos || []).forEach(function (inv) {
                    if (inv.account_id && accVal[inv.account_id] !== undefined) {
                        accVal[inv.account_id] += calcValue(inv);
                        accCount[inv.account_id]++;
                    }
                });

                if (!(appState.invContas || []).length) {
                    row.innerHTML = '<div class="inv-conta-empty">' +
                        '<div style="font-size:1.8rem;margin-bottom:8px;">🏦</div>' +
                        '<div style="font-weight:700;color:var(--text-main);margin-bottom:4px;">Nenhuma conta cadastrada</div>' +
                        '<div style="font-size:0.78rem;">Cadastre sua corretora ou banco para organizar seus ativos.</div>' +
                        '</div>';
                    return;
                }

                var html = '';
                (appState.invContas || []).forEach(function (c) {
                    var sel = appState.invContaFil === c.id ? ' selected' : '';
                    var qty = accCount[c.id] || 0;
                    var ativosTxt = qty === 0 ? 'sem ativos' : (qty + (qty === 1 ? ' ativo' : ' ativos'));
                    html += '<div class="inv-conta-item' + sel + '" onclick="filterInvByConta(\'' + c.id + '\')">';
                    html += '<div class="inv-conta-item-color" style="background:' + (c.color || 'var(--accent-2)') + '"></div>';
                    html += '<div class="inv-conta-item-info">';
                    html += '<div class="inv-conta-item-name">' + esc(c.name) + '</div>';
                    html += '<div class="inv-conta-item-inst">' + (c.institution ? esc(c.institution) + ' · ' : '') + ativosTxt + '</div>';
                    html += '</div>';
                    html += '<div class="inv-conta-item-actions" id="ica-' + c.id + '">';
                    html += '<button class="inv-action-btn" onclick="event.stopPropagation();toggleContaActions(\'' + c.id + '\',this)" title="Ações"><i data-lucide="plus" style="width:14px;height:14px;transition:transform .2s;"></i></button>';
                    html += '<span class="inv-acts-row" id="icar-' + c.id + '">';
                    html += '<button class="inv-act" title="Histórico" onclick="event.stopPropagation();toggleContaActions(\'' + c.id + '\',null);openContaHistoryModal(\'' + c.id + '\')"><i data-lucide="history" style="width:13px;height:13px;color:var(--accent-2);"></i></button>';
                    html += '<button class="inv-act" title="Editar" onclick="event.stopPropagation();toggleContaActions(\'' + c.id + '\',null);editInvConta(\'' + c.id + '\')"><i data-lucide="pencil" style="width:13px;height:13px;color:var(--accent);"></i></button>';
                    html += '<button class="inv-act danger" title="Remover" onclick="event.stopPropagation();toggleContaActions(\'' + c.id + '\',null);deleteInvConta(\'' + c.id + '\')"><i data-lucide="trash-2" style="width:13px;height:13px;"></i></button>';
                    html += '</span>';
                    html += '</div>';
                    html += '</div>';
                });

                row.innerHTML = html;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            function renderCharts() {
                if (typeof Chart === 'undefined') return;
                var typeMap = {};
                (appState.investimentos || []).forEach(function (inv) {
                    var v = calcValue(inv);
                    typeMap[inv.type] = (typeMap[inv.type] || 0) + v;
                });

                if (invChartTipo) { invChartTipo.destroy(); invChartTipo = null; }

                var tk = Object.keys(typeMap);
                invChartTipo = makeChart('inv-chart-tipo', 'inv-chart-tipo-empty',
                    tk.map(function (k) { return TYPE_LABELS[k] || k; }),
                    tk.map(function (k) { return typeMap[k]; }),
                    tk.map(function (k) { return TYPE_COLORS[k] || '#94A3B8'; }));
            }

            function makeChart(canvasId, emptyId, labels, data, colors) {
                var ct = document.getElementById(canvasId);
                var em = document.getElementById(emptyId);
                if (!ct) return null;
                if (!data.length) {
                    if (em) em.style.display = 'block';
                    ct.style.display = 'none';
                    return null;
                }
                if (em) em.style.display = 'none';
                ct.style.display = 'block';
                return new Chart(ct, {
                    type: 'doughnut',
                    data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '68%',
                        plugins: {
                            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10, boxWidth: 10 } },
                            tooltip: {
                                callbacks: {
                                    label: function (ctx) {
                                        var tot = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                                        return ' ' + fmtBRL(ctx.raw) + ' (' + (ctx.raw / tot * 100).toFixed(1) + '%)';
                                    }
                                }
                            }
                        }
                    }
                });
            }

            function renderTable() {
                var tbody = document.getElementById('inv-tbody');
                var empty = document.getElementById('inv-table-empty');
                if (!tbody) return;

                var tf = appState.invFilter || 'todos';
                var cf = appState.invContaFil || 'todas';

                var items = (appState.investimentos || []).filter(function (i) {
                    if (tf !== 'todos' && i.type !== tf) return false;
                    if (cf !== 'todas' && i.account_id !== cf) return false;
                    return true;
                });

                if (!items.length) {
                    tbody.innerHTML = '';
                    if (empty) empty.style.display = 'block';
                    return;
                }
                if (empty) empty.style.display = 'none';

                var rows = '';
                items.forEach(function (inv) {
                    var invested = (inv.quantity || 1) * (inv.purchase_price || 0);
                    var current = calcValue(inv);
                    var pl = current - invested;
                    var plPct = invested > 0 ? (pl / invested) * 100 : 0;
                    var isVar = VAR_TYPES.indexOf(inv.type) >= 0;
                    var cot = (appState.invCotacoes || {})[inv.symbol];
                    var conta = (appState.invContas || []).find(function (c) { return c.id === inv.account_id; });

                    var cotDisp;
                    if (isVar) { cotDisp = cot ? fmtBRL(cot.price) : '<span style="opacity:.4">—</span>'; }
                    else { cotDisp = inv.rate_pct ? '<strong>' + inv.rate_pct + '%</strong> ' + (inv.rate_index || 'CDI') : '—'; }

                    var chgDisp = '—';
                    if (isVar && cot) {
                        var cls = cot.change >= 0 ? 'inv-pl-pos' : 'inv-pl-neg';
                        chgDisp = '<span class="' + cls + '">' + fmtPct(cot.change) + '</span>';
                    }

                    var contaDisp = '—';
                    if (conta) {
                        contaDisp = '<span style="display:flex;align-items:center;gap:5px;"><span style="width:7px;height:7px;border-radius:50%;background:' + (conta.color || 'var(--accent-2)') + ';display:inline-block;flex-shrink:0;"></span>' + esc(conta.name) + '</span>';
                    }

                    var plClass = pl >= 0 ? 'inv-pl-pos' : 'inv-pl-neg';
                    var qtyDisp = inv.quantity != null ? Number(inv.quantity).toLocaleString('pt-BR') : '—';
                    var symbolHtml = inv.symbol ? '<div class="inv-asset-symbol">' + esc(inv.symbol) + '</div>' : '';

                    rows += '<tr>';
                    rows += '<td><div class="inv-asset-name">' + esc(inv.name || '—') + '</div>' + symbolHtml + '</td>';
                    rows += '<td><span class="inv-badge inv-b-' + inv.type + '">' + (TYPE_LABELS[inv.type] || inv.type) + '</span></td>';
                    rows += '<td>' + qtyDisp + '</td>';
                    rows += '<td>' + fmtBRL(inv.purchase_price || 0) + '</td>';
                    rows += '<td>' + cotDisp + '</td>';
                    rows += '<td>' + chgDisp + '</td>';
                    rows += '<td style="font-weight:700;">' + fmtBRL(current) + '</td>';
                    rows += '<td class="' + plClass + '">' + fmtBRL(Math.abs(pl)) + ' <span style="font-size:.7rem;opacity:.8">(' + fmtPct(plPct) + ')</span></td>';
                    // Proventos recebidos
                    var divs = calcDivsForInv(inv.id);
                    var divHtml;
                    if (divs.total > 0) {
                        divHtml = '<span class="inv-pl-pos">' + fmtBRL(divs.total) + '</span> <span style="font-size:.7rem;opacity:.7">(' + divs.count + 'x)</span>';
                    } else {
                        divHtml = '<span style="opacity:.4">—</span>';
                    }
                    rows += '<td>' + divHtml + '</td>';
                    rows += '<td>' + contaDisp + '</td>';
                    rows += '<td class="inv-acts-cell" id="iac-' + inv.id + '">';
                    rows += '<button class="inv-action-btn" onclick="toggleInvActions(\'' + inv.id + '\',this)" title="Ações"><i data-lucide="plus" style="width:14px;height:14px;transition:transform .2s;"></i></button>';
                    rows += '<span class="inv-acts-row" id="iar-' + inv.id + '">';
                    rows += '<button class="inv-act" title="Lançar provento" onclick="toggleInvActions(\'' + inv.id + '\',null);openDividendoModal(\'' + inv.id + '\')"><span style="font-size:.85rem;">💰</span></button>';
                    rows += '<button class="inv-act" title="Registrar venda" onclick="toggleInvActions(\'' + inv.id + '\',null);openVendaModal(\'' + inv.id + '\')"><i data-lucide="trending-down" style="width:13px;height:13px;color:#F59E0B;"></i></button>';
                    rows += '<button class="inv-act" title="Editar" onclick="toggleInvActions(\'' + inv.id + '\',null);editInvestimento(\'' + inv.id + '\')"><i data-lucide="pencil" style="width:13px;height:13px;color:var(--accent);"></i></button>';
                    rows += '<button class="inv-act danger" title="Remover" onclick="toggleInvActions(\'' + inv.id + '\',null);deleteInvestimento(\'' + inv.id + '\')"><i data-lucide="trash-2" style="width:13px;height:13px;"></i></button>';
                    rows += '</span>';
                    rows += '</td></tr>';
                });

                tbody.innerHTML = rows;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            function updateCDIBadge() {
                // CDI badge desativado a pedido do usuário
                var el = document.getElementById('inv-cdi-badge');
                if (el) el.style.display = 'none';
            }

            async function refreshInvCotacoes() {
                if (appState._invRefreshing) return;
                appState._invRefreshing = true;
                var btn = document.getElementById('inv-refresh-btn');
                if (btn) btn.disabled = true;
                try {
                    appState.invCotacoes = {};
                    var symbols = (appState.investimentos || [])
                        .filter(function (i) { return VAR_TYPES.indexOf(i.type) >= 0; })
                        .map(function (i) { return i.symbol; })
                        .filter(Boolean);
                    await Promise.all([
                        symbols.length ? fetchCotacoes(symbols) : Promise.resolve(),
                        fetchCDI()
                    ]);
                    renderKPIs(); renderCharts(); renderTable(); updateCDIBadge();
                    if (typeof showToast === 'function') showToast('Cotações atualizadas!', 'success');
                } catch (e) { console.error('[INV] refresh:', e); }
                finally {
                    appState._invRefreshing = false;
                    if (btn) btn.disabled = false;
                }
            }

            function setRentabPeriod(period) {
                appState.invRentabPeriod = period;
                // Close dropdown
                var menu = document.getElementById('rentab-period-menu');
                if (menu) menu.style.display = 'none';
                // Update button label
                var labelMap = { '2026': '2026', '1m': '1M', '6m': '6M', '1y': '12M', 'all': 'Máximo' };
                var lbl = document.getElementById('rentab-period-label');
                if (lbl) lbl.textContent = labelMap[period] || period;
                // Mark active option
                document.querySelectorAll('.rentab-period-opt').forEach(function(el) {
                    el.classList.toggle('active', el.dataset.rp === period);
                });
                renderRentabilidadeChart();
            }

            function filterInvByType(type) {
                appState.invFilter = type;
                document.querySelectorAll('.inv-filter-btn').forEach(function (b) { b.classList.remove('active'); });
                var btn = document.querySelector('[data-inv-filter="' + type + '"]');
                if (btn) btn.classList.add('active');
                renderTable();
            }

            function filterInvByConta(id) {
                appState.invContaFil = appState.invContaFil === id ? 'todas' : id;
                renderContasRow();
                renderTable();
            }

            function openInvModal(id) {
                id = id || null;
                appState.editingInvId = id;
                var modal = document.getElementById('modal-inv');
                if (!modal) return;
                var inv = id ? (appState.investimentos || []).find(function (i) { return i.id === id; }) : null;
                _invSelType = inv ? inv.type : 'acoes';

                setVal('inv-f-name', inv ? (inv.name || '') : '');
                setVal('inv-f-symbol', inv ? (inv.symbol || '') : '');
                var fixed = ['renda_fixa', 'tesouro', 'poupanca'].indexOf(_invSelType) >= 0;
                if (fixed) {
                    // Renda fixa: o purchase_price é o valor total investido
                    setVal('inv-f-amount', inv ? (inv.purchase_price || '') : '');
                    setVal('inv-f-quantity', '');
                    setVal('inv-f-price', '');
                } else {
                    setVal('inv-f-quantity', inv && inv.quantity != null ? inv.quantity : '');
                    setVal('inv-f-price', inv ? (inv.purchase_price || '') : '');
                    setVal('inv-f-amount', '');
                }
                setVal('inv-f-date', inv ? (inv.purchase_date || todayISO()) : todayISO());
                setVal('inv-f-rate-pct', inv ? (inv.rate_pct || 100) : 100);
                setVal('inv-f-rate-index', inv ? (inv.rate_index || 'CDI') : 'CDI');
                setVal('inv-f-notes', inv ? (inv.notes || '') : '');
                // Reset cotação box
                var box = document.getElementById('inv-cotacao-box');
                if (box) box.style.display = 'none';
                // Calcular total inicial
                setTimeout(calcTotalInvestido, 50);
                // Se editando variável com ticker, buscar cotação automaticamente
                if (inv && inv.symbol && !fixed) setTimeout(buscarCotacaoTicker, 100);

                var sel = document.getElementById('inv-f-account');
                var opts = '<option value="">Sem conta</option>';
                (appState.invContas || []).forEach(function (c) {
                    var s = inv && inv.account_id === c.id ? ' selected' : '';
                    opts += '<option value="' + c.id + '"' + s + '>' + esc(c.name) + '</option>';
                });
                sel.innerHTML = opts;

                setInvType(_invSelType);
                setText('modal-inv-title', id ? 'Editar Ativo' : 'Novo Ativo');
                modal.style.display = 'flex';
                setTimeout(function () { modal.classList.add('active'); }, 10);
            }

            function setInvType(type) {
                _invSelType = type;
                document.querySelectorAll('.inv-type-opt').forEach(function (el) {
                    el.classList.toggle('selected', el.dataset.type === type);
                });
                var fixed = ['renda_fixa', 'tesouro', 'poupanca'].indexOf(type) >= 0;
                // Variable asset fields
                var sg = document.getElementById('inv-symbol-group');
                var qg = document.getElementById('inv-qty-group');
                var pg = document.getElementById('inv-price-unit-group');
                var tg = document.getElementById('inv-total-group');
                // Fixed income fields
                var rg = document.getElementById('inv-rate-group');
                var ag = document.getElementById('inv-amount-group');

                if (sg) sg.style.display = fixed ? 'none' : 'block';
                if (qg) qg.style.display = fixed ? 'none' : 'block';
                if (pg) pg.style.display = fixed ? 'none' : 'block';
                if (tg) tg.style.display = fixed ? 'none' : 'block';
                if (rg) rg.style.display = fixed ? 'block' : 'none';
                if (ag) ag.style.display = fixed ? 'block' : 'none';
            }

            function calcTotalInvestido() {
                var qty = parseFloat(document.getElementById('inv-f-quantity').value) || 0;
                var price = parseFloat(document.getElementById('inv-f-price').value) || 0;
                var total = qty * price;
                var el = document.getElementById('inv-total-display');
                if (el) el.textContent = fmtBRL(total);
            }

            async function buscarCotacaoTicker() {
                var sym = (document.getElementById('inv-f-symbol').value || '').trim().toUpperCase();
                if (!sym) return;
                var btn = document.getElementById('inv-fetch-btn');
                var box = document.getElementById('inv-cotacao-box');
                var disp = document.getElementById('inv-cotacao-display');
                var nameEl = document.getElementById('inv-cotacao-name');
                var nameInput = document.getElementById('inv-f-name');
                var priceInput = document.getElementById('inv-f-price');

                if (btn) { btn.disabled = true; btn.innerHTML = '<i data-lucide="loader-2"></i> Buscando...'; if (typeof lucide !== 'undefined') lucide.createIcons(); }

                try {
                    var result = await fetchCotacoes([sym]);
                    var cot = (appState.invCotacoes || {})[sym];
                    if (cot && cot.price) {
                        if (box) box.style.display = 'block';
                        if (disp) disp.textContent = fmtBRL(cot.price) + ' (' + fmtPct(cot.change) + ' hoje)';
                        if (nameEl) nameEl.textContent = cot.name || '';
                        if (nameInput && !nameInput.value && cot.name) nameInput.value = cot.name;
                        if (priceInput && !priceInput.value) {
                            priceInput.value = cot.price.toFixed(2);
                            calcTotalInvestido();
                        }
                    } else {
                        if (box) { box.style.display = 'block'; }
                        if (result && result.reason === 'rate_limit') {
                            if (disp) disp.textContent = 'Muitas consultas em pouco tempo';
                            if (nameEl) nameEl.textContent = 'Aguarde alguns segundos e tente novamente';
                        } else if (result && result.reason === 'network') {
                            if (disp) disp.textContent = 'Sem conexão';
                            if (nameEl) nameEl.textContent = 'Verifique sua internet';
                        } else {
                            if (disp) disp.textContent = 'Ticker não encontrado';
                            if (nameEl) nameEl.textContent = 'Verifique se o código está correto (ex: PETR4, KNRI11, BTC, AMBEV3)';
                        }
                    }
                } catch (e) {
                    if (box) { box.style.display = 'block'; }
                    if (disp) disp.textContent = 'Erro ao buscar cotação';
                } finally {
                    if (btn) { btn.disabled = false; btn.innerHTML = '<i data-lucide="search"></i> Buscar'; if (typeof lucide !== 'undefined') lucide.createIcons(); }
                }
            }

            function closeInvModal() {
                var m = document.getElementById('modal-inv');
                if (!m) return;
                m.classList.remove('active');
                setTimeout(function () { m.style.display = 'none'; }, 300);
            }

            async function saveInvestimento() {
                if (!_supabase || !appState.user || !appState.user.id) {
                    if (typeof showToast === 'function') showToast('Faça login para salvar.', 'error');
                    return;
                }
                var name = (document.getElementById('inv-f-name').value || '').trim();
                if (!name) { showToast('Informe o nome do ativo.', 'error'); return; }

                var fixed = ['renda_fixa', 'tesouro', 'poupanca'].indexOf(_invSelType) >= 0;
                var quantity, purchasePrice;
                if (fixed) {
                    // Renda fixa: quantity = 1, purchase_price = valor total investido
                    quantity = 1;
                    purchasePrice = parseFloat(document.getElementById('inv-f-amount').value) || 0;
                    if (purchasePrice <= 0) { showToast('Informe o valor investido.', 'error'); return; }
                } else {
                    quantity = parseFloat(document.getElementById('inv-f-quantity').value) || null;
                    purchasePrice = parseFloat(document.getElementById('inv-f-price').value) || 0;
                    if (!quantity || purchasePrice <= 0) { showToast('Informe quantidade e preço médio.', 'error'); return; }
                }

                var record = {
                    user_id: appState.user.id,
                    name: name,
                    symbol: (document.getElementById('inv-f-symbol').value || '').trim().toUpperCase() || null,
                    type: _invSelType,
                    quantity: quantity,
                    purchase_price: purchasePrice,
                    purchase_date: document.getElementById('inv-f-date').value || null,
                    rate_pct: fixed ? (parseFloat(document.getElementById('inv-f-rate-pct').value) || null) : null,
                    rate_index: fixed ? (document.getElementById('inv-f-rate-index').value || null) : null,
                    notes: (document.getElementById('inv-f-notes').value || '').trim() || null,
                    account_id: document.getElementById('inv-f-account').value || null
                });

                // Validação de saldo: só para novos ativos com conta selecionada
                var isNovoAtivo = !appState.editingInvId;
                var totalCusto = fixed ? purchasePrice : (quantity * purchasePrice);
                if (isNovoAtivo && record.account_id) {
                    var saldoDisp = calcSaldoContas(record.account_id);
                    if (saldoDisp < totalCusto) {
                        var contaNome = (appState.invContas || []).find(function(c) { return c.id === record.account_id; });
                        showToast(
                            'Saldo insuficiente em "' + (contaNome ? contaNome.name : 'conta') + '". ' +
                            'Disponível: ' + fmtBRL(saldoDisp) + ' · Necessário: ' + fmtBRL(totalCusto),
                            'error'
                        );
                        return;
                    }
                }

                try {
                    var resInv;
                    if (appState.editingInvId) {
                        resInv = await _supabase.from('investments').update(record).eq('id', appState.editingInvId);
                    } else {
                        resInv = await _supabase.from('investments').insert([record]);
                    }
                    if (resInv.error) throw resInv.error;

                    // Desconta o custo da compra no saldo da conta
                    if (isNovoAtivo && record.account_id) {
                        var evDate = record.purchase_date || todayISO();
                        var resEv = await _supabase.from('investment_account_events').insert([{
                            user_id: appState.user.id,
                            account_id: record.account_id,
                            type: 'aporte',
                            amount: -totalCusto,
                            description: 'Compra: ' + name,
                            event_date: evDate
                        }]);
                        if (resEv.error) throw resEv.error;
                    }

                    closeInvModal();
                    showToast('Ativo salvo!', 'success');
                    await syncInvestimentos();
                    await renderInvestimentosTab();
                } catch (e) { showToast('Erro ao salvar ativo: ' + (e.message || e), 'error'); console.error(e); }
            }

            function editInvestimento(id) { openInvModal(id); }

            // ─── Botões inline por ativo ───
            var _iaCurrent = null;

            function toggleInvActions(id, btn) {
                var row = document.getElementById('iar-' + id);
                if (!row) return;
                var isOpen = row.classList.contains('open');
                if (_iaCurrent && _iaCurrent !== id) {
                    document.getElementById('iar-' + _iaCurrent)?.classList.remove('open');
                    document.querySelector('#iac-' + _iaCurrent + ' .inv-action-btn')?.classList.remove('open');
                }
                if (!isOpen) {
                    row.classList.add('open');
                    if (btn) btn.classList.add('open');
                    _iaCurrent = id;
                } else {
                    row.classList.remove('open');
                    if (btn) btn.classList.remove('open');
                    _iaCurrent = null;
                }
            }

            document.addEventListener('click', function(e) {
                if (_iaCurrent && !e.target.closest('.inv-acts-cell')) {
                    document.getElementById('iar-' + _iaCurrent)?.classList.remove('open');
                    document.querySelector('#iac-' + _iaCurrent + ' .inv-action-btn')?.classList.remove('open');
                    _iaCurrent = null;
                }
            });
            window.toggleInvActions = toggleInvActions;
            window.closeAllInvMenus = function() {
                if (_iaCurrent) {
                    document.getElementById('iar-' + _iaCurrent)?.classList.remove('open');
                    _iaCurrent = null;
                }
            });

            // ─── Botões inline por conta de investimento ───
            var _icaCurrent = null;

            function toggleContaActions(id, btn) {
                var row = document.getElementById('icar-' + id);
                if (!row) return;
                var isOpen = row.classList.contains('open');
                if (_icaCurrent && _icaCurrent !== id) {
                    document.getElementById('icar-' + _icaCurrent)?.classList.remove('open');
                    document.querySelector('#ica-' + _icaCurrent + ' .inv-action-btn')?.classList.remove('open');
                }
                if (!isOpen) {
                    row.classList.add('open');
                    if (btn) btn.classList.add('open');
                    _icaCurrent = id;
                } else {
                    row.classList.remove('open');
                    if (btn) btn.classList.remove('open');
                    _icaCurrent = null;
                }
            }

            document.addEventListener('click', function(e) {
                if (_icaCurrent && !e.target.closest('.inv-conta-item-actions')) {
                    document.getElementById('icar-' + _icaCurrent)?.classList.remove('open');
                    document.querySelector('#ica-' + _icaCurrent + ' .inv-action-btn')?.classList.remove('open');
                    _icaCurrent = null;
                }
            });
            window.toggleContaActions = toggleContaActions;

            // ─── Exclusão com modal de confirmação ───
            var _deleteInvId = null;

            function deleteInvestimento(id) {
                var inv = (appState.investimentos || []).find(function(i) { return i.id === id; });
                if (!inv) return;
                _deleteInvId = id;
                var conta = inv.account_id ? (appState.invContas || []).find(function(c) { return c.id === inv.account_id; }) : null;
                var fixed = ['renda_fixa', 'tesouro', 'poupanca'].indexOf(inv.type) >= 0;
                var valorAtual = fixed ? (inv.purchase_price || 0) : ((inv.quantity || 0) * (inv.purchase_price || 0));
                document.getElementById('delete-inv-name').textContent = inv.name || '—';
                document.getElementById('delete-inv-meta').textContent =
                    (TYPE_LABELS[inv.type] || inv.type) +
                    (inv.symbol ? ' · ' + inv.symbol : '') +
                    ' · Valor investido: ' + fmtBRL(valorAtual) +
                    (conta ? ' · Conta: ' + conta.name : '');
                var modal = document.getElementById('modal-inv-delete-confirm');
                modal.style.display = 'flex';
                setTimeout(function() { modal.classList.add('active'); }, 10);
            }

            function closeDeleteInvModal() {
                var m = document.getElementById('modal-inv-delete-confirm');
                if (!m) return;
                m.classList.remove('active');
                setTimeout(function() { m.style.display = 'none'; }, 300);
                _deleteInvId = null;
            }

            async function confirmDeleteInvestimento() {
                if (!_deleteInvId || !_supabase) return;
                try {
                    var res = await _supabase.from('investments').delete().eq('id', _deleteInvId);
                    if (res.error) throw res.error;
                    closeDeleteInvModal();
                    showToast('Ativo removido.', 'success');
                    await syncInvestimentos();
                    await renderInvestimentosTab();
                } catch (e) { showToast('Erro ao remover: ' + (e.message || e), 'error'); console.error(e); }
            }

            // ─── Fluxo de Venda ───
            var _vendaInvId = null;

            function calcVendaTotal() {
                var qty = parseFloat(document.getElementById('venda-f-qty').value) || 0;
                var price = parseFloat(document.getElementById('venda-f-price').value) || 0;
                var total = qty * price;
                document.getElementById('venda-f-total').value = total > 0 ? total.toFixed(2) : '';
            }

            function openVendaModal(id) {
                var inv = (appState.investimentos || []).find(function(i) { return i.id === id; });
                if (!inv) return;
                _vendaInvId = id;

                var fixed = ['renda_fixa', 'tesouro', 'poupanca'].indexOf(inv.type) >= 0;
                var conta = inv.account_id ? (appState.invContas || []).find(function(c) { return c.id === inv.account_id; }) : null;
                var saldo = conta ? calcSaldoContas(inv.account_id) : null;

                document.getElementById('venda-inv-name').textContent = inv.name + (inv.symbol ? ' (' + inv.symbol + ')' : '');
                document.getElementById('venda-inv-meta').textContent =
                    (TYPE_LABELS[inv.type] || inv.type) +
                    (fixed ? ' · Valor investido: ' + fmtBRL(inv.purchase_price || 0)
                           : ' · Posição: ' + (inv.quantity || 0) + ' unid. · PM: ' + fmtBRL(inv.purchase_price || 0));
                document.getElementById('venda-inv-saldo').textContent =
                    conta ? ('Saldo disponível em ' + conta.name + ': ' + fmtBRL(saldo)) : '';

                // Seção de quantidade
                var qtySection = document.getElementById('venda-qty-section');
                if (fixed) {
                    qtySection.style.display = 'none';
                    document.getElementById('venda-price-label').textContent = 'Valor total resgatado (R$)';
                    document.getElementById('venda-f-qty').value = '1';
                } else {
                    qtySection.style.display = '';
                    document.getElementById('venda-qty-label').textContent = 'Quantidade vendida (máx: ' + (inv.quantity || 0) + ')';
                    document.getElementById('venda-qty-hint').textContent = 'Posição atual: ' + (inv.quantity || 0) + ' unidades';
                    document.getElementById('venda-price-label').textContent = 'Preço de venda por unidade (R$)';
                    document.getElementById('venda-f-qty').value = '';
                    document.getElementById('venda-f-qty').max = inv.quantity || 0;
                }

                // Conta destino
                var sel = document.getElementById('venda-f-account');
                var opts = '<option value="">Sem conta (não creditar)</option>';
                (appState.invContas || []).forEach(function(c) {
                    var sel2 = inv.account_id === c.id ? ' selected' : '';
                    opts += '<option value="' + c.id + '"' + sel2 + '>' + esc(c.name) + '</option>';
                });
                sel.innerHTML = opts;

                document.getElementById('venda-f-price').value = '';
                document.getElementById('venda-f-total').value = '';
                document.getElementById('venda-f-date').value = todayISO();
                document.getElementById('venda-f-desc').value = '';

                var modal = document.getElementById('modal-inv-venda');
                modal.style.display = 'flex';
                setTimeout(function() { modal.classList.add('active'); }, 10);
            }

            function closeVendaModal() {
                var m = document.getElementById('modal-inv-venda');
                if (!m) return;
                m.classList.remove('active');
                setTimeout(function() { m.style.display = 'none'; }, 300);
                _vendaInvId = null;
            }

            async function saveVenda() {
                if (!_vendaInvId || !_supabase || !appState.user) return;
                var inv = (appState.investimentos || []).find(function(i) { return i.id === _vendaInvId; });
                if (!inv) return;

                var fixed = ['renda_fixa', 'tesouro', 'poupanca'].indexOf(inv.type) >= 0;
                var qty = fixed ? 1 : (parseFloat(document.getElementById('venda-f-qty').value) || 0);
                var price = parseFloat(document.getElementById('venda-f-price').value) || 0;
                var total = fixed ? price : (qty * price);
                var date = document.getElementById('venda-f-date').value || todayISO();
                var desc = (document.getElementById('venda-f-desc').value || '').trim() || ('Venda: ' + inv.name);
                var accountId = document.getElementById('venda-f-account').value;

                if (!fixed && qty <= 0) { showToast('Informe a quantidade vendida.', 'error'); return; }
                if (!fixed && qty > (inv.quantity || 0)) { showToast('Quantidade vendida maior que a posição atual (' + inv.quantity + ').', 'error'); return; }
                if (price <= 0 && !fixed) { showToast('Informe o preço de venda.', 'error'); return; }
                if (total <= 0) { showToast('Informe o valor de venda.', 'error'); return; }

                try {
                    // Credita o valor recebido no saldo da conta
                    if (accountId) {
                        var resEv = await _supabase.from('investment_account_events').insert([{
                            user_id: appState.user.id,
                            account_id: accountId,
                            type: 'venda',
                            amount: total,
                            description: desc,
                            event_date: date
                        }]);
                        if (resEv.error) throw resEv.error;
                    }

                    // Atualiza ou remove o ativo
                    var novaQty = fixed ? 0 : ((inv.quantity || 0) - qty);
                    if (novaQty <= 0) {
                        var resDel = await _supabase.from('investments').delete().eq('id', _vendaInvId);
                        if (resDel.error) throw resDel.error;
                    } else {
                        var resUpd = await _supabase.from('investments').update({ quantity: novaQty }).eq('id', _vendaInvId);
                        if (resUpd.error) throw resUpd.error;
                    }

                    closeVendaModal();
                    showToast('Venda registrada! ' + fmtBRL(total) + ' creditado no saldo.', 'success');
                    await syncInvestimentos();
                    await renderInvestimentosTab();
                } catch(e) { showToast('Erro ao registrar venda: ' + (e.message || e), 'error'); console.error(e); }
            }

            function openInvContaModal(id) {
                id = id || null;
                appState.editingInvContaId = id;
                var modal = document.getElementById('modal-inv-conta');
                if (!modal) return;
                var conta = id ? (appState.invContas || []).find(function (c) { return c.id === id; }) : null;
                _invContaSelColor = conta ? (conta.color || 'var(--accent-2)') : 'var(--accent-2)';

                setVal('inv-conta-name', conta ? (conta.name || '') : '');
                setVal('inv-conta-institution', conta ? (conta.institution || '') : '');
                setVal('inv-conta-type', conta ? (conta.type || 'corretora') : 'corretora');

                var cp = document.getElementById('inv-conta-colors');
                var html = '';
                CONTA_COLORS.forEach(function (c) {
                    var isSel = c === _invContaSelColor;
                    var border = isSel ? '2px solid #fff' : '2px solid transparent';
                    var shadow = isSel ? '0 0 0 2px var(--accent-2)' : 'none';
                    html += '<div onclick="selectInvContaColor(\'' + c + '\')" data-icc="' + c + '" style="width:28px;height:28px;border-radius:50%;background:' + c + ';cursor:pointer;border:' + border + ';box-shadow:' + shadow + ';transition:all .2s;flex-shrink:0;"></div>';
                });
                cp.innerHTML = html;

                setText('modal-inv-conta-title', id ? 'Editar Conta' : 'Nova Conta de Investimento');
                modal.style.display = 'flex';
                setTimeout(function () { modal.classList.add('active'); }, 10);
            }

            function editInvConta(id) { openInvContaModal(id); }

            function selectInvContaColor(color) {
                _invContaSelColor = color;
                document.querySelectorAll('#inv-conta-colors [data-icc]').forEach(function (d) {
                    var sel = d.dataset.icc === color;
                    d.style.border = sel ? '2px solid #fff' : '2px solid transparent';
                    d.style.boxShadow = sel ? '0 0 0 2px var(--accent-2)' : 'none';
                });
            }

            function closeInvContaModal() {
                var m = document.getElementById('modal-inv-conta');
                if (!m) return;
                m.classList.remove('active');
                setTimeout(function () { m.style.display = 'none'; }, 300);
            }

            async function saveInvConta() {
                if (!_supabase || !appState.user || !appState.user.id) {
                    if (typeof showToast === 'function') showToast('Faça login para salvar.', 'error');
                    return;
                }
                var name = (document.getElementById('inv-conta-name').value || '').trim();
                if (!name) { showToast('Informe o nome da conta.', 'error'); return; }
                var record = {
                    user_id: appState.user.id,
                    name: name,
                    institution: (document.getElementById('inv-conta-institution').value || '').trim() || null,
                    type: document.getElementById('inv-conta-type').value,
                    color: _invContaSelColor
                });
                try {
                    if (appState.editingInvContaId) {
                        await _supabase.from('investment_accounts').update(record).eq('id', appState.editingInvContaId);
                    } else {
                        await _supabase.from('investment_accounts').insert([record]);
                    }
                    closeInvContaModal();
                    showToast('Conta salva!', 'success');
                    await renderInvestimentosTab();
                } catch (e) { showToast('Erro ao salvar conta.', 'error'); console.error(e); }
            }

            async function deleteInvConta(id) {
                var conta = (appState.invContas || []).find(function (c) { return c.id === id; });
                if (!conta) return;
                var ativosNaConta = (appState.investimentos || []).filter(function (i) { return i.account_id === id; }).length;
                var msg = 'Remover a conta "' + conta.name + '"?';
                if (ativosNaConta > 0) msg += '\n\nOs ' + ativosNaConta + ' ativo(s) vinculado(s) ficarão sem conta.';
                if (!confirm(msg)) return;
                try {
                    await _supabase.from('investment_accounts').delete().eq('id', id);
                    if (appState.invContaFil === id) appState.invContaFil = 'todas';
                    showToast('Conta removida.', 'success');
                    await renderInvestimentosTab();
                } catch (e) { showToast('Erro ao remover conta.', 'error'); console.error(e); }
            }

            // ─────────────────────────────────────────
            // DIVIDENDOS / PROVENTOS
            // ─────────────────────────────────────────
            var _divInvId = null;

            function openDividendoModal(invId) {
                _divInvId = invId;
                var inv = (appState.investimentos || []).find(function(i) { return i.id === invId; });
                if (!inv) return;
                var modal = document.getElementById('modal-dividendo');
                if (!modal) return;
                setText('div-asset-name', inv.name + (inv.symbol ? ' (' + inv.symbol + ')' : ''));
                setText('div-asset-qty', inv.quantity ? inv.quantity + ' cotas/ações' : '');
                setVal('div-f-date', todayISO());
                setVal('div-f-value', '');
                setVal('div-f-type', 'dividendo');
                setText('div-total-display', 'R$ 0,00');
                var histWrap = document.getElementById('div-history-wrap');
                var histList = document.getElementById('div-history-list');
                var divs = (appState.invDividendos || []).filter(function(d) { return d.investment_id === invId; })
                    .sort(function(a,b){ return (b.payment_date||'').localeCompare(a.payment_date||''); });
                if (divs.length && histList) {
                    var h = '';
                    divs.forEach(function(d) {
                        var total = (d.value_per_share || 0) * (inv.quantity || 1);
                        h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;font-size:0.8rem;">';
                        h += '<span style="color:var(--text-muted);">' + (d.payment_date || '—') + '</span>';
                        h += '<span style="color:var(--text-muted);">' + (d.type || 'dividendo') + '</span>';
                        h += '<span style="font-weight:700;color:#10B981;">' + fmtBRL(total) + '</span>';
                        h += '</div>';
                    });
                    histList.innerHTML = h;
                    if (histWrap) histWrap.style.display = 'block';
                } else {
                    if (histWrap) histWrap.style.display = 'none';
                }
                modal.style.display = 'flex';
                setTimeout(function() { modal.classList.add('active'); }, 10);
            }

            function closeDividendoModal() {
                var m = document.getElementById('modal-dividendo');
                if (!m) return;
                m.classList.remove('active');
                setTimeout(function() { m.style.display = 'none'; }, 300);
            }

            function calcDivTotal() {
                var inv = _divInvId ? (appState.investimentos || []).find(function(i) { return i.id === _divInvId; }) : null;
                var qty = inv ? (inv.quantity || 1) : 1;
                var vps = parseFloat(document.getElementById('div-f-value').value) || 0;
                setText('div-total-display', fmtBRL(vps * qty));
            }

            async function saveDividendo() {
                if (!_supabase || !appState.user || !appState.user.id || !_divInvId) return;
                var inv = (appState.investimentos || []).find(function(i) { return i.id === _divInvId; });
                var vps = parseFloat(document.getElementById('div-f-value').value) || 0;
                if (vps <= 0) { showToast('Informe o valor por cota.', 'error'); return; }
                var qty = inv ? (inv.quantity || 1) : 1;
                var total = vps * qty;
                var date = document.getElementById('div-f-date').value || todayISO();
                var type = document.getElementById('div-f-type').value || 'dividendo';
                try {
                    // Salva o dividendo
                    await _supabase.from('investment_dividends').insert([{
                        user_id: appState.user.id,
                        investment_id: _divInvId,
                        account_id: inv ? inv.account_id : null,
                        type: type,
                        value_per_share: vps,
                        payment_date: date
                    }]);
                    // Registra entrada no saldo da conta (provento cai como dinheiro em conta)
                    if (inv && inv.account_id) {
                        await _supabase.from('investment_account_events').insert([{
                            user_id: appState.user.id,
                            account_id: inv.account_id,
                            type: 'provento',
                            amount: total,
                            description: type + ' — ' + (inv.name || ''),
                            event_date: date,
                            reference_id: _divInvId
                        }]);
                    }
                    closeDividendoModal();
                    showToast('Provento lançado! Saldo em Contas atualizado.', 'success');
                    await renderInvestimentosTab();
                } catch(e) { showToast('Erro ao lançar provento.', 'error'); console.error(e); }
            }

            // ─────────────────────────────────────────
            // APORTE EM CONTA
            // ─────────────────────────────────────────
            function openAporteModal() {
                var modal = document.getElementById('modal-inv-aporte');
                if (!modal) return;
                var sel = document.getElementById('aporte-f-account');
                var opts = '<option value="">Selecione a conta…</option>';
                (appState.invContas || []).forEach(function(c) {
                    opts += '<option value="' + c.id + '">' + esc(c.name) + '</option>';
                });
                sel.innerHTML = opts;
                setVal('aporte-f-amount', '');
                setVal('aporte-f-date', todayISO());
                setVal('aporte-f-desc', '');
                modal.style.display = 'flex';
                setTimeout(function() { modal.classList.add('active'); }, 10);
            }

            function closeAporteModal() {
                var m = document.getElementById('modal-inv-aporte');
                if (!m) return;
                m.classList.remove('active');
                setTimeout(function() { m.style.display = 'none'; }, 300);
            }

            async function saveAporte() {
                if (!_supabase || !appState.user || !appState.user.id) return;
                var accountId = document.getElementById('aporte-f-account').value;
                var amount = parseFloat(document.getElementById('aporte-f-amount').value) || 0;
                var date = document.getElementById('aporte-f-date').value || todayISO();
                var desc = (document.getElementById('aporte-f-desc').value || '').trim() || 'Aporte em conta';
                if (!accountId) { showToast('Selecione a conta de destino.', 'error'); return; }
                if (amount <= 0) { showToast('Informe um valor válido.', 'error'); return; }
                try {
                    var res = await _supabase.from('investment_account_events').insert([{
                        user_id: appState.user.id,
                        account_id: accountId,
                        type: 'aporte',
                        amount: amount,
                        description: desc,
                        event_date: date
                    }]);
                    if (res.error) throw res.error;
                    closeAporteModal();
                    showToast('Aporte registrado!', 'success');
                    await syncInvestimentos();
                    await renderInvestimentosTab();
                } catch(e) { showToast('Erro ao registrar aporte: ' + (e.message || e), 'error'); console.error(e); }
            }

            // ─────────────────────────────────────────
            // TRANSFERIR RECURSOS
            // ─────────────────────────────────────────
            function openTransferModal() {
                var modal = document.getElementById('modal-inv-transfer');
                if (!modal) return;
                // Contas do app principal
                var fromSel = document.getElementById('transfer-f-from');
                var fromOpts = '<option value="">Selecione a origem…</option>';
                (appState.accounts || []).forEach(function(a) {
                    fromOpts += '<option value="' + a.id + '">' + esc(a.name) + '</option>';
                });
                fromSel.innerHTML = fromOpts;
                // Contas de investimento
                var toSel = document.getElementById('transfer-f-to');
                var toOpts = '<option value="">Selecione o destino…</option>';
                (appState.invContas || []).forEach(function(c) {
                    toOpts += '<option value="' + c.id + '">' + esc(c.name) + '</option>';
                });
                toSel.innerHTML = toOpts;
                setVal('transfer-f-amount', '');
                setVal('transfer-f-date', todayISO());
                setVal('transfer-f-desc', '');
                modal.style.display = 'flex';
                setTimeout(function() { modal.classList.add('active'); }, 10);
            }

            function closeTransferModal() {
                var m = document.getElementById('modal-inv-transfer');
                if (!m) return;
                m.classList.remove('active');
                setTimeout(function() { m.style.display = 'none'; }, 300);
            }

            async function saveTransfer() {
                if (!_supabase || !appState.user || !appState.user.id) return;
                var fromId = document.getElementById('transfer-f-from').value;
                var toId = document.getElementById('transfer-f-to').value;
                var amount = parseFloat(document.getElementById('transfer-f-amount').value) || 0;
                var date = document.getElementById('transfer-f-date').value || todayISO();
                var desc = (document.getElementById('transfer-f-desc').value || '').trim() || 'Transferência para investimentos';
                if (!toId) { showToast('Selecione a conta de destino.', 'error'); return; }
                if (amount <= 0) { showToast('Informe um valor válido.', 'error'); return; }
                var invConta = (appState.invContas || []).find(function(c) { return c.id === toId; });
                var toName = invConta ? invConta.name : 'investimentos';
                try {
                    // Crédito na conta de investimento
                    var resInv = await _supabase.from('investment_account_events').insert([{
                        user_id: appState.user.id,
                        account_id: toId,
                        type: 'transfer',
                        amount: amount,
                        description: desc,
                        event_date: date
                    }]);
                    if (resInv.error) throw resInv.error;

                    // Débito na conta do app, se selecionada
                    if (fromId && appState.accounts) {
                        var fromAcc = (appState.accounts || []).find(function(a) { return a.id === fromId; });
                        if (fromAcc) {
                            var resTx = await _supabase.from('transactions').insert([{
                                user_id: appState.user.id,
                                account: fromAcc.name,
                                type: 'expense',
                                val: amount,
                                description: 'Aporte → ' + toName,
                                date: date,
                                category: 'Investimentos',
                                regime: 'Variável',
                                occurrence: 'Única'
                            }]);
                            if (resTx.error) throw resTx.error;
                        }
                    }

                    closeTransferModal();
                    showToast('Transferência realizada!', 'success');
                    await syncInvestimentos();
                    await renderInvestimentosTab();
                } catch(e) { showToast('Erro ao transferir: ' + (e.message || e), 'error'); console.error(e); }
            }

            // ─────────────────────────────────────────
            // HISTÓRICO DA CONTA (modal)
            // ─────────────────────────────────────────
            var _histContaId = null;

            function openContaHistoryModal(contaId) {
                _histContaId = contaId;
                var conta = (appState.invContas || []).find(function(c) { return c.id === contaId; });
                var modal = document.getElementById('modal-inv-conta-hist');
                if (!modal) return;
                setText('conta-hist-title', conta ? conta.name : 'Histórico');
                setText('conta-hist-sub', conta && conta.institution ? conta.institution : '');
                setVal('conta-hist-period', '');
                renderContaHistory();
                modal.style.display = 'flex';
                setTimeout(function() { modal.classList.add('active'); }, 10);
            }

            function closeContaHistoryModal() {
                var m = document.getElementById('modal-inv-conta-hist');
                if (!m) return;
                m.classList.remove('active');
                setTimeout(function() { m.style.display = 'none'; }, 300);
            }

            var _contaHistPeriod = '';

            function toggleContaHistPeriod(ev) {
                ev.stopPropagation();
                var picker = document.getElementById('conta-hist-period-picker');
                picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
            }

            function setContaHistPeriod(val) {
                _contaHistPeriod = val;
                var input = document.getElementById('conta-hist-period');
                if (input) input.value = val;
                var label = document.getElementById('conta-hist-period-label');
                if (label) label.textContent = val ? _fmtPeriodLabel(val) : 'Todos os períodos';
                document.getElementById('conta-hist-period-picker').style.display = 'none';
                renderContaHistory();
            }

            function setContaHistPeriodRelative(offset) {
                var d = new Date();
                d.setMonth(d.getMonth() + offset);
                var val = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
                setContaHistPeriod(val);
            }

            function _fmtPeriodLabel(ym) {
                if (!ym) return 'Todos os períodos';
                var parts = ym.split('-');
                var meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                return meses[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
            }

            document.addEventListener('click', function(e) {
                var picker = document.getElementById('conta-hist-period-picker');
                var btn = document.getElementById('conta-hist-period-btn');
                if (picker && picker.style.display !== 'none' && !picker.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                    picker.style.display = 'none';
                }
            });

            function renderContaHistory() {
                var period = _contaHistPeriod;
                var events = (appState.invAccountEvents || []).filter(function(e) { return e.account_id === _histContaId; });
                if (period) events = events.filter(function(e) { return (e.event_date || '').substring(0, 7) === period; });

                // Dividendos do período
                var divEvents = (appState.invDividendos || []).filter(function(d) { return d.account_id === _histContaId; });
                if (period) divEvents = divEvents.filter(function(d) { return (d.payment_date || '').substring(0, 7) === period; });

                // Compras (investimentos vinculados à conta)
                var compras = (appState.investimentos || []).filter(function(i) { return i.account_id === _histContaId; });
                if (period) compras = compras.filter(function(i) { return (i.purchase_date || '').substring(0, 7) === period; });

                // Resumo
                var totEntradas = events.filter(function(e) { return e.amount > 0; }).reduce(function(s,e) { return s + e.amount; }, 0);
                var totSaidas = Math.abs(events.filter(function(e) { return e.amount < 0; }).reduce(function(s,e) { return s + e.amount; }, 0));
                var totCompras = compras.reduce(function(s,i) { return s + (i.quantity||1)*(i.purchase_price||0); }, 0);
                var saldo = calcSaldoContas(_histContaId);

                var summaryEl = document.getElementById('conta-hist-summary');
                if (summaryEl) {
                    summaryEl.innerHTML =
                        '<div style="background:#f0fdf4;border-radius:10px;padding:10px 12px;"><div style="font-size:0.65rem;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:0.5px;">Entradas</div><div style="font-size:1rem;font-weight:800;color:#059669;">' + fmtBRL(totEntradas) + '</div></div>' +
                        '<div style="background:#fff7ed;border-radius:10px;padding:10px 12px;"><div style="font-size:0.65rem;font-weight:700;color:#d97706;text-transform:uppercase;letter-spacing:0.5px;">Compras</div><div style="font-size:1rem;font-weight:800;color:#d97706;">' + fmtBRL(totCompras) + '</div></div>' +
                        '<div style="background:rgba(124,58,237,0.06);border-radius:10px;padding:10px 12px;"><div style="font-size:0.65rem;font-weight:700;color:var(--accent-2);text-transform:uppercase;letter-spacing:0.5px;">Saldo Total</div><div style="font-size:1rem;font-weight:800;color:var(--accent-2);">' + fmtBRL(saldo) + '</div></div>';
                }

                // Lista de eventos
                var TYPE_INFO = {
                    aporte:   { icon: '💵', label: 'Aporte',      cls: 'deposit',  sign: '+' },
                    transfer: { icon: '↔️', label: 'Transferência', cls: 'transfer', sign: '+' },
                    provento: { icon: '💰', label: 'Provento',    cls: 'provento', sign: '+' },
                    compra:   { icon: '📈', label: 'Compra',      cls: 'compra',   sign: '-' }
                });

                // Monta itens combinados
                var items = [];
                events.forEach(function(e) {
                    items.push({ id: e.id, date: e.event_date || '', type: e.type, desc: e.description || e.type, amount: e.amount, deletable: true });
                });
                compras.forEach(function(i) {
                    var total = (i.quantity||1)*(i.purchase_price||0);
                    items.push({ id: null, date: i.purchase_date || '', type: 'compra', desc: 'Compra — ' + (i.name||''), amount: -total, deletable: false });
                });
                items.sort(function(a,b) { return (b.date||'').localeCompare(a.date||''); });

                var listEl = document.getElementById('conta-hist-list');
                if (!listEl) return;
                if (!items.length) {
                    listEl.innerHTML = '<div style="text-align:center;padding:32px 0;color:var(--text-muted);font-size:0.875rem;">Nenhum evento encontrado.</div>';
                    return;
                }
                var h = '';
                items.forEach(function(item) {
                    var info = TYPE_INFO[item.type] || { icon: '📋', label: item.type, cls: 'deposit', sign: item.amount >= 0 ? '+' : '-' };
                    var amtCls = item.amount >= 0 ? 'pos' : 'neg';
                    var amtStr = (item.amount >= 0 ? '+' : '-') + fmtBRL(Math.abs(item.amount));
                    h += '<div class="inv-hist-item" style="position:relative;">';
                    h += '<div class="inv-hist-icon ' + info.cls + '">' + info.icon + '</div>';
                    h += '<div class="inv-hist-meta"><div class="inv-hist-desc">' + esc(item.desc) + '</div>';
                    h += '<div class="inv-hist-date">' + (item.date || '—') + ' · ' + info.label + '</div></div>';
                    h += '<div style="display:flex;align-items:center;gap:8px;">';
                    h += '<div class="inv-hist-amount ' + amtCls + '">' + amtStr + '</div>';
                    if (item.deletable && item.id) {
                        h += '<button onclick="deleteInvAccountEvent(\'' + item.id + '\')" title="Excluir movimentação" style="background:none;border:none;cursor:pointer;color:#EF4444;padding:4px;opacity:0.6;transition:opacity .15s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6"><i data-lucide="trash-2" style="width:13px;height:13px;"></i></button>';
                    }
                    h += '</div>';
                    h += '</div>';
                });
                listEl.innerHTML = h;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            async function deleteInvAccountEvent(id) {
                if (!_supabase || !id) return;
                if (!confirm('Excluir esta movimentação?')) return;
                try {
                    var res = await _supabase.from('investment_account_events').delete().eq('id', id);
                    if (res.error) throw res.error;
                    await syncInvestimentos();
                    renderContaHistory();
                    await renderInvestimentosTab();
                    showToast('Movimentação excluída.', 'success');
                } catch(e) { showToast('Erro ao excluir: ' + (e.message || e), 'error'); console.error(e); }
            }

            // ─────────────────────────────────────────
            // SALDO EM CONTAS — DETALHE (modal)
            // ─────────────────────────────────────────
            function openSaldoDetalheModal() {
                var modal = document.getElementById('modal-inv-saldo-detalhe');
                if (!modal) return;
                setVal('saldo-detalhe-period', '');
                renderSaldoDetalhe();
                modal.style.display = 'flex';
                setTimeout(function() { modal.classList.add('active'); }, 10);
            }

            function closeSaldoDetalheModal() {
                var m = document.getElementById('modal-inv-saldo-detalhe');
                if (!m) return;
                m.classList.remove('active');
                setTimeout(function() { m.style.display = 'none'; }, 300);
            }

            function renderSaldoDetalhe() {
                var period = (document.getElementById('saldo-detalhe-period') || {}).value || '';
                var totSaldo = 0, totProventos = 0;
                var contas = appState.invContas || [];

                // Totais globais
                (appState.invAccountEvents || []).forEach(function(e) {
                    var ok = !period || (e.event_date || '').substring(0, 7) === period;
                    if (ok) {
                        if (e.type === 'provento') totProventos += (e.amount || 0);
                        totSaldo += (e.amount || 0);
                    }
                });

                var totalsEl = document.getElementById('saldo-detalhe-totals');
                if (totalsEl) {
                    totalsEl.innerHTML =
                        '<div style="background:rgba(124,58,237,0.06);border-radius:12px;padding:14px 16px;">' +
                            '<div style="font-size:0.65rem;font-weight:700;color:var(--accent-2);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Saldo Total</div>' +
                            '<div style="font-size:1.35rem;font-weight:800;color:var(--accent-2);font-family:\'Outfit\',sans-serif;">' + fmtBRL(totSaldo) + '</div>' +
                        '</div>' +
                        '<div style="background:#f0fdf4;border-radius:12px;padding:14px 16px;">' +
                            '<div style="font-size:0.65rem;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Proventos' + (period ? ' no período' : ' acumulados') + '</div>' +
                            '<div style="font-size:1.35rem;font-weight:800;color:#059669;font-family:\'Outfit\',sans-serif;">' + fmtBRL(totProventos) + '</div>' +
                        '</div>';
                }

                // Por conta
                var listEl = document.getElementById('saldo-detalhe-list');
                if (!listEl) return;
                if (!contas.length) {
                    listEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.875rem;">Nenhuma conta cadastrada.</div>';
                    return;
                }
                var h = '';
                contas.forEach(function(c) {
                    var saldo = calcSaldoContasFiltered(c.id, period || null);
                    var provs = (appState.invAccountEvents || [])
                        .filter(function(e) { return e.account_id === c.id && e.type === 'provento' && (!period || (e.event_date||'').substring(0,7) === period); })
                        .reduce(function(s,e) { return s + (e.amount||0); }, 0);
                    var saldoColor = saldo >= 0 ? 'var(--accent-2)' : 'var(--danger)';
                    h += '<div class="inv-saldo-conta-row">';
                    h += '<div class="inv-saldo-dot" style="background:' + (c.color || 'var(--accent-2)') + ';"></div>';
                    h += '<div class="inv-saldo-info"><div class="inv-saldo-name">' + esc(c.name) + '</div>';
                    if (c.institution) h += '<div class="inv-saldo-inst">' + esc(c.institution) + '</div>';
                    h += '</div>';
                    h += '<div style="text-align:right;">';
                    h += '<div style="font-size:1rem;font-weight:800;color:' + saldoColor + ';font-family:\'Outfit\',sans-serif;">' + fmtBRL(saldo) + '</div>';
                    if (provs > 0) h += '<div style="font-size:0.7rem;color:#059669;font-weight:600;">' + fmtBRL(provs) + ' em proventos</div>';
                    h += '</div>';
                    h += '</div>';
                });
                listEl.innerHTML = h;
            }

            // Expor funções globalmente para os onclick do HTML
            function toggleMovMenu() {
                var menu = document.getElementById('inv-mov-menu');
                if (!menu) return;
                var isOpen = menu.style.display === 'block';
                menu.style.display = isOpen ? 'none' : 'block';
                if (!isOpen) {
                    setTimeout(function() {
                        document.addEventListener('click', function closeMenu(e) {
                            var wrap = document.getElementById('inv-mov-wrap');
                            if (wrap && !wrap.contains(e.target)) {
                                menu.style.display = 'none';
                                document.removeEventListener('click', closeMenu);
                            }
                        });
                    }, 0);
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            window.toggleMovMenu = toggleMovMenu;

            function toggleRentabPeriodMenu() {
                var menu = document.getElementById('rentab-period-menu');
                if (!menu) return;
                var isOpen = menu.style.display === 'block';
                menu.style.display = isOpen ? 'none' : 'block';
                if (!isOpen) {
                    setTimeout(function() {
                        document.addEventListener('click', function closeMenu(e) {
                            var wrap = document.getElementById('rentab-period-wrap');
                            if (wrap && !wrap.contains(e.target)) {
                                menu.style.display = 'none';
                                document.removeEventListener('click', closeMenu);
                            }
                        });
                    }, 0);
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
            window.toggleRentabPeriodMenu = toggleRentabPeriodMenu;
            window.renderInvestimentosTab = renderInvestimentosTab;
            window.refreshInvCotacoes = refreshInvCotacoes;
            window.openInvModal = openInvModal;
            window.closeInvModal = closeInvModal;
            window.setInvType = setInvType;
            window.saveInvestimento = saveInvestimento;
            window.editInvestimento = editInvestimento;
            window.deleteInvestimento = deleteInvestimento;
            window.openInvContaModal = openInvContaModal;
            window.closeInvContaModal = closeInvContaModal;
            window.editInvConta = editInvConta;
            window.deleteInvConta = deleteInvConta;
            window.selectInvContaColor = selectInvContaColor;
            window.saveInvConta = saveInvConta;
            window.filterInvByType = filterInvByType;
            window.filterInvByConta = filterInvByConta;
            window.setRentabPeriod = setRentabPeriod;
            window.buscarCotacaoTicker = buscarCotacaoTicker;
            window.calcTotalInvestido = calcTotalInvestido;
            window.setBrapiToken = setBrapiToken;
            window.openDividendoModal = openDividendoModal;
            window.closeDividendoModal = closeDividendoModal;
            window.calcDivTotal = calcDivTotal;
            window.saveDividendo = saveDividendo;
            window.openAporteModal = openAporteModal;
            window.closeAporteModal = closeAporteModal;
            window.saveAporte = saveAporte;
            window.openTransferModal = openTransferModal;
            window.closeTransferModal = closeTransferModal;
            window.saveTransfer = saveTransfer;
            window.closeDeleteInvModal = closeDeleteInvModal;
            window.confirmDeleteInvestimento = confirmDeleteInvestimento;
            window.openVendaModal = openVendaModal;
            window.closeVendaModal = closeVendaModal;
            window.saveVenda = saveVenda;
            window.calcVendaTotal = calcVendaTotal;
            window.openContaHistoryModal = openContaHistoryModal;
            window.closeContaHistoryModal = closeContaHistoryModal;
            window.renderContaHistory = renderContaHistory;
            window.toggleContaHistPeriod = toggleContaHistPeriod;
            window.setContaHistPeriod = setContaHistPeriod;
            window.setContaHistPeriodRelative = setContaHistPeriodRelative;
            window.deleteInvAccountEvent = deleteInvAccountEvent;
            window.openSaldoDetalheModal = openSaldoDetalheModal;
            window.closeSaldoDetalheModal = closeSaldoDetalheModal;
            window.renderSaldoDetalhe = renderSaldoDetalhe;

            console.log('[INV] Funções expostas globalmente');
        })();

(function () {
        'use strict';

        const CACHE_TTL = 15 * 60 * 1000;

        function cacheGet(key) {
            try {
                const raw = sessionStorage.getItem('lbf_' + key);
                if (!raw) return null;
                const { data, ts } = JSON.parse(raw);
                if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem('lbf_' + key); return null; }
                return data;
            } catch { return null; }
        }

        function cacheSet(key, data) {
            try { sessionStorage.setItem('lbf_' + key, JSON.stringify({ data, ts: Date.now() })); } catch {}
        }

        async function fetchBCB(cod, n) {
            const key = `bcb_${cod}_${n}`;
            const cached = cacheGet(key);
            if (cached) return cached;
            const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${cod}/dados/ultimos/${n}?formato=json`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`BCB ${cod}: ${res.status}`);
            const data = await res.json();
            cacheSet(key, data);
            return data;
        }

        function fmt(val, dec, suffix) {
            if (val == null || val === '' || isNaN(parseFloat(val))) return '—';
            return parseFloat(val).toFixed(dec ?? 2) + (suffix ?? '%');
        }

        function trendBadge(val) {
            const n = parseFloat(val);
            if (isNaN(n)) return '';
            if (n > 0) return `<span class="ind-index-badge up">▲ ${Math.abs(n).toFixed(2)}%</span>`;
            if (n < 0) return `<span class="ind-index-badge down">▼ ${Math.abs(n).toFixed(2)}%</span>`;
            return `<span class="ind-index-badge neutral">◆ ${Math.abs(n).toFixed(2)}%</span>`;
        }

        function relTime(dateStr) {
            if (!dateStr) return '';
            const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
            if (diff < 60)    return 'agora';
            if (diff < 3600)  return `há ${Math.floor(diff / 60)} min`;
            if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
            return `há ${Math.floor(diff / 86400)}d`;
        }

        /* ─────────────────── INDICADORES ─────────────────── */

        async function renderIndicadoresTab(forceRefresh) {
            if (forceRefresh) {
                ['bcb_432_1','bcb_12_1','bcb_433_13','bcb_13522_1','bcb_189_13',
                 'bcb_4513_1','bcb_24364_1','bcb_3546_1','bcb_23645_1','bcb_4393_1','bcb_28558_1']
                    .forEach(k => sessionStorage.removeItem('lbf_' + k));
            }

            showMarqueeSkeletons();
            showFundamentalsSkeletons();

            const settled = await Promise.allSettled([
                fetchBCB(432,  1),   // 0  SELIC meta % a.a.
                fetchBCB(12,   1),   // 1  CDI diária % a.d.
                fetchBCB(433,  13),  // 2  IPCA mensal (13 meses p/ calcular 12m)
                fetchBCB(13522,1),   // 3  IPCA acum. 12m
                fetchBCB(189,  13),  // 4  IGP-M mensal (13 meses)
                fetchBCB(4513, 1),   // 5  Dívida bruta / PIB %
                fetchBCB(24364,1),   // 6  IBC-Br var. mensal
                fetchBCB(3546, 1),   // 7  Reservas internacionais US$ mi
                fetchBCB(23645,1),   // 8  IDP US$ mi
                fetchBCB(4393, 1),   // 9  ICC FGV pontos
                fetchBCB(28558,1),   // 10 UCI %
            ]);

            const ok  = (i) => settled[i].status === 'fulfilled';
            const val = (i) => ok(i) ? (settled[i].value?.[0]?.valor ?? null) : null;

            const selic   = val(0);
            const cdiDia  = parseFloat(val(1));
            const cdiAnual = !isNaN(cdiDia) ? ((Math.pow(1 + cdiDia / 100, 252) - 1) * 100).toFixed(2) : null;
            const ipcaMes = val(2);
            const ipca12  = val(3);

            let igpmMes = null, igpm12 = null;
            if (ok(4) && settled[4].value?.length) {
                igpmMes = settled[4].value[settled[4].value.length - 1]?.valor ?? null;
                if (settled[4].value.length >= 12)
                    igpm12 = settled[4].value.slice(-12).reduce((s, x) => s + parseFloat(x.valor || 0), 0).toFixed(2);
            }

            const markers = [
                { name:'CDI',   value: cdiAnual  ? fmt(cdiAnual, 2, '% a.a.') : '—', label:'Taxa ao Ano',       acum: null,                            trend: null },
                { name:'SELIC', value: selic      ? fmt(selic,   2, '% a.a.') : '—', label:'Meta Banco Central', acum: null,                            trend: null },
                { name:'IPCA',  value: ipcaMes    ? fmt(ipcaMes, 2, '%')       : '—', label:'Variação mensal',   acum: ipca12  ? fmt(ipca12, 2, '% (12m)') : null, trend: ipcaMes },
                { name:'IGP-M', value: igpmMes    ? fmt(igpmMes, 2, '%')       : '—', label:'Variação mensal',   acum: igpm12  ? fmt(igpm12, 2, '% (12m)') : null, trend: igpmMes },
            ];

            buildMarquee(markers);

            const juroReal = (selic != null && ipca12 != null)
                ? fmt(parseFloat(selic) - parseFloat(ipca12), 2, '% a.a.')
                : '—';

            const reservas = val(7);
            const reservasBi = reservas ? fmt(parseFloat(reservas) / 1000, 1, ' bi') : '—';

            buildFundamentals({
                dividaPIB: val(5), juroReal,
                ibcbr:     val(6), uci: val(10),
                reservas:  reservasBi,
                idp:       val(8)  ? fmt(parseFloat(val(8)), 0, ' mi') : '—',
                icc:       val(9),
                ipca12,
            });
        }

        /* Count-up animation for metric values */
        function animateCountUp(el) {
            const raw = el.textContent.trim();
            const match = raw.match(/([\d]+([.,][\d]+)?)/);
            if (!match) return;
            const numStr = match[1].replace(',', '.');
            const num = parseFloat(numStr);
            if (isNaN(num) || num === 0) return;
            const dec = (numStr.includes('.') ? numStr.split('.')[1].length : 0);
            const prefix = raw.slice(0, raw.indexOf(match[1]));
            const suffix = raw.slice(raw.indexOf(match[1]) + match[1].length);
            const duration = 900, start = performance.now();
            (function step(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = prefix + (num * eased).toFixed(dec) + suffix;
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = raw;
            })(start);
        }

        function showMarqueeSkeletons() {
            const t = document.getElementById('ind-marquee-track');
            if (!t) return;
            const sk = `<div class="ind-index-card">
                <div class="ind-index-top">
                    <span class="ind-skeleton" style="height:10px;width:50px;"></span>
                </div>
                <span class="ind-skeleton" style="height:32px;width:120px;margin-top:4px;"></span>
                <span class="ind-skeleton" style="height:9px;width:90px;margin-top:6px;"></span>
                <span class="ind-skeleton" style="height:18px;width:70px;border-radius:20px;margin-top:8px;"></span>
            </div>`;
            t.innerHTML = sk.repeat(8);
            t.style.animation = 'none';
        }

        function buildMarquee(markers) {
            const t = document.getElementById('ind-marquee-track');
            if (!t) return;
            const card = m => `
                <div class="ind-index-card" data-key="${m.name}">
                    <div class="ind-index-top">
                        <span class="ind-index-name">${m.name}</span>
                        <span class="ind-live-dot"></span>
                    </div>
                    <div class="ind-index-value">${m.value}</div>
                    <div class="ind-index-label">${m.label}</div>
                    ${m.acum ? `<div class="ind-index-acum">${m.acum}</div>` : ''}
                    ${m.trend != null ? trendBadge(m.trend) : ''}
                </div>`;
            /* 4 copies total → animate -50% = 2 copies → seamless infinite loop */
            const set = markers.map(card).join('');
            t.innerHTML = set.repeat(4);
            t.style.animation = 'marquee-scroll 40s linear infinite';
        }

        function showFundamentalsSkeletons() {
            const g = document.getElementById('ind-fundamentals-grid');
            if (!g) return;
            const row = `<div class="ind-fund-metric">
                <div class="ind-fund-metric-row">
                    <span class="ind-skeleton" style="height:10px;width:130px;"></span>
                    <span class="ind-skeleton" style="height:18px;width:70px;"></span>
                </div>
                <span class="ind-skeleton" style="height:8px;width:160px;margin-top:5px;"></span>
            </div>`;
            g.innerHTML = ['fiscal','atividade','externo','expectativas'].map(cls => `
                <div class="ind-fund-card ${cls}">
                    <div class="ind-fund-head">
                        <div class="ind-fund-icon">
                            <span class="ind-skeleton" style="width:22px;height:22px;border-radius:4px;"></span>
                        </div>
                        <div class="ind-fund-head-text">
                            <div class="ind-skeleton" style="height:9px;width:80px;margin-bottom:6px;"></div>
                            <div class="ind-skeleton" style="height:15px;width:160px;margin-bottom:8px;"></div>
                            <div class="ind-skeleton" style="height:8px;width:95%;"></div>
                            <div class="ind-skeleton" style="height:8px;width:75%;margin-top:4px;"></div>
                        </div>
                    </div>
                    <div class="ind-fund-body">${row + row}</div>
                </div>`).join('');
        }

        function mc(v) {
            const n = parseFloat(v);
            return isNaN(n) ? '' : n >= 0 ? 'positive' : 'negative';
        }

        function buildFundamentals({ dividaPIB, juroReal, ibcbr, uci, reservas, idp, icc, ipca12 }) {
            const g = document.getElementById('ind-fundamentals-grid');
            if (!g) return;
            const dPIB = parseFloat(dividaPIB), iccN = parseFloat(icc),
                  ipca12N = parseFloat(ipca12), ibcbrN = parseFloat(ibcbr),
                  uciN = parseFloat(uci);

            const cards = [
                {
                    cls:'fiscal', icon:'landmark', tagline:'Saúde Fiscal',
                    title:'Nem só de PIB vive o país',
                    desc:'A sustentabilidade das contas públicas define quanto o governo pode gastar — e a confiança dos investidores no Brasil a longo prazo.',
                    metrics:[
                        {
                            label:'Dívida Bruta / PIB',
                            value: dividaPIB ? fmt(dividaPIB,1,'%') : '—',
                            cls: dPIB > 90 ? 'negative' : dPIB > 75 ? 'warning' : '',
                            ctx: dPIB > 90 ? '⚠ Acima da zona de alerta crítico (90%)' : dPIB > 75 ? 'Atenção: aproximando do limite' : '✓ Dentro do intervalo administrável',
                        },
                        {
                            label:'Juro Real (SELIC − IPCA 12m)',
                            value: juroReal,
                            cls: '',
                            ctx:'Entre os maiores juros reais do mundo — custo alto do capital',
                        },
                    ]
                },
                {
                    cls:'atividade', icon:'trending-up', tagline:'Atividade Econômica',
                    title:'O motor do crescimento',
                    desc:'Indica se a economia está acelerando ou recuando. Quando o motor aquece, emprego, renda e consumo sobem junto.',
                    metrics:[
                        {
                            label:'IBC-Br — proxy mensal do PIB',
                            value: ibcbr ? fmt(ibcbr,2,'%') : '—',
                            cls: mc(ibcbr),
                            ctx: ibcbrN > 0 ? '✓ Atividade econômica em expansão' : ibcbrN < 0 ? '⚠ Contração na atividade — sinal de alerta' : 'Atividade estável no mês',
                        },
                        {
                            label:'UCI — Utilização da Capacidade',
                            value: uci ? fmt(uci,1,'%') : '—',
                            cls: uciN > 82 ? 'warning' : '',
                            ctx: uciN > 82 ? 'UCI elevada pressiona custos e inflação' : 'Capacidade produtiva com folga',
                        },
                    ]
                },
                {
                    cls:'externo', icon:'globe', tagline:'Setor Externo',
                    title:'O país de olho no mundo',
                    desc:'Reservas internacionais blindam o Real em crises. O IDP revela o quanto o capital estrangeiro aposta no Brasil.',
                    metrics:[
                        {
                            label:'Reservas Internacionais',
                            value: `US$ ${reservas}`,
                            cls: '',
                            ctx:'Colchão cambial que protege o país de choques externos',
                        },
                        {
                            label:'IDP — Investimento Direto no País',
                            value: `US$ ${idp}`,
                            cls: '',
                            ctx:'Capital estrangeiro chegando ao Brasil no período',
                        },
                    ]
                },
                {
                    cls:'expectativas', icon:'lightbulb', tagline:'Expectativas',
                    title:'Achismo qualificado',
                    desc:'O que as pessoas esperam do futuro já molda o presente: consumo, precificação de ativos e decisões de investimento.',
                    metrics:[
                        {
                            label:'Confiança do Consumidor FGV (ICC)',
                            value: icc ? fmt(icc,1,' pts') : '—',
                            cls: iccN > 100 ? 'positive' : iccN < 80 ? 'negative' : '',
                            ctx: iccN > 100 ? '✓ Consumidor otimista com o futuro próximo' : iccN < 80 ? '⚠ Pessimismo do consumidor — sinal de cautela' : 'Acima de 100 = predominância do otimismo',
                        },
                        {
                            label:'IPCA Acumulado 12 meses',
                            value: ipca12 ? fmt(ipca12,2,'%') : '—',
                            cls: ipca12N > 4.5 ? 'negative' : ipca12N < 1.5 ? 'warning' : 'positive',
                            ctx:`Meta BACEN: 3% ± 1,5 p.p. — teto da banda: 4,5%`,
                        },
                    ]
                },
            ];

            g.innerHTML = cards.map(c => `
                <div class="ind-fund-card ${c.cls}">
                    <div class="ind-fund-head">
                        <div class="ind-fund-icon">
                            <i data-lucide="${c.icon}" style="width:20px;height:20px;"></i>
                        </div>
                        <div class="ind-fund-head-text">
                            <div class="ind-fund-tagline">${c.tagline}</div>
                            <div class="ind-fund-title">${c.title}</div>
                            <div class="ind-fund-desc">${c.desc}</div>
                        </div>
                    </div>
                    <div class="ind-fund-body">
                        ${c.metrics.map(m => `
                        <div class="ind-fund-metric">
                            <div class="ind-fund-metric-row">
                                <span class="ind-metric-label">${m.label}</span>
                                <span class="ind-metric-value ${m.cls}">${m.value}</span>
                            </div>
                            <div class="ind-metric-ctx">${m.ctx}</div>
                        </div>`).join('')}
                    </div>
                </div>`).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
            /* Trigger count-up on all metric values */
            setTimeout(() => {
                document.querySelectorAll('#ind-fundamentals-grid .ind-metric-value').forEach(animateCountUp);
            }, 80);
        }

        /* ─────────────────── NOTÍCIAS ─────────────────── */

        async function renderNoticiasTab(forceRefresh) {
            if (forceRefresh) {
                sessionStorage.removeItem('lbf_news_brasil');
                sessionStorage.removeItem('lbf_news_global');
            }

            showNewsSkeletons('news-brasil-list');
            showNewsSkeletons('news-global-list');

            /* Fetch with timeout + User-Agent para Reddit */
            function tFetch(url, ms) {
                return Promise.race([
                    fetch(url, { headers: { 'Accept': 'application/json' } }),
                    new Promise((_, r) => setTimeout(() => r(new Error('timeout')), ms || 9000))
                ]);
            }

            function redditMap(c) {
                return {
                    title:   c.data.title,
                    link:    c.data.url?.startsWith('http') ? c.data.url : 'https://reddit.com' + c.data.permalink,
                    author:  c.data.subreddit_name_prefixed || 'Reddit',
                    pubDate: new Date(c.data.created_utc * 1000).toISOString(),
                });
            }
            function redditFilter(c) {
                return !c.data.stickied && c.data.title.length > 20 && c.kind === 't3';
            }

            /* ── BRASIL: fontes financeiras brasileiras ── */
            async function loadBrasil() {
                const cached = cacheGet('news_brasil');
                if (cached) return cached;

                /* Estratégia 1: subreddits financeiros brasileiros (pt-BR, conteúdo BR) */
                try {
                    const res = await tFetch(
                        'https://www.reddit.com/r/investimentos+mercadofinanceiro+financaspessoais+economia+BrasilFinance/new.json?limit=30'
                    );
                    if (res.ok) {
                        const j = await res.json();
                        const items = (j.data?.children || []).filter(redditFilter).slice(0, 8).map(redditMap);
                        if (items.length >= 3) { cacheSet('news_brasil', items); return items; }
                    }
                } catch(e) { console.warn('[NEWS] Reddit BR subs:', e.message); }

                /* Estratégia 2: Reddit Search — termos financeiros BR */
                try {
                    const q = encodeURIComponent('ibovespa OR selic OR bovespa OR "banco central" OR ipca OR "bolsa brasil"');
                    const res = await tFetch(
                        `https://www.reddit.com/search.json?q=${q}&sort=new&limit=25&restrict_sr=false`
                    );
                    if (res.ok) {
                        const j = await res.json();
                        const items = (j.data?.children || []).filter(redditFilter).slice(0, 8).map(redditMap);
                        if (items.length >= 2) { cacheSet('news_brasil', items); return items; }
                    }
                } catch(e) { console.warn('[NEWS] Reddit Search BR:', e.message); }

                /* Estratégia 3: Guardian Business — apenas artigos sobre Brasil/América Latina */
                try {
                    const res = await tFetch(
                        'https://content.guardianapis.com/search?section=business&q=brazil+economy+OR+brazil+finance+OR+latin+america+economy&api-key=test&order-by=newest&page-size=10&format=json'
                    );
                    if (res.ok) {
                        const j = await res.json();
                        const brTerms = ['brazil','brasil','latin','bovespa','ibovespa','petrobras','vale','embraer','lula','selic','ipca'];
                        const items = (j.response?.results || [])
                            .filter(r => {
                                const t = (r.webTitle||'').toLowerCase();
                                return brTerms.some(k => t.includes(k)) || (r.sectionId||'') === 'business';
                            })
                            .slice(0, 8)
                            .map(r => ({ title:r.webTitle, link:r.webUrl, author:'The Guardian – Business', pubDate:r.webPublicationDate }));
                        if (items.length >= 1) { cacheSet('news_brasil', items); return items; }
                    }
                } catch(e) { console.warn('[NEWS] Guardian BR:', e.message); }

                /* Estratégia 4: r/brasil como último recurso */
                try {
                    const res = await tFetch('https://www.reddit.com/r/brasil/search.json?q=economia+OR+mercado+OR+investimento&sort=new&restrict_sr=on&limit=20');
                    if (res.ok) {
                        const j = await res.json();
                        const items = (j.data?.children || []).filter(redditFilter).slice(0, 8).map(redditMap);
                        if (items.length >= 1) { cacheSet('news_brasil', items); return items; }
                    }
                } catch(e) { console.warn('[NEWS] Reddit r/brasil search:', e.message); }

                return null;
            }

            /* ── GLOBAL: The Guardian Business + Reddit investing ── */
            async function loadGlobal() {
                const cached = cacheGet('news_global');
                if (cached) return cached;

                /* Fonte primária: The Guardian Business (chave "test" pública) */
                try {
                    const res = await tFetch(
                        'https://content.guardianapis.com/search?section=business&q=economy+stock+market+fed+interest+rate+investing&api-key=test&order-by=newest&page-size=10&format=json'
                    );
                    if (res.ok) {
                        const j = await res.json();
                        const items = (j.response?.results || []).map(r => ({
                            title:   r.webTitle,
                            link:    r.webUrl,
                            author:  r.sectionName || 'The Guardian',
                            pubDate: r.webPublicationDate,
                        }));
                        if (items.length >= 2) { cacheSet('news_global', items); return items; }
                    }
                } catch(e) { console.warn('[NEWS] Guardian GL:', e.message); }

                /* Fallback: Reddit investing + economics */
                try {
                    const res = await tFetch(
                        'https://www.reddit.com/r/investing+economics+worldnews/new.json?limit=25&t=day'
                    );
                    if (res.ok) {
                        const j = await res.json();
                        const items = (j.data?.children || [])
                            .filter(c => !c.data.stickied && c.data.title.length > 20)
                            .slice(0, 8)
                            .map(c => ({
                                title:   c.data.title,
                                link:    c.data.url?.startsWith('http') ? c.data.url : 'https://reddit.com' + c.data.permalink,
                                author:  c.data.subreddit_name_prefixed || 'r/investing',
                                pubDate: new Date(c.data.created_utc * 1000).toISOString(),
                            }));
                        if (items.length >= 2) { cacheSet('news_global', items); return items; }
                    }
                } catch(e) { console.warn('[NEWS] Reddit GL:', e.message); }

                return null;
            }

            const [brasil, global] = await Promise.all([loadBrasil(), loadGlobal()]);

            renderNewsList('news-brasil-list', brasil, 'Reddit');
            renderNewsList('news-global-list', global, 'The Guardian');
        }

        /* ── Tradução automática via MyMemory (grátis, sem chave, CORS nativo) ── */
        async function translateTitle(text) {
            if (!text || text.length < 8) return text;
            return new Promise(resolve => {
                const timer = setTimeout(() => resolve(text), 5000);
                fetch('https://api.mymemory.translated.net/get?q=' +
                    encodeURIComponent(text.slice(0, 350)) + '&langpair=en|pt-BR')
                    .then(r => r.json())
                    .then(j => {
                        clearTimeout(timer);
                        const t = j.responseData?.translatedText;
                        resolve(t && !t.includes('PLEASE SELECT') && !t.includes('LIMIT') &&
                                t.toLowerCase() !== text.toLowerCase() ? t : text);
                    })
                    .catch(() => { clearTimeout(timer); resolve(text); });
            });
        }

        async function patchTranslations(containerId) {
            const els = [...document.querySelectorAll(`#${containerId} .news-card-title[data-en]`)];
            if (!els.length) return;
            els.forEach(el => el.classList.add('translating'));
            const results = await Promise.allSettled(els.map(el => translateTitle(el.dataset.en)));
            els.forEach((el, i) => {
                if (results[i].status === 'fulfilled') el.textContent = results[i].value;
                el.classList.remove('translating');
            });
        }

        function catPill(author) {
            const a = (author || '').toLowerCase();
            if (a.includes('business') || a.includes('finance') || a.includes('money') || a.includes('economics'))
                return ['business', author];
            if (a.includes('world') || a.includes('international'))
                return ['world', author];
            if (a.includes('tech') || a.includes('technology'))
                return ['tech', author];
            if (a.includes('politi') || a.includes('government'))
                return ['politics', author];
            if (a.startsWith('r/invest') || a.startsWith('r/mercado') || a.startsWith('r/finan'))
                return ['reddit-br', author];
            if (a.startsWith('r/'))
                return ['reddit-gl', author];
            return ['default', author || 'Notícia'];
        }

        function showNewsSkeletons(id) {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = Array.from({ length: 5 }, () => `
                <div class="news-skeleton-item">
                    <span class="ind-skeleton" style="height:10px;width:55px;border-radius:20px;display:block;"></span>
                    <span class="ind-skeleton" style="height:13px;width:92%;display:block;margin-top:6px;"></span>
                    <span class="ind-skeleton" style="height:11px;width:65%;display:block;margin-top:3px;"></span>
                    <span class="ind-skeleton" style="height:9px;width:35%;display:block;margin-top:5px;"></span>
                </div>`).join('');
        }

        function renderNewsList(id, items, fallbackSource) {
            const el = document.getElementById(id);
            if (!el) return;
            if (!items || !items.length) {
                el.innerHTML = `<div class="news-empty-state">
                    <div class="news-empty-icon"><i data-lucide="wifi-off" style="width:20px;height:20px;"></i></div>
                    <div style="font-size:.84rem;font-weight:700;color:var(--text-main);margin-top:4px;">Sem notícias no momento</div>
                    <div style="font-size:.75rem;">Verifique sua conexão ou tente atualizar.</div>
                </div>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }
            el.innerHTML = items.map(item => {
                const [cls, label] = catPill(item.author || fallbackSource);
                const safeTitle = (item.title || 'Sem título').replace(/</g,'&lt;').replace(/>/g,'&gt;');
                const safeEn   = safeTitle.replace(/"/g, '&quot;');
                return `<a class="news-card" href="${item.link || '#'}" target="_blank" rel="noopener noreferrer">
                    <span class="news-cat-pill ${cls}">${label}</span>
                    <div class="news-card-title" data-en="${safeEn}">${safeTitle}</div>
                    <div class="news-card-footer">
                        <span>${relTime(item.pubDate)}</span>
                        <i data-lucide="external-link" class="news-ext-icon"></i>
                    </div>
                </a>`;
            }).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
            /* Traduz os títulos em background sem bloquear a UI */
            patchTranslations(id);
        }

        window.renderIndicadoresTab = renderIndicadoresTab;
        window.renderNoticiasTab    = renderNoticiasTab;

        console.log('[IND/NEWS] Módulo carregado');
    })();

const cpCpfInput = document.getElementById('cp-cpf');
    const cpPhoneInput = document.getElementById('cp-phone');

    if(cpCpfInput) {
        cpCpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
            else if (value.length > 3) value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
            e.target.value = value;
        });
    }

    if(cpPhoneInput) {
        cpPhoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            else if (value.length > 2) value = value.replace(/(\d{2})(\d{4,5})/, '($1) $2');
            e.target.value = value;
        });
    }

    // (Lógica de Complete Profile movida para checkSession global)

    async function saveProfileData() {
        const name = document.getElementById('cp-name').value.trim();
        const cpf = document.getElementById('cp-cpf').value.trim();
        const phone = document.getElementById('cp-phone').value.trim();
        const errorMsg = document.getElementById('cp-errorMsg');
        const btn = document.getElementById('cp-submitBtn');

        errorMsg.style.display = 'none';

        if (!name || !cpf || !phone) {
            errorMsg.textContent = 'Preencha todos os campos.';
            errorMsg.style.display = 'block';
            return;
        }

        if (cpf.length < 14) {
            errorMsg.textContent = 'CPF incompleto.';
            errorMsg.style.display = 'block';
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Salvando...';
        btn.style.opacity = '0.7';

        const { data, error } = await _supabase.auth.updateUser({
            data: { full_name: name, cpf: cpf, phone: phone }
        });

        if (error) {
            errorMsg.textContent = 'Erro ao salvar: ' + error.message;
            errorMsg.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Salvar Dados';
            btn.style.opacity = '1';
        } else {
            document.getElementById('completeProfileModal').style.display = 'none';
        }
    }



// ── EXPORTAÇÃO GLOBAL PARA COMPATIBILIDADE COM HTML ──
window.showToast = showToast;
window.triggerConfetti = triggerConfetti;
window.checkInactivity = checkInactivity;
window.updateSmartAlerts = updateSmartAlerts;
window.toggleAuthMode = toggleAuthMode;
window.handleAuthAction = handleAuthAction;
window.checkSession = checkSession;
window.openPlanModal = openPlanModal;
window.closePlanModal = closePlanModal;
window.togglePlanCycle = togglePlanCycle;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.maskCPF = maskCPF;
window.maskPhone = maskPhone;
window.submitCheckout = submitCheckout;
window.loadUserPlan = loadUserPlan;
window.triggerPlanSync = triggerPlanSync;
window.updatePlanBadge = updatePlanBadge;
window.handleLogout = handleLogout;
window.syncAllData = syncAllData;
window.forceIcons = forceIcons;
window.updateUI = updateUI;
window.saveProfile = saveProfile;
window.toggleSecCard = toggleSecCard;
window.changePassword = changePassword;
window.toggle2FA = toggle2FA;
window.verify2FA = verify2FA;
window.exportDataCSV = exportDataCSV;
window.toggleExportMenu = toggleExportMenu;
window.exportHistoryExcel = exportHistoryExcel;
window.exportHistoryPDF = exportHistoryPDF;
window.confirmResetAccount = confirmResetAccount;
window.initModernSelect = initModernSelect;
window.renderOptions = renderOptions;
window.openMenu = openMenu;
window.closeMenu = closeMenu;
window.populateMonthFilters = populateMonthFilters;
window.initDashboard = initDashboard;
window.renderDashCardsSummary = renderDashCardsSummary;
window.renderInvoiceAlerts = renderInvoiceAlerts;
window.payInvoiceFromCard = payInvoiceFromCard;
window.openInvoiceFromAlert = openInvoiceFromAlert;
window.updateBalanceUI = updateBalanceUI;
window.toggleHideBalance = toggleHideBalance;
window.renderBudgetProgress = renderBudgetProgress;
window.renderRecentTx = renderRecentTx;
window.darkenHex = darkenHex;
window.openAccountDetails = openAccountDetails;
window.renderBankCards = renderBankCards;
window.renderSummaryTab = renderSummaryTab;
window.initCharts = initCharts;
window.scrollToHistoryFilter = scrollToHistoryFilter;
window.renderSettingsAccounts = renderSettingsAccounts;
window.openAccModal = openAccModal;
window.closeAccModal = closeAccModal;
window.renderAccountColorPicker = renderAccountColorPicker;
window.saveAccAction = saveAccAction;
window.deleteAcc = deleteAcc;
window.openQuickEntryModal = openQuickEntryModal;
window.closeQuickEntryModal = closeQuickEntryModal;
window.setQuickEntryType = setQuickEntryType;
window.saveQuickEntryAction = saveQuickEntryAction;
window.setRegime = setRegime;
window.setOccurrence = setOccurrence;
window.setEntryTab = setEntryTab;
window.updateEntryGoalsList = updateEntryGoalsList;
window.handleSaveEntry = handleSaveEntry;
window.saveCatAction = saveCatAction;
window.toggleRecEndDate = toggleRecEndDate;
window.isRecValid = isRecValid;
window.openRecurringModal = openRecurringModal;
window.closeRecurringModal = closeRecurringModal;
window.setRecType = setRecType;
window.saveRecurringAction = saveRecurringAction;
window.autoLaunchRecurring = autoLaunchRecurring;
window.launchRecurringNow = launchRecurringNow;
window.toggleRecurringStatus = toggleRecurringStatus;
window.deleteRecurring = deleteRecurring;
window.renderRecurringList = renderRecurringList;
window.deleteCat = deleteCat;
window.syncBottomNav = syncBottomNav;
window.switchTabMobile = switchTabMobile;
window.syncMonthFilters = syncMonthFilters;
window.switchTabGated = switchTabGated;
window.countTxThisMonth = countTxThisMonth;
window.checkPlanLimit = checkPlanLimit;
window.switchTab = switchTab;
window.toggleNavGroup = toggleNavGroup;
window.toggleCatDropdown = toggleCatDropdown;
window.closeCatDropdown = closeCatDropdown;
window.selectCatDropdownItem = selectCatDropdownItem;
window.toggleAccDropdown = toggleAccDropdown;
window.closeAccDropdown = closeAccDropdown;
window.selectAccDropdownItem = selectAccDropdownItem;
window.updateEntryCategories = updateEntryCategories;
window.handleEntryAccountChange = handleEntryAccountChange;
window.setCatSort = setCatSort;
window.switchCatList = switchCatList;
window.renderCategoryGrid = renderCategoryGrid;
window.startRandomCatFlip = startRandomCatFlip;
window.toggleCatActionMenu = toggleCatActionMenu;
window.openCatModal = openCatModal;
window.closeCatModal = closeCatModal;
window.setModalCatType = setModalCatType;
window.togglePickerPopover = togglePickerPopover;
window.renderCategoryPicker = renderCategoryPicker;
window.openCardModal = openCardModal;
window.closeCardModal = closeCardModal;
window.renderCardColorPicker = renderCardColorPicker;
window.saveCardAction = saveCardAction;
window.deleteCard = deleteCard;
window.computeInvoiceMonth = computeInvoiceMonth;
window.currentInvoiceMonthStr = currentInvoiceMonthStr;
window.getCardInvoiceInfo = getCardInvoiceInfo;
window.getUnpaidInvoiceMonths = getUnpaidInvoiceMonths;
window.getInvoiceBalance = getInvoiceBalance;
window.openInvoiceModal = openInvoiceModal;
window.closeInvoiceModal = closeInvoiceModal;
window.renderInvoiceMonthTabs = renderInvoiceMonthTabs;
window.selectInvoiceMonth = selectInvoiceMonth;
window.renderInvoiceContent = renderInvoiceContent;
window.openPayInvoicePrompt = openPayInvoicePrompt;
window.closePayInvoiceModal = closePayInvoiceModal;
window.confirmPayInvoice = confirmPayInvoice;
window.refreshCardStatusEverywhere = refreshCardStatusEverywhere;
window.reverseInvoicePayment = reverseInvoicePayment;
window.deleteCardTxFromInvoice = deleteCardTxFromInvoice;
window.isCardTxOnPaidInvoice = isCardTxOnPaidInvoice;
window.renderCardsTab = renderCardsTab;
window.toggleCardMenu = toggleCardMenu;
window.closecardMenu = closecardMenu;
window.changeCardMonth = changeCardMonth;
window.renderCardRow = renderCardRow;
window.openCardHistoryModal = openCardHistoryModal;
window.closeCardHistoryModal = closeCardHistoryModal;
window.populateHistoryFilters = populateHistoryFilters;
window.clearHistoryFilters = clearHistoryFilters;
window.openConfirmModal = openConfirmModal;
window.closeConfirmModal = closeConfirmModal;
window.deleteTx = deleteTx;
window.renderHistoryTable = renderHistoryTable;
window.openGoalModal = openGoalModal;
window.closeGoalModal = closeGoalModal;
window.renderGoalIconPicker = renderGoalIconPicker;
window.saveGoalAction = saveGoalAction;
window.renderMetasTab = renderMetasTab;
window.deleteGoal = deleteGoal;
window.redeemGoal = redeemGoal;
window.maybeShowShortcutTip = maybeShowShortcutTip;
window.dismissShortcutTip = dismissShortcutTip;
window.closeRedeemConfirmModal = closeRedeemConfirmModal;
window.confirmRedeemGoal = confirmRedeemGoal;
window.fmtBRL = fmtBRL;
window.renderBudgetTab = renderBudgetTab;
window.makeLimitEditable = makeLimitEditable;
window.setReportsView = setReportsView;
window.renderReportsTab = renderReportsTab;
window.renderReportsOverview = renderReportsOverview;
window.renderReportsIncome = renderReportsIncome;
window.renderReportsExpense = renderReportsExpense;
window.exportToCSV = exportToCSV;
window.initSidebarHover = initSidebarHover;
window.toggleSidebar = toggleSidebar;
window.toggleMobileMenu = toggleMobileMenu;
window.renderComparisonTab = renderComparisonTab;
window.handleSubscribe = handleSubscribe;
window.fmtBRL = fmtBRL;
window.fmtPct = fmtPct;
window.esc = esc;
window.setText = setText;
window.setClass = setClass;
window.setVal = setVal;
window.todayISO = todayISO;
window.fetchCDI = fetchCDI;
window.getBrapiToken = getBrapiToken;
window.fetchCotacoes = fetchCotacoes;
window.setBrapiToken = setBrapiToken;
window.syncInvestimentos = syncInvestimentos;
window.calcSaldoContas = calcSaldoContas;
window.calcSaldoContasFiltered = calcSaldoContasFiltered;
window.fetchCDIHistory = fetchCDIHistory;
window.renderRentabilidadeChart = renderRentabilidadeChart;
window.calcDivsForInv = calcDivsForInv;
window.calcTotalDivs = calcTotalDivs;
window.calcValue = calcValue;
window.renderInvestimentosTab = renderInvestimentosTab;
window.renderKPIs = renderKPIs;
window.renderContasRow = renderContasRow;
window.renderCharts = renderCharts;
window.makeChart = makeChart;
window.renderTable = renderTable;
window.updateCDIBadge = updateCDIBadge;
window.refreshInvCotacoes = refreshInvCotacoes;
window.setRentabPeriod = setRentabPeriod;
window.filterInvByType = filterInvByType;
window.filterInvByConta = filterInvByConta;
window.openInvModal = openInvModal;
window.setInvType = setInvType;
window.calcTotalInvestido = calcTotalInvestido;
window.buscarCotacaoTicker = buscarCotacaoTicker;
window.closeInvModal = closeInvModal;
window.saveInvestimento = saveInvestimento;
window.editInvestimento = editInvestimento;
window.closeMenu = closeMenu;
window.cacheGet = cacheGet;
window.cacheSet = cacheSet;
window.fetchBCB = fetchBCB;
window.fmt = fmt;
window.trendBadge = trendBadge;
window.relTime = relTime;
window.renderIndicadoresTab = renderIndicadoresTab;
window.animateCountUp = animateCountUp;
window.step = step;
window.showMarqueeSkeletons = showMarqueeSkeletons;
window.buildMarquee = buildMarquee;
window.showFundamentalsSkeletons = showFundamentalsSkeletons;
window.mc = mc;
window.buildFundamentals = buildFundamentals;
window.renderNoticiasTab = renderNoticiasTab;
window.tFetch = tFetch;
window.redditMap = redditMap;
window.redditFilter = redditFilter;
window.loadBrasil = loadBrasil;
window.loadGlobal = loadGlobal;
window.translateTitle = translateTitle;
window.patchTranslations = patchTranslations;
window.catPill = catPill;
window.showNewsSkeletons = showNewsSkeletons;
window.renderNewsList = renderNewsList;
window.saveProfileData = saveProfileData;




// EXPORTACOES GLOBAIS
window.toggleNavGroup = toggleNavGroup;
window.switchTab = switchTab;
window.openPlanModal = openPlanModal;
window.toggleAuthMode = toggleAuthMode;
window.handleAuthAction = handleAuthAction;
window.logout = logout;
window.openTransactionModal = openTransactionModal;
window.togglePlanCycle = togglePlanCycle;
window.openCheckoutModal = openCheckoutModal;
window.submitCheckout = submitCheckout;
window.maskCPF = maskCPF;
window.maskPhone = maskPhone;
window.triggerPlanSync = triggerPlanSync;
window.toggleSidebar = toggleSidebar;
window.appState = appState;
window._supabase = _supabase;

// --- LOGICA DE STARTUP FINAL ---
async function startupApp() {
    console.log('Iniciando LB Finance...');
    if (window._supabase) {
        try {
            const { data: { session }, error } = await window._supabase.auth.getSession();
            if (session) {
                window.appState.user.id = session.user.id;
                window.appState.user.email = session.user.email;
                if (typeof triggerPlanSync === 'function') triggerPlanSync();
            } else {
                window.location.href = 'login.html';
            }
        } catch (e) { console.error(e); }
    }
}
window.addEventListener('DOMContentLoaded', startupApp);
