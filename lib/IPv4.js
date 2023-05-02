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
    if (!Array.isArray(parts)) throw new Error('Invalid input type!');
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
    if (!(0 <= num && num <= 4294967295))
      throw new Error('Invalid number entered!');
    const numbers = [];
    let divisor = 16777216;
    for (let i = 0; i < 4; i++) {
      const chunk = Math.floor(num / divisor);
      numbers.push(chunk);
      num -= chunk * divisor;
      divisor /= 256;
    }
    const ip = this.fromArray(numbers);
    return ip;
  }

  toBinary(ip) {
    if (!this.isValide(ip)) throw new Error('Invalid IP-address!');
    const numbers = this.toArray(ip);
    const binaryNumbers = numbers.map((num) => num.toString(2));
    const result = binaryNumbers.map((num) => num.padStart(8, '0')).join('.');
    return result;
  }

  fromBinary(binaryIp) {
    if (!this.isBinaryValide(binaryIp)) {
      throw new Error('Invalid binary ip entered!');
    }
    const binaryNumbers = binaryIp.split('.');
    const ipParts = binaryNumbers.map((num) => parseInt(num, 2));
    const ip = this.fromArray(ipParts);
    return ip;
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
    if (/01|0\.1/.test(binaryMask)) throw new Error('Invalid subnet mask!');
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

  getNetworkAddress(ip, mask) {
    if (!this.isValide(ip)) throw new Error('Invalid IP-address!');
    if (!this.isMaskValide(mask)) throw new Error('Invalid subnet mask!');
    const ipNums = this.toArray(ip);
    const maskNums = this.toArray(mask);
    const networkNums = [];
    for (let i = 0; i < 4; i++) {
      networkNums.push(ipNums[i] & maskNums[i]);
    }
    const networkAddress = this.fromArray(networkNums);
    const prefix = this.maskToPrefix(mask);
    const result = `${networkAddress}/${prefix}`;
    return result;
  }

  isNetworkValide(network) {
    if (typeof network !== 'string') return false;
    const [ip, strPrefix] = network.split('/');
    if (!this.isValide(ip)) return false;
    const prefix = parseInt(strPrefix, 10);
    if (!this.isPrefixValide(prefix)) return false;
    const mask = this.maskFromPrefix(prefix);
    const calculatedNetwork = this.getNetworkAddress(ip, mask);
    return network === calculatedNetwork;
  }

  isPrefixValide(prefix) {
    if (typeof prefix !== 'number') return false;
    return 0 <= prefix && prefix <= 32;
  }

  maskToPrefix(mask) {
    if (!this.isMaskValide(mask)) throw new Error('Invalid subnet mask!');
    const binaryMask = this.toBinary(mask);
    const prefix = (binaryMask.match(/1/g) || []).length;
    return prefix;
  }

  maskFromPrefix(prefix) {
    if (!this.isPrefixValide(prefix)) {
      throw new Error('Invalid prefix entered!');
    }
    let onesCount = prefix;
    const maskParts = [];
    for (let i = 0; i < 4; i++) {
      let binaryMaskPart = '';
      for (let j = 0; j < 8; j++) {
        binaryMaskPart += onesCount > 0 ? '1' : '0';
        onesCount--;
      }
      const maskPart = parseInt(binaryMaskPart, 2);
      maskParts.push(maskPart);
    }
    const mask = this.fromArray(maskParts);
    return mask;
  }

  wildcardMaskFromPrefix(prefix) {
    if (!this.isPrefixValide(prefix)) {
      throw new Error('Invalid prefix entered!');
    }
    let zerosCount = prefix;
    const wildcardMaskParts = [];
    for (let i = 0; i < 4; i++) {
      let binaryWildcardMaskPart = '';
      for (let j = 0; j < 8; j++) {
        binaryWildcardMaskPart += zerosCount > 0 ? '0' : '1';
        zerosCount--;
      }
      const wildcardMaskPart = parseInt(binaryWildcardMaskPart, 2);
      wildcardMaskParts.push(wildcardMaskPart);
    }
    const wildcardMask = this.fromArray(wildcardMaskParts);
    return wildcardMask;
  }

  getHostsCount(prefix) {
    if (!this.isPrefixValide(prefix))
      throw new Error('Invalid prefix entered!');
    const power = 32 - prefix;
    const result = 2 ** power;
    return result;
  }

  splitNetworkInHalf(network) {
    if (!this.isNetworkValide(network)) throw new Error('Invalide ip-network!');
    const [address, prefix] = this.parseNetwork(network);
    if (prefix === 32)
      throw new Error('Can not split network with /32 subnet mask!');

    const splittedPrefix = prefix + 1;
    const firstNetwork = address;
    const decimalNetwork = this.toDecimal(address);
    const hostsCount = this.getHostsCount(splittedPrefix);
    const secondNetwork = this.fromDecimal(decimalNetwork + hostsCount);

    return [
      `${firstNetwork}/${splittedPrefix}`,
      `${secondNetwork}/${splittedPrefix}`,
    ];
  }

  getNetworkUsableHostRange(network) {
    if (!this.isNetworkValide(network)) throw new Error('Invalide ip-network!');
    const [address, prefix] = this.parseNetwork(network);
    if (prefix === 31 || prefix === 32)
      throw new Error('Network has no usable hosts!');
    const decimalNetwork = this.toDecimal(address);
    const hostsCount = this.getHostsCount(prefix);
    const firstHostAddress = this.fromDecimal(decimalNetwork + 1);
    const lastHostAddress = this.fromDecimal(decimalNetwork + hostsCount - 2);
    return {
      firstHostAddress,
      lastHostAddress,
    };
  }

  parseNetwork(network) {
    if (!this.isNetworkValide(network)) throw new Error('Invalide ip-network!');
    const [address, strPrefix] = network.split('/');
    const prefix = parseInt(strPrefix, 10);
    return [address, prefix];
  }

  getNetworkBroadcastAddress(network) {
    if (!this.isNetworkValide(network)) throw new Error('Invalide ip-network!');
    const [address, prefix] = this.parseNetwork(network);
    const decimalNetwork = this.toDecimal(address);
    const hostsCount = this.getHostsCount(prefix);
    const broadcastAddress = this.fromDecimal(decimalNetwork + hostsCount - 1);
    return broadcastAddress;
  }
}

module.exports = { IPv4 };
