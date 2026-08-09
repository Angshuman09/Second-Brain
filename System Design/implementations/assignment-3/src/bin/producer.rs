use lapin::{
    BasicProperties, Connection, ConnectionProperties,
    options::{BasicPublishOptions, QueueDeclareOptions},
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

    channel
        .basic_publish(
            "".into(),
            "hello".into(),
            BasicPublishOptions::default(),
            b"hello I am angshuuu",
            BasicProperties::default(),
        )
        .await?;

    println!("message sent!");

    Ok(())
}
