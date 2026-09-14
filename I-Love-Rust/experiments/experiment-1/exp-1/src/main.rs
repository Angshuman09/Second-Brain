use std::{sync::Arc, time::Instant};

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct MonsterId {
    id: Arc<str>,
}

impl MonsterId {
    fn new(id: &str) -> Self {
        Self { id: Arc::from(id) }
    }

    fn as_str(&self) -> &str {
        &self.id
    }
}

fn main() {
    println!("=== 1. STACK SIZE COMPARISON (64-bit) ===");
    println!("Vec<u32>:      {} bytes", size_of::<Vec<u32>>());
    println!("String:        {} bytes", size_of::<String>());
    println!("Arc<[u32]>:    {} bytes", size_of::<Arc<[u32]>>());
    println!("Arc<str>:      {} bytes", size_of::<Arc<str>>());
    println!("Box<[u32]>:    {} bytes", size_of::<Box<[u32]>>());
    println!("MonsterId:     {} bytes", size_of::<MonsterId>());

    let original_vec = vec![22, 23, 1, 8, 7, 6, 7];
    let arc_slice: Arc<[i32]> = Arc::from(original_vec);

    println!("length of the arc slice: {}", arc_slice.len());
    println!("first item of arc slice: {}", arc_slice[0]);
    println!("Iterated: {:?}", arc_slice.iter().collect::<Vec<_>>());
    let monsterid = MonsterId::new("this is a monster id");
    println!("{}", monsterid.as_str());

    let large_vec: Vec<i32> = (0..1_000_000).collect();
    let large_arc: Arc<[i32]> = Arc::from(large_vec.clone());

    let iterations = 10_000;

    let start_vec = Instant::now();
    let _vec_clone: Vec<Vec<i32>> = (0..iterations).map(|_| large_vec.clone()).collect();
    let vec_duration = start_vec.elapsed();

    let start_arc = Instant::now();
    let _arc_clone: Vec<Arc<[i32]>> = (0..iterations).map(|_| large_arc.clone()).collect();
    let arc_duration = start_arc.elapsed();

    println!("vec duration: {:?}", vec_duration);
    println!("arc duration: {:?}", arc_duration);

    let speedup = vec_duration.as_secs_f64() / arc_duration.as_secs_f64();
    println!("{}", speedup);
}
