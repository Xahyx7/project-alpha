// Complete Performance Scene Manager with ALL Animations
export class SceneManager {
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
        
        // Performance optimizations
        this.maxBalloons = 12;
        this.maxParticles = 60; // Increased for better effects
        this.maxStars = 25;
        this.renderScale = Math.min(window.devicePixelRatio, 1.5);
        this.targetFPS = 30;
        
        // Automatic timeline
        this.timeline = null;
        this.sceneCallbacks = [];
    }

    async init() {
        try {
            console.log('SceneManager: Initializing full animation version...');
            
            this.setupRenderer();
            this.setupScene();
            this.setupCamera();
            this.setupControls();
            this.setupLighting();
            
            await this.loadOptimizedModels();
            
            this.startRenderLoop();
            
            console.log('SceneManager: Full animation initialization complete');
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
        
        console.log('SceneManager: Renderer optimized for animations');
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
        // Main lighting setup
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
        
        // Accent lights for rainbow effects
        const accentLight1 = new THREE.PointLight(0xff69b4, 0.4, 15);
        accentLight1.position.set(-5, 6, 0);
        this.scene.add(accentLight1);
        
        const accentLight2 = new THREE.PointLight(0x00ced1, 0.4, 15);
        accentLight2.position.set(5, 6, 0);
        this.scene.add(accentLight2);
        
        console.log('SceneManager: Enhanced lighting setup');
    }

    async loadOptimizedModels() {
        console.log('SceneManager: Loading models for full animation...');
        
        await Promise.all([
            this.createSimpleEnvironment(),
            this.createOptimizedBalloons(),
            this.createSimpleCake(),
            this.createSimpleText(),
            this.createOptimizedParticles(),
            this.createSimpleStars()
        ]);
        
        console.log('SceneManager: All animation models loaded');
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
        
        // Main cake body
        const geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0xffb3ba });
        
        const cake = new THREE.Mesh(geometry, material);
        cake.position.y = 0.3;
        cake.castShadow = true;
        cake.receiveShadow = true;
        
        cakeGroup.add(cake);
        
        // Candles with flames
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
            
            // Flame with glow
            const flame = new THREE.Mesh(
                new THREE.ConeGeometry(0.04, 0.12, 6),
                new THREE.MeshBasicMaterial({ color: 0xff6600 })
            );
            flame.position.set(0, 0.2, 0);
            flame.userData = { type: 'flame', id: i, lit: true };
            
            // Add point light for each candle
            const flameLight = new THREE.PointLight(0xff6600, 0.2, 2);
            flameLight.position.copy(flame.position);
            flame.add(flameLight);
            
            candle.add(flame);
            cakeGroup.add(candle);
            
            this.objects.candles.push({ candle, flame, light: flameLight });
        }
        
        cakeGroup.position.y = -1;
        cakeGroup.userData = { type: 'cake', visible: false };
        cakeGroup.visible = false;
        
        this.scene.add(cakeGroup);
        this.objects.cake = cakeGroup;
        
        console.log('Animation-ready cake created');
    }

    async createSimpleText() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            // Gradient text
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
            
            console.log('Animation-ready text created');
        } catch (error) {
            console.warn('Text creation failed:', error);
        }
    }

    async createOptimizedParticles() {
        const confettiGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0xff9f43];
        
        for (let i = 0; i < this.maxParticles; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0
            });
            
            const confetti = new THREE.Mesh(confettiGeometry, material);
            confetti.position.set(0, 10, 0);
            
            confetti.userData = {
                type: 'confetti',
                active: false,
                velocity: new THREE.Vector3(),
                rotationSpeed: new THREE.Vector3(),
                originalPosition: new THREE.Vector3(0, 10, 0)
            };
            
            this.scene.add(confetti);
            this.objects.particles.push(confetti);
        }
        
        console.log(`Created ${this.objects.particles.length} animation particles`);
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

    // ===== ANIMATION METHODS =====

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
        console.log('🎊 MEGA CONFETTI EXPLOSION!');
        
        this.objects.particles.forEach((particle, index) => {
            particle.userData.active = true;
            particle.material.opacity = 1;
            particle.position.set(0, 8, 0);
            
            const angle = (Math.random() * Math.PI * 2);
            const speed = 4 + Math.random() * 4;
            const height = Math.random() * 6 + 3;
            
            particle.userData.velocity.set(
                Math.cos(angle) * speed,
                height,
                Math.sin(angle) * speed
            );
            
            particle.userData.rotationSpeed.set(
                (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.4
            );
        });
    }

    triggerGentleConfetti() {
        console.log('🎊 Gentle confetti rain...');
        
        let activeCount = 0;
        this.objects.particles.forEach((particle) => {
            if (activeCount > 25) return;
            
            particle.userData.active = true;
            particle.material.opacity = 0.8;
            particle.position.set(
                (Math.random() - 0.5) * 20,
                12 + Math.random() * 3,
                (Math.random() - 0.5) * 20
            );
            
            particle.userData.velocity.set(
                (Math.random() - 0.5) * 1,
                -1.5 - Math.random(),
                (Math.random() - 0.5) * 1
            );
            
            activeCount++;
        });
    }

    triggerConfettiStorm() {
        console.log('⛈️ CONFETTI STORM!');
        
        for (let wave = 0; wave < 5; wave++) {
            setTimeout(() => {
                this.triggerMegaConfetti();
            }, wave * 300);
        }
    }

    createFloatingMessage(message) {
        try {
            console.log('💌 Creating floating message...');
            
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            // Gradient background
            const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
            gradient.addColorStop(0, 'rgba(255, 105, 180, 0.9)');
            gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 206, 209, 0.7)');
            
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
            messageSprite.position.set(0, 8, 0);
            messageSprite.scale.set(0, 0, 1);
            
            this.scene.add(messageSprite);
            
            if (window.gsap) {
                gsap.to(messageSprite.scale, {
                    x: 14, y: 7,
                    duration: 1,
                    ease: "back.out(1.7)"
                });
                
                gsap.to(messageSprite.position, {
                    y: 10,
                    duration: 4,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut"
                });
                
                gsap.to(messageSprite.material, {
                    opacity: 0,
                    duration: 1.5,
                    delay: 4,
                    onComplete: () => {
                        this.scene.remove(messageSprite);
                    }
                });
            }
            
        } catch (error) {
            console.warn('Message creation failed:', error);
        }
    }

    createFirework(position) {
        console.log('🎆 Creating firework at position:', position);
        
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0xff9f43, 0xff69b4, 0x00ced1];
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 8, 8),
                new THREE.MeshBasicMaterial({ 
                    color: colors[i % colors.length],
                    transparent: true,
                    opacity: 1
                })
            );
            
            particle.position.copy(position);
            this.scene.add(particle);
            
            const angle = (i / particleCount) * Math.PI * 2;
            const elevation = (Math.random() - 0.5) * Math.PI * 0.5;
            const speed = 4 + Math.random() * 3;
            
            if (window.gsap) {
                gsap.to(particle.position, {
                    x: position.x + Math.cos(angle) * Math.cos(elevation) * speed,
                    y: position.y + Math.sin(elevation) * speed,
                    z: position.z + Math.sin(angle) * Math.cos(elevation) * speed,
                    duration: 2.5,
                    ease: "power2.out"
                });
                
                gsap.to(particle.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 2.5,
                    ease: "power1.out"
                });
                
                gsap.to(particle.material, {
                    opacity: 0,
                    duration: 2.5,
                    ease: "power1.out",
                    onComplete: () => {
                        this.scene.remove(particle);
                    }
                });
            }
        }
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
        
        gsap.to(this.camera.position, {
            x: originalPosition.x + 2,
            y: originalPosition.y + 1,
            z: originalPosition.z + 2,
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
            { r: 1, g: 0, b: 0 },     // Red
            { r: 1, g: 0.5, b: 0 },   // Orange  
            { r: 1, g: 1, b: 0 },     // Yellow
            { r: 0, g: 1, b: 0 },     // Green
            { r: 0, g: 0, b: 1 },     // Blue
            { r: 0.5, g: 0, b: 1 },   // Purple
            { r: 1, g: 0, b: 1 }      // Magenta
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

    // ===== RENDER LOOP =====

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
        console.log(`SceneManager: Animation render loop started (${this.targetFPS} FPS)`);
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
        
        this.objects.candles.forEach(({ flame, light }) => {
            if (!flame.userData.lit) return;
            
            const flicker = 0.7 + Math.sin(time * 12 + flame.userData.id * 2) * 0.3;
            flame.material.opacity = flicker;
            
            if (light) {
                light.intensity = 0.2 * flicker;
            }
        });
    }

    updateParticles(deltaTime) {
        this.objects.particles.forEach((particle) => {
            if (!particle.userData.active) return;
            
            // Update position
            particle.position.add(
                particle.userData.velocity.clone().multiplyScalar(deltaTime)
            );
            
            // Apply gravity and air resistance
            particle.userData.velocity.y -= 8 * deltaTime;
            particle.userData.velocity.multiplyScalar(0.98);
            
            // Rotation
            particle.rotation.x += particle.userData.rotationSpeed.x;
            particle.rotation.y += particle.userData.rotationSpeed.y;
            particle.rotation.z += particle.userData.rotationSpeed.z;
            
            // Fade out over time
            particle.material.opacity = Math.max(0, particle.material.opacity - deltaTime * 0.4);
            
            // Reset if too low or faded
            if (particle.position.y < -8 || particle.material.opacity <= 0) {
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

    // ===== UTILITY METHODS =====

    transitionToScene(sceneName) {
        console.log(`SceneManager: Transitioning to ${sceneName}`);
        this.currentScene = sceneName;
    }

    onSceneChange(callback) {
        this.sceneCallbacks.push(callback);
    }

    notifySceneChange(sceneName) {
        this.sceneCallbacks.forEach(callback => {
            try {
                callback(sceneName);
            } catch (error) {
                console.error('Scene callback error:', error);
            }
        });
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
