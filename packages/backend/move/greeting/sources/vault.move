// module my_package::vault {
//     use sui::object::{Self, UID};
//     use sui::transfer;
//     use sui::sui::SUI;
//     use sui::coin::{Self, Coin};
//     use sui::balance::{Self, Balance};
//     use sui::tx_context::{Self, TxContext};

//     /// Struct to represent the Vault
//     struct Vault has key {
//         id: UID,
//         balance: Balance<SUI>
//     }

//     /// Capability for the owner of the Vault
//     struct VaultOwnerCap has key, store {
//         id: UID
//     }

//     /// Error codes
//     const EInsufficientBalance: u64 = 0;
//     const EInsufficientDeposit: u64 = 1;

//     /// Minimum required initial deposit
//     const MIN_INITIAL_DEPOSIT: u64 = 1000;

//     /// Pay initial deposit to create a new Vault
//     public entry fun pay_initial_deposit(
//         payment: &mut Coin<SUI>,
//         ctx: &mut TxContext
//     ) {
//         let payment_value = coin::value(payment);
//         assert!(payment_value >= MIN_INITIAL_DEPOSIT, EInsufficientDeposit);

//         let vault = Vault {
//             id: object::new(ctx),
//             balance: balance::zero()
//         };

//         let owner_cap = VaultOwnerCap {
//             id: object::new(ctx)
//         };

//         // Split the payment coin and add it to the vault's balance
//         let payment_balance = coin::balance_mut(payment);
//         let split_coin = balance::split(payment_balance, MIN_INITIAL_DEPOSIT);
//         balance::join(&mut vault.balance, split_coin);

//         // Transfer the Vault to the sender
//         transfer::share_object(vault);

//         // Transfer the VaultOwnerCap to the sender
//         transfer::transfer(owner_cap, tx_context::sender(ctx));
//     }

//     /// Withdraw SUI from the Vault
//     public entry fun withdrawal(
//         vault: &mut Vault,
//         cap: &VaultOwnerCap,
//         amount: u64,
//         ctx: &mut TxContext
//     ) {
//         // Ensure the vault has sufficient balance
//         assert!(balance::value(&vault.balance) >= amount, EInsufficientBalance);

//         // Create a new coin with the withdrawn amount
//         let withdrawn_coin = coin::from_balance(balance::split(&mut vault.balance, amount), ctx);

//         // Transfer the withdrawn coin to the sender
//         transfer::transfer(withdrawn_coin, tx_context::sender(ctx));
//     }

//     /// View function to get the balance of the Vault
//     public fun balance(vault: &Vault): u64 {
//         balance::value(&vault.balance)
//     }
// }