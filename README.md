# Railways

A browser-based logic game built with plain JavaScript, HTML, and CSS – no frameworks used. Players must connect railway tracks across a randomized map while following strict placement rules for each terrain type. The game tracks time and maintains a leaderboard using the local storage.

## Features
- **Main Menu:** Includes name input, difficulty selector, and start button
- **Game Rules:** Accessible from the main menu
- **Game Screen:**
  - Displays the player’s name and a timer
  - Loads a randomized map based on difficulty
- **Tile Placement:** Players can place track elements on the board
- **Basic Placement Rules:**
  - Bridges: only straight tracks
  - Mountains: only 90° curves
  - Oases: no tracks allowed
  - Empty: any track allowed
- Enforces correct placement rules
- Checks solution validity (e.g. no reused tiles, closed path, proper connections)
- Displays completion time
- Leaderboard: shows best times per difficulty level
- Clean, well-organized codebase
- Polished, user-friendly interface

## How to Run

Simply open `index.html` in a web browser. No build steps or server required.
