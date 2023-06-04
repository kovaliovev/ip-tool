'use strict';

class IPv6 {
  constructor() {}

  isValide(ip) {
    if (typeof ip !== 'string') return false;

    if (ip.startsWith(':') && !ip.startsWith('::')) return false;
    if (ip.endsWith(':') && !ip.endsWith('::')) return false;
    if (ip.indexOf('::') !== ip.lastIndexOf('::')) return false;

    const parts = ip.split(':');
    if (parts.length < 3) return false;
    let emptyParts = 0;

    for (const part of parts) {
      if (part.length > 4) return false;

      if (part === '') emptyParts++;
      else if (isNaN(+`0x${part}`)) return false;
    }

    const filledParts = parts.length - emptyParts;
    return filledParts <= 8;
  }
}

module.exports = { IPv6 };
