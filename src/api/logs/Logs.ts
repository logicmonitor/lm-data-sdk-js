const fetch = require('node-fetch');
var crypto = require('crypto');
import { gzip } from 'node-gzip';
import {Mutex, MutexInterface} from 'async-mutex';


export class Log {
    public company:string;
    public accessID:string;
    public accessKey:string;
    readonly logIngestUrl:string;
    readonly batch:boolean;
    readonly interval:number;
    readonly mutex:MutexInterface;
    private logBatch = [] as any;
    ticker: () => void;
    tickerID: NodeJS.Timer | null;

    constructor(batch = false, interval = 1) {
        this.company = process.env.LM_COMPANY!;
        this.accessID = process.env.LM_ACCESS_ID!;
        this.accessKey = process.env.LM_ACCESS_KEY!;
        this.logIngestUrl = `https://${this.company}.logicmonitor.com/rest/log/ingest`;

        // if batch is true interval should not be 0
        if(batch && interval == 0) {
            throw new Error('Interval must be greater than 0 when batching is enabled');
        }

        this.batch = batch;
        this.interval = interval;
        this.tickerID = null;
        this.ticker = () => {
            this.tickerID = setInterval(() => {
                this.sendLogs();
            }, this.interval * 1000);
        }

        this.mutex = new Mutex();
    }

    public SendLogs(logMessage:string, resourceIdMap?:{}) {

        let log = {
            msg: logMessage,
            '_lm.resourceId': resourceIdMap
        }
        if(this.batch) {
            this.addRequestToBatch(log);
        } else {
            this.logBatch.push(log);
            this.sendLogs();
        }

    }

    private async sendLogs() {

        if(this.batch && this.logBatch.length == 0) {
            if(this.tickerID) {
                clearInterval(this.tickerID);
                this.tickerID = null;
            }
            return;
        }
        
        const release = await this.mutex.acquire();
        let body = "";
        try{
            body = JSON.stringify(this.logBatch);
            this.logBatch = [];
        }   finally {
            release();
        }

        let lmV1Token = this.getLmV1Token(body);
        console.log("LMV1 Token: " + lmV1Token);
        console.log("Body: ", body)
        const compressedBody = await gzip(body);
        //console.log("Compressed body: ", compressedBody.toString)
        const response = await fetch(this.logIngestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip',
                'Authorization': lmV1Token,
            },
            body: compressedBody
        });

        console.log("Response: ", response);

    }

    private getLmV1Token(body: string) {

        let timeStamp = Date.now();
        const method = 'POST';
        const resourcePath = '/log/ingest';

        let hmac = crypto.createHmac('sha256', this.accessKey);
        hmac.update(method + timeStamp + body + resourcePath);
        let hexString = hmac.digest('hex');
        let buffer = Buffer.from(hexString, 'utf8');
        let signature = buffer.toString('base64');

        return 'LMv1 ' + this.accessID + ':' + signature + ':' + timeStamp;
    }

    private async addRequestToBatch(log:any) {
  
        const release = await this.mutex.acquire();
        try{
            this.logBatch.push(log);
            if(!this.tickerID) {
                this.ticker();
            }
        } finally {
            release();
        }

    }

}

// export const log = new Log();