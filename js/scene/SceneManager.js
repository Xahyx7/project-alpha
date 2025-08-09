// Optimized Performance Scene Manager for Automatic Birthday Celebration
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
        this.maxParticles = 40;
        this.maxStars = 25;
        this.renderScale = Math.min(window.devicePixelRatio, 1.5);
        this.targetFPS = 30;
        
        // Automatic timeline
        this.timeline = null;
        this.sceneCallbacks = [];
    }

    async init() {
        try {
            console.log('SceneManager: Initializing optimized version...');
            
            this.setupRenderer();
            this.setupScene();
            this.setupCamera();
            this.setupControls();
            this.setupLighting();
            
            await this.loadOptimizedModels();
            
            this.startRenderLoop();
            this.initializeAutomaticTimeline();
            
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
            antialias: window.innerWidth < 768 ? false : true, // Conditional antialiasing
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.renderScale);
        
        // Performance-focused settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        console.log('SceneManager: Renderer optimized');
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
            this.controls.enableZoom = false; // Disable for performance
            this.controls.enablePan = false;
            console.log('SceneManager: Controls optimized');
        }
    }

    setupLighting() {
        // Minimal lighting for performance
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(8, 12, 4);
        mainLight.castShadow = true;
        
        // Optimized shadow settings
        mainLight.shadow.mapSize.width = 512;
        mainLight.shadow.mapSize.height = 512;
        mainLight.shadow.camera.near = 1;
        mainLight.shadow.camera.far = 30;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        
        this.scene.add(mainLight);
        
        // Single accent light
        const accentLight = new THREE.PointLight(0xff69b4, 0.4, 15);
        accentLight.position.set(0, 6, 0);
        this.scene.add(accentLight);
        
        console.log('SceneManager: Lighting optimized');
    }

    async loadOptimizedModels() {
        console.log('SceneManager: Loading optimized models...');
        
        await Promise.all([
            this.createSimpleEnvironment(),
            this.createOptimizedBalloons(),
            this.createSimpleCake(),
            this.createSimpleText(),
            this.createOptimizedParticles(),
            this.createSimpleStars()
        ]);
        
        console.log('SceneManager: All models loaded');
    }

    async createSimpleEnvironment() {
        // Very simple ground
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
        const balloonGeometry = new THREE.SphereGeometry(0.25, 12, 12); // Lower poly
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd];
        
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
        
        console.log(`Created ${this.objects.balloons.length} optimized balloons`);
    }

    async createSimpleCake() {
        const cakeGroup = new THREE.Group();
        
        // Single tier cake
        const geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 16); // Lower poly
        const material = new THREE.MeshLambertMaterial({ color: 0xffb3ba });
        
        const cake = new THREE.Mesh(geometry, material);
        cake.position.y = 0.3;
        cake.castShadow = true;
        cake.receiveShadow = true;
        
        cakeGroup.add(cake);
        
        // Simple candles (reduced count)
        const candleCount = 6;
        const candleGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.3, 6);
        const candleMaterial = new THREE.MeshLambertMaterial({ color: 0xfff8dc });
        
        for (let i = 0; i < candleCount; i++) {
            const angle = (i / candleCount) * Math.PI * 2;
            const x = Math.cos(angle) * 0.8;
            const z = Math.sin(angle) * 0.8;
            
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);
            candle.position.set(x, 0.45, z);
            candle.castShadow = true;
            
            // Simple flame
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
        
        console.log('Simple cake created');
    }

    async createSimpleText() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 512; // Smaller texture
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#ff69b4';
            ctx.font = "bold 40px Arial";
            ctx.textAlign = 'center';
            ctx.fillText("Happy Birthday Aafia!", canvas.width/2, canvas.height/2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            
            const sprite = new THREE.Sprite(material);
            sprite.position.set(0, 5, 0);
            sprite.scale.set(6, 1.5, 1);
            sprite.userData = { type: 'text', visible: false };
            sprite.visible = false;
            
            this.scene.add(sprite);
            this.objects.text = sprite;
            
            console.log('Simple text created');
        } catch (error) {
            console.warn('Text creation failed:', error);
        }
    }

    async createOptimizedParticles() {
        const confettiGeometry = new THREE.PlaneGeometry(0.08, 0.08);
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7];
        
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
                rotationSpeed: new THREE.Vector3()
            };
            
            this.scene.add(confetti);
            this.objects.particles.push(confetti);
        }
        
        console.log(`Created ${this.objects.particles.length} optimized particles`);
    }

    async createSimpleStars() {
        const starGeometry = new THREE.SphereGeometry(0.03, 6, 6); // Very low poly
        
        for (let i = 0; i < this.maxStars; i++) {
            const starMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.4
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
                twinkleSpeed: 1 + Math.random() * 2
            };
            star.visible = false;
            
            this.scene.add(star);
            this.objects.stars.push(star);
        }
        
        console.log(`Created ${this.objects.stars.length} simple stars`);
    }

    initializeAutomaticTimeline() {
        console.log('SceneManager: Starting automatic timeline...');
        
        if (!window.gsap) {
            console.warn('GSAP not available, using simple timeline');
            this.startSimpleTimeline();
            return;
        }
        
        this.timeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        
        // Scene 1: Intro - Show text and stars (0-8s)
        this.timeline.call(() => {
            this.showIntroScene();
        });
        
        // Scene 2: Balloons appear (8s)
        this.timeline.call(() => {
            this.showBalloonsScene();
        }, null, 8);
        
        // Scene 3: Cake appears (16s)
        this.timeline.call(() => {
            this.showCakeScene();
        }, null, 16);
        
        // Scene 4: Celebration with confetti (28s)
        this.timeline.call(() => {
            this.showCelebrationScene();
        }, null, 28);
        
        // Scene 5: Grand finale (40s)
        this.timeline.call(() => {
            this.showFinaleScene();
        }, null, 40);
        
        // Reset for next cycle (50s)
        this.timeline.call(() => {
            this.resetScene();
        }, null, 50);
    }

    showIntroScene() {
        console.log('Scene: Intro');
        
        // Show text
        if (this.objects.text) {
            this.objects.text.visible = true;
            gsap.from(this.objects.text.scale, { 
                x: 0, y: 0, 
                duration: 1.5, 
                ease: "back.out(1.7)" 
            });
        }
        
        // Show stars with stagger
        this.objects.stars.forEach((star, index) => {
            setTimeout(() => {
                star.visible = true;
                star.userData.visible = true;
                gsap.from(star.scale, { 
                    x: 0, y: 0, z: 0, 
                    duration: 0.8, 
                    ease: "power2.out" 
                });
            }, index * 100);
        });
        
        this.notifySceneChange('intro');
    }

    showBalloonsScene() {
        console.log('Scene: Balloons');
        
        this.objects.balloons.forEach((balloon, index) => {
            setTimeout(() => {
                balloon.visible = true;
                balloon.userData.visible = true;
                gsap.from(balloon.position, { 
                    y: -3, 
                    duration: 1.5, 
                    ease: "bounce.out" 
                });
                gsap.from(balloon.scale, { 
                    x: 0, y: 0, z: 0, 
                    duration: 1, 
                    ease: "back.out(1.7)" 
                });
            }, index * 150);
        });
        
        this.notifySceneChange('balloons');
    }

    showCakeScene() {
        console.log('Scene: Cake');
        
        if (this.objects.cake) {
            this.objects.cake.visible = true;
            this.objects.cake.userData.visible = true;
            
            gsap.from(this.objects.cake.scale, { 
                x: 0, y: 0, z: 0, 
                duration: 2, 
                ease: "back.out(1.7)" 
            });
            
            gsap.from(this.objects.cake.rotation, { 
                y: Math.PI * 2, 
                duration: 2, 
                ease: "power2.out" 
            });
        }
        
        this.notifySceneChange('cake');
    }

    showCelebrationScene() {
        console.log('Scene: Celebration');
        
        // Trigger confetti
        this.triggerOptimizedConfetti();
        
        // Make balloons dance
        this.objects.balloons.forEach((balloon) => {
            if (balloon.userData.visible) {
                gsap.to(balloon.scale, { 
                    x: 1.3, y: 1.3, z: 1.3, 
                    duration: 1, 
                    yoyo: true, 
                    repeat: 3, 
                    ease: "power2.inOut" 
                });
            }
        });
        
        this.notifySceneChange('celebration');
    }

    showFinaleScene() {
        console.log('Scene: Finale');
        
        // Scale everything up
        if (this.objects.text) {
            gsap.to(this.objects.text.scale, { 
                x: 8, y: 2, 
                duration: 2, 
                yoyo: true, 
                repeat: 1, 
                ease: "power2.inOut" 
            });
        }
        
        if (this.objects.cake && this.objects.cake.userData.visible) {
            gsap.to(this.objects.cake.scale, { 
                x: 1.5, y: 1.5, z: 1.5, 
                duration: 2, 
                yoyo: true, 
                repeat: 1, 
                ease: "power2.inOut" 
            });
        }
        
        // Final confetti burst
        setTimeout(() => {
            this.triggerOptimizedConfetti();
        }, 1000);
        
        this.notifySceneChange('finale');
    }

    resetScene() {
        console.log('Scene: Resetting...');
        
        // Hide all objects for next cycle
        this.objects.balloons.forEach(balloon => {
            balloon.visible = false;
            balloon.userData.visible = false;
            balloon.scale.set(1, 1, 1);
        });
        
        if (this.objects.cake) {
            this.objects.cake.visible = false;
            this.objects.cake.userData.visible = false;
            this.objects.cake.scale.set(1, 1, 1);
        }
        
        if (this.objects.text) {
            this.objects.text.scale.set(6, 1.5, 1);
        }
        
        this.objects.stars.forEach(star => {
            star.visible = false;
            star.userData.visible = false;
            star.scale.set(1, 1, 1);
        });
        
        this.objects.particles.forEach(particle => {
            particle.userData.active = false;
            particle.material.opacity = 0;
        });
    }

    triggerOptimizedConfetti() {
        let activeCount = 0;
        const maxActive = Math.floor(this.maxParticles * 0.6); // Use 60% of particles
        
        this.objects.particles.forEach((particle, index) => {
            if (activeCount >= maxActive) return;
            
            particle.userData.active = true;
            particle.material.opacity = 1;
            particle.position.set(0, 6, 0);
            
            const angle = (Math.random() * Math.PI * 2);
            const speed = 2 + Math.random() * 2;
            
            particle.userData.velocity.set(
                Math.cos(angle) * speed,
                Math.random() * 3 + 2,
                Math.sin(angle) * speed
            );
            
            particle.userData.rotationSpeed.set(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            
            activeCount++;
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
        console.log(`SceneManager: Render loop started (${this.targetFPS} FPS)`);
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
                Math.sin(time * floatSpeed + balloon.userData.id) * 0.2;
            
            balloon.rotation.y += deltaTime * 0.3;
        });
    }

    updateCandles(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.candles.forEach(({ flame }) => {
            if (!flame.userData.lit) return;
            
            const flicker = 0.7 + Math.sin(time * 8 + flame.userData.id) * 0.3;
            flame.material.opacity = flicker;
        });
    }

    updateParticles(deltaTime) {
        this.objects.particles.forEach((particle) => {
            if (!particle.userData.active) return;
            
            // Update position
            particle.position.add(
                particle.userData.velocity.clone().multiplyScalar(deltaTime)
            );
            
            // Apply gravity
            particle.userData.velocity.y -= 5 * deltaTime;
            particle.userData.velocity.multiplyScalar(0.98);
            
            // Rotation
            particle.rotation.x += particle.userData.rotationSpeed.x;
            particle.rotation.y += particle.userData.rotationSpeed.y;
            particle.rotation.z += particle.userData.rotationSpeed.z;
            
            // Fade out
            particle.material.opacity = Math.max(0, particle.material.opacity - deltaTime * 0.5);
            
            // Reset if too low
            if (particle.position.y < -5 || particle.material.opacity <= 0) {
                particle.userData.active = false;
                particle.material.opacity = 0;
                particle.position.set(0, 10, 0);
            }
        });
    }

    updateStars(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.stars.forEach((star) => {
            if (!star.userData.visible) return;
            
            const twinkle = Math.sin(time * star.userData.twinkleSpeed + star.userData.id) * 0.2 + 0.6;
            star.material.opacity = twinkle * 0.4;
        });
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // Scene transition methods
    transitionToScene(sceneName) {
        console.log(`SceneManager: External transition to ${sceneName}`);
        this.currentScene = sceneName;
    }

    // Event system for external communication
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

    startSimpleTimeline() {
        // Fallback timeline without GSAP
        const scenes = [
            { name: 'intro', delay: 0, action: () => this.showIntroScene() },
            { name: 'balloons', delay: 8000, action: () => this.showBalloonsScene() },
            { name: 'cake', delay: 16000, action: () => this.showCakeScene() },
            { name: 'celebration', delay: 28000, action: () => this.showCelebrationScene() },
            { name: 'finale', delay: 40000, action: () => this.showFinaleScene() },
            { name: 'reset', delay: 50000, action: () => this.resetScene() }
        ];
        
        const startCycle = () => {
            scenes.forEach(scene => {
                setTimeout(scene.action, scene.delay);
            });
            
            setTimeout(startCycle, 52000); // Restart cycle
        };
        
        startCycle();
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
