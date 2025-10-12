import { mintclub } from '../src';

(async () => {
  const CREED = await mintclub.network('polygon').token('0xb2aD4c20F870B006339a11ef611d70239dEEf144').getUsdRate();
  console.log('========== CREED RATE ==========');
  console.log(CREED);

  // const farpixel = await mintclub.network('base').token('0xA20Eb729cd9a0753B479C95fbd60B4caa4e7eb07').getUsdRate();
  // console.log('========== FARPIXEL RATE ==========');
  // console.log(farpixel);

  // const FREE = await mintclub.network('base').token('0xc435b542acb241185c72d3653447e070994da59f').getUsdRate();
  // console.log('========== FREE RATE ==========');
  // console.log(FREE);

  // const rate = await mintclub.network('base').token('GMFR').getUsdRate();
  // console.log('========== GMFR RATE ==========');
  // console.log(rate);
  // // GNMFER is a nested token, so it should be priced via the reserve token (GMFR)
  // const rate2 = await mintclub.network('base').token('GNMFER').getUsdRate();
  // console.log('========== GNMFER RATE ==========');
  // console.log(rate2);
  // // Additional 24h checks
  // const gmfer24 = await mintclub.network('base').token('GMFR').get24HoursUsdRate();
  // console.log('========== GMFR 24H ==========');
  // console.log(gmfer24);
  // const gnmfer24 = await mintclub.network('base').token('GNMFER').get24HoursUsdRate();
  // console.log('========== GNMFER 24H ==========');
  // console.log(gnmfer24);

  // const minibuilding = await mintclub.network('base').nft('0x475f8E3eE5457f7B4AAca7E989D35418657AdF2a').getUsdRate();
  // console.log('========== MINI BUILDING ==========');
  // console.log(minibuilding);

  // const minibuilding24 = await mintclub
  //   .network('base')
  //   .nft('0x475f8E3eE5457f7B4AAca7E989D35418657AdF2a')
  //   .get24HoursUsdRate();
  // console.log('========== MINI BUILDING 24H ==========');
  // console.log(minibuilding24);
})();
