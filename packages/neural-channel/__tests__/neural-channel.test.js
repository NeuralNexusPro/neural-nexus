'use strict';

const neuralChannel = require('..');
const assert = require('assert').strict;

assert.strictEqual(neuralChannel(), 'Hello from neuralChannel');
console.info('neuralChannel tests passed');
