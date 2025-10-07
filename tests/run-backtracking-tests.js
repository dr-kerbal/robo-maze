// Load Maze and Cell classes
const { Cell, Maze } = require('../js/maze.js');

// Simple test runner
let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (!condition) {
        console.error('❌ FAILED:', message);
        failed++;
        return false;
    }
    console.log('✅ PASSED:', message);
    passed++;
    return true;
}

console.log('Running Recursive Backtracking Tests...\n');

// Test 1: Algorithm completes without errors
try {
    const maze1 = new Maze(10, 'backtracking');
    maze1.generate('backtracking');
    assert(true, 'Algorithm completes without errors');
} catch (e) {
    assert(false, 'Algorithm should not throw errors: ' + e.message);
}

// Test 2: All cells are visited
const maze2 = new Maze(10, 'backtracking');
maze2.generate('backtracking');
let allVisited = true;
for (let row = 0; row < maze2.size; row++) {
    for (let col = 0; col < maze2.size; col++) {
        if (!maze2.getCell(row, col).isVisited()) {
            allVisited = false;
        }
    }
}
assert(allVisited, 'All cells should be visited');

// Test 3: Performance test
const startTime = Date.now();
const largeMaze = new Maze(50, 'backtracking');
largeMaze.generate('backtracking');
const elapsed = Date.now() - startTime;
assert(elapsed < 500, `50x50 maze should generate in < 500ms (took ${elapsed}ms)`);

// Test 4: Path exists from start to exit
function isConnected(maze, startRow, startCol, targetRow, targetCol) {
    const visited = new Set();
    const queue = [{row: startRow, col: startCol}];
    visited.add(`${startRow},${startCol}`);

    while (queue.length > 0) {
        const current = queue.shift();

        if (current.row === targetRow && current.col === targetCol) {
            return true;
        }

        const dirs = [
            {row: -1, col: 0},
            {row: 1, col: 0},
            {row: 0, col: -1},
            {row: 0, col: 1}
        ];

        for (const d of dirs) {
            const newRow = current.row + d.row;
            const newCol = current.col + d.col;
            const key = `${newRow},${newCol}`;

            if (!visited.has(key) && maze.isValidPath(current.row, current.col, newRow, newCol)) {
                visited.add(key);
                queue.push({row: newRow, col: newCol});
            }
        }
    }

    return false;
}

const maze4 = new Maze(10, 'backtracking');
maze4.generate('backtracking');
const connected = isConnected(maze4, maze4.startCell.row, maze4.startCell.col, maze4.exitCell.row, maze4.exitCell.col);
assert(connected, 'Path should exist from start to exit');

console.log('\n========================================');
console.log('Test Results:');
console.log('Total:', passed + failed);
console.log('✅ Passed:', passed);
console.log('❌ Failed:', failed);
console.log('========================================');

process.exit(failed > 0 ? 1 : 0);
