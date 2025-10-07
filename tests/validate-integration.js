// Simple integration validation test
const { Cell, Maze } = require('../js/maze.js');
const { Robot } = require('../js/robot.js');

console.log('Running Integration Validation...\n');

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

// Test 1: Full game simulation
console.log('Test 1: Full game simulation (10x10 maze)');
const maze = new Maze(10, 'prim');
maze.generate('prim');
const robot = new Robot(maze.startCell.row, maze.startCell.col);
robot.determineInitialDirection(maze);

let steps = 0;
const maxSteps = 5000;

while (!robot.isAtExit(maze.exitCell.row, maze.exitCell.col) && steps < maxSteps) {
    const result = robot.stepOnce(maze);

    // Update cell state
    const cell = maze.getCell(result.from.row, result.from.col);
    if (result.isDeadEnd) {
        cell.setState('deadend');
    } else {
        cell.setState('explored');
    }

    steps++;
}

assert(robot.isAtExit(maze.exitCell.row, maze.exitCell.col),
    `Robot should reach exit (took ${robot.steps} steps, ${robot.deadEnds} dead ends)`);

// Test 2: Settings changes
console.log('\nTest 2: Settings changes simulation');
const sizes = [5, 10, 15, 20];
let allSizesWork = true;

for (const size of sizes) {
    const testMaze = new Maze(size, 'backtracking');
    testMaze.generate('backtracking');

    if (testMaze.grid.length !== size || testMaze.grid[0].length !== size) {
        allSizesWork = false;
        break;
    }
}

assert(allSizesWork, 'All maze sizes should work correctly');

// Test 3: Algorithm switching
console.log('\nTest 3: Algorithm switching');
const algorithms = ['prim', 'backtracking', 'kruskal'];
let allAlgorithmsWork = true;

for (const algo of algorithms) {
    try {
        const testMaze = new Maze(10, algo);
        testMaze.generate(algo);

        // Verify all cells are visited
        let allVisited = true;
        for (let row = 0; row < testMaze.size; row++) {
            for (let col = 0; col < testMaze.size; col++) {
                if (!testMaze.getCell(row, col).isVisited()) {
                    allVisited = false;
                }
            }
        }

        if (!allVisited) {
            allAlgorithmsWork = false;
            console.error(`  Algorithm ${algo} failed validation`);
        } else {
            console.log(`  ✓ ${algo} algorithm works`);
        }
    } catch (error) {
        allAlgorithmsWork = false;
        console.error(`  Algorithm ${algo} threw error:`, error.message);
    }
}

assert(allAlgorithmsWork, 'All maze generation algorithms should work');

// Test 4: Reset functionality
console.log('\nTest 4: Reset functionality');
const resetMaze = new Maze(8, 'prim');
resetMaze.generate('prim');
const resetRobot = new Robot(resetMaze.startCell.row, resetMaze.startCell.col);
resetRobot.determineInitialDirection(resetMaze);

// Take some steps
for (let i = 0; i < 10; i++) {
    resetRobot.stepOnce(resetMaze);
}

const stepsBeforeReset = resetRobot.steps;

// Reset
resetRobot.reset(resetMaze.startCell.row, resetMaze.startCell.col);
resetMaze.reset();

assert(resetRobot.steps === 0 && stepsBeforeReset > 0,
    'Reset should clear robot statistics');

// Test 5: Cell state management
console.log('\nTest 5: Cell state management');
const stateMaze = new Maze(5, 'prim');
stateMaze.generate('prim');

const testCell = stateMaze.getCell(2, 2);
testCell.setState('explored');
assert(testCell.getState() === 'explored', 'Cell should be in explored state');

testCell.setState('deadend');
assert(testCell.getState() === 'deadend', 'Cell should be in deadend state');

testCell.reset();
assert(testCell.getState() === 'unexplored', 'Cell should reset to unexplored state');

console.log('\n==========================================');
console.log('INTEGRATION VALIDATION RESULTS');
console.log('==========================================');
console.log(`Total: ${passed + failed}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log('==========================================\n');

if (failed === 0) {
    console.log('🎉 All integration tests passed!');
    console.log('The game is ready to run in the browser.');
} else {
    console.log('⚠️  Some integration tests failed.');
}

process.exit(failed > 0 ? 1 : 0);
