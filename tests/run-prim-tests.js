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

console.log('Running Prim\'s Algorithm Tests...\n');

// Test 1: Algorithm completes without errors
try {
    const maze1 = new Maze(10, 'prim');
    maze1.generate('prim');
    assert(true, 'Algorithm completes without errors');
} catch (e) {
    assert(false, 'Algorithm should not throw errors: ' + e.message);
}

// Test 2: All cells are visited
const maze2 = new Maze(10, 'prim');
maze2.generate('prim');
let allVisited = true;
for (let row = 0; row < maze2.size; row++) {
    for (let col = 0; col < maze2.size; col++) {
        if (!maze2.getCell(row, col).isVisited()) {
            allVisited = false;
        }
    }
}
assert(allVisited, 'All cells should be visited');

// Test 3: Walls are removed
const maze3 = new Maze(10, 'prim');
maze3.generate('prim');
let wallsRemoved = 0;
for (let row = 0; row < maze3.size; row++) {
    for (let col = 0; col < maze3.size; col++) {
        const cell = maze3.getCell(row, col);
        const walls = cell.getWalls();
        if (!walls.top || !walls.right || !walls.bottom || !walls.left) {
            wallsRemoved++;
        }
    }
}
assert(wallsRemoved > 0, `Some walls should be removed (${wallsRemoved}/${maze3.size * maze3.size})`);

// Test 4: Generate multiple mazes (all should be valid)
let allMazesValid = true;
for (let i = 0; i < 5; i++) {
    const maze = new Maze(10, 'prim');
    maze.generate('prim');

    // Check all cells visited
    for (let row = 0; row < maze.size; row++) {
        for (let col = 0; col < maze.size; col++) {
            if (!maze.getCell(row, col).isVisited()) {
                allMazesValid = false;
            }
        }
    }
}
assert(allMazesValid, 'Multiple maze generations should all be valid');

// Test 5: Different sizes work
try {
    const small = new Maze(5, 'prim');
    small.generate('prim');
    const large = new Maze(20, 'prim');
    large.generate('prim');

    let smallValid = true;
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (!small.getCell(row, col).isVisited()) smallValid = false;
        }
    }

    let largeValid = true;
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 20; col++) {
            if (!large.getCell(row, col).isVisited()) largeValid = false;
        }
    }

    assert(smallValid && largeValid, 'Different maze sizes should generate correctly');
} catch (e) {
    assert(false, 'Different sizes should work: ' + e.message);
}

// Test 6: Performance test (50x50 should complete quickly)
const startTime = Date.now();
const largeMaze = new Maze(50, 'prim');
largeMaze.generate('prim');
const elapsed = Date.now() - startTime;
assert(elapsed < 1000, `50x50 maze should generate in < 1 second (took ${elapsed}ms)`);

// Test 7: Maze is connected (path exists from random cells)
const maze7 = new Maze(10, 'prim');
maze7.generate('prim');

// Simple BFS to check connectivity from start cell
function isConnected(maze, startRow, startCol, targetRow, targetCol) {
    const visited = new Set();
    const queue = [{row: startRow, col: startCol}];
    visited.add(`${startRow},${startCol}`);

    while (queue.length > 0) {
        const current = queue.shift();

        if (current.row === targetRow && current.col === targetCol) {
            return true;
        }

        // Check all 4 directions
        const dirs = [
            {row: -1, col: 0, dir: 'top'},
            {row: 1, col: 0, dir: 'bottom'},
            {row: 0, col: -1, dir: 'left'},
            {row: 0, col: 1, dir: 'right'}
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

const connected = isConnected(maze7, maze7.startCell.row, maze7.startCell.col, maze7.exitCell.row, maze7.exitCell.col);
assert(connected, 'Path should exist from start to exit');

console.log('\n========================================');
console.log('Test Results:');
console.log('Total:', passed + failed);
console.log('✅ Passed:', passed);
console.log('❌ Failed:', failed);
console.log('========================================');

process.exit(failed > 0 ? 1 : 0);
