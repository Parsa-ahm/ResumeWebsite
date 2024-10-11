use actix_cors::Cors;
use actix_web::{post, web, App, HttpServer, Responder};
use serde::Deserialize;
use std::collections::HashMap;
use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

#[derive(Deserialize)]
struct BoggleRequest {
    board: Vec<String>,
}

#[post("/solve")]
async fn solve_boggle(req: web::Json<BoggleRequest>) -> impl Responder {
    let board: Vec<&str> = req.board.iter().map(String::as_str).collect();
    let words = load_word_list("word_list_scrabble_2019.txt").expect("Failed to load word list");
    let result = boggle(&board, &words);
    
    // Organize the results by the initial letter and include point values
    let mut organized_results: HashMap<char, Vec<(String, u32, Vec<(u8, u8)>)>> = HashMap::new();
    for (word, path) in result {
        let points = word.len() as u32; // Assuming points are the length of the word
        let initial = word.chars().next().unwrap();
        organized_results.entry(initial).or_default().push((word, points, path));
    }

    web::Json(organized_results)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(solve_boggle)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

#[allow(non_snake_case, non_camel_case_types, dead_code)]

#[derive(Default)]
struct Trie {
    children: HashMap<char, Trie>,
    is_end_of_word: bool,
}

impl Trie {
    fn new() -> Self {
        Default::default()
    }

    fn insert(&mut self, word: &str) {
        let mut node = self;
        for c in word.chars() {
            node = node.children.entry(c).or_insert_with(Trie::new);
        }
        node.is_end_of_word = true;
    }

    fn is_prefix_or_word(&self, prefix: &str) -> bool {
        let mut node = self;
        for c in prefix.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return false,
            }
        }
        true
    }

    fn is_word(&self, word: &str) -> bool {
        let mut node = self;
        for c in word.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return false,
            }
        }
        node.is_end_of_word
    }
}

struct BoggleHelper<'a> {
    board: &'a [&'a str],
    word_trie: Trie,
    found: HashMap<String, Vec<(u8, u8)>>,
}

impl<'a> BoggleHelper<'a> {
    fn new(board: &'a [&'a str], words: &'a [String]) -> Self {
        let mut word_trie = Trie::new();
        for word in words {
            word_trie.insert(word);
        }

        BoggleHelper {
            board,
            word_trie,
            found: HashMap::new(),
        }
    }

    fn search(&mut self, start_point: (usize, usize)) {
        let start_char = self.board[start_point.0].chars().nth(start_point.1).unwrap();
        let start_word = start_char.to_string();
        self.seek(&start_word, start_point, vec![start_point]);
    }

    fn seek(&mut self, current_word: &str, current_point: (usize, usize), path: Vec<(usize, usize)>) {
        if self.word_trie.is_prefix_or_word(current_word) {
            if self.word_trie.is_word(current_word) {
                let formatted_path: Vec<(u8, u8)> = path.iter().map(|&(y, x)| (y as u8, x as u8)).collect();
                self.found.insert(current_word.to_string(), formatted_path);
            }
            for dy in -1..=1 {
                for dx in -1..=1 {
                    if dy == 0 && dx == 0 { continue; }
                    let new_y = current_point.0 as isize + dy;
                    let new_x = current_point.1 as isize + dx;
                    if new_y >= 0 && new_x >= 0 && new_y < self.board.len() as isize && new_x < self.board[0].len() as isize {
                        let new_point = (new_y as usize, new_x as usize);
                        if !path.contains(&new_point) {
                            let new_char = self.board[new_y as usize].chars().nth(new_x as usize).unwrap();
                            let new_word = format!("{}{}", current_word, new_char);
                            let mut new_path = path.clone();
                            new_path.push(new_point);
                            self.seek(&new_word, new_point, new_path);
                        }
                    }
                }
            }
        }
    }
}

fn boggle(board: &[&str], words: &[String]) -> HashMap<String, Vec<(u8, u8)>> {
    let mut helper = BoggleHelper::new(board, words);
    for y in 0..board.len() {
        for x in 0..board[0].len() {
            helper.search((y, x));
        }
    }
    print!("Boggle Solved!");
    helper.found
}

fn load_word_list<P>(filename: P) -> io::Result<Vec<String>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    let reader = io::BufReader::new(file);
    let mut words = Vec::new();
    for line in reader.lines() {
        let word = line?;
        words.push(word);
    }
    Ok(words)
}
