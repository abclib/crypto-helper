
import Segwit from './segwit'
import BaseX from 'base-x'
import CryptoJS from 'crypto-js'
import BlakeJS from 'blakejs'
import BlakeHash from 'blake-hash'

class Base58 extends BaseX{
  input: string
  constructor(input: string) {
    super('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')
    this.input = input
  }
  dec = (): Buffer => this.decode(this.input)
  enc =(): string => this.encode(this.input)
}

const sha256 = (input: string, enc: BufferEncoding = 'utf8'): string => {
  let _enc = enc.toLowerCase()
  _enc = enc.charAt(0).toUpperCase() + enc.slice(1)
  return CryptoJS.SHA256(CryptoJS.enc[_enc].parse(input)).toString(CryptoJS.enc.Hex)
}

const keccak256 = (input: string, enc: BufferEncoding = 'utf8'): string => {
  let _enc = enc.toLowerCase()
  _enc = enc.charAt(0).toUpperCase() + enc.slice(1)
  return CryptoJS.SHA3(CryptoJS.enc[_enc].parse(input), { outputLength: 256 }).toString(CryptoJS.enc.Hex)
}

const blake256 = (input: string, enc: BufferEncoding = 'utf8'): string => BlakeHash('blake256').update(input, enc).digest('hex')

const blake2b = (input: string, outlen?: number, enc: BufferEncoding = 'utf8'): string => BlakeJS.blake2bHex(Buffer.from(input, enc), null, outlen)

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
  BaseX,
  base58: (input: string) => new Base58(input),
  sha256,
  blake256,
  keccak256,
  blake2b,
  checkSum,
  isSegwitAddress
}

export default CryptoHelper
