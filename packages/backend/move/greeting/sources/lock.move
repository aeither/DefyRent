// module 0xf00041ce673abfab7316fdede32e04af2cfc95325b278adf4c16c817017274a::payment_tutor {
//     struct AdminCap has store, key {
//         id: 0x2::object::UID,
//     }
    
//     struct Registry has store, key {
//         id: 0x2::object::UID,
//         rents: 0x2::table::Table<address, u64>,
//         landlords: 0x2::table::Table<address, address>,
//         deposits: 0x2::balance::Balance<0x2::sui::SUI>,
//     }
    
//     public fun expired_contract(arg0: &mut Registry, arg1: address, arg2: u64, arg3: &AdminCap, arg4: &mut 0x2::tx_context::TxContext) {
//         assert!(0x2::table::contains<address, u64>(&arg0.rents, arg1), 2);
//         0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::take<0x2::sui::SUI>(&mut arg0.deposits, 0x2::table::remove<address, u64>(&mut arg0.rents, arg1) * 5 - arg2, arg4), arg1);
//         0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::take<0x2::sui::SUI>(&mut arg0.deposits, arg2, arg4), 0x2::table::remove<address, address>(&mut arg0.landlords, arg1));
//     }
    
//     fun init(arg0: &mut 0x2::tx_context::TxContext) {
//         let v0 = Registry{
//             id        : 0x2::object::new(arg0), 
//             rents     : 0x2::table::new<address, u64>(arg0), 
//             landlords : 0x2::table::new<address, address>(arg0), 
//             deposits  : 0x2::balance::zero<0x2::sui::SUI>(),
//         };
//         let v1 = AdminCap{id: 0x2::object::new(arg0)};
//         0x2::transfer::public_share_object<Registry>(v0);
//         0x2::transfer::public_transfer<AdminCap>(v1, 0x2::tx_context::sender(arg0));
//     }
    
//     public fun new_contract(arg0: &mut Registry, arg1: address, arg2: address, arg3: u64, arg4: &AdminCap) {
//         0x2::table::add<address, u64>(&mut arg0.rents, arg1, arg3);
//         0x2::table::add<address, address>(&mut arg0.landlords, arg1, arg2);
//     }
    
//     public fun pay_initial_deposit(arg0: &mut Registry, arg1: 0x2::coin::Coin<0x2::sui::SUI>, arg2: &mut 0x2::tx_context::TxContext) {
//         let v0 = 0x2::tx_context::sender(arg2);
//         assert!(0x2::table::contains<address, u64>(&arg0.rents, v0), 2);
//         assert!(0x2::coin::value<0x2::sui::SUI>(&arg1) == 5 * *0x2::table::borrow<address, u64>(&arg0.rents, v0), 3);
//         0x2::balance::join<0x2::sui::SUI>(&mut arg0.deposits, 0x2::coin::into_balance<0x2::sui::SUI>(arg1));
//     }
    
//     // decompiled from Move bytecode v6
// }

