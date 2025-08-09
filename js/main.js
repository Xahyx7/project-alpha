// Professional Birthday Application - Fixed and Simplified
class BirthdayApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        
        this.objects = {
            balloons: [],
            cake: null,
            candles: [],
            particles: []
        };
        
        this.currentScene = 'intro';
        this.isLoaded = false;
        this.audioEnabled = true;
        
        this.init();
    }

    async init() {
        try {
            console.log('Initializing Birthday App...');
            
            // Check if Three.js is loaded
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js not loaded');
            }
            
            await this.simulateLoading();
            await this.initializeScene();
            this.setupEventListeners();
            this.startExperience();
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError(error.message);
        }
    }

    async simulateLoading() {
        const steps = [
            { progress: 20, text: 'Setting up 3D environment...' },
            { progress: 40, text: 'Loading birthday magic...' },
            { progress: 60, text: 'Preparing animations...' },
            { progress: 80, text: 'Almost ready...' },
            { progress: 100, text: 'Welcome to the celebration!' }
        ];

        for (const step of steps) {
            this.updateLoadingProgress(step.progress, step.text);
            await this.delay(800);
        }
    }

    async initializeScene() {
        const canvas = document.getElementById('birthday-canvas');
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);

        // Setup camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Setup controls
        this.controls = new THREE.OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 25;
        this.controls.maxPolarAngle = Math.PI / 2.2;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;

        // Setup lighting
        this.setupLighting();
        
        // Create 3D objects
        await this.createObjects();
        
        // Start render loop
        this.startRenderLoop();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -20;
        mainLight.shadow.camera.right = 20;
        mainLight.shadow.camera.top = 20;
        mainLight.shadow.camera.bottom = -20;
        this.scene.add(mainLight);
        
        // Fill lights
        const fillLight = new THREE.DirectionalLight(0xffeaa7, 0.3);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);
        
        const rimLight = new THREE.DirectionalLight(0x74b9ff, 0.2);
        rimLight.position.set(0, 5, -15);
        this.scene.add(rimLight);
    }

    async createObjects() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.3
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Create balloons
        this.createBalloons();
        
        // Create cake
        this.createCake();
        
        // Create floating text
        this.createFloatingText();
        
        // Create particles
        this.createParticles();
        
        // Create stars
        this.createStars();
    }

    createBalloons() {
        const balloonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd];
        
        for (let i = 0; i < 25; i++) {
            const material = new THREE.MeshPhysicalMaterial({
                color: colors[i % colors.length],
                metalness: 0.1,
                roughness: 0.2,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                transmission: 0.1,
                ior: 1.4
            });
            
            const balloon = new THREE.Mesh(balloonGeometry, material);
            balloon.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 8 + 2,
                (Math.random() - 0.5) * 20
            );
            
            balloon.castShadow = true;
            balloon.receiveShadow = true;
            balloon.userData = { 
                type: 'balloon', 
                id: i,
                originalY: balloon.position.y,
                floatSpeed: 0.5 + Math.random() * 0.5,
                popped: false
            };
            
            this.scene.add(balloon);
            this.objects.balloons.push(balloon);
        }
    }

    createCake() {
        const cakeGroup = new THREE.Group();
        
        // Create multi-tier cake
        const tiers = [
            { radius: 2, height: 0.8, color: 0xffb3ba },
            { radius: 1.5, height: 0.6, color: 0xffdfba },
            { radius: 1, height: 0.4, color: 0xffffba }
        ];
        
        let yOffset = 0;
        
        tiers.forEach((tier, index) => {
            const geometry = new THREE.CylinderGeometry(tier.radius, tier.radius, tier.height, 64);
            const material = new THREE.MeshPhysicalMaterial({
                color: tier.color,
                metalness: 0.1,
                roughness: 0.3,
                clearcoat: 0.8,
                clearcoatRoughness: 0.2
            });
            
            const tierMesh = new THREE.Mesh(geometry, material);
            tierMesh.position.y = yOffset + tier.height / 2;
            tierMesh.castShadow = true;
            tierMesh.receiveShadow = true;
            
            cakeGroup.add(tierMesh);
            yOffset += tier.height;
        });
        
        // Add candles
        this.createCandles(cakeGroup, tiers[2].radius, yOffset);
        
        cakeGroup.position.y = -1;
        this.scene.add(cakeGroup);
        this.objects.cake = cakeGroup;
    }

    createCandles(parent, radius, height) {
        const candleCount = 12;
        const candleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 16);
        const candleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfff8dc,
            metalness: 0,
            roughness: 0.3
        });
        
        const flameGeometry = new THREE.ConeGeometry(0.05, 0.15, 8);
        const flameMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b00,
            transparent: true,
            opacity: 0.8
        });
        
        for (let i = 0; i < candleCount; i++) {
            const angle = (i / candleCount) * Math.PI * 2;
            const x = Math.cos(angle) * (radius * 0.8);
            const z = Math.sin(angle) * (radius * 0.8);
            
            // Candle
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);
            candle.position.set(x, height + 0.2, z);
            candle.castShadow = true;
            parent.add(candle);
            
            // Flame
            const flame = new THREE.Mesh(flameGeometry, flameMaterial.clone());
            flame.position.set(0, 0.25, 0);
            flame.userData = { 
                type: 'flame', 
                id: i,
                lit: true,
                originalIntensity: 0.8
            };
            candle.add(flame);
            
            this.objects.candles.push({ candle, flame });
        }
    }

    createFloatingText() {
        // Create text using CSS3D or canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "bold 80px Arial";
        ctx.fillStyle = '#ff77aa';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ffaacc';
        ctx.shadowBlur = 20;
        ctx.fillText("Happy Birthday Aafia!", canvas.width/2, 150);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture, 
            transparent: true,
            alphaTest: 0.1
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.set(0, 6, 0);
        sprite.scale.set(8, 2, 1);
        this.scene.add(sprite);
        
        // Animate the text
        gsap.to(sprite.scale, {
            x: 9, y: 2.3,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    createParticles() {
        // Confetti system
        const confettiGeometry = new THREE.PlaneGeometry(0.1, 0.05);
        const confettiColors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd];
        
        for (let i = 0; i < 100; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: confettiColors[i % confettiColors.length],
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0
            });
            
            const confetti = new THREE.Mesh(confettiGeometry, material);
            confetti.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 10 + 10,
                (Math.random() - 0.5) * 20
            );
            confetti.userData = {
                type: 'confetti',
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    -Math.random() * 2 - 1,
                    (Math.random() - 0.5) * 2
                ),
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                active: false
            };
            
            this.scene.add(confetti);
            this.objects.particles.push(confetti);
        }
    }

    createStars() {
        // Floating stars
        const starGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const starMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });
        
        for (let i = 0; i < 50; i++) {
            const star = new THREE.Mesh(starGeometry, starMaterial.clone());
            star.position.set(
                (Math.random() - 0.5) * 50,
                Math.random() * 20 + 5,
                (Math.random() - 0.5) * 50
            );
            star.userData = { 
                type: 'star',
                twinkleSpeed: Math.random() * 2 + 1
            };
            this.scene.add(star);
        }
    }

    setupEventListeners() {
        // Scene navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scene = e.target.dataset.scene;
                this.switchScene(scene);
            });
        });

        // Control buttons
        const audioToggle = document.getElementById('audio-toggle');
        audioToggle.addEventListener('click', () => {
            this.toggleAudio();
        });

        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        fullscreenToggle.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        const helpToggle = document.getElementById('help-toggle');
        const helpPanel = document.getElementById('help-panel');
        helpToggle.addEventListener('click', () => {
            helpPanel.classList.toggle('hidden');
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Interaction handlers
        this.setupInteractionHandlers();
    }

    setupInteractionHandlers() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            
            if (intersects.length > 0) {
                this.handleClick(intersects[0]);
            }
        });
    }

    handleClick(intersection) {
        const object = intersection.object;
        const userData = object.userData;
        
        switch (userData.type) {
            case 'balloon':
                this.popBalloon(object);
                break;
            case 'flame':
                this.blowCandle(object);
                break;
        }
    }

    popBalloon(balloon) {
        if (balloon.userData.popped) return;
        
        balloon.userData.popped = true;
        
        // Play pop sound
        this.playSound('pop');
        
        // Create particle burst
        this.createParticleBurst(balloon.position);
        
        // Animate balloon disappearing
        gsap.to(balloon.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                this.scene.remove(balloon);
            }
        });
    }

    blowCandle(flame) {
        if (!flame.userData.lit) return;
        
        flame.userData.lit = false;
        
        // Play blow sound
        this.playSound('blow');
        
        // Animate flame extinguishing
        gsap.to(flame.material, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    createParticleBurst(position) {
        // Activate nearby particles
        this.objects.particles.forEach(particle => {
            if (particle.userData.active) return;
            
            const distance = particle.position.distanceTo(position);
            if (distance < 2) {
                particle.userData.active = true;
                particle.material.opacity = 1;
                particle.position.copy(position);
                particle.userData.velocity.set(
                    (Math.random() - 0.5) * 3,
                    Math.random() * 3 + 1,
                    (Math.random() - 0.5) * 3
                );
            }
        });
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            const deltaTime = this.clock.getDelta();
            
            this.update(deltaTime);
            this.render();
        };
        
        animate();
    }

    update(deltaTime) {
        // Update controls
        this.controls.update();
        
        // Update balloons
        this.updateBalloons(deltaTime);
        
        // Update candles
        this.updateCandles(deltaTime);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update stars
        this.updateStars(deltaTime);
    }

    updateBalloons(deltaTime) {
        this.objects.balloons.forEach(balloon => {
            if (balloon.userData.popped) return;
            
            const time = this.clock.elapsedTime;
            const floatSpeed = balloon.userData.floatSpeed;
            balloon.position.y = balloon.userData.originalY + 
                Math.sin(time * floatSpeed) * 0.3;
            
            balloon.rotation.y += deltaTime * 0.2;
            balloon.rotation.z = Math.sin(time * floatSpeed * 0.5) * 0.1;
        });
    }

    updateCandles(deltaTime) {
        this.objects.candles.forEach(({ flame }) => {
            if (!flame.userData.lit) return;
            
            const time = this.clock.elapsedTime;
            const flicker = Math.sin(time * 10 + flame.userData.id) * 0.1 + 0.9;
            flame.material.opacity = flame.userData.originalIntensity * flicker;
            
            flame.rotation.y += deltaTime * 2;
        });
    }

    updateParticles(deltaTime) {
        this.objects.particles.forEach(particle => {
            if (!particle.userData.active) return;
            
            particle.position.add(
                particle.userData.velocity.clone().multiplyScalar(deltaTime)
            );
            
            particle.userData.velocity.y -= 9.8 * deltaTime * 0.1;
            particle.rotation.z += particle.userData.rotationSpeed;
            particle.material.opacity -= deltaTime * 0.5;
            
            if (particle.position.y < -5 || particle.material.opacity <= 0) {
                particle.userData.active = false;
                particle.material.opacity = 0;
            }
        });
    }

    updateStars(deltaTime) {
        this.scene.children.forEach(child => {
            if (child.userData.type === 'star') {
                const time = this.clock.elapsedTime;
                const twinkle = Math.sin(time * child.userData.twinkleSpeed) * 0.3 + 0.7;
                child.material.opacity = twinkle;
            }
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    switchScene(sceneName) {
        if (this.currentScene === sceneName) return;
        
        // Update navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.scene === sceneName);
        });
        
        // Update scene title
        this.updateSceneTitle(sceneName);
        
        // Trigger scene-specific effects
        this.triggerSceneEffects(sceneName);
        
        this.currentScene = sceneName;
    }

    updateSceneTitle(sceneName) {
        const sceneTitle = document.getElementById('scene-title');
        const titles = {
            intro: {
                title: 'Welcome to Aafia\'s Birthday',
                subtitle: 'An immersive 3D celebration experience'
            },
            reveal: {
                title: 'The Grand Reveal',
                subtitle: 'Watch the magic unfold'
            },
            celebration: {
                title: 'Let\'s Celebrate!',
                subtitle: 'Interactive birthday fun'
            },
            message: {
                title: 'Special Birthday Message',
                subtitle: 'From the heart to Aafia'
            },
            finale: {
                title: 'Grand Finale',
                subtitle: 'A spectacular ending'
            }
        };
        
        const { title, subtitle } = titles[sceneName];
        sceneTitle.querySelector('h1').textContent = title;
        sceneTitle.querySelector('p').textContent = subtitle;
    }

    triggerSceneEffects(sceneName) {
        switch (sceneName) {
            case 'celebration':
                this.triggerConfettiExplosion();
                break;
            case 'finale':
                this.triggerFireworks();
                break;
        }
    }

    triggerConfettiExplosion() {
        this.objects.particles.forEach((particle, index) => {
            setTimeout(() => {
                if (!particle.userData.active) {
                    particle.userData.active = true;
                    particle.material.opacity = 1;
                    particle.position.set(0, 8, 0);
                    particle.userData.velocity.set(
                        (Math.random() - 0.5) * 6,
                        Math.random() * 4 + 2,
                        (Math.random() - 0.5) * 6
                    );
                }
            }, index * 20);
        });
    }

    triggerFireworks() {
        // Create multiple firework bursts
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const position = new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    Math.random() * 5 + 8,
                    (Math.random() - 0.5) * 10
                );
                this.createParticleBurst(position);
            }, i * 1000);
        }
    }

    playSound(type) {
        if (!this.audioEnabled) return;
        
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            switch (type) {
                case 'pop':
                    this.playPopSound(audioCtx);
                    break;
                case 'blow':
                    this.playBlowSound(audioCtx);
                    break;
            }
        } catch (error) {
            console.log('Audio not supported or blocked');
        }
    }

    playPopSound(audioCtx) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        
        oscillator.connect(gainNode).connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }

    playBlowSound(audioCtx) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        
        oscillator.connect(gainNode).connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const audioToggle = document.getElementById('audio-toggle');
        const icon = audioToggle.querySelector('.icon');
        icon.textContent = this.audioEnabled ? '🔊' : '🔇';
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    startExperience() {
        this.hideLoadingScreen();
        this.isLoaded = true;
        console.log('Birthday experience started!');
    }

    hideLoadingScreen() {
        const loadingContainer = document.getElementById('loading-container');
        const appContainer = document.getElementById('app-container');
        
        loadingContainer.classList.add('fade-out');
        
        setTimeout(() => {
            loadingContainer.style.display = 'none';
            appContainer.style.display = 'block';
            appContainer.classList.add('fade-in-up');
        }, 500);
    }

    updateLoadingProgress(percentage, text) {
        const progressFill = document.getElementById('progress-fill');
        const loadingText = document.getElementById('loading-text');
        const loadingPercentage = document.getElementById('loading-percentage');
        
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (loadingText) loadingText.textContent = text;
        if (loadingPercentage) loadingPercentage.textContent = `${percentage}%`;
    }

    showError(message) {
        const loadingText = document.getElementById('loading-text');
        const progressFill = document.getElementById('progress-fill');
        
        if (loadingText) {
            loadingText.textContent = `Error: ${message}`;
            loadingText.style.color = '#FF6B6B';
        }
        if (progressFill) {
            progressFill.style.background = '#FF6B6B';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Birthday App...');
    new BirthdayApp();
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Fallback initialization...');
        new BirthdayApp();
    });
} else {
    console.log('Direct initialization...');
    new BirthdayApp();
}
