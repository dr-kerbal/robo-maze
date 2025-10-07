test.describe('Cell Class Tests', () => {
    test.it('should initialize with correct row and column', () => {
        const cell = new Cell(5, 3);
        test.assertEqual(cell.row, 5, 'Row should be 5');
        test.assertEqual(cell.col, 3, 'Column should be 3');
    });

    test.it('should have all walls initially', () => {
        const cell = new Cell(0, 0);
        test.assert(cell.hasWall('top'), 'Should have top wall');
        test.assert(cell.hasWall('right'), 'Should have right wall');
        test.assert(cell.hasWall('bottom'), 'Should have bottom wall');
        test.assert(cell.hasWall('left'), 'Should have left wall');
    });

    test.it('should remove walls correctly', () => {
        const cell = new Cell(0, 0);
        cell.removeWall('top');
        test.assert(!cell.hasWall('top'), 'Top wall should be removed');
        test.assert(cell.hasWall('right'), 'Right wall should still exist');

        cell.removeWall('left');
        test.assert(!cell.hasWall('left'), 'Left wall should be removed');
    });

    test.it('should return deep copy of walls', () => {
        const cell = new Cell(0, 0);
        const walls = cell.getWalls();
        walls.top = false;
        test.assert(cell.hasWall('top'), 'Original cell top wall should not be affected');
    });

    test.it('should set state correctly', () => {
        const cell = new Cell(0, 0);
        test.assertEqual(cell.getState(), 'unexplored', 'Initial state should be unexplored');

        cell.setState('explored');
        test.assertEqual(cell.getState(), 'explored', 'State should be explored');

        cell.setState('deadend');
        test.assertEqual(cell.getState(), 'deadend', 'State should be deadend');
    });

    test.it('should reject invalid states', () => {
        const cell = new Cell(0, 0);
        cell.setState('invalid');
        test.assertEqual(cell.getState(), 'unexplored', 'State should remain unexplored for invalid input');
    });

    test.it('should track visited status', () => {
        const cell = new Cell(0, 0);
        test.assert(!cell.isVisited(), 'Should not be visited initially');

        cell.markVisited();
        test.assert(cell.isVisited(), 'Should be visited after marking');
    });

    test.it('should reset state and visited flag', () => {
        const cell = new Cell(0, 0);
        cell.markVisited();
        cell.setState('explored');

        cell.reset();
        test.assert(!cell.isVisited(), 'Should not be visited after reset');
        test.assertEqual(cell.getState(), 'unexplored', 'State should be unexplored after reset');
    });
});
