module greeting::nft {
    use std::string::String;
    use sui::event;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};

    /// An example NFT that can be minted by anybody. A Puppy is
    /// their puppy at any time and even change the image to the
    /// puppy's liking.
    public struct Puppy has key, store {
        id: UID,
        name: String,
        url: String,
    }

    /// Event: emitted when a new Puppy is minted.
    public struct PuppyMinted has copy, drop {
        /// ID of the Puppy
        puppy_id: address,
        /// The address of the NFT minter
        minted_by: address,
    }

    /// The object is returned to sender and they're free to transfer
    /// it to themselves or anyone else.
    public fun mint(
        name: String,
        url: String,
        ctx: &mut TxContext
    ): Puppy {
        let id = object::new(ctx);

        event::emit(PuppyMinted {
            puppy_id: object::uid_to_address(&id),
            minted_by: tx_context::sender(ctx),
        });

        Puppy { id, name, url }
    }

    /// As the puppy grows, owners can change the image to reflect
    /// the puppy's current state and look.
    public fun set_url(puppy: &mut Puppy, url: String) {
        puppy.url = url;
    }

    /// It's a good practice to allow the owner to destroy the NFT
    /// and get a storage rebate. Not a requirement and depends on
    /// your use case. At last, who doesn't love puppies?
    public fun destroy(puppy: Puppy) {
        let Puppy { id, url: _, name: _ } = puppy;
        object::delete(id)
    }

    /// Transfer the Puppy to a new owner
    public fun transfer(puppy: Puppy, recipient: address) {
        transfer::transfer(puppy, recipient);
    }

    // Getters for properties.
    // Struct fields are always private and unless there's a getter,
    // other modules can't access them. It's up to the module author
    // to decide which fields to expose and which to keep private.

    /// Get the Puppy's `name`
    public fun name(puppy: &Puppy): &String {
        &puppy.name
    }

    /// Get the Puppy's `url`
    public fun url(puppy: &Puppy): &String {
        &puppy.url
    }
}
