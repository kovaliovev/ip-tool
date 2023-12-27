'use strict';

const assert = require('node:assert/strict');

class TestRunner {
  constructor() {
    this.logger = new Logger();
    this.errPrefix = 'ERROR:';
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
        const success = await this.runCase(
          fn,
          context,
          testSuit[i],
          testCaseName,
        );
        if (!success) failed++;
      }
      this.logger.result(caseCount, failed);
    }
  }

  async runCase(fn, context, testCase, testCaseName) {
    const [input, excepted] = testCase;
    const fnHasOneArg = fn.length === 1;
    try {
      const output = await (fnHasOneArg
        ? fn.call(context, input)
        : fn.apply(context, input));
      assert.deepStrictEqual(output, excepted, testCaseName);
    } catch (err) {
      const isExcepted =
        typeof excepted === 'string' && excepted.startsWith(this.errPrefix);
      if (
        !isExcepted ||
        err.message !== excepted.slice(this.errPrefix.length)
      ) {
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

  start(testName) {
    console.log(`${testName} testing started!`);
  }

  fail(testName, err) {
    console.log(`${testName} failed!`);
    console.error(err);
  }

  result(all, failed) {
    const passed = all - failed;
    const color = this.colors[passed === all ? 'green' : 'red'];
    const resetColor = this.colors['default'];
    console.log(`${color} Successfully passed: ${passed}/${all}${resetColor}`);
    console.log('-----------------------------');
  }
}

module.exports = { TestRunner };
