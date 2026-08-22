use axum::{Router, http::StatusCode, extract::State, routing::{get, post}};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
struct AppState{
    healthy: Arc<Mutex<bool>>
}

async fn profile(State(state): State<AppState>) -> (StatusCode, String) {
    let healthy = *state.healthy.lock().await;

    if healthy{
    (
        StatusCode::OK,
        r#"{"name":"Angshu","age":21}"#.to_string(),
    )   
    }else{
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            r#"{"error":"profile service failed"}"#.to_string(),
        )
    }
}

async fn fail(State(state): State<AppState>) ->  &'static str{
    let mut healthy = state.healthy.lock().await;
    *healthy = false;
    "profile service is now failing"
}

async fn recover(State(state): State<AppState>) -> &'static str{
    let mut healthy = state.healthy.lock().await;
    *healthy = true;
    "profile service recovered"
}

#[tokio::main]
async fn main() {
    let state = AppState{
        healthy: Arc::new(Mutex::new(true))
    };

    let app = Router::new()
        .route("/profile", get(profile))
        .route("/fail", post(fail))
        .route("/recover", post(recover))
        .with_state(state);

    let addr = SocketAddr::from(([127,0,0,1], 3001));

    println!("profile service running on: http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
