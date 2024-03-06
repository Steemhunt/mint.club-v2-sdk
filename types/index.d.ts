declare global {
  namespace NodeJS {
    interface Global {
      window: Window;
      ethereum: any;
    }
  }
}
