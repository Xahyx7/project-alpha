// Automatic Birthday Celebration App - Full Animation Version
class BirthdayApp {
    constructor() {
        this.canvas = null;
        this.sceneManager = null;
        this.audioManager = null;
        
        this.timeline = null;
        this.totalDuration = 30; // Shortened to 30 seconds for non-stop action
        this.currentPhase = 0;
        this.phases = [
            { name: 'welcome', duration: 4, title: 'Welcome Aafia!' },
            { name: 'surprise', duration: 6, title: 'Surprise Birthday Magic!' },
            { name: 'party', duration: 8, title: 'Party Time!' },
            { name: 'wishes', duration: 6, title: 'Birthday Wishes!' },
            { name: 'celebration', duration: 6, title: 'Grand Celebration!' }
        ];
        
        this.isLoaded = false;
        this.startTime = 0;
        this.animationActive = false;
    }

    async init() {
        try {
            console.log('BirthdayApp: Starting full animation celebration...');
            
            this.showLoadingScreen();
            await this.initializeComponents();
            await this.startFullAnimationCelebration();
            
            console.log('BirthdayApp: Full animation ready');
        } catch (error) {
            console.error('BirthdayApp: Failed:', error);
            this.showError(error.message);
        }
    }

    showLoadingScreen() {
        const loadingContainer = document.getElementById('loading-container');
        const progressFill = document.getElementById('progress-fill');
        const loadingText = document.getElementById('loading-text');
        const loadingPercentage = document.getElementById('loading-percentage');
        
        const loadingSteps = [
            'Preparing birthday magic...',
            'Inflating balloons...',
            'Lighting candles...',
            'Preparing confetti cannons...',
            'Ready for celebration!'
        ];
        
        let progress = 0;
        let stepIndex = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 20 + 10;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = `${progress}%`;
            loadingPercentage.textContent = `${Math.floor(progress)}%`;
            
            if (stepIndex < loadingSteps.length) {
                loadingText.textContent = loadingSteps[stepIndex];
                stepIndex++;
            }
            
            if (progress < 100) {
                setTimeout(updateProgress, 200);
            } else {
                setTimeout(() => {
                    loadingContainer.classList.add('fade-out');
                    this.showMainApp();
                }, 500);
            }
        };
        
        setTimeout(updateProgress, 300);
    }

    showMainApp() {
        const appContainer = document.getElementById('app-container');
        appContainer.classList.add('loaded');
        this.isLoaded = true;
    }

    async initializeComponents() {
        this.canvas = document.getElementById('birthday-canvas');
        if (!this.canvas) {
            throw new Error('Canvas not found');
        }

        // SceneManager will be globally available since we load it via script tag
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
                audioToggle.querySelector('.icon').textContent = 
                    this.audioManager.enabled ? '🔊' : '🔇';
            });
        }

        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Info panel toggle
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
        console.log('Starting NON-STOP birthday animation party!');
        
        this.startTime = Date.now();
        this.animationActive = true;
        this.updateTimer();
        
        // Remove the boring step indicators and replace with dynamic content
        this.hideStepIndicators();
        
        if (window.gsap) {
            this.createActionPackedTimeline();
        } else {
            this.createSimpleActionTimeline();
        }
    }

    hideStepIndicators() {
        const progressSteps = document.querySelector('.progress-steps');
        if (progressSteps) {
            progressSteps.style.display = 'none';
        }
        
        const progressTimer = document.querySelector('.progress-timer');
        if (progressTimer) {
            progressTimer.innerHTML = '<span id="current-action">🎉 Birthday Magic Starting...</span>';
        }
    }

    createActionPackedTimeline() {
        this.timeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });
        
        // Phase 1: INSTANT Welcome Explosion (0-4s)
        this.timeline.call(() => {
            this.explodeWelcome();
        });
        
        // Phase 2: Balloon Surprise Attack (4s)
        this.timeline.call(() => {
            this.balloonSurpriseAttack();
        }, null, 4);
        
        // Phase 3: Cake & Candle Magic (6s)
        this.timeline.call(() => {
            this.cakeAndCandleMagic();
        }, null, 6);
        
        // Phase 4: CONFETTI EXPLOSION (10s)
        this.timeline.call(() => {
            this.confettiExplosion();
        }, null, 10);
        
        // Phase 5: Birthday Message Display (14s)
        this.timeline.call(() => {
            this.showBirthdayMessage();
        }, null, 14);
        
        // Phase 6: FIREWORKS FINALE (18s)
        this.timeline.call(() => {
            this.fireworksFinale();
        }, null, 18);
        
        // Phase 7: MEGA CELEBRATION (24s)
        this.timeline.call(() => {
            this.megaCelebration();
        }, null, 24);
        
        // Reset and repeat (30s)
        this.timeline.call(() => {
            this.resetForNextRound();
        }, null, 30);
    }

    explodeWelcome() {
        this.updateAction('🎊 WELCOME EXPLOSION!');
        console.log('🎊 WELCOME EXPLOSION!');
        
        // Show text with EXPLOSION effect
        if (this.sceneManager.objects.text) {
            this.sceneManager.objects.text.visible = true;
            gsap.fromTo(this.sceneManager.objects.text.scale, 
                { x: 0, y: 0 }, 
                { x: 10, y: 3, duration: 0.8, ease: "back.out(2)" }
            );
            gsap.to(this.sceneManager.objects.text.scale, 
                { x: 8, y: 2, duration: 2, delay: 0.8, ease: "power2.inOut" }
            );
        }
        
        // Stars EXPLOSION
        this.sceneManager.objects.stars.forEach((star, index) => {
            star.visible = true;
            star.userData.visible = true;
            gsap.fromTo(star.position, 
                { x: 0, y: 20, z: 0 },
                { 
                    x: star.position.x, 
                    y: star.position.y, 
                    z: star.position.z, 
                    duration: 1, 
                    delay: index * 0.02, 
                    ease: "power2.out" 
                }
            );
        });
        
        // Camera shake for impact
        this.sceneManager.cameraShake(0.5);
    }

    balloonSurpriseAttack() {
        this.updateAction('🎈 BALLOON SURPRISE ATTACK!');
        console.log('🎈 BALLOON SURPRISE ATTACK!');
        
        // Balloons appear from ALL directions
        this.sceneManager.objects.balloons.forEach((balloon, index) => {
            balloon.visible = true;
            balloon.userData.visible = true;
            
            // Random entry directions
            const directions = [
                { x: -20, y: balloon.userData.originalY, z: 0 }, // Left
                { x: 20, y: balloon.userData.originalY, z: 0 },  // Right
                { x: 0, y: -10, z: balloon.userData.originalY }, // Bottom
                { x: 0, y: 20, z: balloon.userData.originalY }   // Top
            ];
            
            const startPos = directions[index % directions.length];
            
            gsap.fromTo(balloon.position, 
                startPos,
                { 
                    x: balloon.position.x, 
                    y: balloon.userData.originalY, 
                    z: balloon.position.z, 
                    duration: 1.5, 
                    delay: index * 0.1, 
                    ease: "back.out(1.2)" 
                }
            );
            
            // Spinning effect
            gsap.to(balloon.rotation, {
                y: Math.PI * 2,
                duration: 1.5,
                delay: index * 0.1,
                ease: "power2.out"
            });
        });
    }

    cakeAndCandleMagic() {
        this.updateAction('🎂 MAGICAL CAKE APPEARANCE!');
        console.log('🎂 MAGICAL CAKE APPEARANCE!');
        
        if (this.sceneManager.objects.cake) {
            this.sceneManager.objects.cake.visible = true;
            this.sceneManager.objects.cake.userData.visible = true;
            
            // Cake rises from ground with magic
            gsap.fromTo(this.sceneManager.objects.cake.position, 
                { y: -10 },
                { y: -1, duration: 2, ease: "back.out(1.7)" }
            );
            
            gsap.fromTo(this.sceneManager.objects.cake.scale, 
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 1, z: 1, duration: 2, ease: "back.out(1.7)" }
            );
        }
        
        // Candles light up one by one with sound
        setTimeout(() => {
            this.sceneManager.objects.candles.forEach(({candle, flame}, index) => {
                setTimeout(() => {
                    gsap.fromTo(flame.scale, 
                        { x: 0, y: 0, z: 0 },
                        { x: 1, y: 1, z: 1, duration: 0.3, ease: "back.out(2)" }
                    );
                    this.audioManager.playTone(440 + index * 50, 0.3); // Different pitch per candle
                }, index * 200);
            });
        }, 1000);
    }

    confettiExplosion() {
        this.updateAction('🎊 CONFETTI EXPLOSION TIME!');
        console.log('🎊 CONFETTI EXPLOSION TIME!');
        
        // MASSIVE confetti explosion
        this.sceneManager.triggerMegaConfetti();
        
        // Screen shake
        this.sceneManager.cameraShake(1);
        
        // Play explosion sound
        this.audioManager.playExplosion();
        
        // Make balloons dance wildly
        this.sceneManager.objects.balloons.forEach((balloon) => {
            if (balloon.userData.visible) {
                gsap.to(balloon.scale, { 
                    x: 1.5, y: 1.5, z: 1.5, 
                    duration: 0.3, 
                    yoyo: true, 
                    repeat: 5, 
                    ease: "power2.inOut" 
                });
                
                gsap.to(balloon.position, {
                    y: balloon.userData.originalY + 2,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 3,
                    ease: "power2.inOut"
                });
            }
        });
    }

    showBirthdayMessage() {
        this.updateAction('💌 SPECIAL BIRTHDAY MESSAGE!');
        console.log('💌 SPECIAL BIRTHDAY MESSAGE!');
        
        // Create floating message
        this.sceneManager.createFloatingMessage("Happy Birthday Aafia! 🎉\nMay all your dreams come true! ✨");
        
        // Gentle confetti rain
        this.sceneManager.triggerGentleConfetti();
    }

    fireworksFinale() {
        this.updateAction('🎆 FIREWORKS FINALE!');
        console.log('🎆 FIREWORKS FINALE!');
        
        // Multiple firework bursts
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const position = new THREE.Vector3(
                    (Math.random() - 0.5) * 20,
                    Math.random() * 10 + 8,
                    (Math.random() - 0.5) * 20
                );
                this.sceneManager.createFirework(position);
                this.audioManager.playFirework();
            }, i * 500);
        }
        
        // Camera dramatic movement
        this.sceneManager.dramaticCameraMove();
    }

    megaCelebration() {
        this.updateAction('🏆 MEGA CELEBRATION MODE!');
        console.log('🏆 MEGA CELEBRATION MODE!');
        
        // EVERYTHING goes crazy
        
        // Text pulsing
        if (this.sceneManager.objects.text) {
            gsap.to(this.sceneManager.objects.text.scale, {
                x: 12, y: 4,
                duration: 1,
                yoyo: true,
                repeat: 3,
                ease: "power2.inOut"
            });
        }
        
        // Cake spinning
        if (this.sceneManager.objects.cake) {
            gsap.to(this.sceneManager.objects.cake.rotation, {
                y: Math.PI * 4,
                duration: 3,
                ease: "power2.inOut"
            });
        }
        
        // Final confetti storm
        setTimeout(() => {
            this.sceneManager.triggerConfettiStorm();
        }, 1000);
        
        // Rainbow lighting
        this.sceneManager.enableRainbowLighting();
    }

    resetForNextRound() {
        this.updateAction('🔄 Restarting the party...');
        console.log('🔄 Restarting birthday party...');
        
        // Quick reset
        setTimeout(() => {
            this.sceneManager.quickReset();
            this.startTime = Date.now();
        }, 1000);
    }

    updateAction(action) {
        const actionElement = document.getElementById('current-action');
        if (actionElement) {
            actionElement.textContent = action;
            // Flash effect
            gsap.fromTo(actionElement, 
                { scale: 1 }, 
                { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }
            );
        }
        
        // Update scene title
        const sceneTitle = document.getElementById('scene-title');
        if (sceneTitle) {
            const h1 = sceneTitle.querySelector('h1');
            if (h1) {
                h1.textContent = action;
                gsap.fromTo(h1, { scale: 1 }, { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1 });
            }
        }
    }

    updateTimer() {
        const updateTime = () => {
            if (!this.animationActive) {
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

    createSimpleActionTimeline() {
        // Fallback without GSAP
        const phases = [
            { delay: 0, action: () => this.explodeWelcome() },
            { delay: 4000, action: () => this.balloonSurpriseAttack() },
            { delay: 6000, action: () => this.cakeAndCandleMagic() },
            { delay: 10000, action: () => this.confettiExplosion() },
            { delay: 14000, action: () => this.showBirthdayMessage() },
            { delay: 18000, action: () => this.fireworksFinale() },
            { delay: 24000, action: () => this.megaCelebration() },
            { delay: 30000, action: () => this.resetForNextRound() }
        ];
        
        const startCycle = () => {
            phases.forEach(phase => {
                setTimeout(phase.action, phase.delay);
            });
            
            setTimeout(startCycle, 32000);
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

// Enhanced Audio Manager with Action Sounds
class AudioManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.volume = 0.4;
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
        // Explosion sound effect
        this.playTone(100, 0.3);
        setTimeout(() => this.playTone(150, 0.4), 100);
        setTimeout(() => this.playTone(80, 0.5), 200);
    }

    playFirework() {
        // Firework sound effect
        this.playTone(800, 0.2);
        setTimeout(() => this.playTone(600, 0.3), 100);
        setTimeout(() => this.playTone(400, 0.4), 200);
    }

    toggle() {
        this.enabled = !this.enabled;
        console.log(`Audio ${this.enabled ? 'enabled' : 'disabled'}`);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const app = new BirthdayApp();
    app.init().catch(error => {
        console.error('Failed to initialize birthday app:', error);
    });
});
