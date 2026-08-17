use axum::{Router, routing::get};
use std::env;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let port = env::args().nth(1).expect("provide port");
    let p = port.clone();
    let app = Router::new()
        .route(
            "/",
            get(move || async move { format!("hello from server {}", port) }),
        )
        .route("/health", get(|| async { "OK" }));

    let addr = format!("127.0.0.1:{}", p);

    let listener = TcpListener::bind(&addr).await.unwrap();

    println!("server running on: {}", addr);

    axum::serve(listener, app).await.unwrap();
}

