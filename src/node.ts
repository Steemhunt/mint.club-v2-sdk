import jsdom from 'jsdom';
export * from 'viem';
export type * from 'viem';

if (typeof window === 'undefined') {
  const JSDOM = jsdom.JSDOM;
  const { window } = new JSDOM('', {
    url: 'https://mint.club',
  });
  (global.window as any) = window;
  global.navigator = window.navigator;
  global.document = window.document;
}

export * from './index';
