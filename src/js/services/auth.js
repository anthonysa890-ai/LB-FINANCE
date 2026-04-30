import { appState } from '../appState.js';

export async function checkSession(_supabase) {
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
            // ... resto da lógica de sessão
            return session;
        } else {
            window.location.href = 'login.html';
        }
    } catch (err) {
        console.error('Erro ao verificar sessão:', err);
        window.location.href = 'login.html';
    }
}
