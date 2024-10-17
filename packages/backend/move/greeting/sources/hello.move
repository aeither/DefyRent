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
