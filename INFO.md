
Resources

@mysten/dapp-kit React SDK
https://sdk.mystenlabs.com/typescript


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

expand object

```bash
sui client object 0xf151233df41b5110d1e3d68bad0853b268f403a62ff5ec36a78aeaac25624f10
```

## Explorer

transaction

https://testnet.suivision.xyz/txblock/7WjvUhcpGbgBpv4MBAnGWMXMZhcBw4NgCb4ocqEcauMu

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