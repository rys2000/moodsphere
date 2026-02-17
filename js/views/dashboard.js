function renderDashboard() {
    const user = AppState.currentUser || { name: "Usuario" };
    const emotion = AppState.currentEmotion;
    
    return `
        <div class="dashboard">
            <!-- Panel Izquierdo -->
            <div class="left-panel">
                <div class="nav-menu">
                    <div class="nav-item ${AppState.activeTab === 'dashboard' ? 'active' : ''}"
                         onclick="AppState.activeTab = 'dashboard'; render()">📊 Dashboard</div>
                    <div class="nav-item ${AppState.activeTab === 'friends' ? 'active' : ''}"
                         onclick="mostrarVistaAmigos()">👥 Amigos</div>
                    <div class="nav-item ${AppState.activeTab === 'diary' ? 'active' : ''}"
                         onclick="AppState.activeTab = 'diary'; render()">📖 Diario</div>
                    <div class="nav-item" onclick="Auth.signOut()">🚪 Salir</div>
                </div>

                <!-- Esfera Personal -->
                <div class="glass-card-solid personal-sphere">
                    <div class="sphere-large">
                        <div class="energy-ring"></div>
                        <div class="sphere-outer" style="border-color: ${emotion.color}">
                            <div class="sphere-core" style="background: radial-gradient(circle at 30% 30%, ${emotion.color}, ${emotion.color}40); box-shadow: 0 0 40px ${emotion.color};">
                                <span>${emotion.emoji}</span>
                            </div>
                        </div>
                    </div>

                    <h2 style="font-size: 24px;">${user.name}</h2>
                    <p style="color: ${emotion.color};">${emotion.name}</p>

                    <!-- Barra de energía -->
                    <div style="margin: 15px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="color: rgba(255,255,255,0.6);">Energía</span>
                            <span style="color: ${emotion.color};">${Math.round(AppState.glowIntensity * 100)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${AppState.glowIntensity * 100}%; background: linear-gradient(90deg, ${emotion.color}, ${emotion.color}80);"></div>
                        </div>
                    </div>

                    <!-- Stats rápidos -->
                    <div class="stat-item">
                        <span class="stat-label">Amigos</span>
                        <span class="stat-value">${AppState.totalFriends}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">En línea</span>
                        <span class="stat-value" style="color: #06D6A0;">${AppState.connectedFriends}</span>
                    </div>
                </div>

                <!-- Acciones rápidas -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
                    <button class="btn" style="background: linear-gradient(135deg, #9D4EDD, #06D6A0); padding: 12px;"
                            onclick="showEmotionPicker()">
                        🎨 Actualizar
                    </button>
                    <button class="btn" style="background: linear-gradient(135deg, #FF5D8F, #FF9A76); padding: 12px;"
                            onclick="sendSupportRequest()">
                        🆘 Apoyo
                    </button>
                </div>
            </div>

            <!-- Panel Derecho -->
            <div class="right-panel">
                ${AppState.authSuccess ? `
                    <div class="success-message">${AppState.authSuccess}</div>
                ` : ''}
                
                <!-- Stats en vivo -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px;">
                    <div class="glass-card" style="text-align: center;">
                        <div style="font-size: 32px;">👥</div>
                        <div style="font-size: 28px; font-weight: bold; color: #06D6A0;">${AppState.connectedFriends}</div>
                        <div style="color: rgba(255,255,255,0.6); font-size: 12px;">Conectados</div>
                    </div>
                    
                    <div class="glass-card" style="text-align: center;">
                        <div style="font-size: 32px;">🆘</div>
                        <div style="font-size: 28px; font-weight: bold; color: #FF5D8F;">${AppState.supportNeeded}</div>
                        <div style="color: rgba(255,255,255,0.6); font-size: 12px;">Necesitan apoyo</div>
                    </div>
                    
                    <div class="glass-card" style="text-align: center;">
                        <div style="font-size: 32px;">⚡</div>
                        <div style="font-size: 28px; font-weight: bold; color: #FFD166;">87%</div>
                        <div style="color: rgba(255,255,255,0.6); font-size: 12px;">Energía grupal</div>
                    </div>
                </div>

                <!-- Gráfica semanal -->
                <div class="glass-card" style="margin-bottom: 25px;">
                    <h3 style="margin-bottom: 15px;">📊 Energía semanal</h3>
                    <div style="display: flex; align-items: flex-end; gap: 8px; height: 150px;">
                        ${AppState.weeklyMood.map((value, index) => {
                            const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
                            const height = value;
                            return `
                                <div style="flex: 1; text-align: center;">
                                    <div style="background: linear-gradient(to top, #9D4EDD, #06D6A0); height: ${height}%; border-radius: 8px 8px 0 0;"></div>
                                    <span style="font-size: 11px; color: rgba(255,255,255,0.5);">${days[index]}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Amigos en vivo -->
                <div class="glass-card" style="margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <h3>👥 Amigos</h3>
                        <span style="color: #06D6A0;">${AppState.connectedFriends} en línea</span>
                    </div>
                    
                    <div class="friend-grid">
                        ${AppState.friends.slice(0, 6).map(friend => `
                            <div class="friend-tile" onclick="sendSupportToFriend('${friend.id}', '${friend.name}')">
                                <div class="friend-avatar-small" style="background: ${friend.currentColor || '#9D4EDD'};">
                                    ${friend.currentEmoji || '😊'}
                                </div>
                                <div style="font-weight: 600; font-size: 13px;">
                                    ${friend.name}
                                    ${friend.online ? '<span class="online-indicator"></span>' : ''}
                                </div>
                                ${friend.needsSupport ? '<div style="color: #FF5D8F; font-size: 10px;">🆘</div>' : ''}
                            </div>
                        `).join('')}
                        ${AppState.friends.length === 0 ? `
                            <div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">
                                No hay amigos aún
                                <button class="btn btn-outline" style="margin-top: 10px; padding: 8px;" onclick="mostrarVistaAmigos()">
                                    Agregar amigos
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    ${AppState.friends.length > 6 ? `
                        <div style="text-align: center; margin-top: 15px;">
                            <button class="nav-item" onclick="mostrarVistaAmigos()">Ver todos (${AppState.friends.length})</button>
                        </div>
                    ` : ''}
                </div>

                <!-- Actividad reciente -->
                <div class="glass-card">
                    <h3 style="margin-bottom: 20px;">⏱️ Actividad reciente</h3>
                    <div class="activity-timeline">
                        ${AppState.activities.map(activity => `
                            <div class="activity-item">
                                <div class="activity-dot" style="background: ${activity.color};"></div>
                                <div style="width: 30px; height: 30px; border-radius: 15px; background: ${activity.color}20; display: flex; align-items: center; justify-content: center;">
                                    <span>${activity.emoji}</span>
                                </div>
                                <div class="activity-content">
                                    <span style="font-weight: 600;">${activity.userName}</span> ${activity.action}
                                    <div class="activity-time">${activity.time || 'ahora'}</div>
                                </div>
                            </div>
                        `).join('')}
                        ${AppState.activities.length === 0 ? `
                            <div style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">
                                No hay actividad reciente
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showEmotionPicker() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container" style="padding: 40px 20px;">
            <h2 class="text-center mb-4">¿Cómo te sientes?</h2>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
                ${emotionalStates.map(emotion => `
                    <div class="glass-card" style="text-align: center; cursor: pointer; padding: 15px;"
                         onclick="updateEmotion('${emotion.name}', '${emotion.emoji}', '${emotion.color}', ${emotion.energy})">
                        <div style="font-size: 40px; margin-bottom: 10px;">${emotion.emoji}</div>
                        <div style="font-weight: 600;">${emotion.name}</div>
                    </div>
                `).join('')}
            </div>
            
            <button class="btn btn-outline" onclick="render()">Cancelar</button>
        </div>
    `;
}

window.updateEmotion = async function(name, emoji, color, energy) {
    const emotion = emotionalStates.find(e => e.name === name);
    if (emotion) {
        AppState.currentEmotion = emotion;
        AppState.glowIntensity = energy;
        
        await updateUserStatus(true);
        await logActivity(`se siente ${name}`, emoji, color);
    }
    render();
};