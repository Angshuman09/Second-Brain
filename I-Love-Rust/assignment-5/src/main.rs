fn make_multiplier(factor: i32) -> impl Fn(i32) -> i32 {
    move |x| x * factor
}

fn apply_all(nums: &[i32], f: impl Fn(i32) -> i32) -> Vec<i32> {
    nums.iter().map(|&num| f(num)).collect()
}

fn make_counter() -> impl FnMut() -> i32 {
    let mut count = 0;

    move || {
        let current = count;
        count += 1;
        current
    }
}
fn main() {
    let nums = vec![1, 2, 3, 4, 5];
    let triple = make_multiplier(3);
    let result = apply_all(&nums, triple);

    println!("{:?}", result);

    let mut counter = make_counter();
    
    println!("{}", counter());
    println!("{}", counter());
    println!("{}", counter());
    println!("{}", counter());
}
