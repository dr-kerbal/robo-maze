class Robot {
    constructor(startRow, startCol, initialDirection = 'up', algorithm = 'left') {
        this.row = startRow;
        this.col = startCol;
        this.direction = initialDirection;
        this.algorithm = algorithm; // 'left', 'right', 'forward', 'random'
        this.visitedCells = new Set();
        this.currentPath = [];
        this.deadEnds = 0;
        this.steps = 0;
        this.backtrackCount = 0;

        // Mark starting position as visited
        this.markVisited(startRow, startCol);
    }

    move(newRow, newCol) {
        this.row = newRow;
        this.col = newCol;
        this.steps++;
        this.markVisited(newRow, newCol);
    }

    canMove(direction, maze) {
        const next = this.getNextCell(direction);

        // Check bounds
        if (next.row < 0 || next.row >= maze.size ||
            next.col < 0 || next.col >= maze.size) {
            return false;
        }

        // Check if there's a wall
        return maze.isValidPath(this.row, this.col, next.row, next.col);
    }

    getNextCell(direction) {
        const moves = {
            'up': { row: this.row - 1, col: this.col },
            'down': { row: this.row + 1, col: this.col },
            'left': { row: this.row, col: this.col - 1 },
            'right': { row: this.row, col: this.col + 1 }
        };
        return moves[direction] || { row: this.row, col: this.col };
    }

    turn(newDirection) {
        this.direction = newDirection;
    }

    getLeftDirection() {
        const leftMap = {
            'up': 'left',
            'left': 'down',
            'down': 'right',
            'right': 'up'
        };
        return leftMap[this.direction];
    }

    getRightDirection() {
        const rightMap = {
            'up': 'right',
            'right': 'down',
            'down': 'left',
            'left': 'up'
        };
        return rightMap[this.direction];
    }

    getBackDirection() {
        const backMap = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        return backMap[this.direction];
    }

    isAtExit(exitRow, exitCol) {
        return this.row === exitRow && this.col === exitCol;
    }

    getCurrentCell() {
        return { row: this.row, col: this.col };
    }

    getPosition() {
        return { row: this.row, col: this.col };
    }

    hasVisited(row, col) {
        return this.visitedCells.has(`${row},${col}`);
    }

    markVisited(row, col) {
        this.visitedCells.add(`${row},${col}`);
    }

    reset(startRow, startCol, initialDirection = 'up', algorithm = 'left') {
        this.row = startRow;
        this.col = startCol;
        this.direction = initialDirection;
        this.algorithm = algorithm;
        this.visitedCells.clear();
        this.currentPath = [];
        this.deadEnds = 0;
        this.steps = 0;
        this.backtrackCount = 0;
        this.markVisited(startRow, startCol);
    }

    getStats() {
        return {
            steps: this.steps,
            deadEnds: this.deadEnds,
            backtrackCount: this.backtrackCount
        };
    }

    getNextDirection(maze) {
        const left = this.getLeftDirection();
        const forward = this.direction;
        const right = this.getRightDirection();
        const back = this.getBackDirection();

        // Choose algorithm strategy
        switch (this.algorithm) {
            case 'left':
                return this.getNextDirectionLeft(maze, left, forward, right, back);
            case 'right':
                return this.getNextDirectionRight(maze, left, forward, right, back);
            case 'forward':
                return this.getNextDirectionForward(maze, left, forward, right, back);
            case 'random':
                return this.getNextDirectionRandom(maze, left, forward, right, back);
            default:
                return this.getNextDirectionLeft(maze, left, forward, right, back);
        }
    }

    getNextDirectionLeft(maze, left, forward, right, back) {
        // Left-hand wall following
        // Priority: Left → Forward → Right → Back
        if (this.canMove(left, maze)) return left;
        if (this.canMove(forward, maze)) return forward;
        if (this.canMove(right, maze)) return right;
        return back;
    }

    getNextDirectionRight(maze, left, forward, right, back) {
        // Right-hand wall following
        // Priority: Right → Forward → Left → Back
        if (this.canMove(right, maze)) return right;
        if (this.canMove(forward, maze)) return forward;
        if (this.canMove(left, maze)) return left;
        return back;
    }

    getNextDirectionForward(maze, left, forward, right, back) {
        // Simple forward preference
        // Priority: Forward → Right → Left → Back
        // NOTE: This can get stuck in loops on some maze configurations (known limitation)
        if (this.canMove(forward, maze)) return forward;
        if (this.canMove(right, maze)) return right;
        if (this.canMove(left, maze)) return left;
        return back;
    }

    getNextDirectionRandom(maze, left, forward, right, back) {
        // Random walk - choose randomly from available directions
        const availableDirections = [];

        if (this.canMove(left, maze)) availableDirections.push(left);
        if (this.canMove(forward, maze)) availableDirections.push(forward);
        if (this.canMove(right, maze)) availableDirections.push(right);

        // If no available directions, must backtrack
        if (availableDirections.length === 0) {
            return back;
        }

        // Randomly choose from available directions
        const randomIndex = Math.floor(Math.random() * availableDirections.length);
        return availableDirections[randomIndex];
    }

    determineInitialDirection(maze) {
        // Try to face up (toward exit) first
        if (this.canMove('up', maze)) {
            this.direction = 'up';
            return 'up';
        }

        // Otherwise face first left-most opening
        const directions = ['left', 'right', 'down'];
        for (const dir of directions) {
            if (this.canMove(dir, maze)) {
                this.direction = dir;
                return dir;
            }
        }

        // Should never happen in valid maze
        return 'up';
    }

    stepOnce(maze) {
        const nextDir = this.getNextDirection(maze);
        const isBacktracking = nextDir === this.getBackDirection();

        if (isBacktracking) {
            // Dead end - increment counter
            this.deadEnds++;
            this.backtrackCount++;

            // Mark current path as dead end
            this.currentPath.push({ row: this.row, col: this.col, deadEnd: true });
        } else {
            // Normal move - add to path
            this.currentPath.push({ row: this.row, col: this.col, deadEnd: false });
        }

        // Turn and move
        this.turn(nextDir);
        const nextCell = this.getNextCell(nextDir);
        const fromRow = this.row;
        const fromCol = this.col;
        this.move(nextCell.row, nextCell.col);

        return {
            from: { row: fromRow, col: fromCol },
            to: { row: nextCell.row, col: nextCell.col },
            direction: nextDir,
            isBacktracking,
            isDeadEnd: isBacktracking
        };
    }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Robot };
}
