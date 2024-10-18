module greeting::nft {
    use sui::event;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::package;
    use sui::display;
    use std::string::{Self, String};
    use sui::transfer;

    /// One-Time-Witness for the module.
    public struct NFT has drop {}

    /// An example NFT that can be minted by anybody. A Rental is
    /// their rental at any time and even change the image to the
    /// rental's liking.
    public struct Rental has key, store {
        id: UID,
        name: String,
        url: String,
    }

    /// Event: emitted when a new Rental is minted.
    public struct RentalMinted has copy, drop {
        /// ID of the Rental
        rental_id: address,
        /// The address of the NFT minter
        minted_by: address,
    }

    fun init(otw: NFT, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"image_url"),
            string::utf8(b"description"),
            string::utf8(b"project_url"),
            string::utf8(b"creator"),];

        let values = vector[
            string::utf8(b"{name}"),
            string::utf8(b"{url}"),
            string::utf8(b"Rental Unit #3827"),
            string::utf8(b"https://example.com"),
            string::utf8(b"Landlord"),];

        // Claim the `Publisher` for the package.
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `Rental` type.
        let mut display = display::new_with_fields<Rental>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    /// The object is returned to sender and they're free to transfer
    /// it to themselves or anyone else.
    public fun mint(name: String, url: String, ctx: &mut TxContext): Rental {
        let id = object::new(ctx);

        event::emit(
            RentalMinted {
                rental_id: object::uid_to_address(&id),
                minted_by: tx_context::sender(ctx),
            },
        );

        Rental { id, name, url }
    }

    /// As the rental changes, owners can change the image to reflect
    /// the rental's current state and look.
    public fun set_url(rental: &mut Rental, url: String) {
        rental.url = url;
    }

    /// It's a good practice to allow the owner to destroy the NFT
    /// and get a storage rebate. Not a requirement and depends on
    /// your use case. At last, who doesn't love rentals?
    public fun destroy(rental: Rental) {
        let Rental { id, url: _, name: _ } = rental;
        object::delete(id)
    }

    /// Transfer the Rental to a new owner
    public fun transfer(rental: Rental, recipient: address) {
        transfer::transfer(rental, recipient);
    }

    // Getters for properties.
    // Struct fields are always private and unless there's a getter,
    // other modules can't access them. It's up to the module author
    // to decide which fields to expose and which to keep private.

    /// Get the Rental's `name`
    public fun name(rental: &Rental): &String {
        &rental.name
    }

    /// Get the Rental's `url`
    public fun url(rental: &Rental): &String {
        &rental.url
    }
}