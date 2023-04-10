'use strict';

class IPv4 {
  constructor(ip) {
    if (!this.isValide(ip))
      throw new Error('Error! Invalid IP-address entered!');
    this.address = ip;
  }

  isValide(ip) {
    if (typeof ip !== 'string') return false;
    const numbers = ip
      .split('.')
      .filter((item) => item === (+item).toString())
      .map((item) => +item);
    if (numbers.length !== 4) return false;
    for (const number of numbers) {
      if (!(number >= 0 && number <= 255)) return false;
    }
    return true;
  }
}

module.exports = { IPv4 };
