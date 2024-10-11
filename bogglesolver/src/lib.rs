use wasm_bindgen::prelude::*;
use std::collections::HashSet;

const DIRECTIONS: [(i32, i32); 8] = [
    (-1, -1), (-1, 0), (-1, 1), (0, -1),
    (0, 1), (1, -1), (1, 0), (1, 1),
];

#[wasm_bindgen]
pub struct BoggleSolver {
    board: Vec<Vec<char>>,
    dictionary: HashSet<String>,
    results: HashSet<String>,
}

#[wasm_bindgen]
impl BoggleSolver {
    // Constructor: accept the board as Vec<String> to be compatible with JS.
    #[wasm_bindgen(constructor)]
    pub fn new(board: Vec<String>, dictionary: Vec<String>) -> BoggleSolver {
        let parsed_board = board
            .into_iter()
            .map(|row| row.chars().collect())
            .collect();

        BoggleSolver {
            board: parsed_board,
            dictionary: dictionary.into_iter().collect(),
            results: HashSet::new(),
        }
    }

    pub fn solve(&mut self) -> String {
        let mut visited = vec![vec![false; self.board[0].len()]; self.board.len()];

        for i in 0..self.board.len() {
            for j in 0..self.board[0].len() {
                let mut current_word = String::new();
                self.dfs(i as i32, j as i32, &mut visited, &mut current_word);
            }
        }

        let found_words: Vec<String> = self.results.iter().cloned().collect();
        found_words.join(", ")
    }

    fn dfs(&mut self, x: i32, y: i32, visited: &mut Vec<Vec<bool>>, current_word: &mut String) {
        if x < 0 || y < 0 || x >= self.board.len() as i32 || y >= self.board[0].len() as i32 {
            return;
        }

        if visited[x as usize][y as usize] {
            return;
        }

        current_word.push(self.board[x as usize][y as usize]);
        visited[x as usize][y as usize] = true;

        if self.dictionary.contains(current_word) {
            self.results.insert(current_word.clone());
        }

        for &(dx, dy) in &DIRECTIONS {
            self.dfs(x + dx, y + dy, visited, current_word);
        }

        visited[x as usize][y as usize] = false;
        current_word.pop();
    }
}
