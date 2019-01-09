require('ts-node/register');

const { setup } = require('./setup');

module.exports = async () => {
  // to hanlde --watch restests
  if (!process.env.TEST_HOST) {
    await setup();
  }
  return null;
};
