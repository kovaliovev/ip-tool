'use strict';

const assert = require('node:assert/strict');

const COLORS = {
  default: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
};

const runTests = async (testRun) => {
  const errorPrefix = 'ERROR:';
  for (const testSuit of testRun) {
    let failed = 0;
    const testInfo = testSuit[0];
    const { testName, context, fn } = testInfo;
    const fnHasOneArg = fn.length === 1;
    const caseCount = testSuit.length - 1;
    console.log(`${testName} testing started!`);

    for (let i = 1; i <= caseCount; i++) {
      const testCase = testSuit[i];
      const [input, excepted] = testCase;
      const testCaseName = `${testName} test #${i}`;

      try {
        const output = await (fnHasOneArg ?
          fn.call(context, input) :
          fn.apply(context, input));
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
