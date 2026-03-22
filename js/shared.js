// Shared Utility Functions and Constants
const WORDS = [
    "cloud", "rain", "storm", "thunder", "lightning", "sky", "wind", "breeze", "mist", "fog",
    "vapor", "drift", "float", "soar", "glide", "hover", "ascend", "descend", "height", "depth",
    "clear", "bright", "sunny", "gloomy", "dark", "heavy", "light", "white", "silver", "gray",
    "blue", "azure", "ocean", "river", "stream", "lake", "pool", "water", "fluid", "liquid",
    "crystal", "pure", "fresh", "cool", "warm", "hot", "fire", "ice", "frost", "snow",
    "typing", "keyboard", "speed", "fast", "quick", "rapid", "swift", "steady", "stable", "firm",
    "score", "level", "lives", "heart", "health", "power", "boost", "blast", "freeze", "heal",
    "master", "ninja", "expert", "skill", "talent", "gift", "brave", "bold", "strong", "mighty",
    "dream", "vision", "spirit", "ghost", "shadow", "light", "glow", "spark", "flame", "blaze",
    "forest", "jungle", "desert", "arctic", "tundra", "valley", "peak", "cliff", "cave", "dune",
    "planet", "galaxy", "star", "moon", "sun", "comet", "orbit", "space", "void", "cosmos",
    "rhythm", "beat", "pulse", "tempo", "flow", "wave", "vibe", "mood", "feel", "touch",
    "active", "dynamic", "static", "fixed", "moving", "still", "peace", "calm", "quiet", "loud",
    "simple", "easy", "hard", "tough", "rigid", "soft", "smooth", "rough", "sharp", "blunt",
    "nature", "earth", "world", "life", "soul", "heart", "mind", "think", "know", "learn"
];

function createParticles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'bg-particle';
        p.style.setProperty('--left', `${Math.random() * 100}%`);
        p.style.setProperty('--duration', `${5 + Math.random() * 10}s`);
        p.style.setProperty('--delay', `${Math.random() * 5}s`);
        p.style.setProperty('--scale', `${0.5 + Math.random() * 1.5}`);
        container.appendChild(p);
    }
}
