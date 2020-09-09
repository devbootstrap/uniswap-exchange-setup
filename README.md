# Uniswap Exchange Setup

This repository is for setting up uniswap's environment on testnet.
This example contains setting up XIO and OMG token exchanges on uniswap factory.
Replace the bytecodes and ABIs to setup something different.
This script will deploy tokens on testnet, create factory, create exchanges for both tokens and will add initial liquidity of 0.1 ETH for 50000 Tokens.
Just run the index.js file and all will be setup. This can be run on any ethereum network.

## Ganache

```
ganache-cli -i 5777 -m 'disease cheap day once woman conduct fish layer kangaroo excite setup town'
```

## Deploy Contracts

## Add Liquidity

## Interact in Truffle Console

```
const constants = require('./constant')
const deployed = require('./deployed') // Enure addresses are updated here!

omgExchange = new web3.eth.Contract(constants.ABI_EXCHANGE, deployed.OMG_EXCHANGE_ADDR)
Object.keys(omgExchange.methods)

omgExchange.methods.name().call()
```