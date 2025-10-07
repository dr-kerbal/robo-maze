class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
        this.visited = false;
        this.state = 'unexplored'; // 'unexplored' | 'explored' | 'deadend'
    }

    removeWall(direction) {
        if (this.walls.hasOwnProperty(direction)) {
            this.walls[direction] = false;
        }
    }

    hasWall(direction) {
        return this.walls[direction] === true;
    }

    getWalls() {
        return { ...this.walls };
    }

    setState(state) {
        if (['unexplored', 'explored', 'deadend'].includes(state)) {
            this.state = state;
        }
    }

    getState() {
        return this.state;
    }

    isVisited() {
        return this.visited;
    }

    markVisited() {
        this.visited = true;
    }

    reset() {
        this.visited = false;
        this.state = 'unexplored';
    }
}

class Maze {
    constructor(size, algorithm = 'prim') {
        this.size = size;
        this.algorithm = algorithm;
        this.grid = [];
        this.startCell = { row: size - 1, col: 0 };
        this.exitCell = { row: 0, col: size - 1 };
        this.initializeGrid();
    }

    initializeGrid() {
        this.grid = [];
        for (let row = 0; row < this.size; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.size; col++) {
                this.grid[row][col] = new Cell(row, col);
            }
        }
    }

    getCell(row, col) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            return this.grid[row][col];
        }
        return null;
    }

    getCellWalls(row, col) {
        const cell = this.getCell(row, col);
        return cell ? cell.getWalls() : null;
    }

    getNeighbors(row, col) {
        const neighbors = [];
        const directions = [
            { row: row - 1, col: col, dir: 'top' },    // top
            { row: row, col: col + 1, dir: 'right' },  // right
            { row: row + 1, col: col, dir: 'bottom' }, // bottom
            { row: row, col: col - 1, dir: 'left' }    // left
        ];

        for (const { row: r, col: c, dir } of directions) {
            const cell = this.getCell(r, c);
            if (cell) {
                neighbors.push({ cell, direction: dir });
            }
        }

        return neighbors;
    }

    removeBetweenWalls(cell1, cell2) {
        const rowDiff = cell2.row - cell1.row;
        const colDiff = cell2.col - cell1.col;

        if (rowDiff === 1) {
            // cell2 is below cell1
            cell1.removeWall('bottom');
            cell2.removeWall('top');
        } else if (rowDiff === -1) {
            // cell2 is above cell1
            cell1.removeWall('top');
            cell2.removeWall('bottom');
        } else if (colDiff === 1) {
            // cell2 is to the right of cell1
            cell1.removeWall('right');
            cell2.removeWall('left');
        } else if (colDiff === -1) {
            // cell2 is to the left of cell1
            cell1.removeWall('left');
            cell2.removeWall('right');
        }
    }

    isValidPath(fromRow, fromCol, toRow, toCol) {
        const cell = this.getCell(fromRow, fromCol);
        if (!cell) return false;

        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;

        // Check if cells are adjacent
        if (Math.abs(rowDiff) + Math.abs(colDiff) !== 1) {
            return false;
        }

        // Check if there's a wall between them
        if (rowDiff === 1) return !cell.hasWall('bottom');
        if (rowDiff === -1) return !cell.hasWall('top');
        if (colDiff === 1) return !cell.hasWall('right');
        if (colDiff === -1) return !cell.hasWall('left');

        return false;
    }

    reset() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.grid[row][col].reset();
            }
        }
    }

    generate(algorithm) {
        this.algorithm = algorithm;
        this.reset();

        // Reset all walls first
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const cell = this.grid[row][col];
                cell.walls = { top: true, right: true, bottom: true, left: true };
            }
        }

        switch (algorithm) {
            case 'prim':
                this.primsAlgorithm();
                break;
            case 'backtracking':
                this.recursiveBacktracking();
                break;
            case 'kruskal':
                this.kruskalsAlgorithm();
                break;
            default:
                this.primsAlgorithm();
        }
    }

    primsAlgorithm() {
        // Start from random cell
        const startRow = Math.floor(Math.random() * this.size);
        const startCol = Math.floor(Math.random() * this.size);
        const startCell = this.getCell(startRow, startCol);

        startCell.markVisited();

        // Wall list: each wall is {cell1: {row, col}, cell2: {row, col}}
        const walls = [];

        // Add all walls of start cell to list
        this.addWallsToList(startCell, walls);

        while (walls.length > 0) {
            // Pick random wall
            const randomIndex = Math.floor(Math.random() * walls.length);
            const wall = walls.splice(randomIndex, 1)[0];

            const cell1 = this.getCell(wall.cell1.row, wall.cell1.col);
            const cell2 = this.getCell(wall.cell2.row, wall.cell2.col);

            // If only one cell is visited, remove the wall
            if (cell1 && cell2) {
                const c1Visited = cell1.isVisited();
                const c2Visited = cell2.isVisited();

                if (c1Visited !== c2Visited) {
                    // Remove wall between them
                    this.removeBetweenWalls(cell1, cell2);

                    // Mark unvisited cell as visited
                    const unvisitedCell = c1Visited ? cell2 : cell1;
                    unvisitedCell.markVisited();

                    // Add walls of newly visited cell
                    this.addWallsToList(unvisitedCell, walls);
                }
            }
        }
    }

    addWallsToList(cell, wallList) {
        const directions = [
            { row: -1, col: 0 },  // top
            { row: 0, col: 1 },   // right
            { row: 1, col: 0 },   // bottom
            { row: 0, col: -1 }   // left
        ];

        for (const dir of directions) {
            const neighborRow = cell.row + dir.row;
            const neighborCol = cell.col + dir.col;
            const neighbor = this.getCell(neighborRow, neighborCol);

            if (neighbor) {
                // Add wall between cell and neighbor
                wallList.push({
                    cell1: { row: cell.row, col: cell.col },
                    cell2: { row: neighborRow, col: neighborCol }
                });
            }
        }
    }

    recursiveBacktracking() {
        // Start from random cell
        const startRow = Math.floor(Math.random() * this.size);
        const startCol = Math.floor(Math.random() * this.size);

        const stack = [];
        const current = this.getCell(startRow, startCol);
        current.markVisited();
        stack.push(current);

        while (stack.length > 0) {
            const currentCell = stack[stack.length - 1];

            // Get unvisited neighbors
            const neighbors = this.getNeighbors(currentCell.row, currentCell.col);
            const unvisitedNeighbors = neighbors.filter(n => !n.cell.isVisited());

            if (unvisitedNeighbors.length > 0) {
                // Pick random unvisited neighbor
                const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
                const chosen = unvisitedNeighbors[randomIndex];

                // Remove wall between current and chosen
                this.removeBetweenWalls(currentCell, chosen.cell);

                // Mark chosen as visited and push to stack
                chosen.cell.markVisited();
                stack.push(chosen.cell);
            } else {
                // Backtrack
                stack.pop();
            }
        }
    }

    kruskalsAlgorithm() {
        // Union-Find data structure
        const parent = {};
        const rank = {};

        // Initialize each cell as its own set
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const key = `${row},${col}`;
                parent[key] = key;
                rank[key] = 0;
                this.getCell(row, col).markVisited();
            }
        }

        const find = (key) => {
            if (parent[key] !== key) {
                parent[key] = find(parent[key]); // Path compression
            }
            return parent[key];
        };

        const union = (key1, key2) => {
            const root1 = find(key1);
            const root2 = find(key2);

            if (root1 === root2) return false;

            // Union by rank
            if (rank[root1] < rank[root2]) {
                parent[root1] = root2;
            } else if (rank[root1] > rank[root2]) {
                parent[root2] = root1;
            } else {
                parent[root2] = root1;
                rank[root1]++;
            }
            return true;
        };

        // Create list of all possible walls
        const allWalls = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                // Add right wall
                if (col < this.size - 1) {
                    allWalls.push({
                        cell1: { row, col },
                        cell2: { row, col: col + 1 }
                    });
                }
                // Add bottom wall
                if (row < this.size - 1) {
                    allWalls.push({
                        cell1: { row, col },
                        cell2: { row: row + 1, col }
                    });
                }
            }
        }

        // Shuffle walls
        for (let i = allWalls.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allWalls[i], allWalls[j]] = [allWalls[j], allWalls[i]];
        }

        // Process walls
        for (const wall of allWalls) {
            const key1 = `${wall.cell1.row},${wall.cell1.col}`;
            const key2 = `${wall.cell2.row},${wall.cell2.col}`;

            if (find(key1) !== find(key2)) {
                const cell1 = this.getCell(wall.cell1.row, wall.cell1.col);
                const cell2 = this.getCell(wall.cell2.row, wall.cell2.col);
                this.removeBetweenWalls(cell1, cell2);
                union(key1, key2);
            }
        }
    }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Cell, Maze };
}
