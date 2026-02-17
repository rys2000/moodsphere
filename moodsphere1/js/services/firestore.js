// Referencias para listeners
let unsubscribeUsers = null;
let unsubscribeActivities = null;

// Iniciar listeners de comunidad
function startCommunityListeners() {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Escuchar cambios en usuarios
    unsubscribeUsers = db.collection("users")
        .onSnapshot(snapshot => {
            const friends = [];
            snapshot.forEach(doc => {
                if (doc.id !== userId) {
                    friends.push({ id: doc.id, ...doc.data() });
                }
            });

            AppState.friends = friends;
            AppState.connectedFriends = friends.filter(f => f.online).length;
            AppState.supportNeeded = friends.filter(f => f.needsSupport).length;
            AppState.totalFriends = friends.length;
            render();
        }, error => {
            console.error("Error en listener de usuarios:", error);
        });

    // Escuchar actividades recientes
    unsubscribeActivities = db.collection("activities")
        .orderBy("timestamp", "desc")
        .limit(8)
        .onSnapshot(snapshot => {
            const activities = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                activities.push({
                    id: doc.id,
                    ...data,
                    time: formatFirebaseTime(data.timestamp)
                });
            });
            AppState.activities = activities;
            render();
        }, error => {
            console.error("Error en listener de actividades:", error);
        });
}

// Actualizar estado del usuario
async function updateUserStatus(online, needsSupport = false) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await db.collection("users").doc(user.uid).set({
            name: AppState.currentUser?.name || user.email?.split('@')[0] || "Usuario",
            email: user.email,
            online: online,
            needsSupport: needsSupport,
            currentEmotion: AppState.currentEmotion.name,
            currentEmoji: AppState.currentEmotion.emoji,
            currentColor: AppState.currentEmotion.color,
            glowIntensity: AppState.glowIntensity,
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error actualizando estado:", error);
    }
}

// Registrar actividad
async function logActivity(action, emoji, color) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await db.collection("activities").add({
            userId: user.uid,
            userName: AppState.currentUser?.name || user.email?.split('@')[0],
            action: action,
            emoji: emoji,
            color: color || AppState.currentEmotion.color,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Error registrando actividad:", error);
    }
}

// Enviar solicitud de apoyo
async function sendSupportRequest() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await db.collection("users").doc(user.uid).update({
            needsSupport: true
        });
        
        await logActivity("solicitó apoyo 🆘", "🆘", AppState.currentEmotion.color);
        mostrarNotificacion("🆘 Solicitud de apoyo enviada a tus amigos", "success");
    } catch (error) {
        console.error("Error enviando solicitud:", error);
        mostrarNotificacion("Error al enviar solicitud", "error");
    }
}

// Enviar apoyo a un amigo
async function sendSupportToFriend(friendId, friendName) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await db.collection("supports").add({
            fromUserId: user.uid,
            fromUserName: AppState.currentUser?.name,
            toUserId: friendId,
            toUserName: friendName,
            color: AppState.currentEmotion.color,
            emoji: AppState.currentEmotion.emoji,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        await logActivity(`envió apoyo a ${friendName}`, "💖", AppState.currentEmotion.color);
        mostrarNotificacion(`💖 Apoyo enviado a ${friendName}`, "success");
    } catch (error) {
        console.error("Error enviando apoyo:", error);
        mostrarNotificacion("Error al enviar apoyo", "error");
    }
}