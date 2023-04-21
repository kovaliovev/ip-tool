'use strict';

const { IPv4 } = require('../lib/IPv4.js');
const { runTests } = require('./test-runner.js');

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

const getClassTests = [
  ['123.123.123.123', 'A', 'Get ip-class test #1'],
  ['0.0.0.0', 'A', 'Get ip-class test #2'],
  ['255.255.255.255', 'E', 'Get ip-class test #3'],
  ['128.45.78.200', 'B', 'Get ip-class test #4'],
  ['196.66.2.225', 'C', 'Get ip-class test #5'],
  ['224.44.222.244', 'D', 'Get ip-class test #6'],
  ['196.64.0', 'ERROR:Invalid IP-address!', 'Get ip-class test #7'],
  ['10.255.255.256', 'ERROR:Invalid IP-address!', 'Get ip-class test #8'],
  ['10.0.0.one', 'ERROR:Invalid IP-address!', 'Get ip-class test #9'],
  ['127.0.0.0.10', 'ERROR:Invalid IP-address!', 'Get ip-class test #10'],
];

const maskToBinaryConvertTests = [
  [
    '0.0.0.0',
    '00000000.00000000.00000000.00000000',
    'Convert mask to binary test #1',
  ],
  [
    '255.255.255.255',
    '11111111.11111111.11111111.11111111',
    'Convert mask to binary test #2',
  ],
  [
    '255.255.240.0',
    '11111111.11111111.11110000.00000000',
    'Convert mask to binary test #3',
  ],
  [
    '248.0.0.0',
    '11111000.00000000.00000000.00000000',
    'Convert mask to binary test #4',
  ],
  [
    '255.255.64.0',
    'ERROR:Invalid subnet mask!',
    'Convert mask to binary test #5',
  ],
  [
    '20.23.20.13',
    'ERROR:Invalid subnet mask!',
    'Convert mask to binary test #6',
  ],
  ['255.255.0', 'ERROR:Invalid subnet mask!', 'Convert mask to binary test #7'],
  ['256.0.0.0', 'ERROR:Invalid subnet mask!', 'Convert mask to binary test #8'],
  [
    '224.0.0.one',
    'ERROR:Invalid subnet mask!',
    'Convert mask to binary test #9',
  ],
  [
    '128.0.0.0.0',
    'ERROR:Invalid subnet mask!',
    'Convert mask to binary test #10',
  ],
];

const maskValidationTests = [
  ['0.0.0.0', true, 'Subnet mask validation test #1'],
  ['255.255.255.255', true, 'Subnet mask validation test #2'],
  ['255.192.0.0', true, 'Subnet mask validation test #3'],
  ['255.255.224.0', true, 'Subnet mask validation test #4'],
  ['255.200.0.0', false, 'Subnet mask validation test #5'],
  ['224.44.222.244', false, 'Subnet mask validation test #6'],
  ['196.64.0', false, 'Subnet mask validation test #7'],
  ['255.255.255.256', false, 'Subnet mask validation test #8'],
  ['10.0.0.one', false, 'Subnet mask validation test #9'],
  ['127.0.0.0.10', false, 'Subnet mask validation test #10'],
];

const getIpFromArrayTests = [
  [[0, 0, 0, 0], '0.0.0.0', 'IP from array getting test #1'],
  [[255, 255, 255, 255], '255.255.255.255', 'IP from array getting test #2'],
  [[10, 33, 4, 200], '10.33.4.200', 'IP from array getting test #3'],
  [[1, '200', 33, '45'], '1.200.33.45', 'IP from array getting test #4'],
  [['1', '200', '33', '45'], '1.200.33.45', 'IP from array getting test #5'],
  [
    [true, true, true, true],
    'ERROR:Invalid array entered!',
    'IP from array getting test #6',
  ],
  [
    '[196, 64, 12]',
    'ERROR:Invalid input type!',
    'IP from array getting test #7',
  ],
  [
    [255, 255, 255, 256],
    'ERROR:Invalid array entered!',
    'IP from array getting test #8',
  ],
  [
    [10, 10, 10, 'one'],
    'ERROR:Invalid array entered!',
    'IP from array getting test #9',
  ],
  [
    [127, 0, 0, 0, 1],
    'ERROR:Invalid array entered!',
    'IP from array getting test #10',
  ],
];

const getIpFromDecimalTests = [
  [2071690107, '123.123.123.123', 'Convert to decimal test #1'],
  [0, '0.0.0.0', 'Convert to decimal test #2'],
  [4294967295, '255.255.255.255', 'Convert to decimal test #3'],
  [16909060, '1.2.3.4', 'Convert to decimal test #4'],
  [1, '0.0.0.1', 'Convert to decimal test #5'],
  [16777216, '1.0.0.0', 'Convert to decimal test #6'],
  [-1, 'ERROR:Invalid number entered!', 'Convert to decimal test #7'],
  [12345678900, 'ERROR:Invalid number entered!', 'Convert to decimal test #8'],
  [[1690854600], 'ERROR:Invalid input type!', 'Convert to decimal test #9'],
  [true, 'ERROR:Invalid input type!', 'Convert to decimal test #10'],
];

const binaryValidationTests = [
  ['00000000.00000000.00000000.00000000', true, 'Binary ip validation test #1'],
  ['11111111.11111111.11111111.11111111', true, 'Binary ip validation test #2'],
  ['11101010.00010100.01011110.01111001', true, 'Binary ip validation test #3'],
  [
    '11102010.00010103.04011110.01111001',
    false,
    'Binary ip validation test #4',
  ],
  ['11100010.0001010.00011110.01111001', false, 'Binary ip validation test #5'],
  ['123.123.123', false, 'Binary ip validation test #6'],
  [
    '11101010.00010100.01011110.01111001.00001101',
    false,
    'Binary ip validation test #7',
  ],
  [
    ['11101010', '00010100', '01011110', '01111001'],
    false,
    'Binary ip validation test #8',
  ],
  [
    '11101010.0001A100.01011110.01111001',
    false,
    'Binary ip validation test #9',
  ],
  ['0.0.0.0', false, 'Binary ip validation test #10'],
];

runTests(ip.isValide, validationTests, ip);
runTests(ip.toArray, toArrayConvertTests, ip);
runTests(ip.toDecimal, toDecimalConvertTests, ip);
runTests(ip.toBinary, toBinaryConvertTests, ip);
runTests(ip.getClass, getClassTests, ip);
runTests(ip.maskToBinary, maskToBinaryConvertTests, ip);
runTests(ip.isMaskValide, maskValidationTests, ip);
runTests(ip.fromArray, getIpFromArrayTests, ip);
runTests(ip.fromDecimal, getIpFromDecimalTests, ip);
runTests(ip.isBinaryValide, binaryValidationTests, ip);
