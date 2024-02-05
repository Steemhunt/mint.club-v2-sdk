const sdk = require('test-mint.club-v2-sdk');

sdk.bondContract
  .network('ethereum')
  .read({
    functionName: 'creationFee',
    args: [],
  })
  .then(console.log)
  .catch(console.error);
