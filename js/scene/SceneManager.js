// Professional Scene Management System
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
            particles: []
        };
        
        this.interactionCallbacks = [];
        this.animationMixer = null;
        this.clock = new THREE.Clock();
        
        this.isAnimating = true;
    }

    async init() {
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        this.setupControls();
        this.setupLighting();
        this.setupPostProcessing();
        
        this.startRenderLoop();
        this.setupInteractionHandlers();
    }

    setupRenderer() {
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
        
        // Advanced rendering settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Performance optimizations
        this.renderer.info.autoReset = false;
    }

    setupScene() {
        this.scene = new THREE.Scene();
        
        // Environment setup
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);
        
        // Environment lighting
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        const envTexture = pmremGenerator.fromScene(new THREE.Scene(), 0.04).texture;
        this.scene.environment = envTexture;
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 25;
        this.controls.maxPolarAngle = Math.PI / 2.2;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
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
        mainLight.shadow.bias = -0.0001;
        this.scene.add(mainLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffeaa7, 0.3);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);
        
        // Rim light
        const rimLight = new THREE.DirectionalLight(0x74b9ff, 0.2);
        rimLight.position.set(0, 5, -15);
        this.scene.add(rimLight);
    }

    setupPostProcessing() {
        // Post-processing effects can be added here
        // Example: Bloom, SSAO, etc.
    }

    async loadModels() {
        // Load and create all 3D models
        await Promise.all([
            this.createBalloons(),
            this.createCake(),
            this.createEnvironment(),
            this.createParticles()
        ]);
    }

    async createBalloons() {
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
                floatSpeed: 0.5 + Math.random() * 0.5
            };
            
            this.scene.add(balloon);
            this.objects.balloons.push(balloon);
        }
    }

    async createCake() {
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

    async createEnvironment() {
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
        
        // Decorative elements
        this.createDecorations();
    }

    createDecorations() {
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

    async createParticles() {
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

    setupInteractionHandlers() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        this.canvas.addEventListener('click', (event) => {
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
        
        // Trigger interaction callback
        this.triggerInteraction('balloonPop', {
            position: balloon.position.clone(),
            id: balloon.userData.id
        });
        
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
        
        // Trigger interaction callback
        this.triggerInteraction('candleBlow', {
            candleId: flame.userData.id
        });
        
        // Animate flame extinguishing
        gsap.to(flame.material, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    startRenderLoop() {
        const animate = () => {
            if (!this.isAnimating) return;
            
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
        
        // Update animations
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
        this.objects.balloons.forEach(balloon => {
            if (balloon.userData.popped) return;
            
            // Floating animation
            const time = this.clock.elapsedTime;
            const floatSpeed = balloon.userData.floatSpeed;
            balloon.position.y = balloon.userData.originalY + 
                Math.sin(time * floatSpeed) * 0.3;
            
            // Subtle rotation
            balloon.rotation.y += deltaTime * 0.2;
            balloon.rotation.z = Math.sin(time * floatSpeed * 0.5) * 0.1;
        });
    }

    updateCandles(deltaTime) {
        this.objects.candles.forEach(({ flame }) => {
            if (!flame.userData.lit) return;
            
            // Flickering effect
            const time = this.clock.elapsedTime;
            const flicker = Math.sin(time * 10 + flame.userData.id) * 0.1 + 0.9;
            flame.material.opacity = flame.userData.originalIntensity * flicker;
            
            // Slight movement
            flame.rotation.y += deltaTime * 2;
        });
    }

    updateParticles(deltaTime) {
        this.objects.particles.forEach(particle => {
            if (!particle.userData.active) return;
            
            // Update position
            particle.position.add(
                particle.userData.velocity.clone().multiplyScalar(deltaTime)
            );
            
            // Apply gravity
            particle.userData.velocity.y -= 9.8 * deltaTime * 0.1;
            
            // Rotation
            particle.rotation.z += particle.userData.rotationSpeed;
            
            // Fade out over time
            particle.material.opacity -= deltaTime * 0.5;
            
            // Reset if too low or faded
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
        
        // Reset renderer info for next frame
        this.renderer.info.reset();
    }

    onInteraction(callback) {
        this.interactionCallbacks.push(callback);
    }

    triggerInteraction(type, data) {
        this.interactionCallbacks.forEach(callback => {
            callback(type, data);
        });
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    dispose() {
        this.isAnimating = false;
        
        // Dispose of geometries, materials, textures
        this.scene.traverse((child) => {
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
        this.renderer.dispose();
    }
}
