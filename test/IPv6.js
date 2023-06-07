'use strict';

const { IPv6 } = require('../lib/IPv6.js');
const { runTests } = require('./test-runner.js');

const ipv6 = new IPv6();

const ipValidationTest = [
  {
    testName: 'Ip address validation',
    context: ipv6,
    fn: ipv6.isValide,
  },
  ['::', true],
  ['::0', true],
  ['::fff', true],
  ['f::', true],
  ['000::', true],
  ['f::0', true],
  ['f:fff:ffff::0', true],
  ['FFff:ffFF:fFFf:FfFf:fFfF:FffF:FFFF:ffff', true],
  ['0000:0000:0000:0000:0000:0000:0000:0000', true],
  ['7759:f8bf:2d23:7be9:25fb:adab:b6b5:b7a9', true],
  ['7759:f8bf:2d23:7be9:25fb:adab:b6b5::', true],
  ['::f8bf:2d23:7be9:25fb:adab:b6b5:b7a9', true],
  ['', false],
  [':', false],
  [':::', false],
  ['fffa:aaaf', false],
  ['ffff:0000::0000::ffff:ffff', false],
  [':ffff::', false],
  ['::ffff:', false],
  ['gggg::', false],
  ['FFff:ffFF:fFFf:FfFf:fFfF:FffF:FFFF:ffff:aaaa', false],
  ['FFff:ffFF:fFFf:FfFf:fFfF:FffF:FFFF', false],
  ['FFff:ffFF:fFFf:FfFf:fFfF:FffF:FFFF:', false],
  [':FFff:ffFF:fFFf:FfFf:fFfF:FffF:FFFF', false],
  ['FFff:ffFF:fFFf:FfFf:fFfF:FffF:FFFF:ffff::', false],
  ['::FFff:ffFF:fFFf:FfFf:fFfF:FffF:FFFF:ffff', false],
  [0xffff, false],
  [['FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF', 'FFFF'], false],
  [{}, false],
  ['timur::shemsedinov', false],
];

const ipIsShortCheckingTest = [
  {
    testName: 'Ip address is short checking',
    context: ipv6,
    fn: ipv6.isShort,
  },
  ['::', true],
  ['::aFf1', true],
  ['7759:f8bf:2d23:7be9:25fb:adab:6b5:b7a9', true],
  ['7759:f8bf:2d23:7be9:25fb:adab:b6b5:b7a9', false],
  ['0000:0000:0000:0000:0000:0000:0000:0000', false],
  ['FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF', false],
  ['7759:f8bf:2d23:7be9:25fb:adab:b6b5:', 'ERROR:Invalide ip address!'],
  [':1020:', 'ERROR:Invalide ip address!'],
  ['7759:f8bf:JJJJ:7be9:25fb:adab:b6b5:b7a9', 'ERROR:Invalide ip address!'],
  ['7759:f8bf:4add:7be9:25fb:adab:b6b5:b7a9:11', 'ERROR:Invalide ip address!'],
];

const convertIpToLongFormatTest = [
  {
    testName: 'Ip address to long format converting',
    context: ipv6,
    fn: ipv6.toLong,
  },
  ['::', '0000:0000:0000:0000:0000:0000:0000:0000'],
  ['::aFf1', '0000:0000:0000:0000:0000:0000:0000:aFf1'],
  ['aFf1::', 'aFf1:0000:0000:0000:0000:0000:0000:0000'],
  ['aFf1::aFf1', 'aFf1:0000:0000:0000:0000:0000:0000:aFf1'],
  ['a::F', '000a:0000:0000:0000:0000:0000:0000:000F'],
  ['a:22:333:4444:cc:d::F', '000a:0022:0333:4444:00cc:000d:0000:000F'],
  ['a:22:333:4444:cc:d:FFFF:0', '000a:0022:0333:4444:00cc:000d:FFFF:0000'],
  [
    '7759:f8bf:2d23:7be9:25fb:adab:b6b5:b7a9',
    '7759:f8bf:2d23:7be9:25fb:adab:b6b5:b7a9',
  ],
  [
    '7759:f8bf:2d23:7be9:25fb:adab:b6b5::',
    '7759:f8bf:2d23:7be9:25fb:adab:b6b5:0000',
  ],
  [
    '::f8bf:2d23:7be9:25fb:adab:b6b5:b7a9',
    '0000:f8bf:2d23:7be9:25fb:adab:b6b5:b7a9',
  ],
];

const allTests = [
  ipValidationTest,
  ipIsShortCheckingTest,
  convertIpToLongFormatTest,
];

runTests(allTests);
