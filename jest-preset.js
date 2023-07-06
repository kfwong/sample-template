// eslint-disable-next-line @typescript-eslint/no-var-requires
const merge = require('merge');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ts_preset = require('ts-jest/jest-preset');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jest_dynalite = require('jest-dynalite/jest-preset');

module.exports = merge.recursive(ts_preset, jest_dynalite);
