module greeting::message {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // Define the Message struct
    struct Message has key, store {
        id: UID,
        content: vector<u8>
    }

    // Initialize the message
    fun init(ctx: &mut TxContext) {
        let message = Message {
            id: object::new(ctx),
            content: b"Hello World"
        };
        transfer::share_object(message);
    }

    // Set a new message
    public entry fun set_message(message: &mut Message, new_content: vector<u8>, _: &TxContext) {
        message.content = new_content;
    }

    // Get the current message
    public fun get_message(message: &Message): vector<u8> {
        message.content
    }
}