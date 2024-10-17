#[test_only]
module greeting::message_tests {
    use sui::test_scenario::{Self, Scenario};
    use greeting::message::{Self, Message};

    #[test]
    fun test_message_flow() {
        let owner = @0xCAFE;
        let scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;

        // Test the init function (implicitly called)
        test_scenario::next_tx(scenario, owner);
        {
            // Check if the Message object is created and shared
            assert!(test_scenario::has_most_recent_shared<Message>(), 0);
        };

        // Test getting the initial message
        test_scenario::next_tx(scenario, owner);
        {
            let message = test_scenario::take_shared<Message>(scenario);
            let content = message::get_message(&message);
            assert!(content == b"Hello World", 1);
            test_scenario::return_shared(message);
        };

        // Test setting a new message
        test_scenario::next_tx(scenario, owner);
        {
            let message = test_scenario::take_shared<Message>(scenario);
            message::set_message(&mut message, b"New message", test_scenario::ctx(scenario));
            test_scenario::return_shared(message);
        };

        // Verify the new message
        test_scenario::next_tx(scenario, owner);
        {
            let message = test_scenario::take_shared<Message>(scenario);
            let content = message::get_message(&message);
            assert!(content == b"New message", 2);
            test_scenario::return_shared(message);
        };

        test_scenario::end(scenario_val);
    }
}