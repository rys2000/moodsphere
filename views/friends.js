async function renderFriendsView() {
    const app = document.getElementById('app');
    
    // Asegurar que el usuario tenga código
    if (!AppState.currentUser?.friendCode && auth.currentUser) {
        const userDoc = await db.collection("users").doc(auth.currentUser.uid).get();
        const userData = userDoc.data();
        AppState.currentUser.friendCode = userData?.friendCode || await generarCodigoAmistad();
    }
    
    // Cargar amigos actualizados
    AppState.friends = await cargarAmigos();
    
    app.innerHTML = `
        <div class="container" style="padding: 40px 20px;">
            <!-- Header -->
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
                <button class="nav-item" onclick="AppState.activeTab = 'dashboard'; render()">← Volver</button>
                <h2>👥 Mis Amigos</h2>
            </div>
            
            ${AppState.authSuccess ? `
                <div class="success-message">${AppState.authSuccess}</div>
            ` : ''}
            
            ${AppState.authError ? `
                <div class="error-message">${AppState.authError}</div>
            ` : ''}
            
            <!-- Sección: Mi Código -->
            <div class="glass-card" style="margin-bottom: 30px; text-align: center;">
                <h3 style="margin-bottom: 15px;">📱 Tu Código de Amistad</h3>
                
                <div style="background: rgba(157,78,221,0.1); border: 2px dashed #9D4EDD; border-radius: 20px; padding: 20px; margin-bottom: 15px;">
                    <div style="font-size: 32px; letter-spacing: 4px; font-family: monospace; margin-bottom: 10px; color: #9D4EDD;">
                        ${AppState.currentUser?.friendCode || 'MOOD-XXXX-XXXX'}
                    </div>
                    <p style="color: rgba(255,255,255,0.7); font-size: 14px;">
                        Comparte este código con tus amigos para conectarlos
                    </p>
                </div>
                
                <!-- QR Code -->
                <div style="margin: 20px 0;">
                    <h4 style="margin-bottom: 10px;">📷 Código QR</h4>
                    <div id="qrCode" class="qr-container"></div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button class="btn" style="flex: 2; background: linear-gradient(135deg, #9D4EDD, #06D6A0);"
                            onclick="generarNuevoCodigo()">
                        🔄 Generar nuevo código
                    </button>
                    <button class="btn" style="flex: 1; background: rgba(255,255,255,0.1);"
                            onclick="copiarCodigo()">
                        📋 Copiar
                    </button>
                </div>
            </div>
            
            <!-- Sección: Agregar Amigo -->
            <div class="glass-card" style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px;">➕ Agregar Amigo</h3>
                
                <div style="display: flex; gap: 10px;">
                    <input type="text" class="glass-input" id="friendCodeInput" 
                           placeholder="Ej: MOOD-2F8A-9B3C" style="flex: 3;">
                    <button class="btn" style="flex: 1; background: linear-gradient(135deg, #38B000, #06D6A0);"
                            onclick="procesarCodigoAmigo()">
                        Agregar
                    </button>
                </div>
                
                <div id="friendMessage" style="margin-top: 10px; font-size: 14px; color: ${AppState.friendMessage?.includes('✅') ? '#38B000' : '#FF5D8F'};">
                    ${AppState.friendMessage || ''}
                </div>
            </div>
            
            <!-- Lista de Amigos -->
            <div class="glass-card">
                <h3 style="margin-bottom: 20px;">👥 Tus Amigos (${AppState.friends.length})</h3>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${AppState.friends.map(friend => `
                        <div style="display: flex; align-items: center; gap: 15px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 16px;">
                            <div style="width: 50px; height: 50px; border-radius: 25px; background: ${friend.currentColor}; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                                ${friend.currentEmoji}
                            </div>
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-weight: 600;">${friend.name}</span>
                                    ${friend.online ? '<span class="online-indicator"></span>' : ''}
                                </div>
                                <div style="font-size: 12px; color: rgba(255,255,255,0.5);">
                                    ${friend.needsSupport ? '🆘 Necesita apoyo' : 'Conectado'}
                                </div>
                            </div>
                            <button class="nav-item" style="padding: 8px 12px;" 
                                    onclick="sendSupportToFriend('${friend.id}', '${friend.name}')">
                                💖 Apoyar
                            </button>
                        </div>
                    `).join('')}
                    
                    ${AppState.friends.length === 0 ? `
                        <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
                            <div style="font-size: 60px; margin-bottom: 15px;">👥</div>
                            <p>No tienes amigos agregados aún</p>
                            <p style="font-size: 12px;">Comparte tu código o agrega a alguien</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Generar QR después de renderizar
    setTimeout(() => {
        if (AppState.currentUser?.friendCode) {
            generarQR('qrCode', AppState.currentUser.friendCode);
        }
    }, 100);
}

// Funciones auxiliares para amigos
window.generarNuevoCodigo = async function() {
    const codigo = await generarCodigoAmistad();
    if (codigo) {
        AppState.currentUser.friendCode = codigo;
        AppState.authSuccess = "✅ Código generado exitosamente";
        await renderFriendsView();
    }
};

window.copiarCodigo = function() {
    const codigo = AppState.currentUser?.friendCode;
    if (codigo) {
        navigator.clipboard.writeText(codigo).then(() => {
            AppState.authSuccess = "📋 Código copiado al portapapeles";
            renderFriendsView();
        }).catch(() => {
            AppState.authError = "Error al copiar";
            renderFriendsView();
        });
    }
};

window.procesarCodigoAmigo = async function() {
    const input = document.getElementById('friendCodeInput');
    if (!input) return;

    AppState.friendMessage = "⏳ Procesando...";
    renderFriendsView();

    const res = await agregarAmigoConCodigo(input.value.trim().toUpperCase());

    AppState.friendMessage = res.success
        ? `✅ Ahora eres amigo de ${res.friendName}`
        : `❌ ${res.error}`;

    if (res.success) input.value = "";

    AppState.friends = await cargarAmigos();
    renderFriendsView();
};

// Función para mostrar vista de amigos
window.mostrarVistaAmigos = async function() {
    AppState.activeTab = 'friends';
    await renderFriendsView();
};