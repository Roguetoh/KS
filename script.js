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
const clickPromptSecond = document.getElementById('clickPromptSecond');

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

// Create stars for all canvases
const stars = [];
const starsSecond = [];
for (let i = 0; i < 100; i++) {
    stars.push(new Star(canvas));
    starsSecond.push(new Star(canvasSecond));
}

// Animation loop for all canvases
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

// Game logic for the second screen
const story = {
    start: {
        text: "在一轮皎洁的满月下，你在一个安静的公园遇到了一个迷人的陌生人Alex。他们微笑着问你是否愿意一起散步。",
        choices: [
            { text: "说好，一起散步", next: "walk" },
            { text: "礼貌地拒绝并离开", next: "leave" }
        ]
    },
    walk: {
        text: "你和Alex沿着月光小径漫步。他们指着附近一家温馨的咖啡馆，建议去喝一杯。你会：",
        choices: [
            { text: "同意去咖啡馆", next: "cafe" },
            { text: "提议一起观星", next: "stargaze" }
        ]
    },
    leave: {
        text: "你微笑着告别。离开时，你不禁想知道如果留下会怎样。夜晚显得有些空虚。",
        choices: [],
        ending: "孤独漫步者结局"
    },
    cafe: {
        text: "在咖啡馆，Alex分享了他们的旅行故事。他们靠得更近，询问你的梦想。你会：",
        choices: [
            { text: "敞开心扉，分享你的热情", next: "bond" },
            { text: "保持轻松，转换话题", next: "casual" }
        ]
    },
    stargaze: {
        text: "你们躺在毯子上，凝望星空。Alex指着星座，他们的手轻轻擦过你的手。你会：",
        choices: [
            { text: "握住他们的手", next: "romance" },
            { text: "继续凝望星空", next: "friends" }
        ]
    },
    bond: {
        text: "你们的心灵对话加深了。Alex坦言对你有种特别的感觉。夜晚以再次相会的承诺结束。",
        choices: [],
        ending: "灵魂伴侣结局"
    },
    casual: {
        text: "夜晚轻松有趣，但仅停留在表面。你们以朋友身份告别，温暖却短暂。",
        choices: [],
        ending: "友好告别结局"
    },
    romance: {
        text: "你握住Alex的手，他们露出灿烂的微笑。在星空下，你们分享了一个温柔的吻，开启了新的篇章。",
        choices: [],
        ending: "星光浪漫结局"
    },
    friends: {
        text: "你们一起欣赏星空，欢笑并建立联系。你们以朋友身份离开，相约再次见面。",
        choices: [],
        ending: "新友谊结局"
    }
};

let currentScene = "start";
let gameInitialized = false;

function displayScene() {
    const scene = story[currentScene];
    const storyText = document.getElementById("story-text");
    const choicesDiv = document.getElementById("choices");
    const title = document.getElementById("title");
    const restartBtn = document.getElementById("restart-btn");

    if (!storyText || !choicesDiv || !title || !restartBtn) return;

    storyText.textContent = scene.text;
    choicesDiv.innerHTML = "";
    restartBtn.classList.add("hidden");

    if (scene.choices.length === 0) {
        title.textContent = scene.ending;
        restartBtn.classList.remove("hidden");
    } else {
        title.textContent = "月光抉择";
        scene.choices.forEach(choice => {
            const button = document.createElement("button");
            button.className = "choice-btn w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700";
            button.textContent = choice.text;
            button.addEventListener("click", () => {
                currentScene = choice.next;
                displayScene();
            });
            choicesDiv.appendChild(button);
        });
    }
}

function initializeGame() {
    if (gameInitialized) return;
    displayScene();
    gameInitialized = true;

    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            currentScene = "start";
            displayScene();
        });
    }
}

// Screen transition functionality (First to Second, Second to Third)
document.addEventListener('click', (event) => {
    // Prevent clicks on buttons from triggering the transition
    if (event.target.closest('#backButton') || event.target.closest('#backButtonThird') || event.target.closest('#musicToggle') || event.target.closest('#game-container')) return;
    
    // First to Second
    if (!firstScreen.classList.contains('hidden')) {
        firstScreen.classList.add('hidden');
        secondScreen.classList.remove('hidden');
        initializeGame(); // Initialize the game when the second screen is displayed
    }
});

// Back button functionality (Second to First)
backButton.addEventListener('click', () => {
    secondScreen.classList.add('hidden');
    firstScreen.classList.remove('hidden');
    gameInitialized = false; // Reset game initialization when leaving the second screen
});