const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const gen7 = customAlphabet(alphabet, 7);

function generateCode(len = 7) {
  if (![6,7,8].includes(len)) len = 7;
  return gen7().slice(0, len);
}

module.exports = { generateCode };
