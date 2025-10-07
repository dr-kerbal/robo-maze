class Renderer {
    constructor(canvasElement, canvasSize = 800) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.canvasSize = canvasSize;
        this.cellSize = 0;
        this.wallThickness = 2;
        this.mazeSize = 0;
    }

    initialize(mazeSize) {
        this.mazeSize = mazeSize;
        this.cellSize = this.calculateCellSize(mazeSize);

        // Set canvas actual size
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;

        this.clear();
    }

    calculateCellSize(mazeSize) {
        return this.canvasSize / mazeSize;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Fill with white background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getCellCenter(row, col) {
        return {
            x: col * this.cellSize + this.cellSize / 2,
            y: row * this.cellSize + this.cellSize / 2
        };
    }

    getCellTopLeft(row, col) {
        return {
            x: col * this.cellSize,
            y: row * this.cellSize
        };
    }

    renderCell(row, col, state = 'unexplored') {
        const x = col * this.cellSize;
        const y = row * this.cellSize;

        // Fill cell background based on state
        const colors = {
            'unexplored': '#ffffff',
            'explored': '#10b981',    // green
            'deadend': '#ef4444'      // red
        };

        this.ctx.fillStyle = colors[state] || colors.unexplored;
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    }

    renderWalls(cell) {
        const x = cell.col * this.cellSize;
        const y = cell.row * this.cellSize;
        const size = this.cellSize;

        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = this.wallThickness;
        this.ctx.lineCap = 'square';

        this.ctx.beginPath();

        if (cell.hasWall('top')) {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + size, y);
        }

        if (cell.hasWall('right')) {
            this.ctx.moveTo(x + size, y);
            this.ctx.lineTo(x + size, y + size);
        }

        if (cell.hasWall('bottom')) {
            this.ctx.moveTo(x, y + size);
            this.ctx.lineTo(x + size, y + size);
        }

        if (cell.hasWall('left')) {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + size);
        }

        this.ctx.stroke();
    }

    renderMaze(maze) {
        this.clear();

        // Render all cells
        for (let row = 0; row < maze.size; row++) {
            for (let col = 0; col < maze.size; col++) {
                const cell = maze.getCell(row, col);
                this.renderCell(row, col, cell.getState());
                this.renderWalls(cell);
            }
        }
    }

    updateCell(row, col, state, maze) {
        // Re-render single cell
        this.renderCell(row, col, state);

        // Re-render walls
        const cell = maze.getCell(row, col);
        if (cell) {
            this.renderWalls(cell);
        }
    }

    renderRobot(robot) {
        const center = this.getCellCenter(robot.row, robot.col);

        // Draw robot emoji
        this.ctx.save();
        this.ctx.translate(center.x, center.y);

        // Rotate based on direction
        const rotations = {
            'up': 0,
            'right': Math.PI / 2,
            'down': Math.PI,
            'left': -Math.PI / 2
        };
        this.ctx.rotate(rotations[robot.direction] || 0);

        this.ctx.font = `${this.cellSize * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🤖', 0, 0);

        this.ctx.restore();
    }

    renderExit(row, col) {
        const center = this.getCellCenter(row, col);

        this.ctx.font = `${this.cellSize * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🚪', center.x, center.y);
    }

    renderComplete(maze, robot) {
        this.renderMaze(maze);
        this.renderExit(maze.exitCell.row, maze.exitCell.col);
        this.renderRobot(robot);
    }

    animateMovement(fromRow, fromCol, toRow, toCol, direction, duration = 500) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const fromCenter = this.getCellCenter(fromRow, fromCol);
            const toCenter = this.getCellCenter(toRow, toCol);

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Linear interpolation
                const currentX = fromCenter.x + (toCenter.x - fromCenter.x) * progress;
                const currentY = fromCenter.y + (toCenter.y - fromCenter.y) * progress;

                // Clear only the robot's path area (simple approach: clear both cells)
                this.renderCell(fromRow, fromCol, 'unexplored');
                this.renderCell(toRow, toCol, 'unexplored');

                // Draw robot at interpolated position
                this.ctx.save();
                this.ctx.translate(currentX, currentY);

                const rotations = {
                    'up': 0,
                    'right': Math.PI / 2,
                    'down': Math.PI,
                    'left': -Math.PI / 2
                };
                this.ctx.rotate(rotations[direction] || 0);

                this.ctx.font = `${this.cellSize * 0.6}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('🤖', 0, 0);

                this.ctx.restore();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    showVictory(message) {
        // Draw victory overlay on canvas
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🎉', this.canvas.width / 2, this.canvas.height / 2 - 40);

        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2 + 20);

        this.ctx.restore();
    }

    clearVictory() {
        // Victory is cleared by re-rendering the maze
    }
}

// Export for Node.js testing (optional for renderer)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Renderer };
}
