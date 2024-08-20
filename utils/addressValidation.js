const bitcoin = require('bitcoinjs-lib');
const litecore = require('litecore-lib');

exports.isValidBitcoinAddress = (address) => {
  try {
    bitcoin.address.toOutputScript(address);
    return true;
  } catch (e) {
    return false;
  }
};

exports.isValidLightningAddress = (address) => {
  // Basic check for now, implement more robust validation if needed
  return address.startsWith('03') && address.length === 66;
};

exports.isValidLitecoinAddress = (address) => {
  return litecore.Address.isValid(address);
};