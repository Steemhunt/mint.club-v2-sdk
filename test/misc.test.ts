import { mintclub } from '../dist';

const detail = await mintclub.network('shibarium').token('0x1daedA8cFbA1b82fC93dAc7BCff101f490112419').getDetail();

console.log(detail);
