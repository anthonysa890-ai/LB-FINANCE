import re
import os

# 1. Lê o backup
with open('src/js/old-main.js', 'r', encoding='utf-8') as f:
    old_content = f.read()

# 2. Lê o arquivo atual
with open('src/js/main.js', 'r', encoding='utf-8') as f:
    current_content = f.read()

# 3. Extrai as funções de investimento
match = re.search(r'function toggleInvActions.*?function saveProfileData.*?{.*?}', old_content, re.DOTALL)
missing_functions = match.group(0) if match else ''

# 4. Limpa o main.js atual
clean_base = re.sub(r'// EXPORTACOES GLOBAIS.*', '', current_content, flags=re.DOTALL)
clean_base = re.sub(r'// --- PARTIDA DO APLICATIVO ---.*', '', clean_base, flags=re.DOTALL)
clean_base = re.sub(r'// --- LOGICA DE STARTUP FINAL ---.*', '', clean_base, flags=re.DOTALL)

# 5. Reconstrói o arquivo
startup_code = """
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
"""

with open('src/js/main.js', 'w', encoding='utf-8') as f:
    f.write(clean_base.strip() + '\n\n' + missing_functions + '\n\n' + startup_code)

print("Reconstrução concluída com sucesso!")
