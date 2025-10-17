class GameController {
    constructor() {
        this.maze = null;
        this.robot = null;
        this.renderer = null;
        this.ui = null;

        this.speed = 5; // 1-100
        this.isPaused = false;
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;

        this.mazeSize = 10;
        this.algorithm = 'prim';
        this.robotAlgorithm = 'left';
    }

    initialize() {
        // Initialize UI
        this.ui = new UIController();
        this.ui.initialize(this);

        // Get initial settings
        const settings = this.ui.getInputValues();
        this.mazeSize = settings.mazeSize;
        this.algorithm = settings.algorithm;
        this.robotAlgorithm = settings.robotAlgorithm;
        this.speed = settings.speed;

        // Initialize renderer
        const canvas = document.getElementById('maze-canvas');
        this.renderer = new Renderer(canvas, 800);

        // Generate initial maze
        this.generateNewMaze();
    }

    generateNewMaze() {
        // Clean up previous
        this.clearMemory();

        // Create new maze
        this.maze = new Maze(this.mazeSize, this.algorithm);
        this.maze.generate(this.algorithm);

        // Create robot with selected algorithm
        this.robot = new Robot(this.maze.startCell.row, this.maze.startCell.col, 'up', this.robotAlgorithm);
        this.robot.determineInitialDirection(this.maze);

        // Render
        this.renderer.initialize(this.mazeSize);
        this.renderer.renderComplete(this.maze, this.robot);

        // Reset UI
        this.ui.hideVictoryMessage();
        this.ui.hideNextButton();
        this.ui.unlockSettings();
        this.ui.updateStatistics({ steps: 0, deadEnds: 0, backtrackCount: 0 });
        this.ui.updateTimer(0);

        this.isRunning = false;
        this.isPaused = false;
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;

        // Lock settings
        this.ui.lockSettings();

        // Start timer
        this.startTime = Date.now();
        this.startTimer();

        // Start game loop
        this.gameLoop();
    }

    pause() {
        this.isPaused = true;
        this.stopTimer();
    }

    resume() {
        this.isPaused = false;
        this.startTime = Date.now() - this.elapsedTime;
        this.startTimer();
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        this.stopTimer();
    }

    reset() {
        this.stop();

        // Reset robot with current algorithm
        this.robot.reset(this.maze.startCell.row, this.maze.startCell.col, 'up', this.robotAlgorithm);
        this.robot.determineInitialDirection(this.maze);

        // Reset maze cell states
        this.maze.reset();

        // Re-render
        this.renderer.renderComplete(this.maze, this.robot);

        // Reset UI
        this.ui.unlockSettings();
        this.ui.hideVictoryMessage();
        this.ui.updateStatistics({ steps: 0, deadEnds: 0, backtrackCount: 0 });
        this.ui.updateTimer(0);
        this.elapsedTime = 0;
    }

    async gameLoop() {
        while (this.isRunning && !this.isPaused) {
            // Check if reached exit
            if (this.robot.isAtExit(this.maze.exitCell.row, this.maze.exitCell.col)) {
                this.onVictory();
                return;
            }

            // Take one step
            await this.stepRobot();

            // Update statistics
            this.updateStatistics();

            // Delay based on speed (1 = slowest/1000ms, 10 = fastest/100ms)
            const delay = 1100 - (this.speed * 100);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    async stepRobot() {
        const result = this.robot.stepOnce(this.maze);

        // Update cell state
        const cell = this.maze.getCell(result.from.row, result.from.col);
        if (result.isDeadEnd) {
            cell.setState('deadend');
        } else {
            cell.setState('explored');
        }

        // Re-render maze with updated cell
        this.renderer.renderMaze(this.maze);
        this.renderer.renderExit(this.maze.exitCell.row, this.maze.exitCell.col);
        this.renderer.renderRobot(this.robot);
    }

    updateStatistics() {
        const stats = this.robot.getStats();
        this.ui.updateStatistics(stats);
    }

    onVictory() {
        this.stop();

        // Show victory message
        this.ui.showVictoryMessage();
        this.ui.showNextButton();
        this.ui.unlockSettings();

        // Auto-hide victory message after 5 seconds
        setTimeout(() => {
            this.ui.hideVictoryMessage();
        }, 5000);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.ui.updateTimer(this.elapsedTime / 1000);
        }, 100);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }

    setMazeSize(size) {
        this.mazeSize = size;
        if (!this.isRunning) {
            this.generateNewMaze();
        }
    }

    setAlgorithm(algorithm) {
        this.algorithm = algorithm;
        if (!this.isRunning) {
            this.generateNewMaze();
        }
    }

    setRobotAlgorithm(algorithm) {
        this.robotAlgorithm = algorithm;
        if (!this.isRunning) {
            this.generateNewMaze();
        }
    }

    clearMemory() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new GameController();
    game.initialize();
});
