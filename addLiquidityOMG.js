const Web3 = require('web3')
const constants = require('./constant')
require('dotenv').config()

const omgExchange = '0x32F6c3589674CC4131a9D41Cc453033c5505124D'

const OPTIONS = {
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
};

const web3 = new Web3("http://localhost:8545", null, OPTIONS)

const ownerPK = process.env.OWNER_PK

async function addLiquidityOMG(omgExchangeAddress) {
  const accounts = await web3.eth.personal.getAccounts()

  owner = accounts[0]

  let ethAmount = await web3.utils.toWei('0.1')

  let tokenAmount = await web3.utils.toWei('50000')

  contract = new web3.eth.Contract(constants.ABI_EXCHANGE, omgExchangeAddress);

  let count = await web3.eth.getTransactionCount(owner, "pending")


  let txObject = {
      from: owner,
      to: omgExchangeAddress,
      gasPrice: 1 * 1000000000,
      gasLimit: 1000000,
      gas: 3000000,  //only when connected to ganache
      chainId: 5777,
      nonce: web3.utils.toHex(count),
      data: contract.methods.addLiquidity(ethAmount, tokenAmount, 1839591241).encodeABI(),
      value:Number(ethAmount)
  }

  let signed = await web3.eth.accounts.signTransaction(txObject, ownerPK)


  let tx = await web3.eth.sendSignedTransaction(signed.rawTransaction)
      .on('confirmation', (confirmationNumber, receipt) => {
          if(confirmationNumber === 1){
              console.log('LIQUIDITY ADDED OMG')
          }
      })
      .on('error', (error) => {
          console.log(error)
      })
      .on('transactionHash', async (hash) => {
          console.log(hash);
      });
  return
}

addLiquidityOMG(omgExchange)