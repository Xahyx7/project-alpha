// Professional Scene Management System - Updated for New Architecture
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
        
        this.interactionCallbacks = [];
        this.animationMixer = null;
        this.clock = new THREE.Clock();
        
        this.isAnimating = true;
        this.currentScene = 'intro';
        
        // Performance monitoring
        this.frameCount = 0;
        this.lastTime = performance.now();
    }

    async init() {
        try {
            console.log('SceneManager: Initializing...');
            
            this.setupRenderer();
            this.setupScene();
            this.setupCamera();
            this.setupControls();
            this.setupLighting();
            this.setupPostProcessing();
            
            await this.loadModels();
            
            this.startRenderLoop();
            this.setupInteractionHandlers();
            
            console.log('SceneManager: Initialization complete');
            return true;
            
        } catch (error) {
            console.error('SceneManager: Initialization failed:', error);
            throw error;
        }
    }

    setupRenderer() {
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Enhanced rendering settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace; // Updated for newer Three.js
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Performance optimizations
        this.renderer.info.autoReset = false;
        this.renderer.setAnimationLoop = null; // We'll handle this manually
        
        console.log('SceneManager: Renderer initialized');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        
        // Enhanced background with gradient
        const bgColor1 = new THREE.Color(0x1a1a2e);
        const bgColor2 = new THREE.Color(0x16213e);
        this.scene.background = bgColor1;
        
        // Atmospheric fog
        this.scene.fog = new THREE.Fog(0x1a1a2e, 30, 150);
        
        // Environment setup for better reflections
        try {
            const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
            const envScene = new THREE.Scene();
            envScene.background = new THREE.Color(0x1a1a2e);
            const envTexture = pmremGenerator.fromScene(envScene, 0.04).texture;
            this.scene.environment = envTexture;
            pmremGenerator.dispose();
        } catch (error) {
            console.warn('Environment texture setup failed:', error);
        }
        
        console.log('SceneManager: Scene initialized');
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        console.log('SceneManager: Camera initialized');
    }

    setupControls() {
        if (!THREE.OrbitControls) {
            console.warn('OrbitControls not available, controls disabled');
            return;
        }

        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 25;
        this.controls.maxPolarAngle = Math.PI / 2.1;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.3;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        
        // Smooth controls
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        };
        
        console.log('SceneManager: Controls initialized');
    }

    setupLighting() {
        // Enhanced lighting setup
        
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Main directional light (sun)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(12, 20, 8);
        mainLight.castShadow = true;
        
        // Enhanced shadow settings
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 100;
        mainLight.shadow.camera.left = -25;
        mainLight.shadow.camera.right = 25;
        mainLight.shadow.camera.top = 25;
        mainLight.shadow.camera.bottom = -25;
        mainLight.shadow.bias = -0.0001;
        mainLight.shadow.normalBias = 0.02;
        
        this.scene.add(mainLight);
        
        // Fill light (warm)
        const fillLight = new THREE.DirectionalLight(0xffeaa7, 0.4);
        fillLight.position.set(-12, 8, -8);
        this.scene.add(fillLight);
        
        // Rim light (cool)
        const rimLight = new THREE.DirectionalLight(0x74b9ff, 0.3);
        rimLight.position.set(0, 8, -20);
        this.scene.add(rimLight);
        
        // Accent lights for atmosphere
        const accentLight1 = new THREE.PointLight(0xff69b4, 0.5, 30);
        accentLight1.position.set(8, 4, 8);
        this.scene.add(accentLight1);
        
        const accentLight2 = new THREE.PointLight(0x00ced1, 0.5, 30);
        accentLight2.position.set(-8, 4, 8);
        this.scene.add(accentLight2);
        
        console.log('SceneManager: Lighting initialized');
    }

    setupPostProcessing() {
        // Post-processing can be added here for bloom, etc.
        // For now, we'll use the built-in tone mapping
        console.log('SceneManager: Post-processing setup complete');
    }

    async loadModels() {
        try {
            console.log('SceneManager: Loading 3D models...');
            
            // Load all models in parallel for better performance
            await Promise.all([
                this.createEnvironment(),
                this.createBalloons(),
                this.createCake(),
                this.createFloatingText(),
                this.createParticles(),
                this.createStars(),
                this.createDecorations()
            ]);
            
            console.log('SceneManager: All models loaded successfully');
        } catch (error) {
            console.error('SceneManager: Model loading failed:', error);
            throw error;
        }
    }

    async createEnvironment() {
        // Enhanced ground with reflective properties
        const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.4,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2.5;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Add some subtle ground variation
        groundGeometry.attributes.position.array.forEach((vertex, index) => {
            if (index % 3 === 1) { // Y coordinates
                groundGeometry.attributes.position.array[index] += Math.random() * 0.1;
            }
        });
        groundGeometry.attributes.position.needsUpdate = true;
        groundGeometry.computeVertexNormals();
        
        console.log('SceneManager: Environment created');
    }

    async createBalloons() {
        const balloonGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const colors = [
            0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd,
            0xff9f43, 0x6c5ce7, 0xa29bfe, 0xfd79a8, 0x00b894
        ];
        
        // Create more balloons for a fuller scene
        for (let i = 0; i < 30; i++) {
            const material = new THREE.MeshPhysicalMaterial({
                color: colors[i % colors.length],
                metalness: 0.1,
                roughness: 0.15,
                clearcoat: 1,
                clearcoatRoughness: 0.05,
                transmission: 0.1,
                thickness: 0.5,
                ior: 1.4,
                envMapIntensity: 1.0
            });
            
            const balloon = new THREE.Mesh(balloonGeometry, material);
            
            // Better distribution
            const angle = (i / 30) * Math.PI * 2;
            const radius = 8 + Math.random() * 12;
            balloon.position.set(
                Math.cos(angle) * radius + (Math.random() - 0.5) * 4,
                Math.random() * 8 + 2,
                Math.sin(angle) * radius + (Math.random() - 0.5) * 4
            );
            
            balloon.castShadow = true;
            balloon.receiveShadow = true;
            balloon.userData = { 
                type: 'balloon', 
                id: i,
                originalY: balloon.position.y,
                floatSpeed: 0.3 + Math.random() * 0.4,
                popped: false,
                bobAmount: 0.2 + Math.random() * 0.3
            };
            
            // Add balloon string
            this.createBalloonString(balloon);
            
            this.scene.add(balloon);
            this.objects.balloons.push(balloon);
        }
        
        console.log(`SceneManager: Created ${this.objects.balloons.length} balloons`);
    }

    createBalloonString(balloon) {
        const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2, 8);
        const stringMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.6
        });
        
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.set(0, -1, 0);
        balloon.add(string);
    }

    async createCake() {
        const cakeGroup = new THREE.Group();
        
        // Enhanced multi-tier cake with more detail
        const tiers = [
            { radius: 2.2, height: 1.0, color: 0xffb3ba, decorColor: 0xff69b4 },
            { radius: 1.6, height: 0.8, color: 0xffdfba, decorColor: 0xffd700 },
            { radius: 1.1, height: 0.6, color: 0xffffba, decorColor: 0x98fb98 }
        ];
        
        let yOffset = 0;
        
        tiers.forEach((tier, index) => {
            // Main tier
            const geometry = new THREE.CylinderGeometry(tier.radius, tier.radius, tier.height, 64, 1);
            const material = new THREE.MeshPhysicalMaterial({
                color: tier.color,
                metalness: 0.05,
                roughness: 0.2,
                clearcoat: 0.9,
                clearcoatRoughness: 0.1,
                envMapIntensity: 0.5
            });
            
            const tierMesh = new THREE.Mesh(geometry, material);
            tierMesh.position.y = yOffset + tier.height / 2;
            tierMesh.castShadow = true;
            tierMesh.receiveShadow = true;
            
            cakeGroup.add(tierMesh);
            
            // Add decorative trim
            this.addCakeDecorations(cakeGroup, tier, yOffset);
            
            yOffset += tier.height;
        });
        
        // Add candles to top tier
        this.createCandles(cakeGroup, tiers[2].radius, yOffset);
        
        // Position the cake
        cakeGroup.position.y = -1.5;
        cakeGroup.userData = { type: 'cake' };
        
        this.scene.add(cakeGroup);
        this.objects.cake = cakeGroup;
        
        console.log('SceneManager: Cake created with decorations');
    }

    addCakeDecorations(parent, tier, yOffset) {
        // Add decorative roses around the tier
        const roseCount = Math.floor(tier.radius * 4);
        for (let i = 0; i < roseCount; i++) {
            const angle = (i / roseCount) * Math.PI * 2;
            const roseGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const roseMaterial = new THREE.MeshPhysicalMaterial({
                color: tier.decorColor,
                metalness: 0,
                roughness: 0.3
            });
            
            const rose = new THREE.Mesh(roseGeometry, roseMaterial);
            rose.position.set(
                Math.cos(angle) * tier.radius,
                yOffset + tier.height,
                Math.sin(angle) * tier.radius
            );
            rose.castShadow = true;
            parent.add(rose);
        }
    }

    createCandles(parent, radius, height) {
        const candleCount = 16;
        const candleGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 16);
        const candleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfff8dc,
            metalness: 0.1,
            roughness: 0.3,
            clearcoat: 0.5
        });
        
        const flameGeometry = new THREE.ConeGeometry(0.06, 0.2, 8);
        
        for (let i = 0; i < candleCount; i++) {
            const angle = (i / candleCount) * Math.PI * 2;
            const candleRadius = radius * 0.75;
            const x = Math.cos(angle) * candleRadius;
            const z = Math.sin(angle) * candleRadius;
            
            // Candle
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);
            candle.position.set(x, height + 0.25, z);
            candle.castShadow = true;
            parent.add(candle);
            
            // Enhanced flame with glow
            const flameMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.08, 1, 0.6),
                transparent: true,
                opacity: 0.8
            });
            
            const flame = new THREE.Mesh(flameGeometry, flameMaterial.clone());
            flame.position.set(0, 0.3, 0);
            flame.userData = { 
                type: 'flame', 
                id: i,
                lit: true,
                originalIntensity: 0.8,
                originalColor: flameMaterial.color.clone()
            };
            
            // Add point light for each flame
            const flameLight = new THREE.PointLight(0xff6600, 0.3, 3);
            flameLight.position.copy(flame.position);
            flame.add(flameLight);
            
            candle.add(flame);
            
            this.objects.candles.push({ candle, flame, light: flameLight });
        }
        
        console.log(`SceneManager: Created ${candleCount} candles with flames`);
    }

    async createFloatingText() {
        try {
            // Create enhanced text with better styling
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.fillStyle = 'transparent';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Create gradient text
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#ff69b4');
            gradient.addColorStop(0.3, '#ffd700');
            gradient.addColorStop(0.6, '#00ced1');
            gradient.addColorStop(1, '#98fb98');
            
            // Text styling
            ctx.font = "bold 120px 'Arial', sans-serif";
            ctx.fillStyle = gradient;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Add shadow/glow effect
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 20;
            
            // Draw text
            ctx.fillText("Happy Birthday Aafia!", canvas.width/2, canvas.height/2);
            
            // Create texture and sprite
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            
            const material = new THREE.SpriteMaterial({ 
                map: texture, 
                transparent: true,
                alphaTest: 0.1,
                blending: THREE.AdditiveBlending
            });
            
            const sprite = new THREE.Sprite(material);
            sprite.position.set(0, 7, 0);
            sprite.scale.set(12, 3, 1);
            sprite.userData = { type: 'text' };
            
            this.scene.add(sprite);
            this.objects.text = sprite;
            
            // Animate the text
            if (window.gsap) {
                gsap.to(sprite.scale, {
                    x: 13, y: 3.3,
                    duration: 3,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1
                });
                
                gsap.to(sprite.material, {
                    opacity: 0.9,
                    duration: 2,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1
                });
            }
            
            console.log('SceneManager: Floating text created');
        } catch (error) {
            console.warn('SceneManager: Text creation failed:', error);
        }
    }

    async createParticles() {
        // Enhanced confetti system
        const confettiGeometry = new THREE.PlaneGeometry(0.15, 0.1);
        const confettiColors = [
            0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd,
            0xff9f43, 0x6c5ce7, 0xa29bfe, 0xfd79a8, 0x00b894
        ];
        
        for (let i = 0; i < 200; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: confettiColors[i % confettiColors.length],
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0
            });
            
            const confetti = new THREE.Mesh(confettiGeometry, material);
            confetti.position.set(
                (Math.random() - 0.5) * 30,
                Math.random() * 15 + 15,
                (Math.random() - 0.5) * 30
            );
            
            confetti.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            confetti.userData = {
                type: 'confetti',
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    -Math.random() * 2 - 1,
                    (Math.random() - 0.5) * 2
                ),
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3
                ),
                active: false,
                originalPosition: confetti.position.clone()
            };
            
            this.scene.add(confetti);
            this.objects.particles.push(confetti);
        }
        
        console.log(`SceneManager: Created ${this.objects.particles.length} particles`);
    }

    async createStars() {
        // Enhanced star field
        const starGeometry = new THREE.SphereGeometry(0.08, 12, 12);
        
        for (let i = 0; i < 100; i++) {
            const starMaterial = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(Math.random(), 0.5, 0.8),
                transparent: true,
                opacity: 0.7
            });
            
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(
                (Math.random() - 0.5) * 100,
                Math.random() * 30 + 10,
                (Math.random() - 0.5) * 100
            );
            
            star.userData = { 
                type: 'star',
                twinkleSpeed: Math.random() * 3 + 1,
                originalIntensity: starMaterial.opacity
            };
            
            this.scene.add(star);
            this.objects.stars.push(star);
        }
        
        console.log(`SceneManager: Created ${this.objects.stars.length} stars`);
    }

    async createDecorations() {
        // Add some birthday-themed decorations
        this.createGiftBoxes();
        this.createStreamers();
        console.log('SceneManager: Decorations created');
    }

    createGiftBoxes() {
        const boxCount = 8;
        const colors = [0xff69b4, 0x00ced1, 0xffd700, 0x98fb98];
        
        for (let i = 0; i < boxCount; i++) {
            const size = 0.3 + Math.random() * 0.4;
            const boxGeometry = new THREE.BoxGeometry(size, size, size);
            const boxMaterial = new THREE.MeshPhysicalMaterial({
                color: colors[i % colors.length],
                metalness: 0.1,
                roughness: 0.3,
                clearcoat: 0.8
            });
            
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(
                (Math.random() - 0.5) * 15,
                size / 2 - 1.5,
                (Math.random() - 0.5) * 15
            );
            
            box.rotation.y = Math.random() * Math.PI * 2;
            box.castShadow = true;
            box.receiveShadow = true;
            
            this.scene.add(box);
        }
    }

    createStreamers() {
        // Create colorful streamers
        const streamerCount = 12;
        
        for (let i = 0; i < streamerCount; i++) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-10 + i * 2, 8, -10),
                new THREE.Vector3(-5 + i * 1.5, 12, 0),
                new THREE.Vector3(0 + i, 8, 10),
                new THREE.Vector3(5 + i * 0.5, 15, 20)
            ]);
            
            const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
            const streamerMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(i / streamerCount, 0.8, 0.6)
            });
            
            const streamer = new THREE.Mesh(tubeGeometry, streamerMaterial);
            this.scene.add(streamer);
        }
    }

    setupInteractionHandlers() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        const handleClick = (event) => {
            // Calculate mouse position in normalized device coordinates
            const rect = this.canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Update the raycaster
            raycaster.setFromCamera(mouse, this.camera);
            
            // Check for intersections
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            
            if (intersects.length > 0) {
                this.handleClick(intersects[0]);
            }
        };
        
        this.canvas.addEventListener('click', handleClick);
        this.canvas.addEventListener('touchend', handleClick);
        
        console.log('SceneManager: Interaction handlers set up');
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
            case 'cake':
                this.triggerCakeInteraction();
                break;
        }
    }

    popBalloon(balloon) {
        if (balloon.userData.popped) return;
        
        balloon.userData.popped = true;
        
        // Trigger interaction callback
        this.triggerInteraction('balloonPop', {
            position: balloon.position.clone(),
            id: balloon.userData.id
        });
        
        // Enhanced pop animation
        if (window.gsap) {
            gsap.to(balloon.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.4,
                ease: 'back.in(1.7)',
                onComplete: () => {
                    this.scene.remove(balloon);
                }
            });
        }
        
        // Create particle burst
        this.createParticleBurst(balloon.position);
    }

    blowCandle(flame) {
        if (!flame.userData.lit) return;
        
        flame.userData.lit = false;
        
        // Trigger interaction callback
        this.triggerInteraction('candleBlow', {
            candleId: flame.userData.id
        });
        
        // Enhanced blow animation
        if (window.gsap) {
            gsap.to(flame.material, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
            
            gsap.to(flame.scale, {
                x: 0.5, y: 0.1, z: 0.5,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    }

    triggerCakeInteraction() {
        // Trigger cake sparkles or other effects
        this.triggerInteraction('cakeClick', {});
        this.createCakeSparkles();
    }

    createCakeSparkles() {
        // Add sparkle effects around the cake
        const sparkleCount = 20;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = new THREE.Mesh(
                new THREE.SphereGeometry(0.02, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xffd700 })
            );
            
            const angle = (i / sparkleCount) * Math.PI * 2;
            sparkle.position.set(
                Math.cos(angle) * 3,
                Math.random() * 4,
                Math.sin(angle) * 3
            );
            
            this.scene.add(sparkle);
            
            // Animate sparkles
            if (window.gsap) {
                gsap.to(sparkle.position, {
                    y: sparkle.position.y + 2,
                    duration: 2,
                    ease: 'power1.out'
                });
                
                gsap.to(sparkle.material, {
                    opacity: 0,
                    duration: 2,
                    ease: 'power1.out',
                    onComplete: () => {
                        this.scene.remove(sparkle);
                    }
                });
            }
        }
    }

    createParticleBurst(position) {
        // Activate nearby particles for burst effect
        let activatedCount = 0;
        this.objects.particles.forEach(particle => {
            if (particle.userData.active || activatedCount > 15) return;
            
            const distance = particle.position.distanceTo(position);
            if (distance < 5) {
                particle.userData.active = true;
                particle.material.opacity = 1;
                particle.position.copy(position);
                particle.position.add(new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    Math.random() * 2,
                    (Math.random() - 0.5) * 2
                ));
                particle.userData.velocity.set(
                    (Math.random() - 0.5) * 4,
                    Math.random() * 4 + 2,
                    (Math.random() - 0.5) * 4
                );
                activatedCount++;
            }
        });
    }

    startRenderLoop() {
        const animate = () => {
            if (!this.isAnimating) return;
            
            requestAnimationFrame(animate);
            
            const deltaTime = Math.min(this.clock.getDelta(), 0.033); // Cap at ~30fps
            
            this.update(deltaTime);
            this.render();
            
            // Performance monitoring
            this.frameCount++;
            const currentTime = performance.now();
            if (currentTime - this.lastTime >= 1000) {
                // console.log(`FPS: ${this.frameCount}`);
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
        };
        
        animate();
        console.log('SceneManager: Render loop started');
    }

    update(deltaTime) {
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Update all objects
        this.updateBalloons(deltaTime);
        this.updateCandles(deltaTime);
        this.updateParticles(deltaTime);
        this.updateStars(deltaTime);
        
        // Update animation mixer if exists
        if (this.animationMixer) {
            this.animationMixer.update(deltaTime);
        }
    }

    updateBalloons(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.balloons.forEach(balloon => {
            if (balloon.userData.popped) return;
            
            // Enhanced floating animation
            const floatSpeed = balloon.userData.floatSpeed;
            const bobAmount = balloon.userData.bobAmount;
            balloon.position.y = balloon.userData.originalY + 
                Math.sin(time * floatSpeed + balloon.userData.id) * bobAmount;
            
            // Gentle swaying
            balloon.rotation.y += deltaTime * 0.2;
            balloon.rotation.z = Math.sin(time * floatSpeed * 0.5 + balloon.userData.id) * 0.08;
            
            // Subtle scale breathing
            const breathe = 1 + Math.sin(time * 2 + balloon.userData.id) * 0.02;
            balloon.scale.setScalar(breathe);
        });
    }

    updateCandles(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.candles.forEach(({ flame, light }) => {
            if (!flame.userData.lit) {
                if (light) light.intensity = 0;
                return;
            }
            
            // Enhanced flickering effect
            const baseFlicker = Math.sin(time * 15 + flame.userData.id) * 0.1;
            const detailFlicker = Math.sin(time * 25 + flame.userData.id * 2) * 0.05;
            const flicker = 0.85 + baseFlicker + detailFlicker;
            
            flame.material.opacity = flame.userData.originalIntensity * flicker;
            
            // Color variation
            const hue = 0.08 + Math.sin(time * 10 + flame.userData.id) * 0.02;
            flame.material.color.setHSL(hue, 1, 0.6);
            
            // Light intensity
            if (light) {
                light.intensity = 0.3 * flicker;
            }
            
            // Subtle movement
            flame.rotation.y += deltaTime * 3;
            flame.position.x = Math.sin(time * 8 + flame.userData.id) * 0.02;
        });
    }

    updateParticles(deltaTime) {
        this.objects.particles.forEach(particle => {
            if (!particle.userData.active) return;
            
            // Update position with physics
            particle.position.add(
                particle.userData.velocity.clone().multiplyScalar(deltaTime)
            );
            
            // Apply gravity and air resistance
            particle.userData.velocity.y -= 9.8 * deltaTime * 0.1;
            particle.userData.velocity.multiplyScalar(0.995);
            
            // Rotation
            particle.rotation.x += particle.userData.rotationSpeed.x;
            particle.rotation.y += particle.userData.rotationSpeed.y;
            particle.rotation.z += particle.userData.rotationSpeed.z;
            
            // Fade out over time
            particle.material.opacity = Math.max(0, particle.material.opacity - deltaTime * 0.3);
            
            // Reset if too low or faded
            if (particle.position.y < -10 || particle.material.opacity <= 0) {
                particle.userData.active = false;
                particle.material.opacity = 0;
                particle.position.copy(particle.userData.originalPosition);
            }
        });
    }

    updateStars(deltaTime) {
        const time = this.clock.elapsedTime;
        
        this.objects.stars.forEach(star => {
            // Twinkling effect
            const twinkle = Math.sin(time * star.userData.twinkleSpeed + star.userData.id) * 0.3 + 0.7;
            star.material.opacity = star.userData.originalIntensity * twinkle;
            
            // Subtle color shift
            const hue = (time * 0.1 + star.userData.id * 0.1) % 1;
            star.material.color.setHSL(hue, 0.5, 0.8);
        });
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        
        // Reset renderer info for next frame
        if (this.renderer) {
            this.renderer.info.reset();
        }
    }

    // Scene transition methods
    transitionToScene(sceneName) {
        console.log(`SceneManager: Transitioning to ${sceneName}`);
        this.currentScene = sceneName;
        
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
        let delay = 0;
        this.objects.particles.forEach((particle, index) => {
            if (index % 3 === 0) { // Activate every 3rd particle
                setTimeout(() => {
                    if (!particle.userData.active) {
                        particle.userData.active = true;
                        particle.material.opacity = 1;
                        particle.position.set(0, 10, 0);
                        particle.userData.velocity.set(
                            (Math.random() - 0.5) * 8,
                            Math.random() * 6 + 4,
                            (Math.random() - 0.5) * 8
                        );
                    }
                }, delay);
                delay += 50;
            }
        });
    }

    triggerFireworks() {
        // Create multiple firework bursts
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const position = new THREE.Vector3(
                    (Math.random() - 0.5) * 15,
                    Math.random() * 8 + 12,
                    (Math.random() - 0.5) * 15
                );
                this.createParticleBurst(position);
            }, i * 800);
        }
    }

    // Event handling
    onInteraction(callback) {
        this.interactionCallbacks.push(callback);
    }

    triggerInteraction(type, data) {
        this.interactionCallbacks.forEach(callback => {
            try {
                callback(type, data);
            } catch (error) {
                console.error('Interaction callback error:', error);
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
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        console.log(`SceneManager: Resized to ${width}x${height}`);
    }

    // Cleanup methods
    dispose() {
        console.log('SceneManager: Disposing...');
        
        this.isAnimating = false;
        
        // Dispose of geometries, materials, textures
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
        
        // Dispose renderer
        this.renderer?.dispose();
        
        // Clear references
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        console.log('SceneManager: Disposal complete');
    }
}
