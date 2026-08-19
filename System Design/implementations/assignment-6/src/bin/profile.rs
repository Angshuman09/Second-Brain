use axum::{Router, http::StatusCode, routing::get};
use std::net::SocketAddr;

async fn profile() -> (StatusCode, &'static str) {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        r#"{"error":"profile service failed"}"#,
    )
}

async fn fail() -> (StatusCode, &'static str) {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        r#"{"error":"profile service failed"}"#,
    )
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/profile", get(profile))
        .route("/fail", get(fail));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    println!("profile service running in the port: {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
