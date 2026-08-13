use futures_util::StreamExt;
use rdkafka::ClientConfig;
use rdkafka::Message;
use rdkafka::consumer::{Consumer, StreamConsumer};

#[tokio::main]
async fn main() {
    let consumer: StreamConsumer = ClientConfig::new()
        .set("bootstrap.servers", "localhost:9092")
        .set("group.id", "orders-consumers")
        .set("enable.auto.commit", "false")
        .set("auto.offset.reset", "earliest")
        .create()
        .expect("failed to create consumer");

    consumer
        .subscribe(&["orders"])
        .expect("subscription failed");

    println!("waiting for messages..");

    let mut stream = consumer.stream();

    while let Some(msg) = stream.next().await {
        match msg {
            Ok(msg) => {
                println!(
                    "partition={} offset={} message={:?}",
                    msg.partition(),
                    msg.offset(),
                    msg.payload_view::<str>()
                );

                consumer
                    .commit_message(&msg, rdkafka::consumer::CommitMode::Async)
                    .expect("commit failed");
            }

            Err(err) => {
                eprintln!("kafka error: {}", err);
            }
        }
    }
}
