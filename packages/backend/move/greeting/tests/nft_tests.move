#[test_only]
module greeting::nft_tests {
    use sui::test_scenario::{Self, Scenario};
    use greeting::nft::{Self, Puppy};
    use sui::transfer;
    use std::string::{Self, String};

    #[test]
    fun test_mint_and_transfer_puppy() {
        let owner = @0xA;
        let recipient = @0xB;
        let mut scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;

        // Test minting a puppy
        test_scenario::next_tx(scenario, owner);
        {
            let name = string::utf8(b"Buddy");
            let url = string::utf8(b"https://example.com/buddy.jpg");
            let puppy = nft::mint(name, url, test_scenario::ctx(scenario));
            
            assert!(nft::name(&puppy) == &name, 0);
            assert!(nft::url(&puppy) == &url, 1);
            
            nft::transfer(puppy, owner);
            
        };

        // Verify the puppy was minted and transferred correctly
        test_scenario::next_tx(scenario, owner);
        {
            let puppy = test_scenario::take_from_sender<Puppy>(scenario);
            assert!(nft::name(&puppy) == &string::utf8(b"Buddy"), 2);
            assert!(nft::url(&puppy) == &string::utf8(b"https://example.com/buddy.jpg"), 3);
            
            // Transfer the puppy to the recipient
            nft::transfer(puppy, recipient);
        };

        // Verify the puppy was transferred to the recipient
        test_scenario::next_tx(scenario, recipient);
        {
            let puppy = test_scenario::take_from_sender<Puppy>(scenario);
            assert!(nft::name(&puppy) == &string::utf8(b"Buddy"), 4);
            assert!(nft::url(&puppy) == &string::utf8(b"https://example.com/buddy.jpg"), 5);
            test_scenario::return_to_sender(scenario, puppy);
        };

        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_mint_multiple_puppies() {
        let owner = @0xA;
        let mut scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;


        // Mint first puppy
        test_scenario::next_tx(scenario, owner);
        {
            let puppy1 = nft::mint(
                string::utf8(b"Max"),
                string::utf8(b"https://example.com/max.jpg"),
                test_scenario::ctx(scenario)
            );
            nft::transfer(puppy1, owner);
        };

        // Mint second puppy
        test_scenario::next_tx(scenario, owner);
        {
            let puppy2 = nft::mint(
                string::utf8(b"Luna"),
                string::utf8(b"https://example.com/luna.jpg"),
                test_scenario::ctx(scenario)
            );
            nft::transfer(puppy2, owner);
        };

        // Verify both puppies were minted correctly
        test_scenario::next_tx(scenario, owner);
        {
            let puppy1 = test_scenario::take_from_sender<Puppy>(scenario);
            let puppy2 = test_scenario::take_from_sender<Puppy>(scenario);
            
            // assert!(nft::name(&puppy1) == &string::utf8(b"Max"), 4);
            // assert!(nft::url(&puppy1) == &string::utf8(b"https://example.com/max.jpg"), 5);
            // assert!(nft::name(&puppy2) == &string::utf8(b"Luna"), 6);
            // assert!(nft::url(&puppy2) == &string::utf8(b"https://example.com/luna.jpg"), 7);
            
            test_scenario::return_to_sender(scenario, puppy1);
            test_scenario::return_to_sender(scenario, puppy2);
        };

        test_scenario::end(scenario_val);
    }
}