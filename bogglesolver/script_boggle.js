let wasmModule = null;
let solverInstance = null;

// Load the WebAssembly module
async function loadWasm() {
  try {
    wasmModule = await import('./pkg/bogglesolver.js');
    console.log('WASM module loaded successfully. now');

    // Initialize the solver instance after WASM loads
    const dictionary = await import('./word_list_scrabble_2019.txt'); // Replace with your actual word list
    const board = ["abcd", "efgh", "ijkl", "mnop"]; // Placeholder, will be replaced by user input
    solverInstance = new wasmModule.BoggleSolver(board, dictionary);
  } catch (error) {
    console.error('Failed to load WASM module:', error);
  }
}

// Call the WASM function to solve the Boggle board
async function solveBoggle() {
  if (!solverInstance) {
    console.error('WASM solver is not initialized');
    return;
  }

  const table = document.getElementById("boggle-board");
  const board = [];
  for (let i = 0; i < table.rows.length; i++) {
    const row = [];
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      row.push(table.rows[i].cells[j].firstChild.value);
    }
    board.push(row.join(""));
  }

  try {
    solverInstance = new wasmModule.BoggleSolver(board, ["some", "dictionary", "words"]); // Replace with actual dictionary
    const result = solverInstance.solve();  // Calling the WASM function directly
    displayResults(result);
  } catch (error) {
    console.error('Error while solving the board:', error);
  }
}

// Function to generate the Boggle board
function generateBoard() {
  const size = document.getElementById("board-size").value;
  const table = document.getElementById("boggle-board");
  table.innerHTML = "";
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < size; i++) {
    const row = table.insertRow();
    for (let j = 0; j < size; j++) {
      const cell = row.insertCell();
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.value = alphabet[Math.floor(Math.random() * alphabet.length)];
      input.classList.add("b-2");
      cell.appendChild(input);
    }
  }
}

function displayResults(result) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const words = result.split(", ");
  words.forEach((word) => {
    const wordItem = document.createElement("div");
    wordItem.innerText = word;
    resultsDiv.appendChild(wordItem);
  });
}

// Function to highlight the solution path in the grid (if needed)
// Assuming this function highlights the path for a found word
function highlightPath(word, path) {
  const table = document.getElementById("boggle-board");
  const resultsDiv = document.getElementById("results");

  // Clear previous highlights
  const highlightedCells = table.querySelectorAll(".bg-success");
  highlightedCells.forEach((cell) => cell.classList.remove("bg-success"));

  path.forEach(([y, x]) => {
    table.rows[y].cells[x].classList.add("bg-success");
  });

  // Highlight the clicked word
  const wordItems = resultsDiv.querySelectorAll("li span");
  wordItems.forEach((item) => {
    if (item.textContent === `${word} (${word.length} points)`) {
      item.parentElement.classList.add("list-group-item-success");
    }
  });
}

// Initialize the board and load the WASM module
generateBoard();
loadWasm();
