const fetch = require('node-fetch');
var crypto = require('crypto');
import { gzip } from 'node-gzip';



function getLmV1Token(method: string, body: string, resourcePath: string, accessID: string, accessKey: string): string {

    let timeStamp = Date.now();

    let hmac = crypto.createHmac('sha256', accessKey);
    hmac.update(method + timeStamp + body + resourcePath);
    let hexString = hmac.digest('hex');
    let buffer = Buffer.from(hexString, 'utf8');
    let signature = buffer.toString('base64');

    return 'LMv1 ' + accessID + ':' + signature + ':' + timeStamp;
}

async function makeRequest(method: string, url: string, resourcePath:string, body: string, accessId: string, accessKey: string) {

    const compressedBody = await gzip(body);
    const lmV1Token = getLmV1Token(method, body, resourcePath, accessId, accessKey)
    console.log("LMV1 Token: " + lmV1Token);
    const _url = url + resourcePath;
    const response = await fetch(_url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip',
            'Authorization': lmV1Token,
        },
        body: compressedBody
    });
    
    return response;

}

export default makeRequest;