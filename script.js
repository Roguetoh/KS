const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
const canvasSecond = document.getElementById('starsSecond');
const ctxSecond = canvasSecond.getContext('2d');
const music = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const speakerIcon = document.getElementById('speakerIcon');
const muteIcon = document.getElementById('muteIcon');
const firstScreen = document.getElementById('firstScreen');
const secondScreen = document.getElementById('secondScreen');
const backButton = document.getElementById('backButton');
const clickPrompt = document.getElementById('clickPrompt');

// Set canvas size to match window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasSecond.width = window.innerWidth;
    canvasSecond.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Star object
class Star {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.5 + 0.5;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }

    update(ctx) {
        this.y += this.speed;
        if (this.y > this.canvas.height) {
            this.y = 0;
            this.x = Math.random() * this.canvas.width;
        }
        this.opacity = Math.random() * 0.5 + 0.5;
        this.draw(ctx);
    }
}

// Create stars for both canvases
const stars = [];
const starsSecond = [];
for (let i = 0; i < 100; i++) {
    stars.push(new Star(canvas));
    starsSecond.push(new Star(canvasSecond));
}

// Animation loop for both canvases
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxSecond.clearRect(0, 0, canvasSecond.width, canvasSecond.height);
    stars.forEach(star => star.update(ctx));
    starsSecond.forEach(star => star.update(ctxSecond));
    requestAnimationFrame(animate);
}

animate();

// Music toggle functionality
music.play().catch(() => {
    // Handle autoplay restrictions by showing mute icon if playback fails
    speakerIcon.classList.add('hidden');
    muteIcon.classList.remove('hidden');
});
musicToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        speakerIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
    } else {
        music.pause();
        speakerIcon.classList.add('hidden');
        muteIcon.classList.remove('hidden');
    }
});

// Screen transition functionality
document.addEventListener('click', (event) => {
    // Prevent clicks on buttons or prompt from triggering the transition
    if (event.target.closest('#backButton') || event.target.closest('#musicToggle') || event.target.closest('#clickPrompt')) return;
    if (!firstScreen.classList.contains('hidden')) {
        firstScreen.classList.add('hidden');
        secondScreen.classList.remove('hidden');
    }
});

// Back button functionality
backButton.addEventListener('click', () => {
    secondScreen.classList.add('hidden');
    firstScreen.classList.remove('hidden');
});