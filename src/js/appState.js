// ── STATE ──
const _cachedPlan = JSON.parse(localStorage.getItem('lb_plan_cache') || '{}');

export const appState = {
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
