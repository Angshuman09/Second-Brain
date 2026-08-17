use std::sync::Arc;
use tokio::sync::Mutex;

struct LoadBalancer {
    servers: Vec<String>,
    current: usize,
}

impl LoadBalancer {
    fn new(servers: Vec<String>) -> Self {
        Self {
            servers,
            current: 0,
        }
    }

    fn next_server(&mut self) -> String {
        let server = self.servers[self.current].clone();

        self.current = (self.current + 1) % self.servers.len();

        server
    }
}

#[tokio::main]
async fn main() {
    let servers = vec![
        "http://127.0.0.1:3001".to_string(),
        "http://127.0.0.1:3002".to_string(),
        "http://127.0.0.1:3003".to_string(),
    ];

    let lb = Arc::new(Mutex::new(LoadBalancer::new(servers)));

    println!("load balancer running on: 3000");

    loop {
        let mut lb = lb.lock().await;

        println!("next server: {}", lb.next_server());
    }
}
