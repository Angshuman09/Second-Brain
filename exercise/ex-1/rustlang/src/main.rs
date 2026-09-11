fn example() -> Result<(), Box<dyn std::error::Error>> {
    let mut rdr = csv::Reader::from_path("../quiz.csv")?;

    for result in rdr.records() {
        let record = result?;
        println!("{:?}", record);
    }

    Ok(())
}

fn main() {
    let result = example();

    println!("{:?}", result);
}