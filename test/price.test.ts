import { mintclub } from '../src';

(async () => {
  const rate = await mintclub.network('base').token('GMFR').getUsdRate();
  console.log('========== GMFR RATE ==========');
  console.log(rate);

  // GNMFER is a nested token, so it should be priced via the reserve token (GMFR)
  const rate2 = await mintclub.network('base').token('GNMFER').getUsdRate();
  console.log('========== GNMFER RATE ==========');
  console.log(rate2);
})();
