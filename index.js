const Web3 = require('web3')
const constants = require('./constant')
require('dotenv').config()

let contract;

const OPTIONS = {
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

const web3 = new Web3("ws://localhost:8545", null, OPTIONS) // for main net

let owner
const ownerPK = process.env.OWNER_PK

async function accounts() {
    const accounts = await web3.eth.personal.getAccounts()
    owner = accounts[0]
}

async function main() {
    await accounts()
    console.log('Owner', owner)
    let xioAddress = await deployXIO()
    console.log(xioAddress, "XIO")
    let omgAddress = await deployOMG()
    console.log(omgAddress, "OMG")
    let exchangeTemplateAddress = await deployExchange()
    console.log(exchangeTemplateAddress, "TEMPLATE")
    let factoryAddress = await deployFactory(exchangeTemplateAddress)
    console.log(factoryAddress, "FACTORY")
    let xioExchange = await deployXIOExchange(factoryAddress, xioAddress)
    console.log(xioExchange, "XIO EXCHANGE")
    // let omgExchange = await deployOMGExchange(factoryAddress, omgAddress)
    // console.log(omgExchange, "OMG EXCHANGE")
    return
}

async function deployXIO() {
    contract = new web3.eth.Contract(constants.ABI_XIO);
    let result = await deploy(contract, constants.BYTE_CODE_XIO)
    return result
}

async function deployOMG() {
    contract = new web3.eth.Contract(constants.ABI_OMG);
    let result = await deploy(contract, constants.BYTE_CODE_OMG)
    return result
}

async function deployFactory(exchangeTemplateAddress) {
    contract = new web3.eth.Contract(constants.ABI_FACTORY);
    let result = await deploy(contract, constants.BYTE_CODE_FACTORY, exchangeTemplateAddress)
    return result
}

async function deployExchange() {
    contract = new web3.eth.Contract(constants.ABI_EXCHANGE);
    let result = await deploy(contract, constants.BYTE_CODE_EXCHANGE)
    return result
}

async function deployXIOExchange(factoryAddress, xioTokenAddress) {
    contract = new web3.eth.Contract(constants.ABI_FACTORY, factoryAddress);

    var contractAddress = '';

    let count = await web3.eth.getTransactionCount(owner, "pending")

    let txObject = {
        from: owner,
        to: factoryAddress,
        gasPrice: 1 * 1000000000,
        gasLimit: 1000000,
        gas: 3000000,  //only when connected to ganache
        // chainId: 5777,
        nonce: web3.utils.toHex(count),
        data: contract.methods.createExchange(xioTokenAddress).encodeABI()
    }

    console.log('IN deployXIOExchange', txObject)

    let signed = await web3.eth.accounts.signTransaction(txObject, ownerPK)

    await web3.eth.sendSignedTransaction(signed.rawTransaction).then(res=>{
        console.log(res.transactionHash)
    })


    let blockNumber = await web3.eth.getBlockNumber()
    await contract.getPastEvents('NewExchange', {
        fromBlock: blockNumber,
        toBlock: blockNumber
    }).then(events => {
        console.log(events)
        contractAddress = events[0].returnValues['1']
    });

    return contractAddress
}

async function deployOMGExchange(factoryAddress, omgTokenAddress) {
    contract = new web3.eth.Contract(constants.ABI_FACTORY, factoryAddress);

    var contractAddress = '';

    let count = await web3.eth.getTransactionCount(owner, "pending")


    let txObject = {
        from: owner,
        to: factoryAddress,
        gasPrice: 1 * 1000000000,
        gasLimit: 1000000,
        gas: 3000000,  //only when connected to ganache
        chainId: 5777,
        nonce: web3.utils.toHex(count),
        data: contract.methods.createExchange(omgTokenAddress).encodeABI()
    }

    let signed = await web3.eth.accounts.signTransaction(txObject, ownerPK)

    await web3.eth.sendSignedTransaction(signed.rawTransaction).then(res=>{
        console.log(res.transactionHash)
    })

    let blockNumber = await web3.eth.getBlockNumber()
    await contract.getPastEvents('NewExchange', {
        fromBlock: blockNumber,
        toBlock: blockNumber
    }).then(events => {
        contractAddress = events[0].returnValues['1']
    });
    return contractAddress
}

async function deploy(contract, bytecode, params) {
    var contractAddress = '';
    let data = ''

    let count = await web3.eth.getTransactionCount(owner, "pending")

    if (params) {
        data = contract.deploy({
            data: bytecode,
            arguments: [params]
        }).encodeABI()
    } else {
        data: contract.deploy({
            data: bytecode
        }).encodeABI()
    }

    let txObject = {
        from: owner,
        gasPrice: 1 * 1000000000,
        gasLimit: 1000000,
        gas: 3000000,  //only when connected to ganache
        chainId: 5777,
        nonce: web3.utils.toHex(count),
        data: data,
    }

    let signed = await web3.eth.accounts.signTransaction(txObject, ownerPK)

    await web3.eth.sendSignedTransaction(signed.rawTransaction)
        .on('error', function (error) {
            console.log(error)
        })
        .on('transactionHash', function (transactionHash) {
            console.log(transactionHash)
        })
        .on("receipt", function (receipt) {
            contractAddress = receipt.contractAddress
        })
    return contractAddress
}

main()