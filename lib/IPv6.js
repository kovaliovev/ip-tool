'use strict';

const CONSTANTS = {
  minAddressPartsCount: 3,
  maxAddressPartsCount: 8,
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
    const { minAddressPartsCount, maxAddressPartsCount, addressPartLength } =
      CONSTANTS;

    if (typeof ip !== 'string') return false;

    const ipParts = ip.split(':');
    const ipPartsCount = ipParts.length;
    const zeroPartIndex = ip.indexOf('::');

    if (zeroPartIndex === -1) {
      if (ipPartsCount !== maxAddressPartsCount) return false;

      for (const part of ipParts) {
        if (part.length > 4) return false;
        if (isNaN(+`0x${part}`)) return false;
      }
    } else {
      if (ip === '::') return true;
      if (zeroPartIndex !== ip.lastIndexOf('::')) return false;

      if (ipPartsCount < minAddressPartsCount) return false;
      if (ipPartsCount > maxAddressPartsCount + 1) return false;

      if (zeroPartIndex === 0) {
        for (let i = 2; i < ipPartsCount; i++) {
          const part = ipParts[i];
          if (part.length > 4) return false;
          if (isNaN(+`0x${part}`)) return false;
        }
      } else if (zeroPartIndex === ip.length - 2) {
        for (let i = 0; i < ipPartsCount - 2; i++) {
          const part = ipParts[i];
          if (part.length > addressPartLength) return false;
          if (isNaN(+`0x${part}`)) return false;
        }
      } else {
        if (ipPartsCount > maxAddressPartsCount) return false;
        let zeroPartCount = 0;

        for (const part of ipParts) {
          if (part.length > addressPartLength) return false;
          if (part === '') {
            if (zeroPartCount) return false;
            zeroPartCount++;
          } else if (isNaN(+`0x${part}`)) return false;
        }
      }
    }
    return true;
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
