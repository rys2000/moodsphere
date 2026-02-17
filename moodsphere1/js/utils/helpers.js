// Estado global de la aplicación
const AppState = {
    isLoggedIn: false,
    authLoading: false,
    authError: null,
    authSuccess: null,
    authEmail: '',
    authPassword: '',
    authName: '',
    currentUser: null,
    currentEmotion: emotionalStates[1],
    glowIntensity: 0.85,
    friends: [],
    diaryEntries: [],
    activities: [],
    activeTab: 'dashboard',
    connectedFriends: 0,
    totalFriends: 0,
    supportNeeded: 0,
    weeklyMood: [65, 70, 45, 80, 55, 75, 85],
    emotionalStats: {
        happy: 45,
        calm: 30,
        sad: 15,
        energetic: 10
    },
    needsSupport: false,
    friendMessage: ''
};

// Función para formatear tiempo de Firebase
function formatFirebaseTime(timestamp) {
    if (!timestamp) return "hace un momento";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return "hace unos segundos";
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    return `hace ${Math.floor(diff / 86400)} d`;
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = "success") {
    AppState.authSuccess = mensaje;
    AppState.authError = tipo === "error" ? mensaje : null;
    render();
    setTimeout(() => {
        AppState.authSuccess = null;
        AppState.authError = null;
        render();
    }, 3000);
}