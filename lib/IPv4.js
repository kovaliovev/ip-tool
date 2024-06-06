'use strict';

const dnsPromises = require('node:dns').promises;

const CONSTANTS = {
  octetsCount: 4,
  minDecOctet: 0,
  maxDecOctet: 255,
  minPrefix: 0,
  maxPrefix: 32,
  octetValue: 256,
  minIntegerId: 0,
  maxIntegerId: 4294967295,
  binaryOctetLength: 8,
  unusableAddresses: 2,
};

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

  /**
   * Ip address validation
   * @param {string} ip
   * @returns {boolean}
   */
  isValid(ip) {
    const { octetsCount, minDecOctet, maxDecOctet } = CONSTANTS;

    if (typeof ip !== 'string') return false;

    const parts = ip.split('.');
    if (parts.length !== octetsCount) return false;

    const filteredParts = parts.filter((item) => item === (+item).toString());
    if (filteredParts.length !== octetsCount) return false;

    const numbers = parts.map((item) => parseInt(item, 10));
    for (const number of numbers) {
      if (!(minDecOctet <= number && number <= maxDecOctet)) return false;
    }
    return true;
  }

  /**
   * Binary ip address validation
   * @param {string} binaryIp
   * @returns {boolean}
   */
  isBinaryValid(binaryIp) {
    const { octetsCount, binaryOctetLength } = CONSTANTS;

    if (typeof binaryIp !== 'string') return false;

    const binaryParts = binaryIp.split('.');
    if (binaryParts.length !== octetsCount) return false;

    for (const octet of binaryParts) {
      if (octet.length !== binaryOctetLength) return false;

      for (const char of octet) {
        if (!(char === '1' || char === '0')) return false;
      }
    }
    return true;
  }

  /**
   * Subnet mask validation
   * @param {string} mask
   * @returns {boolean}
   */
  isMaskValid(mask) {
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

  /**
   * Ip network prefix validation
   * @param {number} prefix
   * @returns {boolean}
   */
  isPrefixValid(prefix) {
    const { minPrefix, maxPrefix } = CONSTANTS;

    if (typeof prefix !== 'number') return false;
    return minPrefix <= prefix && prefix <= maxPrefix;
  }

  /**
   * Ip network validation
   * @param {string} network
   * @returns {boolean}
   */
  isNetworkValid(network) {
    if (typeof network !== 'string') return false;

    const [ip, strPrefix] = network.split('/');
    if (!this.isValid(ip)) return false;
    const prefix = parseInt(strPrefix, 10);
    if (!this.isPrefixValid(prefix)) return false;

    const mask = this.maskFromPrefix(prefix, false);
    const calculatedNetwork = this.getNetworkAddress(ip, mask);
    return network === calculatedNetwork;
  }

  /**
   * Checking whether ip network is private
   * @param {string} ip
   * @returns {boolean}
   */
  isPrivate(ip) {
    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    for (const privateNetwork in this.privateNetworks) {
      if (this.isNetworkIncludes(privateNetwork, ip)) return true;
    }
    return false;
  }

  /**
   * Check if ip network includes ip address
   * @param {string} network
   * @param {string} ip
   * @returns {boolean}
   */
  isNetworkIncludes(network, ip) {
    if (!this.isNetworkValid(network)) {
      throw new Error('Invalid ip network!');
    }
    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    const [, prefix] = this.parseNetwork(network);
    const mask = this.maskFromPrefix(prefix, false);
    const calculatedNetwork = this.getNetworkAddress(ip, mask);
    return calculatedNetwork === network;
  }

  /**
   * Parsing ip network into network address and prefix
   * @param {string} network
   * @returns {[string, number]}
   */
  parseNetwork(network) {
    if (!this.isNetworkValid(network)) {
      throw new Error('Invalid ip network!');
    }
    const [address, strPrefix] = network.split('/');
    const prefix = parseInt(strPrefix, 10);
    return [address, prefix];
  }

  /**
   * Convert ip address into array of numbers
   * @param {string} ip
   * @returns {number[]}
   */
  toArray(ip) {
    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    const parts = ip.split('.');
    const numbers = parts.map((item) => parseInt(item, 10));
    return numbers;
  }

  /**
   * Convert array of numbers into ip address
   * @param {array} parts
   * @returns {string}
   */
  fromArray(parts) {
    if (!Array.isArray(parts)) {
      throw new TypeError('Invalid input type!');
    }
    const ip = parts.join('.');
    if (!this.isValid(ip)) {
      throw new Error('Invalid array entered!');
    }
    return ip;
  }

  /**
   * Convert ip address into integer number
   * @param {string} ip
   * @returns {number}
   */
  toInteger(ip) {
    const { octetsCount, octetValue } = CONSTANTS;

    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    const numbers = this.toArray(ip);
    let result = 0;
    let multiplier = 1;
    for (let i = octetsCount - 1; i >= 0; i--) {
      result += numbers[i] * multiplier;
      multiplier *= octetValue;
    }
    return result;
  }

  /**
   * Convert integer number into ip address
   * @param {number} num
   * @returns {string}
   */
  fromInteger(num) {
    const { minIntegerId, maxIntegerId, octetValue, octetsCount } = CONSTANTS;

    if (typeof num !== 'number') {
      throw new TypeError('Invalid input type!');
    }
    if (!(minIntegerId <= num && num <= maxIntegerId)) {
      throw new RangeError('Invalid number entered!');
    }
    const numbers = [];
    let divisor = octetValue ** (octetsCount - 1);

    for (let i = 0; i < octetsCount; i++) {
      const chunk = Math.floor(num / divisor);
      numbers.push(chunk);
      num -= chunk * divisor;
      divisor /= octetValue;
    }
    const ip = this.fromArray(numbers);
    return ip;
  }

  /**
   * Convert ip address into binary ip address
   * @param {string} ip
   * @returns {string}
   */
  toBinary(ip) {
    const { binaryOctetLength } = CONSTANTS;

    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    const numbers = this.toArray(ip);
    const binaryNumbers = numbers.map((num) => num.toString(2));
    const result = binaryNumbers
      .map((num) => num.padStart(binaryOctetLength, '0'))
      .join('.');
    return result;
  }

  /**
   * Convert subnet mask into binary subnet mask
   * @param {string} mask
   * @returns {string}
   */
  maskToBinary(mask) {
    if (!this.isValid(mask)) {
      throw new Error('Invalid subnet mask!');
    }
    const binaryMask = this.toBinary(mask);
    if (binaryMask.includes('01') || binaryMask.includes('0.1')) {
      throw new Error('Invalid subnet mask!');
    }
    return binaryMask;
  }

  /**
   * Convert binary ip address into ip address
   * @param {string} binaryIp
   * @returns {string}
   */
  fromBinary(binaryIp) {
    if (!this.isBinaryValid(binaryIp)) {
      throw new Error('Invalid binary ip entered!');
    }
    const binaryNumbers = binaryIp.split('.');
    const ipParts = binaryNumbers.map((num) => parseInt(num, 2));
    const ip = this.fromArray(ipParts);
    return ip;
  }

  /**
   * Convert subnet mask into ip network prefix
   * @param {string} mask
   * @returns {number}
   */
  subnetMaskToPrefix(mask) {
    if (!this.isMaskValid(mask)) {
      throw new Error('Invalid subnet mask!');
    }
    const binaryMask = this.toBinary(mask);
    let prefix = 0;
    for (const char of binaryMask) {
      if (char === '1') prefix++;
    }
    return prefix;
  }

  /**
   * Convert ip network prefix into subnet or wildcard mask
   * @param {number} prefix
   * @param {boolean} isWildcard
   * @returns {string}
   */
  maskFromPrefix(prefix, isWildcard) {
    const { octetsCount, binaryOctetLength } = CONSTANTS;

    if (!this.isPrefixValid(prefix)) {
      throw new Error('Invalid prefix entered!');
    }
    let valuesCount = prefix;
    const [value, filler] = isWildcard ? ['0', '1'] : ['1', '0'];
    const maskParts = [];

    for (let i = 0; i < octetsCount; i++) {
      let binaryMaskPart = '';

      for (let j = 0; j < binaryOctetLength; j++) {
        binaryMaskPart += valuesCount > 0 ? value : filler;
        valuesCount--;
      }
      const maskPart = parseInt(binaryMaskPart, 2);
      maskParts.push(maskPart);
    }
    const mask = this.fromArray(maskParts);
    return mask;
  }

  /**
   * Get domain names by ip address
   * @param {string} ip
   * @returns {Promise<string[]>}
   */
  async getDomainNames(ip) {
    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    const domainNames = await dnsPromises.reverse(ip).catch((err) => {
      if (err.code === 'ENOTFOUND') return [];
      throw err;
    });
    return domainNames;
  }

  /**
   * Get array of ip addresses from domain name
   * @param {string} domainName
   * @returns {Promise<string[]>}
   */
  async fromDomainName(domainName) {
    if (typeof domainName !== 'string') {
      throw new TypeError('Invalid input type!');
    }
    const ipAddresses = await dnsPromises.resolve4(domainName).catch((err) => {
      if (err.code === 'ENODATA') throw new Error('Domain name was not found!');
      throw err;
    });
    return ipAddresses;
  }

  /**
   * Get the number of ip addresses between two given ip addresses
   * @param {string} ip1
   * @param {string} ip2
   * @returns {number}
   */
  getAdressesDistance(ip1, ip2) {
    if (!this.isValid(ip1) || !this.isValid(ip2)) {
      throw new Error('Invalid ip address!');
    }
    const intIp1 = this.toInteger(ip1);
    const intIp2 = this.toInteger(ip2);
	
    return Math.abs(intIp1 - intIp2);
  }

  /**
   * Get a random ip address
   * @returns {string}
   */
  getRandomAddress() {
    const { octetsCount, minDecOctet, maxDecOctet } = CONSTANTS;
    const randomIpParts = [];

    for (let i = 0; i < octetsCount; i++) {
      const randomOctet =
        Math.floor(Math.random() * (maxDecOctet - minDecOctet + 1)) +
        minDecOctet;
      randomIpParts.push(randomOctet);
    }
    const randomIp = randomIpParts.join('.');
    return randomIp;
  }

  /**
   * Get ip network address by host ip address and subnet mask
   * @param {string} ip
   * @param {string} mask
   * @returns {string}
   */
  getNetworkAddress(ip, mask) {
    const { octetsCount } = CONSTANTS;

    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    if (!this.isMaskValid(mask)) {
      throw new Error('Invalid subnet mask!');
    }
    const ipNums = this.toArray(ip);
    const maskNums = this.toArray(mask);
    const networkNums = [];
    for (let i = 0; i < octetsCount; i++) {
      networkNums.push(ipNums[i] & maskNums[i]);
    }
    const networkAddress = this.fromArray(networkNums);
    const prefix = this.subnetMaskToPrefix(mask);
    const result = `${networkAddress}/${prefix}`;
    return result;
  }

  /**
   * Get all ip addresses in ip network
   * @param {string} network
   * @returns {string[]}
   */
  getAllNetworkAddresses(network) {
    if (!this.isNetworkValid(network)) {
      throw new Error('Invalid ip network!');
    }
    const [address, prefix] = this.parseNetwork(network);
    const totalHosts = this.getHostsCount(prefix);
    const startIp = this.toInteger(address);
    const ipAddresses = [];
    for (let i = 0; i < totalHosts; i++) {
      ipAddresses.push(this.fromInteger(startIp + i));
    }
    return ipAddresses;
  }

  /**
   * Get ip network broadcast address by ip network
   * @param {string} network
   * @returns {string}
   */
  getNetworkBroadcastAddress(network) {
    if (!this.isNetworkValid(network)) {
      throw new Error('Invalid ip network!');
    }
    const [address, prefix] = this.parseNetwork(network);
    const integerNetwork = this.toInteger(address);
    const hostsCount = this.getHostsCount(prefix);
    const broadcastAddress = this.fromInteger(integerNetwork + hostsCount - 1);
    return broadcastAddress;
  }

  /**
   * Get class of ip address
   * @param {string} ip
   * @returns {string}
   */
  getClass(ip) {
    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    const ipClassesFirstBits = Object.keys(this.addressClasses);
    const binaryIp = this.toBinary(ip);
    for (const firstBits of ipClassesFirstBits) {
      if (binaryIp.startsWith(firstBits)) {
        return this.addressClasses[firstBits];
      }
    }
  }

  /**
   * Get number of hosts in network by prefix
   * @param {number} prefix
   * @returns {number}
   */
  getHostsCount(prefix) {
    const { maxPrefix } = CONSTANTS;

    if (!this.isPrefixValid(prefix)) {
      throw new Error('Invalid prefix entered!');
    }
    const power = maxPrefix - prefix;
    const result = 2 ** power;
    return result;
  }

  /**
   * Get first and last usable ip address in ip network
   * @param {string} network
   * @returns
   */
  getNetworkUsableHostRange(network) {
    const { maxPrefix, unusableAddresses } = CONSTANTS;
    if (!this.isNetworkValid(network)) {
      throw new Error('Invalid ip network!');
    }
    const [address, prefix] = this.parseNetwork(network);
    if (prefix === maxPrefix - 1 || prefix === maxPrefix) {
      return {
        firstHostAddress: 'Not available',
        lastHostAddress: 'Not available',
      };
    }
    const integerNetwork = this.toInteger(address);
    const hostsCount = this.getHostsCount(prefix);

    const firstHostInteger = integerNetwork + 1;
    const firstHostAddress = this.fromInteger(firstHostInteger);

    const lastHostInteger = integerNetwork + hostsCount - unusableAddresses;
    const lastHostAddress = this.fromInteger(lastHostInteger);

    return {
      firstHostAddress,
      lastHostAddress,
    };
  }

  /**
   * Get object with information about ip network
   * @param {string} network
   * @returns
   */
  getNetworkInfo(network) {
    if (!this.isNetworkValid(network)) {
      throw new Error('Invalid ip network!');
    }
    const [address, prefix] = this.parseNetwork(network);
    const mask = this.maskFromPrefix(prefix, false);
    const { firstHostAddress, lastHostAddress } =
      this.getNetworkUsableHostRange(network);

    return {
      address,
      binaryAddress: this.toBinary(address),
      prefix,
      mask,
      binaryMask: this.toBinary(mask),
      wildcardMask: this.maskFromPrefix(prefix, true),
      networkClass: this.getClass(address),
      integerId: this.toInteger(address),
      totalHosts: this.getHostsCount(prefix),
      firstHostAddress,
      lastHostAddress,
      broadcastAddress: this.getNetworkBroadcastAddress(network),
      isPrivate: this.isPrivate(address),
    };
  }

  /**
   * Split ip network into two equal networks
   * @param {string} network
   * @returns {string[2]}
   */
  splitNetworkInHalf(network) {
    const { maxPrefix } = CONSTANTS;

    if (!this.isNetworkValid(network)) {
      throw new Error('Invalid ip network!');
    }
    const [address, prefix] = this.parseNetwork(network);
    if (prefix === maxPrefix) {
      throw new Error('Can not split network with /32 subnet mask!');
    }
    const splitPrefix = prefix + 1;
    const firstNetwork = address;
    const integerNetwork = this.toInteger(address);
    const hostsCount = this.getHostsCount(splitPrefix);
    const secondNetwork = this.fromInteger(integerNetwork + hostsCount);

    return [
      `${firstNetwork}/${splitPrefix}`,
      `${secondNetwork}/${splitPrefix}`,
    ];
  }

  /**
   * Subnetting network by required numbers of hosts
   * @param {string} network
   * @param {number[]} subnetsRequiredHostsCount
   * @returns
   */
  networkSubnet(network, subnetsRequiredHostsCount) {
    const { maxPrefix, unusableAddresses, maxIntegerId } = CONSTANTS;

    if (!this.isNetworkValid(network)) {
      throw new Error('Invalid ip network!');
    }
    if (!Array.isArray(subnetsRequiredHostsCount)) {
      throw new TypeError('Invalid input type!');
    }
    if (subnetsRequiredHostsCount.length === 0) {
      throw new Error('Invalid array entered!');
    }
    const result = {};
    const [address, prefix] = this.parseNetwork(network);
    let availableHostsCount = this.getHostsCount(prefix);
    let integerSubnetAddress = this.toInteger(address);

    for (const hostsCount of subnetsRequiredHostsCount) {
      if (typeof hostsCount !== 'number') {
        throw new TypeError('Invalid type of hosts count!');
      }
      if (!(0 < hostsCount && hostsCount < maxIntegerId)) {
        throw new RangeError('Invalid hosts count entered!');
      }
      const power = Math.ceil(Math.log2(hostsCount + unusableAddresses));
      const subnetHosts = 2 ** power;
      const subnetPrefix = maxPrefix - power;
      const subnetAddress = this.fromInteger(integerSubnetAddress);
      const subnetNetwork = `${subnetAddress}/${subnetPrefix}`;

      result[subnetNetwork] = subnetHosts;
      integerSubnetAddress += subnetHosts;
      availableHostsCount -= subnetHosts;
      if (availableHostsCount < 0) {
        throw new Error('Too many required hosts for this network!');
      }
    }
    return result;
  }
}

module.exports = { IPv4 };
