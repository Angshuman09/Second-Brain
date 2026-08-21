use std::time::{Duration, Instant};

#[derive(Debug, Clone, Copy)]
pub enum CircuitState{
    Closed,
    Open,
    HalfOpen,
}

pub struct CircuitBreaker{
    state: CircuitState,
    failures: u32,
    failure_threshold: u32,
    opened_at: Option<Instant>,
    cooldown: Duration
}

impl CircuitBreaker{
    pub fn new(failure_threshold: u32, cooldown: Duration)-> Self{
        Self{
            state: CircuitState::Closed,
            failures: 0,
            failure_threshold,
            opened_at: None,
            cooldown
        }
    }

    pub fn allow_request(&mut self) -> bool{
        match self.state{
            CircuitState::Closed => true,
            CircuitState::Open => {
                if let Some(opened_at) = self.opened_at{
                    if opened_at.elapsed() >= self.cooldown{
                        self.state = CircuitState::HalfOpen;
                        println!("circuit: OPEN -> HALF-OPEN");
                        return true;
                    }
                }
                false
            },
            CircuitState::HalfOpen => true
        }
    }

    pub fn record_success(&mut self){
        self.failures = 0;
        if matches!(self.state, CircuitState::HalfOpen){
            self.state = CircuitState::Closed;
            self.opened_at = None;
            println!("circuit: HALF-OPEN -> CLOSED");
        }
    }

    pub fn record_failure(&mut self){
        self.failures += 1;
        println!("circuit: failure {}/{}", self.failures, self.failure_threshold);

        if self.failures >= self.failure_threshold{
            self.state = CircuitState::Open;
            self.opened_at = Some(Instant::now());

            println!("circuit: CLOSED -> OPEN");
        }else if matches!(self.state, CircuitState::HalfOpen) {
                    self.state = CircuitState::Open;
                    self.opened_at = Some(Instant::now());
        
                    println!("circuit: HALF-OPEN -> OPEN");
             }
    }
}
