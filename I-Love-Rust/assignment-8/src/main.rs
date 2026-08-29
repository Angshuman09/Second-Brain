use std::sync::{Arc, Mutex};
use std::thread::{self, JoinHandle};

fn main() {
    let mut thread: Vec<JoinHandle<()>> = Vec::new();
    
    let counter = Arc::new(Mutex::new(0));

    for _ in 0..5{
        let count = counter.clone();
        for i in 0..100{
            let t = thread::spawn(|| {
                // count+=i;
            });   
        }
    }
}
