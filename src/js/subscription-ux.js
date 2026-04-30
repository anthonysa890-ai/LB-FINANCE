// ═══════════════════════════════════════════════════
//  subscription-ux.js — LB Finance
//  Renderiza a aba Assinatura com dados do appState
// ═══════════════════════════════════════════════════

// ──────────────────────────────────────────────────
// FUNÇÃO PRINCIPAL — chamada ao abrir a aba
// ──────────────────────────────────────────────────
function updateSubscriptionUI() {
  const isPro   = appState.plan === 'pro';
  const status  = appState.planStatus;  // 'active' | 'overdue' | 'cancelled' | 'inactive'
  const cycle   = appState.planCycle;   // 'monthly' | 'yearly'
  const endDate = appState.planEnd   ? new Date(appState.planEnd)   : null;
  const startDate = appState.planStart ? new Date(appState.planStart) : null;

  const fmtDate = (d) => d ? d.toLocaleDateString('pt-BR') : '—';

  // ── HERO ──
  const el = (id) => document.getElementById(id);

  if (el('sub-hero-plan-name'))   el('sub-hero-plan-name').textContent  = isPro ? 'Pro' : 'Básico';
  if (el('sub-hero-price'))       el('sub-hero-price').textContent       = isPro ? (cycle === 'yearly' ? 'R$ 99,99' : 'R$ 9,99') : 'Grátis';
  if (el('sub-hero-cycle'))       el('sub-hero-cycle').textContent       = isPro ? (cycle === 'yearly' ? '/ ano' : '/ mês') : '';
  if (el('sub-hero-btn-label'))   el('sub-hero-btn-label').textContent   = isPro ? 'Gerenciar plano' : 'Fazer upgrade →';

  // Badge de status no hero
  const badge = el('sub-hero-status-badge');
  if (badge) {
    const statusConfig = {
      active:   { label: '● Ativo',       bg: 'rgba(16,185,129,0.18)', color: '#34d399', border: 'rgba(52,211,153,0.35)' },
      overdue:  { label: '⚠ Em atraso',   bg: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: 'rgba(251,191,36,0.35)' },
      cancelled:{ label: '✕ Cancelado',   bg: 'rgba(239,68,68,0.15)',  color: '#f87171', border: 'rgba(248,113,113,0.35)' },
      inactive: { label: 'Gratuito',       bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: 'rgba(255,255,255,0.2)' },
    };
    const cfg = statusConfig[status] || statusConfig.inactive;
    badge.textContent       = cfg.label;
    badge.style.background  = cfg.bg;
    badge.style.color       = cfg.color;
    badge.style.borderColor = cfg.border;
  }

  // Próxima cobrança no hero
  const renewalBox = el('sub-hero-renewal-box');
  if (renewalBox) {
    renewalBox.style.display = isPro && endDate ? '' : 'none';
    if (el('sub-hero-renewal-date')) el('sub-hero-renewal-date').textContent = fmtDate(endDate);
  }

  // ── DETALHES DO PLANO ──
  if (el('sub-info-start')) el('sub-info-start').textContent = fmtDate(startDate);
  if (el('sub-info-end'))   el('sub-info-end').textContent   = fmtDate(endDate);
  if (el('sub-info-cycle')) el('sub-info-cycle').textContent = isPro ? (cycle === 'yearly' ? 'Anual' : 'Mensal') : '—';

  const statusEl = el('sub-info-status');
  if (statusEl) {
    const sMap = {
      active:   { label: 'Ativo',       color: '#059669', bg: '#ecfdf5', border: 'rgba(5,150,105,0.2)'   },
      overdue:  { label: 'Em atraso',   color: '#d97706', bg: '#fffbeb', border: 'rgba(217,119,6,0.2)'   },
      cancelled:{ label: 'Cancelado',   color: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.2)'   },
      inactive: { label: 'Gratuito',    color: '#64748b', bg: '#f8fafc', border: 'rgba(100,116,139,0.2)' },
    };
    const s = sMap[status] || sMap.inactive;
    statusEl.innerHTML       = `<span style="width:5px;height:5px;border-radius:50%;background:${s.color};display:inline-block;"></span> ${s.label}`;
    statusEl.style.color     = s.color;
    statusEl.style.background= s.bg;
    statusEl.style.borderColor = s.border;
  }

  // Botão de cancelar — só visível para assinantes ativos
  const cancelArea = el('sub-cancel-btn-area');
  if (cancelArea) cancelArea.style.display = isPro ? '' : 'none';

  // ── USO DO PLANO ──
  _renderUsageGrid(isPro);

  // ── FORMA DE PAGAMENTO ──
  _renderPaymentDisplay(isPro);

  // ── FATURAS ──
  loadInvoicesFromASAAS(false);

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ──────────────────────────────────────────────────
// USO DO PLANO (barras de progresso)
// ──────────────────────────────────────────────────
function _renderUsageGrid(isPro) {
  const grid = document.getElementById('sub-usage-grid');
  if (!grid) return;

  const txCount  = typeof countTxThisMonth === 'function'  ? countTxThisMonth()              : (appState.transactions || []).length;
  const catCount = (appState.categories || []).length;
  const accCount = (appState.accounts   || []).length;

  const limits = { tx: isPro ? null : 40, cat: isPro ? null : 7, acc: null };

  const items = [
    { icon: 'repeat',   label: 'Lançamentos', sub: 'este mês',       val: txCount,  max: limits.tx  },
    { icon: 'tag',      label: 'Categorias',  sub: 'cadastradas',    val: catCount, max: limits.cat },
    { icon: 'landmark', label: 'Contas',      sub: 'cadastradas',    val: accCount, max: limits.acc },
  ];

  grid.innerHTML = items.map(({ icon, label, sub, val, max }) => {
    const pct      = max ? Math.min(100, Math.round(val / max * 100)) : 0;
    const atLimit  = max && val >= max;
    const nearLimit= !atLimit && pct > 75;
    const barColor = atLimit ? '#ef4444' : nearLimit ? '#f59e0b' : '#7c3aed';

    return `
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <div style="width:34px;height:34px;border-radius:9px;background:${atLimit ? '#fef2f2' : '#ede9fe'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i data-lucide="${icon}" style="width:15px;height:15px;color:${atLimit ? '#ef4444' : '#7c3aed'};"></i>
          </div>
          <div>
            <div style="font-size:0.82rem;font-weight:800;color:#1e293b;">${label}</div>
            <div style="font-size:0.68rem;color:#94a3b8;">${sub}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
          <span style="font-size:1.3rem;font-weight:900;color:${atLimit ? '#ef4444' : '#1e293b'};font-family:'Outfit',sans-serif;">${val}</span>
          <span style="font-size:0.75rem;font-weight:600;color:#94a3b8;">${max ? `de ${max}` : '∞ ilimitado'}</span>
        </div>
        ${max ? `
        <div style="height:6px;background:#f1f5f9;border-radius:10px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${barColor};border-radius:10px;transition:width .6s ease;"></div>
        </div>
        ${atLimit ? `<div style="font-size:0.68rem;color:#ef4444;font-weight:700;margin-top:6px;">Limite atingido — <span onclick="openPlanModal()" style="cursor:pointer;text-decoration:underline;">faça upgrade</span></div>` : ''}
        ` : `
        <div style="height:6px;background:linear-gradient(90deg,#ede9fe,#ddd6fe);border-radius:10px;"></div>
        <div style="font-size:0.68rem;color:#7c3aed;font-weight:700;margin-top:6px;display:flex;align-items:center;gap:3px;"><i data-lucide="infinity" style="width:10px;height:10px;"></i> Sem limite no Pro</div>
        `}
      </div>`;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ──────────────────────────────────────────────────
// FORMA DE PAGAMENTO
// ──────────────────────────────────────────────────
function _renderPaymentDisplay(isPro) {
  const el = document.getElementById('sub-payment-display');
  if (!el) return;

  if (!isPro) {
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:12px 0;">
        <i data-lucide="lock" style="width:18px;height:18px;color:#cbd5e1;flex-shrink:0;"></i>
        <div>
          <div style="font-size:0.85rem;font-weight:700;color:#94a3b8;">Disponível no Pro</div>
          <div style="font-size:0.72rem;color:#cbd5e1;margin-top:2px;">Assine para adicionar uma forma de pagamento</div>
        </div>
      </div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  const pm = appState.paymentMethod;
  if (!pm) {
    el.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px;padding:4px 0;">
        <i data-lucide="help-circle" style="width:20px;height:20px;color:#cbd5e1;flex-shrink:0;margin-top:2px;"></i>
        <div>
          <div style="font-size:0.9rem;font-weight:700;color:#475569;">Pagamento via PIX ou Boleto</div>
          <div style="font-size:0.75rem;color:#94a3b8;margin-top:4px;line-height:1.5;">Não há cartão de crédito associado.<br>Para alterar, entre em contato com o suporte.</div>
        </div>
      </div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  const iCard = pm.billingType === 'CREDIT_CARD' || pm.billingType === 'DEBIT_CARD';
  const typeLabels = { PIX: 'PIX', BOLETO: 'Boleto Bancário', CREDIT_CARD: 'Cartão de Crédito', DEBIT_CARD: 'Cartão de Débito' };
  const typeIcons  = { PIX: 'qr-code', BOLETO: 'file-text', CREDIT_CARD: 'credit-card', DEBIT_CARD: 'credit-card' };
  const icon  = typeIcons[pm.billingType]  || 'credit-card';
  const label = typeLabels[pm.billingType] || pm.billingType || 'Desconhecido';
  const last4 = pm.creditCard?.creditCardNumber || '';
  const brand = pm.creditCard?.creditCardBrand  || '';
  const exp   = pm.creditCard?.creditCardExpiry || '';

  if (iCard && last4) {
    el.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:12px;padding:4px 0;">
        <i data-lucide="${icon}" style="width:22px;height:22px;color:#7c3aed;flex-shrink:0;margin-top:3px;"></i>
        <div>
          <div style="font-size:1.1rem;font-weight:900;color:#1e293b;font-family:'Outfit',sans-serif;letter-spacing:3px;margin-bottom:6px;">•••• •••• •••• ${last4}</div>
          <div style="font-size:0.8rem;color:#64748b;font-weight:500;">${brand ? brand + ' · ' : ''}${exp ? 'Expira em ' + exp : ''}</div>
        </div>
      </div>`;
  } else {
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;padding:4px 0;">
        <i data-lucide="${icon}" style="width:22px;height:22px;color:#7c3aed;flex-shrink:0;"></i>
        <div>
          <div style="font-size:0.95rem;font-weight:800;color:#1e293b;">${label}</div>
          <div style="font-size:0.75rem;color:#94a3b8;margin-top:3px;">Método de pagamento ativo</div>
        </div>
      </div>`;
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ──────────────────────────────────────────────────
// HISTÓRICO DE FATURAS
// ──────────────────────────────────────────────────
async function loadInvoicesFromASAAS(forceRefresh) {
  const tbody = document.getElementById('sub-invoices-tbody');
  if (!tbody) return;

  if (appState.plan !== 'pro') {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="padding:48px;text-align:center;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
            <div style="width:48px;height:48px;border-radius:14px;background:#f8fafc;display:flex;align-items:center;justify-content:center;">
              <i data-lucide="receipt" style="width:22px;height:22px;color:#cbd5e1;"></i>
            </div>
            <div style="font-size:0.9rem;font-weight:700;color:#94a3b8;">Nenhuma fatura disponível</div>
            <div style="font-size:0.78rem;color:#cbd5e1;max-width:260px;text-align:center;line-height:1.6;">Faça upgrade para o Pro e acompanhe todo o histórico de cobranças aqui.</div>
            <button onclick="openPlanModal()" style="padding:9px 22px;background:linear-gradient(135deg,#5b21b6,#7c3aed);color:#fff;border:none;border-radius:11px;font-size:0.8rem;font-weight:700;cursor:pointer;margin-top:4px;">Ver planos Pro →</button>
          </div>
        </td>
      </tr>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  tbody.innerHTML = `
    <tr>
      <td colspan="5" style="padding:40px;text-align:center;color:#94a3b8;font-size:0.85rem;">
        <i data-lucide="loader" style="width:14px;height:14px;animation:spin 1s linear infinite;display:inline-block;vertical-align:middle;margin-right:6px;"></i>
        Carregando faturas...
      </td>
    </tr>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();

  try {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) throw new Error('Sem sessão');

    const res  = await fetch(`${SUPABASE_FN}/get-invoices`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Erro na requisição');

    _renderInvoiceRows(json.invoices || json.charges || []);
  } catch (err) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="padding:40px;text-align:center;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
            <i data-lucide="wifi-off" style="width:24px;height:24px;color:#cbd5e1;"></i>
            <div style="font-size:0.85rem;font-weight:700;color:#94a3b8;">Histórico indisponível no momento</div>
            <div style="font-size:0.75rem;color:#cbd5e1;text-align:center;max-width:280px;line-height:1.5;">A Edge Function <code>get-invoices</code> precisa ser configurada no Supabase para buscar as cobranças do Asaas.</div>
            <button onclick="loadInvoicesFromASAAS(true)" style="margin-top:8px;padding:7px 18px;border:1.5px solid #e2e8f0;background:#fff;color:#64748b;border-radius:20px;font-size:0.75rem;font-weight:700;cursor:pointer;">Tentar novamente</button>
          </div>
        </td>
      </tr>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function _renderInvoiceRows(invoices) {
  const tbody = document.getElementById('sub-invoices-tbody');
  if (!tbody) return;

  if (!invoices.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding:40px;text-align:center;color:#94a3b8;font-size:0.85rem;">Nenhuma cobrança encontrada no histórico.</td></tr>`;
    return;
  }

  const statusMap = {
    RECEIVED:  { label: 'Pago',         bg: '#ecfdf5', color: '#059669', dot: '#059669' },
    CONFIRMED: { label: 'Pago',         bg: '#ecfdf5', color: '#059669', dot: '#059669' },
    PENDING:   { label: 'Pendente',     bg: '#fffbeb', color: '#d97706', dot: '#d97706' },
    OVERDUE:   { label: 'Vencida',      bg: '#fef2f2', color: '#dc2626', dot: '#dc2626' },
    REFUNDED:  { label: 'Reembolsado',  bg: '#f1f5f9', color: '#64748b', dot: '#64748b' },
  };

  tbody.innerHTML = invoices.map(inv => {
    const dt    = inv.dueDate ? new Date(inv.dueDate) : null;
    const dtStr = dt ? dt.toLocaleDateString('pt-BR') : '—';
    const period= dt ? dt.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '—';
    const periodLabel = period.charAt(0).toUpperCase() + period.slice(1);
    const val   = (inv.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const s     = statusMap[inv.status] || { label: inv.status || '—', bg: '#f8fafc', color: '#64748b', dot: '#64748b' };

    const actionBtn = inv.invoiceUrl
      ? `<a href="${inv.invoiceUrl}" target="_blank" style="display:inline-flex;align-items:center;gap:5px;font-size:0.75rem;font-weight:700;padding:6px 14px;border-radius:20px;background:#f3e8ff;color:#7c3aed;text-decoration:none;transition:all .2s;">
           <i data-lucide="download" style="width:11px;height:11px;"></i> PDF
         </a>`
      : `<span style="font-size:0.78rem;color:#cbd5e1;">—</span>`;

    return `
      <tr style="border-bottom:1px solid #f8fafc;transition:background .15s;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background=''">
        <td style="padding:18px 24px;font-size:0.83rem;color:#64748b;font-weight:500;">${dtStr}</td>
        <td style="padding:18px 24px;font-size:0.83rem;color:#1e293b;font-weight:600;">LB Finance Pro · ${periodLabel}</td>
        <td style="padding:18px 24px;font-size:0.85rem;color:#1e293b;font-weight:800;text-align:right;">${val}</td>
        <td style="padding:18px 24px;text-align:center;">
          <span style="display:inline-flex;align-items:center;gap:5px;font-size:0.73rem;font-weight:700;padding:4px 13px;border-radius:20px;background:${s.bg};color:${s.color};">
            <span style="width:5px;height:5px;border-radius:50%;background:${s.dot};"></span>${s.label}
          </span>
        </td>
        <td style="padding:18px 24px;text-align:center;">${actionBtn}</td>
      </tr>`;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ──────────────────────────────────────────────────
// MODAIS
// ──────────────────────────────────────────────────
function openCancelModal() {
  const m = document.getElementById('modal-cancel-sub');
  if (!m) return;
  showCancelStep(1);
  const endStr = appState.planEnd ? new Date(appState.planEnd).toLocaleDateString('pt-BR') : null;
  const msg = document.getElementById('cancel-access-until-msg');
  if (msg) msg.textContent = endStr ? `Seu acesso ao Pro continua até ${endStr}.` : '';
  m.style.display = 'flex';
  setTimeout(() => m.classList.add('active'), 10);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeCancelModal() {
  const m = document.getElementById('modal-cancel-sub');
  if (!m) return;
  m.classList.remove('active');
  setTimeout(() => m.style.display = 'none', 200);
}

function showCancelStep(n) {
  const s1 = document.getElementById('cancel-step-1');
  const s2 = document.getElementById('cancel-step-2');
  if (s1) s1.style.display = n === 1 ? '' : 'none';
  if (s2) s2.style.display = n === 2 ? '' : 'none';
}

async function submitCancellation() {
  const reason = document.querySelector('input[name="cancel-reason"]:checked')?.value || 'nao-informado';
  const btn    = document.getElementById('cancel-confirm-btn');
  const lbl    = document.getElementById('cancel-confirm-label');
  if (btn) btn.disabled = true;
  if (lbl) lbl.textContent = 'Cancelando...';

  try {
    const { data: { session } } = await _supabase.auth.getSession();
    const res  = await fetch(`${SUPABASE_FN}/cancel-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao cancelar');
    closeCancelModal();
    showToast('Assinatura cancelada. Acesso mantido até o fim do período.', 'success');
    await _syncPlanFromASAAS(false).catch(() => {});
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (lbl) lbl.textContent = 'Confirmar cancelamento';
  }
}

function openPaymentMethodModal() {
  const m = document.getElementById('modal-payment-method');
  if (!m) return;
  m.style.display = 'flex';
  setTimeout(() => m.classList.add('active'), 10);
  const body = document.getElementById('payment-method-modal-body');
  const pm   = appState.paymentMethod;
  if (body) {
    if (!pm) {
      body.innerHTML = `<div style="padding:20px;text-align:center;color:#94a3b8;font-size:0.85rem;">Nenhum método de pagamento cadastrado.</div>`;
    } else {
      const labels = { PIX: 'PIX', BOLETO: 'Boleto Bancário', CREDIT_CARD: 'Cartão de Crédito', DEBIT_CARD: 'Cartão de Débito' };
      body.innerHTML = `
        <div style="background:#f8fafc;border-radius:12px;padding:16px 18px;font-size:0.83rem;color:#475569;line-height:2.2;">
          <div><strong>Tipo:</strong> ${labels[pm.billingType] || pm.billingType}</div>
          ${pm.creditCard?.creditCardNumber  ? `<div><strong>Número:</strong> •••• •••• •••• ${pm.creditCard.creditCardNumber}</div>` : ''}
          ${pm.creditCard?.creditCardHolderName ? `<div><strong>Titular:</strong> ${pm.creditCard.creditCardHolderName}</div>` : ''}
          ${pm.creditCard?.creditCardExpiry  ? `<div><strong>Validade:</strong> ${pm.creditCard.creditCardExpiry}</div>` : ''}
          ${pm.creditCard?.creditCardBrand   ? `<div><strong>Bandeira:</strong> ${pm.creditCard.creditCardBrand}</div>` : ''}
        </div>
        <div style="margin-top:14px;font-size:0.75rem;color:#94a3b8;text-align:center;line-height:1.6;">
          Para alterar o método de pagamento, entre em contato com o suporte.
        </div>`;
    }
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closePaymentMethodModal() {
  const m = document.getElementById('modal-payment-method');
  if (!m) return;
  m.classList.remove('active');
  setTimeout(() => m.style.display = 'none', 200);
}

// ──────────────────────────────────────────────────
// BUSCAR FORMA DE PAGAMENTO
// ──────────────────────────────────────────────────
async function loadPaymentMethod() {
  if (!appState.user.id || !_supabase) return;
  try {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) return;
    const res = await fetch(`${SUPABASE_FN}/get-payment-method`, {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    appState.paymentMethod = data.paymentMethod || null;
  } catch (e) {
    appState.paymentMethod = null;
  }
}

// ──────────────────────────────────────────────────
// EXPORTS GLOBAIS
// ──────────────────────────────────────────────────
window.updateSubscriptionUI    = updateSubscriptionUI;
window.loadInvoicesFromASAAS   = loadInvoicesFromASAAS;
window.openCancelModal         = openCancelModal;
window.closeCancelModal        = closeCancelModal;
window.showCancelStep          = showCancelStep;
window.submitCancellation      = submitCancellation;
window.openPaymentMethodModal  = openPaymentMethodModal;
window.closePaymentMethodModal = closePaymentMethodModal;
window.loadPaymentMethod       = loadPaymentMethod;
window._renderPaymentDisplay   = _renderPaymentDisplay;

// EXPORTACOES GLOBAIS SUBSCRIPTION
window.updateSubscriptionUI = updateSubscriptionUI;
window._renderUsageGrid = _renderUsageGrid;
window._renderFeaturesGrid = _renderFeaturesGrid;
window._renderInvoices = _renderInvoices;
