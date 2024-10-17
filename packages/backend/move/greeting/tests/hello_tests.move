#[test_only]
module greeting::message_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use greeting::message::{Self, Message};
    use std::string;

    #[test]
    fun test_message_flow() {
        let owner = @0xCAFE;
        let mut scenario = ts::begin(owner);

        // Test the init function
        {
            message::init_for_testing(ts::ctx(&mut scenario));
        };

        // Test getting the initial message
        ts::next_tx(&mut scenario, owner);
        {
            let message = ts::take_shared<Message>(&scenario);
            let content = message::get_message(&message);
            assert!(content == string::utf8(b"Hello World"), 0);
            ts::return_shared(message);
        };

        // Test setting a new message
        ts::next_tx(&mut scenario, owner);
        {
            let mut message = ts::take_shared<Message>(&mut scenario);
            message::set_message(&mut message, b"New message", ts::ctx(&mut scenario));
            ts::return_shared(message);
        };

        // Verify the new message
        ts::next_tx(&mut scenario, owner);
        {
            let message = ts::take_shared<Message>(&scenario);
            let content = message::get_message(&message);
            assert!(content == string::utf8(b"New message"), 1);
            ts::return_shared(message);
        };

        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = message::EEmptyMessage)]
    fun test_set_empty_message() {
        let owner = @0xCAFE;
        let mut scenario = ts::begin(owner);

        message::init_for_testing(ts::ctx(&mut scenario));

        ts::next_tx(&mut scenario, owner);
        {
            let mut message = ts::take_shared<Message>(&mut scenario);
            message::set_message(&mut message, b"", ts::ctx(&mut scenario));
            ts::return_shared(message);
        };

        ts::end(scenario);
    }
}