const sharedConfig = require('./config.shared.js')();

module.exports = {
  ...sharedConfig,
  mode: 'production',
};
