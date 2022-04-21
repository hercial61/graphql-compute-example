# Compute@Edge starter kit for Flight Path

Flight Path is a lightweight and minimal routing layer for C@E apps.

For more information, see the [Flight Path Docs](https://flight-path.edgecompute.app/)

## Understanding the code

The code in `src/index.js` creates a `Router` object and registers routes.

The template uses webpack to bundle `index.js` and its imports into a single JS file, `bin/index.js`, which is then wrapped into a `.wasm` file, `bin/index.wasm` using the `js-compute-runtime` CLI tool bundled with the `@fastly/js-compute` npm package, and bundled into a `.tar.gz` file ready for deployment to Compute@Edge.

## Security issues

Please see our [SECURITY.md](SECURITY.md) for guidance on reporting security-related issues.
