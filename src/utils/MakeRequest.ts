const fetch = require('node-fetch');
const fs = require('fs').promises;
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
async function buildUserAgent(){
    const json = await fs.readFile("../../package.json");
    const userAgent = json.name + '/' + json.version + ';' + 'node:' + process.version + ';' + process.platform + ';' + process.arch + ';';
    return userAgent;
}
async function makeRequest(options: any) {
    let authToken;
    let payload = options.body;
    let _encoding : any= {};

    if(options.gzip){
        _encoding['Content-Encoding'] = 'gzip';
        const compressedBody = await gzip(options.body);
        payload = compressedBody
    }
    
    if(options.resourcePath.includes('metric') && options.bearerToken != ''){
        authToken = 'Bearer ' + options.bearerToken;
    } else {
        authToken = getLmV1Token(options.method, options.body, options.resourcePath, options.accessId, options.accessKey)
    }
    
    const _url = options.url + options.resourcePath;
    const userAgent = await buildUserAgent()
    const response = await fetch(_url, {
        method: options.method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
            'User-Agent': userAgent,
            ..._encoding
        },
        body: payload
    });
    
    return response;

}

export default makeRequest;