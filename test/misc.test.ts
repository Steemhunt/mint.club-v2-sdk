import { mintclub } from '../dist';

const detail = await mintclub.network('unichain').token('UNIPEPE').getDetail();

console.log(detail);
