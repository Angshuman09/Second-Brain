use futures_lite::StreamExt;
use lapin::{
    Connection, ConnectionProperties,
    options::{BasicConsumeOptions, QueueDeclareOptions},
    types::FieldTable,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let connection = Connection::connect(
        "amqp://guest:guest@localhost:5672/%2f",
        ConnectionProperties::default(),
    )
    .await?;

    let channel = connection.create_channel().await?;

    channel
        .queue_declare(
            "hello".into(),
            QueueDeclareOptions {
                durable: true,
                ..Default::default()
            },
            FieldTable::default(),
        )
        .await?;

    let mut consumer = channel
        .basic_consume(
            "hello".into(),
            "rust consumer".into(),
            BasicConsumeOptions::default(),
            FieldTable::default(),
        )
        .await?;

    println!("waiting for message..");

    while let Some(delivery) = consumer.next().await {
        let delivery = delivery?;

        println!("Received: {}", String::from_utf8_lossy(&delivery.data));
        //delivery.ack(BasicAckOptions::default()).await?;
    }
    Ok(())
}
