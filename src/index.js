const ethUtil = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');

async function encrypt(data) {
  const accounts = await wallet.request({
    method: 'eth_accounts',
    params: [],
  });
  console.log(accounts);
  const publicKey = await wallet.request({
    method: 'eth_getEncryptionPublicKey',
    params: [accounts[0]], // you must have access to the specified account
  });
  console.log(publicKey);
  const encryptedMessage = ethUtil.bufferToHex(
    Buffer.from(
      JSON.stringify(
        sigUtil.encrypt({
          publicKey,
          data,
          version: 'x25519-xsalsa20-poly1305',
        }),
      ),
      'utf8',
    ),
  );
  console.log(encryptedMessage);
  return encryptedMessage;
}

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'hello':
      return await encrypt('hello world!');
    default:
      throw new Error('Method not found.');
  }
});
