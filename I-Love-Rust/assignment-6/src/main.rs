use std::{cell::RefCell, rc::Rc};

struct Account{
    balance: Rc<RefCell<f64>>
}

impl Account{
    fn new(initial: f64) -> Account{
        Account {
            balance: Rc::new(RefCell::new(initial))
        }
    }

    fn deposite(&self, amount: f64){
        let mut balance = self.balance.borrow_mut();
        *balance+=amount;
    }
    fn withdraw(&self, amount: f64)->Result<(), String>{
        let mut balance = self.balance.borrow_mut();
        
        if *balance < amount{
            return Err("insufficient funds".to_string());
        }

        *balance-=amount;
        Ok(())
    }

    fn clone_handle(&self) -> Account{
        Account { balance: Rc::clone(&self.balance) }
    }

    fn balance(&self) -> f64{
        *self.balance.borrow()
    }
}

fn main() {
    let account = Account::new(100.0);
    let clone = account.clone_handle();
    let clone2 = account.clone_handle();

    account.deposite(500.0);
    clone.withdraw(200.0).unwrap();
    clone2.deposite(200.0);

    println!("account: {}", account.balance());
    println!("clone: {}", clone.balance());
}
