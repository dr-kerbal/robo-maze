# Robot Maze Game - Implementation Guide

## Table of Contents
1. [File Structure](#file-structure)
2. [Technical Architecture](#technical-architecture)
3. [Implementation Roadmap](#implementation-roadmap)
4. [Detailed Task Breakdown](#detailed-task-breakdown)
5. [Testing Strategy](#testing-strategy)

---

## File Structure

```
robo-maze/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Styling and layout
├── js/
│   ├── main.js         # Application entry point & GameController
│   ├── maze.js         # Maze & Cell classes, generation algorithms
│   ├── robot.js        # Robot class and pathfinding logic
│   ├── renderer.js     # Canvas rendering
│   └── ui.js           # UI controls and event handlers
├── tests/              # ⭐ REQUIRED: Test suite
│   ├── test.html       # Test runner (open in browser)
│   ├── test-framework.js   # Simple test framework
│   ├── test-cell.js        # Cell class unit tests
│   ├── test-maze.js        # Maze class unit tests
│   ├── test-robot.js       # Robot class unit tests
│   ├── test-renderer.js    # Renderer class tests
│   ├── test-ui.js          # UI controller tests
│   └── test-integration.js # Integration tests
├── assets/
│   └── sprites/        # Robot sprite images (optional - future)
└── docs/
    ├── maze-game-plan.md           # High-level plan
    └── maze-game-implementation.md # This file
```

### Test Coverage Requirements

**Minimum Test Coverage for Each Component:**

| Component | Minimum Tests | Critical Areas |
|-----------|--------------|----------------|
| Cell Class | 8 tests | Constructor, walls, state, visited, reset |
| Maze Class | 10 tests | Grid init, neighbors, wall removal, path validation, algorithms |
| Robot Class | 12 tests | Position, direction, movement, visited tracking, stats |
| Renderer Class | 6 tests | Canvas setup, cell size, coordinate conversion, rendering |
| UI Controller | 8 tests | Event binding, settings lock/unlock, display updates |
| Game Controller | 10 tests | Initialization, state management, game loop control |
| **Total** | **54+ tests** | Full coverage of public API |

**Test Naming Convention:**
- Use descriptive names: `should [expected behavior] when [condition]`
- Example: `should remove wall correctly when direction is valid`
- Group related tests in `describe()` blocks

---

## Technical Architecture

### Core Classes/Modules

#### 1. Cell Class (`maze.js`)
```javascript
class Cell {
  - row: number
  - col: number
  - walls: {top: boolean, right: boolean, bottom: boolean, left: boolean}
  - visited: boolean
  - state: 'unexplored' | 'explored' | 'deadend'

  + constructor(row, col): Cell
  + removeWall(direction): void
  + hasWall(direction): boolean
  + getWalls(): object
  + setState(state): void
  + getState(): string
  + isVisited(): boolean
  + markVisited(): void
}
```

#### 2. Maze Class (`maze.js`)
```javascript
class Maze {
  - size: number
  - grid: Cell[][]
  - algorithm: string
  - startCell: {row, col}
  - exitCell: {row, col}

  + constructor(size, algorithm): Maze
  + generate(algorithm): void
  + primsAlgorithm(): void
  + recursiveBacktracking(): void
  + kruskalsAlgorithm(): void
  + isValidPath(fromRow, fromCol, toRow, toCol): boolean
  + getNeighbors(row, col): Cell[]
  + getCell(row, col): Cell
  + getCellWalls(row, col): object
  + removeBetweenWalls(cell1, cell2): void
}
```

#### 3. Robot Class (`robot.js`)
```javascript
class Robot {
  - row: number
  - col: number
  - direction: 'up' | 'down' | 'left' | 'right'
  - visitedCells: Set<string>
  - currentPath: Array<{row, col, direction}>
  - deadEnds: number
  - steps: number
  - backtrackCount: number

  + constructor(startRow, startCol, initialDirection): Robot
  + move(newRow, newCol): void
  + canMove(direction, maze): boolean
  + turn(newDirection): void
  + getLeftDirection(): string
  + getRightDirection(): string
  + getBackDirection(): string
  + getNextDirection(maze): string
  + isAtExit(exitRow, exitCol): boolean
  + getCurrentCell(): {row, col}
  + getPosition(): {row, col}
  + hasVisited(row, col): boolean
  + markVisited(row, col): void
  + reset(startRow, startCol, initialDirection): void
  + getStats(): {steps, deadEnds, backtrackCount}
}
```

#### 4. Renderer Class (`renderer.js`)
```javascript
class Renderer {
  - canvas: HTMLCanvasElement
  - ctx: CanvasRenderingContext2D
  - cellSize: number
  - wallThickness: number
  - canvasSize: number

  + constructor(canvasElement, canvasSize): Renderer
  + initialize(mazeSize): void
  + clear(): void
  + renderMaze(maze): void
  + renderCell(row, col, state): void
  + renderWalls(cell): void
  + renderRobot(robot): void
  + updateCell(row, col, state): void
  + animateMovement(fromRow, fromCol, toRow, toCol, direction, duration): Promise
  + renderExit(row, col): void
  + showVictory(message): void
  + clearVictory(): void
  + calculateCellSize(mazeSize): number
  + getCellCenter(row, col): {x, y}
}
```

#### 5. GameController Class (`main.js`)
```javascript
class GameController {
  - maze: Maze
  - robot: Robot
  - renderer: Renderer
  - ui: UIController
  - speed: number
  - isPaused: boolean
  - isRunning: boolean
  - startTime: number
  - elapsedTime: number
  - timerInterval: number

  + constructor(): GameController
  + initialize(): void
  + start(): void
  + pause(): void
  + resume(): void
  + stop(): void
  + reset(): void
  + generateNewMaze(): void
  + updateStatistics(): void
  + setSpeed(newSpeed): void
  + setMazeSize(size): void
  + setAlgorithm(algorithm): void
  + lockSettings(): void
  + unlockSettings(): void
  + gameLoop(): Promise<void>
  + stepRobot(): Promise<void>
  + onVictory(): void
  + clearMemory(): void
}
```

#### 6. UIController Class (`ui.js`)
```javascript
class UIController {
  - elements: object  // DOM element references
  - gameController: GameController

  + constructor(): UIController
  + initialize(gameController): void
  + bindEvents(): void
  + lockSettings(): void
  + unlockSettings(): void
  + updateStatistics(stats): void
  + updateTimer(time): void
  + showVictoryMessage(): void
  + hideVictoryMessage(): void
  + showNextButton(): void
  + hideNextButton(): void
  + enableButton(buttonName): void
  + disableButton(buttonName): void
  + getInputValues(): object
}
```

---

## Implementation Roadmap

### Optimal Task Order

The tasks are ordered to:
1. Build foundation first (HTML/CSS structure)
2. Implement core data structures (Cell, Maze)
3. Test maze generation before moving to robot
4. Implement robot logic with simple rendering
5. Add full rendering and animations
6. Implement game controls
7. Polish and optimize

This order allows **incremental testing** at each stage.

---

## Detailed Task Breakdown

### ⚠️ CRITICAL: Test-First Development Requirement

**For EVERY task that involves JavaScript code (Tasks 3-20), you MUST:**

1. ✅ **Write tests FIRST** before considering the task complete
2. ✅ **Run ALL existing tests** to ensure no regressions
3. ✅ **Achieve 100% pass rate** before moving to next task
4. ✅ **Add tests to `tests/test.html`** as you build each component

**Test Execution Workflow:**
```
Implement Feature → Write Tests → Run Tests → All Pass? → Mark Complete
                         ↓             ↓
                    (test-*.js)   (test.html)
```

**Why This Matters:**
- Catches bugs immediately
- Prevents regressions as you build
- Documents expected behavior
- Enables confident refactoring
- Saves debugging time later

---

### 📋 TASK 1: Project Setup and HTML Structure
**Priority:** HIGH
**Dependencies:** None
**Estimated Time:** 1 hour

#### Subtasks:
1.1. Create project directory structure
1.2. Create `index.html` with basic structure
1.3. Add canvas element with appropriate size
1.4. Add all UI controls (inputs, buttons, sliders)
1.5. Add statistics display area
1.6. Add victory message container (hidden by default)

#### Implementation Details:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robot Maze Solver</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <h1>🤖 Robot Maze Solver</h1>

        <div class="controls">
            <div class="control-group">
                <label>Maze Size:</label>
                <input type="number" id="maze-size" min="5" max="50" value="10">
            </div>

            <div class="control-group">
                <label>Algorithm:</label>
                <select id="algorithm">
                    <option value="prim" selected>Randomized Prim</option>
                    <option value="backtracking">Recursive Backtracking</option>
                    <option value="kruskal">Kruskal's Algorithm</option>
                </select>
            </div>

            <div class="control-group">
                <label>Speed: <span id="speed-value">5</span></label>
                <input type="range" id="speed" min="1" max="10" value="5">
            </div>
        </div>

        <div class="buttons">
            <button id="start-btn">Start</button>
            <button id="pause-btn" disabled>Pause</button>
            <button id="reset-btn">Reset</button>
            <button id="next-btn" style="display: none;">Next Maze</button>
        </div>

        <div class="statistics">
            <span>Steps: <strong id="stat-steps">0</strong></span>
            <span>Dead Ends: <strong id="stat-deadends">0</strong></span>
            <span>Backtracks: <strong id="stat-backtracks">0</strong></span>
            <span>Time: <strong id="stat-time">0.0s</strong></span>
        </div>

        <div class="canvas-container">
            <canvas id="maze-canvas" width="800" height="800"></canvas>
        </div>

        <div id="victory-message" class="victory hidden">
            <div class="victory-content">
                <div class="emoji">😊</div>
                <h2>Congratulations!</h2>
                <p>The robot found the exit!</p>
            </div>
        </div>
    </div>

    <script src="js/maze.js"></script>
    <script src="js/robot.js"></script>
    <script src="js/renderer.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

#### Testing Criteria:
- [ ] HTML validates (use W3C validator)
- [ ] All UI elements are present and visible
- [ ] Canvas element is created with correct dimensions
- [ ] All script files are properly linked
- [ ] Page loads without console errors

---

### 📋 TASK 2: CSS Styling and Layout
**Priority:** HIGH
**Dependencies:** Task 1
**Estimated Time:** 1.5 hours

#### Subtasks:
2.1. Create responsive layout with CSS Grid/Flexbox
2.2. Style controls and buttons
2.3. Style statistics display
2.4. Style canvas container
2.5. Create victory message overlay styles
2.6. Add disabled state styles for locked controls
2.7. Add responsive breakpoints for mobile

#### Implementation Details:
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
}

.controls {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.control-group label {
    font-size: 14px;
    font-weight: 600;
    color: #555;
}

.control-group input,
.control-group select {
    padding: 8px 12px;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.control-group input:disabled,
.control-group select:disabled {
    background: #f0f0f0;
    cursor: not-allowed;
    opacity: 0.6;
}

.buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

button {
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
}

#start-btn {
    background: #10b981;
    color: white;
}

#start-btn:hover:not(:disabled) {
    background: #059669;
}

#pause-btn {
    background: #f59e0b;
    color: white;
}

#pause-btn:hover:not(:disabled) {
    background: #d97706;
}

#reset-btn {
    background: #ef4444;
    color: white;
}

#reset-btn:hover:not(:disabled) {
    background: #dc2626;
}

#next-btn {
    background: #3b82f6;
    color: white;
}

#next-btn:hover {
    background: #2563eb;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.statistics {
    display: flex;
    gap: 20px;
    padding: 15px;
    background: #f9fafb;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 14px;
}

.statistics strong {
    color: #667eea;
    font-size: 16px;
}

.canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9fafb;
    border-radius: 8px;
    padding: 20px;
}

#maze-canvas {
    border: 2px solid #ddd;
    border-radius: 4px;
}

.victory {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.victory.hidden {
    display: none;
}

.victory-content {
    background: white;
    padding: 40px;
    border-radius: 12px;
    text-align: center;
}

.victory .emoji {
    font-size: 80px;
    margin-bottom: 20px;
}

.victory h2 {
    color: #10b981;
    margin-bottom: 10px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }

    .controls {
        flex-direction: column;
    }

    #maze-canvas {
        max-width: 100%;
        height: auto;
    }
}
```

#### Testing Criteria:
- [ ] Layout is responsive on desktop (1920px, 1366px, 1024px)
- [ ] Layout is responsive on mobile (768px, 375px)
- [ ] All buttons have proper hover states
- [ ] Disabled controls appear grayed out
- [ ] Victory message overlay covers entire screen
- [ ] CSS validates (use W3C CSS validator)
- [ ] No console warnings about CSS

---

### 📋 TASK 3: Cell Class Implementation
**Priority:** HIGH
**Dependencies:** None
**Estimated Time:** 1 hour

#### Subtasks:
3.1. Create `js/maze.js` file
3.2. Implement Cell constructor
3.3. Implement wall manipulation methods
3.4. Implement state management methods
3.5. Implement visited tracking methods

#### Implementation Details:
```javascript
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
        this.visited = false;
        this.state = 'unexplored'; // 'unexplored' | 'explored' | 'deadend'
    }

    removeWall(direction) {
        if (this.walls.hasOwnProperty(direction)) {
            this.walls[direction] = false;
        }
    }

    hasWall(direction) {
        return this.walls[direction] === true;
    }

    getWalls() {
        return { ...this.walls };
    }

    setState(state) {
        if (['unexplored', 'explored', 'deadend'].includes(state)) {
            this.state = state;
        }
    }

    getState() {
        return this.state;
    }

    isVisited() {
        return this.visited;
    }

    markVisited() {
        this.visited = true;
    }

    reset() {
        this.visited = false;
        this.state = 'unexplored';
    }
}
```

#### Testing Criteria:
**BEFORE marking this task complete, you MUST:**

1. **Create `tests/test-framework.js`** (if not already created)
2. **Create `tests/test.html`** (if not already created)
3. **Create `tests/test-cell.js`** with comprehensive tests (see Testing Strategy section for example)
4. **Run all tests** and verify they pass:
   - [ ] Cell constructor creates object with correct properties
   - [ ] `removeWall()` correctly sets wall to false
   - [ ] `hasWall()` returns correct boolean
   - [ ] `getWalls()` returns deep copy (not reference)
   - [ ] `setState()` only accepts valid states
   - [ ] `markVisited()` sets visited to true
   - [ ] `reset()` resets state and visited flag
   - [ ] No console errors when instantiating Cell
5. **Open `tests/test.html` in browser** and confirm all tests pass
6. **Screenshot or log** showing 100% pass rate

**Minimum Required Tests for Cell Class:**
```javascript
// tests/test-cell.js
test.describe('Cell Class Tests', () => {
    test.it('should initialize with correct row and column', () => { /* test code */ });
    test.it('should have all walls initially', () => { /* test code */ });
    test.it('should remove walls correctly', () => { /* test code */ });
    test.it('should return deep copy of walls', () => { /* test code */ });
    test.it('should set state correctly', () => { /* test code */ });
    test.it('should reject invalid states', () => { /* test code */ });
    test.it('should track visited status', () => { /* test code */ });
    test.it('should reset state and visited flag', () => { /* test code */ });
});
```

**See "Testing Strategy" section below for complete test implementation examples.**

---

### 📋 TASK 4: Maze Class - Basic Structure
**Priority:** HIGH
**Dependencies:** Task 3
**Estimated Time:** 1.5 hours

#### Subtasks:
4.1. Implement Maze constructor
4.2. Implement grid initialization
4.3. Implement getCell() method
4.4. Implement getNeighbors() method
4.5. Implement removeBetweenWalls() helper
4.6. Implement isValidPath() method

#### Implementation Details:
```javascript
class Maze {
    constructor(size, algorithm = 'prim') {
        this.size = size;
        this.algorithm = algorithm;
        this.grid = [];
        this.startCell = { row: size - 1, col: 0 };
        this.exitCell = { row: 0, col: size - 1 };
        this.initializeGrid();
    }

    initializeGrid() {
        this.grid = [];
        for (let row = 0; row < this.size; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.size; col++) {
                this.grid[row][col] = new Cell(row, col);
            }
        }
    }

    getCell(row, col) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            return this.grid[row][col];
        }
        return null;
    }

    getCellWalls(row, col) {
        const cell = this.getCell(row, col);
        return cell ? cell.getWalls() : null;
    }

    getNeighbors(row, col) {
        const neighbors = [];
        const directions = [
            { row: row - 1, col: col, dir: 'top' },    // top
            { row: row, col: col + 1, dir: 'right' },  // right
            { row: row + 1, col: col, dir: 'bottom' }, // bottom
            { row: row, col: col - 1, dir: 'left' }    // left
        ];

        for (const { row: r, col: c, dir } of directions) {
            const cell = this.getCell(r, c);
            if (cell) {
                neighbors.push({ cell, direction: dir });
            }
        }

        return neighbors;
    }

    removeBetweenWalls(cell1, cell2) {
        const rowDiff = cell2.row - cell1.row;
        const colDiff = cell2.col - cell1.col;

        if (rowDiff === 1) {
            // cell2 is below cell1
            cell1.removeWall('bottom');
            cell2.removeWall('top');
        } else if (rowDiff === -1) {
            // cell2 is above cell1
            cell1.removeWall('top');
            cell2.removeWall('bottom');
        } else if (colDiff === 1) {
            // cell2 is to the right of cell1
            cell1.removeWall('right');
            cell2.removeWall('left');
        } else if (colDiff === -1) {
            // cell2 is to the left of cell1
            cell1.removeWall('left');
            cell2.removeWall('right');
        }
    }

    isValidPath(fromRow, fromCol, toRow, toCol) {
        const cell = this.getCell(fromRow, fromCol);
        if (!cell) return false;

        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;

        // Check if cells are adjacent
        if (Math.abs(rowDiff) + Math.abs(colDiff) !== 1) {
            return false;
        }

        // Check if there's a wall between them
        if (rowDiff === 1) return !cell.hasWall('bottom');
        if (rowDiff === -1) return !cell.hasWall('top');
        if (colDiff === 1) return !cell.hasWall('right');
        if (colDiff === -1) return !cell.hasWall('left');

        return false;
    }

    reset() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.grid[row][col].reset();
            }
        }
    }

    generate(algorithm) {
        this.algorithm = algorithm;
        this.reset();

        // Reset all walls first
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const cell = this.grid[row][col];
                cell.walls = { top: true, right: true, bottom: true, left: true };
            }
        }

        switch (algorithm) {
            case 'prim':
                this.primsAlgorithm();
                break;
            case 'backtracking':
                this.recursiveBacktracking();
                break;
            case 'kruskal':
                this.kruskalsAlgorithm();
                break;
            default:
                this.primsAlgorithm();
        }
    }

    // Placeholder methods - will implement in next tasks
    primsAlgorithm() {
        console.log('Prim\'s algorithm not yet implemented');
    }

    recursiveBacktracking() {
        console.log('Recursive backtracking not yet implemented');
    }

    kruskalsAlgorithm() {
        console.log('Kruskal\'s algorithm not yet implemented');
    }
}
```

#### Testing Criteria:
- [ ] Maze constructor creates grid of correct size
- [ ] All cells are initialized with 4 walls
- [ ] `getCell()` returns correct cell or null
- [ ] `getNeighbors()` returns 2 neighbors for corner, 3 for edge, 4 for middle
- [ ] `removeBetweenWalls()` correctly removes walls between adjacent cells
- [ ] `isValidPath()` returns false when wall exists
- [ ] `isValidPath()` returns true when wall is removed
- [ ] Start cell is at (size-1, 0)
- [ ] Exit cell is at (0, size-1)

**Test Script:**
```javascript
const maze = new Maze(10);
console.assert(maze.size === 10, 'Maze size should be 10');
console.assert(maze.grid.length === 10, 'Grid should have 10 rows');
console.assert(maze.grid[0].length === 10, 'Grid should have 10 columns');

const cell = maze.getCell(0, 0);
console.assert(cell !== null, 'Should return cell');
console.assert(cell.row === 0, 'Cell row should be 0');

const neighbors = maze.getNeighbors(5, 5);
console.assert(neighbors.length === 4, 'Middle cell should have 4 neighbors');

const cell1 = maze.getCell(0, 0);
const cell2 = maze.getCell(0, 1);
maze.removeBetweenWalls(cell1, cell2);
console.assert(!cell1.hasWall('right'), 'Cell1 right wall should be removed');
console.assert(!cell2.hasWall('left'), 'Cell2 left wall should be removed');

console.assert(maze.isValidPath(0, 0, 0, 1) === true, 'Path should be valid');

console.log('✅ All Maze basic tests passed');
```

---

### 📋 TASK 5: Maze Generation - Randomized Prim's Algorithm
**Priority:** HIGH
**Dependencies:** Task 4
**Estimated Time:** 2 hours

#### Subtasks:
5.1. Implement wall list data structure
5.2. Implement wall selection logic
5.3. Implement cell visitation tracking
5.4. Implement wall removal logic
5.5. Add debugging/logging

#### Implementation Details:
```javascript
primsAlgorithm() {
    // Start from random cell
    const startRow = Math.floor(Math.random() * this.size);
    const startCol = Math.floor(Math.random() * this.size);
    const startCell = this.getCell(startRow, startCol);

    startCell.markVisited();

    // Wall list: each wall is {cell1: {row, col}, cell2: {row, col}}
    const walls = [];

    // Add all walls of start cell to list
    this.addWallsToList(startCell, walls);

    while (walls.length > 0) {
        // Pick random wall
        const randomIndex = Math.floor(Math.random() * walls.length);
        const wall = walls.splice(randomIndex, 1)[0];

        const cell1 = this.getCell(wall.cell1.row, wall.cell1.col);
        const cell2 = this.getCell(wall.cell2.row, wall.cell2.col);

        // If only one cell is visited, remove the wall
        if (cell1 && cell2) {
            const c1Visited = cell1.isVisited();
            const c2Visited = cell2.isVisited();

            if (c1Visited !== c2Visited) {
                // Remove wall between them
                this.removeBetweenWalls(cell1, cell2);

                // Mark unvisited cell as visited
                const unvisitedCell = c1Visited ? cell2 : cell1;
                unvisitedCell.markVisited();

                // Add walls of newly visited cell
                this.addWallsToList(unvisitedCell, walls);
            }
        }
    }
}

addWallsToList(cell, wallList) {
    const directions = [
        { row: -1, col: 0 },  // top
        { row: 0, col: 1 },   // right
        { row: 1, col: 0 },   // bottom
        { row: 0, col: -1 }   // left
    ];

    for (const dir of directions) {
        const neighborRow = cell.row + dir.row;
        const neighborCol = cell.col + dir.col;
        const neighbor = this.getCell(neighborRow, neighborCol);

        if (neighbor) {
            // Add wall between cell and neighbor
            wallList.push({
                cell1: { row: cell.row, col: cell.col },
                cell2: { row: neighborRow, col: neighborCol }
            });
        }
    }
}
```

#### Testing Criteria:
- [ ] Algorithm completes without errors
- [ ] All cells are visited (check `visited` flag)
- [ ] There is at least one path from start to exit
- [ ] Maze has no isolated cells (all cells reachable)
- [ ] Walls are correctly removed (check random cells)
- [ ] Generate multiple mazes (10+) - all should be valid
- [ ] Performance: 50x50 maze generates in < 1 second

**Test Script:**
```javascript
const maze = new Maze(10, 'prim');
maze.generate('prim');

// Test all cells visited
let allVisited = true;
for (let row = 0; row < maze.size; row++) {
    for (let col = 0; col < maze.size; col++) {
        if (!maze.getCell(row, col).isVisited()) {
            allVisited = false;
        }
    }
}
console.assert(allVisited, 'All cells should be visited');

// Test that walls are removed (at least some)
let wallsRemoved = 0;
for (let row = 0; row < maze.size; row++) {
    for (let col = 0; col < maze.size; col++) {
        const cell = maze.getCell(row, col);
        const walls = cell.getWalls();
        if (!walls.top || !walls.right || !walls.bottom || !walls.left) {
            wallsRemoved++;
        }
    }
}
console.assert(wallsRemoved > 0, 'Some walls should be removed');

console.log('✅ Prim\'s algorithm tests passed');
console.log(`Walls removed in cells: ${wallsRemoved}/${maze.size * maze.size}`);
```

---

### 📋 TASK 6: Maze Generation - Recursive Backtracking
**Priority:** MEDIUM
**Dependencies:** Task 5
**Estimated Time:** 1.5 hours

#### Implementation Details:
```javascript
recursiveBacktracking() {
    // Start from random cell
    const startRow = Math.floor(Math.random() * this.size);
    const startCol = Math.floor(Math.random() * this.size);

    const stack = [];
    const current = this.getCell(startRow, startCol);
    current.markVisited();
    stack.push(current);

    while (stack.length > 0) {
        const currentCell = stack[stack.length - 1];

        // Get unvisited neighbors
        const neighbors = this.getNeighbors(currentCell.row, currentCell.col);
        const unvisitedNeighbors = neighbors.filter(n => !n.cell.isVisited());

        if (unvisitedNeighbors.length > 0) {
            // Pick random unvisited neighbor
            const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
            const chosen = unvisitedNeighbors[randomIndex];

            // Remove wall between current and chosen
            this.removeBetweenWalls(currentCell, chosen.cell);

            // Mark chosen as visited and push to stack
            chosen.cell.markVisited();
            stack.push(chosen.cell);
        } else {
            // Backtrack
            stack.pop();
        }
    }
}
```

#### Testing Criteria:
- [ ] Same tests as Task 5 (all cells visited, valid paths, etc.)
- [ ] Maze structure is different from Prim's (visual check)
- [ ] Performance: 50x50 maze generates in < 500ms

---

### 📋 TASK 7: Maze Generation - Kruskal's Algorithm
**Priority:** LOW
**Dependencies:** Task 5
**Estimated Time:** 2 hours

#### Implementation Details:
```javascript
kruskalsAlgorithm() {
    // Union-Find data structure
    const parent = {};
    const rank = {};

    // Initialize each cell as its own set
    for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
            const key = `${row},${col}`;
            parent[key] = key;
            rank[key] = 0;
            this.getCell(row, col).markVisited();
        }
    }

    const find = (key) => {
        if (parent[key] !== key) {
            parent[key] = find(parent[key]); // Path compression
        }
        return parent[key];
    };

    const union = (key1, key2) => {
        const root1 = find(key1);
        const root2 = find(key2);

        if (root1 === root2) return false;

        // Union by rank
        if (rank[root1] < rank[root2]) {
            parent[root1] = root2;
        } else if (rank[root1] > rank[root2]) {
            parent[root2] = root1;
        } else {
            parent[root2] = root1;
            rank[root1]++;
        }
        return true;
    };

    // Create list of all possible walls
    const allWalls = [];
    for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
            // Add right wall
            if (col < this.size - 1) {
                allWalls.push({
                    cell1: { row, col },
                    cell2: { row, col: col + 1 }
                });
            }
            // Add bottom wall
            if (row < this.size - 1) {
                allWalls.push({
                    cell1: { row, col },
                    cell2: { row: row + 1, col }
                });
            }
        }
    }

    // Shuffle walls
    for (let i = allWalls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allWalls[i], allWalls[j]] = [allWalls[j], allWalls[i]];
    }

    // Process walls
    for (const wall of allWalls) {
        const key1 = `${wall.cell1.row},${wall.cell1.col}`;
        const key2 = `${wall.cell2.row},${wall.cell2.col}`;

        if (find(key1) !== find(key2)) {
            const cell1 = this.getCell(wall.cell1.row, wall.cell1.col);
            const cell2 = this.getCell(wall.cell2.row, wall.cell2.col);
            this.removeBetweenWalls(cell1, cell2);
            union(key1, key2);
        }
    }
}
```

#### Testing Criteria:
- [ ] Same tests as Task 5
- [ ] All cells are in single connected component
- [ ] Performance: 50x50 maze generates in < 1 second

---

### 📋 TASK 8: Robot Class - Basic Structure
**Priority:** HIGH
**Dependencies:** Task 4
**Estimated Time:** 2 hours

#### Subtasks:
8.1. Create `js/robot.js` file
8.2. Implement constructor with position and direction
8.3. Implement direction helper methods
8.4. Implement movement validation
8.5. Implement visited cell tracking
8.6. Implement statistics tracking

#### Implementation Details:
```javascript
class Robot {
    constructor(startRow, startCol, initialDirection = 'up') {
        this.row = startRow;
        this.col = startCol;
        this.direction = initialDirection;
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

    reset(startRow, startCol, initialDirection = 'up') {
        this.row = startRow;
        this.col = startCol;
        this.direction = initialDirection;
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
}
```

#### Testing Criteria:
- [ ] Robot initializes at correct position
- [ ] Direction helpers return correct directions
- [ ] `canMove()` returns false when wall blocks
- [ ] `canMove()` returns true when path is clear
- [ ] `move()` updates position and increments steps
- [ ] `markVisited()` adds to Set correctly
- [ ] `hasVisited()` returns correct boolean
- [ ] `reset()` clears all state
- [ ] `isAtExit()` returns correct boolean

**Test Script:**
```javascript
const robot = new Robot(9, 0, 'up');
console.assert(robot.row === 9, 'Robot row should be 9');
console.assert(robot.col === 0, 'Robot col should be 0');
console.assert(robot.direction === 'up', 'Direction should be up');

console.assert(robot.getLeftDirection() === 'left', 'Left of up should be left');
console.assert(robot.getRightDirection() === 'right', 'Right of up should be right');
console.assert(robot.getBackDirection() === 'down', 'Back of up should be down');

robot.move(8, 0);
console.assert(robot.row === 8, 'Robot should have moved to row 8');
console.assert(robot.steps === 1, 'Steps should be 1');

console.assert(robot.hasVisited(9, 0), 'Start cell should be visited');
console.assert(robot.hasVisited(8, 0), 'New cell should be visited');

console.log('✅ All Robot basic tests passed');
```

---

### 📋 TASK 9: Robot Pathfinding - Left-Hand Wall Following
**Priority:** HIGH
**Dependencies:** Task 8
**Estimated Time:** 2.5 hours

#### Subtasks:
9.1. Implement `getNextDirection()` with left-hand rule
9.2. Implement dead-end detection
9.3. Implement backtracking logic
9.4. Track dead-end paths for red marking
9.5. Add initial orientation logic

#### Implementation Details:
```javascript
getNextDirection(maze) {
    // True left-hand wall following
    // Priority: Left → Forward → Right → Back

    const left = this.getLeftDirection();
    const forward = this.direction;
    const right = this.getRightDirection();
    const back = this.getBackDirection();

    // Try left first
    if (this.canMove(left, maze)) {
        return left;
    }

    // Try forward
    if (this.canMove(forward, maze)) {
        return forward;
    }

    // Try right
    if (this.canMove(right, maze)) {
        return right;
    }

    // Must go back (dead end)
    return back;
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

async stepOnce(maze) {
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
    this.move(nextCell.row, nextCell.col);

    return {
        from: { row: this.row - (nextCell.row - this.row), col: this.col - (nextCell.col - this.col) },
        to: { row: nextCell.row, col: nextCell.col },
        direction: nextDir,
        isBacktracking,
        isDeadEnd: isBacktracking
    };
}
```

#### Testing Criteria:
- [ ] Robot follows left-hand rule correctly
- [ ] Robot detects dead ends
- [ ] Robot can navigate simple maze (5x5) to exit
- [ ] Robot counts dead ends correctly
- [ ] Robot counts steps correctly
- [ ] Initial direction logic works correctly
- [ ] Test on maze with multiple dead ends

**Test Script:**
```javascript
const maze = new Maze(5, 'prim');
maze.generate('prim');
const robot = new Robot(maze.startCell.row, maze.startCell.col);
robot.determineInitialDirection(maze);

let iterations = 0;
const maxIterations = 1000;

while (!robot.isAtExit(maze.exitCell.row, maze.exitCell.col) && iterations < maxIterations) {
    robot.stepOnce(maze);
    iterations++;
}

console.assert(robot.isAtExit(maze.exitCell.row, maze.exitCell.col), 'Robot should reach exit');
console.log(`✅ Robot reached exit in ${robot.steps} steps`);
console.log(`Dead ends encountered: ${robot.deadEnds}`);
console.log(`Backtracks: ${robot.backtrackCount}`);
```

---

### 📋 TASK 10: Renderer Class - Basic Canvas Setup
**Priority:** HIGH
**Dependencies:** Task 4
**Estimated Time:** 1.5 hours

#### Subtasks:
10.1. Create `js/renderer.js` file
10.2. Implement constructor and initialization
10.3. Implement cell size calculation
10.4. Implement coordinate conversion methods
10.5. Implement clear() method

#### Implementation Details:
```javascript
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
}
```

#### Testing Criteria:
- [ ] Canvas initializes without errors
- [ ] Cell size is calculated correctly (800/10 = 80 for 10x10)
- [ ] Canvas clears to white
- [ ] `getCellCenter()` returns correct coordinates
- [ ] Test with different maze sizes (5, 10, 20, 50)

---

### 📋 TASK 11: Renderer - Maze Wall Rendering
**Priority:** HIGH
**Dependencies:** Task 10
**Estimated Time:** 2 hours

#### Subtasks:
11.1. Implement `renderWalls()` for single cell
11.2. Implement `renderMaze()` for entire maze
11.3. Implement wall thickness and color
11.4. Test with generated mazes

#### Implementation Details:
```javascript
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

updateCell(row, col, state) {
    // Re-render single cell
    this.renderCell(row, col, state);

    // Re-render walls (they might be on top of colored cell)
    // We need to get the cell to render its walls
    // This will be set by the game controller
}
```

#### Testing Criteria:
- [ ] Maze renders without errors
- [ ] All walls are visible
- [ ] Walls are black and appropriate thickness
- [ ] Cells are white initially
- [ ] Test with 5x5, 10x10, 20x20 mazes
- [ ] Zoom in to verify wall alignment
- [ ] No gaps between walls and cells

---

### 📋 TASK 12: Renderer - Robot and Exit Rendering
**Priority:** HIGH
**Dependencies:** Task 11
**Estimated Time:** 1.5 hours

#### Subtasks:
12.1. Implement `renderRobot()` with emoji
12.2. Implement robot rotation based on direction
12.3. Implement `renderExit()` with door emoji
12.4. Test robot visibility and position

#### Implementation Details:
```javascript
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
```

#### Testing Criteria:
- [ ] Robot emoji appears in correct cell
- [ ] Robot rotates correctly for each direction
- [ ] Door emoji appears at exit cell
- [ ] Emojis are appropriately sized
- [ ] Emojis don't overlap walls
- [ ] Test with different cell sizes

---

### 📋 TASK 13: Renderer - Animation System
**Priority:** HIGH
**Dependencies:** Task 12
**Estimated Time:** 2 hours

#### Subtasks:
13.1. Implement `animateMovement()` with requestAnimationFrame
13.2. Implement smooth interpolation
13.3. Handle animation cancellation
13.4. Test animation smoothness

#### Implementation Details:
```javascript
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

            // Clear only the robot's path area (optimization)
            // For now, we'll re-render the affected cells
            this.renderCell(fromRow, fromCol, 'unexplored'); // Will be updated with actual state
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
```

#### Testing Criteria:
- [ ] Animation is smooth (60fps)
- [ ] Robot moves from cell to cell without jumping
- [ ] Animation duration matches speed setting
- [ ] Animation completes and resolves promise
- [ ] Multiple animations can queue correctly
- [ ] Victory message displays correctly

---

### 📋 TASK 14: UI Controller Class
**Priority:** HIGH
**Dependencies:** Task 1, 2
**Estimated Time:** 2 hours

#### Subtasks:
14.1. Create `js/ui.js` file
14.2. Implement DOM element caching
14.3. Implement event binding
14.4. Implement settings lock/unlock
14.5. Implement statistics display updates

#### Implementation Details:
```javascript
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
            nextBtn: document.getElementById('next-btn'),
            statSteps: document.getElementById('stat-steps'),
            statDeadends: document.getElementById('stat-deadends'),
            statBacktracks: document.getElementById('stat-backtracks'),
            statTime: document.getElementById('stat-time'),
            victoryMessage: document.getElementById('victory-message')
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

        this.elements.nextBtn.addEventListener('click', () => {
            this.gameController.generateNewMaze();
        });
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
    }

    hideVictoryMessage() {
        this.elements.victoryMessage.classList.add('hidden');
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
}
```

#### Testing Criteria:
- [ ] All DOM elements are found
- [ ] Event listeners trigger correctly
- [ ] Settings lock disables correct inputs
- [ ] Settings unlock enables correct inputs
- [ ] Statistics update displays correctly
- [ ] Speed slider updates display value
- [ ] Victory message shows/hides correctly
- [ ] Next button shows/hides correctly

---

### 📋 TASK 15: Game Controller - Core Logic
**Priority:** HIGH
**Dependencies:** Tasks 5, 9, 13, 14
**Estimated Time:** 3 hours

#### Subtasks:
15.1. Create `js/main.js` file
15.2. Implement GameController constructor and initialization
15.3. Implement start/pause/resume/stop logic
15.4. Implement reset logic
15.5. Implement generateNewMaze logic
15.6. Implement settings management

#### Implementation Details:
```javascript
class GameController {
    constructor() {
        this.maze = null;
        this.robot = null;
        this.renderer = null;
        this.ui = null;

        this.speed = 5; // 1-10
        this.isPaused = false;
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;

        this.mazeSize = 10;
        this.algorithm = 'prim';
    }

    initialize() {
        // Initialize UI
        this.ui = new UIController();
        this.ui.initialize(this);

        // Get initial settings
        const settings = this.ui.getInputValues();
        this.mazeSize = settings.mazeSize;
        this.algorithm = settings.algorithm;
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

        // Create robot at start position
        this.robot = new Robot(
            this.maze.startCell.row,
            this.maze.startCell.col
        );
        this.robot.determineInitialDirection(this.maze);

        // Render
        this.renderer.initialize(this.mazeSize);
        this.renderer.renderComplete(this.maze, this.robot);

        // Reset UI
        this.ui.hideVictoryMessage();
        this.ui.hideNextButton();
        this.ui.unlockSettings();
        this.updateStatistics();
        this.ui.updateTimer(0);
    }

    setMazeSize(size) {
        if (!this.isRunning) {
            this.mazeSize = size;
            this.generateNewMaze();
        }
    }

    setAlgorithm(algorithm) {
        if (!this.isRunning) {
            this.algorithm = algorithm;
            this.generateNewMaze();
        }
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    lockSettings() {
        this.ui.lockSettings();
    }

    unlockSettings() {
        this.ui.unlockSettings();
    }

    updateStatistics() {
        const stats = this.robot.getStats();
        this.ui.updateStatistics(stats);
    }

    clearMemory() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.isRunning = false;
        this.isPaused = false;
        this.elapsedTime = 0;
    }

    reset() {
        this.stop();

        // Reset robot to start
        this.robot.reset(
            this.maze.startCell.row,
            this.maze.startCell.col
        );
        this.robot.determineInitialDirection(this.maze);

        // Reset all cell states
        this.maze.reset();

        // Re-render
        this.renderer.renderComplete(this.maze, this.robot);

        // Reset UI
        this.updateStatistics();
        this.ui.updateTimer(0);
        this.unlockSettings();
    }

    stop() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Placeholder for game loop - will implement in next task
    async start() {
        console.log('Start - to be implemented');
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        this.gameLoop();
    }

    async gameLoop() {
        console.log('Game loop - to be implemented');
    }

    async stepRobot() {
        console.log('Step robot - to be implemented');
    }

    onVictory() {
        console.log('Victory - to be implemented');
    }
}

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameController();
    game.initialize();
});
```

#### Testing Criteria:
- [ ] Page loads without errors
- [ ] Initial maze generates and renders
- [ ] Settings changes regenerate maze
- [ ] Robot appears at start position
- [ ] Exit appears at top-right
- [ ] Statistics display shows zeros
- [ ] All buttons are in correct enabled/disabled state

---

### 📋 TASK 16: Game Controller - Game Loop Implementation
**Priority:** HIGH
**Dependencies:** Task 15
**Estimated Time:** 3 hours

#### Subtasks:
16.1. Implement main game loop
16.2. Implement stepRobot() with animation
16.3. Implement timer functionality
16.4. Handle victory condition
16.5. Implement cell state updates

#### Implementation Details:
```javascript
async start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.lockSettings();

    // Start timer
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
        if (!this.isPaused) {
            this.elapsedTime = (Date.now() - this.startTime) / 1000;
            this.ui.updateTimer(this.elapsedTime);
        }
    }, 100);

    // Start game loop
    this.gameLoop();
}

async gameLoop() {
    while (this.isRunning && !this.robot.isAtExit(this.maze.exitCell.row, this.maze.exitCell.col)) {
        if (!this.isPaused) {
            await this.stepRobot();
            this.updateStatistics();

            // Calculate delay based on speed (1-10)
            // Speed 1 = 1000ms, Speed 10 = 100ms
            const delay = 1100 - (this.speed * 100);
            await this.sleep(delay);
        } else {
            // If paused, wait and check again
            await this.sleep(100);
        }
    }

    // Check if we reached the exit
    if (this.robot.isAtExit(this.maze.exitCell.row, this.maze.exitCell.col)) {
        this.onVictory();
    }
}

async stepRobot() {
    const currentRow = this.robot.row;
    const currentCol = this.robot.col;

    // Get next direction using left-hand rule
    const nextDir = this.robot.getNextDirection(this.maze);
    const isBacktracking = nextDir === this.robot.getBackDirection();

    // Update current cell state
    if (isBacktracking) {
        // Mark current cell as dead end
        const currentCell = this.maze.getCell(currentRow, currentCol);
        currentCell.setState('deadend');
        this.renderer.updateCell(currentRow, currentCol, 'deadend');

        this.robot.deadEnds++;
        this.robot.backtrackCount++;
    } else {
        // Mark current cell as explored
        const currentCell = this.maze.getCell(currentRow, currentCol);
        if (currentCell.getState() !== 'explored') {
            currentCell.setState('explored');
            this.renderer.updateCell(currentRow, currentCol, 'explored');
        }
    }

    // Turn and move
    this.robot.turn(nextDir);
    const nextCell = this.robot.getNextCell(nextDir);

    // Animate movement
    const duration = 1100 - (this.speed * 100);
    await this.renderer.animateMovement(
        currentRow, currentCol,
        nextCell.row, nextCell.col,
        nextDir,
        duration * 0.8 // Animation slightly faster than delay
    );

    // Update robot position
    this.robot.move(nextCell.row, nextCell.col);

    // If we moved to a previously red cell via non-backtracking, turn it green
    const newCell = this.maze.getCell(nextCell.row, nextCell.col);
    if (!isBacktracking && newCell.getState() === 'deadend') {
        newCell.setState('explored');
        this.renderer.updateCell(nextCell.row, nextCell.col, 'explored');
    }

    // Re-render maze and robot
    this.renderer.renderComplete(this.maze, this.robot);
}

onVictory() {
    this.stop();
    this.unlockSettings();

    // Show victory message
    this.ui.showVictoryMessage();
    this.ui.showNextButton();

    // Also draw on canvas
    this.renderer.showVictory('Robot Reached the Exit!');
}

sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

#### Testing Criteria:
- [ ] Game loop runs without errors
- [ ] Robot moves step by step
- [ ] Timer updates every 100ms
- [ ] Speed control affects movement speed
- [ ] Pause button stops movement
- [ ] Resume button continues movement
- [ ] Robot reaches exit in valid maze
- [ ] Victory message displays on completion
- [ ] Green cells appear for explored paths
- [ ] Red cells appear for dead ends
- [ ] Red cells can turn green when revisited

---

### 📋 TASK 17: Integration Testing and Bug Fixes
**Priority:** HIGH
**Dependencies:** Task 16
**Estimated Time:** 3 hours

#### Subtasks:
17.1. Test complete game flow (start to finish)
17.2. Test all three maze algorithms
17.3. Test all button interactions
17.4. Test edge cases (1x1 maze impossible, but 5x5 minimum)
17.5. Fix animation rendering issues
17.6. Fix cell state update bugs
17.7. Test responsive design

#### Testing Checklist:
- [ ] **Complete Game Flow**
  - [ ] Load page → maze generates
  - [ ] Press Start → robot begins moving
  - [ ] Adjust speed during run → speed changes
  - [ ] Press Pause → robot stops
  - [ ] Press Resume → robot continues
  - [ ] Robot reaches exit → victory message
  - [ ] Press Next → new maze generates
  - [ ] Press Reset during run → robot returns to start

- [ ] **Maze Generation**
  - [ ] Randomized Prim generates valid maze
  - [ ] Recursive Backtracking generates valid maze
  - [ ] Kruskal generates valid maze
  - [ ] All mazes are solvable
  - [ ] 5x5 maze works
  - [ ] 50x50 maze works and performs well

- [ ] **Robot Behavior**
  - [ ] Robot uses true left-hand wall following
  - [ ] Robot counts steps correctly
  - [ ] Robot counts dead ends correctly
  - [ ] Robot counts backtracks correctly
  - [ ] Robot reaches exit every time
  - [ ] Robot initial direction is correct

- [ ] **UI/UX**
  - [ ] All buttons work
  - [ ] Settings lock during run
  - [ ] Statistics update in real-time
  - [ ] Timer displays correctly
  - [ ] Victory message appears
  - [ ] Next button appears after victory

- [ ] **Visual/Rendering**
  - [ ] Walls render correctly
  - [ ] Green cells appear
  - [ ] Red cells appear for dead ends
  - [ ] Red→green override works
  - [ ] Robot emoji displays
  - [ ] Door emoji displays
  - [ ] Animation is smooth

- [ ] **Performance**
  - [ ] 10x10 maze runs smoothly
  - [ ] 50x50 maze runs smoothly
  - [ ] No memory leaks after multiple games
  - [ ] Canvas clears properly between games

---

### 📋 TASK 18: Polish and Final Features
**Priority:** MEDIUM
**Dependencies:** Task 17
**Estimated Time:** 2 hours

#### Subtasks:
18.1. Add localStorage for settings persistence
18.2. Improve victory message styling
18.3. Add keyboard shortcuts (Space=Pause, R=Reset, N=Next)
18.4. Add subtle sound effects (optional)
18.5. Improve mobile responsiveness
18.6. Add tooltips for controls
18.7. Add "About" or "Help" section

#### Implementation Details:
```javascript
// Settings persistence
class GameController {
    saveSettings() {
        localStorage.setItem('robotMaze_settings', JSON.stringify({
            mazeSize: this.mazeSize,
            algorithm: this.algorithm,
            speed: this.speed
        }));
    }

    loadSettings() {
        const saved = localStorage.getItem('robotMaze_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.mazeSize = settings.mazeSize || 10;
            this.algorithm = settings.algorithm || 'prim';
            this.speed = settings.speed || 5;

            // Update UI
            this.ui.elements.mazeSize.value = this.mazeSize;
            this.ui.elements.algorithm.value = this.algorithm;
            this.ui.elements.speed.value = this.speed;
            this.ui.updateSpeedDisplay();
        }
    }

    initialize() {
        // ... existing code ...

        this.loadSettings();

        // ... rest of initialization ...

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isRunning) {
                e.preventDefault();
                if (this.isPaused) {
                    this.resume();
                    this.ui.elements.pauseBtn.textContent = 'Pause';
                } else {
                    this.pause();
                    this.ui.elements.pauseBtn.textContent = 'Resume';
                }
            } else if (e.code === 'KeyR' && !this.isRunning) {
                this.reset();
            } else if (e.code === 'KeyN' && !this.isRunning) {
                this.generateNewMaze();
            }
        });
    }
}
```

#### Testing Criteria:
- [ ] Settings persist after page reload
- [ ] Keyboard shortcuts work
- [ ] Mobile layout is usable
- [ ] Victory message is polished
- [ ] All features work together

---

### 📋 TASK 19: Documentation and Code Quality
**Priority:** MEDIUM
**Dependencies:** Task 18
**Estimated Time:** 2 hours

#### Subtasks:
19.1. Add JSDoc comments to all classes and methods
19.2. Create README.md with usage instructions
19.3. Add inline comments for complex logic
19.4. Run code through linter (ESLint)
19.5. Fix linting errors
19.6. Create CHANGELOG.md

#### Testing Criteria:
- [ ] All classes have JSDoc comments
- [ ] All public methods documented
- [ ] README is comprehensive
- [ ] Code passes ESLint
- [ ] No console warnings or errors

---

### 📋 TASK 20: Final Testing and Deployment
**Priority:** HIGH
**Dependencies:** Task 19
**Estimated Time:** 2 hours

#### Subtasks:
20.1. Cross-browser testing (Chrome, Firefox, Safari, Edge)
20.2. Mobile device testing (iOS, Android)
20.3. Performance profiling
20.4. Fix any remaining bugs
20.5. Create deployment build
20.6. Deploy to hosting (GitHub Pages, Netlify, etc.)

#### Testing Criteria:
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on iOS mobile
- [ ] Works on Android mobile
- [ ] Performance is acceptable on all platforms
- [ ] Deployed and accessible via URL

---

## Testing Strategy

### ⚠️ IMPORTANT: Test-Driven Development Requirement

**Every task MUST include writing and running unit tests BEFORE marking the task as complete.**

Each new feature must:
1. ✅ Have comprehensive unit tests written
2. ✅ Pass all new tests
3. ✅ Pass all existing tests (regression testing)
4. ✅ Be validated with the test suite before moving to next task

This ensures:
- No broken functionality as you build
- Immediate feedback on correctness
- Confidence in refactoring
- Documentation through tests

---

### Unit Testing Framework

Create a comprehensive test suite using a simple custom test framework:

#### File Structure for Testing
```
robo-maze/
├── tests/
│   ├── test.html           # Test runner HTML
│   ├── test-framework.js   # Simple test framework
│   ├── test-cell.js        # Cell class tests
│   ├── test-maze.js        # Maze class tests
│   ├── test-robot.js       # Robot class tests
│   └── test-renderer.js    # Renderer class tests
└── js/
    └── ... (source files)
```

#### Test Framework (`tests/test-framework.js`)

```javascript
class TestFramework {
    constructor() {
        this.tests = [];
        this.results = { passed: 0, failed: 0, total: 0 };
        this.currentSuite = '';
    }

    describe(suiteName, callback) {
        this.currentSuite = suiteName;
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📦 Test Suite: ${suiteName}`);
        console.log('='.repeat(60));
        callback();
    }

    it(description, testFn) {
        this.results.total++;
        try {
            testFn();
            this.results.passed++;
            console.log(`✅ ${description}`);
        } catch (error) {
            this.results.failed++;
            console.error(`❌ ${description}`);
            console.error(`   Error: ${error.message}`);
            if (error.stack) {
                console.error(`   Stack: ${error.stack.split('\n')[1]}`);
            }
        }
    }

    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${expected} but got ${actual}`);
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
                }
            },
            toBeTrue: () => {
                if (actual !== true) {
                    throw new Error(`Expected true but got ${actual}`);
                }
            },
            toBeFalse: () => {
                if (actual !== false) {
                    throw new Error(`Expected false but got ${actual}`);
                }
            },
            toBeNull: () => {
                if (actual !== null) {
                    throw new Error(`Expected null but got ${actual}`);
                }
            },
            toBeGreaterThan: (expected) => {
                if (actual <= expected) {
                    throw new Error(`Expected ${actual} to be greater than ${expected}`);
                }
            },
            toContain: (expected) => {
                if (!actual.includes(expected)) {
                    throw new Error(`Expected ${actual} to contain ${expected}`);
                }
            },
            toThrow: () => {
                let threw = false;
                try {
                    actual();
                } catch (e) {
                    threw = true;
                }
                if (!threw) {
                    throw new Error('Expected function to throw an error');
                }
            }
        };
    }

    printSummary() {
        console.log(`\n${'='.repeat(60)}`);
        console.log('📊 Test Summary');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);

        const percentage = ((this.results.passed / this.results.total) * 100).toFixed(1);
        console.log(`Success Rate: ${percentage}%`);

        if (this.results.failed === 0) {
            console.log('\n🎉 All tests passed!');
        } else {
            console.log(`\n⚠️  ${this.results.failed} test(s) failed`);
        }
        console.log('='.repeat(60));

        // Visual indicator in DOM
        const resultsDiv = document.getElementById('test-results');
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div style="padding: 20px; margin: 20px; border-radius: 8px;
                     background: ${this.results.failed === 0 ? '#10b981' : '#ef4444'}; color: white;">
                    <h2>${this.results.failed === 0 ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}</h2>
                    <p>Total: ${this.results.total} | Passed: ${this.results.passed} | Failed: ${this.results.failed}</p>
                    <p>Success Rate: ${percentage}%</p>
                </div>
            `;
        }
    }
}

// Create global test instance
const test = new TestFramework();
```

#### Test Runner HTML (`tests/test.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robot Maze - Test Suite</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: #4ec9b0;
            border-bottom: 2px solid #4ec9b0;
            padding-bottom: 10px;
        }
        #test-results {
            margin-top: 20px;
        }
        .instructions {
            background: #2d2d2d;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #4ec9b0;
        }
        pre {
            background: #2d2d2d;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>🤖 Robot Maze - Automated Test Suite</h1>

    <div class="instructions">
        <p><strong>Instructions:</strong> Open the browser console (F12) to see detailed test results.</p>
        <p>Tests run automatically on page load. All tests must pass before proceeding to the next task.</p>
    </div>

    <div id="test-results"></div>

    <!-- Load source files -->
    <script src="../js/maze.js"></script>
    <script src="../js/robot.js"></script>
    <script src="../js/renderer.js"></script>
    <!-- Add more as you build them -->

    <!-- Load test framework -->
    <script src="test-framework.js"></script>

    <!-- Load test suites -->
    <script src="test-cell.js"></script>
    <script src="test-maze.js"></script>
    <script src="test-robot.js"></script>
    <!-- Add more test files as needed -->

    <!-- Run all tests and display summary -->
    <script>
        test.printSummary();
    </script>
</body>
</html>
```

#### Example Test File: Cell Class (`tests/test-cell.js`)

```javascript
test.describe('Cell Class Tests', () => {

    test.it('should initialize with correct row and column', () => {
        const cell = new Cell(5, 3);
        test.expect(cell.row).toBe(5);
        test.expect(cell.col).toBe(3);
    });

    test.it('should have all walls initially', () => {
        const cell = new Cell(0, 0);
        test.expect(cell.hasWall('top')).toBeTrue();
        test.expect(cell.hasWall('right')).toBeTrue();
        test.expect(cell.hasWall('bottom')).toBeTrue();
        test.expect(cell.hasWall('left')).toBeTrue();
    });

    test.it('should remove walls correctly', () => {
        const cell = new Cell(0, 0);
        cell.removeWall('top');
        test.expect(cell.hasWall('top')).toBeFalse();
        test.expect(cell.hasWall('right')).toBeTrue();
    });

    test.it('should return deep copy of walls', () => {
        const cell = new Cell(0, 0);
        const walls = cell.getWalls();
        walls.top = false;
        test.expect(cell.hasWall('top')).toBeTrue();
    });

    test.it('should set state correctly', () => {
        const cell = new Cell(0, 0);
        cell.setState('explored');
        test.expect(cell.getState()).toBe('explored');
    });

    test.it('should reject invalid states', () => {
        const cell = new Cell(0, 0);
        cell.setState('invalid');
        test.expect(cell.getState()).toBe('unexplored');
    });

    test.it('should track visited status', () => {
        const cell = new Cell(0, 0);
        test.expect(cell.isVisited()).toBeFalse();
        cell.markVisited();
        test.expect(cell.isVisited()).toBeTrue();
    });

    test.it('should reset state and visited flag', () => {
        const cell = new Cell(0, 0);
        cell.markVisited();
        cell.setState('explored');
        cell.reset();
        test.expect(cell.isVisited()).toBeFalse();
        test.expect(cell.getState()).toBe('unexplored');
    });
});
```

#### Example Test File: Maze Class (`tests/test-maze.js`)

```javascript
test.describe('Maze Class Tests', () => {

    test.it('should initialize with correct size', () => {
        const maze = new Maze(10);
        test.expect(maze.size).toBe(10);
        test.expect(maze.grid.length).toBe(10);
        test.expect(maze.grid[0].length).toBe(10);
    });

    test.it('should set start and exit correctly', () => {
        const maze = new Maze(10);
        test.expect(maze.startCell.row).toBe(9);
        test.expect(maze.startCell.col).toBe(0);
        test.expect(maze.exitCell.row).toBe(0);
        test.expect(maze.exitCell.col).toBe(9);
    });

    test.it('should return cell at valid coordinates', () => {
        const maze = new Maze(10);
        const cell = maze.getCell(5, 5);
        test.expect(cell).not.toBeNull();
        test.expect(cell.row).toBe(5);
        test.expect(cell.col).toBe(5);
    });

    test.it('should return null for invalid coordinates', () => {
        const maze = new Maze(10);
        test.expect(maze.getCell(-1, 0)).toBeNull();
        test.expect(maze.getCell(10, 0)).toBeNull();
        test.expect(maze.getCell(0, -1)).toBeNull();
        test.expect(maze.getCell(0, 10)).toBeNull();
    });

    test.it('should return correct number of neighbors', () => {
        const maze = new Maze(10);
        // Corner cell
        test.expect(maze.getNeighbors(0, 0).length).toBe(2);
        // Edge cell
        test.expect(maze.getNeighbors(0, 5).length).toBe(3);
        // Middle cell
        test.expect(maze.getNeighbors(5, 5).length).toBe(4);
    });

    test.it('should remove walls between cells correctly', () => {
        const maze = new Maze(10);
        const cell1 = maze.getCell(5, 5);
        const cell2 = maze.getCell(5, 6);

        maze.removeBetweenWalls(cell1, cell2);

        test.expect(cell1.hasWall('right')).toBeFalse();
        test.expect(cell2.hasWall('left')).toBeFalse();
    });

    test.it('should validate paths correctly', () => {
        const maze = new Maze(10);
        const cell1 = maze.getCell(5, 5);
        const cell2 = maze.getCell(5, 6);

        // Wall exists - invalid
        test.expect(maze.isValidPath(5, 5, 5, 6)).toBeFalse();

        // Remove wall - valid
        maze.removeBetweenWalls(cell1, cell2);
        test.expect(maze.isValidPath(5, 5, 5, 6)).toBeTrue();
    });

    test.it('should generate valid maze with Prim algorithm', () => {
        const maze = new Maze(10, 'prim');
        maze.generate('prim');

        // All cells should be visited
        for (let row = 0; row < maze.size; row++) {
            for (let col = 0; col < maze.size; col++) {
                test.expect(maze.getCell(row, col).isVisited()).toBeTrue();
            }
        }
    });

    test.it('should reset all cells', () => {
        const maze = new Maze(10);
        maze.generate('prim');
        maze.reset();

        for (let row = 0; row < maze.size; row++) {
            for (let col = 0; col < maze.size; col++) {
                const cell = maze.getCell(row, col);
                test.expect(cell.isVisited()).toBeFalse();
                test.expect(cell.getState()).toBe('unexplored');
            }
        }
    });
});
```

#### Example Test File: Robot Class (`tests/test-robot.js`)

```javascript
test.describe('Robot Class Tests', () => {

    test.it('should initialize at correct position', () => {
        const robot = new Robot(9, 0, 'up');
        test.expect(robot.row).toBe(9);
        test.expect(robot.col).toBe(0);
        test.expect(robot.direction).toBe('up');
    });

    test.it('should mark starting position as visited', () => {
        const robot = new Robot(5, 5);
        test.expect(robot.hasVisited(5, 5)).toBeTrue();
    });

    test.it('should get correct left direction', () => {
        const robot = new Robot(0, 0, 'up');
        test.expect(robot.getLeftDirection()).toBe('left');

        robot.direction = 'left';
        test.expect(robot.getLeftDirection()).toBe('down');

        robot.direction = 'down';
        test.expect(robot.getLeftDirection()).toBe('right');

        robot.direction = 'right';
        test.expect(robot.getLeftDirection()).toBe('up');
    });

    test.it('should get correct right direction', () => {
        const robot = new Robot(0, 0, 'up');
        test.expect(robot.getRightDirection()).toBe('right');

        robot.direction = 'right';
        test.expect(robot.getRightDirection()).toBe('down');
    });

    test.it('should get correct back direction', () => {
        const robot = new Robot(0, 0, 'up');
        test.expect(robot.getBackDirection()).toBe('down');

        robot.direction = 'left';
        test.expect(robot.getBackDirection()).toBe('right');
    });

    test.it('should move and increment steps', () => {
        const robot = new Robot(5, 5);
        test.expect(robot.steps).toBe(0);

        robot.move(5, 6);
        test.expect(robot.row).toBe(5);
        test.expect(robot.col).toBe(6);
        test.expect(robot.steps).toBe(1);
        test.expect(robot.hasVisited(5, 6)).toBeTrue();
    });

    test.it('should detect exit correctly', () => {
        const robot = new Robot(0, 8);
        test.expect(robot.isAtExit(0, 9)).toBeFalse();

        robot.move(0, 9);
        test.expect(robot.isAtExit(0, 9)).toBeTrue();
    });

    test.it('should reset all state', () => {
        const robot = new Robot(5, 5);
        robot.move(5, 6);
        robot.deadEnds = 3;
        robot.backtrackCount = 5;

        robot.reset(9, 0, 'up');

        test.expect(robot.row).toBe(9);
        test.expect(robot.col).toBe(0);
        test.expect(robot.direction).toBe('up');
        test.expect(robot.steps).toBe(0);
        test.expect(robot.deadEnds).toBe(0);
        test.expect(robot.backtrackCount).toBe(0);
        test.expect(robot.visitedCells.size).toBe(1);
    });

    test.it('should return correct stats', () => {
        const robot = new Robot(0, 0);
        robot.steps = 42;
        robot.deadEnds = 3;
        robot.backtrackCount = 7;

        const stats = robot.getStats();
        test.expect(stats.steps).toBe(42);
        test.expect(stats.deadEnds).toBe(3);
        test.expect(stats.backtrackCount).toBe(7);
    });

    test.it('should validate movement with maze', () => {
        const maze = new Maze(10);
        maze.generate('prim');
        const robot = new Robot(9, 0);

        // canMove should return boolean
        const canMoveUp = robot.canMove('up', maze);
        test.expect(typeof canMoveUp).toBe('boolean');
    });
});
```

---

### Integration Testing
Test complete workflows:
1. Generate maze → Verify valid
2. Start robot → Verify reaches exit
3. Pause/Resume → Verify state maintained
4. Reset → Verify clean state
5. Next → Verify new maze

### Performance Testing
- Use Chrome DevTools Performance tab
- Profile 50x50 maze generation time
- Profile animation frame rate
- Check memory usage over multiple games

### Browser Testing
Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Android Chrome

---

## Build and Validation Commands

```bash
# 🧪 RUN TESTS (MOST IMPORTANT!)
# Start local server
python3 -m http.server 8000

# Then open in browser:
# http://localhost:8000/tests/test.html
# ⚠️ Check console (F12) for detailed test results
# ✅ Look for "All tests passed!" message

# Alternative: Use live-server (auto-reload)
npx live-server --port=8000

# HTML Validation
# Visit: https://validator.w3.org/

# CSS Validation
# Visit: https://jigsaw.w3.org/css-validator/

# JavaScript Linting (if using ESLint)
npx eslint js/**/*.js

# Watch for file changes and auto-reload tests
# Install: npm install -g live-server
# Run: live-server --port=8000 --open=/tests/test.html
```

### Quick Test Workflow

**After implementing any feature:**

1. **Start server**: `python3 -m http.server 8000`
2. **Open tests**: Navigate to `http://localhost:8000/tests/test.html`
3. **Open console**: Press `F12` in browser
4. **Verify**: Look for green "✅ All Tests Passed!" banner
5. **Fix issues**: If any red ❌, fix the code or test
6. **Refresh**: Page auto-updates, check again
7. **Proceed**: Only when 100% pass rate achieved

**Expected Console Output:**
```
============================================================
📦 Test Suite: Cell Class Tests
============================================================
✅ should initialize with correct row and column
✅ should have all walls initially
✅ should remove walls correctly
... (more tests)

============================================================
📊 Test Summary
============================================================
Total Tests: 54
✅ Passed: 54
❌ Failed: 0
Success Rate: 100.0%

🎉 All tests passed!
```

---

## Success Criteria

### Functional Requirements
- ✅ Maze generates with exactly one path from start to exit
- ✅ Three different maze generation algorithms work
- ✅ Robot successfully navigates to exit using left-hand rule
- ✅ All UI controls function correctly
- ✅ Statistics track accurately
- ✅ Timer works correctly
- ✅ Victory condition triggers

### Non-Functional Requirements
- ✅ Code is well-organized and modular
- ✅ Performance is smooth (60fps) for mazes up to 50x50
- ✅ Works on desktop and mobile browsers
- ✅ Code is documented
- ✅ No console errors or warnings

---

## Estimated Total Time
- **Total Implementation Time**: 35-40 hours (includes writing tests)
- **Testing Time**: ~8-10 hours (built into task estimates)
- **Can be completed in**: 5-7 days (working 6-8 hours/day)

---

## 🎯 Final Checklist Before Project Completion

Before marking the entire project as complete, verify:

### Code Completion
- [ ] All 20 tasks completed
- [ ] All features from requirements implemented
- [ ] Code is clean and well-organized

### Testing
- [ ] ✅ **54+ unit tests written and passing** (CRITICAL!)
- [ ] All test files created in `tests/` directory
- [ ] Test framework implemented
- [ ] 100% test pass rate achieved
- [ ] Integration tests validate complete workflows
- [ ] Performance tests show acceptable metrics

### Documentation
- [ ] Code has JSDoc comments
- [ ] README.md created with usage instructions
- [ ] All complex logic has inline comments

### Quality Assurance
- [ ] HTML validates (W3C validator)
- [ ] CSS validates (W3C CSS validator)
- [ ] No console errors or warnings
- [ ] Tested in Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive design works

### Deployment
- [ ] Project deployed to hosting platform
- [ ] Accessible via public URL
- [ ] All features work in production

---

## 📚 Additional Resources

**Testing Best Practices:**
- Write tests before marking task complete
- Run ALL tests after every change
- Never skip testing to "save time"
- Tests are documentation of expected behavior

**Debugging Tips:**
- Use `console.log()` liberally during development
- Browser DevTools are your friend (F12)
- Test in small increments
- If a test fails, fix it immediately

**Getting Help:**
- Review the plan documents for specifications
- Check the test examples for expected behavior
- Use browser console to debug JavaScript
- Test one feature at a time

---

**Last Updated**: 2025-10-05

**Remember**: The test suite is not optional! It's your safety net and proof that everything works correctly. A project with 100% passing tests is a project you can confidently deploy and maintain. 🚀
