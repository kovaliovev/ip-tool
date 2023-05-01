'use strict';

const { IPv4 } = require('../lib/IPv4.js');
const { runTests } = require('./test-runner.js');

const ip = new IPv4();

const validationTests = [
  {
    testName: 'Ip-address validation',
    context: ip,
    fn: ip.isValide,
  },
  ['123.123.123.123', true],
  ['0.0.0.0', true],
  ['255.255.255.255', true],
  ['1.2.3.004', false],
  ['253.254.255.256', false],
  ['123.123.123', false],
  ['error-string', false],
  ['10.0.0.1', true],
  ['10.0.0.one', false],
  ['127.0.0.0.10', false],
];

const toArrayConvertTests = [
  {
    testName: 'Converting ip-address to array',
    context: ip,
    fn: ip.toArray,
  },
  ['123.123.123.123', [123, 123, 123, 123]],
  ['0.0.0.0', [0, 0, 0, 0]],
  ['255.255.255.255', [255, 255, 255, 255]],
  ['1.2.3.4', [1, 2, 3, 4]],
  ['0.0.0.1', [0, 0, 0, 1]],
  ['111.222.-2.0', 'ERROR:Invalid IP-address!'],
  ['256.256.256.256', 'ERROR:Invalid IP-address!'],
  ['10.255.255', 'ERROR:Invalid IP-address!'],
  ['ten.zero.one.one', 'ERROR:Invalid IP-address!'],
  ['127.0.0.0.10', 'ERROR:Invalid IP-address!'],
];

const toDecimalConvertTests = [
  {
    testName: 'Converting ip-address to decimal number',
    context: ip,
    fn: ip.toDecimal,
  },
  ['123.123.123.123', 2071690107],
  ['0.0.0.0', 0],
  ['255.255.255.255', 4294967295],
  ['1.2.3.4', 16909060],
  ['0.0.0.1', 1],
  ['1.0.0.0', 16777216],
  ['100.200.100.200', 1690854600],
  ['10.255.255.256', 'ERROR:Invalid IP-address!'],
  ['10.0.0.one', 'ERROR:Invalid IP-address!'],
  ['127.0.0.0.10', 'ERROR:Invalid IP-address!'],
];

const toBinaryConvertTests = [
  {
    testName: 'Converting ip-address to binary',
    context: ip,
    fn: ip.toBinary,
  },
  ['123.123.123.123', '01111011.01111011.01111011.01111011'],
  ['0.0.0.0', '00000000.00000000.00000000.00000000'],
  ['255.255.255.255', '11111111.11111111.11111111.11111111'],
  ['10.0.0.1', '00001010.00000000.00000000.00000001'],
  ['196.128.64.0', '11000100.10000000.01000000.00000000'],
  ['128.0.0.0', '10000000.00000000.00000000.00000000'],
  ['100.200.100.200', '01100100.11001000.01100100.11001000'],
  ['10.255.255.256', 'ERROR:Invalid IP-address!'],
  ['10.0.0.one', 'ERROR:Invalid IP-address!'],
  ['127.0.0.0.10', 'ERROR:Invalid IP-address!'],
];

const getClassTests = [
  {
    testName: 'Getting ip subnet class',
    context: ip,
    fn: ip.getClass,
  },
  ['123.123.123.123', 'A'],
  ['0.0.0.0', 'A'],
  ['255.255.255.255', 'E'],
  ['128.45.78.200', 'B'],
  ['196.66.2.225', 'C'],
  ['224.44.222.244', 'D'],
  ['196.64.0', 'ERROR:Invalid IP-address!'],
  ['10.255.255.256', 'ERROR:Invalid IP-address!'],
  ['10.0.0.one', 'ERROR:Invalid IP-address!'],
  ['127.0.0.0.10', 'ERROR:Invalid IP-address!'],
];

const maskToBinaryConvertTests = [
  {
    testName: 'Converting ip subnet mask to binary',
    context: ip,
    fn: ip.maskToBinary,
  },
  ['0.0.0.0', '00000000.00000000.00000000.00000000'],
  ['255.255.255.255', '11111111.11111111.11111111.11111111'],
  ['255.255.240.0', '11111111.11111111.11110000.00000000'],
  ['248.0.0.0', '11111000.00000000.00000000.00000000'],
  ['255.255.64.0', 'ERROR:Invalid subnet mask!'],
  ['20.23.20.13', 'ERROR:Invalid subnet mask!'],
  ['255.255.0', 'ERROR:Invalid subnet mask!'],
  ['256.0.0.0', 'ERROR:Invalid subnet mask!'],
  ['224.0.0.one', 'ERROR:Invalid subnet mask!'],
  ['128.0.0.0.0', 'ERROR:Invalid subnet mask!'],
];

const maskValidationTests = [
  {
    testName: 'Ip subnet mask validation',
    context: ip,
    fn: ip.isMaskValide,
  },
  ['0.0.0.0', true],
  ['255.255.255.255', true],
  ['255.192.0.0', true],
  ['255.255.224.0', true],
  ['255.200.0.0', false],
  ['224.44.222.244', false],
  ['196.64.0', false],
  ['255.255.255.256', false],
  ['10.0.0.one', false],
  ['127.0.0.0.10', false],
];

const getIpFromArrayTests = [
  {
    testName: 'Getting ip-address from array',
    context: ip,
    fn: ip.fromArray,
  },
  [[0, 0, 0, 0], '0.0.0.0'],
  [[255, 255, 255, 255], '255.255.255.255'],
  [[10, 33, 4, 200], '10.33.4.200'],
  [[1, '200', 33, '45'], '1.200.33.45'],
  [['1', '200', '33', '45'], '1.200.33.45'],
  [[true, true, true, true], 'ERROR:Invalid array entered!'],
  ['[196, 64, 12]', 'ERROR:Invalid input type!'],
  [[255, 255, 255, 256], 'ERROR:Invalid array entered!'],
  [[10, 10, 10, 'one'], 'ERROR:Invalid array entered!'],
  [[127, 0, 0, 0, 1], 'ERROR:Invalid array entered!'],
];

const getIpFromDecimalTests = [
  {
    testName: 'Getting ip-address from decimal number',
    context: ip,
    fn: ip.fromDecimal,
  },
  [2071690107, '123.123.123.123'],
  [0, '0.0.0.0'],
  [4294967295, '255.255.255.255'],
  [16909060, '1.2.3.4'],
  [1, '0.0.0.1'],
  [16777216, '1.0.0.0'],
  [-1, 'ERROR:Invalid number entered!'],
  [12345678900, 'ERROR:Invalid number entered!'],
  [[1690854600], 'ERROR:Invalid input type!'],
  [true, 'ERROR:Invalid input type!'],
];

const binaryValidationTests = [
  {
    testName: 'Binary ip-address validation',
    context: ip,
    fn: ip.isBinaryValide,
  },
  ['00000000.00000000.00000000.00000000', true],
  ['11111111.11111111.11111111.11111111', true],
  ['11101010.00010100.01011110.01111001', true],
  ['11102010.00010103.04011110.01111001', false],
  ['11100010.0001010.00011110.01111001', false],
  ['123.123.123', false],
  ['11101010.00010100.01011110.01111001.00001101', false],
  [['11101010', '00010100', '01011110', '01111001'], false],
  ['11101010.0001A100.01011110.01111001', false],
  ['0.0.0.0', false],
];

const getIpFromBinaryTests = [
  {
    testName: 'Getting ip-address from binary',
    context: ip,
    fn: ip.fromBinary,
  },
  ['01111011.01111011.01111011.01111011', '123.123.123.123'],
  ['00000000.00000000.00000000.00000000', '0.0.0.0'],
  ['11111111.11111111.11111111.11111111', '255.255.255.255'],
  ['00001010.00000000.00000000.00000001', '10.0.0.1'],
  ['11000100.10000000.01000000.00000000', '196.128.64.0'],
  ['10000000.00000000.00000000.00000000', '128.0.0.0'],
  ['01100100.11001000.01100100.01000102', 'ERROR:Invalid binary ip entered!'],
  ['01100100.11001000.01100100.01000101.0', 'ERROR:Invalid binary ip entered!'],
  ['10101110.01001000.10110110.one111111', 'ERROR:Invalid binary ip entered!'],
  ['0.0.0.0', 'ERROR:Invalid binary ip entered!'],
];

const getIpNetworkAddressTests = [
  {
    testName: 'Getting ip-network address',
    context: ip,
    fn: ip.getNetworkAddress,
  },
  [['0.0.0.0', '0.0.0.0'], '0.0.0.0/0'],
  [['255.255.255.255', '255.255.255.255'], '255.255.255.255/32'],
  [['255.255.255.255', '0.0.0.0'], '0.0.0.0/0'],
  [['34.100.255.45', '255.255.252.0'], '34.100.252.0/22'],
  [['255.0.255.255', '255.255.255.240'], '255.0.255.240/28'],
  [['255.256.255.255', '255.255.128.0'], 'ERROR:Invalid IP-address!'],
  [['255.200.100.10', '255.255.255.250'], 'ERROR:Invalid subnet mask!'],
  [[255, '255.255.128.0'], 'ERROR:Invalid IP-address!'],
  [['255.200.100.10', true], 'ERROR:Invalid subnet mask!'],
  [['23.2.20.23', '240.0.0.0'], '16.0.0.0/4'],
];

const ipNetworkValidation = [
  {
    testName: 'Ip-network address validation',
    context: ip,
    fn: ip.isNetworkValide,
  },
  ['0.0.0.0/0', true],
  ['255.255.255.255/32', true],
  ['0.0.0.0/32', true],
  ['123.122.120.0/22', true],
  ['123.122.120.0/20', false],
  ['10.0.0.1/31', false],
  ['10.0.0.0/31', true],
  ['123.123.10.1', false],
  [['0.0.0.0', '/0'], false],
  [true, false],
];

const prefixValidationTests = [
  {
    testName: 'Ip-address prefix validation',
    context: ip,
    fn: ip.isPrefixValide,
  },
  [0, true],
  [32, true],
  [9, true],
  [16, true],
  [28, true],
  [-16, false],
  [48, false],
  ['4', false],
  [[16], false],
  [true, false],
];

const maskToPrefixConvertTests = [
  {
    testName: 'Converting ip-subnet mask to prefix',
    context: ip,
    fn: ip.maskToPrefix,
  },
  ['0.0.0.0', 0],
  ['255.255.255.255', 32],
  ['255.252.0.0', 14],
  ['255.255.255.224', 27],
  ['128.0.0.0', 1],
  ['0.0.0.128', 'ERROR:Invalid subnet mask!'],
  ['255.255.255.25', 'ERROR:Invalid subnet mask!'],
  ['0.0.0.0.0', 'ERROR:Invalid subnet mask!'],
  ['255.255.255', 'ERROR:Invalid subnet mask!'],
  [255255255255, 'ERROR:Invalid subnet mask!'],
];

const getMaskFromPrefixTests = [
  {
    testName: 'Getting ip-subnet mask from prefix',
    context: ip,
    fn: ip.maskFromPrefix,
  },
  [0, '0.0.0.0'],
  [32, '255.255.255.255'],
  [14, '255.252.0.0'],
  [27, '255.255.255.224'],
  [1, '128.0.0.0'],
  [8, '255.0.0.0'],
  [-1, 'ERROR:Invalid prefix entered!'],
  [33, 'ERROR:Invalid prefix entered!'],
  ['16', 'ERROR:Invalid prefix entered!'],
  [[16], 'ERROR:Invalid prefix entered!'],
];

const getHostsCountTests = [
  {
    testName: 'Getting count of hosts by prefix',
    context: ip,
    fn: ip.getHostsCount,
  },
  [32, 1],
  [0, 4294967296],
  [31, 2],
  [16, 65536],
  [4, 268435456],
  [25, 128],
  ['25', 'ERROR:Invalid prefix entered!'],
  ['128.64.0.0/8', 'ERROR:Invalid prefix entered!'],
  [[16], 'ERROR:Invalid prefix entered!'],
  [false, 'ERROR:Invalid prefix entered!'],
];

const splitNetworkInHalfTests = [
  {
    testName: 'Splitting ip-network in half',
    context: ip,
    fn: ip.splitNetworkInHalf,
  },
  ['222.245.160.0/22', ['222.245.160.0/23', '222.245.162.0/23']],
  ['222.245.162.0/23', ['222.245.162.0/24', '222.245.163.0/24']],
  ['222.245.163.0/24', ['222.245.163.0/25', '222.245.163.128/25']],
  ['222.245.163.128/25', ['222.245.163.128/26', '222.245.163.192/26']],
  ['222.245.163.192/26', ['222.245.163.192/27', '222.245.163.224/27']],
  ['222.245.163.224/27', ['222.245.163.224/28', '222.245.163.240/28']],
  ['222.245.163.254/32', 'ERROR:Can not split network with /32 subnet mask!'],
  ['128.64.0.0/8', 'ERROR:Invalide ip-network!'],
  [['222.245.163.254', '/32'], 'ERROR:Invalide ip-network!'],
  [true, 'ERROR:Invalide ip-network!'],
];

const getNetworkUsableHostRangeTests = [
  {
    testName: 'Getting usable host IP range by network',
    context: ip,
    fn: ip.getNetworkUsableHostRange,
  },
  [
    '37.73.144.52/30',
    { firstHostAddress: '37.73.144.53', lastHostAddress: '37.73.144.54' },
  ],
  [
    '37.73.144.0/25',
    { firstHostAddress: '37.73.144.1', lastHostAddress: '37.73.144.126' },
  ],
  [
    '37.73.144.0/20',
    { firstHostAddress: '37.73.144.1', lastHostAddress: '37.73.159.254' },
  ],
  [
    '37.72.0.0/15',
    { firstHostAddress: '37.72.0.1', lastHostAddress: '37.73.255.254' },
  ],
  [
    '37.64.0.0/10',
    { firstHostAddress: '37.64.0.1', lastHostAddress: '37.127.255.254' },
  ],
  [
    '32.0.0.0/5',
    { firstHostAddress: '32.0.0.1', lastHostAddress: '39.255.255.254' },
  ],
  [
    '0.0.0.0/1',
    { firstHostAddress: '0.0.0.1', lastHostAddress: '127.255.255.254' },
  ],
  [
    '0.0.0.0/0',
    { firstHostAddress: '0.0.0.1', lastHostAddress: '255.255.255.254' },
  ],
  ['37.73.144.51/30', 'ERROR:Invalide ip-network!'],
  ['37.73.144.51/32', 'ERROR:Network has no usable hosts!'],
];

const parseNetworkTests = [
  {
    testName: 'Parsing network to address and prefix',
    context: ip,
    fn: ip.parseNetwork,
  },
  ['37.73.144.0/23', ['37.73.144.0', 23]],
  ['255.89.111.64/26', ['255.89.111.64', 26]],
  ['242.10.0.0/16', ['242.10.0.0', 16]],
  ['3.3.3.4/31', ['3.3.3.4', 31]],
  ['0.0.0.0/0', ['0.0.0.0', 0]],
  ['255.255.255.255/32', ['255.255.255.255', 32]],
  [['37.73.144.0', '/23'], 'ERROR:Invalide ip-network!'],
  ['37.73.144.45/23', 'ERROR:Invalide ip-network!'],
  ['255.255.255.256/32', 'ERROR:Invalide ip-network!'],
  ['0.0.0.1/0', 'ERROR:Invalide ip-network!'],
];

const getWildcardMaskFromPrefixTests = [
  {
    testName: 'Getting ip-wildcard mask from prefix',
    context: ip,
    fn: ip.wildcardMaskFromPrefix,
  },
  [0, '255.255.255.255'],
  [32, '0.0.0.0'],
  [14, '0.3.255.255'],
  [27, '0.0.0.31'],
  [1, '127.255.255.255'],
  [8, '0.255.255.255'],
  [-1, 'ERROR:Invalid prefix entered!'],
  [33, 'ERROR:Invalid prefix entered!'],
  ['16', 'ERROR:Invalid prefix entered!'],
  [[16], 'ERROR:Invalid prefix entered!'],
];

const allTests = [
  validationTests,
  toArrayConvertTests,
  toDecimalConvertTests,
  toBinaryConvertTests,
  getClassTests,
  maskToBinaryConvertTests,
  maskValidationTests,
  getIpFromArrayTests,
  getIpFromDecimalTests,
  binaryValidationTests,
  getIpFromBinaryTests,
  getIpNetworkAddressTests,
  maskToPrefixConvertTests,
  getMaskFromPrefixTests,
  prefixValidationTests,
  ipNetworkValidation,
  splitNetworkInHalfTests,
  getHostsCountTests,
  getNetworkUsableHostRangeTests,
  parseNetworkTests,
  getWildcardMaskFromPrefixTests,
];

runTests(allTests);
