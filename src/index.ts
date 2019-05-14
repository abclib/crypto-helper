
import Segwit from './segwit'
import Base58xmr from './base58xmr'
import BaseX from 'base-x'
import CryptoJS from 'crypto-js'
import BlakeJS from 'blakejs'
import BlakeHash from 'blake-hash'


const baseX = (abc: string) => {
  const BX = BaseX(abc)
  return {
    decode: (input: string): string | Buffer => {
      try {
        return BX.decode(input)
      } catch {
        return ''
      }
    }
    ,
    encode: (input: Buffer): string => {
      try {
        return BX.encode(input)
      } catch {
        return ''
      }
    }
  }
}

const base58 = (input: string | Buffer) => {
  const B58 = BaseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')
  return {
    decode: (enc: BufferEncoding | 'xmr' = 'hex'): string | Buffer => {
      try {
        let str = typeof input === 'string' ? input : input.toString()
        const res = B58.decode(str)
        if (enc === 'xmr') return Base58xmr.decode(str)
        if (enc) return res.toString(enc)
        return res
      } catch {
        return ''
      }
    }
    ,
    encode: (): string => {
      try {
        let bin = typeof input === 'string' ? Buffer.from(input) : input
        return B58.encode(bin)
      } catch {
        return ''
      }
    }
  }
}

const segwit = (
  hrp: string,
  str: string | number,
  pro?: number[]
  ) => {
  return {
    decode: () => {
      if (typeof str === 'number') return null
      return Segwit.decode(hrp, str)
    },
    encode: () => {
      if (pro === undefined || typeof str === 'string') return null
      return Segwit.encode(hrp, str, pro)
    }
  }
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

const checksum = (hex: string, hash: string) => {
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
  baseX,
  base58,
  sha256,
  blake256,
  keccak256,
  blake2b,
  checksum,
  segwit
}

export default CryptoHelper
