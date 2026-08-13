use rdkafka::ClientConfig;
use rdkafka::producer::{FutureProducer, FutureRecord};
use std::time::Duration;

#[tokio::main]
async fn main() {
    let producer: FutureProducer = ClientConfig::new()
        .set("bootstrap.servers", "localhost:9092")
        .create()
        .expect("failed to create producer");

    for i in 0..10 {
        let message = format!("order-{}", i);

        producer
            .send(
                FutureRecord::to("orders")
                    .key(&i.to_string())
                    .payload(&message),
                Duration::from_secs(5),
            )
            .await
            .expect("Failed to send message");

        println!("Sent: {}", message);
    }
}
