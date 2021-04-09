const nodeCrypto = require('crypto');
require('isomorphic-fetch');

require('regenerator-runtime/runtime');
window.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer);
  },
};
