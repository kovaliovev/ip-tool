'use strict';

const assert = require('node:assert/strict');
const { IPv4 } = require('../lib/IPv4.js');

const runTests = (fn, tests, context = null) => {
  console.log('Testing started!');
  let failed = 0;
  for (const [input, excepted, name] of tests) {
    console.log(`${name} testing...`);
    try {
      const output = fn.call(context, input);
      assert.deepStrictEqual(output, excepted, name);
    } catch (err) {
      const isExcepted =
        typeof excepted === 'string' && excepted.startsWith('ERROR:');
      const exceptedError = excepted.slice(6);
      if (!isExcepted || err.message !== exceptedError) {
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

const toArrayConvertTests = [
  ['123.123.123.123', [123, 123, 123, 123], 'Convert to array test #1'],
  ['0.0.0.0', [0, 0, 0, 0], 'Convert to array test #2'],
  ['255.255.255.255', [255, 255, 255, 255], 'Convert to array test #3'],
  ['1.2.3.4', [1, 2, 3, 4], 'Convert to array test #4'],
  ['0.0.0.1', [0, 0, 0, 1], 'Convert to array test #5'],
  ['111.222.-2.0', 'ERROR:Invalid IP-address!', 'Convert to array test #6'],
  ['256.256.256.256', 'ERROR:Invalid IP-address!', 'Convert to array test #7'],
  ['10.255.255', 'ERROR:Invalid IP-address!', 'Convert to array test #8'],
  ['ten.zero.one.one', 'ERROR:Invalid IP-address!', 'Convert to array test #9'],
  ['127.0.0.0.10', 'ERROR:Invalid IP-address!', 'Convert to array test #10'],
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

const toBinaryConvertTests = [
  [
    '123.123.123.123',
    '01111011.01111011.01111011.01111011',
    'Convert to binary test #1',
  ],
  [
    '0.0.0.0',
    '00000000.00000000.00000000.00000000',
    'Convert to binary test #2',
  ],
  [
    '255.255.255.255',
    '11111111.11111111.11111111.11111111',
    'Convert to binary test #3',
  ],
  [
    '10.0.0.1',
    '00001010.00000000.00000000.00000001',
    'Convert to binary test #4',
  ],
  [
    '196.128.64.0',
    '11000100.10000000.01000000.00000000',
    'Convert to binary test #5',
  ],
  [
    '128.0.0.0',
    '10000000.00000000.00000000.00000000',
    'Convert to binary test #6',
  ],
  [
    '100.200.100.200',
    '01100100.11001000.01100100.11001000',
    'Convert to binary test #7',
  ],
  ['10.255.255.256', 'ERROR:Invalid IP-address!', 'Convert to binary test #8'],
  ['10.0.0.one', 'ERROR:Invalid IP-address!', 'Convert to binary test #9'],
  ['127.0.0.0.10', 'ERROR:Invalid IP-address!', 'Convert to binary test #10'],
];

runTests(ip.isValide, validationTests, ip);
runTests(ip.toArray, toArrayConvertTests, ip);
runTests(ip.toDecimal, toDecimalConvertTests, ip);
runTests(ip.toBinary, toBinaryConvertTests, ip);
