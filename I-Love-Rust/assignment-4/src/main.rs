
struct Excerpt<'a>{
    text: &'a str,
    source: &'a str
}

impl<'a> Excerpt<'a>{
    fn highlight(&self) -> String{
        format!("[{}]: {}", self.source, self.text)
    }
}

fn longest_excerpt<'a>(a: &'a Excerpt, b: &'a Excerpt) -> &'a Excerpt<'a>{
    if a.text.len() >= b.text.len(){
        a
    }else{
        b
    }
}
fn main() {
    let document = String::from("Rust has ownership and borrowing. Lifetimes make it safe.");
    
        let first = Excerpt {
            text: &document[0..27],
            source: &document[0..4],
        };
    
        let second = Excerpt {
            text: &document[28..],
            source: &document[0..4],
        };
    
        println!("{}", first.highlight());
        println!("{}", second.highlight());
    
        let longer = longest_excerpt(&first, &second);
        println!("Longer: {}", longer.highlight());
}
