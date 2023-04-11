'use strict';

const assert = require('node:assert/strict');
const { IPv4 } = require('../lib/IPv4.js');

const runTests = (context, fn, tests) => {
  console.log('Testing started!');
  let failed = 0;
  for (const [input, excepted, name] of tests) {
    console.log(`${name} testing...`);
    try {
      const output = fn.call(context, input);
      assert.deepStrictEqual(output, excepted, name);
    } catch (err) {
      const exceptedError = excepted.split(':')[1];
      if (err.message !== exceptedError) {
        console.error(err);
        failed++;
      }
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

const toDecimalConvertTests = [
  ['123.123.123.123', 2071690107, 'Convert to decimal test #1'],
  ['0.0.0.0', 0, 'Convert to decimal test #2'],
  ['255.255.255.255', 4294967295, 'Convert to decimal test #3'],
  ['1.2.3.4', 16909060, 'Convert to decimal test #4'],
  ['0.0.0.1', 1, 'Convert to decimal test #5'],
  ['1.0.0.0', 16777216, 'Convert to decimal test #6'],
  ['100.200.100.200', 1690854600, 'Convert to decimal test #7'],
  ['10.255.255.256', 'ERROR:Invalid IP-address!', 'Convert to decimal test #8'],
  ['10.0.0.one', 'ERROR:Invalid IP-address!', 'Convert to decimal test #9'],
  ['127.0.0.0.10', 'ERROR:Invalid IP-address!', 'Convert to decimal test #10'],
];

runTests(ip, ip.isValide, validationTests);
runTests(ip, ip.ipToDecimal, toDecimalConvertTests);
