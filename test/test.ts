import CryptoHelper from '../src/index'

test(`sha256('hex')`, () => {
  const res = CryptoHelper.sha256('3c02d09261603fa859e5c9e3019431a92244fb6da6', 'hex')
  expect(res).toBe('f840ef9d2b3baedbbd1e475954bb86b9ead50724cf8940ec1c656d91bf36ad64')
})

test(`sha256('utf8')`, () => {
  const res = CryptoHelper.sha256('3c02d09261603fa859e5c9e3019431a92244fb6da6')
  expect(res).toBe('76a421d5f9764c37fc28d5e9e0bb4fed0318fd0d77566349fe87701a5608fb39')
})

test(`blake256('hex')`, () => {
  const res = CryptoHelper.blake256('073f98903417b024ae0bbcb4c4d0013512c279be5d58', 'hex')
  expect(res).toBe('fff0d1eba33595bf4adc05db5ec05179a5e69d539ffc9ab972b43254b438cf6f')
})

test(`blake256('utf8')`, () => {
  const res = CryptoHelper.blake256('073f98903417b024ae0bbcb4c4d0013512c279be5d58')
  expect(res).toBe('b277eee1c9cb5c150870867fca4d8c81191b53709c23a9c7336349f7f6e9034d')
})

test(`keccak256('hex')`, () => {
  const res = CryptoHelper.keccak256('02fcd51aabb814fffe17908fbc888a8975d839a5', 'hex')
  expect(res).toBe('bcbac66ea35e937306a794886c3364448e1fccf21c1556a43fd6bd28aa869e37')
})

test(`keccak256('utf8)`, () => {
  const res = CryptoHelper.keccak256('02fcd51aabb814fffe17908fbc888a8975d839a5')
  expect(res).toBe('82905c02334d90b882fd19b512d2bc26ee09035780683c91629c8026816cd23c')
})

test(`blake2b('hex')`, () => {
  const res = CryptoHelper.blake2b('346c17021a2ee997449e0e3ab0032b0fae7b12deaa7c3bd7a034aeac160c8825', 5, 'hex')
  expect(res).toBe('dbcda8090f')
})

test(`blake2b('utf8')`, () => {
  const res = CryptoHelper.blake2b('346c17021a2ee997449e0e3ab0032b0fae7b12deaa7c3bd7a034aeac160c8825', 5)
  expect(res).toBe('4f82d10ebb')
})

test(`base58decode`, () => {
  const res = CryptoHelper.base58Decode('RAYj2KKVUohTu3hVdNJ4U6hQi7TNawpacH')
  expect(res).toBe('3c0de8325856053b83a3be2c6028aff2e1fa5aa6f9b07d423a')
})

test(`bech32Decode`, () => {
  const res = CryptoHelper.bech32Decode('vtc1qh9y09s2crkp63mk26u3vrq9q4w3h8ee8gepjgw')
  const received = { prefix: 'vtc', words: [0, 23, 5, 4, 15, 5, 16, 10, 24, 3, 22, 1, 26, 17, 27, 22, 10, 26, 28, 17, 12, 3, 0, 5, 0, 21, 14, 17, 23, 7, 25, 25, 7] }
  expect(res).toEqual(received)
})

test(`checksum('sha256')`, () => {
  const res = CryptoHelper.checkSum('3c0de8325856053b83a3be2c6028aff2e1fa5aa6f9', 'sha256')
  expect(res).toBe('4f496926')
})

test(`checksum('blake256')`, () => {
  const res = CryptoHelper.checkSum('0f21592183602dd04505784d35a44b2abca335d10c59', 'blake256')
  expect(res).toBe('5265d326')
})

test(`checkSum('keccak256')`, () => {
  const res = CryptoHelper.checkSum('1200da825e55d03d6ab445f9dfc2faa744f39bda4aeb6ee07e6f81a17d8dc4d470187049d4ca00b2fd6642c8da50757711e1601a965ace2dbc06f8673dad1bc7bf', 'keccak256')
  expect(res).toBe('478234aa')
})
