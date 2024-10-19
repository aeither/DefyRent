
Resources

@mysten/dapp-kit React SDK
https://sdk.mystenlabs.com/typescript

use Ask Sui Al https://docs.sui.io/

scaffold documentation
https://sui-dapp-starter.dev/docs/category/hooks

## Instructions

Faucet

```bash
sui client faucet --address 0x978110b86146faa562d72a12131c5dc5021dd96d88e715c79d14fb9df0406c41
```

## Transfer

list all objects

```bash
sui client objects
```

```bash
sui client transfer-sui --sui-coin-object-id 0xdfa54b63482597360cc648b1cd6d6dce63c701786fb0e63fc4812f342ba9ea82 --to 0x978110b86146faa562d72a12131c5dc5021dd96d88e715c79d14fb9df0406c41 --amount 1234567 --gas-budget 900000000
```

## Build & Test

```bash
pn build
```

```bash
pn test
```

Test with filter
```bash
sui move test message_tests
```

## Deploy

```bash
pn backend:ship
```

what it does is `sui client publish --gas-budget 100000000 ./move/greeting`

## Interact

list all objects

```bash
sui client objects
```

reading data

```bash
sui client object 0xf151233df41b5110d1e3d68bad0853b268f403a62ff5ec36a78aeaac25624f10
```

call function set new message.

```bash
sui client call --function set_message --module message --package 0xec8ca60d8df8b33c736dcf63703a3926cef2f3d30c14dc9b96452f8eb465d7f1 --args 0xf151233df41b5110d1e3d68bad0853b268f403a62ff5ec36a78aeaac25624f10 "Your new message" --gas-budget 10000000
```

call function. Not useful

```bash
sui client call --function get_message --module message --package 0xec8ca60d8df8b33c736dcf63703a3926cef2f3d30c14dc9b96452f8eb465d7f1 --args 0xf151233df41b5110d1e3d68bad0853b268f403a62ff5ec36a78aeaac25624f10 --gas-budget 10000000
```

## Explorer

transaction

https://testnet.suivision.xyz/txblock/47RMMG46C11ucrNoPqfFgZUXmL9utp3e5BGVpKDUb4Qo

smart contract

https://testnet.suivision.xyz/package/0xec8ca60d8df8b33c736dcf63703a3926cef2f3d30c14dc9b96452f8eb465d7f1?tab=Code


## Walrus

install walrus CLI

```bash
SYSTEM=macos-arm64
curl https://storage.googleapis.com/mysten-walrus-binaries/walrus-testnet-latest-$SYSTEM -o walrus
chmod +x walrus
```

Move executable to 

```bash
/usr/local/bin/walrus
```


Explroer 

https://walruscan.com/testnet/home

Deploy: go to 

```bash
./target/release/site-builder publish ./examples/snake --epochs 100
```

Buy SuiNS requires 2 SUI

https://testnet.suins.io/

## Walrus Site Builder

switch to site-builder repository and run

```bash
./target/release/site-builder publish /Users/lin/Documents/Projects/DefyRent/packages/frontend/dist --epochs 1
```

## Resources

query struct: if simple just use registry to retrive objectId on smart contract side.
https://docs.sui.io/sui-api-ref#sui_getnormalizedmovestruct


Store SUI balance and withdraw balance
https://github.com/MystenLabs/apps/blob/main/suifrens/suifrens/sources/genesis.move
need to split coin with ts sdk: https://sdk.mystenlabs.com/typescript/transaction-building/basics

## tips

use table instead of vector for scalability