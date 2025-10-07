// Load Cell class
const { Cell } = require('../js/maze.js');

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

console.log('Running Cell Class Tests...\n');

// Test 1: Constructor
const cell1 = new Cell(5, 3);
assert(cell1.row === 5 && cell1.col === 3, 'should initialize with correct row and column');

// Test 2: Initial walls
const cell2 = new Cell(0, 0);
assert(cell2.hasWall('top') && cell2.hasWall('right') && cell2.hasWall('bottom') && cell2.hasWall('left'), 'should have all walls initially');

// Test 3: Remove walls
const cell3 = new Cell(0, 0);
cell3.removeWall('top');
assert(!cell3.hasWall('top') && cell3.hasWall('right'), 'should remove walls correctly');

// Test 4: Deep copy
const cell4 = new Cell(0, 0);
const walls = cell4.getWalls();
walls.top = false;
assert(cell4.hasWall('top'), 'should return deep copy of walls');

// Test 5: Set state
const cell5 = new Cell(0, 0);
cell5.setState('explored');
assert(cell5.getState() === 'explored', 'should set state correctly');

// Test 6: Invalid state
const cell6 = new Cell(0, 0);
cell6.setState('invalid');
assert(cell6.getState() === 'unexplored', 'should reject invalid states');

// Test 7: Visited tracking
const cell7 = new Cell(0, 0);
assert(!cell7.isVisited(), 'should not be visited initially');
cell7.markVisited();
assert(cell7.isVisited(), 'should be visited after marking');

// Test 8: Reset
const cell8 = new Cell(0, 0);
cell8.markVisited();
cell8.setState('explored');
cell8.reset();
assert(!cell8.isVisited() && cell8.getState() === 'unexplored', 'should reset state and visited flag');

console.log('\n========================================');
console.log('Test Results:');
console.log('Total:', passed + failed);
console.log('✅ Passed:', passed);
console.log('❌ Failed:', failed);
console.log('========================================');

process.exit(failed > 0 ? 1 : 0);
