// Automatic Birthday Celebration App - Performance Optimized
class BirthdayApp {
    constructor() {
        this.canvas = null;
        this.sceneManager = null;
        this.audioManager = null;
        
        this.timeline = null;
        this.totalDuration = 60; // 60 seconds total celebration
        this.currentScene = 0;
        this.scenes = [
            { name: 'intro', duration: 8, title: 'Welcome to the Celebration' },
            { name: 'balloons', duration: 12, title: 'Colorful Balloons Appear' },
            { name: 'cake', duration: 15, title: 'Birthday Cake & Candles' },
            { name: 'celebration', duration: 15, title: 'Party Time!' },
            { name: 'finale', duration: 10, title: 'Grand Finale' }
        ];
        
        this.isLoaded = false;
        this.startTime = 0;
    }

    async init() {
        try {
            console.log('BirthdayApp: Initializing automatic celebration...');
            
            this.showLoadingScreen();
            await this.initializeComponents();
            await this.startAutomaticCelebration();
            
            console.log('BirthdayApp: Initialization complete');
        } catch (error) {
            console.error('BirthdayApp: Initialization failed:', error);
            this.showError(error.message);
        }
    }

    showLoadingScreen() {
        const loadingContainer = document.getElementById('loading-container');
        const progressFill = document.getElementById('progress-fill');
        const loadingText = document.getElementById('loading-text');
        const loadingPercentage = document.getElementById('loading-percentage');
        
        const loadingSteps = [
            'Preparing celebration...',
            'Creating balloons...',
            'Baking birthday cake...',
            'Lighting candles...',
            'Setting up party...',
            'Ready to celebrate!'
        ];
        
        let progress = 0;
        let stepIndex = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 15 + 5; // Random progress increments
            if (progress > 100) progress = 100;
            
            progressFill.style.width = `${progress}%`;
            loadingPercentage.textContent = `${Math.floor(progress)}%`;
            
            if (stepIndex < loadingSteps.length) {
                loadingText.textContent = loadingSteps[stepIndex];
                stepIndex++;
            }
            
            if (progress < 100) {
                setTimeout(updateProgress, 300 + Math.random() * 500);
            } else {
                setTimeout(() => {
                    loadingContainer.classList.add('fade-out');
                    this.showMainApp();
                }, 800);
            }
        };
        
        setTimeout(updateProgress, 500);
    }

    showMainApp() {
        const appContainer = document.getElementById('app-container');
        appContainer.classList.add('loaded');
        this.isLoaded = true;
    }

    async initializeComponents() {
        // Initialize canvas
        this.canvas = document.getElementById('birthday-canvas');
        if (!this.canvas) {
            throw new Error('Canvas not found');
        }

        // Initialize scene manager with performance optimizations
        this.sceneManager = new SceneManager(this.canvas);
        await this.sceneManager.init();

        // Initialize simplified audio manager
        this.audioManager = new AudioManager();
        await this.audioManager.init();

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Audio toggle
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => {
                this.audioManager.toggle();
                audioToggle.querySelector('.icon').textContent = 
                    this.audioManager.enabled ? '🔊' : '🔇';
            });
        }

        // Fullscreen toggle
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Resize handler
        window.addEventListener('resize', () => {
            this.sceneManager?.handleResize();
        });

        // Error retry
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    async startAutomaticCelebration() {
        console.log('Starting automatic birthday celebration timeline...');
        
        this.startTime = Date.now();
        this.updateTimer();
        
        // Create GSAP timeline for smooth automatic progression
        if (window.gsap) {
            this.timeline = gsap.timeline({ repeat: -1, yoyo: false });
            this.createCelebrationTimeline();
        } else {
            // Fallback without GSAP
            this.createSimpleTimeline();
        }
    }

    createCelebrationTimeline() {
        let currentTime = 0;
        
        this.scenes.forEach((scene, index) => {
            this.timeline.call(() => {
                this.activateScene(index);
            }, null, currentTime);
            
            currentTime += scene.duration;
        });
        
        // Add automatic restart
        this.timeline.call(() => {
            console.log('Restarting celebration...');
            this.currentScene = 0;
            this.startTime = Date.now();
        }, null, this.totalDuration);
    }

    createSimpleTimeline() {
        let currentTime = 0;
        
        this.scenes.forEach((scene, index) => {
            setTimeout(() => {
                this.activateScene(index);
            }, currentTime * 1000);
            
            currentTime += scene.duration;
        });
        
        // Auto restart
        setTimeout(() => {
            this.startAutomaticCelebration();
        }, this.totalDuration * 1000);
    }

    activateScene(sceneIndex) {
        if (!this.sceneManager) return;
        
        this.currentScene = sceneIndex;
        const scene = this.scenes[sceneIndex];
        
        console.log(`Activating scene: ${scene.name}`);
        
        // Update UI
        this.updateSceneUI(scene);
        
        // Update progress indicator
        this.updateProgressSteps();
        
        // Trigger scene-specific effects
        this.sceneManager.transitionToScene(scene.name);
        
        // Play scene audio
        this.audioManager?.playSceneAudio(scene.name);
    }

    updateSceneUI(scene) {
        const sceneTitle = document.getElementById('scene-title');
        if (sceneTitle) {
            const h1 = sceneTitle.querySelector('h1');
            const p = sceneTitle.querySelector('p');
            
            if (h1) h1.textContent = scene.title;
            if (p) p.textContent = `Scene ${this.currentScene + 1} of ${this.scenes.length}`;
        }
    }

    updateProgressSteps() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index < this.currentScene) {
                step.classList.add('completed');
            } else if (index === this.currentScene) {
                step.classList.add('active');
            }
        });
    }

    updateTimer() {
        const updateTime = () => {
            if (!this.isLoaded) {
                requestAnimationFrame(updateTime);
                return;
            }
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            const timerElement = document.getElementById('scene-timer');
            if (timerElement) {
                timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            requestAnimationFrame(updateTime);
        };
        
        updateTime();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }

    showError(message) {
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        
        if (errorContainer) {
            errorContainer.classList.remove('hidden');
        }
        
        if (errorMessage) {
            errorMessage.textContent = message;
        }
        
        console.error('App Error:', message);
    }
}

// Simplified Audio Manager for Performance
class AudioManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.currentSource = null;
        this.volume = 0.3; // Lower volume for performance
    }

    async init() {
        try {
            if ('AudioContext' in window || 'webkitAudioContext' in window) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            console.log('AudioManager: Initialized');
        } catch (error) {
            console.warn('AudioManager: Audio not available:', error);
        }
    }

    playSceneAudio(sceneName) {
        if (!this.enabled || !this.audioContext) return;
        
        // Simple audio cues for each scene
        const frequencies = {
            intro: 261.63, // C
            balloons: 329.63, // E
            cake: 392.00, // G
            celebration: 523.25, // C (higher)
            finale: 659.25 // E (higher)
        };
        
        this.playTone(frequencies[sceneName] || 440, 0.5);
    }

    playTone(frequency, duration) {
        if (!this.audioContext || !this.enabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Audio play failed:', error);
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        console.log(`Audio ${this.enabled ? 'enabled' : 'disabled'}`);
    }
}

// Performance-Optimized Scene Manager
class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        this.objects = {
            balloons: [],
            cake: null,
            candles: [],
            particles: [],
            stars: [],
            text: null
        };
        
        this.clock = new THREE.Clock();
        this.isAnimating = true;
        this.currentScene = 'intro';
        
        // Performance settings
        this.maxBalloons = 15; // Reduced from 30
        this.maxParticles = 50; // Reduced from 200
        this.maxStars = 30; // Reduced from 100
        this.renderScale = Math.min(window.devicePixelRatio, 1.5); // Cap pixel ratio
    }

    async init() {
        try {
            console.log('SceneManager: Initializing (performance mode)...');
            
            this.setupRenderer();
            this.setupScene();
            this.setupCamera();
            this.setupControls();
            this.setupLighting();
            
            await this.loadModels();
            
            this.startRenderLoop();
            this.startAutomaticAnimations();
            
            console.log('SceneManager: Initialization complete');
            return true;
            
        } catch (error) {
            console.error('SceneManager: Initialization failed:', error);
            throw error;
        }
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false, // Disabled for performance
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.renderScale);
        
        // Basic rendering settings for performance
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap; // Faster than PCF
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        console.log('SceneManager: Renderer initialized (performance mode)');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        // Removed fog for performance
        
        console.log('SceneManager: Scene initialized');
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100); // Reduced far plane
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        console.log('SceneManager: Camera initialized');
    }

    setupControls() {
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.canvas);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.5;
            this.controls.enabled = true; // Always enabled for automatic rotation
            
            console.log('SceneManager: Controls initialized');
        }
    }

    setupLighting() {
        // Simplified lighting for performance
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(10, 15, 5);
        mainLight.castShadow = true;
        
        // Reduced shadow quality for performance
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -15;
        mainLight.shadow.camera.right = 15;
        mainLight.shadow.camera.top = 15;
        mainLight.shadow.camera.bottom = -15;
        
        this.scene.add(mainLight);
        
        // Single accent light
        const accentLight = new THREE.PointLight(0xff69b4, 0.5, 20);
        accentLight.position.set(0, 8, 0);
        this.scene.add(accentLight);
        
        console.log('SceneManager: Lighting initialized (simplified)');
    }

    async loadModels() {
        try {
            console.log('SceneManager: Loading models (optimized)...');
            
            await Promise.all([
                this.createEnvironment(),
                this.createBalloons(),
                this.createCake(),
                this.createFloatingText(),
                this.createParticles(),
                this.createStars()
            ]);
            
            console.log('SceneManager: All models loaded');
        } catch (error) {
            console.error('SceneManager: Model loading failed:', error);
            throw error;
        }
    }

    async createEnvironment() {
        // Simple ground
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.5
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        console.log('SceneManager: Environment created');
    }

    async createBalloons() {
        const balloonGeometry = new THREE.SphereGeometry(0.3, 16, 16); // Lower detail
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd];
        
        for (let i = 0; i < this.maxBalloons; i++) {
            const material = new THREE.MeshLambertMaterial({ // Simpler material
                color: colors[i % colors.length]
            });
            
            const balloon = new THREE.Mesh(balloonGeometry, material);
            
            const angle = (i / this.maxBalloons) * Math.PI * 2;
            const radius = 6 + Math.random() * 4;
            balloon.position.set(
                Math.cos(angle) * radius,
                Math.random() * 4 + 2,
                Math.sin(angle) * radius
            );
            
            balloon.castShadow = true;
            balloon.userData = { 
                type: 'balloon', 
                id: i,
                originalY: balloon.position.y,
                floatSpeed: 0.5 + Math.random() * 0.5,
                visible: false
            };
            
            balloon.visible = false; // Start invisible
            
            this.scene.add(balloon);
            this.objects.balloons.push(balloon);
        }
        
        console.log(`SceneManager: Created ${this.objects.balloons.length} balloons`);
    }

    async createCake() {
        const cakeGroup = new THREE.Group();
        
        // Simplified single-tier cake
        const geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.8, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0xffb3ba });
        
        const cake = new THREE.Mesh(geometry, material);
        cake.position.y = 0.4;
        cake.castShadow = true;
        cake.receiveShadow = true;
        
        cakeGroup.add(cake);
        
        // Simple candles
        this.createSimpleCandles(cakeGroup);
        
        cakeGroup.position.y = -1.5;
        cakeGroup.userData = { type: 'cake', visible: false };
        cakeGroup.visible = false; // Start invisible
        
        this.scene.add(cakeGroup);
        this.objects.cake = cakeGroup;
        
        console.log('SceneManager: Cake created (simplified)');
    }

    createSimpleCandles(parent) {
        const candleCount = 8; // Reduced from 16
        const candleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
        const candleMaterial = new THREE.MeshLambertMaterial({ color: 0xfff8dc });
        
        for (let i = 0; i < candleCount; i++) {
            const angle = (i / candleCount) * Math.PI * 2;
            const x = Math.cos(angle) * 1;
            const z = Math.sin(angle) * 1;
            
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);
            candle.position.set(x, 0.6, z);
            candle.castShadow = true;
            
            // Simple flame
            const flame = new THREE.Mesh(
                new THREE.ConeGeometry(0.05, 0.15, 6),
                new THREE.MeshBasicMaterial({ color: 0xff6600 })
            );
            flame.position.set(0, 0.25, 0);
            flame.userData = { type: 'flame', id: i, lit: true };
            
            candle.add(flame);
            parent.add(candle);
            
            this.objects.candles.push({ candle, flame });
        }
        
        console.log(`SceneManager: Created ${candleCount} candles`);
    }

    async createFloatingText() {
        try {
            // Simpler text creation
            const canvas = document.createElement('canvas');
            canvas.width = 1024; // Smaller canvas
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#ff69b4';
            ctx.font = "bold 60px Arial";
            ctx.textAlign = 'center';
            ctx.fillText("Happy Birthday Aafia!", canvas.width/2, canvas.height/2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            
            const sprite = new THREE.Sprite(material);
            sprite.position.set(0, 6, 0);
            sprite.scale.set(8, 2, 1);
            sprite.userData = { type: 'text', visible: false };
            sprite.visible = false;
            
            this.scene.add(sprite);
            this.objects.text = sprite;
            
            console.log('SceneManager: Text created (simplified)');
        } catch (error) {
            console.warn('Text creation failed:', error);
        }
    }

    async createParticles() {
        const confettiGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7];
        
        for (let i = 0; i < this.maxParticles; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0
            });
            
            const confetti = new THREE.Mesh(confettiGeometry, material);
            confetti.position.set(0, 15, 0); // Start above scene
            
            confetti.userData = {
                type: 'confetti',
                active: false
            };
            
            this.scene.add(confetti);
            this.objects.particles.push(confetti);
        }
        
        console.log(`SceneManager: Created ${this.objects.particles.length} particles`);
    }

    async createStars() {
        const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        
        for (let i = 0; i < this.maxStars; i++) {
            const starMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.5
            });
            
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(
                (Math.random() - 0.5) * 50,
                Math.random() * 20 + 10,
                (Math.random() - 0.5) * 50
            );
            
            star.userData = { type: 'star', visible: false };
            star.visible = false;
            
            this.scene.add(star);
            this.objects.stars.push(star);
        }
        
        console.log(`SceneManager: Created ${this.objects.stars.length} stars`);
    }

    startAutomaticAnimations() {
        // Timeline-based automatic animations
        if (!window.gsap) {
            console.warn('GSAP not available, using basic animations');
            return;
        }
        
        const tl = gsap.timeline({ repeat: -1 });
        
        // Scene 1: Intro (0-8s) - Show text and stars
        tl.call(() => {
            if (this.objects.text) {
                this.objects.text.visible = true;
                gsap.from(this.objects.text.scale, { x: 0, y: 0, duration: 2, ease: "back.out(1.7)" });
            }
            
            this.objects.stars.forEach((star, index) => {
                star.visible = true;
                gsap.from(star.scale, { x: 0, y: 0, z: 0, duration: 1, delay: index * 0.1, ease: "power2.out" });
            });
        });
        
        // Scene 2: Balloons appear (8-20s)
        tl.call(() => {
            this.objects.balloons.forEach((balloon, index) => {
                balloon.visible = true;
                balloon.userData.visible = true;
                gsap.from(balloon.position, { y: -5, duration: 2, delay: index * 0.2, ease: "bounce.out" });
            });
        }, null, 8);
        
        // Scene 3: Cake appears (20-35s)
        tl.call(() => {
            if (this.objects.cake) {
                this.objects.cake.visible = true;
                this.objects.cake.userData.visible = true;
                gsap.from(this.objects.cake.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "back.out(1.7)" });
            }
        }, null, 20);
        
        // Scene 4: Celebration - Confetti explosion (35-50s)
        tl.call(() => {
            this.triggerConfettiExplosion();
        }, null, 35);
        
        // Scene 5: Finale - All effects (50-60s)
        tl.call(() => {
            this.triggerFinaleEffects();
        }, null, 50);
    }

    triggerConfettiExplosion() {
        this.objects.particles.forEach((particle, index) => {
            if (index % 2 === 0) { // Use every other particle for performance
                particle.userData.active = true;
                particle.material.opacity = 1;
                particle.position.set(0, 8, 0);
                
                const angle = (index / this.objects.particles.length) * Math.PI * 2;
                const speed = 3 + Math.random() * 3;
                
                gsap.to(particle.position, {
                    x: Math.cos(angle) * speed,
                    y: -2,
                    z: Math.sin(angle) * speed,
                    duration: 3,
                    ease: "power2.out"
                });
                
                gsap.to(particle.material, {
                    opacity: 0,
                    duration: 3,
                    ease: "power1.out"
                });
                
                gsap.to(particle.rotation, {
                    x: Math.PI * 4,
                    y: Math.PI * 4,
                    duration: 3,
                    ease: "none"
                });
            }
        });
    }

    triggerFinaleEffects() {
        // Scale up all visible objects
        this.objects.balloons.forEach(balloon => {
            if (balloon.userData.visible) {
                gsap.to(balloon.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 2, yoyo: true, repeat: 1 });
            }
        });
        
        if (this.objects.cake && this.objects.cake.userData.visible) {
            gsap.to(this.objects.cake.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 2, yoyo: true, repeat: 1 });
        }
        
        if (this.objects.text) {
            gsap.to(this.objects.text.scale, { x: 12, y: 3, duration: 2, yoyo: true, repeat: 1 });
        }
    }

    startRenderLoop() {
        let lastTime = 0;
        const targetFPS = 30; // Cap at 30 FPS for performance
        const frameInterval = 1000 / targetFPS;
        
        const animate = (currentTime) => {
            if (!this.isAnimating) return;
            
            requestAnimationFrame(animate);
            
            if (currentTime - lastTime < frameInterval) return;
            
            const deltaTime = Math.min(this.clock.getDelta(), 0.05); // Cap delta time
            
            this.update(deltaTime);
            this.render();
            
            lastTime = currentTime;
        };
        
        animate(0);
        console.log('SceneManager: Render loop started (30 FPS cap)');
    }

    update(deltaTime) {
        if (this.controls) {
            this.controls.update();
        }
        
        this.updateBalloons(deltaTime);
        this.updateCandles(deltaTime);
        this.updateStars(deltaTime);
    }

    updateBalloons(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.balloons.forEach(balloon => {
            if (!balloon.userData.visible) return;
            
            const floatSpeed = balloon.userData.floatSpeed;
            balloon.position.y = balloon.userData.originalY + 
                Math.sin(time * floatSpeed + balloon.userData.id) * 0.3;
            
            balloon.rotation.y += deltaTime * 0.5;
        });
    }

    updateCandles(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.candles.forEach(({ flame }) => {
            if (!flame.userData.lit) return;
            
            const flicker = 0.8 + Math.sin(time * 10 + flame.userData.id) * 0.2;
            flame.material.opacity = flicker;
        });
    }

    updateStars(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.stars.forEach(star => {
            if (!star.userData.visible) return;
            
            const twinkle = Math.sin(time * 2 + star.userData.id) * 0.3 + 0.7;
            star.material.opacity = twinkle * 0.5;
        });
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    transitionToScene(sceneName) {
        console.log(`SceneManager: Transitioning to ${sceneName}`);
        this.currentScene = sceneName;
    }

    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(this.renderScale);
    }

    dispose() {
        console.log('SceneManager: Disposing...');
        this.isAnimating = false;
        
        this.scene?.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        
        this.renderer?.dispose();
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new BirthdayApp();
    app.init().catch(error => {
        console.error('Failed to initialize birthday app:', error);
    });
});
