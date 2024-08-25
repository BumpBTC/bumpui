// exports.isValidBitcoinAddress = (address) => {
//   // Check if the address is between 26 and 35 characters long
//   if (address.length < 26 || address.length > 35) {
//     return false;
//   }

//   // Check for valid prefixes
//   const validPrefixes = ['1', '3', 'bc1', 'tb1'];
//   return validPrefixes.some(prefix => address.startsWith(prefix));
// };

exports.isValidLightningAddress = (address) => {
  // Check if the address is exactly 66 characters long and starts with '03'
  // return address.length === 66 && address.startsWith('03');
};

exports.isValidLitecoinAddress = (address) => {
  // Check if the address is between 26 and 34 characters long
  if (address.length < 26 || address.length > 34) {
    return false;
  }

  // Check for valid prefixes
  const validPrefixes = ['L', 'M', '3', 'ltc1'];
  return validPrefixes.some(prefix => address.startsWith(prefix));
};