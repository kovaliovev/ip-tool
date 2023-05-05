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

    this.privateNetworks = {
      '10.0.0.0/8': 'local communications',
      '172.16.0.0/12': 'local communications',
      '192.168.0.0/16': 'local communications',
      '100.64.0.0/10': 'shared address space',
      '192.0.0.0/24': 'IETF protocol assignments',
      '198.18.0.0/15': 'benchmark testing',
    };
  }

  isValide(ip) {
    if (typeof ip !== 'string') return false;

    const parts = ip.split('.');
    const filteredParts = parts.filter((item) => item === (+item).toString());
    if (parts.length !== 4 || filteredParts.length !== 4) return false;

    const numbers = parts.map((item) => parseInt(item, 10));
    for (const number of numbers) {
      if (!(0 <= number && number <= 255)) return false;
    }
    return true;
  }

  isBinaryValide(binaryIp) {
    if (typeof binaryIp !== 'string') return false;
    return /^(?:[01]{8}\.){3}[01]{8}$/.test(binaryIp);
  }

  isMaskValide(mask) {
    try {
      this.maskToBinary(mask);
      return true;
    } catch (err) {
      if (err.message === 'Invalide subnet mask!') {
        return false;
      }
      throw err;
    }
  }

  isPrefixValide(prefix) {
    if (typeof prefix !== 'number') return false;
    return 0 <= prefix && prefix <= 32;
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

  isPrivate(ip) {
    if (!this.isValide(ip)) {
      throw new Error('Invalide ip address!');
    }
    for (const privateNetwork in this.privateNetworks) {
      if (this.isNetworkIncludes(privateNetwork, ip)) return true;
    }
    return false;
  }

  parseNetwork(network) {
    if (!this.isNetworkValide(network)) {
      throw new Error('Invalide ip network!');
    }
    const [address, strPrefix] = network.split('/');
    const prefix = parseInt(strPrefix, 10);
    return [address, prefix];
  }

  toArray(ip) {
    if (!this.isValide(ip)) {
      throw new Error('Invalide ip address!');
    }
    const parts = ip.split('.');
    const numbers = parts.map((item) => parseInt(item, 10));
    return numbers;
  }

  fromArray(parts) {
    if (!Array.isArray(parts)) {
      throw new TypeError('Invalide input type!');
    }
    const ip = parts.join('.');
    if (!this.isValide(ip)) {
      throw new Error('Invalide array entered!');
    }
    return ip;
  }

  toDecimal(ip) {
    if (!this.isValide(ip)) {
      throw new Error('Invalide ip address!');
    }
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
    if (typeof num !== 'number') {
      throw new TypeError('Invalide input type!');
    }
    if (!(0 <= num && num <= 4294967295)) {
      throw new RangeError('Invalide number entered!');
    }
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
    if (!this.isValide(ip)) {
      throw new Error('Invalide ip address!');
    }
    const numbers = this.toArray(ip);
    const binaryNumbers = numbers.map((num) => num.toString(2));
    const result = binaryNumbers.map((num) => num.padStart(8, '0')).join('.');
    return result;
  }

  maskToBinary(mask) {
    if (!this.isValide(mask)) {
      throw new Error('Invalide subnet mask!');
    }
    const binaryMask = this.toBinary(mask);
    if (/01|0\.1/.test(binaryMask)) {
      throw new Error('Invalide subnet mask!');
    }
    return binaryMask;
  }

  fromBinary(binaryIp) {
    if (!this.isBinaryValide(binaryIp)) {
      throw new Error('Invalide binary ip entered!');
    }
    const binaryNumbers = binaryIp.split('.');
    const ipParts = binaryNumbers.map((num) => parseInt(num, 2));
    const ip = this.fromArray(ipParts);
    return ip;
  }

  maskToPrefix(mask) {
    if (!this.isMaskValide(mask)) {
      throw new Error('Invalide subnet mask!');
    }
    const binaryMask = this.toBinary(mask);
    const prefix = (binaryMask.match(/1/g) || []).length;
    return prefix;
  }

  maskFromPrefix(prefix) {
    if (!this.isPrefixValide(prefix)) {
      throw new Error('Invalide prefix entered!');
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
      throw new Error('Invalide prefix entered!');
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

  getNetworkAddress(ip, mask) {
    if (!this.isValide(ip)) {
      throw new Error('Invalide ip address!');
    }
    if (!this.isMaskValide(mask)) {
      throw new Error('Invalide subnet mask!');
    }
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

  isNetworkIncludes(network, ip) {
    if (!this.isNetworkValide(network)) {
      throw new Error('Invalide ip network!');
    }
    if (!this.isValide(ip)) {
      throw new Error('Invalide ip address!');
    }
    const [, prefix] = this.parseNetwork(network);
    const mask = this.maskFromPrefix(prefix);
    const calculatedNetwork = this.getNetworkAddress(ip, mask);
    return calculatedNetwork === network;
  }

  getNetworkBroadcastAddress(network) {
    if (!this.isNetworkValide(network)) {
      throw new Error('Invalide ip network!');
    }
    const [address, prefix] = this.parseNetwork(network);
    const decimalNetwork = this.toDecimal(address);
    const hostsCount = this.getHostsCount(prefix);
    const broadcastAddress = this.fromDecimal(decimalNetwork + hostsCount - 1);
    return broadcastAddress;
  }

  getClass(ip) {
    if (!this.isValide(ip)) {
      throw new Error('Invalide ip address!');
    }
    const ipClassesFirstBits = Object.keys(this.addressClasses);
    const binaryIp = this.toBinary(ip);
    for (const firstBits of ipClassesFirstBits) {
      if (binaryIp.startsWith(firstBits)) {
        return this.addressClasses[firstBits];
      }
    }
  }

  getHostsCount(prefix) {
    if (!this.isPrefixValide(prefix)) {
      throw new Error('Invalide prefix entered!');
    }
    const power = 32 - prefix;
    const result = 2 ** power;
    return result;
  }

  getNetworkUsableHostRange(network) {
    if (!this.isNetworkValide(network)) {
      throw new Error('Invalide ip network!');
    }
    const [address, prefix] = this.parseNetwork(network);
    if (prefix === 31 || prefix === 32) {
      return {
        firstHostAddress: 'Not available',
        lastHostAddress: 'Not available',
      };
    }
    const decimalNetwork = this.toDecimal(address);
    const hostsCount = this.getHostsCount(prefix);
    const firstHostAddress = this.fromDecimal(decimalNetwork + 1);
    const lastHostAddress = this.fromDecimal(decimalNetwork + hostsCount - 2);

    return {
      firstHostAddress,
      lastHostAddress,
    };
  }

  getNetworkInfo(network) {
    if (!this.isNetworkValide(network)) {
      throw new Error('Invalide ip network!');
    }
    const [address, prefix] = this.parseNetwork(network);
    const mask = this.maskFromPrefix(prefix);
    const { firstHostAddress, lastHostAddress } =
      this.getNetworkUsableHostRange(network);

    return {
      address,
      binaryAddress: this.toBinary(address),
      prefix,
      mask,
      binaryMask: this.toBinary(mask),
      wildcardMask: this.wildcardMaskFromPrefix(prefix),
      networkClass: this.getClass(address),
      decimalId: this.toDecimal(address),
      totalHosts: this.getHostsCount(prefix),
      firstHostAddress,
      lastHostAddress,
      broadcastAddress: this.getNetworkBroadcastAddress(network),
      isPrivate: this.isPrivate(address),
    };
  }

  splitNetworkInHalf(network) {
    if (!this.isNetworkValide(network)) {
      throw new Error('Invalide ip network!');
    }
    const [address, prefix] = this.parseNetwork(network);
    if (prefix === 32) {
      throw new Error('Can not split network with /32 subnet mask!');
    }
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
}

module.exports = { IPv4 };
