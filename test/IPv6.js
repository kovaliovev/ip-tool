'use strict';

const { IPv6 } = require('../lib/IPv6.js');
const { runTests } = require('./test-runner.js');

const ipv6 = new IPv6();

const allTests = [];

runTests(allTests);
