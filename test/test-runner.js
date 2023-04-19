'use strict';

const assert = require('node:assert/strict');

const runTests = (fn, tests, context = null) => {
  console.log('Testing started!');
  const errorPrefix = 'ERROR:';
  let failed = 0;
  for (const [input, excepted, name] of tests) {
    console.log(`${name} testing...`);
    try {
      const output = fn.call(context, input);
      assert.deepStrictEqual(output, excepted, name);
    } catch (err) {
      const isExcepted =
        typeof excepted === 'string' && excepted.startsWith(errorPrefix);
      if (!isExcepted || err.message !== excepted.slice(errorPrefix.length)) {
        console.error(err);
        failed++;
      }
    }
  }
  console.log('Testing ended!');
  console.log(`Successfully passed: ${tests.length - failed}/${tests.length}`);
  console.log('-----------------------------');
};

module.exports = { runTests };
