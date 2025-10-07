// Simple test framework
const test = {
    suites: [],
    currentSuite: null,
    results: { passed: 0, failed: 0, total: 0 },

    describe(suiteName, callback) {
        const suite = {
            name: suiteName,
            tests: []
        };
        this.currentSuite = suite;
        this.suites.push(suite);
        callback();
        this.currentSuite = null;
    },

    it(testName, callback) {
        const testCase = {
            name: testName,
            passed: false,
            error: null
        };

        try {
            callback();
            testCase.passed = true;
            this.results.passed++;
        } catch (error) {
            testCase.passed = false;
            testCase.error = error;
            this.results.failed++;
        }

        this.results.total++;

        if (this.currentSuite) {
            this.currentSuite.tests.push(testCase);
        }

        return testCase;
    },

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    },

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected} but got ${actual}`);
        }
    },

    assertDeepEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(message || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
        }
    },

    run() {
        const output = document.getElementById('test-output');
        if (!output) return;

        let html = '<div class="test-summary">';
        html += `<h2>Test Results</h2>`;
        html += `<p>Total: ${this.results.total} | Passed: <span class="passed">${this.results.passed}</span> | Failed: <span class="failed">${this.results.failed}</span></p>`;
        html += '</div>';

        this.suites.forEach(suite => {
            html += `<div class="test-suite">`;
            html += `<h3>${suite.name}</h3>`;

            suite.tests.forEach(testCase => {
                const status = testCase.passed ? 'passed' : 'failed';
                const icon = testCase.passed ? '✓' : '✗';
                html += `<div class="test-case ${status}">`;
                html += `<span class="icon">${icon}</span> ${testCase.name}`;
                if (!testCase.passed && testCase.error) {
                    html += `<div class="error">${testCase.error.message}</div>`;
                }
                html += '</div>';
            });

            html += '</div>';
        });

        output.innerHTML = html;

        // Log to console as well
        console.log(`Tests: ${this.results.passed}/${this.results.total} passed`);
        if (this.results.failed > 0) {
            console.error(`${this.results.failed} tests failed`);
        }
    }
};
