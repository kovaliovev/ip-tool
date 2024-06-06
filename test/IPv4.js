'use strict';

const { IPv4 } = require('../lib/IPv4.js');
const { TestRunner } = require('./test-runner.js');

const ipv4 = new IPv4();
const testRunner = new TestRunner();

const ipValidationTest = [
  {
    testName: 'Ip address validation',
    context: ipv4,
    fn: ipv4.isValid,
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

const binaryValidationTest = [
  {
    testName: 'Binary ip address validation',
    context: ipv4,
    fn: ipv4.isBinaryValid,
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

const maskValidationTest = [
  {
    testName: 'Ip subnet mask validation',
    context: ipv4,
    fn: ipv4.isMaskValid,
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

const prefixValidationTest = [
  {
    testName: 'Ip prefix validation',
    context: ipv4,
    fn: ipv4.isPrefixValid,
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

const networkValidationTest = [
  {
    testName: 'Ip network address validation',
    context: ipv4,
    fn: ipv4.isNetworkValid,
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

const ipIsPrivateCheckingTest = [
  {
    testName: 'Ip address is private checking',
    context: ipv4,
    fn: ipv4.isPrivate,
  },
  ['10.34.28.220', true],
  ['172.19.130.0', true],
  ['192.168.255.253', true],
  ['100.66.66.66', true],
  ['192.0.0.169', true],
  ['198.19.198.19', true],
  ['198.20.198.19', false],
  ['196.0.0.1', false],
  ['error-string', 'ERROR:Invalid ip address!'],
  ['10.0.0.256', 'ERROR:Invalid ip address!'],
];

const ipInNetworkIncludingTest = [
  {
    testName: 'Ip address in network including',
    context: ipv4,
    fn: ipv4.isNetworkIncludes,
  },
  [['0.0.0.0/0', '111.222.91.19'], true],
  [['255.255.255.255/32', '255.255.255.255'], true],
  [['0.0.0.0/0', '34.224.199.123'], true],
  [['34.100.252.0/22', '34.100.255.12'], true],
  [['34.100.252.0/22', '34.101.255.12'], false],
  [['34.100.0.0/16', '34.102.255.12'], false],
  [['0.0.0.0/31', '0.0.0.2'], false],
  [['255.255.200.0/33', '128.0.0.12'], 'ERROR:Invalid ip network!'],
  [['34.100.252.3/22', '34.100.255.12'], 'ERROR:Invalid ip network!'],
  [['34.100.252.0/22', '34.100.255.12.0'], 'ERROR:Invalid ip address!'],
];

const parseNetworkTest = [
  {
    testName: 'Parsing network to address and prefix',
    context: ipv4,
    fn: ipv4.parseNetwork,
  },
  ['37.73.144.0/23', ['37.73.144.0', 23]],
  ['255.89.111.64/26', ['255.89.111.64', 26]],
  ['242.10.0.0/16', ['242.10.0.0', 16]],
  ['3.3.3.4/31', ['3.3.3.4', 31]],
  ['0.0.0.0/0', ['0.0.0.0', 0]],
  ['255.255.255.255/32', ['255.255.255.255', 32]],
  [['37.73.144.0', '/23'], 'ERROR:Invalid ip network!'],
  ['37.73.144.45/23', 'ERROR:Invalid ip network!'],
  ['255.255.255.256/32', 'ERROR:Invalid ip network!'],
  ['0.0.0.1/0', 'ERROR:Invalid ip network!'],
];

const convertIpToArrayTest = [
  {
    testName: 'Converting ip address to array',
    context: ipv4,
    fn: ipv4.toArray,
  },
  ['123.123.123.123', [123, 123, 123, 123]],
  ['0.0.0.0', [0, 0, 0, 0]],
  ['255.255.255.255', [255, 255, 255, 255]],
  ['1.2.3.4', [1, 2, 3, 4]],
  ['0.0.0.1', [0, 0, 0, 1]],
  ['111.222.-2.0', 'ERROR:Invalid ip address!'],
  ['256.256.256.256', 'ERROR:Invalid ip address!'],
  ['10.255.255', 'ERROR:Invalid ip address!'],
  ['ten.zero.one.one', 'ERROR:Invalid ip address!'],
  ['127.0.0.0.10', 'ERROR:Invalid ip address!'],
];

const getIpFromArrayTest = [
  {
    testName: 'Getting ip address from array',
    context: ipv4,
    fn: ipv4.fromArray,
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

const convertIpToIntegerTest = [
  {
    testName: 'Converting ip address to integer number',
    context: ipv4,
    fn: ipv4.toInteger,
  },
  ['123.123.123.123', 2071690107],
  ['0.0.0.0', 0],
  ['255.255.255.255', 4294967295],
  ['1.2.3.4', 16909060],
  ['0.0.0.1', 1],
  ['1.0.0.0', 16777216],
  ['100.200.100.200', 1690854600],
  ['10.255.255.256', 'ERROR:Invalid ip address!'],
  ['10.0.0.one', 'ERROR:Invalid ip address!'],
  ['127.0.0.0.10', 'ERROR:Invalid ip address!'],
];

const getIpFromIntegerTest = [
  {
    testName: 'Getting ip address from integer number',
    context: ipv4,
    fn: ipv4.fromInteger,
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

const convertIpToBinaryTest = [
  {
    testName: 'Converting ip address to binary',
    context: ipv4,
    fn: ipv4.toBinary,
  },
  ['123.123.123.123', '01111011.01111011.01111011.01111011'],
  ['0.0.0.0', '00000000.00000000.00000000.00000000'],
  ['255.255.255.255', '11111111.11111111.11111111.11111111'],
  ['10.0.0.1', '00001010.00000000.00000000.00000001'],
  ['196.128.64.0', '11000100.10000000.01000000.00000000'],
  ['128.0.0.0', '10000000.00000000.00000000.00000000'],
  ['100.200.100.200', '01100100.11001000.01100100.11001000'],
  ['10.255.255.256', 'ERROR:Invalid ip address!'],
  ['10.0.0.one', 'ERROR:Invalid ip address!'],
  ['127.0.0.0.10', 'ERROR:Invalid ip address!'],
];

const convertMaskToBinaryTest = [
  {
    testName: 'Converting subnet mask to binary',
    context: ipv4,
    fn: ipv4.maskToBinary,
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

const getIpFromBinaryTest = [
  {
    testName: 'Getting ip address from binary',
    context: ipv4,
    fn: ipv4.fromBinary,
  },
  ['01111011.01111011.01111011.01111011', '123.123.123.123'],
  ['00000000.00000000.00000000.00000000', '0.0.0.0'],
  ['11111111.11111111.11111111.11111111', '255.255.255.255'],
  ['00001010.00000000.00000000.00000001', '10.0.0.1'],
  ['11000100.10000000.01000000.00000000', '196.128.64.0'],
  ['10000000.00000000.00000000.00000000', '128.0.0.0'],
  ['01100100.11001000.01100100.01000102', 'ERROR:Invalid binary ip entered!'],
  [
    '01100100.11001000.01100100.01000101.0',
    'ERROR:Invalid binary ip entered!',
  ],
  ['10101110.01001000.10110110.one111111', 'ERROR:Invalid binary ip entered!'],
  ['0.0.0.0', 'ERROR:Invalid binary ip entered!'],
];

const convertSubnetMaskToPrefixTest = [
  {
    testName: 'Converting subnet mask to prefix',
    context: ipv4,
    fn: ipv4.subnetMaskToPrefix,
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

const getMaskFromPrefixTest = [
  {
    testName: 'Getting subnet/wildcard mask from prefix',
    context: ipv4,
    fn: ipv4.maskFromPrefix,
  },
  [[0, false], '0.0.0.0'],
  [[32, false], '255.255.255.255'],
  [[14, false], '255.252.0.0'],
  [[27, false], '255.255.255.224'],
  [[1, false], '128.0.0.0'],
  [[8, false], '255.0.0.0'],
  [[-1, false], 'ERROR:Invalid prefix entered!'],
  [[33, false], 'ERROR:Invalid prefix entered!'],
  [['16', false], 'ERROR:Invalid prefix entered!'],
  [[[16], false], 'ERROR:Invalid prefix entered!'],
  [[0, true], '255.255.255.255'],
  [[32, true], '0.0.0.0'],
  [[14, true], '0.3.255.255'],
  [[27, true], '0.0.0.31'],
  [[1, true], '127.255.255.255'],
  [[8, true], '0.255.255.255'],
  [[-1, true], 'ERROR:Invalid prefix entered!'],
  [[33, true], 'ERROR:Invalid prefix entered!'],
  [['16', true], 'ERROR:Invalid prefix entered!'],
  [[[16], true], 'ERROR:Invalid prefix entered!'],
];

const getDomainNamesTest = [
  {
    testName: 'Getting domain names by ip address',
    context: ipv4,
    fn: ipv4.getDomainNames,
  },
  ['8.8.8.8', ['dns.google']],
  ['54.163.76.76', ['ec2-54-163-76-76.compute-1.amazonaws.com']],
  ['129.250.35.251', [ 'y.ns.gin.ntt.net' ]],
  ['91.239.100.100', ['anycast.censurfridns.dk']],
  ['216.146.36.36', ['rdns.dynect.net']],
  ['37.235.1.177', ['resolver2.freedns.zone.powered.by.virtexxa.com']],
  ['0.0.0.0', []],
  ['fail', 'ERROR:Invalid ip address!'],
];

const getIpFromDomainNameTest = [
  {
    testName: 'Getting array of ip addresses from domain name',
    context: ipv4,
    fn: ipv4.fromDomainName,
  },
  ['cisco.com', ['72.163.4.185']],
  ['ec2-54-163-76-76.compute-1.amazonaws.com', ['54.163.76.76']],
  ['y.ns.gin.ntt.net', ['129.250.35.251']],
  ['anycast.censurfridns.dk', ['91.239.100.100']],
  [225, 'ERROR:Invalid input type!'],
];

const getRandomAddressTest = [
  {
    testName: 'Getting random ip address',
    context: ipv4,
    fn: ipv4.isValid,
  },
  ['fail', false],
  [ipv4.getRandomAddress(), true],
  [ipv4.getRandomAddress(), true],
  [ipv4.getRandomAddress(), true],
  [ipv4.getRandomAddress(), true],
  [ipv4.getRandomAddress(), true],
  [ipv4.getRandomAddress(), true],
  [ipv4.getRandomAddress(), true],
  [ipv4.getRandomAddress(), true],
  [ipv4.getRandomAddress(), true],
];

const getNetworkAddressTest = [
  {
    testName: 'Getting ip network address',
    context: ipv4,
    fn: ipv4.getNetworkAddress,
  },
  [['0.0.0.0', '0.0.0.0'], '0.0.0.0/0'],
  [['255.255.255.255', '255.255.255.255'], '255.255.255.255/32'],
  [['255.255.255.255', '0.0.0.0'], '0.0.0.0/0'],
  [['34.100.255.45', '255.255.252.0'], '34.100.252.0/22'],
  [['255.0.255.255', '255.255.255.240'], '255.0.255.240/28'],
  [['255.256.255.255', '255.255.128.0'], 'ERROR:Invalid ip address!'],
  [['255.200.100.10', '255.255.255.250'], 'ERROR:Invalid subnet mask!'],
  [[255, '255.255.128.0'], 'ERROR:Invalid ip address!'],
  [['255.200.100.10', true], 'ERROR:Invalid subnet mask!'],
  [['23.2.20.23', '240.0.0.0'], '16.0.0.0/4'],
];

const getAllNetworkAddressesTest = [
  {
    testName: 'Getting all ip addresses in ip network',
    context: ipv4,
    fn: ipv4.getAllNetworkAddresses,
  },
  ['10.90.50.0/28',
    [
      '10.90.50.0',  '10.90.50.1',
      '10.90.50.2',  '10.90.50.3',
      '10.90.50.4',  '10.90.50.5',
      '10.90.50.6',  '10.90.50.7',
      '10.90.50.8',  '10.90.50.9',
      '10.90.50.10', '10.90.50.11',
      '10.90.50.12', '10.90.50.13',
      '10.90.50.14', '10.90.50.15',
    ]
  ],
  ['127.0.0.0/30', [ '127.0.0.0', '127.0.0.1', '127.0.0.2', '127.0.0.3' ]],
  ['10.90.50.0/32', [ '10.90.50.0' ]],
  ['invalid', 'ERROR:Invalid ip network!'],
  ['10.90.50.16/24', 'ERROR:Invalid ip network!']
];

const getNetworkBroadcastAddressTest = [
  {
    testName: 'Getting network broadcast address',
    context: ipv4,
    fn: ipv4.getNetworkBroadcastAddress,
  },
  ['37.73.144.0/23', '37.73.145.255'],
  ['222.33.32.0/19', '222.33.63.255'],
  ['220.0.0.0/6', '223.255.255.255'],
  ['222.33.44.8/30', '222.33.44.11'],
  ['255.255.255.255/32', '255.255.255.255'],
  ['0.0.0.0/0', '255.255.255.255'],
  ['30.124.95.120/31', '30.124.95.121'],
  ['30.124.95.119/31', 'ERROR:Invalid ip network!'],
  ['e.r.r.o.r.s.t.r.i.n.g', 'ERROR:Invalid ip network!'],
  [['30.124.95.120', '/31'], 'ERROR:Invalid ip network!'],
];

const getClassTest = [
  {
    testName: 'Getting ip subnet class',
    context: ipv4,
    fn: ipv4.getClass,
  },
  ['123.123.123.123', 'A'],
  ['0.0.0.0', 'A'],
  ['255.255.255.255', 'E'],
  ['128.45.78.200', 'B'],
  ['196.66.2.225', 'C'],
  ['224.44.222.244', 'D'],
  ['196.64.0', 'ERROR:Invalid ip address!'],
  ['10.255.255.256', 'ERROR:Invalid ip address!'],
  ['10.0.0.one', 'ERROR:Invalid ip address!'],
  ['127.0.0.0.10', 'ERROR:Invalid ip address!'],
];

const getHostsCountTest = [
  {
    testName: 'Getting count of hosts by prefix',
    context: ipv4,
    fn: ipv4.getHostsCount,
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

const getNetworkUsableHostRangeTest = [
  {
    testName: 'Getting usable host ip addresses range by network',
    context: ipv4,
    fn: ipv4.getNetworkUsableHostRange,
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
    '0.0.0.0/0',
    { firstHostAddress: '0.0.0.1', lastHostAddress: '255.255.255.254' },
  ],
  [
    '55.121.89.10/31',
    { firstHostAddress: 'Not available', lastHostAddress: 'Not available' },
  ],
  [
    '37.73.144.51/32',
    { firstHostAddress: 'Not available', lastHostAddress: 'Not available' },
  ],
  ['37.73.144.51/30', 'ERROR:Invalid ip network!'],
];

const getNetworkInfoTest = [
  {
    testName: 'Getting information about network',
    context: ipv4,
    fn: ipv4.getNetworkInfo,
  },
  [
    '10.0.0.0/8',
    {
      address: '10.0.0.0',
      binaryAddress: '00001010.00000000.00000000.00000000',
      prefix: 8,
      mask: '255.0.0.0',
      binaryMask: '11111111.00000000.00000000.00000000',
      wildcardMask: '0.255.255.255',
      networkClass: 'A',
      integerId: 167772160,
      totalHosts: 16777216,
      firstHostAddress: '10.0.0.1',
      lastHostAddress: '10.255.255.254',
      broadcastAddress: '10.255.255.255',
      isPrivate: true,
    },
  ],
  [
    '192.64.0.0/16',
    {
      address: '192.64.0.0',
      binaryAddress: '11000000.01000000.00000000.00000000',
      prefix: 16,
      mask: '255.255.0.0',
      binaryMask: '11111111.11111111.00000000.00000000',
      wildcardMask: '0.0.255.255',
      networkClass: 'C',
      integerId: 3225419776,
      totalHosts: 65536,
      firstHostAddress: '192.64.0.1',
      lastHostAddress: '192.64.255.254',
      broadcastAddress: '192.64.255.255',
      isPrivate: false,
    },
  ],
  [
    '222.67.30.32/29',
    {
      address: '222.67.30.32',
      binaryAddress: '11011110.01000011.00011110.00100000',
      prefix: 29,
      mask: '255.255.255.248',
      binaryMask: '11111111.11111111.11111111.11111000',
      wildcardMask: '0.0.0.7',
      networkClass: 'C',
      integerId: 3728940576,
      totalHosts: 8,
      firstHostAddress: '222.67.30.33',
      lastHostAddress: '222.67.30.38',
      broadcastAddress: '222.67.30.39',
      isPrivate: false,
    },
  ],
  [
    '198.18.0.0/15',
    {
      address: '198.18.0.0',
      binaryAddress: '11000110.00010010.00000000.00000000',
      prefix: 15,
      mask: '255.254.0.0',
      binaryMask: '11111111.11111110.00000000.00000000',
      wildcardMask: '0.1.255.255',
      networkClass: 'C',
      integerId: 3323068416,
      totalHosts: 131072,
      firstHostAddress: '198.18.0.1',
      lastHostAddress: '198.19.255.254',
      broadcastAddress: '198.19.255.255',
      isPrivate: true,
    },
  ],
  ['198.19.0.0/15', 'ERROR:Invalid ip network!'],
];

const splitNetworkInHalfTest = [
  {
    testName: 'Splitting ip network in half',
    context: ipv4,
    fn: ipv4.splitNetworkInHalf,
  },
  ['222.245.160.0/22', ['222.245.160.0/23', '222.245.162.0/23']],
  ['222.245.162.0/23', ['222.245.162.0/24', '222.245.163.0/24']],
  ['222.245.163.0/24', ['222.245.163.0/25', '222.245.163.128/25']],
  ['222.245.163.128/25', ['222.245.163.128/26', '222.245.163.192/26']],
  ['222.245.163.192/26', ['222.245.163.192/27', '222.245.163.224/27']],
  ['222.245.163.224/27', ['222.245.163.224/28', '222.245.163.240/28']],
  ['222.245.163.254/32', 'ERROR:Can not split network with /32 subnet mask!'],
  ['128.64.0.0/8', 'ERROR:Invalid ip network!'],
  [['222.245.163.254', '/32'], 'ERROR:Invalid ip network!'],
  [true, 'ERROR:Invalid ip network!'],
];

const ipNetworkSubnettingTest = [
  {
    testName: 'Ip network subnetting',
    context: ipv4,
    fn: ipv4.networkSubnet,
  },
  [
    ['10.0.0.0/8', [999999, 2323, 5, 23, 86, 111, 9, 232, 4, 2, 3]],
    {
      '10.0.0.0/12': 1048576,
      '10.16.0.0/20': 4096,
      '10.16.16.0/29': 8,
      '10.16.16.8/27': 32,
      '10.16.16.40/25': 128,
      '10.16.16.168/25': 128,
      '10.16.17.40/28': 16,
      '10.16.17.56/24': 256,
      '10.16.18.56/29': 8,
      '10.16.18.64/30': 4,
      '10.16.18.68/29': 8,
    },
  ],
  [
    ['196.25.30.0/24', [1, 2, 4, 6, 8, 14, 16, 30, 32, 62]],
    {
      '196.25.30.0/30': 4,
      '196.25.30.4/30': 4,
      '196.25.30.8/29': 8,
      '196.25.30.16/29': 8,
      '196.25.30.24/28': 16,
      '196.25.30.40/28': 16,
      '196.25.30.56/27': 32,
      '196.25.30.88/27': 32,
      '196.25.30.120/26': 64,
      '196.25.30.184/26': 64,
    },
  ],
  [
    ['255.254.0.0/15', [1600, 300, 300, 300, 150, 70, 50, 20, 20, 20, 10, 10]],
    {
      '255.254.0.0/21': 2048,
      '255.254.8.0/23': 512,
      '255.254.10.0/23': 512,
      '255.254.12.0/23': 512,
      '255.254.14.0/24': 256,
      '255.254.15.0/25': 128,
      '255.254.15.128/26': 64,
      '255.254.15.192/27': 32,
      '255.254.15.224/27': 32,
      '255.254.16.0/27': 32,
      '255.254.16.32/28': 16,
      '255.254.16.48/28': 16,
    },
  ],
  [['34.67.22.17/16', [20, 20, 10, 10, 5]], 'ERROR:Invalid ip network!'],
  [['34.67.0.0/16', '20, 20, 10, 10, 5'], 'ERROR:Invalid input type!'],
  [['34.67.0.0/16', []], 'ERROR:Invalid array entered!'],
  [['34.67.0.0/16', new Array(10)], 'ERROR:Invalid type of hosts count!'],
  [['34.67.0.0/16', [20, 20, 10, '10']], 'ERROR:Invalid type of hosts count!'],
  [['34.67.0.0/16', [20, 20, 10, 0]], 'ERROR:Invalid hosts count entered!'],
  [['34.67.0.0/16', [9999999999, 20]], 'ERROR:Invalid hosts count entered!'],
];

const allTests = [
  ipValidationTest,
  binaryValidationTest,
  maskValidationTest,
  prefixValidationTest,
  networkValidationTest,
  ipIsPrivateCheckingTest,
  parseNetworkTest,
  convertIpToArrayTest,
  getIpFromArrayTest,
  convertIpToIntegerTest,
  getIpFromIntegerTest,
  convertIpToBinaryTest,
  convertMaskToBinaryTest,
  getIpFromBinaryTest,
  convertSubnetMaskToPrefixTest,
  getMaskFromPrefixTest,
  getDomainNamesTest,
  getIpFromDomainNameTest,
  getRandomAddressTest,
  getNetworkAddressTest,
  getAllNetworkAddressesTest,
  ipInNetworkIncludingTest,
  getNetworkBroadcastAddressTest,
  getClassTest,
  getHostsCountTest,
  getNetworkUsableHostRangeTest,
  getNetworkInfoTest,
  splitNetworkInHalfTest,
  ipNetworkSubnettingTest,
];

testRunner.run(allTests);
