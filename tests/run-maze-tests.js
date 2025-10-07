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

console.log('Running Maze Class Tests...\n');

// Test 1: Grid size
const maze1 = new Maze(10);
assert(maze1.size === 10 && maze1.grid.length === 10 && maze1.grid[0].length === 10, 'should create grid of correct size');

// Test 2: Initial walls
const maze2 = new Maze(5);
const cell2 = maze2.getCell(2, 2);
assert(cell2.hasWall('top') && cell2.hasWall('right') && cell2.hasWall('bottom') && cell2.hasWall('left'), 'should initialize all cells with 4 walls');

// Test 3: getCell
const maze3 = new Maze(10);
const cell3 = maze3.getCell(5, 5);
assert(cell3 !== null && cell3.row === 5 && cell3.col === 5, 'should return correct cell for valid coordinates');
assert(maze3.getCell(15, 15) === null, 'should return null for invalid coordinates');

// Test 4: Neighbors
const maze4 = new Maze(10);
assert(maze4.getNeighbors(0, 0).length === 2, 'corner cell should have 2 neighbors');
assert(maze4.getNeighbors(0, 5).length === 3, 'edge cell should have 3 neighbors');
assert(maze4.getNeighbors(5, 5).length === 4, 'middle cell should have 4 neighbors');

// Test 5: Remove walls
const maze5 = new Maze(10);
const cell5a = maze5.getCell(5, 5);
const cell5b = maze5.getCell(5, 6);
maze5.removeBetweenWalls(cell5a, cell5b);
assert(!cell5a.hasWall('right') && !cell5b.hasWall('left'), 'should remove walls between adjacent cells');

// Test 6: Valid path with wall
const maze6 = new Maze(10);
assert(!maze6.isValidPath(5, 5, 5, 6), 'should validate path as invalid when wall exists');

// Test 7: Valid path without wall
const maze7 = new Maze(10);
const cell7a = maze7.getCell(5, 5);
const cell7b = maze7.getCell(5, 6);
maze7.removeBetweenWalls(cell7a, cell7b);
assert(maze7.isValidPath(5, 5, 5, 6), 'should validate path as valid when wall is removed');

// Test 8: Start and exit positions
const maze8 = new Maze(10);
assert(maze8.startCell.row === 9 && maze8.startCell.col === 0, 'should have correct start position');
assert(maze8.exitCell.row === 0 && maze8.exitCell.col === 9, 'should have correct exit position');

// Test 9: Reset
const maze9 = new Maze(5);
const cell9 = maze9.getCell(2, 2);
cell9.markVisited();
cell9.setState('explored');
maze9.reset();
assert(!cell9.isVisited() && cell9.getState() === 'unexplored', 'should reset all cells');

// Test 10: Out of bounds
const maze10 = new Maze(10);
assert(maze10.getCell(-1, 0) === null && maze10.getCell(10, 0) === null, 'should return null for out of bounds');

console.log('\n========================================');
console.log('Test Results:');
console.log('Total:', passed + failed);
console.log('✅ Passed:', passed);
console.log('❌ Failed:', failed);
console.log('========================================');

process.exit(failed > 0 ? 1 : 0);
