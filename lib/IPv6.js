'use strict';

const CONSTANTS = {
  addressPartsCount: 8,
  addressPartLength: 4,
  fullAddressLength: 39,
};

class IPv6 {
  constructor() {}

  /**
   * Ip address validation
   * @param {string} ip
   * @returns {boolean}
   */
  isValide(ip) {
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

    if (!this.isValide(ip)) {
      throw new Error('Invalide ip address!');
    }
    return ip.length < fullAddressLength;
  }
}

module.exports = { IPv6 };
