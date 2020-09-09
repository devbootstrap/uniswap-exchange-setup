# Uniswap Exchange Setup

This repository is for setting up uniswap's environment on testnet.
This example contains setting up XIO and OMG token exchanges on uniswap factory.
Replace the bytecodes and ABIs to setup something different.
This script will deploy tokens on testnet, create factory, create exchanges for both tokens and will add initial liquidity of 0.1 ETH for 50000 Tokens.
Just run the index.js file and all will be setup. This can be run on any ethereum network.

## Ganache

You can test this using ganache but you need to use a password to sign the transactions (set it in `.env`).

```
ganache-cli -i 5777 -m 'disease cheap day once woman conduct fish layer kangaroo excite setup town'
```

## Deploy Contracts

Simply run the index.js file like so:

```
node index
```