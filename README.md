# Robot Maze Solver 🤖

A web-based maze solver that uses the left-hand wall following algorithm to navigate through randomly generated mazes.

## Features

- **Three Maze Generation Algorithms:**
  - Randomized Prim's Algorithm (default)
  - Recursive Backtracking
  - Kruskal's Algorithm

- **Intelligent Robot Pathfinding:**
  - Four pathfinding algorithms: Left-Hand Rule, Right-Hand Rule, Forward Preference, Random Walk
  - Automatic dead-end detection
  - Real-time visual feedback

- **Interactive Controls:**
  - Adjustable maze size (5x5 to 100x100)
  - Variable robot speed (1-100)
  - Pause/Resume functionality
  - Reset and regenerate options
  - Credits button showing project information

- **Visual Feedback:**
  - Green cells: Explored paths
  - Red cells: Dead ends
  - Animated robot movement
  - Victory screen on completion

## Getting Started

### Running Locally

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Or use a local server:
   ```bash
   python3 -m http.server 8080
   # Then open http://localhost:8080 in your browser
   ```

### Running Tests

```bash
cd tests
node run-all-tests.js
```

## How It Works

### Maze Generation

The application generates perfect mazes (mazes with exactly one path between any two points) using one of three algorithms:

1. **Randomized Prim's Algorithm**: Builds the maze by randomly selecting walls to remove, creating organic-looking mazes
2. **Recursive Backtracking**: Creates mazes with long, winding corridors
3. **Kruskal's Algorithm**: Uses union-find to create mazes with shorter paths

### Robot Navigation

The robot supports **four pathfinding algorithms**:

1. **Left-Hand Rule** (wall-following): Left → Forward → Right → Back
   - Guarantees finding the exit
   - Systematic and predictable

2. **Right-Hand Rule** (wall-following): Right → Forward → Left → Back
   - Guarantees finding the exit
   - Mirror of left-hand rule

3. **Forward Preference**: Forward → Right → Left → Back
   - Prefers moving forward
   - May get stuck in loops on some mazes (known limitation)
   - Uses loop detection to escape

4. **Random Walk**: Randomly chooses from available directions
   - Unpredictable and exploratory
   - Eventually finds exit but may take many steps

Wall-following algorithms (left/right) guarantee finding the exit in any perfect maze.

## Project Structure

```
robo-maze/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Styling and layout
├── js/
│   ├── main.js         # Game controller and entry point
│   ├── maze.js         # Maze & Cell classes, generation algorithms
│   ├── robot.js        # Robot class and pathfinding logic
│   ├── renderer.js     # Canvas rendering and animations
│   └── ui.js           # UI controls and event handlers
├── tests/              # Comprehensive test suite
│   ├── run-all-tests.js
│   ├── run-cell-tests.js
│   ├── run-maze-tests.js
│   ├── run-prim-tests.js
│   ├── run-backtracking-tests.js
│   ├── run-kruskal-tests.js
│   ├── run-robot-tests.js
│   └── run-pathfinding-tests.js
└── docs/
    ├── maze-game-plan.md
    └── maze-game-implementation.md
```

## Controls

- **Maze Size**: Set grid size (5-100)
- **Maze Generation Algorithm**: Choose maze generation algorithm (Prim, Backtracking, Kruskal)
- **Robot Pathfinding Algorithm**: Choose robot navigation strategy (Left-Hand, Right-Hand, Forward, Random)
- **Speed**: Adjust robot speed (1=slowest, 100=fastest)
- **Start**: Begin robot navigation
- **Pause/Resume**: Pause and resume execution
- **Reset**: Return robot to start (keeps current maze)
- **Credits**: Display project information and development process
- **Next Maze**: Generate a new maze (appears after completion)

## Statistics

The game tracks:
- **Steps**: Total moves made by the robot
- **Dead Ends**: Number of dead ends encountered
- **Backtracks**: Number of times the robot had to backtrack
- **Time**: Elapsed time since start

## Technical Details

- **Language**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas
- **Animation**: requestAnimationFrame (60fps target)
- **Dependencies**: None (pure vanilla implementation)

## Test Coverage

- ✅ Cell Class: 9 tests
- ✅ Maze Class: 14 tests
- ✅ Prim's Algorithm: 7 tests
- ✅ Recursive Backtracking: 4 tests
- ✅ Kruskal's Algorithm: 4 tests
- ✅ Robot Class: 15 tests
- ✅ Pathfinding: 9 tests
- ✅ Robot Algorithms: 22 tests

**Total: 84 tests, all passing**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- 100x100 maze generation: < 1 second
- Smooth 60fps animation
- Responsive on all screen sizes

## License

This project is open source and available for educational purposes.

## Acknowledgments

Based on classic maze generation and solving algorithms from computer science.
