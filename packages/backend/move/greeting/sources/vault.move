module greeting::vault {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::tx_context::{Self, TxContext};

    /// Struct to represent the Vault
    public struct Vault has key {
        id: UID,
        balance: Balance<SUI>
    }

    /// Capability for the owner of the Vault
    public struct VaultOwnerCap has key, store {
        id: UID
    }

    /// Error codes
    const EInsufficientBalance: u64 = 0;

    /// Create a new Vault
    public entry fun create_vault(ctx: &mut TxContext) {
        let vault = Vault {
            id: object::new(ctx),
            balance: balance::zero()
        };

        let owner_cap = VaultOwnerCap {
            id: object::new(ctx)
        };

        // Transfer the Vault to the sender
        transfer::share_object(vault);

        // Transfer the VaultOwnerCap to the sender
        transfer::transfer(owner_cap, tx_context::sender(ctx));
    }

    /// Deposit SUI into the Vault
    public entry fun deposit(vault: &mut Vault, coin: Coin<SUI>) {
        let coin_balance = coin::into_balance(coin);
        balance::join(&mut vault.balance, coin_balance);
    }

    /// Withdraw SUI from the Vault
    public entry fun withdraw(
        vault: &mut Vault,
        _cap: &VaultOwnerCap,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(balance::value(&vault.balance) >= amount, EInsufficientBalance);
        let withdrawn_coin = coin::take(&mut vault.balance, amount, ctx);
        transfer::public_transfer(withdrawn_coin, tx_context::sender(ctx));
    }

    /// View function to get the balance of the Vault
    public fun balance(vault: &Vault): u64 {
        balance::value(&vault.balance)
    }
}