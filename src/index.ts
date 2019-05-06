
import Segwit from './segwit'
import CryptoJS from 'crypto-js'
import BaseX from 'base-x'
import Blake from 'blakejs'
import BlakeHash from 'blake-hash'

const base58 = BaseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')

const sha256 = (msg: string, type?: string): string => {
  if (type === 'hex') msg = CryptoJS.enc.Hex.parse(msg)
  return CryptoJS.SHA256(msg).toString(CryptoJS.enc.Hex)
}

const blake256 = (msg: any, type?: string): string => {
  if (type === 'hex') msg = Buffer.from(msg, 'hex')
  return BlakeHash('blake256').update(msg).digest('hex')
}

const keccak256 = (msg: any, type?: string): string => {
  if (type === 'hex') msg = CryptoJS.enc.Hex.parse(msg)
  return CryptoJS.SHA3(msg, { outputLength: 256 }).toString(CryptoJS.enc.Hex)
}

const blake2b = (msg: any, len: number, type?: string): string => {
  if (type === 'hex') msg = Buffer.from(msg, 'hex')
  return Blake.blake2bHex(msg, null, len)
}

const base58Decode = (str: string): string => {
  try {
    return base58.decode(str).toString('hex')
  } catch (e) {
    return ''
  }
}

const checkSum = (hex: string, hash: string) => {
  switch (hash) {
    case 'sha256':
      return sha256(sha256(hex, 'hex'), 'hex').substr(0, 8)
    case 'blake256':
      return blake256(blake256(hex, 'hex'), 'hex').substr(0, 8)
    case 'keccak256':
      return keccak256(hex, 'hex').substr(0, 8)
    default:
      return ''
  }
}


const isSegwitAddress = (
  address: string,
  hrp?: string
): boolean => {
  hrp = hrp || 'bc'
  let _decode = Segwit.decode(hrp, address)
  if (_decode === null) {
    hrp = 'tb'
    _decode = Segwit.decode(hrp, address)
  }
  if (_decode === null) return false
  const _encode = Segwit.encode(hrp, _decode.ver, _decode.pro)
  return _encode === address.toLowerCase()
}

const CryptoHelper = {
  sha256,
  blake256,
  keccak256,
  base58Decode,
  blake2b,
  checkSum,
  isSegwitAddress
}

export default CryptoHelper
