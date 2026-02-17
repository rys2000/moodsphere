function renderWelcome() {
    return `
        <div class="welcome-container">
            <div class="text-center mb-5">
                <div class="logo">MoodSphere</div>
                <p style="color: rgba(255,255,255,0.7);">Tu espacio emocional</p>
            </div>

            ${AppState.authError ? `
                <div class="error-message">
                    ${AppState.authError}
                </div>
            ` : ''}

            ${AppState.authSuccess ? `
                <div class="success-message">
                    ${AppState.authSuccess}
                </div>
            ` : ''}

            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button class="btn" style="background: linear-gradient(135deg, #38B000, #06D6A0);"
                        onclick="Auth.enterAsGuest()">
                    <span>✨ Empezar como Invitado</span>
                </button>

                <button class="btn btn-gradient" onclick="showSignIn()">
                    <span>🔑 Iniciar Sesión</span>
                </button>

                <button class="btn btn-outline" onclick="showSignUp()">
                    <span>👤 Crear Cuenta</span>
                </button>
            </div>
        </div>
    `;
}

function showSignIn() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="welcome-container">
            <div class="text-center mb-4">
                <div style="font-size: 50px; margin-bottom: 10px;">🔑</div>
                <h2>Iniciar Sesión</h2>
            </div>

            ${AppState.authError ? `
                <div class="error-message">${AppState.authError}</div>
            ` : ''}

            <div style="margin-bottom: 20px;">
                <input type="email" class="glass-input" placeholder="Email" 
                       value="${AppState.authEmail}"
                       oninput="AppState.authEmail = this.value">
            </div>

            <div style="margin-bottom: 30px;">
                <input type="password" class="glass-input" placeholder="Contraseña"
                       value="${AppState.authPassword}"
                       oninput="AppState.authPassword = this.value">
            </div>

            <button class="btn btn-gradient mb-3" ${AppState.authLoading ? 'disabled' : ''}
                    onclick="Auth.signIn(AppState.authEmail, AppState.authPassword)">
                ${AppState.authLoading ? '⏳ Iniciando...' : 'Iniciar Sesión'}
            </button>

            <div style="text-align: center;">
                <a href="#" style="color: #9D4EDD;" onclick="showSignUp(); return false;">Crear cuenta</a>
                <span style="color: rgba(255,255,255,0.3); margin: 0 10px;">|</span>
                <a href="#" style="color: rgba(255,255,255,0.5);" onclick="render(); return false;">Volver</a>
            </div>
        </div>
    `;
}

function showSignUp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="welcome-container">
            <div class="text-center mb-4">
                <div style="font-size: 50px; margin-bottom: 10px;">✨</div>
                <h2>Crear Cuenta</h2>
            </div>

            ${AppState.authError ? `
                <div class="error-message">${AppState.authError}</div>
            ` : ''}

            <div style="margin-bottom: 15px;">
                <input type="text" class="glass-input" placeholder="Nombre (opcional)"
                       value="${AppState.authName}"
                       oninput="AppState.authName = this.value">
            </div>

            <div style="margin-bottom: 15px;">
                <input type="email" class="glass-input" placeholder="Email"
                       value="${AppState.authEmail}"
                       oninput="AppState.authEmail = this.value">
            </div>

            <div style="margin-bottom: 30px;">
                <input type="password" class="glass-input" placeholder="Contraseña (mínimo 6 caracteres)"
                       value="${AppState.authPassword}"
                       oninput="AppState.authPassword = this.value">
            </div>

            <button class="btn btn-gradient mb-3" ${AppState.authLoading ? 'disabled' : ''}
                    onclick="Auth.signUp(AppState.authEmail, AppState.authPassword, AppState.authName)">
                ${AppState.authLoading ? '⏳ Creando...' : 'Crear Cuenta'}
            </button>

            <div style="text-align: center;">
                <a href="#" style="color: #9D4EDD;" onclick="showSignIn(); return false;">Ya tengo cuenta</a>
                <span style="color: rgba(255,255,255,0.3); margin: 0 10px;">|</span>
                <a href="#" style="color: rgba(255,255,255,0.5);" onclick="render(); return false;">Volver</a>
            </div>
        </div>
    `;
}