
import CryptoJS from 'crypto-js'
import BaseX from 'base-x'
import Bech32 from 'bech32'
import Blake from 'blakejs'
import BlakeHash from 'blake-hash'


const base58 = BaseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')

const _has0x = (str: string) => str.slice(0, 2).toLowerCase() === '0x'
const _add0x = (str: string) => _has0x(str) ? str : '0x' + str
const _del0x = (str: string) => _has0x(str)  ? str.slice(2) : str

const sha256 = (msg: any): string => {
  if (_has0x(msg)) msg = CryptoJS.enc.Hex.parse(_del0x(msg))
  return _add0x(CryptoJS.SHA256(msg).toString(CryptoJS.enc.Hex))
}

const blake256 = (msg: any): string => {
  if (_has0x(msg)) msg = Buffer.from(_del0x(msg), 'hex')
  return _add0x(BlakeHash('blake256').update(msg).digest('hex'))
}

const keccak256 = (msg: any): string => {
  if (_has0x(msg)) msg = CryptoJS.enc.Hex.parse(_del0x(msg))
  return _add0x(CryptoJS.SHA3(msg, { outputLength: 256 }).toString(CryptoJS.enc.Hex))
}

const blake2b = (msg: any, len: number): string => {
  if (_has0x(msg)) msg = Buffer.from(_del0x(msg), 'hex')
  return _add0x(Blake.blake2bHex(msg, null, len))
}

const base58Decode = (str: string) => {
  try {
    return _add0x(base58.decode(str).toString('hex'))
  } catch (e) {
    return null
  }
}
const bech32Decode = (str: string) => {
  try {
    return Bech32.decode(str)
  } catch (e) {
    return null
  }
}

const checksum = (hex: string, hash: string) => {
  switch (hash) {
    case 'sha256':
      return sha256(sha256(hex)).substr(0, 10)
    case 'blake256':
      return blake256(blake256(hex)).substr(0, 10)
    case 'keccak256':
      return keccak256(hex).substr(0, 10)
    default:
      return null
  }
}

export default {
  sha256,
  blake256,
  keccak256,
  base58Decode,
  bech32Decode,
  blake2b,
  checksum
}
