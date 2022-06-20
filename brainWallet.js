var bitcore = require("bitcore-lib");
var input = new Buffer("Hello! I am Kenneth");
var hash = bitcore.crypto.Hash.sha256(input);
var bn = bitcore.crypto.BN.fromBuffer(hash);
//private key
var pk = new bitcore.PrivateKey(bn);
//public key
var addy = pk.toAddress('test');
console.log("private key : " + pk + " , Public key : " + addy);