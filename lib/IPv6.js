'use strict';

const dnsPromises = require('node:dns').promises;

const CONSTANTS = {
  addressPartsCount: 8,
  addressPartLength: 4,
  fullAddressLength: 39,
  maxHexNum: 16,
};

class IPv6 {
  constructor() {}

  /**
   * Ip address validation
   * @param {string} ip
   * @returns {boolean}
   */
  isValid(ip) {
    const { addressPartsCount, addressPartLength } = CONSTANTS;

    if (typeof ip !== 'string') return false;

    const parts = ip.split(':');
    const partsCount = parts.length;

    const isZeroPartStarting = ip.startsWith('::');
    const isZeroPartEnding = ip.endsWith('::');

    if (ip.startsWith(':') && !isZeroPartStarting) return false;
    if (ip.endsWith(':') && !isZeroPartEnding) return false;

    const firstPart = isZeroPartStarting ? 1 : 0;
    const lastPart = isZeroPartEnding ? partsCount - 1 : partsCount;

    let zeroPartCount = 0;
    for (let i = firstPart; i < lastPart; i++) {
      const part = parts[i];
      if (part.length > addressPartLength) return false;
      if (part === '') {
        if (zeroPartCount) return false;
        zeroPartCount++;
      } else if (isNaN(+`0x${part}`)) return false;
    }

    if (ip.includes('::')) {
      return lastPart - firstPart <= addressPartsCount;
    } else {
      return parts.length === addressPartsCount;
    }
  }

  /**
   * Checking whether ip address is in short format
   * @param {string} ip
   * @returns {boolean}
   */
  isShort(ip) {
    const { fullAddressLength } = CONSTANTS;

    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    return ip.length < fullAddressLength;
  }

  /**
   * Converting ip address to long format
   * @param {string} ip
   * @returns {string}
   */
  toLong(ip) {
    const { addressPartsCount, addressPartLength } = CONSTANTS;

    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    if (!this.isShort(ip)) return ip;

    const parts = ip.split(':');
    const longIpParts = [];

    const notEmptyPartsCount = parts.filter((part) => part !== '').length;
    let partsToAdd = addressPartsCount - notEmptyPartsCount;

    for (const part of parts) {
      if (part === '') {
        while (partsToAdd) {
          longIpParts.push('0000');
          partsToAdd--;
        }
      } else {
        longIpParts.push(part.padStart(addressPartLength, '0'));
      }
    }
    const longIp = longIpParts.join(':');
    return longIp;
  }

  /**
   * Converting ip address to short format
   * @param {string} ip
   * @returns {string}
   */
  toShort(ip) {
    const { addressPartsCount } = CONSTANTS;

    if (!this.isValid(ip)) {
      throw new Error('Invalid ip address!');
    }
    const longIp = this.isShort(ip) ? this.toLong(ip) : ip;
    const longIpParts = longIp.split(':');

    const trimmedIpParts = longIpParts.map((part) =>
      parseInt(part, 16).toString(16)
    );
    const trimmedIp = trimmedIpParts.join(':');

    let maxZeroPartIndex = -1;
    let maxZeroPartLength = 0;
    let currentZeroPartIndex = -1;
    let currentZeroPartLength = 0;
    let isPrevZeroPart = false;

    for (let i = 0; i < addressPartsCount; i++) {
      if (trimmedIpParts[i] === '0') {
        if (!isPrevZeroPart) {
          currentZeroPartIndex = i;
          isPrevZeroPart = true;
        }
        currentZeroPartLength++;
        if (currentZeroPartLength > maxZeroPartLength) {
          maxZeroPartLength = currentZeroPartLength;
          maxZeroPartIndex = currentZeroPartIndex;
        }
      } else {
        currentZeroPartLength = 0;
        isPrevZeroPart = false;
      }
    }

    if (maxZeroPartIndex === -1) return trimmedIp;

    const firstCompressedIpPart = trimmedIpParts
      .slice(0, maxZeroPartIndex)
      .join(':');
    const lastCompressedIpPart = trimmedIpParts
      .slice(maxZeroPartIndex + maxZeroPartLength)
      .join(':');

    const compressedIp = `${firstCompressedIpPart}::${lastCompressedIpPart}`;
    return compressedIp;
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
    const domainNames = await dnsPromises.reverse(ip).catch(err => {
      if (err.code === 'ENOTFOUND') return [];
      throw err;
    });
    return domainNames;
  }

  /**
   * Get ip address from domain name
   * @param {string} domainName
   * @returns {Promise<string[]>}
   */
  async fromDomainName(domainName) {
    if (typeof domainName !== 'string') {
      throw new TypeError('Invalid input type!');
    }
    const ipAddresses = await dnsPromises.resolve6(domainName).catch(err => {
      if (err.code === 'ENODATA') throw new Error('Domain name was not found!');
      throw err;
    });
    return ipAddresses;
  }

  /**
   * Get a random ip address
   * @returns {string}
   */
  getRandomAddress(){
    const { addressPartsCount, addressPartLength, maxHexNum } = CONSTANTS;
    const randomIpParts = [];

    for (let i = 0; i < addressPartsCount; i++) {
      let randomIpPart = '';
      for (let j = 0; j < addressPartLength; j++) {
        const randomNum = Math.floor(Math.random() * maxHexNum);
        randomIpPart += randomNum.toString(maxHexNum);
      }
      randomIpParts.push(randomIpPart);
    }

    const randomIp = randomIpParts.join(':');
    return randomIp;
  }
}

module.exports = { IPv6 };
