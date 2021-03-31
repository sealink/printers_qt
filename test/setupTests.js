const nodeCrypto = require('crypto');
require('regenerator-runtime/runtime');
window.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer);
  }
};
