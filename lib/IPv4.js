'use strict';

class IPv4 {
  constructor() {
    this.addressClasses = {
      0: 'A',
      10: 'B',
      110: 'C',
      1110: 'D',
      1111: 'E',
    };
  }

  isValide(ip) {
    if (typeof ip !== 'string') return false;
    const parts = ip.split('.');
    const filteredParts = parts.filter((item) => item === (+item).toString());
    if (parts.length !== 4 || filteredParts.length !== 4) {
      return false;
    }
    const numbers = parts.map((item) => parseInt(item, 10));
    for (const number of numbers) {
      if (!(number >= 0 && number <= 255)) {
        return false;
      }
    }
    return true;
  }

  isBinaryValide(binaryIp) {
    if (typeof binaryIp !== 'string') return false;
    return /^(?:[01]{8}\.){3}[01]{8}$/.test(binaryIp);
  }

  toArray(ip) {
    if (!this.isValide(ip)) throw new Error('Invalid IP-address!');
    const parts = ip.split('.');
    const numbers = parts.map((item) => parseInt(item, 10));
    return numbers;
  }

  fromArray(parts) {
    if (!(parts instanceof Array)) throw new Error('Invalid input type!');
    const ip = parts.join('.');
    if (!this.isValide(ip)) throw new Error('Invalid array entered!');
    return ip;
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

  fromDecimal(num) {
    if (typeof num !== 'number') throw new Error('Invalid input type!');
    const numbers = [];
    let divisor = 16777216;
    for (let i = 0; i < 4; i++) {
      const chunk = Math.floor(num / divisor);
      numbers.push(chunk);
      num -= chunk * divisor;
      divisor /= 256;
    }
    try {
      const ip = this.fromArray(numbers);
      return ip;
    } catch (err) {
      if (err.message === 'Invalid array entered!') {
        throw new Error('Invalid number entered!');
      }
      throw err;
    }
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
    const ipClassesFirstBits = Object.keys(this.addressClasses);
    const binaryIp = this.toBinary(ip);
    for (const firstBits of ipClassesFirstBits) {
      if (binaryIp.startsWith(firstBits)) {
        return this.addressClasses[firstBits];
      }
    }
  }

  maskToBinary(mask) {
    if (!this.isValide(mask)) throw new Error('Invalid subnet mask!');
    const binaryMask = this.toBinary(mask);
    if (binaryMask.includes('01') || binaryMask.includes('0.1'))
      throw new Error('Invalid subnet mask!');
    return binaryMask;
  }

  isMaskValide(mask) {
    try {
      this.maskToBinary(mask);
      return true;
    } catch (err) {
      if (err.message === 'Invalid subnet mask!') {
        return false;
      }
      throw err;
    }
  }
}

module.exports = { IPv4 };
