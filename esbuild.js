// eslint-disable-next-line @typescript-eslint/no-var-requires
const {nodeExternalsPlugin} = require('esbuild-node-externals');

module.exports = [nodeExternalsPlugin()]