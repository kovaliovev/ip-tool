'use strict';

class IPv4 {
  constructor() {
    this.ipClasses = {
      0: 'A',
      10: 'B',
      110: 'C',
      1110: 'D',
      1111: 'E',
    };
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

  toArray(ip) {
    if (!this.isValide(ip)) throw new Error('Invalid IP-address!');
    const parts = ip.split('.');
    const numbers = parts.map((item) => parseInt(item, 10));
    return numbers;
  }

  toDecimal(ip) {
    if (!this.isValide(ip)) throw new Error('Invalid IP-address!');
    const numbers = this.toArray(ip);
    let result = 0;
    let multiplier = 1;
    for (let i = numbers.length - 1; i >= 0; i--) {
      result += numbers[i] * multiplier;
      multiplier *= 256;
    }
    return result;
  }

  toBinary(ip) {
    if (!this.isValide(ip)) throw new Error('Invalid IP-address!');
    const numbers = this.toArray(ip);
    const binaryNumbers = numbers.map((num) => num.toString(2));
    const result = binaryNumbers.map((num) => num.padStart(8, '0')).join('.');
    return result;
  }

  getClass(ip) {
    if (!this.isValide(ip)) throw new Error('Invalid IP-address!');
    const ipClassesFirstBits = Object.keys(this.ipClasses);
    const binaryIp = this.toBinary(ip);
    for (const firtsBits of ipClassesFirstBits) {
      if (binaryIp.startsWith(firtsBits)) {
        return this.ipClasses[firtsBits];
      }
    }
  }

  maskToBinary(mask) {
    if (!this.isValide(mask)) throw new Error('Invalid IP-mask!');
    const binaryMask = this.toBinary(mask);
    if (binaryMask.includes('01') || binaryMask.includes('0.1'))
      throw new Error('Invalid IP-mask!');
    return binaryMask;
  }
}

module.exports = { IPv4 };
