'use strict';

const assert = require('node:assert/strict');

const runTests = (testsList) => {
  const errorPrefix = 'ERROR:';
  for (const test of testsList) {
    let failed = 0;
    const testInfo = test[0];
    const { testName, context, fn } = testInfo;
    const fnHasOneArg = fn.length === 1;
    const testCount = test.length - 1;
    console.log(`${testName} testing started!`);

    for (let i = 1; i <= testCount; i++) {
      const testCase = test[i];
      const [input, excepted] = testCase;
      const testCaseName = `${testName} test #${i}`;

      try {
        const output = fnHasOneArg ?
          fn.call(context, input) :
          fn.apply(context, input);
        assert.deepStrictEqual(output, excepted, testCaseName);
      } catch (err) {
        const isExcepted =
          typeof excepted === 'string' && excepted.startsWith(errorPrefix);
        if (!isExcepted || err.message !== excepted.slice(errorPrefix.length)) {
          console.log(`${testCaseName} failed!`);
          console.error(err);
          failed++;
        }
      }
    }
    console.log(`Successfully passed: ${testCount - failed}/${testCount}`);
    console.log('-----------------------------');
  }
};

module.exports = { runTests };
