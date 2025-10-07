// Load Robot class
const { Robot } = require('../js/robot.js');
const { Maze } = require('../js/maze.js');

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

console.log('Running Robot Class Tests...\n');

// Test 1: Initialization
const robot1 = new Robot(9, 0, 'up');
assert(robot1.row === 9 && robot1.col === 0 && robot1.direction === 'up', 'should initialize at correct position');

// Test 2: Direction helpers
const robot2 = new Robot(0, 0, 'up');
assert(robot2.getLeftDirection() === 'left', 'getLeftDirection should return left for up');
assert(robot2.getRightDirection() === 'right', 'getRightDirection should return right for up');
assert(robot2.getBackDirection() === 'down', 'getBackDirection should return down for up');

robot2.turn('right');
assert(robot2.getLeftDirection() === 'up', 'getLeftDirection should return up for right');

// Test 3: Move and steps
const robot3 = new Robot(9, 0, 'up');
robot3.move(8, 0);
assert(robot3.row === 8 && robot3.steps === 1, 'should move and increment steps');

// Test 4: Visited tracking
const robot4 = new Robot(9, 0, 'up');
assert(robot4.hasVisited(9, 0), 'start cell should be visited');
robot4.move(8, 0);
assert(robot4.hasVisited(8, 0) && robot4.hasVisited(9, 0), 'should track visited cells');

// Test 5: Reset
const robot5 = new Robot(9, 0, 'up');
robot5.move(8, 0);
robot5.deadEnds = 5;
robot5.reset(9, 0, 'up');
assert(robot5.row === 9 && robot5.steps === 0 && robot5.deadEnds === 0, 'should reset all state');

// Test 6: Exit detection
const robot6 = new Robot(9, 0, 'up');
assert(!robot6.isAtExit(0, 9), 'should not be at exit initially');
robot6.move(0, 9);
assert(robot6.isAtExit(0, 9), 'should be at exit after moving there');

// Test 7: Stats
const robot7 = new Robot(9, 0, 'up');
robot7.move(8, 0);
robot7.deadEnds = 2;
robot7.backtrackCount = 3;
const stats = robot7.getStats();
assert(stats.steps === 1 && stats.deadEnds === 2 && stats.backtrackCount === 3, 'should return correct stats');

// Test 8: canMove with maze
const maze = new Maze(10, 'prim');
maze.generate('prim');
const robot8 = new Robot(maze.startCell.row, maze.startCell.col, 'up');

// Test that canMove returns boolean
const canMoveUp = robot8.canMove('up', maze);
assert(typeof canMoveUp === 'boolean', 'canMove should return boolean');

// Test out of bounds
robot8.row = 0;
robot8.col = 0;
assert(!robot8.canMove('up', maze), 'canMove should return false for out of bounds (up from top)');
assert(!robot8.canMove('left', maze), 'canMove should return false for out of bounds (left from leftmost)');

console.log('\n========================================');
console.log('Test Results:');
console.log('Total:', passed + failed);
console.log('✅ Passed:', passed);
console.log('❌ Failed:', failed);
console.log('========================================');

process.exit(failed > 0 ? 1 : 0);
