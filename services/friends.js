// Generar código único para el usuario
async function generarCodigoAmistad() {
    const user = auth.currentUser;
    if (!user) return null;
    
    // Formato: MOOD-XXXX-XXXX (ej: MOOD-2F8A-9B3C)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const parte1 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const parte2 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const codigo = `MOOD-${parte1}-${parte2}`;
    
    // Guardar en Firestore
    await db.collection("users").doc(user.uid).update({
        friendCode: codigo,
        friendCodeGenerated: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(error => {
        console.error("Error guardando código:", error);
    });
    
    return codigo;
}

// Agregar amigo mediante código
async function agregarAmigoConCodigo(codigo) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "No hay sesión activa" };
    
    // Validar formato
    if (!codigo || !codigo.match(/^MOOD-[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
        return { success: false, error: "Código inválido. Formato: MOOD-XXXX-XXXX" };
    }
    
    // No permitir agregarse a sí mismo
    const userDoc = await db.collection("users").doc(user.uid).get();
    const miCodigo = userDoc.data()?.friendCode;
    if (miCodigo === codigo) {
        return { success: false, error: "No puedes agregarte a ti mismo" };
    }
    
    try {
        // Buscar usuario con ese código
        const snapshot = await db.collection("users")
            .where("friendCode", "==", codigo)
            .limit(1)
            .get();
        
        if (snapshot.empty) {
            return { success: false, error: "Código no encontrado" };
        }
        
        const friendDoc = snapshot.docs[0];
        const friendData = friendDoc.data();
        
        // Verificar si ya son amigos (corregido)
        const friendshipCheck = await db.collection("friendships")
            .where("userId", "==", user.uid)
            .where("friendId", "==", friendDoc.id)
            .get();
        
        if (!friendshipCheck.empty) {
            return { success: false, error: "Ya son amigos" };
        }
        
        // Crear amistad bidireccional
        await db.collection("friendships").add({
            userId: user.uid,
            userEmail: user.email,
            userName: AppState.currentUser?.name || user.email?.split('@')[0],
            friendId: friendDoc.id,
            friendEmail: friendData.email,
            friendName: friendData.name || friendData.email?.split('@')[0],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: "active"
        });
        
        // También crear la relación inversa
        await db.collection("friendships").add({
            userId: friendDoc.id,
            userEmail: friendData.email,
            userName: friendData.name || friendData.email?.split('@')[0],
            friendId: user.uid,
            friendEmail: user.email,
            friendName: AppState.currentUser?.name || user.email?.split('@')[0],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: "active"
        });
        
        // Registrar actividad
        await logActivity(
            `se hizo amigo de ${friendData.name || friendData.email?.split('@')[0]}`,
            "🤝",
            "#9D4EDD"
        );
        
        return { success: true, friendName: friendData.name || friendData.email?.split('@')[0] };
        
    } catch (error) {
        console.error("Error al agregar amigo:", error);
        return { success: false, error: "Error al procesar la solicitud" };
    }
}

// Obtener lista de amigos desde Firestore
async function cargarAmigos() {
    const user = auth.currentUser;
    if (!user) return [];
    
    try {
        const snapshot = await db.collection("friendships")
            .where("userId", "==", user.uid)
            .where("status", "==", "active")
            .get();
        
        const friends = [];
        for (const doc of snapshot.docs) {
            const friendship = doc.data();
            
            // Obtener datos actualizados del amigo
            const friendDoc = await db.collection("users").doc(friendship.friendId).get();
            const friendData = friendDoc.data();
            
            if (friendData) {
                friends.push({
                    id: friendship.friendId,
                    name: friendData.name || friendData.email?.split('@')[0] || "Amigo",
                    email: friendData.email,
                    currentColor: friendData.currentColor || "#9D4EDD",
                    currentEmoji: friendData.currentEmoji || "😊",
                    online: friendData.online || false,
                    needsSupport: friendData.needsSupport || false,
                    glowIntensity: friendData.glowIntensity || 0.5,
                    status: friendData.status || "Conectado",
                    lastActive: friendData.lastActive
                });
            }
        }
        
        return friends;
        
    } catch (error) {
        console.error("Error cargando amigos:", error);
        return [];
    }
}

// Generar QR
function generarQR(containerId, codigo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    new QRCode(container, {
        text: codigo,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}