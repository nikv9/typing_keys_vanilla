

// Game Assets
const CORRECT_SFX = new Audio('assets/correct.mp3');
const WRONG_SFX = new Audio('assets/wrong.mp3');
CORRECT_SFX.volume = 0.5;
WRONG_SFX.volume = 0.5;

// Game State
let gameState = {
    score: 0,
    lives: 5,
    timerOn: false,
    timeLeft: 60,
    paused: false,
    isFrozen: false,
    accuracy: 100,
    totalChars: 0,
    correctChars: 0,
    currentWord: '',
    inputVal: '',
    powerUp: null,
    gameActive: false,
    interval: null
};

// DOM Elements
const elements = {
    startChallengeBtn: document.getElementById('start-challenge-btn'),
    restartBtn: document.getElementById('restart-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    quitBtn: document.getElementById('quit-btn'),
    tryAgainBtn: document.getElementById('try-again-btn'),

    input: document.getElementById('game-input'),
    wordContainer: document.getElementById('word-container'),
    readyScreen: document.getElementById('ready-screen'),
    gameOverModal: document.getElementById('game-over-modal'),

    scoreVal: document.getElementById('score-val'),
    accuracyVal: document.getElementById('accuracy-val'),
    timeVal: document.getElementById('time-val'),
    finalScore: document.getElementById('final-score'),
    finalAccuracy: document.getElementById('final-accuracy'),

    livesDisplay: document.getElementById('lives-display'),
    timerDisplay: document.getElementById('timer-display'),
    modeLives: document.getElementById('mode-lives'),
    modeTimer: document.getElementById('mode-timer'),

    particles: document.getElementById('particles-container')
};

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    createParticles('particles-container');
    attachEventListeners();
});

function attachEventListeners() {
    elements.startChallengeBtn.onclick = startGame;
    elements.restartBtn.onclick = () => startGame();
    elements.pauseBtn.onclick = togglePause;
    elements.quitBtn.onclick = () => window.location.href = 'index.html';
    elements.tryAgainBtn.onclick = startGame;

    elements.modeLives.onclick = () => setTimerMode(false);
    elements.modeTimer.onclick = () => setTimerMode(true);

    elements.input.oninput = handleInput;

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameState.gameActive && !gameState.paused) {
            togglePause();
        }
    });
}

function setTimerMode(isOn) {
    if (gameState.gameActive) stopGame(true);
    gameState.timerOn = isOn;
    elements.modeTimer.classList.toggle('active', isOn);
    elements.modeLives.classList.toggle('active', !isOn);
    elements.timerDisplay.classList.toggle('hidden', !isOn);
    elements.livesDisplay.classList.toggle('hidden', isOn);
}

function startGame() {
    // Reset State
    gameState.score = 0;
    gameState.lives = 5;
    gameState.timeLeft = 60;
    gameState.accuracy = 100;
    gameState.totalChars = 0;
    gameState.correctChars = 0;
    gameState.inputVal = '';
    gameState.paused = false;
    gameState.isFrozen = false;
    gameState.gameActive = true;
    gameState.powerUp = null;

    // UI Reset
    updateStatsUI();
    elements.readyScreen.classList.add('hidden');
    elements.gameOverModal.classList.add('hidden');
    elements.input.value = '';
    elements.input.disabled = false;
    elements.input.focus();
    elements.pauseBtn.classList.remove('paused');
    elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';

    if (gameState.interval) clearInterval(gameState.interval);

    if (gameState.timerOn) {
        gameState.interval = setInterval(() => {
            if (!gameState.paused) {
                gameState.timeLeft--;
                elements.timeVal.innerText = `${gameState.timeLeft}s`;
                if (gameState.timeLeft <= 0) stopGame();
            }
        }, 1000);
    }

    spawnWord();
}

function stopGame(manual = false) {
    console.log("Stopping game, manual:", manual);
    if (gameState.interval) clearInterval(gameState.interval);
    gameState.gameActive = false;

    if (elements.input) {
        elements.input.disabled = true;
        elements.input.value = '';
    }

    if (elements.wordContainer) {
        elements.wordContainer.innerHTML = '';
    }

    if (manual) {
        if (elements.readyScreen) elements.readyScreen.classList.remove('hidden');
        if (elements.gameOverModal) elements.gameOverModal.classList.add('hidden');
    } else {
        calculateAccuracy();
        if (elements.finalScore) elements.finalScore.innerText = gameState.score;
        if (elements.finalAccuracy) elements.finalAccuracy.innerText = gameState.accuracy + '%';
        if (elements.gameOverModal) {
            elements.gameOverModal.classList.remove('hidden');
            console.log("GameOver modal should now be visible");
        }
    }
}

function spawnWord() {
    if (!gameState.gameActive) return;

    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    gameState.currentWord = word;
    gameState.inputVal = '';
    gameState.powerUp = Math.random() < 0.1 ? ["FREEZE", "BLAST", "HEAL"][Math.floor(Math.random() * 3)] : null;

    renderWord();
}

function getDuration() {
    return Math.max(1.2, 5.5 / (1 + gameState.score / 400));
}

function renderWord() {
    elements.wordContainer.innerHTML = '';
    const wordEl = document.createElement('div');
    wordEl.className = 'falling-word';
    wordEl.style.animationDuration = `${getDuration()}s`;
    wordEl.style.animationPlayState = (gameState.paused || gameState.isFrozen) ? 'paused' : 'running';

    wordEl.addEventListener('animationend', handleMissedWord);

    const textEl = document.createElement('div');
    textEl.className = `word-text ${gameState.currentWord.length > 7 ? 'large' : ''}`;

    gameState.currentWord.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.innerText = char;
        textEl.appendChild(span);
    });

    wordEl.appendChild(textEl);

    if (gameState.powerUp) {
        const badge = document.createElement('div');
        badge.className = 'power-up-badge';
        badge.innerText = gameState.powerUp === "FREEZE" ? "❄️" : gameState.powerUp === "BLAST" ? "💥" : "❤️";
        wordEl.appendChild(badge);
    }

    elements.wordContainer.appendChild(wordEl);
    updateWordVisuals();
}

function updateWordVisuals() {
    const chars = document.querySelectorAll('.char');
    const input = gameState.inputVal.toLowerCase();
    const word = gameState.currentWord.toLowerCase();

    chars.forEach((span, i) => {
        span.className = 'char';
        if (i < input.length) {
            if (input[i] === word[i]) {
                span.classList.add('correct');
            } else {
                span.classList.add('wrong');
            }
        } else if (i === input.length && !gameState.paused) {
            span.classList.add('active');
        }
    });
}

function handleInput(e) {
    if (gameState.paused || !gameState.gameActive) {
        elements.input.value = gameState.inputVal;
        return;
    }

    const val = e.target.value.toLowerCase().trim();
    if (val.length > gameState.inputVal.length) {
        gameState.totalChars++;
        if (val[val.length - 1] === gameState.currentWord.toLowerCase()[val.length - 1]) {
            gameState.correctChars++;
        }
    }

    gameState.inputVal = val;
    calculateAccuracy();
    updateWordVisuals();

    if (val === gameState.currentWord.toLowerCase()) {
        handleCorrectWord();
    }
}

function handleCorrectWord() {
    playSfx('correct');
    gameState.score += 10;

    if (gameState.powerUp) {
        if (gameState.powerUp === "FREEZE") {
            gameState.isFrozen = true;
            const wordEl = document.querySelector('.falling-word');
            if (wordEl) wordEl.style.animationPlayState = 'paused';
            setTimeout(() => {
                gameState.isFrozen = false;
                const currentWordEl = document.querySelector('.falling-word');
                if (currentWordEl && !gameState.paused) currentWordEl.style.animationPlayState = 'running';
            }, 3000);
        } else if (gameState.powerUp === "BLAST") {
            gameState.score += 20;
        } else if (gameState.powerUp === "HEAL") {
            gameState.lives = Math.min(gameState.lives + 1, 5);
        }
    }

    elements.input.value = '';
    updateStatsUI();
    spawnWord();
}

function handleMissedWord(e) {
    if (e && e.animationName !== 'fall') return;

    playSfx('wrong');
    if (!gameState.timerOn) {
        gameState.lives--;
        if (gameState.lives <= 0) {
            stopGame();
            return;
        }
    }

    elements.input.value = '';
    updateStatsUI();
    spawnWord();
}

function calculateAccuracy() {
    if (gameState.totalChars > 0) {
        gameState.accuracy = Math.round((gameState.correctChars / gameState.totalChars) * 100);
    }
    elements.accuracyVal.innerText = `${gameState.accuracy}%`;
}

function updateStatsUI() {
    elements.scoreVal.innerText = gameState.score;
    const dots = elements.livesDisplay.querySelectorAll('.life-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i < gameState.lives);
    });
    elements.timeVal.innerText = `${gameState.timeLeft}s`;
}

function togglePause() {
    if (!gameState.gameActive) return;
    gameState.paused = !gameState.paused;
    elements.input.disabled = gameState.paused;
    elements.pauseBtn.classList.toggle('paused', gameState.paused);
    elements.pauseBtn.innerHTML = gameState.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    elements.input.placeholder = gameState.paused ? 'Paused' : 'Type...';

    const wordEl = document.querySelector('.falling-word');
    if (wordEl) {
        wordEl.style.animationPlayState = (gameState.paused || gameState.isFrozen) ? 'paused' : 'running';
    }

    if (!gameState.paused) {
        elements.input.focus();
        updateWordVisuals();
    }
}

function playSfx(type) {
    const sfx = type === 'correct' ? CORRECT_SFX : WRONG_SFX;
    sfx.currentTime = 0;
    sfx.play().catch(() => { });
}
