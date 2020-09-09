const Web3 = require('web3')
const constants = require('./constant')
require('dotenv').config()

const xioExchange = '0x2b09bFecb038a1E1d49BE5da7B97D9C920c96aD6a'

const OPTIONS = {
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
};

const web3 = new Web3("http://localhost:8545", null, OPTIONS)

const ownerPK = process.env.OWNER_PK

async function addLiquidityXIO(xioExchangeAddress) {
  let ethAmount = await web3.utils.toWei('0.1')

  let tokenAmount = await web3.utils.toWei('50000')

  contract = new web3.eth.Contract(constants.ABI_EXCHANGE, xioExchangeAddress);

  let count = await web3.eth.getTransactionCount(owner, "pending")


  let txObject = {
      from: owner,
      to: xioExchangeAddress,
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
              console.log("LIQUIDITY ADDED XIO")
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

await addLiquidityXIO(xioExchange)