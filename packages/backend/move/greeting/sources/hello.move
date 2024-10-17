// Copyright (c) Your Name
// SPDX-License-Identifier: MIT

module greeting::message {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::event;

    // === Errors ===

    const EEmptyMessage: u64 = 0;

    // === Structs ===

    /// Represents a message object
    public struct Message has key, store {
        id: UID,
        content: String
    }

    // === Events ===

    /// Emitted when a new message is set
    public struct MessageSet has copy, drop {
        message_id: address,
        new_content: String
    }

    // === Public Functions ===

    /// Initialize the message
    fun init(ctx: &mut TxContext) {
        let message = Message {
            id: object::new(ctx),
            content: string::utf8(b"Hello World")
        };
        transfer::share_object(message);
    }

    /// Set a new message
    public entry fun set_message(message: &mut Message, new_content: vector<u8>, _ctx: &mut TxContext) {
        let content = string::utf8(new_content);
        assert!(!string::is_empty(&content), EEmptyMessage);
        message.content = content;

        event::emit(MessageSet {
            message_id: object::uid_to_address(&message.id),
            new_content: message.content
        });
    }

    /// Get the current message
    public fun get_message(message: &Message): String {
        message.content
    }

    // === Test Functions ===

    #[test_only]
    /// Initialize the module for testing
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx)
    }
}

// #[test_only]
// module greeting::message_tests {
//     use sui::test_scenario::{Self as ts, Scenario};
//     use greeting::message::{Self, Message};
//     use std::string;

//     #[test]
//     fun test_message_flow() {
//         let owner = @0xCAFE;
//         let scenario = ts::begin(owner);

//         // Test the init function
//         {
//             message::init_for_testing(ts::ctx(&mut scenario));
//         };

//         // Test getting the initial message
//         ts::next_tx(&mut scenario, owner);
//         {
//             let message = ts::take_shared<Message>(&scenario);
//             let content = message::get_message(&message);
//             assert!(content == string::utf8(b"Hello World"), 0);
//             ts::return_shared(message);
//         };

//         // Test setting a new message
//         ts::next_tx(&mut scenario, owner);
//         {
//             let message = ts::take_shared<Message>(&scenario);
//             message::set_message(&mut message, b"New message", ts::ctx(&mut scenario));
//             ts::return_shared(message);
//         };

//         // Verify the new message
//         ts::next_tx(&mut scenario, owner);
//         {
//             let message = ts::take_shared<Message>(&scenario);
//             let content = message::get_message(&message);
//             assert!(content == string::utf8(b"New message"), 1);
//             ts::return_shared(message);
//         };

//         ts::end(scenario);
//     }

//     #[test]
//     #[expected_failure(abort_code = message::EEmptyMessage)]
//     fun test_set_empty_message() {
//         let owner = @0xCAFE;
//         let scenario = ts::begin(owner);

//         message::init_for_testing(ts::ctx(&mut scenario));

//         ts::next_tx(&mut scenario, owner);
//         {
//             let message = ts::take_shared<Message>(&scenario);
//             message::set_message(&mut message, b"", ts::ctx(&mut scenario));
//             ts::return_shared(message);
//         };

//         ts::end(scenario);
//     }
// }