test.describe('Maze Class Tests', () => {
    test.it('should create grid of correct size', () => {
        const maze = new Maze(10);
        test.assertEqual(maze.size, 10, 'Maze size should be 10');
        test.assertEqual(maze.grid.length, 10, 'Grid should have 10 rows');
        test.assertEqual(maze.grid[0].length, 10, 'Grid should have 10 columns');
    });

    test.it('should initialize all cells with 4 walls', () => {
        const maze = new Maze(5);
        const cell = maze.getCell(2, 2);
        test.assert(cell.hasWall('top'), 'Should have top wall');
        test.assert(cell.hasWall('right'), 'Should have right wall');
        test.assert(cell.hasWall('bottom'), 'Should have bottom wall');
        test.assert(cell.hasWall('left'), 'Should have left wall');
    });

    test.it('should return correct cell or null', () => {
        const maze = new Maze(10);
        const cell = maze.getCell(5, 5);
        test.assert(cell !== null, 'Should return cell for valid coordinates');
        test.assertEqual(cell.row, 5, 'Cell row should be 5');
        test.assertEqual(cell.col, 5, 'Cell col should be 5');

        const nullCell = maze.getCell(15, 15);
        test.assert(nullCell === null, 'Should return null for invalid coordinates');
    });

    test.it('should return correct number of neighbors', () => {
        const maze = new Maze(10);

        // Corner cell (0,0) should have 2 neighbors
        const cornerNeighbors = maze.getNeighbors(0, 0);
        test.assertEqual(cornerNeighbors.length, 2, 'Corner cell should have 2 neighbors');

        // Edge cell (0,5) should have 3 neighbors
        const edgeNeighbors = maze.getNeighbors(0, 5);
        test.assertEqual(edgeNeighbors.length, 3, 'Edge cell should have 3 neighbors');

        // Middle cell (5,5) should have 4 neighbors
        const middleNeighbors = maze.getNeighbors(5, 5);
        test.assertEqual(middleNeighbors.length, 4, 'Middle cell should have 4 neighbors');
    });

    test.it('should remove walls between adjacent cells correctly', () => {
        const maze = new Maze(10);
        const cell1 = maze.getCell(5, 5);
        const cell2 = maze.getCell(5, 6);

        maze.removeBetweenWalls(cell1, cell2);
        test.assert(!cell1.hasWall('right'), 'Cell1 right wall should be removed');
        test.assert(!cell2.hasWall('left'), 'Cell2 left wall should be removed');
    });

    test.it('should validate paths correctly when wall exists', () => {
        const maze = new Maze(10);
        const isValid = maze.isValidPath(5, 5, 5, 6);
        test.assert(!isValid, 'Path should be invalid when wall exists');
    });

    test.it('should validate paths correctly when wall is removed', () => {
        const maze = new Maze(10);
        const cell1 = maze.getCell(5, 5);
        const cell2 = maze.getCell(5, 6);
        maze.removeBetweenWalls(cell1, cell2);

        const isValid = maze.isValidPath(5, 5, 5, 6);
        test.assert(isValid, 'Path should be valid when wall is removed');
    });

    test.it('should have correct start and exit positions', () => {
        const maze = new Maze(10);
        test.assertEqual(maze.startCell.row, 9, 'Start row should be 9 for 10x10 maze');
        test.assertEqual(maze.startCell.col, 0, 'Start col should be 0');
        test.assertEqual(maze.exitCell.row, 0, 'Exit row should be 0');
        test.assertEqual(maze.exitCell.col, 9, 'Exit col should be 9 for 10x10 maze');
    });

    test.it('should reset all cells', () => {
        const maze = new Maze(5);
        const cell = maze.getCell(2, 2);
        cell.markVisited();
        cell.setState('explored');

        maze.reset();
        test.assert(!cell.isVisited(), 'Cell should not be visited after reset');
        test.assertEqual(cell.getState(), 'unexplored', 'Cell state should be unexplored after reset');
    });

    test.it('should return null for out of bounds coordinates', () => {
        const maze = new Maze(10);
        test.assert(maze.getCell(-1, 0) === null, 'Should return null for negative row');
        test.assert(maze.getCell(0, -1) === null, 'Should return null for negative col');
        test.assert(maze.getCell(10, 0) === null, 'Should return null for row >= size');
        test.assert(maze.getCell(0, 10) === null, 'Should return null for col >= size');
    });
});
