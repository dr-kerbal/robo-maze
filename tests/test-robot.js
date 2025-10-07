test.describe('Robot Class Tests', () => {
    test.it('should initialize at correct position', () => {
        const robot = new Robot(9, 0, 'up');
        test.assertEqual(robot.row, 9, 'Row should be 9');
        test.assertEqual(robot.col, 0, 'Col should be 0');
        test.assertEqual(robot.direction, 'up', 'Direction should be up');
    });

    test.it('should have correct direction helpers', () => {
        const robot = new Robot(0, 0, 'up');
        test.assertEqual(robot.getLeftDirection(), 'left', 'Left of up should be left');
        test.assertEqual(robot.getRightDirection(), 'right', 'Right of up should be right');
        test.assertEqual(robot.getBackDirection(), 'down', 'Back of up should be down');

        robot.turn('right');
        test.assertEqual(robot.getLeftDirection(), 'up', 'Left of right should be up');
        test.assertEqual(robot.getRightDirection(), 'down', 'Right of right should be down');
        test.assertEqual(robot.getBackDirection(), 'left', 'Back of right should be left');
    });

    test.it('should move and increment steps', () => {
        const robot = new Robot(9, 0, 'up');
        robot.move(8, 0);
        test.assertEqual(robot.row, 8, 'Robot should move to row 8');
        test.assertEqual(robot.steps, 1, 'Steps should increment to 1');

        robot.move(7, 0);
        test.assertEqual(robot.steps, 2, 'Steps should increment to 2');
    });

    test.it('should track visited cells', () => {
        const robot = new Robot(9, 0, 'up');
        test.assert(robot.hasVisited(9, 0), 'Start cell should be visited');

        robot.move(8, 0);
        test.assert(robot.hasVisited(8, 0), 'New cell should be visited');
        test.assert(robot.hasVisited(9, 0), 'Previous cell should still be visited');
    });

    test.it('should reset all state', () => {
        const robot = new Robot(9, 0, 'up');
        robot.move(8, 0);
        robot.move(7, 0);
        robot.deadEnds = 5;

        robot.reset(9, 0, 'up');
        test.assertEqual(robot.row, 9, 'Row should reset to 9');
        test.assertEqual(robot.col, 0, 'Col should reset to 0');
        test.assertEqual(robot.steps, 0, 'Steps should reset to 0');
        test.assertEqual(robot.deadEnds, 0, 'Dead ends should reset to 0');
    });

    test.it('should detect exit correctly', () => {
        const robot = new Robot(9, 0, 'up');
        test.assert(!robot.isAtExit(0, 9), 'Should not be at exit initially');

        robot.move(0, 9);
        test.assert(robot.isAtExit(0, 9), 'Should be at exit after moving there');
    });

    test.it('should return correct stats', () => {
        const robot = new Robot(9, 0, 'up');
        robot.move(8, 0);
        robot.deadEnds = 2;
        robot.backtrackCount = 3;

        const stats = robot.getStats();
        test.assertEqual(stats.steps, 1, 'Stats should have correct steps');
        test.assertEqual(stats.deadEnds, 2, 'Stats should have correct dead ends');
        test.assertEqual(stats.backtrackCount, 3, 'Stats should have correct backtrack count');
    });
});
