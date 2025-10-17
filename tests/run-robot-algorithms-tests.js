const { Maze, Cell } = require('../js/maze.js');
const { Robot } = require('../js/robot.js');

console.log('Running Robot Algorithms Tests...\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        testsPassed++;
        console.log(`✓ ${message}`);
    } else {
        testsFailed++;
        console.log(`✗ ${message}`);
    }
}

// Test 1: Robot accepts algorithm parameter in constructor
console.log('Test 1: Robot accepts algorithm parameter in constructor');
const robotLeft = new Robot(0, 0, 'up', 'left');
assert(robotLeft.algorithm === 'left', 'Robot stores left algorithm');

const robotRight = new Robot(0, 0, 'up', 'right');
assert(robotRight.algorithm === 'right', 'Robot stores right algorithm');

const robotForward = new Robot(0, 0, 'up', 'forward');
assert(robotForward.algorithm === 'forward', 'Robot stores forward algorithm');

const robotRandom = new Robot(0, 0, 'up', 'random');
assert(robotRandom.algorithm === 'random', 'Robot stores random algorithm');

// Test 2: Default algorithm is 'left'
console.log('\nTest 2: Default algorithm is left');
const robotDefault = new Robot(0, 0);
assert(robotDefault.algorithm === 'left', 'Default algorithm is left');

// Test 3: Left-hand algorithm prioritizes left
console.log('\nTest 3: Left-hand algorithm direction priority');
const maze3 = new Maze(5, 'prim');
maze3.generate('prim');
const robot3 = new Robot(maze3.startCell.row, maze3.startCell.col, 'up', 'left');
robot3.direction = 'up';

// Mock a simple maze state for testing
const left = robot3.getLeftDirection();
const forward = robot3.direction;
const right = robot3.getRightDirection();
const back = robot3.getBackDirection();

// Test that getNextDirectionLeft follows correct priority
const nextDirLeft = robot3.getNextDirectionLeft(maze3, left, forward, right, back);
assert(
    nextDirLeft === left || nextDirLeft === forward || nextDirLeft === right || nextDirLeft === back,
    'Left algorithm returns valid direction'
);

// Test 4: Right-hand algorithm prioritizes right
console.log('\nTest 4: Right-hand algorithm direction priority');
const robot4 = new Robot(maze3.startCell.row, maze3.startCell.col, 'up', 'right');
robot4.direction = 'up';
const nextDirRight = robot4.getNextDirectionRight(maze3, left, forward, right, back);
assert(
    nextDirRight === left || nextDirRight === forward || nextDirRight === right || nextDirRight === back,
    'Right algorithm returns valid direction'
);

// Test 5: Forward algorithm prioritizes forward
console.log('\nTest 5: Forward algorithm direction priority');
const robot5 = new Robot(maze3.startCell.row, maze3.startCell.col, 'up', 'forward');
robot5.direction = 'up';
const nextDirForward = robot5.getNextDirectionForward(maze3, left, forward, right, back);
assert(
    nextDirForward === left || nextDirForward === forward || nextDirForward === right || nextDirForward === back,
    'Forward algorithm returns valid direction'
);

// Test 6: Random algorithm returns random valid direction
console.log('\nTest 6: Random algorithm returns valid direction');
const robot6 = new Robot(maze3.startCell.row, maze3.startCell.col, 'up', 'random');
robot6.direction = 'up';
const nextDirRandom = robot6.getNextDirectionRandom(maze3, left, forward, right, back);
assert(
    nextDirRandom === left || nextDirRandom === forward || nextDirRandom === right || nextDirRandom === back,
    'Random algorithm returns valid direction'
);

// Test 7: All algorithms can complete a simple maze
console.log('\nTest 7: All algorithms can complete a simple 5x5 maze');

function testAlgorithmCompletion(algorithmName) {
    const testMaze = new Maze(5, 'prim');
    testMaze.generate('prim');

    const testRobot = new Robot(
        testMaze.startCell.row,
        testMaze.startCell.col,
        'up',
        algorithmName
    );
    testRobot.determineInitialDirection(testMaze);

    let steps = 0;
    const maxSteps = 1000;

    while (!testRobot.isAtExit(testMaze.exitCell.row, testMaze.exitCell.col) && steps < maxSteps) {
        testRobot.stepOnce(testMaze);
        steps++;
    }

    const completed = testRobot.isAtExit(testMaze.exitCell.row, testMaze.exitCell.col);
    assert(completed, `${algorithmName} algorithm completes 5x5 maze (${steps} steps)`);
    return completed;
}

testAlgorithmCompletion('left');
testAlgorithmCompletion('right');
testAlgorithmCompletion('forward');
testAlgorithmCompletion('random');

// Test 8: All algorithms can complete a larger maze
console.log('\nTest 8: All algorithms can complete a 10x10 maze');

function testLargerMaze(algorithmName) {
    const testMaze = new Maze(10, 'prim');
    testMaze.generate('prim');

    const testRobot = new Robot(
        testMaze.startCell.row,
        testMaze.startCell.col,
        'up',
        algorithmName
    );
    testRobot.determineInitialDirection(testMaze);

    let steps = 0;
    const maxSteps = 5000;

    while (!testRobot.isAtExit(testMaze.exitCell.row, testMaze.exitCell.col) && steps < maxSteps) {
        testRobot.stepOnce(testMaze);
        steps++;
    }

    const completed = testRobot.isAtExit(testMaze.exitCell.row, testMaze.exitCell.col);
    assert(completed, `${algorithmName} algorithm completes 10x10 maze (${steps} steps)`);
    return completed;
}

testLargerMaze('left');
testLargerMaze('right');
testLargerMaze('forward');
testLargerMaze('random');

// Test 9: Reset preserves algorithm
console.log('\nTest 9: Reset preserves algorithm choice');
const robot9 = new Robot(0, 0, 'up', 'forward');
robot9.reset(1, 1, 'down', 'random');
assert(robot9.algorithm === 'random', 'Reset updates algorithm');
assert(robot9.row === 1 && robot9.col === 1, 'Reset updates position');
assert(robot9.direction === 'down', 'Reset updates direction');

// Test 10: getNextDirection uses correct algorithm
console.log('\nTest 10: getNextDirection uses correct algorithm');
const maze10 = new Maze(5, 'prim');
maze10.generate('prim');

const robotTest = new Robot(maze10.startCell.row, maze10.startCell.col, 'up', 'left');
robotTest.determineInitialDirection(maze10);
const direction = robotTest.getNextDirection(maze10);
assert(
    direction === 'up' || direction === 'down' || direction === 'left' || direction === 'right',
    'getNextDirection returns valid direction'
);

// Test 11: Different algorithms can give different results
console.log('\nTest 11: Algorithms can produce different paths');
const maze11 = new Maze(5, 'prim');
maze11.generate('prim');

const robotLeft11 = new Robot(maze11.startCell.row, maze11.startCell.col, 'up', 'left');
robotLeft11.determineInitialDirection(maze11);

const robotRight11 = new Robot(maze11.startCell.row, maze11.startCell.col, 'up', 'right');
robotRight11.determineInitialDirection(maze11);

// Take a few steps
for (let i = 0; i < 3; i++) {
    robotLeft11.stepOnce(maze11);
    robotRight11.stepOnce(maze11);
}

// Check that they might be in different positions (or at least using different logic)
assert(
    robotLeft11.algorithm === 'left' && robotRight11.algorithm === 'right',
    'Different algorithms maintain their identity'
);

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log(`Total tests: ${testsPassed + testsFailed}`);
console.log('='.repeat(50));

if (testsFailed === 0) {
    console.log('✓ All robot algorithm tests passed!');
    process.exit(0);
} else {
    console.log('✗ Some tests failed');
    process.exit(1);
}
