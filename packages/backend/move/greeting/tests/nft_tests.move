#[test_only]
module greeting::nft_tests {
    use sui::test_scenario::{Self, Scenario};
    use greeting::nft::{Self, Rental};
    use sui::transfer;
    use std::string::{Self, String};

    #[test]
    fun test_mint_and_transfer_rental() {
        let owner = @0xA;
        let recipient = @0xB;
        let mut scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;

        // Test minting a rental
        test_scenario::next_tx(scenario, owner);
        {
            let name = string::utf8(b"Buddy");
            let url = string::utf8(b"https://example.com/buddy.jpg");
            let rental = nft::mint(name, url, test_scenario::ctx(scenario));
            
            assert!(nft::name(&rental) == &name, 0);
            assert!(nft::url(&rental) == &url, 1);
            
            nft::transfer(rental, owner);
            
        };

        // Verify the rental was minted and transferred correctly
        test_scenario::next_tx(scenario, owner);
        {
            let rental = test_scenario::take_from_sender<Rental>(scenario);
            assert!(nft::name(&rental) == &string::utf8(b"Buddy"), 2);
            assert!(nft::url(&rental) == &string::utf8(b"https://example.com/buddy.jpg"), 3);
            
            // Transfer the rental to the recipient
            nft::transfer(rental, recipient);
        };

        // Verify the rental was transferred to the recipient
        test_scenario::next_tx(scenario, recipient);
        {
            let rental = test_scenario::take_from_sender<Rental>(scenario);
            assert!(nft::name(&rental) == &string::utf8(b"Buddy"), 4);
            assert!(nft::url(&rental) == &string::utf8(b"https://example.com/buddy.jpg"), 5);
            test_scenario::return_to_sender(scenario, rental);
        };

        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_mint_multiple_rentals() {
        let owner = @0xA;
        let mut scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;


        // Mint first rental
        test_scenario::next_tx(scenario, owner);
        {
            let rental1 = nft::mint(
                string::utf8(b"Max"),
                string::utf8(b"https://example.com/max.jpg"),
                test_scenario::ctx(scenario)
            );
            nft::transfer(rental1, owner);
        };

        // Mint second rental
        test_scenario::next_tx(scenario, owner);
        {
            let rental2 = nft::mint(
                string::utf8(b"Luna"),
                string::utf8(b"https://example.com/luna.jpg"),
                test_scenario::ctx(scenario)
            );
            nft::transfer(rental2, owner);
        };

        // Verify both rentals were minted correctly
        test_scenario::next_tx(scenario, owner);
        {
            let rental1 = test_scenario::take_from_sender<Rental>(scenario);
            let rental2 = test_scenario::take_from_sender<Rental>(scenario);
            
            // assert!(nft::name(&rental1) == &string::utf8(b"Max"), 4);
            // assert!(nft::url(&rental1) == &string::utf8(b"https://example.com/max.jpg"), 5);
            // assert!(nft::name(&rental2) == &string::utf8(b"Luna"), 6);
            // assert!(nft::url(&rental2) == &string::utf8(b"https://example.com/luna.jpg"), 7);
            
            test_scenario::return_to_sender(scenario, rental1);
            test_scenario::return_to_sender(scenario, rental2);
        };

        test_scenario::end(scenario_val);
    }
}