// Function to check if a number is safe to place in a particular row, column, and 3x3 box
function isSafe(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) {
      return false;
    }
  }

  let startRow = row - (row % 3),
    startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
}

// Backtracking function to solve the Sudoku puzzle
function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            } else {
              board[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Function to generate a valid filled Sudoku grid
function generateSudokuGrid() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(board);
  return board;
}

// Function to fill the board using backtracking
function fillBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let num of nums) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) {
              return true;
            } else {
              board[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Function to shuffle an array (used to randomize Sudoku generation)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to remove random elements to create a puzzle with difficulty level
function removeElements(board, difficulty = 50) {
  let count = difficulty;
  while (count > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      count--;
    }
  }
  return board;
}

// Function to generate and display the Sudoku puzzle
function generateSudoku() {
  const sudokuGrid = document.getElementById("sudoku-grid");
  sudokuGrid.innerHTML = ""; // Clear the existing grid

  // Generate a full Sudoku board
  let board = generateSudokuGrid();
  board = removeElements(board); // Remove some numbers to create the puzzle

  // Create the table/grid with the generated board
  for (let i = 0; i < 9; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text"; // Change from "number" to "text" to remove arrows
      input.setAttribute("inputmode", "numeric"); // Allow numeric input on mobile devices
      input.classList.add("sudoku-input");

      // Style and handle pre-filled (generated) vs. empty cells
      if (board[i][j] !== 0) {
        input.value = board[i][j]; // Pre-filled number
        input.classList.add("prefilled"); // Add class to distinguish pre-filled numbers
        input.disabled = false; // Allow editing but mark as prefilled
        input.readOnly = false;
      } else {
        input.value = ""; // Empty cell for user input
      }

      cell.appendChild(input);
      row.appendChild(cell);
    }
    sudokuGrid.appendChild(row);
  }

  // Add event listeners to detect user input and change styling
  document.querySelectorAll(".sudoku-input").forEach((input) => {
    input.addEventListener("input", function () {
      input.style.color = "green"; // Change the color of user input to green
    });
  });
}

// Function to solve the current Sudoku grid
function solveSudokuFromUI() {
  const grid = [];
  const inputs = document.querySelectorAll(".sudoku-input");

  // Get the current values from the grid
  inputs.forEach((input, index) => {
    const value = input.value ? parseInt(input.value) : 0; // Convert input to a number, use 0 for empty cells
    const row = Math.floor(index / 9);
    const col = index % 9;

    // Initialize grid row if it doesn't exist
    if (!grid[row]) {
      grid[row] = [];
    }

    grid[row][col] = value;
  });

  // Ensure the grid is properly initialized before solving
  if (grid.length !== 9 || grid.some((row) => row.length !== 9)) {
    console.error("The Sudoku grid is not properly initialized.");
    return;
  }

  // Solve the Sudoku puzzle
  if (solveSudoku(grid)) {
    // Update the grid with the solved values
    inputs.forEach((input, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      if (input.value === "") {
        input.style.color = "yellow"; // Set color to yellow for solver-inserted numbers
        input.value = grid[row][col];
      }
    });
  } else {
    console.error("Sudoku cannot be solved.");
  }
}

// Function to clear the Sudoku grid
function clearGrid() {
  const inputs = document.querySelectorAll(".sudoku-input");
  inputs.forEach((input) => {
    input.value = ""; // Clear all the input fields
    input.style.color = "green"; // Make cleared cells green
  });
}
