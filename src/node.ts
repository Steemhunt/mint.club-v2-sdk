import jsdom from 'jsdom';
export * from 'viem';
export type * from 'viem';
if (typeof window === 'undefined') {
  const JSDOM = jsdom.JSDOM;
  const { window } = new JSDOM('');
  (global.window as any) = window;
  global.document = window.document;
}

export * from './index';
