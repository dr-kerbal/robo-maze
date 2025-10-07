class UIController {
    constructor() {
        this.elements = {
            mazeSize: document.getElementById('maze-size'),
            algorithm: document.getElementById('algorithm'),
            speed: document.getElementById('speed'),
            speedValue: document.getElementById('speed-value'),
            startBtn: document.getElementById('start-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            resetBtn: document.getElementById('reset-btn'),
            creditsBtn: document.getElementById('credits-btn'),
            nextBtn: document.getElementById('next-btn'),
            statSteps: document.getElementById('stat-steps'),
            statDeadends: document.getElementById('stat-deadends'),
            statBacktracks: document.getElementById('stat-backtracks'),
            statTime: document.getElementById('stat-time'),
            victoryMessage: document.getElementById('victory-message'),
            creditsModal: document.getElementById('credits-modal')
        };

        this.gameController = null;
    }

    initialize(gameController) {
        this.gameController = gameController;
        this.bindEvents();
        this.updateSpeedDisplay();
    }

    bindEvents() {
        // Settings changes
        this.elements.mazeSize.addEventListener('change', () => {
            const size = parseInt(this.elements.mazeSize.value);
            if (size >= 5 && size <= 50) {
                this.gameController.setMazeSize(size);
            }
        });

        this.elements.algorithm.addEventListener('change', () => {
            const algo = this.elements.algorithm.value;
            this.gameController.setAlgorithm(algo);
        });

        this.elements.speed.addEventListener('input', () => {
            const speed = parseInt(this.elements.speed.value);
            this.updateSpeedDisplay();
            this.gameController.setSpeed(speed);
        });

        // Control buttons
        this.elements.startBtn.addEventListener('click', () => {
            this.gameController.start();
        });

        this.elements.pauseBtn.addEventListener('click', () => {
            if (this.gameController.isPaused) {
                this.gameController.resume();
                this.elements.pauseBtn.textContent = 'Pause';
            } else {
                this.gameController.pause();
                this.elements.pauseBtn.textContent = 'Resume';
            }
        });

        this.elements.resetBtn.addEventListener('click', () => {
            this.gameController.reset();
        });

        this.elements.creditsBtn.addEventListener('click', () => {
            this.showCreditsModal();
        });

        this.elements.nextBtn.addEventListener('click', () => {
            this.gameController.generateNewMaze();
        });

        // Click outside modal to close
        this.elements.creditsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.creditsModal) {
                this.hideCreditsModal();
            }
        });

        // Prevent clicks inside modal content from closing
        const modalContent = this.elements.creditsModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    updateSpeedDisplay() {
        const speed = this.elements.speed.value;
        this.elements.speedValue.textContent = speed;
    }

    lockSettings() {
        this.elements.mazeSize.disabled = true;
        this.elements.algorithm.disabled = true;
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;
        this.elements.resetBtn.disabled = false;
    }

    unlockSettings() {
        this.elements.mazeSize.disabled = false;
        this.elements.algorithm.disabled = false;
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.pauseBtn.textContent = 'Pause';
        this.elements.resetBtn.disabled = false;
    }

    updateStatistics(stats) {
        this.elements.statSteps.textContent = stats.steps;
        this.elements.statDeadends.textContent = stats.deadEnds;
        this.elements.statBacktracks.textContent = stats.backtrackCount;
    }

    updateTimer(seconds) {
        this.elements.statTime.textContent = seconds.toFixed(1) + 's';
    }

    showVictoryMessage() {
        this.elements.victoryMessage.classList.remove('hidden');
        this.elements.victoryMessage.classList.remove('fade-out');
    }

    hideVictoryMessage() {
        // Add fade-out class for animation
        this.elements.victoryMessage.classList.add('fade-out');

        // Wait for animation to complete, then add hidden class
        setTimeout(() => {
            this.elements.victoryMessage.classList.add('hidden');
        }, 500); // Match CSS transition duration
    }

    showNextButton() {
        this.elements.nextBtn.style.display = 'inline-block';
    }

    hideNextButton() {
        this.elements.nextBtn.style.display = 'none';
    }

    enableButton(buttonName) {
        this.elements[buttonName].disabled = false;
    }

    disableButton(buttonName) {
        this.elements[buttonName].disabled = true;
    }

    getInputValues() {
        return {
            mazeSize: parseInt(this.elements.mazeSize.value),
            algorithm: this.elements.algorithm.value,
            speed: parseInt(this.elements.speed.value)
        };
    }

    showCreditsModal() {
        this.elements.creditsModal.classList.remove('hidden');
        this.elements.creditsModal.classList.remove('fade-out');
    }

    hideCreditsModal() {
        // Add fade-out class for animation
        this.elements.creditsModal.classList.add('fade-out');

        // Wait for animation to complete, then add hidden class
        setTimeout(() => {
            this.elements.creditsModal.classList.add('hidden');
        }, 500); // Match CSS transition duration
    }
}

// Export for Node.js testing (optional for UI)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIController };
}
