export * from 'viem';
export type * from 'viem';
if (typeof window === 'undefined') {
  import('jsdom').then((jsdom) => {
    const JSDOM = jsdom.JSDOM;
    const { window } = new JSDOM('', {
      url: 'https://mint.club',
    });
    (global.window as any) = window;
    global.document = window.document;
  });
}

export * from './index';
