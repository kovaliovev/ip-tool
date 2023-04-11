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

const ip = new IPv4();

const validationTests = [
  ['123.123.123.123', true, 'Validation test #1'],
  ['0.0.0.0', true, 'Validation test #2'],
  ['255.255.255.255', true, 'Validation test #3'],
  ['1.2.3.004', false, 'Validation test #4'],
  ['253.254.255.256', false, 'Validation test #5'],
  ['123.123.123', false, 'Validation test #6'],
  ['error-string', false, 'Validation test #7'],
  ['10.0.0.1', true, 'Validation test #8'],
  ['10.0.0.one', false, 'Validation test #9'],
  ['127.0.0.0.10', false, 'Validation test #10'],
];

runTests(ip.isValide, validationTests);
