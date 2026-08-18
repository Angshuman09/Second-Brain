use axum::{Router, extract::State, routing::get};
use reqwest::Client;
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

#[derive(Clone)]
struct AppState {
    lb: Arc<Mutex<LoadBalancer>>,
    client: Client,
}

async fn proxy(State(state): State<AppState>) -> String {
    let server = {
        let mut lb = state.lb.lock().await;
        lb.next_server()
    };

    println!("Forwarding request to {}", server);

    state
        .client
        .get(format!("{}/", server))
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap()
}

#[tokio::main]
async fn main() {
    let servers = vec![
        "http://127.0.0.1:3001".to_string(),
        "http://127.0.0.1:3002".to_string(),
    ];

    let state = AppState {
        lb: Arc::new(Mutex::new(LoadBalancer::new(servers))),
        client: Client::new(),
    };

    let app = Router::new().route("/", get(proxy)).with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!("Load balancer running on http://127.0.0.1:3000");

    axum::serve(listener, app).await.unwrap();
}
