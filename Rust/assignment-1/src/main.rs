use std::collections::HashMap;

fn main() {
    let input = "Rust is fast, Rust is safe! Rust is awesome.Learning Rust makes you a better coder. Fast code, safe code!";
    let counts = word_frequency(input);
    let mut words: Vec<_> = counts.iter().collect();
    words.sort_by(|a, b| b.1.cmp(a.1));

    for (word, count) in words.iter().take(3){
        println!("word: {}, count: {}", word, count);
    }
}


fn word_frequency(text: &str) -> HashMap<String, u32> {
    text.split_whitespace()
        .map(|word| {
            word.trim_matches(|c: char| c.is_ascii_punctuation()).to_lowercase()
        })
        .filter(|word| !word.is_empty())
        .fold(HashMap::new(), |mut counts, word|{
            *counts.entry(word).or_insert(0)+=1;
            counts
        })
}