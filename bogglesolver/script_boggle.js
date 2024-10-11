let wasmModule = null;
let wasmSolver = null;

// Load the WebAssembly module
async function loadWasm() {
  try {
    // Correctly referencing the path to WASM for GitHub Pages
    wasmModule = await import('./pkg/bogglesolver.js');
    wasmSolver = wasmModule.BoggleSolver;
    console.log('WASM module loaded successfully.');
  } catch (error) {
    console.error('Failed to load WASM module:', error);
  }
}

// Call the WASM function to solve the Boggle board
async function solveBoggle() {
  if (!wasmSolver) {
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
    const result = wasmSolver.solve(board);  // Calling the WASM function directly
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

  const sortedInitials = Object.keys(result).sort();

  sortedInitials.forEach((initial) => {
    const words = result[initial];
    words.sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return b[1] - a[1];
    });

    const letterDiv = document.createElement("div");
    const hr = document.createElement("hr");
    hr.classList.add("hr");
    letterDiv.innerHTML = `<h3>${initial.toUpperCase()}</h3>`;
    letterDiv.classList.add("m-4");
    let wordList = document.createElement("ul");
    wordList.classList.add("list-group-horizontal", "list-group");

    words.forEach(([word, points, path], index) => {
      if (index > 0 && index % 8 === 0) {
        letterDiv.appendChild(wordList);
        wordList = document.createElement("ul");
        wordList.classList.add("list-group-horizontal", "list-group");
      }

      const wordItem = document.createElement("li");
      wordItem.innerHTML = `<span style="cursor:pointer;" onclick="highlightPath('${word}', ${JSON.stringify(
        path
      )})">${word} (${points} points)</span>`;
      wordItem.classList.add("list-group-item", "p-2");
      wordList.appendChild(wordItem);
    });

    letterDiv.appendChild(wordList);
    resultsDiv.appendChild(letterDiv);
  });
}

// Function to highlight the solution path in the grid
function highlightPath(word, path) {
  const table = document.getElementById("boggle-board");
  const resultsDiv = document.getElementById("results");

  // Clear previous highlights
  const highlightedCells = table.querySelectorAll(".bg-success");
  highlightedCells.forEach((cell) => cell.classList.remove("bg-success"));

  const highlightedWords = resultsDiv.querySelectorAll(
    ".list-group-item-success"
  );
  highlightedWords.forEach((item) =>
    item.classList.remove("list-group-item-success")
  );

  // Highlight the new path
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
