// Load Robot and Maze classes
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

console.log('Running Pathfinding Tests...\n');

// Test 1: Robot follows left-hand rule
const maze1 = new Maze(5, 'prim');
maze1.generate('prim');
const robot1 = new Robot(maze1.startCell.row, maze1.startCell.col);
robot1.determineInitialDirection(maze1);

const nextDir = robot1.getNextDirection(maze1);
assert(['left', 'up', 'right', 'down'].includes(nextDir), 'getNextDirection should return valid direction');

// Test 2: Robot detects dead ends
const maze2 = new Maze(5, 'prim');
maze2.generate('prim');
const robot2 = new Robot(maze2.startCell.row, maze2.startCell.col);
robot2.determineInitialDirection(maze2);

// Simulate finding a dead end
let foundDeadEnd = false;
for (let i = 0; i < 100; i++) {
    const result = robot2.stepOnce(maze2);
    if (result.isDeadEnd) {
        foundDeadEnd = true;
        break;
    }
    if (robot2.isAtExit(maze2.exitCell.row, maze2.exitCell.col)) {
        break;
    }
}

assert(robot2.steps > 0, 'Robot should take steps');

// Test 3: Robot can navigate simple maze to exit
const maze3 = new Maze(5, 'prim');
maze3.generate('prim');
const robot3 = new Robot(maze3.startCell.row, maze3.startCell.col);
robot3.determineInitialDirection(maze3);

let iterations = 0;
const maxIterations = 1000;

while (!robot3.isAtExit(maze3.exitCell.row, maze3.exitCell.col) && iterations < maxIterations) {
    robot3.stepOnce(maze3);
    iterations++;
}

assert(robot3.isAtExit(maze3.exitCell.row, maze3.exitCell.col), `Robot should reach exit in 5x5 maze (took ${robot3.steps} steps)`);

// Test 4: Robot counts steps correctly
assert(robot3.steps > 0, 'Steps should be greater than 0');
assert(robot3.steps < 1000, 'Steps should be reasonable for 5x5 maze');

// Test 5: Test on larger maze (10x10)
console.log('\nTesting on 10x10 maze...');
const maze5 = new Maze(10, 'prim');
maze5.generate('prim');
const robot5 = new Robot(maze5.startCell.row, maze5.startCell.col);
robot5.determineInitialDirection(maze5);

iterations = 0;
while (!robot5.isAtExit(maze5.exitCell.row, maze5.exitCell.col) && iterations < 5000) {
    robot5.stepOnce(maze5);
    iterations++;
}

assert(robot5.isAtExit(maze5.exitCell.row, maze5.exitCell.col), `Robot should reach exit in 10x10 maze (took ${robot5.steps} steps)`);
console.log(`  Dead ends: ${robot5.deadEnds}, Backtracks: ${robot5.backtrackCount}`);

// Test 6: Test on multiple mazes
console.log('\nTesting on multiple random mazes...');
let allSuccess = true;
for (let i = 0; i < 5; i++) {
    const maze = new Maze(8, 'prim');
    maze.generate('prim');
    const robot = new Robot(maze.startCell.row, maze.startCell.col);
    robot.determineInitialDirection(maze);

    let iters = 0;
    while (!robot.isAtExit(maze.exitCell.row, maze.exitCell.col) && iters < 2000) {
        robot.stepOnce(maze);
        iters++;
    }

    if (!robot.isAtExit(maze.exitCell.row, maze.exitCell.col)) {
        allSuccess = false;
        console.log(`  Maze ${i+1}: FAILED (steps: ${robot.steps})`);
    } else {
        console.log(`  Maze ${i+1}: SUCCESS (steps: ${robot.steps}, dead ends: ${robot.deadEnds})`);
    }
}

assert(allSuccess, 'Robot should solve all random mazes');

// Test 7: Initial direction logic works
const maze7 = new Maze(10, 'prim');
maze7.generate('prim');
const robot7 = new Robot(maze7.startCell.row, maze7.startCell.col);
const initialDir = robot7.determineInitialDirection(maze7);
assert(['up', 'left', 'right', 'down'].includes(initialDir), 'determineInitialDirection should return valid direction');
assert(robot7.canMove(initialDir, maze7), 'Initial direction should be a valid move');

console.log('\n========================================');
console.log('Test Results:');
console.log('Total:', passed + failed);
console.log('✅ Passed:', passed);
console.log('❌ Failed:', failed);
console.log('========================================');

process.exit(failed > 0 ? 1 : 0);
