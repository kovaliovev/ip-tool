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
      const exceptedError = excepted.slice(errorPrefix.length);
      if (!isExcepted || err.message !== exceptedError) {
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
