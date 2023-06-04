'use strict';

const CONSTANTS = {
  minAddressPartsCount: 3,
  maxAddressPartsCount: 8,
  addressPartLength: 4,
  fullAddressLength: 39,
};

class IPv6 {
  constructor() {}

  isValide(ip) {
    const { minAddressPartsCount, maxAddressPartsCount, addressPartLength } =
      CONSTANTS;

    if (typeof ip !== 'string') return false;

    if (ip.startsWith(':') && !ip.startsWith('::')) return false;
    if (ip.endsWith(':') && !ip.endsWith('::')) return false;
    if (ip.indexOf('::') !== ip.lastIndexOf('::')) return false;

    const parts = ip.split(':');
    if (parts.length < minAddressPartsCount) return false;
    let emptyParts = 0;

    for (const part of parts) {
      if (part.length > addressPartLength) return false;

      if (part === '') emptyParts++;
      else if (isNaN(+`0x${part}`)) return false;
    }

    const filledParts = parts.length - emptyParts;
    return filledParts <= maxAddressPartsCount;
  }

  isShort(ip) {
    const { fullAddressLength } = CONSTANTS;

    if (!this.isValide(ip)) {
      throw new Error('Invalide ip address!');
    }
    return ip.length < fullAddressLength;
  }
}

module.exports = { IPv6 };
