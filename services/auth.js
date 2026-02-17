const Auth = {
    async signIn(email, password) {
        AppState.authLoading = true;
        AppState.authError = null;
        render();

        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            AppState.authError = error.message;
        } finally {
            AppState.authLoading = false;
            render();
        }
    },

    async signUp(email, password, name) {
        AppState.authLoading = true;
        AppState.authError = null;
        render();

        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            const user = result.user;
            
            // Generar código de amistad
            const codigo = await generarCodigoAmistad();
            
            // Crear perfil de usuario
            await db.collection("users").doc(user.uid).set({
                name: name || email.split('@')[0],
                email: email,
                online: true,
                needsSupport: false,
                friendCode: codigo,
                currentEmotion: emotionalStates[1].name,
                currentEmoji: emotionalStates[1].emoji,
                currentColor: emotionalStates[1].color,
                glowIntensity: 0.85,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            AppState.currentUser = { 
                uid: user.uid, 
                email: user.email, 
                name: name || email.split('@')[0],
                friendCode: codigo
            };
            
        } catch (error) {
            AppState.authError = error.message;
        } finally {
            AppState.authLoading = false;
            render();
        }
    },

    async signOut() {
        try {
            await updateUserStatus(false);
            if (unsubscribeUsers) unsubscribeUsers();
            if (unsubscribeActivities) unsubscribeActivities();
            
            // Resetear AppState a valores iniciales
            Object.assign(AppState, {
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
                needsSupport: false,
                friendMessage: ''
            });
            
            await auth.signOut();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    },

    enterAsGuest() {
        AppState.isLoggedIn = true;
        AppState.currentUser = { 
            uid: "guest-" + Date.now(), 
            name: "Invitado", 
            email: "guest@moodsphere.com",
            isGuest: true,
            friendCode: "MOOD-GUEST-GUEST"
        };
        render();
    }
};