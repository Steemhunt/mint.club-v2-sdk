# Mint Club V2 SDK documentation

The documentation site for [`@mint.club/v2-sdk`](https://www.npmjs.com/package/@mint.club/v2-sdk), built with [Vocs](https://vocs.dev).

## Local development

From this directory:

```bash
npm ci
npm run dev
```

The site uses the SDK from the parent directory through a local `file:..` dependency.

## Production build

```bash
npm run build
npm run preview
```

The `prebuild` script installs and builds the parent SDK before Vocs validates the documentation examples.
