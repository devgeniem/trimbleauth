const { Int64BE } = require('int64-buffer');
const crypto = require('crypto');

const uri = '/api/v1/attachments';
const method = 'POST';
const SECRET = 'YOURSECRET'; //replace this
const trimbleApplicationKey = 123456789; //replace api key here

// create ticks value
const ticks = new Date().getTime() * 10000 + 621355968000000000;
const tickBytes = new Int64BE(ticks).toBuffer();
const tickBytesB64 = tickBytes.toString('base64');

// create nonce value using crypto
const nonceBytes = crypto.randomBytes(8);
const nonceBytesB64 = nonceBytes.toString('base64');

// combine ticks and nonce
const content = Buffer.alloc(16);
tickBytes.copy(content, 0);
nonceBytes.copy(content, 8);

console.log('contentbuf value (bytes):', content);

// create value to sign
const postfixStr = `\n${method}\n${uri}`;
const postfix = Buffer.from(postfixStr);
let signature = `${content.toString('base64')}${postfix.toString('base64')}`;
console.log('signature str:', signature);

signature = crypto.createHmac('sha1', SECRET).update(signature).digest('base64');

console.log('signature', content, '->', signature);
console.log('tics', ticks, '->', tickBytes, 'base64:', tickBytesB64);
console.log('nonce', nonceBytes, 'base64:', nonceBytesB64);

const Authorization = `AIS aisv1:${trimbleApplicationKey.value}:${tickBytesB64}:${nonceBytesB64}:${signature}`;

console.log('RESULT-------------------');
console.log(Authorization);
