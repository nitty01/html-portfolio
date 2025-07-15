// Bug Squash Game Module for Fun Zone
(function() {
  function getResponsiveDimensions() {
    const isMobile = window.innerWidth < 640;
    return {
      width: isMobile ? Math.min(window.innerWidth - 32, 340) : 480,
      height: isMobile ? 320 : 420,
      bugSize: isMobile ? 28 : 36
    };
  }
  window.loadBugSquashGame = function() {
    const dims = getResponsiveDimensions();
    const gameArea = document.getElementById('gameArea');
    if (!gameArea) return;
    gameArea.innerHTML = `
      <div class="w-full max-w-lg mx-auto p-2 sm:p-4 flex flex-col items-center">
        <h2 class="text-2xl md:text-3xl font-extrabold uppercase bg-gradient-to-r from-accent to-accent2 text-transparent bg-clip-text mb-4 drop-shadow-lg">Bug Squash</h2>
        <div class="flex items-center gap-4 mb-4">
          <span id="score" class="text-lg font-bold text-accent2">Score: 0</span>
          <button id="restartBtn" class="bg-accent2 text-white px-3 py-1 rounded shadow hover:bg-accent transition">Restart</button>
          <button id="howToPlayBtn" class="ml-2 px-2 py-1 rounded bg-gray-700 text-white text-xs" title="How to Play">ℹ️ How to Play</button>
        </div>
        <div id="gameContainer" class="relative w-full" style="max-width:${dims.width}px; height:${dims.height}px; background:rgba(17,24,39,0.8); border-radius:1.5rem; box-shadow:0 8px 32px 0 rgba(31,38,135,0.37); overflow:hidden; touch-action: none;"></div>
        <div id="gameMessage" class="hidden mt-6 text-center"></div>
        <div id="instructionsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm hidden">
          <div class="bg-gray-900 text-gray-100 rounded-2xl shadow-glass p-6 max-w-md w-full mx-4 relative">
            <h2 class="text-2xl font-bold text-accent2 mb-2 text-center">How to Play</h2>
            <ul class="list-disc list-inside text-base space-y-2 mb-4">
              <li>Bugs will appear and move around the game area.</li>
              <li><span class="font-semibold text-accent">Click or tap on a bug</span> to squash it and earn a point.</li>
              <li>If <span class="font-semibold text-accent">7 bugs</span> are on the screen at once, the game ends.</li>
              <li>Your score is shown at the top. Try to squash as many bugs as you can!</li>
              <li>Click <span class="font-semibold text-accent">Restart</span> to play again.</li>
              <li>Switch between <span class="font-semibold text-accent">Dark and Light mode</span> using the site toggle.</li>
            </ul>
            <button id="closeInstructions" class="block mx-auto mt-2 px-4 py-2 bg-accent2 text-white rounded-lg font-bold shadow hover:bg-accent transition">Got it!</button>
          </div>
        </div>
      </div>
    `;
    // --- CONFIGURATION ---
    const BUG_EMOJI = '🐞';
    const GAME_WIDTH = 480;
    const GAME_HEIGHT = 420;
    const BUG_SIZE = 36;
    const BUG_SPAWN_INTERVAL = 900; // ms
    const BUG_SPEED_MIN = 1.2;
    const BUG_SPEED_MAX = 2.5;
    const MAX_BUGS_ON_SCREEN = 7;
    // --- STATE ---
    let score = 0;
    let bugs = [];
    let gameActive = true;
    let bugTimer = null;
    let animationFrame = null;
    // --- DOM ---
    let gameContainer = document.getElementById('gameContainer');
    const scoreEl = document.getElementById('score');
    const restartBtn = document.getElementById('restartBtn');
    const gameMessage = document.getElementById('gameMessage');
    // --- INIT ---
    function setupGameArea() {
      gameContainer.style.width = GAME_WIDTH + 'px';
      gameContainer.style.height = GAME_HEIGHT + 'px';
    }
    function startGame(dims) {
      score = 0;
      bugs.forEach(bug => bug.el.remove());
      bugs = [];
      gameActive = true;
      scoreEl.textContent = 'Score: 0';
      gameMessage.classList.add('hidden');
      if (bugTimer) clearInterval(bugTimer);
      bugTimer = setInterval(spawnBug, BUG_SPAWN_INTERVAL);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(gameLoop);
    }
    function endGame() {
      gameActive = false;
      clearInterval(bugTimer);
      cancelAnimationFrame(animationFrame);
      showGameOver();
    }
    function showGameOver() {
      gameMessage.innerHTML = `<div class='text-2xl font-bold text-accent2 mb-2'>Game Over!</div>
        <div class='mb-2 text-lg'>Your Score: <span class='font-bold text-accent'>${score}</span></div>
        <div class='mb-4'>Now that you've played, <a href='../../index.html#projects-section' class='underline text-accent2 hover:text-accent'>check out my projects!</a></div>`;
      gameMessage.classList.remove('hidden');
    }
    // --- BUGS ---
    function spawnBug() {
      if (!gameActive) return;
      const dims = getResponsiveDimensions();
      if (bugs.length >= MAX_BUGS_ON_SCREEN) {
        endGame();
        return;
      }
      const x = Math.random() * (dims.width - dims.bugSize);
      const y = Math.random() * (dims.height - dims.bugSize - 20);
      const speedX = (Math.random() - 0.5) * (BUG_SPEED_MAX - BUG_SPEED_MIN) * 2;
      const speedY = (Math.random() * (BUG_SPEED_MAX - BUG_SPEED_MIN) + BUG_SPEED_MIN) * (Math.random() > 0.5 ? 1 : -1);
      const bug = document.createElement('div');
      bug.textContent = BUG_EMOJI;
      bug.className = 'absolute cursor-pointer transition-transform duration-150 text-3xl select-none pointer-events-auto';
      bug.style.left = x + 'px';
      bug.style.top = y + 'px';
      bug.style.width = dims.bugSize + 'px';
      bug.style.height = dims.bugSize + 'px';
      bug.style.zIndex = 2;
      bug.style.display = 'flex';
      bug.style.alignItems = 'center';
      bug.style.justifyContent = 'center';
      bug.style.fontSize = dims.bugSize + 'px';
      bug.style.lineHeight = '1';
      gameContainer.appendChild(bug);
      bugs.push({ el: bug, x, y, speedX, speedY });
    }
    // --- EVENT DELEGATION FOR BUG SQUASHING ---
    gameContainer.addEventListener('click', function(e) {
      if (!gameActive) return;
      if (e.target && e.target.textContent === BUG_EMOJI && e.target.classList.contains('pointer-events-auto')) {
        const bug = e.target;
        bug.classList.add('scale-75', 'opacity-60');
        setTimeout(() => {
          if (bug.parentNode) bug.parentNode.removeChild(bug);
          bugs = bugs.filter(b => b.el !== bug);
        }, 180);
        score++;
        scoreEl.textContent = 'Score: ' + score;
        e.stopPropagation();
      }
    });
    // --- GAME LOOP ---
    function gameLoop() {
      if (!gameActive) return;
      const dims = getResponsiveDimensions();
      for (let i = bugs.length - 1; i >= 0; i--) {
        const bug = bugs[i];
        bug.x += bug.speedX;
        bug.y += bug.speedY;
        if (bug.x < 0 || bug.x > dims.width - dims.bugSize) bug.speedX *= -1;
        if (bug.y < 0 || bug.y > dims.height - dims.bugSize) bug.speedY *= -1;
        bug.x = Math.max(0, Math.min(dims.width - dims.bugSize, bug.x));
        bug.y = Math.max(0, Math.min(dims.height - dims.bugSize, bug.y));
        bug.el.style.left = bug.x + 'px';
        bug.el.style.top = bug.y + 'px';
      }
      animationFrame = requestAnimationFrame(gameLoop);
    }
    // --- CONTROLS ---
    function setupControls() {
      // Touch
      gameContainer.addEventListener('touchstart', function(e) {
        if (!gameActive) return;
        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          const target = document.elementFromPoint(touch.clientX, touch.clientY);
          if (target && target.textContent === BUG_EMOJI && target.classList.contains('pointer-events-auto')) {
            const bug = target;
            bug.classList.add('scale-75', 'opacity-60');
            setTimeout(() => {
              if (bug.parentNode) bug.parentNode.removeChild(bug);
              bugs = bugs.filter(b => b.el !== bug);
            }, 180);
            score++;
            scoreEl.textContent = 'Score: ' + score;
          }
        }
      });
    }
    // --- INSTRUCTIONS MODAL ---
    const instructionsModal = document.getElementById('instructionsModal');
    const closeInstructions = document.getElementById('closeInstructions');
    const howToPlayBtn = document.getElementById('howToPlayBtn');
    function showInstructions() {
      instructionsModal.classList.remove('hidden');
      instructionsModal.style.display = 'flex';
    }
    function hideInstructions() {
      instructionsModal.classList.add('hidden');
      instructionsModal.style.display = 'none';
    }
    closeInstructions.addEventListener('click', hideInstructions);
    howToPlayBtn.addEventListener('click', showInstructions);
    // Show modal on page load
    window.setTimeout(showInstructions, 200);
    // Optionally, show modal after restart
    restartBtn.addEventListener('click', () => {
      setTimeout(showInstructions, 100);
    });
    // --- INITIALIZE ---
    setupGameArea();
    startGame(dims);
    // Redraw on resize
    window.addEventListener('resize', () => window.loadBugSquashGame(), { once: true });
  };
})(); 