use std::f64::consts::PI;

trait Shape {
    fn area(&self) -> f64;
    fn perimeter(&self) -> f64;
}
struct Circle{
    radius: f64
}

struct Rectangle{
    width: f64,
    height: f64
}

impl Shape for Circle{
    fn area(&self) -> f64{
        PI*self.radius*self.radius
    }

    fn perimeter(&self) -> f64{
        2.0*PI*self.radius
    }
}

impl Shape for Rectangle{
    fn area(&self) -> f64{
        self.width*self.height
    }

    fn perimeter(&self) -> f64{
        2.0*(self.width + self.height)
    }
}

fn describe<T: Shape + ?Sized>(shape: &T) -> String
{
    format!("Area: {}, Perimeter: {}", shape.area(), shape.perimeter())
}

fn total_area(shapes: &[Box<dyn Shape>]) -> f64{
    shapes.iter().map(|shape| shape.area()).sum()
}

fn main() {
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle {radius: 2.0}),
        Box::new(Rectangle{width:6.0, height: 7.0}),
        Box::new(Circle{radius: 5.0})
    ];

    for shape in &shapes{
        println!("{}",describe(shape.as_ref()));
    }

    println!("total area: {}", total_area(&shapes));
}