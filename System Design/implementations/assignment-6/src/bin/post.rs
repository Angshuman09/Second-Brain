use axum::{Router, extract::State, routing::{get}};
use reqwest::Client;
use assignment_6::circuit_breaker::CircuitBreaker;
use std::sync::Arc;
use tokio::sync::Mutex;
use std::time::Duration;

#[derive(Clone)]
struct AppState{
    breaker: Arc<Mutex<CircuitBreaker>>,
    client: Client
}

async fn post(State(state): State<AppState>) -> String {
    {
        let mut breaker = state.breaker.lock().await;

    if !breaker.allow_request(){
        return "circuit is OPEN: profile service unavailable".to_string();
    }
    }//to drop the mutex guard we use scope

    println!("calling profile service");

    let response = state.client.get("http://127.0.0.1:3001/profile").send().await;

    match response{
        Ok(response) if response.status().is_success() =>{
            let body = response.text().await.unwrap();

            let mut breaker = state.breaker.lock().await;
            breaker.record_success();

            body
        }

        Ok(response) =>{
            println!("profile service returned {}", response.status());

            let mut breaker = state.breaker.lock().await;
            breaker.record_failure();

            "profile service failed".to_string()
        }
        Err(error)=>{
            println!("request to profile service failed {}", error);

            let mut breaker = state.breaker.lock().await;
            breaker.record_failure();

            "profile service unavailable".to_string()
        }
    }

}

#[tokio::main]
async fn main() {
    let state = AppState{
        breaker: Arc::new(Mutex::new(
            CircuitBreaker::new(3, Duration::from_secs(5))
        )),
        client: Client::new()
    };

    let app = Router::new()
        .route("/post", get(post))
        .with_state(state);

    let addr = "127.0.0.1:3000";

    println!("post service running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
