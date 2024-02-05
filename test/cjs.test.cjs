const sdk = require('../dist/index');

sdk.bondContract
  .network('ethereum')
  .read({
    functionName: 'creationFee',
    args: [],
  })
  .then(console.log)
  .catch(console.error);
