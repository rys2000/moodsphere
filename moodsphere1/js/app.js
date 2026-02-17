// Renderizado principal
function render() {
    const app = document.getElementById('app');
    
    if (!AppState.isLoggedIn || !auth.currentUser) {
        app.innerHTML = renderWelcome();
    } else {
        if (AppState.activeTab === 'friends') {
            renderFriendsView();
        } else {
            app.innerHTML = renderDashboard();
        }
    }
}

// Listener de autenticación
auth.onAuthStateChanged(async (user) => {
    if (user) {
        AppState.isLoggedIn = true;
        
        // Obtener datos del usuario incluyendo código de amistad
        const userDoc = await db.collection("users").doc(user.uid).get();
        const userData = userDoc.data();
        
        AppState.currentUser = {
            uid: user.uid,
            email: user.email,
            name: userData?.name || user.email?.split('@')[0] || "Usuario",
            friendCode: userData?.friendCode
        };
        
        await updateUserStatus(true);
        startCommunityListeners();
        
        // Cargar amigos
        AppState.friends = await cargarAmigos();
        AppState.connectedFriends = AppState.friends.filter(f => f.online).length;
        AppState.totalFriends = AppState.friends.length;
        AppState.supportNeeded = AppState.friends.filter(f => f.needsSupport).length;
    } else {
        AppState.isLoggedIn = false;
        AppState.currentUser = null;
        AppState.friends = [];
        if (unsubscribeUsers) unsubscribeUsers();
        if (unsubscribeActivities) unsubscribeActivities();
    }
    render();
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    render();
});