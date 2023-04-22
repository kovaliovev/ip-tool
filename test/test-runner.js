'use strict';

const assert = require('node:assert/strict');

const runTests = (tests) => {
  const errorPrefix = 'ERROR:';
  let testsName, context, fn;
  for (const test of tests) {
    let failed = 0;
    let testCount = 0;
    for (const data of test) {
      if (data.isInfo) {
        testsName = data.testsName;
        context = data.context;
        fn = data.fn;
        console.log(`${testsName} testing started!`);
      } else {
        const [input, excepted] = data;
        testCount++;
        const testName = `${testsName} test #${testCount}`;
        try {
          const output = fn.call(context, input);
          assert.deepStrictEqual(output, excepted, testName);
        } catch (err) {
          const isExcepted =
            typeof excepted === 'string' && excepted.startsWith(errorPrefix);
          if (
            !isExcepted ||
            err.message !== excepted.slice(errorPrefix.length)
          ) {
            console.log(`${testName} failed!`);
            console.error(err);
            failed++;
          }
        }
      }
    }
    console.log(`Successfully passed: ${testCount - failed}/${testCount}`);
    console.log('-----------------------------');
  }
};

module.exports = { runTests };
