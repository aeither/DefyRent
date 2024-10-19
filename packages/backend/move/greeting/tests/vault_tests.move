#[test_only]
module greeting::vault_tests {
    use sui::test_scenario;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use greeting::vault::{Self, Vault, VaultOwnerCap};

    #[test]
    fun test_deposit_and_withdraw() {
        let owner = @0xCAFE;
        let mut scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;

        // Create the vault
        test_scenario::next_tx(scenario, owner);
        {
            vault::create_vault(test_scenario::ctx(scenario));
        };

        // Deposit SUI
        test_scenario::next_tx(scenario, owner);
        {
            let mut vault = test_scenario::take_shared<Vault>(scenario);
            let coin = coin::mint_for_testing<SUI>(100, test_scenario::ctx(scenario));
            vault::deposit(&mut vault, coin);
            assert!(vault::balance(&vault) == 100, 0);
            test_scenario::return_shared(vault);
        };

        // Withdraw SUI
        test_scenario::next_tx(scenario, owner);
        {
            let mut vault = test_scenario::take_shared<Vault>(scenario);
            let cap = test_scenario::take_from_sender<VaultOwnerCap>(scenario);
            vault::withdraw(&mut vault, &cap, 50, test_scenario::ctx(scenario));
            assert!(vault::balance(&vault) == 50, 1);
            test_scenario::return_shared(vault);
            test_scenario::return_to_sender(scenario, cap);
        };

        test_scenario::end(scenario_val);
    }
}