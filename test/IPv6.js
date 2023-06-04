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
  ['::1', true],
  ['1::1:1', true],
  ['0000:0000:0000:0000:0000:0000:0000::', true],
  ['0000:0000:0000:0000:0000:0000:0000:0000', true],
  ['0:00:000:0000:000:00:0::', true],
  ['FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF', true],
  ['7759:f8bf:2d23:7be9:25fb:adab:b6b5:b7a9', true],
  ['7759::b7a9', true],
  ['10.0.0.1', false],
  ['0.0.0.0.0.0.0.0', false],
  ['error:string', false],
  ['', false],
  [':', false],
  [':::', false],
  ['a:a', false],
  ['::a:', false],
  [':10AF:', false],
  ['a:a:a:a:a:a:a:a:a', false],
  ['0000::0000:0000:0000::', false],
  ['FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FZFF', false],
  ['7759:f8bf:2d23:7be9:25fb:adab:b6b5:b7a9:56aa', false],
  [['7709', 'f8ff', '2d3', '7e9', '20b', 'adb', 'b605', 'b7a0', '56af'], false],
  [{}, false],
  [0xffffffffffff, false],
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

const allTests = [ipValidationTest, ipIsShortCheckingTest];

runTests(allTests);
