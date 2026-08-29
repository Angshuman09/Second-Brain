
struct Fibonacci{
    curr: u64,
    next: u64
}


impl Fibonacci{
    fn new() -> Fibonacci{
        Fibonacci { curr: 0, next: 1 }
    }
}

impl Iterator for Fibonacci{
    type Item = u64;

    fn next(&mut self) -> Option<Self::Item>{
        let current = self.curr;

        self.curr = self.next;
        self.next = current + self.next;

        Some(current)
    }
}

fn main() {
    let even_fibo: Vec<u64> = Fibonacci::new()
        .take(10)
        .filter(|x| x%2==0)
        .collect();

    println!("even fibonnaci: {:?}", even_fibo);

    for n in Fibonacci::new().take(5){
        println!("{}", n);
    }
}
