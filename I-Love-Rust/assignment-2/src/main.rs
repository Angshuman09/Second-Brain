use std::fmt;
use std::num::ParseFloatError;

enum DivError{
    ParseError(ParseFloatError), 
    DivisionByZero
}

impl From<ParseFloatError> for DivError{
    fn from(err: ParseFloatError) -> Self{
        DivError::ParseError(err)
    }
}

impl fmt::Display for DivError{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result{
        match *self{
            DivError::ParseError(_) => write!(f, "failed to parse a number"),
            DivError::DivisionByZero => write!(f, "can't divisible by zero")
        }
    }
}

fn main() {
    let tests = [
        ("4","2"),
        ("6", "3"),
        ("hello", "2"),
        ("49", "7")
    ];

    for (a, b) in tests{
        match parse_and_divide(a, b){
            Ok(result) => println!("{a}/{b} ==> {result}"),
            Err(error) => println!("{a}/{b} ==> {error}")
        }
    }
}

fn parse_and_divide(a: &str, b: &str) -> Result<f64, DivError>{
    let a: f64 = a.parse()?;
    let b: f64 = b.parse()?;

    if b == 0.0{
        return Err(DivError::DivisionByZero);
    }

    Ok(a/b)
}