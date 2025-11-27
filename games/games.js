// Games page functionality

// Tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.game-tab');
    const contents = document.querySelectorAll('.game-content');
    let sudokuInitialized = false;

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const game = this.getAttribute('data-game');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(game).classList.add('active');

            // Auto-generate Sudoku puzzle when tab is first shown
            if (game === 'sudoku' && !sudokuInitialized && typeof generateSudoku === 'function') {
                setTimeout(function() {
                    generateSudoku();
                    sudokuInitialized = true;
                }, 100);
            }
        });
    });

    // Initialize Boggle game
    initializeBoggle();

    // Auto-generate Sudoku if it's the active tab on load
    const activeTab = document.querySelector('.game-tab.active');
    if (activeTab && activeTab.getAttribute('data-game') === 'sudoku' && typeof generateSudoku === 'function') {
        setTimeout(function() {
            generateSudoku();
            sudokuInitialized = true;
        }, 200);
    }
});

// Boggle Game Logic
let dictionary = new Set();
let prefixes = new Set();
let board = [];
let lastWords = [];
const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function initializeBoggle() {
    loadDictionary();
    generateBoard();
    document.getElementById('generate-btn').onclick = generateBoard;
    document.getElementById('solve-btn').onclick = solveBoggle;
    document.getElementById('search-box').oninput = () => {
        const q = document.getElementById('search-box').value.toLowerCase();
        const filtered = lastWords.filter(w => w.includes(q));
        displayResults(filtered);
    };
}

function loadDictionary() {
    // Dictionary is loaded via script tag, so DICTIONARY_WORDS should be available
    if (typeof DICTIONARY_WORDS === 'undefined') {
        console.error('Dictionary not loaded. Make sure dictionary.js is included before games.js');
        alert('Dictionary file not loaded. Please ensure dictionary.js is included in the page.');
        return;
    }
    
    // Load words into dictionary Set and prefixes Set
    DICTIONARY_WORDS.forEach(word => {
        const w = word.toLowerCase().trim();
        if (w.length >= 3) {
            dictionary.add(w);
            for (let i = 1; i <= w.length; i++) {
                prefixes.add(w.slice(0, i));
            }
        }
    });
    
    console.log('Dictionary loaded:', dictionary.size, 'words');
}

function generateBoard() {
    const size = parseInt(document.getElementById('board-size').value, 10);
    const tbl = document.getElementById('boggle-board');
    tbl.innerHTML = '';
    board = Array.from({ length: size }, () => Array(size).fill(''));
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < size; i++) {
        const row = tbl.insertRow();
        for (let j = 0; j < size; j++) {
            const cell = row.insertCell();
            cell.className = 'boggle-cell';
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.maxLength = 1;
            const letter = alpha[Math.floor(Math.random() * 26)];
            inp.value = letter;
            inp.oninput = () => {
                const val = inp.value.toUpperCase().slice(0, 1);
                inp.value = val;
                board[i][j] = val.toLowerCase();
            };
            board[i][j] = letter.toLowerCase();
            cell.appendChild(inp);
        }
    }
    clearResults();
}

function updateBoardFromInputs() {
    // Update the board array from the current input values
    const tbl = document.getElementById('boggle-board');
    const size = tbl.rows.length;
    board = Array.from({ length: size }, () => Array(size).fill(''));
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = tbl.rows[i].cells[j];
            const input = cell.querySelector('input');
            if (input && input.value) {
                board[i][j] = input.value.toLowerCase().trim();
            } else {
                board[i][j] = '';
            }
        }
    }
}

function solveBoggle() {
    // Update board from current input values before solving
    updateBoardFromInputs();
    
    const size = board.length;
    if (size === 0 || dictionary.size === 0) {
        console.error('Board is empty or dictionary not loaded');
        alert('Please generate a board first and ensure the dictionary is loaded.');
        return;
    }

    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    const found = new Set();
    
    function dfs(x, y, path) {
        if (x < 0 || y < 0 || x >= size || y >= size) return;
        if (visited[x][y]) return;
        if (!board[x][y]) return; // Skip empty cells
        
        const word = path + board[x][y].toLowerCase();
        if (!prefixes.has(word)) return;
        if (word.length >= 3 && dictionary.has(word)) {
            found.add(word);
        }
        visited[x][y] = true;
        for (let [dx, dy] of directions) {
            dfs(x + dx, y + dy, word);
        }
        visited[x][y] = false;
    }
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j]) {
                dfs(i, j, '');
            }
        }
    }
    
    lastWords = Array.from(found).sort((a, b) => b.length - a.length || a.localeCompare(b));
    displayResults(lastWords);
}

function clearResults() {
    lastWords = [];
    displayResults([]);
}

function displayResults(words) {
    document.getElementById('word-count').textContent = words.length;
    const container = document.getElementById('word-list');
    container.innerHTML = '';
    const groups = {};
    words.forEach(w => {
        const letter = w[0].toUpperCase();
        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(w);
    });
    Object.keys(groups).sort().forEach(letter => {
        const wrapper = document.createElement('div');
        wrapper.className = 'word-group';
        const h = document.createElement('h5');
        h.textContent = letter;
        wrapper.appendChild(h);
        const ul = document.createElement('ul');
        ul.className = 'list-group';
        groups[letter].forEach(w => {
            const li = document.createElement('li');
            li.className = 'list-group-item word-item';
            li.textContent = w;
            ul.appendChild(li);
        });
        wrapper.appendChild(ul);
        container.appendChild(wrapper);
    });
}
