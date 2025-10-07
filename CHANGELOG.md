# Changelog

## [1.2.0] - 2025-10-05

### Added
- **Credits Button**: New Credits button displays project information
  - Shows author information (Max K, 7Y, St Edwards School, 10/2025)
  - Details the collaborative development process with Claude Code
  - Describes how requirements were gathered, planned, and executed
  - Modal with smooth slide-in animation
  - Click outside modal to dismiss with fade-out animation
  - Purple button styling to match the project theme

### Technical Changes
- Updated `index.html`:
  - Added Credits button next to Reset button
  - Added credits modal with emoji, author info, and development process description
- Updated `css/style.css`:
  - Added `.modal` class with fade animations (similar to victory message)
  - Added purple button styling for credits button (#8b5cf6)
  - Added `modalSlideIn` animation
  - Styled credits content with scrollable modal
- Updated `js/ui.js`:
  - Added `showCreditsModal()` and `hideCreditsModal()` methods
  - Added click event listeners for showing/hiding modal
  - Modal dismisses when clicking outside content area

## [1.1.1] - 2025-10-05

### Fixed
- **Initial Maze Rendering**: Fixed issue where maze was not visible on page load
  - Victory message overlay was blocking the canvas even when hidden
  - Added `visibility: hidden` to `.victory.hidden` class to properly hide the overlay
  - Maze now renders immediately when page loads

## [1.1.0] - 2025-10-05

### Improved
- **Victory Message Auto-Dismiss**: Victory message now automatically fades out after 5 seconds
  - Added smooth fade-out animation (0.5s transition)
  - Added slide-in animation when victory message appears
  - Controls are no longer blocked after victory - users can immediately interact
  - Victory message still dismissible via "Next Maze" button

### Technical Changes
- Updated `main.js`: Added `setTimeout` to auto-hide victory message after 5 seconds
- Updated `css/style.css`:
  - Added CSS transitions for fade-out effect with proper visibility handling
  - Added `victorySlideIn` keyframe animation
  - Changed `.victory.hidden` to use `opacity`, `pointer-events`, and `visibility`
  - Fixed transition timing to ensure visibility changes after fade animation
- Updated `js/ui.js`: Enhanced `hideVictoryMessage()` with fade-out animation

## [1.0.0] - 2025-10-05

### Initial Release
- Three maze generation algorithms (Prim's, Recursive Backtracking, Kruskal's)
- Left-hand wall following pathfinding algorithm
- Interactive UI with configurable maze size and speed
- Real-time statistics and timer
- Visual feedback for explored paths and dead ends
- Comprehensive test suite (69 tests, 100% passing)
