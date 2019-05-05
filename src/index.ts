
import CryptoJS from 'crypto-js'
import BaseX from 'base-x'
import Bech32 from 'bech32'
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

const base58Decode = (str: string) => {
  try {
    return base58.decode(str).toString('hex')
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

const checkSum = (hex: string, hash: string) => {
  switch (hash) {
    case 'sha256':
      return sha256(sha256(hex, 'hex'), 'hex').substr(0, 8)
    case 'blake256':
      return blake256(blake256(hex, 'hex'), 'hex').substr(0, 8)
    case 'keccak256':
      return keccak256(hex, 'hex').substr(0, 8)
    default:
      return null
  }
}

const CryptoHelper = {
  sha256,
  blake256,
  keccak256,
  base58Decode,
  bech32Decode,
  blake2b,
  checkSum
}

export default CryptoHelper
