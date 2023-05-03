'use strict';

const assert = require('node:assert/strict');

const COLORS = {
  default: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
};

const runTests = (testsList) => {
  const errorPrefix = 'ERROR:';
  for (const test of testsList) {
    let failed = 0;
    const testInfo = test[0];
    const { testName, context, fn } = testInfo;
    const fnHasOneArg = fn.length === 1;
    const caseCount = test.length - 1;
    console.log(`${testName} testing started!`);

    for (let i = 1; i <= caseCount; i++) {
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
    const passed = caseCount - failed;
    const color = passed === caseCount ? COLORS['green'] : COLORS['red'];
    const resetColor = COLORS['default'];
    console.log(
      `${color} Successfully passed: ${passed}/${caseCount}${resetColor}`
    );
    console.log('-----------------------------');
  }
};

module.exports = { runTests };
