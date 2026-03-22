

// Initialize particles on the home page
document.addEventListener('DOMContentLoaded', () => {
    createParticles('particles-container');
    
    // Smooth transition to game.html
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.onclick = () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 300);
        };
    }
});
