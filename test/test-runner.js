'use strict';

const assert = require('node:assert/strict');

class TestRunner {
  constructor() {
     this.colors = {
      default: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
    };
     this.errorPrefix = 'ERROR:';
  }

  async run(testRun) {
    for (const testSuit of testRun) {
      let failed = 0;
      const testInfo = testSuit[0];
      const { testName, context, fn } = testInfo;
      const caseCount = testSuit.length - 1;
      console.log(`${testName} testing started!`);

      for (let i = 1; i <= caseCount; i++) {
        const testCaseName = `${testName} test #${i}`;
        const success = await this.runCase(fn, context, testSuit[i], testCaseName);
        if (!success) failed++;
      }
      const passed = caseCount - failed;
      const color = passed === caseCount ? this.colors['green'] : this.colors['red'];
      const resetColor = this.colors['default'];
      console.log(`${color} Successfully passed: ${passed}/${caseCount}${resetColor}`);
      console.log('-----------------------------');
    }
  }

  async runCase(fn, context, testCase, testCaseName){
    const [input, excepted] = testCase;

    try {
      const output = await (fn.length === 1 ?
        fn.call(context, input) :
        fn.apply(context, input));
      assert.deepStrictEqual(output, excepted, testCaseName);
    } catch (err) {
      const isExcepted = typeof excepted === 'string' && excepted.startsWith(this.errorPrefix);
      if (!isExcepted || err.message !== excepted.slice(this.errorPrefix.length)) {
        console.log(`${testCaseName} failed!`);
        console.error(err);
        return false;
      }
    }
    return true;
  }
}

module.exports = { TestRunner };
