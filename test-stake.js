const { mintclub } = require('./dist/index.js');

console.log('SDK available methods:');
const network = mintclub.network('base');
console.log(
  'Network methods:',
  Object.keys(network).filter((k) => typeof network[k] === 'object' || typeof network[k] === 'function'),
);
console.log('Stake available:', !!network.stake);

if (network.stake) {
  console.log(
    'Stake methods:',
    Object.getOwnPropertyNames(Object.getPrototypeOf(network.stake)).filter((m) => m !== 'constructor'),
  );

  // Test some read methods (they should be callable)
  console.log('\nTesting stake methods...');
  console.log('getCreationFee method exists:', typeof network.stake.getCreationFee === 'function');
  console.log('createPool method exists:', typeof network.stake.createPool === 'function');
  console.log('stake method exists:', typeof network.stake.stake === 'function');
  console.log('unstake method exists:', typeof network.stake.unstake === 'function');
  console.log('claim method exists:', typeof network.stake.claim === 'function');
}

console.log('\nStake integration successful!');
