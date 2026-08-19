use axum::{Router, routing::get};
use reqwest::Client;
use std::net::SocketAddr;

async fn post() -> String {
    let client = Client::new();
    let response = client
        .get("http://127.0.0.1:3001/profile")
        .send()
        .await
        .unwrap();

    response.text().await.unwrap()
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/post", get(post));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("post service running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
