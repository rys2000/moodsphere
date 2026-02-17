class EmotionalState {
    constructor(name, emoji, color, energy) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.emoji = emoji;
        this.color = color;
        this.energy = energy;
    }
}

// Estados emocionales predefinidos
const emotionalStates = [
    new EmotionalState("Radiante", "🌈", "#FFD166", 1.0),
    new EmotionalState("Feliz", "😊", "#FF9A76", 0.8),
    new EmotionalState("Tranquilo", "😌", "#06D6A0", 0.6),
    new EmotionalState("Reflexivo", "🤔", "#9D4EDD", 0.5),
    new EmotionalState("Melancólico", "😔", "#5A199A", 0.3),
    new EmotionalState("Triste", "🌧️", "#6D6875", 0.2),
    new EmotionalState("Energético", "🔥", "#E63946", 0.9),
    new EmotionalState("Sereno", "🍃", "#38B000", 0.7)
];