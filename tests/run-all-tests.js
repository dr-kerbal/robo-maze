// Run all test suites
const { execSync } = require('child_process');

const tests = [
    'run-cell-tests.js',
    'run-maze-tests.js',
    'run-prim-tests.js',
    'run-backtracking-tests.js',
    'run-kruskal-tests.js',
    'run-robot-tests.js',
    'run-pathfinding-tests.js',
    'run-robot-algorithms-tests.js'
];

console.log('==========================================');
console.log('Running All Test Suites');
console.log('==========================================\n');

let totalPassed = 0;
let totalFailed = 0;

for (const test of tests) {
    console.log(`\n▶ Running ${test}...`);
    console.log('------------------------------------------');

    try {
        execSync(`node ${test}`, {
            stdio: 'inherit',
            cwd: __dirname
        });
        totalPassed++;
    } catch (error) {
        totalFailed++;
        console.error(`✗ ${test} failed`);
    }
}

console.log('\n==========================================');
console.log('FINAL RESULTS');
console.log('==========================================');
console.log(`Test Suites: ${totalPassed} passed, ${totalFailed} failed, ${tests.length} total`);
console.log('==========================================\n');

process.exit(totalFailed > 0 ? 1 : 0);
