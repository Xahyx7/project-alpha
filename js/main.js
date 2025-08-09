// Complete Birthday Celebration - Enhanced Full Screen Animations
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
            text: null,
            activeFireworks: [],
            activeMessages: []
        };
        
        this.clock = new THREE.Clock();
        this.isAnimating = true;
        this.currentScene = 'intro';
        
        // Performance optimizations
        this.maxBalloons = 12;
        this.maxParticles = 80; // Increased for full-screen effects
        this.maxStars = 25;
        this.renderScale = Math.min(window.devicePixelRatio, 1.5);
        this.targetFPS = 30;
        
        this.timeline = null;
        this.sceneCallbacks = [];
    }

    async init() {
        try {
            console.log('SceneManager: Initializing enhanced full-screen version...');
            
            this.setupRenderer();
            this.setupScene();
            this.setupCamera();
            this.setupControls();
            this.setupLighting();
            
            await this.loadOptimizedModels();
            
            this.startRenderLoop();
            
            console.log('SceneManager: Enhanced initialization complete');
            return true;
            
        } catch (error) {
            console.error('SceneManager: Initialization failed:', error);
            throw error;
        }
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: window.innerWidth < 768 ? false : true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.renderScale);
        
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        console.log('SceneManager: Enhanced renderer ready');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        console.log('SceneManager: Scene created');
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 80);
        this.camera.position.set(0, 4, 8);
        this.camera.lookAt(0, 0, 0);
        console.log('SceneManager: Camera setup');
    }

    setupControls() {
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.canvas);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.1;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.3;
            this.controls.enableZoom = false;
            this.controls.enablePan = false;
            console.log('SceneManager: Controls optimized');
        }
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(8, 12, 4);
        mainLight.castShadow = true;
        
        mainLight.shadow.mapSize.width = 512;
        mainLight.shadow.mapSize.height = 512;
        mainLight.shadow.camera.near = 1;
        mainLight.shadow.camera.far = 30;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        
        this.scene.add(mainLight);
        
        const accentLight1 = new THREE.PointLight(0xff69b4, 0.4, 15);
        accentLight1.position.set(-5, 6, 0);
        this.scene.add(accentLight1);
        
        const accentLight2 = new THREE.PointLight(0x00ced1, 0.4, 15);
        accentLight2.position.set(5, 6, 0);
        this.scene.add(accentLight2);
        
        console.log('SceneManager: Enhanced lighting setup');
    }

    async loadOptimizedModels() {
        console.log('SceneManager: Loading models for full-screen animation...');
        
        await Promise.all([
            this.createSimpleEnvironment(),
            this.createOptimizedBalloons(),
            this.createSimpleCake(),
            this.createSimpleText(),
            this.createEnhancedParticles(),
            this.createSimpleStars()
        ]);
        
        console.log('SceneManager: All enhanced models loaded');
    }

    async createSimpleEnvironment() {
        const groundGeometry = new THREE.PlaneGeometry(30, 30);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.4
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.5;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    async createOptimizedBalloons() {
        const balloonGeometry = new THREE.SphereGeometry(0.25, 12, 12);
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0xff9f43];
        
        for (let i = 0; i < this.maxBalloons; i++) {
            const material = new THREE.MeshLambertMaterial({
                color: colors[i % colors.length]
            });
            
            const balloon = new THREE.Mesh(balloonGeometry, material);
            
            const angle = (i / this.maxBalloons) * Math.PI * 2;
            const radius = 4 + Math.random() * 3;
            balloon.position.set(
                Math.cos(angle) * radius,
                Math.random() * 3 + 1,
                Math.sin(angle) * radius
            );
            
            balloon.castShadow = true;
            balloon.userData = { 
                type: 'balloon',
                id: i,
                originalY: balloon.position.y,
                floatSpeed: 0.4 + Math.random() * 0.3,
                visible: false
            };
            
            balloon.visible = false;
            
            this.scene.add(balloon);
            this.objects.balloons.push(balloon);
        }
        
        console.log(`Created ${this.objects.balloons.length} animation-ready balloons`);
    }

    async createSimpleCake() {
        const cakeGroup = new THREE.Group();
        
        const geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0xffb3ba });
        
        const cake = new THREE.Mesh(geometry, material);
        cake.position.y = 0.3;
        cake.castShadow = true;
        cake.receiveShadow = true;
        
        cakeGroup.add(cake);
        
        const candleCount = 8;
        const candleGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.3, 6);
        const candleMaterial = new THREE.MeshLambertMaterial({ color: 0xfff8dc });
        
        for (let i = 0; i < candleCount; i++) {
            const angle = (i / candleCount) * Math.PI * 2;
            const x = Math.cos(angle) * 0.8;
            const z = Math.sin(angle) * 0.8;
            
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);
            candle.position.set(x, 0.45, z);
            candle.castShadow = true;
            
            const flame = new THREE.Mesh(
                new THREE.ConeGeometry(0.04, 0.12, 6),
                new THREE.MeshBasicMaterial({ color: 0xff6600 })
            );
            flame.position.set(0, 0.2, 0);
            flame.userData = { type: 'flame', id: i, lit: true };
            
            candle.add(flame);
            cakeGroup.add(candle);
            
            this.objects.candles.push({ candle, flame });
        }
        
        cakeGroup.position.y = -1;
        cakeGroup.userData = { type: 'cake', visible: false };
        cakeGroup.visible = false;
        
        this.scene.add(cakeGroup);
        this.objects.cake = cakeGroup;
        
        console.log('Enhanced cake created');
    }

    async createSimpleText() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#ff69b4');
            gradient.addColorStop(0.5, '#ffd700');
            gradient.addColorStop(1, '#00ced1');
            
            ctx.fillStyle = gradient;
            ctx.font = "bold 80px Arial";
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.fillText("Happy Birthday Aafia!", canvas.width/2, canvas.height/2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ 
                map: texture, 
                transparent: true 
            });
            
            const sprite = new THREE.Sprite(material);
            sprite.position.set(0, 5, 0);
            sprite.scale.set(8, 2, 1);
            sprite.userData = { type: 'text', visible: false };
            sprite.visible = false;
            
            this.scene.add(sprite);
            this.objects.text = sprite;
            
            console.log('Enhanced text created');
        } catch (error) {
            console.warn('Text creation failed:', error);
        }
    }

    async createEnhancedParticles() {
        const confettiGeometry = new THREE.PlaneGeometry(0.12, 0.12); // Slightly larger
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0xff9f43];
        
        for (let i = 0; i < this.maxParticles; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0
            });
            
            const confetti = new THREE.Mesh(confettiGeometry, material);
            confetti.position.set(0, 15, 0); // Start higher
            
            confetti.userData = {
                type: 'confetti',
                active: false,
                velocity: new THREE.Vector3(),
                rotationSpeed: new THREE.Vector3(),
                originalPosition: new THREE.Vector3(0, 15, 0)
            };
            
            this.scene.add(confetti);
            this.objects.particles.push(confetti);
        }
        
        console.log(`Created ${this.objects.particles.length} enhanced particles`);
    }

    async createSimpleStars() {
        const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        
        for (let i = 0; i < this.maxStars; i++) {
            const starMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(
                (Math.random() - 0.5) * 30,
                Math.random() * 15 + 8,
                (Math.random() - 0.5) * 30
            );
            
            star.userData = { 
                type: 'star', 
                visible: false,
                twinkleSpeed: 1 + Math.random() * 2,
                id: i
            };
            star.visible = false;
            
            this.scene.add(star);
            this.objects.stars.push(star);
        }
        
        console.log(`Created ${this.objects.stars.length} twinkling stars`);
    }

    // ===== ENHANCED ANIMATION METHODS =====

    cameraShake(intensity = 0.5) {
        if (!this.camera) return;
        
        const originalPosition = this.camera.position.clone();
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.camera.position.x = originalPosition.x + (Math.random() - 0.5) * intensity;
                this.camera.position.y = originalPosition.y + (Math.random() - 0.5) * intensity;
                this.camera.position.z = originalPosition.z + (Math.random() - 0.5) * intensity;
            }, i * 50);
        }
        
        setTimeout(() => {
            this.camera.position.copy(originalPosition);
        }, 500);
    }

    triggerMegaConfetti() {
        console.log('🎊 MEGA FULL-SCREEN CONFETTI!');
        
        // Clear any existing animations
        this.clearActiveAnimations();
        
        this.objects.particles.forEach((particle, index) => {
            particle.userData.active = true;
            particle.material.opacity = 1;
            
            // Full screen coverage
            const startX = (Math.random() - 0.5) * 30;
            const startZ = (Math.random() - 0.5) * 30;
            particle.position.set(startX, 20, startZ);
            
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 4;
            const height = Math.random() * 8 + 4;
            
            particle.userData.velocity.set(
                Math.cos(angle) * speed,
                height,
                Math.sin(angle) * speed
            );
            
            particle.userData.rotationSpeed.set(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            );
        });

        // Auto-clear after 8 seconds
        setTimeout(() => {
            this.clearConfetti();
        }, 8000);
    }

    triggerGentleConfetti() {
        console.log('🎊 Gentle confetti rain...');
        
        let activeCount = 0;
        this.objects.particles.forEach((particle) => {
            if (activeCount > 30) return;
            
            particle.userData.active = true;
            particle.material.opacity = 0.8;
            particle.position.set(
                (Math.random() - 0.5) * 25,
                15 + Math.random() * 5,
                (Math.random() - 0.5) * 25
            );
            
            particle.userData.velocity.set(
                (Math.random() - 0.5) * 1,
                -1.5 - Math.random(),
                (Math.random() - 0.5) * 1
            );
            
            activeCount++;
        });

        // Auto-clear after 6 seconds
        setTimeout(() => {
            this.clearConfetti();
        }, 6000);
    }

    triggerConfettiStorm() {
        console.log('⛈️ CONFETTI STORM COVERING EVERYTHING!');
        
        for (let wave = 0; wave < 6; wave++) {
            setTimeout(() => {
                this.triggerMegaConfetti();
            }, wave * 500);
        }
    }

    createFloatingMessageWithHearts(message) {
        try {
            console.log('💌 Creating dropping message with hearts...');
            
            // Create the message sprite
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            // Gradient background
            const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
            gradient.addColorStop(0, 'rgba(255, 105, 180, 0.95)');
            gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.9)');
            gradient.addColorStop(1, 'rgba(0, 206, 209, 0.85)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Message text
            ctx.fillStyle = 'white';
            ctx.font = "bold 60px Arial";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 15;
            
            const lines = message.split('\n');
            lines.forEach((line, index) => {
                ctx.fillText(line, canvas.width/2, canvas.height/2 + (index - lines.length/2 + 0.5) * 80);
            });
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ 
                map: texture, 
                transparent: true,
                alphaTest: 0.1
            });
            
            const messageSprite = new THREE.Sprite(material);
            messageSprite.position.set(0, 25, 0); // Start from top
            messageSprite.scale.set(16, 8, 1); // Larger for full-screen impact
            
            this.scene.add(messageSprite);
            this.objects.activeMessages.push(messageSprite);
            
            // Start falling hearts animation
            this.startFallingHearts();
            
            if (window.gsap) {
                // Message drops from above with bounce
                gsap.fromTo(messageSprite.position, 
                    { y: 25 },
                    { y: 8, duration: 2, ease: "bounce.out" }
                );
                
                // Scale animation
                gsap.fromTo(messageSprite.scale, 
                    { x: 0, y: 0 },
                    { x: 16, y: 8, duration: 1.5, ease: "back.out(1.7)" }
                );
                
                // Float gently
                gsap.to(messageSprite.position, {
                    y: 10,
                    duration: 3,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut",
                    delay: 2
                });
                
                // Fade out and remove
                gsap.to(messageSprite.material, {
                    opacity: 0,
                    duration: 2,
                    delay: 6,
                    onComplete: () => {
                        this.scene.remove(messageSprite);
                        this.objects.activeMessages = this.objects.activeMessages.filter(m => m !== messageSprite);
                        this.stopFallingHearts();
                    }
                });
            }
            
        } catch (error) {
            console.warn('Message creation failed:', error);
        }
    }

    startFallingHearts() {
        const heartsContainer = document.getElementById('falling-hearts');
        if (!heartsContainer) return;
        
        console.log('💖 Starting falling hearts animation...');
        
        // Create multiple heart waves
        this.heartInterval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.createFallingHeart(heartsContainer);
                }, i * 200);
            }
        }, 800);
        
        // Stop after 8 seconds
        setTimeout(() => {
            this.stopFallingHearts();
        }, 8000);
    }

    createFallingHeart(container) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '💖';
        
        // Random sizes
        const sizes = ['small', '', 'large'];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        if (randomSize) heart.classList.add(randomSize);
        
        // Random horizontal position
        heart.style.left = Math.random() * 100 + '%';
        
        // Random animation duration
        heart.style.animationDuration = (3 + Math.random() * 2) + 's';
        heart.style.animationDelay = Math.random() * 0.5 + 's';
        
        container.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => {
            if (container.contains(heart)) {
                container.removeChild(heart);
            }
        }, 5000);
    }

    stopFallingHearts() {
        if (this.heartInterval) {
            clearInterval(this.heartInterval);
            this.heartInterval = null;
        }
        
        // Clear existing hearts
        const heartsContainer = document.getElementById('falling-hearts');
        if (heartsContainer) {
            heartsContainer.innerHTML = '';
        }
        
        console.log('💖 Stopped falling hearts');
    }

    createFullScreenFirework(position) {
        console.log('🎆 Creating FULL-SCREEN firework!');
        
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0xff9f43, 0xff69b4, 0x00ced1];
        const particleCount = 25; // More particles
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.15, 8, 8), // Larger particles
                new THREE.MeshBasicMaterial({ 
                    color: colors[i % colors.length],
                    transparent: true,
                    opacity: 1
                })
            );
            
            particle.position.copy(position);
            this.scene.add(particle);
            this.objects.activeFireworks.push(particle);
            
            const angle = (i / particleCount) * Math.PI * 2;
            const elevation = (Math.random() - 0.5) * Math.PI * 0.8;
            const speed = 6 + Math.random() * 6; // Faster spread
            
            if (window.gsap) {
                gsap.to(particle.position, {
                    x: position.x + Math.cos(angle) * Math.cos(elevation) * speed,
                    y: position.y + Math.sin(elevation) * speed,
                    z: position.z + Math.sin(angle) * Math.cos(elevation) * speed,
                    duration: 3,
                    ease: "power2.out"
                });
                
                gsap.to(particle.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 3,
                    ease: "power1.out"
                });
                
                gsap.to(particle.material, {
                    opacity: 0,
                    duration: 3,
                    ease: "power1.out",
                    onComplete: () => {
                        this.scene.remove(particle);
                        this.objects.activeFireworks = this.objects.activeFireworks.filter(f => f !== particle);
                    }
                });
            }
        }
    }

    clearActiveAnimations() {
        // Clear confetti
        this.clearConfetti();
        
        // Clear fireworks
        this.objects.activeFireworks.forEach(firework => {
            this.scene.remove(firework);
        });
        this.objects.activeFireworks = [];
        
        // Clear messages
        this.objects.activeMessages.forEach(message => {
            this.scene.remove(message);
        });
        this.objects.activeMessages = [];
        
        // Stop hearts
        this.stopFallingHearts();
    }

    clearConfetti() {
        this.objects.particles.forEach(particle => {
            particle.userData.active = false;
            particle.material.opacity = 0;
            particle.position.copy(particle.userData.originalPosition);
        });
    }

    dramaticCameraMove() {
        console.log('🎬 Dramatic camera movement!');
        
        if (!this.controls || !window.gsap) return;
        
        const originalTarget = this.controls.target.clone();
        const originalPosition = this.camera.position.clone();
        
        gsap.to(this.controls.target, {
            x: originalTarget.x + 4,
            y: originalTarget.y + 2,
            z: originalTarget.z + 4,
            duration: 3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }

    enableRainbowLighting() {
        console.log('🌈 Rainbow lighting activated!');
        
        const lights = this.scene.children.filter(child => child.isPointLight || child.isDirectionalLight);
        const colors = [
            { r: 1, g: 0, b: 0 },
            { r: 1, g: 0.5, b: 0 },
            { r: 1, g: 1, b: 0 },
            { r: 0, g: 1, b: 0 },
            { r: 0, g: 0, b: 1 },
            { r: 0.5, g: 0, b: 1 },
            { r: 1, g: 0, b: 1 }
        ];
        
        lights.forEach((light, lightIndex) => {
            if (light.color && window.gsap) {
                colors.forEach((color, colorIndex) => {
                    setTimeout(() => {
                        gsap.to(light.color, {
                            r: color.r,
                            g: color.g,
                            b: color.b,
                            duration: 0.8,
                            ease: "power2.inOut"
                        });
                    }, colorIndex * 400 + lightIndex * 100);
                });
            }
        });
    }

    quickReset() {
        console.log('🔄 Quick reset for next cycle...');
        
        // Clear all active animations
        this.clearActiveAnimations();
        
        // Reset balloons
        this.objects.balloons.forEach(balloon => {
            balloon.visible = false;
            balloon.userData.visible = false;
            balloon.scale.set(1, 1, 1);
            balloon.rotation.set(0, 0, 0);
        });
        
        // Reset cake
        if (this.objects.cake) {
            this.objects.cake.visible = false;
            this.objects.cake.userData.visible = false;
            this.objects.cake.scale.set(1, 1, 1);
            this.objects.cake.rotation.set(0, 0, 0);
            this.objects.cake.position.y = -1;
        }
        
        // Reset text
        if (this.objects.text) {
            this.objects.text.visible = false;
            this.objects.text.scale.set(8, 2, 1);
        }
        
        // Reset stars
        this.objects.stars.forEach(star => {
            star.visible = false;
            star.userData.visible = false;
            star.scale.set(1, 1, 1);
        });
        
        // Reset particles
        this.objects.particles.forEach(particle => {
            particle.userData.active = false;
            particle.material.opacity = 0;
            particle.position.copy(particle.userData.originalPosition);
        });
    }

    startRenderLoop() {
        let lastTime = 0;
        const frameInterval = 1000 / this.targetFPS;
        
        const animate = (currentTime) => {
            if (!this.isAnimating) return;
            
            requestAnimationFrame(animate);
            
            if (currentTime - lastTime < frameInterval) return;
            
            const deltaTime = Math.min(this.clock.getDelta(), 0.05);
            this.update(deltaTime);
            this.render();
            
            lastTime = currentTime;
        };
        
        animate(0);
        console.log(`SceneManager: Enhanced render loop started (${this.targetFPS} FPS)`);
    }

    update(deltaTime) {
        if (this.controls) {
            this.controls.update();
        }
        
        this.updateBalloons(deltaTime);
        this.updateCandles(deltaTime);
        this.updateParticles(deltaTime);
        this.updateStars(deltaTime);
    }

    updateBalloons(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.balloons.forEach((balloon) => {
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
            
            const flicker = 0.7 + Math.sin(time * 12 + flame.userData.id * 2) * 0.3;
            flame.material.opacity = flicker;
        });
    }

    updateParticles(deltaTime) {
        this.objects.particles.forEach((particle) => {
            if (!particle.userData.active) return;
            
            particle.position.add(
                particle.userData.velocity.clone().multiplyScalar(deltaTime)
            );
            
            particle.userData.velocity.y -= 8 * deltaTime;
            particle.userData.velocity.multiplyScalar(0.98);
            
            particle.rotation.x += particle.userData.rotationSpeed.x;
            particle.rotation.y += particle.userData.rotationSpeed.y;
            particle.rotation.z += particle.userData.rotationSpeed.z;
            
            particle.material.opacity = Math.max(0, particle.material.opacity - deltaTime * 0.3);
            
            if (particle.position.y < -10 || particle.material.opacity <= 0.1) {
                particle.userData.active = false;
                particle.material.opacity = 0;
                particle.position.copy(particle.userData.originalPosition);
            }
        });
    }

    updateStars(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.stars.forEach((star) => {
            if (!star.userData.visible) return;
            
            const twinkle = Math.sin(time * star.userData.twinkleSpeed + star.userData.id) * 0.4 + 0.6;
            star.material.opacity = twinkle * 0.6;
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
        
        console.log(`SceneManager: Resized to ${width}x${height}`);
    }

    dispose() {
        console.log('SceneManager: Disposing...');
        this.isAnimating = false;
        
        this.clearActiveAnimations();
        
        if (this.timeline) {
            this.timeline.kill();
        }
        
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
        
        console.log('SceneManager: Disposal complete');
    }
}

// ===== ENHANCED BIRTHDAY APP CLASS =====
class BirthdayApp {
    constructor() {
        this.canvas = null;
        this.sceneManager = null;
        this.audioManager = null;
        
        this.timeline = null;
        this.totalDuration = 35; // Slightly longer for better pacing
        this.currentPhase = 0;
        this.phases = [
            { name: 'welcome', duration: 5, title: 'Welcome Aafia!' },
            { name: 'surprise', duration: 7, title: 'Surprise Birthday Magic!' },
            { name: 'party', duration: 8, title: 'Party Time!' },
            { name: 'wishes', duration: 8, title: 'Birthday Wishes!' },
            { name: 'celebration', duration: 7, title: 'Grand Celebration!' }
        ];
        
        this.isLoaded = false;
        this.startTime = 0;
        this.animationActive = false;
    }

    async init() {
        try {
            console.log('🎉 BirthdayApp: Starting ENHANCED full-screen celebration!');
            
            this.showLoadingScreen();
            await this.initializeComponents();
            await this.startFullAnimationCelebration();
            
            console.log('🎊 BirthdayApp: Enhanced party is READY!');
        } catch (error) {
            console.error('💥 BirthdayApp: Enhanced party planning failed:', error);
            this.showError(error.message);
        }
    }

    showLoadingScreen() {
        const loadingContainer = document.getElementById('loading-container');
        const progressFill = document.getElementById('progress-fill');
        const loadingText = document.getElementById('loading-text');
        const loadingPercentage = document.getElementById('loading-percentage');
        
        const loadingSteps = [
            'Preparing full-screen magic...',
            'Inflating balloons...',
            'Setting up fireworks...',
            'Preparing heart animations...',
            'Ready for EPIC celebration!'
        ];
        
        let progress = 0;
        let stepIndex = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 15 + 10;
            if (progress > 100) progress = 100;
            
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (loadingPercentage) loadingPercentage.textContent = `${Math.floor(progress)}%`;
            
            if (stepIndex < loadingSteps.length && loadingText) {
                loadingText.textContent = loadingSteps[stepIndex];
                stepIndex++;
            }
            
            if (progress < 100) {
                setTimeout(updateProgress, 250);
            } else {
                setTimeout(() => {
                    if (loadingContainer) {
                        loadingContainer.classList.add('fade-out');
                    }
                    this.showMainApp();
                }, 600);
            }
        };
        
        setTimeout(updateProgress, 300);
    }

    showMainApp() {
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
            appContainer.classList.add('loaded');
        }
        this.isLoaded = true;
    }

    async initializeComponents() {
        this.canvas = document.getElementById('birthday-canvas');
        if (!this.canvas) {
            throw new Error('Canvas not found - make sure your HTML has the birthday-canvas element');
        }

        this.sceneManager = new SceneManager(this.canvas);
        await this.sceneManager.init();

        this.audioManager = new AudioManager();
        await this.audioManager.init();

        this.setupEventListeners();
    }

    setupEventListeners() {
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => {
                this.audioManager.toggle();
                const icon = audioToggle.querySelector('.icon');
                if (icon) {
                    icon.textContent = this.audioManager.enabled ? '🔊' : '🔇';
                }
            });
        }

        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        const infoBtn = document.getElementById('info-btn');
        const infoPanel = document.getElementById('info-panel');
        const closeInfoBtn = document.getElementById('close-info');
        
        if (infoBtn && infoPanel) {
            infoBtn.addEventListener('click', () => {
                infoPanel.classList.toggle('hidden');
            });
        }
        
        if (closeInfoBtn && infoPanel) {
            closeInfoBtn.addEventListener('click', () => {
                infoPanel.classList.add('hidden');
            });
        }

        window.addEventListener('resize', () => {
            this.sceneManager?.handleResize();
        });

        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    async startFullAnimationCelebration() {
        console.log('🚀 Starting ENHANCED NON-STOP birthday animation party!');
        
        this.startTime = Date.now();
        this.animationActive = true;
        
        if (window.gsap) {
            this.createEnhancedActionTimeline();
        } else {
            this.createSimpleActionTimeline();
        }
    }

    createEnhancedActionTimeline() {
        this.timeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        
        this.timeline.call(() => this.explodeWelcome());
        this.timeline.call(() => this.balloonSurpriseAttack(), null, 5);
        this.timeline.call(() => this.cakeAndCandleMagic(), null, 8);
        this.timeline.call(() => this.confettiExplosion(), null, 12);
        this.timeline.call(() => this.showBirthdayMessageWithHearts(), null, 16);
        this.timeline.call(() => this.fireworksFinale(), null, 22);
        this.timeline.call(() => this.megaCelebration(), null, 28);
        this.timeline.call(() => this.resetForNextRound(), null, 35);
    }

    explodeWelcome() {
        this.updateAction('🎊 EPIC WELCOME EXPLOSION!');
        console.log('🎊 EPIC WELCOME EXPLOSION!');
        
        if (this.sceneManager.objects.text) {
            this.sceneManager.objects.text.visible = true;
            gsap.fromTo(this.sceneManager.objects.text.scale, 
                { x: 0, y: 0 }, 
                { x: 10, y: 3, duration: 1, ease: "back.out(2)" }
            );
            gsap.to(this.sceneManager.objects.text.scale, 
                { x: 8, y: 2, duration: 2.5, delay: 1, ease: "power2.inOut" }
            );
        }
        
        this.sceneManager.objects.stars.forEach((star, index) => {
            star.visible = true;
            star.userData.visible = true;
            gsap.fromTo(star.position, 
                { x: 0, y: 25, z: 0 },
                { 
                    x: star.position.x, 
                    y: star.position.y, 
                    z: star.position.z, 
                    duration: 1.2, 
                    delay: index * 0.03, 
                    ease: "power2.out" 
                }
            );
        });
        
        this.sceneManager.cameraShake(0.7);
    }

    balloonSurpriseAttack() {
        this.updateAction('🎈 FULL-SCREEN BALLOON INVASION!');
        console.log('🎈 FULL-SCREEN BALLOON INVASION!');
        
        this.sceneManager.objects.balloons.forEach((balloon, index) => {
            balloon.visible = true;
            balloon.userData.visible = true;
            
            const directions = [
                { x: -25, y: balloon.userData.originalY, z: 0 },
                { x: 25, y: balloon.userData.originalY, z: 0 },
                { x: 0, y: -15, z: balloon.userData.originalY },
                { x: 0, y: 25, z: balloon.userData.originalY }
            ];
            
            const startPos = directions[index % directions.length];
            
            gsap.fromTo(balloon.position, 
                startPos,
                { 
                    x: balloon.position.x, 
                    y: balloon.userData.originalY, 
                    z: balloon.position.z, 
                    duration: 2, 
                    delay: index * 0.15, 
                    ease: "back.out(1.4)" 
                }
            );
            
            gsap.to(balloon.rotation, {
                y: Math.PI * 3,
                duration: 2,
                delay: index * 0.15,
                ease: "power2.out"
            });
        });
    }

    cakeAndCandleMagic() {
        this.updateAction('🎂 MAGICAL CAKE RISES FROM DEPTHS!');
        console.log('🎂 MAGICAL CAKE RISES FROM DEPTHS!');
        
        if (this.sceneManager.objects.cake) {
            this.sceneManager.objects.cake.visible = true;
            this.sceneManager.objects.cake.userData.visible = true;
            
            gsap.fromTo(this.sceneManager.objects.cake.position, 
                { y: -15 },
                { y: -1, duration: 2.5, ease: "back.out(1.9)" }
            );
            
            gsap.fromTo(this.sceneManager.objects.cake.scale, 
                { x: 0, y: 0, z: 0 },
                { x: 1.2, y: 1.2, z: 1.2, duration: 2.5, ease: "back.out(1.9)" }
            );
        }
        
        setTimeout(() => {
            this.sceneManager.objects.candles.forEach(({candle, flame}, index) => {
                setTimeout(() => {
                    gsap.fromTo(flame.scale, 
                        { x: 0, y: 0, z: 0 },
                        { x: 1.5, y: 1.5, z: 1.5, duration: 0.4, ease: "back.out(3)" }
                    );
                    this.audioManager.playTone(440 + index * 60, 0.4);
                }, index * 250);
            });
        }, 1500);
    }

    confettiExplosion() {
        this.updateAction('🎊 MASSIVE FULL-SCREEN CONFETTI BLAST!');
        console.log('🎊 MASSIVE FULL-SCREEN CONFETTI BLAST!');
        
        this.sceneManager.triggerMegaConfetti();
        this.sceneManager.cameraShake(1.2);
        this.audioManager.playExplosion();
        
        this.sceneManager.objects.balloons.forEach((balloon) => {
            if (balloon.userData.visible) {
                gsap.to(balloon.scale, { 
                    x: 1.8, y: 1.8, z: 1.8, 
                    duration: 0.4, 
                    yoyo: true, 
                    repeat: 6, 
                    ease: "power2.inOut" 
                });
                
                gsap.to(balloon.position, {
                    y: balloon.userData.originalY + 3,
                    duration: 0.6,
                    yoyo: true,
                    repeat: 4,
                    ease: "power2.inOut"
                });
            }
        });
    }

    showBirthdayMessageWithHearts() {
        this.updateAction('💌 DROPPING BIRTHDAY MESSAGE WITH HEARTS!');
        console.log('💌 DROPPING BIRTHDAY MESSAGE WITH HEARTS!');
        
        this.sceneManager.createFloatingMessageWithHearts("🎉 Happy Birthday Aafia! 🎉\n✨ May all your dreams come true! ✨\n💖 You're absolutely amazing! 💖");
        this.sceneManager.triggerGentleConfetti();
    }

    fireworksFinale() {
        this.updateAction('🎆 EPIC FULL-SCREEN FIREWORKS FINALE!');
        console.log('🎆 EPIC FULL-SCREEN FIREWORKS FINALE!');
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const position = new THREE.Vector3(
                    (Math.random() - 0.5) * 25,
                    Math.random() * 12 + 10,
                    (Math.random() - 0.5) * 25
                );
                this.sceneManager.createFullScreenFirework(position);
                this.audioManager.playFirework();
            }, i * 600);
        }
        
        this.sceneManager.dramaticCameraMove();
    }

    megaCelebration() {
        this.updateAction('🏆 ULTIMATE MEGA CELEBRATION MODE!');
        console.log('🏆 ULTIMATE MEGA CELEBRATION MODE!');
        
        if (this.sceneManager.objects.text) {
            gsap.to(this.sceneManager.objects.text.scale, {
                x: 14, y: 5,
                duration: 1.5,
                yoyo: true,
                repeat: 4,
                ease: "power2.inOut"
            });
        }
        
        if (this.sceneManager.objects.cake) {
            gsap.to(this.sceneManager.objects.cake.rotation, {
                y: Math.PI * 6,
                duration: 4,
                ease: "power2.inOut"
            });
        }
        
        setTimeout(() => {
            this.sceneManager.triggerConfettiStorm();
        }, 1000);
        
        this.sceneManager.enableRainbowLighting();
    }

    resetForNextRound() {
        this.updateAction('🔄 Preparing for next EPIC round...');
        console.log('🔄 Preparing for next EPIC round...');
        
        setTimeout(() => {
            this.sceneManager.quickReset();
            this.startTime = Date.now();
        }, 2000);
    }

    updateAction(action) {
        const actionElement = document.getElementById('current-action');
        if (actionElement) {
            actionElement.textContent = action;
            
            // Add pulse effect
            const container = actionElement.parentElement;
            if (container) {
                container.classList.add('pulse-action');
                setTimeout(() => {
                    container.classList.remove('pulse-action');
                }, 600);
            }
        }
        
        // Hide scene title after first action
        if (action.includes('WELCOME')) {
            setTimeout(() => {
                const sceneTitle = document.getElementById('scene-title');
                if (sceneTitle) {
                    sceneTitle.style.opacity = '0';
                    sceneTitle.style.transform = 'translateX(-50%) translateY(30px)';
                }
            }, 3000);
        }
    }

    createSimpleActionTimeline() {
        const phases = [
            { delay: 0, action: () => this.explodeWelcome() },
            { delay: 5000, action: () => this.balloonSurpriseAttack() },
            { delay: 8000, action: () => this.cakeAndCandleMagic() },
            { delay: 12000, action: () => this.confettiExplosion() },
            { delay: 16000, action: () => this.showBirthdayMessageWithHearts() },
            { delay: 22000, action: () => this.fireworksFinale() },
            { delay: 28000, action: () => this.megaCelebration() },
            { delay: 35000, action: () => this.resetForNextRound() }
        ];
        
        const startCycle = () => {
            phases.forEach(phase => {
                setTimeout(phase.action, phase.delay);
            });
            
            setTimeout(startCycle, 38000);
        };
        
        startCycle();
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
    }
}

// ===== ENHANCED AUDIO MANAGER CLASS =====
class AudioManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.volume = 0.3; // Slightly lower for better experience
    }

    async init() {
        try {
            if ('AudioContext' in window || 'webkitAudioContext' in window) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        } catch (error) {
            console.warn('Audio not available:', error);
        }
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
            gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Audio play failed:', error);
        }
    }

    playExplosion() {
        this.playTone(120, 0.4);
        setTimeout(() => this.playTone(180, 0.5), 100);
        setTimeout(() => this.playTone(90, 0.6), 200);
    }

    playFirework() {
        this.playTone(900, 0.3);
        setTimeout(() => this.playTone(700, 0.4), 120);
        setTimeout(() => this.playTone(500, 0.5), 240);
    }

    toggle() {
        this.enabled = !this.enabled;
        console.log(`Audio ${this.enabled ? 'enabled' : 'disabled'}`);
    }
}

// ===== INITIALIZE THE ENHANCED APP =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 Welcome to Aafia\'s ENHANCED Birthday Celebration! 🎂');
    console.log('✨ Get ready for full-screen birthday magic with hearts! ✨');
    
    const app = new BirthdayApp();
    app.init().catch(error => {
        console.error('💥 Failed to initialize enhanced birthday app:', error);
    });
});
