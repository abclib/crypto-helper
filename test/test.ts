import test, { ExecutionContext } from 'ava';
import CryptoHelper from '../dist/index'

const CryptoTest = (t: ExecutionContext, type: string, input: any[], expected: string) => {
  t.is(CryptoHelper[type](...input), expected);
}

test('hex > sha256', CryptoTest, 'sha256', ['3c02d09261603fa859e5c9e3019431a92244fb6da6', 'hex'], 'f840ef9d2b3baedbbd1e475954bb86b9ead50724cf8940ec1c656d91bf36ad64')
test('hex > keccak256', CryptoTest, 'keccak256', ['02fcd51aabb814fffe17908fbc888a8975d839a5', 'hex'], 'bcbac66ea35e937306a794886c3364448e1fccf21c1556a43fd6bd28aa869e37')
test('hex > blake256', CryptoTest, 'blake256', ['073f98903417b024ae0bbcb4c4d0013512c279be5d58', 'hex'], 'fff0d1eba33595bf4adc05db5ec05179a5e69d539ffc9ab972b43254b438cf6f')
test('hex > blake2b', CryptoTest, 'blake2b', ['346c17021a2ee997449e0e3ab0032b0fae7b12deaa7c3bd7a034aeac160c8825', 5, 'hex'], 'dbcda8090f')

test('utf8 > sha256', CryptoTest, 'sha256', ['3c02d09261603fa859e5c9e3019431a92244fb6da6'], '76a421d5f9764c37fc28d5e9e0bb4fed0318fd0d77566349fe87701a5608fb39')
test('utf8 > keccak256', CryptoTest, 'keccak256', ['02fcd51aabb814fffe17908fbc888a8975d839a5'], '82905c02334d90b882fd19b512d2bc26ee09035780683c91629c8026816cd23c')
test('utf8 > blake256', CryptoTest, 'blake256', ['073f98903417b024ae0bbcb4c4d0013512c279be5d58'], 'b277eee1c9cb5c150870867fca4d8c81191b53709c23a9c7336349f7f6e9034d')
test('utf8 > blake2b', CryptoTest, 'blake2b', ['346c17021a2ee997449e0e3ab0032b0fae7b12deaa7c3bd7a034aeac160c8825', 5], '4f82d10ebb')

test('checksum > sha256', CryptoTest, 'checksum', ['3c0de8325856053b83a3be2c6028aff2e1fa5aa6f9', 'sha256'], '4f496926')
test('checksum > blake256', CryptoTest, 'checksum', ['0f21592183602dd04505784d35a44b2abca335d10c59', 'blake256'], '5265d326')
test('checksum > keccak256', CryptoTest, 'checksum', ['1200da825e55d03d6ab445f9dfc2faa744f39bda4aeb6ee07e6f81a17d8dc4d470187049d4ca00b2fd6642c8da50757711e1601a965ace2dbc06f8673dad1bc7bf', 'keccak256'], '478234aa')

test(`base58().decode()`, t => {
  t.is(CryptoHelper.base58('RAYj2KKVUohTu3hVdNJ4U6hQi7TNawpacH').decode(), '3c0de8325856053b83a3be2c6028aff2e1fa5aa6f9b07d423a')
})

test(`base58().decode('xmr')`, t => {
  t.is(CryptoHelper.base58('41ez4ahijjAJrAXpJERmGaCXvBKmdFPs5N9aqeMaZVvKKkU41Sp21GMjPHwntt97ca3zToDFXRykpYT6nCSV5gTgNafYPsf').decode('xmr'), '1200da825e55d03d6ab445f9dfc2faa744f39bda4aeb6ee07e6f81a17d8dc4d470187049d4ca00b2fd6642c8da50757711e1601a965ace2dbc06f8673dad1bc7bf478234aa')
})

test(`segwit().decode()`, t => {
  t.deepEqual(CryptoHelper.segwit('bc', 'BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4').decode(), { ver: 0, pro: [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214] })
})

test(`segwit().encode()`, t => {
  console.log(CryptoHelper.segwit('bc', 0, [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214]).encode())
  t.is(CryptoHelper.segwit('bc', 0, [117, 30, 118, 232, 25, 145, 150, 212, 84, 148, 28, 69, 209, 179, 163, 35, 241, 67, 59, 214]).encode(), 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
})
