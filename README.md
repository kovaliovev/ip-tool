<div align="center">
  <a href="https://github.com/kovaliovev/ip-tool">
    <img
      width="480"
      alt="IP-TOOL - easy work with ip addresses"
      src="https://user-images.githubusercontent.com/111194749/236842615-4a617854-c5b1-4500-a64b-b7e0a9fb327e.png"
    />
  </a>
</div>

# ip-tool
📂 Simple node.js library for processing IP addresses, networks, subnet/wildcard masks, prefixes.    
   
![NPM Downloads](https://img.shields.io/npm/dm/@kovaliovev/ip-tool?label=NPM%20downloads)   

## IPv4 functions
- validation
- converting
- network info getting
- subnetting

## IPv6 functions
_In development..._

# Installation

### git

```shell
git clone https://github.com/kovaliovev/ip-tool.git
```
### npm
```shell
npm i @kovaliovev/ip-tool
```

# Usage
```js
const { IPv4 } = require('ip-tool');
const ipv4 = new IPv4();

ipv4.isValide('22.7.20.20'); // true
ipv4.isMaskValide('22.7.20.20'); // false
ipv4.isPrivate('198.19.0.30'); // true

ipv4.toArray('100.99.255.7'); // [100, 99, 255, 7]
ipv4.toInteger('220.50.89.255'); // 3694287359
ipv4.toBinary('10.0.0.111'); // '00001010.00000000.00000000.01101111'

ipv4.getClass('192.34.60.0'); // 'C'
ipv4.getNetworkAddress('35.88.2.190', '255.255.192.0'); // '35.88.0.0/18'
ipv4.getNetworkBroadcastAddress('35.88.0.0/18'); // '35.88.63.255'
ipv4.getNetworkUsableHostRange('35.88.0.0/18'); // { firstHostAddress: '35.88.0.1', lastHostAddress: '35.88.63.254' }
ipv4.getNetworkInfo('100.41.0.0/16');
// {
//   address: '100.41.0.0',
//   binaryAddress: '01100100.00101001.00000000.00000000',
//   prefix: 16,
//   mask: '255.255.0.0',
//   binaryMask: '11111111.11111111.00000000.00000000',
//   wildcardMask: '0.0.255.255',
//   networkClass: 'A',
//   integerId: 1680408576,
//   totalHosts: 65536,
//   firstHostAddress: '100.41.0.1',
//   lastHostAddress: '100.41.255.254',
//   broadcastAddress: '100.41.255.255',
//   isPrivate: false
// }

ipv4.splitNetworkInHalf('45.0.64.0/18'); // [ '45.0.64.0/19', '45.0.96.0/19' ]
ipv4.networkSubnet('12.32.0.0/20', [500, 254, 255, 128, 100, 50, 39, 15, 14]);
// {
//   '12.32.0.0/23': 512,
//   '12.32.2.0/24': 256,
//   '12.32.3.0/23': 512,
//   '12.32.5.0/24': 256,
//   '12.32.6.0/25': 128,
//   '12.32.6.128/26': 64,
//   '12.32.6.192/26': 64,
//   '12.32.7.0/27': 32,
//   '12.32.7.32/28': 16
// }
```
# Documentation
**All library documentation in** [**github-wiki**](https://github.com/kovaliovev/ip-tool/wiki)**!**
