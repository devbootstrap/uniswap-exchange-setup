# Uniswap Exchange Setup

This repository is for setting up uniswap's environment on testnet.
This example contains setting up XIO and OMG token exchanges on uniswap factory.
Replace the bytecodes and ABIs to setup something different.
This script will deploy tokens on testnet, create factory, create exchanges for both tokens and will add initial liquidity of 0.1 ETH for 50000 Tokens.
Just run the index.js file and all will be setup. This can be run on any ethereum network.

## Geth

This is designed to deploy the Uniswap V1 contracts to a local private Geth node for development purposes. In the index.js file Web3 is configured to connect to Geth via an Ipc Provider. Just set `GETH_IPC_PATH` in your `.env` file to the location of the Geth ipc file to connect to Geth.

## Deploy Contracts

Simply run the index.js file like so:

```
node index
```