// Professional Application Entry Point
import { SceneManager } from './scene/SceneManager.js';
import { AudioManager } from './audio/AudioManager.js';
import { AnimationController } from './animations/AnimationController.js';
import { Utils } from './utils/Utils.js';

class BirthdayApp {
    constructor() {
        this.sceneManager = null;
        this.audioManager = null;
        this.animationController = null;
        
        this.currentScene = 'intro';
        this.isLoaded = false;
        this.loadingProgress = 0;
        
        this.init();
    }

    async init() {
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize core systems
            await this.initializeSystems();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start the experience
            this.startExperience();
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load 3D experience. Please refresh and try again.');
        }
    }

    async initializeSystems() {
        const canvas = document.getElementById('birthday-canvas');
        
        // Initialize scene manager
        this.updateLoadingProgress(20, 'Setting up 3D environment...');
        this.sceneManager = new SceneManager(canvas);
        await this.sceneManager.init();
        
        // Initialize audio system
        this.updateLoadingProgress(40, 'Loading audio system...');
        this.audioManager = new AudioManager();
        await this.audioManager.init();
        
        // Initialize animation controller
        this.updateLoadingProgress(60, 'Preparing animations...');
        this.animationController = new AnimationController(this.sceneManager);
        await this.animationController.init();
        
        // Load all assets
        this.updateLoadingProgress(80, 'Loading 3D models and textures...');
        await this.loadAssets();
        
        // Final setup
        this.updateLoadingProgress(100, 'Almost ready...');
        
        // Small delay for smooth transition
        await Utils.delay(500);
    }

    async loadAssets() {
        const promises = [
            this.sceneManager.loadModels(),
            this.audioManager.loadSounds(),
            this.animationController.prepareAnimations()
        ];
        
        await Promise.all(promises);
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
            this.audioManager.toggle();
            this.updateAudioIcon();
        });

        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        fullscreenToggle.addEventListener('click', () => {
            Utils.toggleFullscreen();
        });

        const helpToggle = document.getElementById('help-toggle');
        const helpPanel = document.getElementById('help-panel');
        helpToggle.addEventListener('click', () => {
            helpPanel.classList.toggle('hidden');
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.sceneManager.handleResize();
        });

        // Interaction handlers
        this.sceneManager.onInteraction((type, data) => {
            this.handleInteraction(type, data);
        });
    }

    showLoadingScreen() {
        const loadingContainer = document.getElementById('loading-container');
        const appContainer = document.getElementById('app-container');
        
        loadingContainer.style.display = 'flex';
        appContainer.style.display = 'none';
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
        
        progressFill.style.width = `${percentage}%`;
        loadingText.textContent = text;
        loadingPercentage.textContent = `${percentage}%`;
        
        this.loadingProgress = percentage;
    }

    async startExperience() {
        this.hideLoadingScreen();
        
        // Start the first scene
        await this.switchScene('intro');
        
        // Start background music
        this.audioManager.playBackgroundMusic();
        
        this.isLoaded = true;
    }

    async switchScene(sceneName) {
        if (this.currentScene === sceneName) return;
        
        // Update navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.scene === sceneName);
        });
        
        // Update scene title
        this.updateSceneTitle(sceneName);
        
        // Transition to new scene
        await this.animationController.transitionToScene(sceneName);
        
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

    handleInteraction(type, data) {
        switch (type) {
            case 'balloonPop':
                this.audioManager.playSound('pop');
                this.animationController.triggerBalloonPop(data.position);
                break;
                
            case 'candleBlow':
                this.audioManager.playSound('blow');
                this.animationController.triggerCandleBlow(data.candleId);
                break;
                
            case 'cakeSlice':
                this.audioManager.playSound('slice');
                this.animationController.triggerCakeSlice(data.sliceId);
                break;
        }
    }

    updateAudioIcon() {
        const audioToggle = document.getElementById('audio-toggle');
        const icon = audioToggle.querySelector('.icon');
        icon.textContent = this.audioManager.isMuted ? '🔇' : '🔊';
    }

    showError(message) {
        const loadingText = document.getElementById('loading-text');
        const progressFill = document.getElementById('progress-fill');
        
        loadingText.textContent = message;
        loadingText.style.color = '#FF6B6B';
        progressFill.style.background = '#FF6B6B';
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BirthdayApp();
});
