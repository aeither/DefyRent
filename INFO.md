
Resources

@mysten/dapp-kit React SDK
https://sdk.mystenlabs.com/typescript


## Instructions

Faucet

```bash
sui client faucet --address 0x978110b86146faa562d72a12131c5dc5021dd96d88e715c79d14fb9df0406c41
```

## Transfer

```bash
sui client transfer-sui --amount 1000000000 --to 0x978110b86146faa562d72a12131c5dc5021dd96d88e715c79d14fb9df0406c41 --gas-budget 10000000
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