// Catch the Stack (Tech Icon Catcher) Game Module for Fun Zone
(function() {
  const TECH_ICONS = [
    {icon: '🐍', name: 'Python', fact: 'Python is great for data engineering and scripting.'},
    {icon: '🔥', name: 'Apache Spark', fact: 'Spark enables fast, distributed big data processing.'},
    {icon: '🐘', name: 'PostgreSQL', fact: 'PostgreSQL is a powerful open-source relational database.'},
    {icon: '☁️', name: 'Azure', fact: 'Azure is Microsoft’s cloud platform for scalable solutions.'},
    {icon: '🦄', name: 'FastAPI', fact: 'FastAPI is a modern, fast web framework for APIs.'},
    {icon: '🦑', name: 'Kafka', fact: 'Kafka is a distributed event streaming platform.'},
    {icon: '🐳', name: 'Docker', fact: 'Docker containers make deployment easy and consistent.'},
    {icon: '🐙', name: 'GitHub', fact: 'GitHub is the home for modern code collaboration.'}
  ];
  const GAME_WIDTH = 480;
  const GAME_HEIGHT = 420;
  const ICON_SIZE = 40;
  const BASKET_WIDTH = 110;
  const BASKET_HEIGHT = 40;
  const MAX_MISSES = 5;
  const ICON_FALL_SPEED = 2.2;
  const ICON_SPAWN_INTERVAL = 1100;
  let icons = [];
  let score = 0;
  let misses = 0;
  let gameActive = true;
  let iconTimer = null;
  let animationFrame = null;
  let basketX = GAME_WIDTH/2 - BASKET_WIDTH/2;
  let basketEl = null;
  let gameContainer, scoreEl, missEl, restartBtn, gameMessage;

  function getResponsiveDimensions() {
    const isMobile = window.innerWidth < 640;
    return {
      width: isMobile ? Math.min(window.innerWidth - 32, 340) : 480,
      height: isMobile ? 320 : 420,
      basketWidth: isMobile ? 70 : 110,
      basketHeight: isMobile ? 28 : 40,
      iconSize: isMobile ? 32 : 40
    };
  }

  function showTooltip(x, y, text) {
    let tooltip = document.createElement('div');
    tooltip.className = 'absolute z-50 px-3 py-2 rounded bg-gray-800 text-white text-xs shadow-lg pointer-events-none';
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.textContent = text;
    gameContainer.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 1800);
  }

  function spawnIcon() {
    if (!gameActive) return;
    const dims = getResponsiveDimensions();
    const tech = TECH_ICONS[Math.floor(Math.random() * TECH_ICONS.length)];
    const x = Math.random() * (dims.width - dims.iconSize);
    const icon = document.createElement('div');
    icon.textContent = tech.icon;
    icon.className = 'absolute text-3xl select-none pointer-events-none';
    icon.style.left = x + 'px';
    icon.style.top = '0px';
    icon.style.width = dims.iconSize + 'px';
    icon.style.height = dims.iconSize + 'px';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';
    icon.style.fontSize = dims.iconSize + 'px';
    icon.style.lineHeight = '1';
    icon.dataset.name = tech.name;
    icon.dataset.fact = tech.fact;
    gameContainer.appendChild(icon);
    icons.push({el: icon, x, y: 0, tech});
  }

  function moveBasket(dx) {
    basketX = Math.max(0, Math.min(GAME_WIDTH - BASKET_WIDTH, basketX + dx));
    basketEl.style.left = basketX + 'px';
  }

  function gameLoop() {
    if (!gameActive) return;
    const dims = getResponsiveDimensions();
    // Move icons
    for (let i = icons.length - 1; i >= 0; i--) {
      const icon = icons[i];
      icon.y += ICON_FALL_SPEED;
      icon.el.style.top = icon.y + 'px';
      // Check for catch
      if (
        icon.y + dims.iconSize >= dims.height - dims.basketHeight &&
        icon.x + dims.iconSize > basketX &&
        icon.x < basketX + dims.basketWidth
      ) {
        // Caught!
        showTooltip(icon.x, icon.y, icon.tech.name + ': ' + icon.tech.fact);
        icon.el.remove();
        icons.splice(i, 1);
        score++;
        scoreEl.textContent = 'Score: ' + score;
        continue;
      }
      // Remove if missed
      if (icon.y > dims.height) {
        icon.el.remove();
        icons.splice(i, 1);
        misses++;
        missEl.textContent = 'Misses: ' + misses + ' / ' + MAX_MISSES;
        if (misses >= MAX_MISSES) {
          endGame();
          return;
        }
      }
    }
    animationFrame = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    icons.forEach(icon => icon.el.remove());
    icons = [];
    score = 0;
    misses = 0;
    gameActive = true;
    scoreEl.textContent = 'Score: 0';
    missEl.textContent = 'Misses: 0 / ' + MAX_MISSES;
    gameMessage.classList.add('hidden');
    if (iconTimer) clearInterval(iconTimer);
    iconTimer = setInterval(spawnIcon, ICON_SPAWN_INTERVAL);
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(gameLoop);
  }

  function endGame() {
    gameActive = false;
    clearInterval(iconTimer);
    cancelAnimationFrame(animationFrame);
    gameMessage.innerHTML = `<div class='text-2xl font-bold text-accent2 mb-2'>Game Over!</div>
      <div class='mb-2 text-lg'>Your Score: <span class='font-bold text-accent'>${score}</span></div>
      <div class='mb-4'>Now that you've played, <a href='../index.html' class='underline text-accent2 hover:text-accent'>check out my projects!</a></div>`;
    gameMessage.classList.remove('hidden');
  }

  function setupControls(dims) {
    // Keyboard
    window.addEventListener('keydown', function(e) {
      if (!gameActive) return;
      if (e.key === 'ArrowLeft') moveBasket(-Math.round(dims.basketWidth/2));
      if (e.key === 'ArrowRight') moveBasket(Math.round(dims.basketWidth/2));
    });
    // Mouse
    gameContainer.addEventListener('mousemove', function(e) {
      if (!gameActive) return;
      const rect = gameContainer.getBoundingClientRect();
      let x = e.clientX - rect.left - dims.basketWidth/2;
      basketX = Math.max(0, Math.min(dims.width - dims.basketWidth, x));
      basketEl.style.left = basketX + 'px';
    });
    // Touch
    gameContainer.addEventListener('touchmove', function(e) {
      if (!gameActive) return;
      if (e.touches.length > 0) {
        const rect = gameContainer.getBoundingClientRect();
        let x = e.touches[0].clientX - rect.left - dims.basketWidth/2;
        basketX = Math.max(0, Math.min(dims.width - dims.basketWidth, x));
        basketEl.style.left = basketX + 'px';
      }
    });
  }

  window.loadCatchStackGame = function() {
    const dims = getResponsiveDimensions();
    const gameArea = document.getElementById('gameArea');
    if (!gameArea) return;
    gameArea.innerHTML = `
      <div class="w-full max-w-lg mx-auto p-2 sm:p-4 flex flex-col items-center">
        <h2 class="text-2xl md:text-3xl font-extrabold uppercase bg-gradient-to-r from-accent to-accent2 text-transparent bg-clip-text mb-4 drop-shadow-lg">Catch the Stack</h2>
        <div class="flex items-center gap-4 mb-4">
          <span id="score" class="text-lg font-bold text-accent2">Score: 0</span>
          <span id="misses" class="text-lg font-bold text-red-400">Misses: 0 / 5</span>
          <button id="restartBtn" class="bg-accent2 text-white px-3 py-1 rounded shadow hover:bg-accent transition">Restart</button>
        </div>
        <div id="gameContainer" class="relative w-full" style="max-width:${dims.width}px; height:${dims.height}px; background:rgba(17,24,39,0.8); border-radius:1.5rem; box-shadow:0 8px 32px 0 rgba(31,38,135,0.37); overflow:hidden; touch-action: none;"></div>
        <div id="gameMessage" class="hidden mt-6 text-center"></div>
      </div>
    `;
    // DOM
    gameContainer = document.getElementById('gameContainer');
    scoreEl = document.getElementById('score');
    missEl = document.getElementById('misses');
    restartBtn = document.getElementById('restartBtn');
    gameMessage = document.getElementById('gameMessage');
    // Basket
    basketX = dims.width/2 - dims.basketWidth/2;
    basketEl = document.createElement('div');
    basketEl.className = 'absolute bottom-0 bg-accent2 rounded-lg shadow-lg flex items-center justify-center';
    basketEl.style.width = dims.basketWidth + 'px';
    basketEl.style.height = dims.basketHeight + 'px';
    basketEl.style.left = basketX + 'px';
    basketEl.style.bottom = '0px';
    basketEl.innerHTML = `<span class="text-white ${dims.basketWidth < 100 ? 'text-lg' : 'text-2xl'}">🧺</span>`;
    gameContainer.appendChild(basketEl);
    // Controls
    setupControls(dims);
    // Events
    restartBtn.addEventListener('click', startGame);
    // Start
    startGame(dims);
    // Redraw on resize
    window.addEventListener('resize', () => window.loadCatchStackGame(), { once: true });
  };
})(); 