'use strict';

const assert = require('node:assert/strict');

class TestRunner {
  constructor() {
    this.logger = new Logger();
     this.errorPrefix = 'ERROR:';
  }

  async run(testRun) {
    for (const testSuit of testRun) {
      let failed = 0;
      const testInfo = testSuit[0];
      const { testName, context, fn } = testInfo;
      const caseCount = testSuit.length - 1;
      this.logger.start(testName);

      for (let i = 1; i <= caseCount; i++) {
        const testCaseName = `${testName} test #${i}`;
        const success = await this.runCase(fn, context, testSuit[i], testCaseName);
        if (!success) failed++;
      }
      this.logger.result(caseCount, failed);
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
        this.logger.fail(testCaseName, err);
        return false;
      }
    }
    return true;
  }
}

class Logger {
  constructor() {
    this.colors = {
      default: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
    };
  }

  start(testName){
    console.log(`${testName} testing started!`);
  }

  fail(testName, err) {
    console.log(`${testName} failed!`);
    console.error(err);
  }

  result(testCount, failed){
    const passed = testCount - failed;
    const color = passed === testCount ?
      this.colors['green'] :
      this.colors['red'];
    const resetColor = this.colors['default'];
    console.log(`${color} Successfully passed: ${passed}/${testCount}${resetColor}`);
    console.log('-----------------------------');
  }
}

module.exports = { TestRunner };
