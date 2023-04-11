'use strict';

const assert = require('node:assert/strict');
const { IPv4 } = require('../lib/IPv4.js');

const runTests = (fn, tests) => {
  console.log('Testing started!');
  let failed = 0;
  for (const [input, excepted, name] of tests) {
    console.log(`${name} testing...`);
    const output = fn(input);
    try {
      assert.deepStrictEqual(output, excepted, name);
    } catch (err) {
      if (err) console.error(err);
      failed++;
    }
  }
  console.log('Testing ended!');
  console.log(`Successfully passed: ${tests.length - failed}/${tests.length}`);
  console.log('-----------------------------');
};
