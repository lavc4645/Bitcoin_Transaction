const axios = require("axios");
const bitcore = require("bitcore-lib");


var privateKeyWIF = 'cPCipjcJqmzPy8g5wEU4Rs3Rj7vXgQRtydw7unVNcvSuMxHmbupn';

var privateKey = new bitcore.PrivateKey.fromWIF(privateKeyWIF);
var address = privateKey.toAddress();

var publicKey = privateKey.toPublicKey();
var address = publicKey.toAddress('testnet');
// var pk = bitcore.crypto.BN.fromBuffer(privateKeyWIF);
// var privateKey = new bitcore.PrivateKey(pk);
// var addy = privateKey.toAddress('test');
// console.log("address:", addy);





var bn = bitcore.crypto.BN.fromBuffer(address.hashBuffer);
//private key
var pk = new bitcore.PrivateKey(bn);
//public key
var addy = pk.toAddress('test');
console.log("private key : " + pk + " , Public key : " + addy);



//                            *************************







/** 
  @receiverAddress - Address of the person you want to send bitcoin to
  @amountToSend - This is the amount of bitcoin you want to send to someone from 
  your wallet. This amount will be deducted from your wallet and sent to this address.
*/

let sendBitcoin = (recieverAddress, amountToSend) => {
    const sochain_network = "BTCTEST"; // the Testnet network for sochain

    privatekey = pk
    sourceAddress = addy


    /**
because the outputs come in satoshis, and 1 Bitcoin is equal to 100,000,000 satoshies, 
we'll multiply the amount of bitcoin by 100,000,000 to get the value in satoshis.
*/


const satoshiToSend = amountToSend * 100000000;
let fee =0;
let inputCount =0;
let outputCount =2 

/**
 * we are going to use 2 as the output count because we'll only send the bitcoin to
 *  2 addresses the receiver's address and our change address.
 */




// ********************* Receiving unspent outputs *****************************


const utxos = await.get(
    'https://sochain.com/api/v2/get_tx_unspent/$BTCTEST/$mx81QK2K95oNhDddHeeErav815NUKhku2V'
);

const transaction = new bitcore.Transaction();



// Building new inputs
/**
 * satshis: the value of the unspent output in satoshi
 * script: an instruction defining how to spend the unspent Output
 * address: your wallet address
 * transaction ID (txid): this a unique id to identify your transaction in the blockchain
 * outputIndex: the index of each output in a transaction
 */
// Grab that data from the array of unspent output and build the new inputs:


let totalAmountAvailable =0;
let inputs= [];
utxos.data.data.txs.forEach(async (element) => {
    let utxo = {};


    utxos.satoshis = Math.floor(Number(element.value) * 100000000);
    utxos.script = element.script_hex;
    utxos.address = utxos.data.data.address;
    utxos.txId = element.txid;
    utxos.outputIndex = element.output_no;

    totalAmountAvailable += utxo.satoshis;
    inputCount += 1;
    inputs.push(utxo);
});


// Now that we’ve got the inputs in an array, let’s set the transaction inputs.





//  ************************ DEALING WITH BITCOIN TRANSACTION FEES ****************

transactionSize = inputCount * 146 + outputCount * 34 +10 - inputCount;

// Check if we have enough funds to cover the transaction and the fees
// manually set transaction fees: 20 satoshis per byte
transaction.fee(fee * 20);
if (totalAmountAvailable - satoshiToSend - fee <0) {
    throw new Error("Balance is too low for this transaction");
}

transaction.from(inputs);

transaction.to(recieverAddress, satoshiToSend);



// setting up the bicoin change address
transaction.change(sourceAddress);

// Signing the transaction with your private key
transaction.sign(privateKey);

// Serialize the txn to broadcast is to blockchain
const serializedTransaction = transaction.serialize();


// broadcast the transaction

const result = await axios({
    method: "POST",
    url: 'https://sochain.com/api/v2/get_tx_unspent/$BTCTEST/$mx81QK2K95oNhDddHeeErav815NUKhku2V',
    data: {
        tx_hex: serializedTX,
    },
});

return result.data.data;

}