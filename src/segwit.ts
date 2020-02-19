import Bech32 from 'bech32'

const _bech32Decode = (str: string) => {
  try {
    return Bech32.decode(str)
  } catch (e) {
    return null
  }
}

const _bech32Encode = (prefix: string, words: number[]) => {
  try {
    return Bech32.encode(prefix, words)
  } catch (e) {
    return null
  }
}

const _convertbits = (
  data: number[],
  frombits: number,
  tobits: number,
  pad: boolean
) => {
  let acc = 0
  let bits = 0
  let ret = []
  let maxv = (1 << tobits) - 1
  for (let p = 0; p < data.length; ++p) {
    let value = data[p]
    if (value < 0 || (value >> frombits) !== 0) return []
    acc = (acc << frombits) | value
    bits += frombits
    while (bits >= tobits) {
      bits -= tobits
      ret.push((acc >> bits) & maxv)
    }
  }
  if (pad && bits > 0) ret.push((acc << (tobits - bits)) & maxv)
  else if (bits >= frombits || ((acc << (tobits - bits)) & maxv)) return []
  return ret
}

const decode = (
  hrp: string,
  address: string
) => {
  let dec = _bech32Decode(address)
  if (dec === null || dec.prefix !== hrp || dec.words.length < 1 || dec.words[0] > 16) return null
  let res = _convertbits(dec.words.slice(1), 5, 8, false)
  if (res === null || res.length < 2 || res.length > 40) return null
  if (dec.words[0] === 0 && res.length !== 20 && res.length !== 32) return null
  return { ver: dec.words[0], data: res }
}

const encode = (
  hrp: string,
  ver: number,
  data: number[]
) => {
  let res = _bech32Encode(hrp, [ver].concat(_convertbits(data, 8, 5, true)))
  if (decode(hrp, res) === null) return null
  return res
}

export default {
  encode,
  decode
}
