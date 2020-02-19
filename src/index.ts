
import Segwit from './segwit'
import Base58xmr from './base58xmr'
import BaseX from 'base-x'
import Bech32 from 'bech32'
import CryptoJS from 'crypto-js'
import BlakeJS from 'blakejs'
import BlakeHash from 'blake-hash'

const baseX = (abc: string) => {
  const BX = BaseX(abc)
  return {
    decode: (input: string): Buffer => {
      try {
        return BX.decode(input)
      } catch {
        return Buffer.alloc(0)
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
    decode: (enc?: BufferEncoding | 'xmr'): any => {
      try {
        if (typeof input !== 'string') throw 'input error'
        if (enc === 'xmr') return Base58xmr.decode(input)
        if (enc) return B58.decode(input).toString(enc)
        return B58.decode(input)
      } catch {
        return null
      }
    },
    encode: (): string => {
      try {
        if (typeof input === 'string') throw 'input error'
        return B58.encode(input)
      } catch {
        return ''
      }
    }
  }
}

const bech32 = (prefix: string, words?: number[]) => {
  return {
    decode: (): any => {
      try {
        return Bech32.decode(prefix)
      } catch {
        return null
      }
    },
    encode: (): any => {
      try {
        return Bech32.encode(prefix, words)
      } catch {
        return null
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
      throw new Error('hash error')
  }
}

export default {
  baseX,
  base58,
  bech32,
  sha256,
  blake256,
  keccak256,
  blake2b,
  checksum,
  segwit
}
