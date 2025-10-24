document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const backgroundMusic = document.getElementById('background-music');
    const timeDisplay = document.getElementById('time-survived');
    const pointsDisplay = document.getElementById('points');
    const levelDisplay = document.getElementById('level-display');
    const finalPointsScoreDisplay = document.getElementById('final-points-score');

    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const startSettingsButton = document.getElementById('start-settings-button');
    const highScoreOl = document.getElementById('high-score-ol');

    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');

    const settingsScreen = document.getElementById('settings-screen');
    const saveSettingsButton = document.getElementById('save-settings-button');
    const closeSettingsButton = document.getElementById('close-settings-button');
    const playerSpeedSlider = document.getElementById('player-speed-slider');
    const playerSpeedValue = document.getElementById('player-speed-value');
    const enemySpeedSlider = document.getElementById('enemy-speed-slider');
    const enemySpeedValue = document.getElementById('enemy-speed-value');
    const backgroundSelect = document.getElementById('background-select');

    const countdownOverlay = document.getElementById('countdown-overlay');
    const levelUpDisplay = document.getElementById('level-up-display');

    const PLAYER_SIZE = 50;
    const ENEMY_BOSS_SIZE = 50;
    const ENEMY_MINION_SIZE = 30;
    const POINT_ITEM_SIZE = 30;
    const LEVEL_UP_SCORE = 5;
    const DASH_COOLDOWN = 120; 
    const DASH_DURATION = 10; 
    const DASH_SPEED_MULTIPLIER = 3.5;
    const PLAYER_TRAIL_COOLDOWN = 4;

    let gameBounds = { width: 0, height: 0 };
    let gameSettings = {
        playerSpeed: 5,
        enemyBaseSpeed: 1.5,
        background: 'grid'
    };
    let game = {
        isPlaying: false,
        wasPlaying: false,
        startTime: 0,
        score: 0,
        level: 1,
        animationFrameId: null
    };

    let player = {
        x: 100,
        y: 100,
        el: null,
        isDashing: false,
        dashTimer: 0,
        dashCooldownTimer: 0,
        trailCooldown: 0
    };

    let enemies = [];
    let pointItem = { x: 0, y: 0, el: null };
    let particles = [];
    
    let keysPressed = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        ' ': false 
    };

    window.addEventListener('keydown', (event) => {
        if (keysPressed.hasOwnProperty(event.key)) {
            event.preventDefault();
            keysPressed[event.key] = true;
        }
    });
    window.addEventListener('keyup', (event) => {
        if (keysPressed.hasOwnProperty(event.key)) {
            event.preventDefault();
            keysPressed[event.key] = false;
        }
    });

    startButton.addEventListener('click', startCountdown);
    restartButton.addEventListener('click', showStartScreen);
    startSettingsButton.addEventListener('click', openSettings); 
    closeSettingsButton.addEventListener('click', closeSettings);
    saveSettingsButton.addEventListener('click', saveSettings);

    playerSpeedSlider.addEventListener('input', (e) => playerSpeedValue.textContent = parseFloat(e.target.value).toFixed(1));
    enemySpeedSlider.addEventListener('input', (e) => enemySpeedValue.textContent = parseFloat(e.target.value).toFixed(1));


    function startCountdown() {
        startScreen.classList.add('hidden');
        countdownOverlay.classList.remove('hidden');
        
        let count = 3;
        countdownOverlay.textContent = count;
        countdownOverlay.classList.add('countdown-active');

        const timer = setInterval(() => {
            count--;
            countdownOverlay.classList.remove('countdown-active');
            
            if (count > 0) {
                setTimeout(() => {
                    countdownOverlay.textContent = count;
                    countdownOverlay.classList.add('countdown-active');
                }, 200);
            } else if (count === 0) {
                setTimeout(() => {
                    countdownOverlay.textContent = "¡VAMONOS!";
                    countdownOverlay.classList.add('countdown-active');
                }, 200);
            } else {
                clearInterval(timer);
                countdownOverlay.classList.add('hidden');
                countdownOverlay.classList.remove('countdown-active');
                startGame(); 
            }
        }, 1000);
    }

    function startGame() {
        game.isPlaying = true;
        game.wasPlaying = true; 
        game.startTime = Date.now();
        game.score = 0; 
        game.level = 1;

        gameArea.innerHTML = '';
        enemies = [];
        particles = [];

        backgroundMusic.play();

        player.x = 100;
        player.y = 100;
        player.isDashing = false;
        player.dashTimer = 0;
        player.dashCooldownTimer = 0;
        
        player.el = createGameElement('player', 'character', player.x, player.y, PLAYER_SIZE);

        pointItem.el = createGameElement('point-item', '', 0, 0, POINT_ITEM_SIZE);

        timeDisplay.textContent = 0; 
        pointsDisplay.textContent = 0; 
        levelDisplay.textContent = 1;

        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        settingsScreen.classList.add('hidden'); 

        gameBounds.width = gameArea.clientWidth;
        gameBounds.height = gameArea.clientHeight;
        applyBackground(gameSettings.background);

        spawnPointItem(); 
        spawnEnemy(true);
        
        if (game.animationFrameId) {
            cancelAnimationFrame(game.animationFrameId);
        }
        gameLoop();
    }

    function endGame() {
        game.isPlaying = false;
        game.wasPlaying = false; 
        
        const timeSurvived = parseInt(timeDisplay.textContent);
        saveHighScore(game.score, timeSurvived);

        finalScoreDisplay.textContent = timeSurvived;
        finalPointsScoreDisplay.textContent = game.score; 
        gameOverScreen.classList.remove('hidden');

        gameArea.classList.add('shake');
        setTimeout(() => gameArea.classList.remove('shake'), 500);
    }

    function showStartScreen() {
        gameOverScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');

        timeDisplay.textContent = 0;
        pointsDisplay.textContent = 0;
        levelDisplay.textContent = 1;

        updateHighScoreDisplay();
        applyBackground(gameSettings.background);
    }
    
    function levelUp() {
        game.level++;
        levelDisplay.textContent = game.level;
        
        levelUpDisplay.classList.remove('hidden');
        setTimeout(() => levelUpDisplay.classList.add('hidden'), 1000);
        
        spawnEnemy(false);

        enemies.forEach(enemy => {
            enemy.speed += 0.2;
        });
    }


    function gameLoop() {
        if (!game.isPlaying) return;

        movePlayer();
        moveEnemies();
        updateParticles();
        
        updatePositions();
        updateScore();
        
        checkAllCollisions();

        game.animationFrameId = requestAnimationFrame(gameLoop);
    }
    

    function movePlayer() {
        if (player.dashCooldownTimer > 0) player.dashCooldownTimer--;
        
        if (keysPressed[' '] && player.dashCooldownTimer <= 0) {
            player.isDashing = true;
            player.dashTimer = DASH_DURATION;
            player.dashCooldownTimer = DASH_COOLDOWN;
            player.el.classList.add('player-dashing');
        }
        
        if (player.isDashing) {
            player.dashTimer--;
            if (player.dashTimer <= 0) {
                player.isDashing = false;
                player.el.classList.remove('player-dashing');
            }
        }

        const currentSpeed = gameSettings.playerSpeed * (player.isDashing ? DASH_SPEED_MULTIPLIER : 1);
        
        let dx = 0;
        let dy = 0;

        if (keysPressed.ArrowUp) dy -= 1;
        if (keysPressed.ArrowDown) dy += 1;
        if (keysPressed.ArrowLeft) dx -= 1;
        if (keysPressed.ArrowRight) dx += 1;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            dx = (dx / distance) * currentSpeed;
            dy = (dy / distance) * currentSpeed;
        }

        player.x += dx;
        player.y += dy;

        player.x = Math.max(0, Math.min(gameBounds.width - PLAYER_SIZE, player.x));
        player.y = Math.max(0, Math.min(gameBounds.height - PLAYER_SIZE, player.y));

        if (player.trailCooldown > 0) player.trailCooldown--;
        
        if ((dx !== 0 || dy !== 0) && player.trailCooldown <= 0) {
            createParticle(
                player.x + PLAYER_SIZE / 2, 
                player.y + PLAYER_SIZE / 2, 
                1, 
                '#33c1ff', 
                'player-trail'
            );
            player.trailCooldown = PLAYER_TRAIL_COOLDOWN;
        }
    }

    function moveEnemies() {
        enemies.forEach(enemy => {
            const dx = (player.x + PLAYER_SIZE / 2) - (enemy.x + enemy.size / 2);
            const dy = (player.y + PLAYER_SIZE / 2) - (enemy.y + enemy.size / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
                enemy.x += (dx / distance) * enemy.speed;
                enemy.y += (dy / distance) * enemy.speed;
            }
        });
    }

    function updatePositions() {
        player.el.style.transform = `translate(${player.x}px, ${player.y}px)`;
        pointItem.el.style.transform = `translate(${pointItem.x}px, ${pointItem.y}px)`;
        enemies.forEach(enemy => {
            enemy.el.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;
        });
    }

    function updateScore() {
        const elapsedTime = Math.floor((Date.now() - game.startTime) / 1000);
        timeDisplay.textContent = elapsedTime;
    }

    function checkCollision(pos1, size1, pos2, size2) {
        return (
            pos1.x < pos2.x + size2 &&
            pos1.x + size1 > pos2.x &&
            pos1.y < pos2.y + size2 &&
            pos1.y + size1 > pos2.y
        );
    }

    function checkAllCollisions() {
        for (const enemy of enemies) {
            if (checkCollision(player, PLAYER_SIZE, enemy, enemy.size)) {
                if (!player.isDashing) { 
                    endGame();
                    return;
                }
            }
        }    

        if (checkCollision(player, PLAYER_SIZE, pointItem, POINT_ITEM_SIZE)) {
            game.score++;
            pointsDisplay.textContent = game.score;

            pointItem.el.classList.add('pop');
            createParticle(
                pointItem.x + POINT_ITEM_SIZE / 2, 
                pointItem.y + POINT_ITEM_SIZE / 2, 
                20, 
                '#ffd700'
            );
            setTimeout(() => pointItem.el.classList.remove('pop'), 200);
            
            spawnPointItem();

            if (game.score % LEVEL_UP_SCORE === 0) {
                levelUp();
            }
        }
    }

    
    function createGameElement(id, className, x, y, size) {
        const el = document.createElement('div');
        if (id) el.id = id;
        if (className) el.className = className;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = `translate(${x}px, ${y}px)`;
        gameArea.appendChild(el);
        return el;
    }

    function spawnPointItem() {
        pointItem.x = Math.random() * (gameBounds.width - POINT_ITEM_SIZE);
        pointItem.y = Math.random() * (gameBounds.height - POINT_ITEM_SIZE);
        pointItem.el.style.transform = `translate(${pointItem.x}px, ${pointItem.y}px)`;
    }

    function spawnEnemy(isBoss) {
        const size = isBoss ? ENEMY_BOSS_SIZE : ENEMY_MINION_SIZE;
        const enemy = {
            x: Math.random() * (gameBounds.width - size),
            y: 0, 
            size: size,
            speed: gameSettings.enemyBaseSpeed + (game.level * 0.1),
            el: null
        };
        
        const className = isBoss ? 'character' : 'character enemy-minion';
        const id = isBoss ? 'enemy' : '';
        
        enemy.el = createGameElement(id, className, enemy.x, enemy.y, size);
        enemies.push(enemy);
    }
    
    function createParticle(x, y, count, color, trailClass = '') {
        for (let i = 0; i < count; i++) {
            const size = Math.random() * (trailClass ? 12 : 8) + 2;
            const particle = {
                el: document.createElement('div'),
                x: x,
                y: y,
                size: size,
                dx: (Math.random() - 0.5) * (trailClass ? 2 : 10),
                dy: (Math.random() - 0.5) * (trailClass ? 2 : 10),
                life: trailClass ? 50 : 30 
            };
            
            particle.el.className = 'particle ' + trailClass;
            particle.el.style.width = `${size}px`;
            particle.el.style.height = `${size}px`;
            particle.el.style.backgroundColor = color;
            particle.el.style.transform = `translate(${x}px, ${y}px)`;
            
            gameArea.appendChild(particle.el);
            particles.push(particle);
            
            void particle.el.offsetWidth; 

            if (trailClass) {
                particle.el.style.transform = `translate(${x + (Math.random() - 0.5) * 20}px, ${y + (Math.random() - 0.5) * 20}px) scale(0)`;
                particle.el.style.opacity = '0';
            } else {
                 particle.el.style.transform = `translate(${x + (Math.random() - 0.5) * 150}px, ${y + (Math.random() - 0.5) * 150}px) scale(0)`;
                 particle.el.style.opacity = '0';
            }
        }
    }
    
    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life--;
            
            if (p.life <= 0) {
                p.el.remove();
                particles.splice(i, 1);
            }
        }
    }


    function openSettings() {
        if(game.isPlaying) {
            game.wasPlaying = true;
            game.isPlaying = false;
        }

        playerSpeedSlider.value = gameSettings.playerSpeed;
        playerSpeedValue.textContent = gameSettings.playerSpeed.toFixed(1);
        enemySpeedSlider.value = gameSettings.enemyBaseSpeed;
        enemySpeedValue.textContent = gameSettings.enemyBaseSpeed.toFixed(1);
        backgroundSelect.value = gameSettings.background;
        
        settingsScreen.classList.remove('hidden');
    }

    function closeSettings() {
        settingsScreen.classList.add('hidden');
        if (game.wasPlaying) {
            game.isPlaying = true;
            gameLoop();
        }
    }

    function saveSettings() {
        gameSettings.playerSpeed = parseFloat(playerSpeedSlider.value);
        gameSettings.enemyBaseSpeed = parseFloat(enemySpeedSlider.value);
        gameSettings.background = backgroundSelect.value;
        
        settingsScreen.classList.add('hidden');

        if (game.wasPlaying) {
            startGame();
        } else {
            applyBackground(gameSettings.background);
        }
    }

    function applyBackground(bgName) {
        gameArea.classList.remove('bg-grid', 'bg-dark', 'bg-space');
        if (bgName === 'dark') gameArea.classList.add('bg-dark');
        else if (bgName === 'space') gameArea.classList.add('bg-space');
        else gameArea.classList.add('bg-grid');
    }
    
    
    function loadHighScores() {
        const scores = localStorage.getItem('escapeToSatHighScores');
        return scores ? JSON.parse(scores) : [];
    }
    
    function saveHighScore(score, time) {
        const highScores = loadHighScores();
        const newScore = { score, time, date: new Date().toISOString() };
        
        highScores.push(newScore);
        
        highScores.sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score;
            }
            return b.time - a.time;
        });
        
        const topScores = highScores.slice(0, 5);
        
        localStorage.setItem('escapeToSatHighScores', JSON.stringify(topScores));
    }
    
    function updateHighScoreDisplay() {
        const highScores = loadHighScores();
        highScoreOl.innerHTML = '';
        
        if (highScores.length === 0) {
            highScoreOl.innerHTML = '<li>¡Sé el primero en jugar!</li>';
            return;
        }
        
        highScores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.score} Puntos - ${score.time}s`;
            highScoreOl.appendChild(li);
        });
    }

    function init() {
        gameBounds.width = gameArea.clientWidth;
        gameBounds.height = gameArea.clientHeight;
        applyBackground(gameSettings.background);
        updateHighScoreDisplay();
    }
    
    init();
});