import BigNumber from 'bignumber.js'

let alphabet_str = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
let alphabet: number[] = []
for (let i = 0; i < alphabet_str.length; i++) alphabet.push(alphabet_str.charCodeAt(i))
let encoded_block_sizes = [0, 2, 3, 5, 6, 7, 9, 10, 11]

let alphabet_size = alphabet.length
let full_block_size = 8
let full_encoded_block_size = 11

let UINT64_MAX = new BigNumber(2).pow(64)

const bin2hex = (bin: Uint8Array) => {
  let out = []
  for (let i = 0; i < bin.length; ++i) out.push(('0' + bin[i].toString(16)).slice(-2))
  return out.join('')
}

const hex2bin = (str: string) => {
  let res = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) res[i] = str.charCodeAt(i)
  return res
}

const uint64_to_8be = (num: BigNumber, size: number) => {
  let res = new Uint8Array(size)
  if (size < 1 || size > 8) throw Error('Invalid input length')
  const twopow8 = new BigNumber(2).pow(8)
  for (let i = size - 1; i >= 0; i--) {
    res[i] = num.mod(twopow8).toNumber()
    num = num.idiv(twopow8)
  }
  return res
}

const decode_block = (data: Uint8Array, buf: Uint8Array, index: number) => {
  if (data.length < 1 || data.length > full_encoded_block_size) throw Error('Invalid block length: ' + data.length)
  const res_size = encoded_block_sizes.indexOf(data.length)
  if (res_size <= 0) throw Error('Invalid block size')
  let res_num = new BigNumber(0)
  let order = new BigNumber(1)
  for (let i = data.length - 1; i >= 0; i--) {
    let digit = alphabet.indexOf(data[i])
    if (digit < 0) throw Error('Invalid symbol')
    let product = order.times(digit).plus(res_num)
    // if product > UINT64_MAX
    if (product.comparedTo(UINT64_MAX) === 1) throw Error('Overflow')
    res_num = product
    order = order.times(alphabet_size)
  }
  if (res_size < full_block_size && new BigNumber(2).pow(8 * res_size).comparedTo(res_num) <= 0) throw Error('Overflow 2')
  buf.set(uint64_to_8be(res_num, res_size), index)
  return buf
}

const decode = (str: string) => {
  const bin = hex2bin(str)
  if (bin.length === 0) return ''
  const full_block_count = Math.floor(bin.length / full_encoded_block_size)
  const last_block_size = bin.length % full_encoded_block_size
  const last_block_decoded_size = encoded_block_sizes.indexOf(last_block_size)
  if (last_block_decoded_size < 0) throw Error('Invalid encoded length')
  const data_size = full_block_count * full_block_size + last_block_decoded_size
  let data = new Uint8Array(data_size)
  for (let i = 0; i < full_block_count; i++) {
    data = decode_block(
      bin.subarray(
        i * full_encoded_block_size,
        i * full_encoded_block_size + full_encoded_block_size
      ),
      data,
      i * full_block_size
    )
  }
  if (last_block_size > 0) {
    data = decode_block(
      bin.subarray(
        full_block_count * full_encoded_block_size,
        full_block_count * full_encoded_block_size + last_block_size
      ),
      data,
      full_block_count * full_block_size
    )
  }
  return bin2hex(data)
}

export default {
  decode
}
