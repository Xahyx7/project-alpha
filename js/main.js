// Professional Birthday Application - Final Updated Version
class BirthdayApp {
    constructor() {
        this.sceneManager = null;
        this.audioManager = null;
        this.clock = new THREE.Clock();
        
        this.currentScene = 'intro';
        this.isLoaded = false;
        this.audioEnabled = true;
        this.isFullscreen = false;
        
        // Enhanced loading progress tracking
        this.loadingSteps = [
            { progress: 10, text: 'Checking browser compatibility...' },
            { progress: 25, text: 'Initializing WebGL renderer...' },
            { progress: 40, text: 'Setting up 3D environment...' },
            { progress: 55, text: 'Creating birthday cake and balloons...' },
            { progress: 70, text: 'Adding magical particles and stars...' },
            { progress: 85, text: 'Preparing audio system...' },
            { progress: 95, text: 'Finalizing celebration setup...' },
            { progress: 100, text: 'Welcome to Aafia\'s Birthday!' }
        ];
        
        this.currentStep = 0;
        this.initTimeout = null;
        
        this.init();
    }

    async init() {
        try {
            console.log('BirthdayApp: Starting enhanced initialization...');
            
            // Set initialization timeout
            this.initTimeout = setTimeout(() => {
                this.showError('Initialization took too long. Please refresh the page.');
            }, 30000);
            
            // Check browser compatibility first
            await this.checkCompatibility();
            
            // Show loading screen and start initialization
            await this.simulateLoading();
            await this.initializeSystems();
            this.setupEventListeners();
            this.startExperience();
            
            // Clear timeout
            if (this.initTimeout) {
                clearTimeout(this.initTimeout);
                this.initTimeout = null;
            }
            
        } catch (error) {
            console.error('BirthdayApp: Initialization failed:', error);
            this.showError(`Failed to load: ${error.message}`);
            
            if (this.initTimeout) {
                clearTimeout(this.initTimeout);
                this.initTimeout = null;
            }
        }
    }

    async checkCompatibility() {
        // Check for WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            throw new Error('WebGL is not supported by your browser. Please update your browser or enable hardware acceleration.');
        }
        
        // Check for required libraries
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js library failed to load. Please check your internet connection and refresh the page.');
        }
        
        if (typeof gsap === 'undefined') {
            console.warn('GSAP library not loaded - animations may be limited');
        }
        
        // Check for canvas element
        const birthdayCanvas = document.getElementById('birthday-canvas');
        if (!birthdayCanvas) {
            throw new Error('Required canvas element not found. Please refresh the page.');
        }
        
        // Check WebGL context on actual canvas
        const testContext = birthdayCanvas.getContext('webgl') || birthdayCanvas.getContext('experimental-webgl');
        if (!testContext) {
            throw new Error('Unable to initialize WebGL context. Please enable hardware acceleration in your browser settings.');
        }
        
        // Check for minimum WebGL capabilities
        const maxTextureSize = testContext.getParameter(testContext.MAX_TEXTURE_SIZE);
        if (maxTextureSize < 1024) {
            console.warn('Limited WebGL capabilities detected - some features may be reduced');
        }
        
        console.log('BirthdayApp: Compatibility check passed');
        console.log(`WebGL max texture size: ${maxTextureSize}`);
    }

    async simulateLoading() {
        for (let i = 0; i < this.loadingSteps.length; i++) {
            const step = this.loadingSteps[i];
            this.updateLoadingProgress(step.progress, step.text);
            this.currentStep = i;
            
            // Add realistic delays with some processing
            let delay = 800;
            if (i === 0) delay = 600;      // Compatibility check
            else if (i === 1) delay = 1200; // WebGL setup
            else if (i === 3) delay = 1500; // 3D model creation
            else if (i === 4) delay = 1000; // Particles
            else if (i === this.loadingSteps.length - 1) delay = 500; // Final step
            
            await this.delay(delay);
            
            // Simulate some actual work
            if (i === 1) {
                // Test WebGL capabilities during "Initializing WebGL renderer" step
                this.testWebGLFeatures();
            }
        }
    }

    testWebGLFeatures() {
        try {
            const canvas = document.getElementById('birthday-canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                // Test basic WebGL functionality
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                
                // Log WebGL info for debugging
                console.log('WebGL Vendor:', gl.getParameter(gl.VENDOR));
                console.log('WebGL Renderer:', gl.getParameter(gl.RENDERER));
                console.log('WebGL Version:', gl.getParameter(gl.VERSION));
            }
        } catch (error) {
            console.warn('WebGL feature test failed:', error);
        }
    }

    async initializeSystems() {
        const canvas = document.getElementById('birthday-canvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        
        try {
            // Initialize SceneManager
            this.updateLoadingProgress(60, 'Creating 3D scene...');
            this.sceneManager = new BirthdaySceneManager(canvas);
            await this.sceneManager.init();
            
            // Initialize Audio System
            this.updateLoadingProgress(80, 'Setting up audio...');
            this.audioManager = new BirthdayAudioManager();
            await this.audioManager.init();
            
            // Setup interaction callbacks
            this.sceneManager.onInteraction((type, data) => {
                this.handleInteraction(type, data);
            });
            
            console.log('BirthdayApp: All systems initialized successfully');
            
        } catch (error) {
            console.error('System initialization error:', error);
            throw new Error(`Failed to initialize 3D scene: ${error.message}`);
        }
    }

    setupEventListeners() {
        try {
            // Scene navigation buttons
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const scene = e.target.dataset.scene;
                    if (scene) {
                        this.switchScene(scene);
                    }
                });
            });

            // Control buttons
            this.setupControlButtons();
            
            // Window events
            window.addEventListener('resize', () => {
                this.handleResize();
            });
            
            // Fullscreen events
            document.addEventListener('fullscreenchange', () => {
                this.handleFullscreenChange();
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                this.handleKeyboard(e);
            });
            
            // Prevent context menu on canvas
            const canvas = document.getElementById('birthday-canvas');
            if (canvas) {
                canvas.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                });
                
                // Handle canvas focus for keyboard events
                canvas.addEventListener('click', () => {
                    canvas.focus();
                });
                
                canvas.setAttribute('tabindex', '0');
            }
            
            // Handle page visibility changes
            document.addEventListener('visibilitychange', () => {
                this.handleVisibilityChange();
            });
            
            console.log('BirthdayApp: Event listeners set up successfully');
            
        } catch (error) {
            console.error('Event listener setup failed:', error);
        }
    }

    setupControlButtons() {
        // Audio toggle
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => {
                this.toggleAudio();
            });
            
            audioToggle.setAttribute('title', 'Toggle Audio (M)');
        }

        // Fullscreen toggle
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('click', () => {
                this.toggleFullscreen();
            });
            
            fullscreenToggle.setAttribute('title', 'Toggle Fullscreen (F)');
        }

        // Help toggle
        const helpToggle = document.getElementById('help-toggle');
        const helpPanel = document.getElementById('help-panel');
        if (helpToggle && helpPanel) {
            helpToggle.addEventListener('click', () => {
                helpPanel.classList.toggle('hidden');
            });
            
            helpToggle.setAttribute('title', 'Show Help (H)');
            
            // Close help when clicking outside
            document.addEventListener('click', (e) => {
                if (!helpPanel.contains(e.target) && 
                    !helpToggle.contains(e.target) && 
                    !helpPanel.classList.contains('hidden')) {
                    helpPanel.classList.add('hidden');
                }
            });
            
            // Close help with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !helpPanel.classList.contains('hidden')) {
                    helpPanel.classList.add('hidden');
                }
            });
        }

        // Error retry button
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.retryInitialization();
            });
        }
    }

    handleKeyboard(event) {
        // Don't interfere if user is typing in an input
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.triggerConfettiExplosion();
                break;
                
            case 'KeyF':
                event.preventDefault();
                this.toggleFullscreen();
                break;
                
            case 'KeyM':
                event.preventDefault();
                this.toggleAudio();
                break;
                
            case 'KeyH':
                event.preventDefault();
                const helpPanel = document.getElementById('help-panel');
                if (helpPanel) {
                    helpPanel.classList.toggle('hidden');
                }
                break;
                
            case 'KeyR':
                if (event.ctrlKey || event.metaKey) {
                    // Allow browser refresh
                    return;
                }
                event.preventDefault();
                this.resetScene();
                break;
                
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
                event.preventDefault();
                const sceneIndex = parseInt(event.code.slice(-1)) - 1;
                const scenes = ['intro', 'reveal', 'celebration', 'message', 'finale'];
                if (scenes[sceneIndex]) {
                    this.switchScene(scenes[sceneIndex]);
                }
                break;
                
            case 'KeyC':
                if (event.ctrlKey || event.metaKey) {
                    // Allow copy
                    return;
                }
                event.preventDefault();
                this.switchScene('celebration');
                break;
                
            case 'Escape':
                // Handle escape key for various panels
                const openPanels = document.querySelectorAll('.help-panel:not(.hidden)');
                openPanels.forEach(panel => panel.classList.add('hidden'));
                
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            if (this.sceneManager && this.sceneManager.pauseAnimations) {
                this.sceneManager.pauseAnimations();
            }
            if (this.audioManager && this.audioManager.pause) {
                this.audioManager.pause();
            }
        } else {
            // Resume animations when tab becomes visible
            if (this.sceneManager && this.sceneManager.resumeAnimations) {
                this.sceneManager.resumeAnimations();
            }
            if (this.audioManager && this.audioManager.resume) {
                this.audioManager.resume();
            }
        }
    }

    handleFullscreenChange() {
        this.isFullscreen = !!document.fullscreenElement;
        
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        if (fullscreenToggle) {
            const icon = fullscreenToggle.querySelector('.icon');
            if (icon) {
                icon.textContent = this.isFullscreen ? '⊟' : '⛶';
            }
            
            fullscreenToggle.setAttribute('title', 
                this.isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'
            );
        }
    }

    async switchScene(sceneName) {
        if (this.currentScene === sceneName || !this.isLoaded) return;
        
        console.log(`BirthdayApp: Switching to scene: ${sceneName}`);
        
        try {
            // Update navigation buttons with smooth transition
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                const isActive = btn.dataset.scene === sceneName;
                btn.classList.toggle('active', isActive);
                
                if (isActive) {
                    btn.style.transform = 'translateY(-2px) scale(1.05)';
                    setTimeout(() => {
                        btn.style.transform = '';
                    }, 200);
                }
            });
            
            // Update scene title with animation
            await this.updateSceneTitle(sceneName);
            
            // Trigger scene-specific effects
            this.triggerSceneEffects(sceneName);
            
            // Update scene manager
            if (this.sceneManager && this.sceneManager.transitionToScene) {
                await this.sceneManager.transitionToScene(sceneName);
            }
            
            this.currentScene = sceneName;
            
        } catch (error) {
            console.error('Scene transition failed:', error);
        }
    }

    async updateSceneTitle(sceneName) {
        const sceneTitle = document.getElementById('scene-title');
        if (!sceneTitle) return;
        
        const titles = {
            intro: {
                title: 'Welcome to Aafia\'s Birthday',
                subtitle: 'An immersive 3D celebration experience'
            },
            reveal: {
                title: 'The Grand Reveal',
                subtitle: 'Watch the magical birthday cake appear'
            },
            celebration: {
                title: 'Let\'s Celebrate!',
                subtitle: 'Pop balloons and blow out candles'
            },
            message: {
                title: 'Special Birthday Message',
                subtitle: 'Heartfelt wishes for Aafia'
            },
            finale: {
                title: 'Grand Finale',
                subtitle: 'Fireworks and confetti spectacular'
            }
        };
        
        const sceneData = titles[sceneName] || titles.intro;
        const titleElement = sceneTitle.querySelector('h1');
        const subtitleElement = sceneTitle.querySelector('p');
        
        // Animate title change if GSAP is available
        if (typeof gsap !== 'undefined' && titleElement && subtitleElement) {
            // Fade out
            gsap.to([titleElement, subtitleElement], {
                opacity: 0,
                y: 20,
                duration: 0.3,
                onComplete: () => {
                    titleElement.textContent = sceneData.title;
                    subtitleElement.textContent = sceneData.subtitle;
                    
                    // Fade in
                    gsap.to([titleElement, subtitleElement], {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        stagger: 0.1
                    });
                }
            });
        } else {
            // Fallback without animation
            if (titleElement) titleElement.textContent = sceneData.title;
            if (subtitleElement) subtitleElement.textContent = sceneData.subtitle;
        }
    }

    triggerSceneEffects(sceneName) {
        switch (sceneName) {
            case 'intro':
                this.audioManager?.playBackgroundMusic('intro');
                this.resetCameraPosition();
                break;
                
            case 'reveal':
                this.audioManager?.playSound('reveal');
                if (this.sceneManager?.focusOnCake) {
                    this.sceneManager.focusOnCake();
                }
                this.audioManager?.playBackgroundMusic('gentle');
                break;
                
            case 'celebration':
                setTimeout(() => {
                    this.triggerConfettiExplosion();
                }, 500);
                this.audioManager?.playBackgroundMusic('party');
                break;
                
            case 'message':
                this.audioManager?.playBackgroundMusic('gentle');
                if (this.sceneManager?.highlightText) {
                    this.sceneManager.highlightText();
                }
                this.createHeartParticles();
                break;
                
            case 'finale':
                setTimeout(() => {
                    this.triggerFireworks();
                }, 800);
                this.audioManager?.playBackgroundMusic('finale');
                break;
        }
    }

    resetCameraPosition() {
        if (this.sceneManager?.resetCamera) {
            this.sceneManager.resetCamera();
        }
    }

    createHeartParticles() {
        if (this.sceneManager?.createHeartParticles) {
            this.sceneManager.createHeartParticles();
        }
    }

    triggerConfettiExplosion() {
        if (this.sceneManager?.triggerConfettiExplosion) {
            this.sceneManager.triggerConfettiExplosion();
        }
        this.audioManager?.playSound('confetti');
        
        // Add screen shake effect
        this.addScreenShake();
    }

    triggerFireworks() {
        if (this.sceneManager?.triggerFireworks) {
            this.sceneManager.triggerFireworks();
        }
        this.audioManager?.playSound('fireworks');
        
        // Add multiple screen shake effects
        setTimeout(() => this.addScreenShake(), 0);
        setTimeout(() => this.addScreenShake(), 800);
        setTimeout(() => this.addScreenShake(), 1600);
    }

    addScreenShake() {
        const canvas = document.getElementById('birthday-canvas');
        if (canvas && typeof gsap !== 'undefined') {
            gsap.to(canvas, {
                x: 5,
                duration: 0.1,
                yoyo: true,
                repeat: 5,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(canvas, { x: 0 });
                }
            });
        }
    }

    resetScene() {
        console.log('BirthdayApp: Resetting scene...');
        
        // Reset to intro scene
        this.switchScene('intro');
        
        // Reset all balloons and candles
        if (this.sceneManager?.resetAllObjects) {
            this.sceneManager.resetAllObjects();
        }
        
        // Reset camera
        this.resetCameraPosition();
        
        // Play reset sound
        this.audioManager?.playSound('reset');
    }

    handleInteraction(type, data) {
        console.log(`BirthdayApp: Interaction - ${type}`, data);
        
        try {
            switch (type) {
                case 'balloonPop':
                    this.audioManager?.playSound('pop');
                    this.createPopEffect(data.position);
                    this.updatePopCount();
                    break;
                    
                case 'candleBlow':
                    this.audioManager?.playSound('blow');
                    this.createBlowEffect(data.candleId);
                    this.updateCandleCount();
                    break;
                    
                case 'cakeClick':
                    this.audioManager?.playSound('slice');
                    this.createCakeEffect();
                    break;
                    
                case 'starClick':
                    this.audioManager?.playSound('twinkle');
                    this.createStarEffect(data.position);
                    break;
            }
        } catch (error) {
            console.error('Interaction handler error:', error);
        }
    }

    updatePopCount() {
        // Could track balloon pops for achievements
        if (!this.stats) this.stats = { balloons: 0, candles: 0 };
        this.stats.balloons++;
        
        if (this.stats.balloons === 10) {
            this.audioManager?.playSound('achievement');
            this.showAchievement('Balloon Master!');
        }
    }

    updateCandleCount() {
        // Could track candle blows
        if (!this.stats) this.stats = { balloons: 0, candles: 0 };
        this.stats.candles++;
        
        if (this.stats.candles === 12) {
            this.audioManager?.playSound('achievement');
            this.showAchievement('All Candles Blown!');
        }
    }

    showAchievement(text) {
        // Create achievement popup
        const achievement = document.createElement('div');
        achievement.className = 'achievement-popup';
        achievement.textContent = text;
        achievement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #FFD700, #FF69B4);
            color: white;
            padding: 20px 40px;
            border-radius: 25px;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            pointer-events: none;
            opacity: 0;
        `;
        
        document.body.appendChild(achievement);
        
        // Animate achievement
        if (typeof gsap !== 'undefined') {
            gsap.to(achievement, {
                opacity: 1,
                scale: 1.1,
                duration: 0.5,
                ease: 'back.out(1.7)',
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to(achievement, {
                            opacity: 0,
                            y: -50,
                            duration: 0.5,
                            onComplete: () => {
                                document.body.removeChild(achievement);
                            }
                        });
                    }, 2000);
                }
            });
        }
    }

    createPopEffect(position) {
        if (this.sceneManager?.createParticleBurst) {
            this.sceneManager.createParticleBurst(position);
        }
    }

    createBlowEffect(candleId) {
        console.log(`Candle ${candleId} blown out with special effect`);
        
        // Create smoke effect at candle position
        if (this.sceneManager?.createSmokeEffect) {
            this.sceneManager.createSmokeEffect(candleId);
        }
    }

    createCakeEffect() {
        if (this.sceneManager?.createCakeSparkles) {
            this.sceneManager.createCakeSparkles();
        }
    }

    createStarEffect(position) {
        if (this.sceneManager?.createTwinkleEffect) {
            this.sceneManager.createTwinkleEffect(position);
        }
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        
        try {
            if (this.audioManager) {
                if (this.audioEnabled) {
                    this.audioManager.unmute();
                } else {
                    this.audioManager.mute();
                }
            }
            
            // Update button icon with animation
            const audioToggle = document.getElementById('audio-toggle');
            if (audioToggle) {
                const icon = audioToggle.querySelector('.icon');
                if (icon) {
                    icon.textContent = this.audioEnabled ? '🔊' : '🔇';
                    
                    // Add visual feedback
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(icon, 
                            { scale: 1.3 }, 
                            { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
                        );
                    }
                }
                
                audioToggle.setAttribute('title', 
                    this.audioEnabled ? 'Mute Audio (M)' : 'Unmute Audio (M)'
                );
            }
            
            // Play toggle sound
            if (this.audioEnabled) {
                setTimeout(() => {
                    this.audioManager?.playSound('unmute');
                }, 100);
            }
            
            console.log(`BirthdayApp: Audio ${this.audioEnabled ? 'enabled' : 'disabled'}`);
            
        } catch (error) {
            console.error('Audio toggle failed:', error);
        }
    }

    toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            
        } catch (error) {
            console.warn('Fullscreen not supported:', error);
            this.showTemporaryMessage('Fullscreen not supported on this device');
        }
    }

    showTemporaryMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(msgDiv);
        
        setTimeout(() => {
            if (msgDiv.parentNode) {
                msgDiv.parentNode.removeChild(msgDiv);
            }
        }, 3000);
    }

    handleResize() {
        if (this.sceneManager?.handleResize) {
            this.sceneManager.handleResize();
        }
        
        console.log(`BirthdayApp: Resized to ${window.innerWidth}x${window.innerHeight}`);
    }

    retryInitialization() {
        console.log('BirthdayApp: Retrying initialization...');
        
        // Hide error container
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }
        
        // Show loading container
        const loadingContainer = document.getElementById('loading-container');
        if (loadingContainer) {
            loadingContainer.style.display = 'flex';
            loadingContainer.classList.remove('fade-out');
        }
        
        // Reset progress
        this.updateLoadingProgress(0, 'Retrying initialization...');
        
        // Clear existing managers
        if (this.sceneManager?.dispose) {
            this.sceneManager.dispose();
        }
        if (this.audioManager?.dispose) {
            this.audioManager.dispose();
        }
        
        this.sceneManager = null;
        this.audioManager = null;
        this.isLoaded = false;
        this.currentStep = 0;
        
        // Retry after short delay
        setTimeout(() => {
            this.init();
        }, 1000);
    }

    startExperience() {
        this.hideLoadingScreen();
        
        // Start background music with user interaction check
        const startMusic = () => {
            if (this.audioManager && this.audioEnabled) {
                setTimeout(() => {
                    this.audioManager.playBackgroundMusic('intro');
                }, 1000);
            }
        };
        
        // Start music immediately if possible, or wait for user interaction
        try {
            startMusic();
        } catch (error) {
            console.log('Waiting for user interaction to start audio...');
            const startAudioOnClick = () => {
                startMusic();
                document.removeEventListener('click', startAudioOnClick);
                document.removeEventListener('keydown', startAudioOnClick);
                document.removeEventListener('touchstart', startAudioOnClick);
            };
            
            document.addEventListener('click', startAudioOnClick);
            document.addEventListener('keydown', startAudioOnClick);
            document.addEventListener('touchstart', startAudioOnClick);
        }
        
        this.isLoaded = true;
        console.log('BirthdayApp: Experience started successfully!');
        
        // Show welcome message
        this.showTemporaryMessage('Use keyboard shortcuts: Space for confetti, F for fullscreen, H for help');
    }

    hideLoadingScreen() {
        const loadingContainer = document.getElementById('loading-container');
        const appContainer = document.getElementById('app-container');
        
        if (loadingContainer) {
            loadingContainer.classList.add('fade-out');
            
            setTimeout(() => {
                loadingContainer.style.display = 'none';
                if (appContainer) {
                    appContainer.style.display = 'block';
                    appContainer.classList.add('fade-in-up', 'loaded');
                }
            }, 800);
        } else if (appContainer) {
            // Fallback if loading container is missing
            appContainer.style.display = 'block';
            appContainer.classList.add('loaded');
        }
    }

    updateLoadingProgress(percentage, text) {
        const progressFill = document.getElementById('progress-fill');
        const loadingText = document.getElementById('loading-text');
        const loadingPercentage = document.getElementById('loading-percentage');
        
        if (progressFill) {
            progressFill.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        }
        if (loadingText) {
            loadingText.textContent = text || 'Loading...';
        }
        if (loadingPercentage) {
            loadingPercentage.textContent = `${Math.round(percentage)}%`;
        }
        
        console.log(`Loading: ${percentage}% - ${text}`);
    }

    showError(message) {
        console.error('BirthdayApp Error:', message);
        
        const loadingContainer = document.getElementById('loading-container');
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        
        if (errorContainer) {
            errorContainer.classList.remove('hidden');
            if (errorMessage) {
                errorMessage.textContent = message;
            }
        }
        
        // Also update loading screen as fallback
        this.updateLoadingProgress(0, `Error: ${message}`);
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a52)';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
    }

    // Enhanced cleanup method
    dispose() {
        console.log('BirthdayApp: Disposing...');
        
        // Clear timeouts
        if (this.initTimeout) {
            clearTimeout(this.initTimeout);
            this.initTimeout = null;
        }
        
        // Dispose managers
        if (this.sceneManager?.dispose) {
            this.sceneManager.dispose();
        }
        
        if (this.audioManager?.dispose) {
            this.audioManager.dispose();
        }
        
        // Remove event listeners
        const events = [
            ['resize', this.handleResize],
            ['keydown', this.handleKeyboard],
            ['visibilitychange', this.handleVisibilityChange],
            ['fullscreenchange', this.handleFullscreenChange]
        ];
        
        events.forEach(([event, handler]) => {
            try {
                window.removeEventListener(event, handler);
                document.removeEventListener(event, handler);
            } catch (error) {
                // Ignore removal errors
            }
        });
        
        // Clear references
        this.sceneManager = null;
        this.audioManager = null;
        this.isLoaded = false;
        
        console.log('BirthdayApp: Disposal complete');
    }
}

// Enhanced Scene Manager Class
class BirthdaySceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        
        this.objects = {
            balloons: [],
            cake: null,
            candles: [],
            particles: [],
            stars: [],
            hearts: []
        };
        
        this.interactionCallbacks = [];
        this.isAnimating = true;
        this.isPaused = false;
        
        // Performance monitoring
        this.lastTime = performance.now();
        this.frameCount = 0;
    }

    async init() {
        try {
            this.setupRenderer();
            this.setupScene();
            this.setupCamera();
            this.setupControls();
            this.setupLighting();
            
            await this.createObjects();
            
            this.startRenderLoop();
            this.setupInteractionHandlers();
            
            return true;
        } catch (error) {
            console.error('SceneManager init failed:', error);
            throw error;
        }
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
            stencil: false
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Performance settings
        this.renderer.info.autoReset = false;
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 30, 150);
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Store initial camera position
        this.initialCameraPosition = this.camera.position.clone();
    }

    setupControls() {
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.canvas);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
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
        }
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(12, 20, 8);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -25;
        mainLight.shadow.camera.right = 25;
        mainLight.shadow.camera.top = 25;
        mainLight.shadow.camera.bottom = -25;
        mainLight.shadow.bias = -0.0001;
        this.scene.add(mainLight);
        
        // Fill lights
        const fillLight = new THREE.DirectionalLight(0xffeaa7, 0.4);
        fillLight.position.set(-12, 8, -8);
        this.scene.add(fillLight);
        
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
    }

    async createObjects() {
        // Ground with subtle animation
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshLambertMaterial({ 
                color: 0x2c3e50, 
                transparent: true, 
                opacity: 0.3 
            })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Create all objects
        await Promise.all([
            this.createBalloons(),
            this.createCake(),
            this.createFloatingText(),
            this.createParticles(),
            this.createStars(),
            this.createHeartParticles()
        ]);
    }

    async createBalloons() {
        const balloonGeometry = new THREE.SphereGeometry(0.35, 32, 32);
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0xff9f43, 0x6c5ce7, 0xa29bfe];
        
        for (let i = 0; i < 30; i++) {
            const material = new THREE.MeshPhysicalMaterial({
                color: colors[i % colors.length],
                metalness: 0.1,
                roughness: 0.15,
                clearcoat: 1,
                clearcoatRoughness: 0.05,
                transmission: 0.1,
                thickness: 0.5,
                ior: 1.4
            });
            
            const balloon = new THREE.Mesh(balloonGeometry, material);
            
            // Better distribution
            const angle = (i / 30) * Math.PI * 2;
            const radius = 6 + Math.random() * 12;
            balloon.position.set(
                Math.cos(angle) * radius + (Math.random() - 0.5) * 3,
                Math.random() * 8 + 2,
                Math.sin(angle) * radius + (Math.random() - 0.5) * 3
            );
            
            balloon.castShadow = true;
            balloon.receiveShadow = true;
            balloon.userData = { 
                type: 'balloon', 
                id: i,
                originalY: balloon.position.y,
                floatSpeed: 0.3 + Math.random() * 0.4,
                bobAmount: 0.2 + Math.random() * 0.3,
                popped: false
            };
            
            // Add balloon string
            const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2, 8);
            const stringMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            
            const string = new THREE.Mesh(stringGeometry, stringMaterial);
            string.position.set(0, -1, 0);
            balloon.add(string);
            
            this.scene.add(balloon);
            this.objects.balloons.push(balloon);
        }
    }

    async createCake() {
        const cakeGroup = new THREE.Group();
        
        // Create tiers with enhanced details
        const tiers = [
            { radius: 2.2, height: 1.0, color: 0xffb3ba, decorColor: 0xff69b4 },
            { radius: 1.6, height: 0.8, color: 0xffdfba, decorColor: 0xffd700 },
            { radius: 1.1, height: 0.6, color: 0xffffba, decorColor: 0x98fb98 }
        ];
        
        let yOffset = 0;
        tiers.forEach((tier, index) => {
            // Main tier
            const tierMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(tier.radius, tier.radius, tier.height, 64),
                new THREE.MeshPhysicalMaterial({
                    color: tier.color,
                    metalness: 0.05,
                    roughness: 0.2,
                    clearcoat: 0.9,
                    clearcoatRoughness: 0.1
                })
            );
            tierMesh.position.y = yOffset + tier.height / 2;
            tierMesh.castShadow = true;
            tierMesh.receiveShadow = true;
            cakeGroup.add(tierMesh);
            
            // Add decorative roses
            const roseCount = Math.floor(tier.radius * 4);
            for (let i = 0; i < roseCount; i++) {
                const angle = (i / roseCount) * Math.PI * 2;
                const rose = new THREE.Mesh(
                    new THREE.SphereGeometry(0.08, 16, 16),
                    new THREE.MeshPhysicalMaterial({
                        color: tier.decorColor,
                        metalness: 0,
                        roughness: 0.3
                    })
                );
                rose.position.set(
                    Math.cos(angle) * tier.radius,
                    yOffset + tier.height,
                    Math.sin(angle) * tier.radius
                );
                rose.castShadow = true;
                cakeGroup.add(rose);
            }
            
            yOffset += tier.height;
        });
        
        // Add candles
        this.createCandles(cakeGroup, tiers[2].radius, yOffset);
        
        cakeGroup.position.y = -1.5;
        cakeGroup.userData = { type: 'cake' };
        this.scene.add(cakeGroup);
        this.objects.cake = cakeGroup;
    }

    createCandles(parent, radius, height) {
        const candleCount = 16;
        
        for (let i = 0; i < candleCount; i++) {
            const angle = (i / candleCount) * Math.PI * 2;
            const candleRadius = radius * 0.75;
            const x = Math.cos(angle) * candleRadius;
            const z = Math.sin(angle) * candleRadius;
            
            // Candle
            const candle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.04, 0.04, 0.5, 16),
                new THREE.MeshPhysicalMaterial({
                    color: 0xfff8dc,
                    metalness: 0.1,
                    roughness: 0.3
                })
            );
            candle.position.set(x, height + 0.25, z);
            candle.castShadow = true;
            parent.add(candle);
            
            // Enhanced flame
            const flame = new THREE.Mesh(
                new THREE.ConeGeometry(0.06, 0.2, 8),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.08, 1, 0.6),
                    transparent: true,
                    opacity: 0.8
                })
            );
            flame.position.set(0, 0.3, 0);
            flame.userData = { 
                type: 'flame', 
                id: i,
                lit: true,
                originalIntensity: 0.8
            };
            
            // Add point light for each flame
            const flameLight = new THREE.PointLight(0xff6600, 0.3, 3);
            flameLight.position.copy(flame.position);
            flame.add(flameLight);
            
            candle.add(flame);
            this.objects.candles.push({ candle, flame, light: flameLight });
        }
    }

    async createFloatingText() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            // Create gradient text
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#ff69b4');
            gradient.addColorStop(0.3, '#ffd700');
            gradient.addColorStop(0.6, '#00ced1');
            gradient.addColorStop(1, '#98fb98');
            
            ctx.font = "bold 120px Arial";
            ctx.fillStyle = gradient;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 20;
            ctx.fillText("Happy Birthday Aafia!", canvas.width/2, canvas.height/2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const sprite = new THREE.Sprite(
                new THREE.SpriteMaterial({ 
                    map: texture, 
                    transparent: true,
                    alphaTest: 0.1
                })
            );
            
            sprite.position.set(0, 7, 0);
            sprite.scale.set(12, 3, 1);
            sprite.userData = { type: 'text' };
            
            this.scene.add(sprite);
            this.objects.text = sprite;
            
            // Animate the text
            if (typeof gsap !== 'undefined') {
                gsap.to(sprite.scale, {
                    x: 13, y: 3.3,
                    duration: 3,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1
                });
            }
            
        } catch (error) {
            console.warn('Text creation failed:', error);
        }
    }

    async createParticles() {
        const confettiGeometry = new THREE.PlaneGeometry(0.15, 0.1);
        const colors = [0xff6b9d, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0xff9f43, 0x6c5ce7];
        
        for (let i = 0; i < 150; i++) {
            const confetti = new THREE.Mesh(
                confettiGeometry,
                new THREE.MeshBasicMaterial({
                    color: colors[i % colors.length],
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0
                })
            );
            
            confetti.position.set(
                (Math.random() - 0.5) * 30,
                Math.random() * 15 + 15,
                (Math.random() - 0.5) * 30
            );
            
            confetti.userData = {
                type: 'confetti',
                velocity: new THREE.Vector3(0, -2, 0),
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
    }

    async createStars() {
        const starGeometry = new THREE.SphereGeometry(0.08, 12, 12);
        
        for (let i = 0; i < 80; i++) {
            const star = new THREE.Mesh(
                starGeometry,
                new THREE.MeshBasicMaterial({ 
                    color: new THREE.Color().setHSL(Math.random(), 0.5, 0.8),
                    transparent: true,
                    opacity: 0.7
                })
            );
            
            star.position.set(
                (Math.random() - 0.5) * 100,
                Math.random() * 30 + 10,
                (Math.random() - 0.5) * 100
            );
            
            star.userData = { 
                type: 'star',
                twinkleSpeed: Math.random() * 2 + 1,
                originalIntensity: star.material.opacity
            };
            
            this.scene.add(star);
            this.objects.stars.push(star);
        }
    }

    async createHeartParticles() {
        const heartShape = new THREE.Shape();
        heartShape.moveTo(25, 25);
        heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
        heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
        heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
        heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
        heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
        heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);
        
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
            depth: 8,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 1,
            bevelThickness: 1
        });
        
        heartGeometry.scale(0.002, 0.002, 0.002);
        
        for (let i = 0; i < 20; i++) {
            const heart = new THREE.Mesh(
                heartGeometry,
                new THREE.MeshBasicMaterial({
                    color: 0xff69b4,
                    transparent: true,
                    opacity: 0
                })
            );
            
            heart.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 10 + 5,
                (Math.random() - 0.5) * 20
            );
            
            heart.userData = {
                type: 'heart',
                velocity: new THREE.Vector3(0, 0.5, 0),
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                active: false,
                originalPosition: heart.position.clone()
            };
            
            this.scene.add(heart);
            this.objects.hearts.push(heart);
        }
    }

    setupInteractionHandlers() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        const handleClick = (event) => {
            event.preventDefault();
            
            const rect = this.canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            
            if (intersects.length > 0) {
                this.handleClick(intersects[0]);
            }
        };
        
        this.canvas.addEventListener('click', handleClick);
        this.canvas.addEventListener('touchend', (e) => {
            if (e.touches.length === 0 && e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                handleClick({ 
                    clientX: touch.clientX, 
                    clientY: touch.clientY,
                    preventDefault: () => {}
                });
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
            case 'cake':
                this.triggerInteraction('cakeClick', {});
                break;
            case 'star':
                this.triggerInteraction('starClick', { position: object.position.clone() });
                break;
        }
    }

    popBalloon(balloon) {
        if (balloon.userData.popped) return;
        
        balloon.userData.popped = true;
        
        this.triggerInteraction('balloonPop', {
            position: balloon.position.clone(),
            id: balloon.userData.id
        });
        
        // Enhanced pop animation
        if (typeof gsap !== 'undefined') {
            gsap.to(balloon.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.4,
                ease: 'back.in(1.7)',
                onComplete: () => {
                    this.scene.remove(balloon);
                }
            });
        } else {
            // Fallback without GSAP
            const animate = () => {
                balloon.scale.multiplyScalar(0.9);
                if (balloon.scale.x > 0.1) {
                    requestAnimationFrame(animate);
                } else {
                    this.scene.remove(balloon);
                }
            };
            animate();
        }
        
        this.createParticleBurst(balloon.position);
    }

    blowCandle(flame) {
        if (!flame.userData.lit) return;
        
        flame.userData.lit = false;
        
        this.triggerInteraction('candleBlow', {
            candleId: flame.userData.id
        });
        
        // Enhanced blow animation
        if (typeof gsap !== 'undefined') {
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
        } else {
            // Fallback
            const animate = () => {
                flame.material.opacity *= 0.95;
                flame.scale.y *= 0.9;
                if (flame.material.opacity > 0.1) {
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }
        
        this.createSmokeEffect(flame.userData.id);
    }

    startRenderLoop() {
        const animate = () => {
            if (!this.isAnimating) return;
            
            requestAnimationFrame(animate);
            
            if (!this.isPaused) {
                const deltaTime = Math.min(this.clock.getDelta(), 0.033); // Cap at ~30fps
                this.update(deltaTime);
            }
            
            this.render();
            
            // Performance monitoring
            this.frameCount++;
            const currentTime = performance.now();
            if (currentTime - this.lastTime >= 1000) {
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
        };
        
        animate();
    }

    update(deltaTime) {
        if (this.controls) {
            this.controls.update();
        }
        
        const time = this.clock.elapsedTime;
        
        // Update balloons
        this.objects.balloons.forEach(balloon => {
            if (!balloon.userData.popped) {
                const floatSpeed = balloon.userData.floatSpeed;
                const bobAmount = balloon.userData.bobAmount;
                balloon.position.y = balloon.userData.originalY + 
                    Math.sin(time * floatSpeed + balloon.userData.id) * bobAmount;
                
                balloon.rotation.y += deltaTime * 0.2;
                balloon.rotation.z = Math.sin(time * floatSpeed * 0.5 + balloon.userData.id) * 0.08;
                
                const breathe = 1 + Math.sin(time * 2 + balloon.userData.id) * 0.02;
                balloon.scale.setScalar(breathe);
            }
        });
        
        // Update candles
        this.objects.candles.forEach(({ flame, light }) => {
            if (flame.userData.lit) {
                const baseFlicker = Math.sin(time * 15 + flame.userData.id) * 0.1;
                const detailFlicker = Math.sin(time * 25 + flame.userData.id * 2) * 0.05;
                const flicker = 0.85 + baseFlicker + detailFlicker;
                
                flame.material.opacity = flame.userData.originalIntensity * flicker;
                
                const hue = 0.08 + Math.sin(time * 10 + flame.userData.id) * 0.02;
                flame.material.color.setHSL(hue, 1, 0.6);
                
                if (light) {
                    light.intensity = 0.3 * flicker;
                }
                
                flame.rotation.y += deltaTime * 3;
                flame.position.x = Math.sin(time * 8 + flame.userData.id) * 0.02;
            } else if (light) {
                light.intensity = 0;
            }
        });
        
        // Update particles
        this.objects.particles.forEach(particle => {
            if (particle.userData.active) {
                particle.position.add(
                    particle.userData.velocity.clone().multiplyScalar(deltaTime)
                );
                
                particle.userData.velocity.y -= 9.8 * deltaTime * 0.1;
                particle.userData.velocity.multiplyScalar(0.995);
                
                particle.rotation.x += particle.userData.rotationSpeed.x;
                particle.rotation.y += particle.userData.rotationSpeed.y;
                particle.rotation.z += particle.userData.rotationSpeed.z;
                
                particle.material.opacity = Math.max(0, particle.material.opacity - deltaTime * 0.3);
                
                if (particle.position.y < -10 || particle.material.opacity <= 0) {
                    particle.userData.active = false;
                    particle.material.opacity = 0;
                    particle.position.copy(particle.userData.originalPosition);
                }
            }
        });
        
        // Update stars
        this.objects.stars.forEach(star => {
            const twinkle = Math.sin(time * star.userData.twinkleSpeed + star.userData.id) * 0.3 + 0.7;
            star.material.opacity = star.userData.originalIntensity * twinkle;
            
            const hue = (time * 0.1 + star.userData.id * 0.1) % 1;
            star.material.color.setHSL(hue, 0.5, 0.8);
        });
        
        // Update hearts
        this.objects.hearts.forEach(heart => {
            if (heart.userData.active) {
                heart.position.add(
                    heart.userData.velocity.clone().multiplyScalar(deltaTime)
                );
                
                heart.rotation.y += heart.userData.rotationSpeed;
                heart.material.opacity = Math.max(0, heart.material.opacity - deltaTime * 0.2);
                
                if (heart.material.opacity <= 0 || heart.position.y > 15) {
                    heart.userData.active = false;
                    heart.material.opacity = 0;
                    heart.position.copy(heart.userData.originalPosition);
                }
            }
        });
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        
        if (this.renderer) {
            this.renderer.info.reset();
        }
    }

    // Scene transition methods
    async transitionToScene(sceneName) {
        console.log(`SceneManager: Transitioning to ${sceneName}`);
        
        switch (sceneName) {
            case 'celebration':
                this.triggerConfettiExplosion();
                break;
            case 'finale':
                this.triggerFireworks();
                break;
            case 'message':
                this.createHeartParticleShow();
                break;
        }
    }

    triggerConfettiExplosion() {
        let delay = 0;
        this.objects.particles.forEach((particle, index) => {
            if (index % 2 === 0) { // Activate every other particle
                setTimeout(() => {
                    particle.userData.active = true;
                    particle.material.opacity = 1;
                    particle.position.set(
                        (Math.random() - 0.5) * 4,
                        8 + Math.random() * 3,
                        (Math.random() - 0.5) * 4
                    );
                    particle.userData.velocity.set(
                        (Math.random() - 0.5) * 8,
                        Math.random() * 6 + 4,
                        (Math.random() - 0.5) * 8
                    );
                }, delay);
                delay += 30;
            }
        });
    }

    triggerFireworks() {
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

    createHeartParticleShow() {
        this.objects.hearts.forEach((heart, index) => {
            setTimeout(() => {
                heart.userData.active = true;
                heart.material.opacity = 0.8;
                heart.position.set(
                    (Math.random() - 0.5) * 6,
                    Math.random() * 3 + 2,
                    (Math.random() - 0.5) * 6
                );
                heart.userData.velocity.set(0, 0.3 + Math.random() * 0.2, 0);
            }, index * 200);
        });
    }

    createParticleBurst(position) {
        let activatedCount = 0;
        this.objects.particles.forEach(particle => {
            if (particle.userData.active || activatedCount > 20) return;
            
            const distance = particle.position.distanceTo(position);
            if (distance < 8) {
                particle.userData.active = true;
                particle.material.opacity = 1;
                particle.position.copy(position);
                particle.position.add(new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    Math.random() * 2,
                    (Math.random() - 0.5) * 2
                ));
                particle.userData.velocity.set(
                    (Math.random() - 0.5) * 6,
                    Math.random() * 6 + 3,
                    (Math.random() - 0.5) * 6
                );
                activatedCount++;
            }
        });
    }

    createCakeSparkles() {
        const sparkleCount = 25;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = new THREE.Mesh(
                new THREE.SphereGeometry(0.03, 8, 8),
                new THREE.MeshBasicMaterial({ 
                    color: new THREE.Color().setHSL(Math.random(), 1, 0.8)
                })
            );
            
            const angle = (i / sparkleCount) * Math.PI * 2;
            sparkle.position.set(
                Math.cos(angle) * (2 + Math.random()),
                Math.random() * 4,
                Math.sin(angle) * (2 + Math.random())
            );
            
            this.scene.add(sparkle);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(sparkle.position, {
                    y: sparkle.position.y + 3,
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
                
                gsap.to(sparkle.rotation, {
                    y: Math.PI * 4,
                    duration: 2,
                    ease: 'none'
                });
            }
        }
    }

    createSmokeEffect(candleId) {
        const smokeParticles = 8;
        for (let i = 0; i < smokeParticles; i++) {
            const smoke = new THREE.Mesh(
                new THREE.SphereGeometry(0.02, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: 0xdddddd,
                    transparent: true,
                    opacity: 0.6
                })
            );
            
            // Position smoke at the candle location
            const candleData = this.objects.candles[candleId];
            if (candleData) {
                const candleWorldPos = new THREE.Vector3();
                candleData.flame.getWorldPosition(candleWorldPos);
                smoke.position.copy(candleWorldPos);
            }
            
            this.scene.add(smoke);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(smoke.position, {
                    y: smoke.position.y + 2,
                    x: smoke.position.x + (Math.random() - 0.5) * 0.5,
                    z: smoke.position.z + (Math.random() - 0.5) * 0.5,
                    duration: 3,
                    ease: 'power1.out'
                });
                
                gsap.to(smoke.material, {
                    opacity: 0,
                    duration: 3,
                    ease: 'power1.out',
                    onComplete: () => {
                        this.scene.remove(smoke);
                    }
                });
            }
        }
    }

    // Enhanced control methods
    focusOnCake() {
        if (this.controls && typeof gsap !== 'undefined') {
            const targetPosition = new THREE.Vector3(0, 2, 5);
            gsap.to(this.camera.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 2,
                ease: 'power2.inOut'
            });
        }
    }

    highlightText() {
        if (this.objects.text && typeof gsap !== 'undefined') {
            gsap.to(this.objects.text.material, {
                opacity: 1,
                duration: 1,
                yoyo: true,
                repeat: 3
            });
        }
    }

    resetCamera() {
        if (this.camera && this.initialCameraPosition && typeof gsap !== 'undefined') {
            gsap.to(this.camera.position, {
                x: this.initialCameraPosition.x,
                y: this.initialCameraPosition.y,
                z: this.initialCameraPosition.z,
                duration: 2,
                ease: 'power2.inOut'
            });
        }
    }

    resetAllObjects() {
        // Reset balloons
        this.objects.balloons.forEach(balloon => {
            if (balloon.userData.popped) {
                balloon.userData.popped = false;
                balloon.scale.setScalar(1);
                balloon.visible = true;
                if (!balloon.parent) {
                    this.scene.add(balloon);
                }
            }
        });
        
        // Reset candles
        this.objects.candles.forEach(({ flame, light }) => {
            if (!flame.userData.lit) {
                flame.userData.lit = true;
                flame.material.opacity = flame.userData.originalIntensity;
                flame.scale.set(1, 1, 1);
                if (light) {
                    light.intensity = 0.3;
                }
            }
        });
        
        // Reset particles
        this.objects.particles.forEach(particle => {
            particle.userData.active = false;
            particle.material.opacity = 0;
            particle.position.copy(particle.userData.originalPosition);
        });
        
        // Reset hearts
        this.objects.hearts.forEach(heart => {
            heart.userData.active = false;
            heart.material.opacity = 0;
            heart.position.copy(heart.userData.originalPosition);
        });
    }

    pauseAnimations() {
        this.isPaused = true;
        if (this.controls) {
            this.controls.autoRotate = false;
        }
    }

    resumeAnimations() {
        this.isPaused = false;
        if (this.controls) {
            this.controls.autoRotate = true;
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

    dispose() {
        console.log('SceneManager: Disposing...');
        
        this.isAnimating = false;
        
        // Dispose of all objects
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
        this.objects = null;
        
        console.log('SceneManager: Disposal complete');
    }
}

// Enhanced Audio Manager Class
class BirthdayAudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicGain = null;
        this.sfxGain = null;
        this.masterGain = null;
        this.isMuted = false;
        this.currentMusic = null;
        this.musicTracks = {};
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes
            this.masterGain = this.audioContext.createGain();
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();
            
            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);
            
            // Set initial volumes
            this.masterGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
            this.musicGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            this.sfxGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
            
            // Create music tracks
            this.createMusicTracks();
            
            return true;
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            return false;
        }
    }

    createMusicTracks() {
        // Create different background music patterns
        this.musicTracks = {
            intro: this.createMelody([440, 494, 523, 587], 1.5),
            gentle: this.createMelody([330, 370, 415, 440], 2.0),
            party: this.createMelody([523, 587, 659, 698, 784], 1.0),
            finale: this.createMelody([784, 880, 988, 1047], 0.8)
        };
    }

    createMelody(frequencies, noteDuration) {
        return {
            frequencies,
            noteDuration,
            currentNote: 0,
            nextNoteTime: 0
        };
    }

    playSound(type) {
        if (this.isMuted || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.sfxGain);
            
            const now = this.audioContext.currentTime;
            
            switch (type) {
                case 'pop':
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(800, now);
                    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);
                    filter.frequency.setValueAtTime(2000, now);
                    gainNode.gain.setValueAtTime(0.4, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    oscillator.start(now);
                    oscillator.stop(now + 0.2);
                    break;
                    
                case 'blow':
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(150, now);
                    oscillator.frequency.linearRampToValueAtTime(50, now + 0.8);
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(300, now);
                    gainNode.gain.setValueAtTime(0.3, now);
                    gainNode.gain.linearRampToValueAtTime(0, now + 0.8);
                    oscillator.start(now);
                    oscillator.stop(now + 0.8);
                    break;
                    
                case 'slice':
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(400, now);
                    filter.frequency.setValueAtTime(1000, now);
                    gainNode.gain.setValueAtTime(0.3, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                    oscillator.start(now);
                    oscillator.stop(now + 0.15);
                    break;
                    
                case 'confetti':
                    this.playConfettiSound();
                    return;
                    
                case 'fireworks':
                    this.playFireworksSound();
                    return;
                    
                case 'twinkle':
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(2093, now); // High C
                    filter.type = 'highpass';
                    filter.frequency.setValueAtTime(1000, now);
                    gainNode.gain.setValueAtTime(0.2, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                    oscillator.start(now);
                    oscillator.stop(now + 0.5);
                    break;
                    
                case 'achievement':
                    this.playAchievementSound();
                    return;
                    
                case 'unmute':
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(523, now);
                    oscillator.frequency.setValueAtTime(659, now + 0.1);
                    oscillator.frequency.setValueAtTime(784, now + 0.2);
                    gainNode.gain.setValueAtTime(0.2, now);
                    gainNode.gain.setValueAtTime(0, now + 0.3);
                    oscillator.start(now);
                    oscillator.stop(now + 0.3);
                    break;
                    
                case 'reveal':
                    this.playRevealSound();
                    return;
                    
                case 'reset':
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(440, now);
                    oscillator.frequency.setValueAtTime(220, now + 0.3);
                    gainNode.gain.setValueAtTime(0.2, now);
                    gainNode.gain.setValueAtTime(0, now + 0.5);
                    oscillator.start(now);
                    oscillator.stop(now + 0.5);
                    break;
            }
        } catch (error) {
            console.warn('Sound playback failed:', error);
        }
    }

    playConfettiSound() {
        const now = this.audioContext.currentTime;
        
        // Multiple quick pops
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600 + Math.random() * 400, now);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                
                osc.connect(gain);
                gain.connect(this.sfxGain);
                osc.start(now);
                osc.stop(now + 0.1);
            }, i * 100);
        }
    }

    playFireworksSound() {
        const now = this.audioContext.currentTime;
        
        // Whoosh sound followed by explosion
        const whoosh = this.audioContext.createOscillator();
        const whooshGain = this.audioContext.createGain();
        const noise = this.audioContext.createBufferSource();
        const noiseGain = this.audioContext.createGain();
        
        // Create noise buffer for explosion
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() - 0.5) * 2;
        }
        
        noise.buffer = buffer;
        
        // Whoosh
        whoosh.type = 'sawtooth';
        whoosh.frequency.setValueAtTime(100, now);
        whoosh.frequency.exponentialRampToValueAtTime(2000, now + 0.8);
        whooshGain.gain.setValueAtTime(0.1, now);
        whooshGain.gain.setValueAtTime(0, now + 0.8);
        
        whoosh.connect(whooshGain);
        whooshGain.connect(this.sfxGain);
        whoosh.start(now);
        whoosh.stop(now + 0.8);
        
        // Explosion
        noiseGain.gain.setValueAtTime(0, now + 0.8);
        noiseGain.gain.setValueAtTime(0.3, now + 0.85);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        
        noise.connect(noiseGain);
        noiseGain.connect(this.sfxGain);
        noise.start(now + 0.8);
    }

    playAchievementSound() {
        const now = this.audioContext.currentTime;
        const notes = [523, 659, 784, 1047]; // C major arpeggio
        
        notes.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + index * 0.1);
            gain.gain.setValueAtTime(0.2, now + index * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.3);
            
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + index * 0.1);
            osc.stop(now + index * 0.1 + 0.3);
        });
    }

    playRevealSound() {
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 2);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.5);
        gain.gain.linearRampToValueAtTime(0, now + 2);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 2);
    }

    playBackgroundMusic(type = 'intro') {
        if (this.isMuted || !this.audioContext) return;
        
        // Stop current music
        if (this.currentMusic) {
            this.stopBackgroundMusic();
        }
        
        const track = this.musicTracks[type] || this.musicTracks.intro;
        this.currentMusic = { type, track };
        
        this.playNextNote();
    }

    playNextNote() {
        if (!this.currentMusic || this.isMuted) return;
        
        const { track } = this.currentMusic;
        const now = this.audioContext.currentTime;
        
        if (now >= track.nextNoteTime) {
            const frequency = track.frequencies[track.currentNote];
            
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, now);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
            gain.gain.linearRampToValueAtTime(0, now + track.noteDuration);
            
            osc.connect(gain);
            gain.connect(this.musicGain);
            
            osc.start(now);
            osc.stop(now + track.noteDuration);
            
            track.nextNoteTime = now + track.noteDuration;
            track.currentNote = (track.currentNote + 1) % track.frequencies.length;
        }
        
        // Schedule next note
        setTimeout(() => {
            this.playNextNote();
        }, 100);
    }

    stopBackgroundMusic() {
        this.currentMusic = null;
    }

    mute() {
        this.isMuted = true;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        }
    }

    unmute() {
        this.isMuted = false;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
        }
    }

    pause() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    dispose() {
        this.stopBackgroundMusic();
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.sounds = {};
        this.musicTracks = {};
        console.log('AudioManager: Disposed');
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Birthday App...');
    if (!window.birthdayApp) {
        window.birthdayApp = new BirthdayApp();
    }
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Fallback DOM initialization...');
        if (!window.birthdayApp) {
            window.birthdayApp = new BirthdayApp();
        }
    });
} else {
    console.log('Direct initialization (DOM ready)...');
    if (!window.birthdayApp) {
        window.birthdayApp = new BirthdayApp();
    }
}

// Handle page unload cleanup
window.addEventListener('beforeunload', () => {
    if (window.birthdayApp) {
        window.birthdayApp.dispose();
    }
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (window.birthdayApp) {
        if (document.hidden) {
            // Page is hidden, pause expensive operations
            console.log('Page hidden - pausing operations');
        } else {
            // Page is visible again, resume operations
            console.log('Page visible - resuming operations');
        }
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    
    if (window.birthdayApp && typeof window.birthdayApp.showError === 'function') {
        window.birthdayApp.showError('An unexpected error occurred. Please refresh the page.');
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent the default browser behavior
    
    if (window.birthdayApp && typeof window.birthdayApp.showError === 'function') {
        window.birthdayApp.showError('A system error occurred. Please refresh the page.');
    }
});

console.log('Birthday App main.js loaded successfully');
