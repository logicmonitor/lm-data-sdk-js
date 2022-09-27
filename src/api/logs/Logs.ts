import {Mutex, MutexInterface} from 'async-mutex';
import makeRequest from '../../utils/MakeRequest'
import Config from '../../config';

export class Log {
    private readonly config: Config;
    private requestCount: number;
    private rateLimitInitTime!: number;
    private readonly oneMinute: number = 60000;
    readonly resourcePath = "/log/ingest";
    readonly mutex:MutexInterface;

    private logBatch = [] as any;
    ticker: () => void;
    tickerID: NodeJS.Timer | null;

    constructor(options: any) {
     
        this.config = new Config(options, 'logs')

        this.requestCount = 0;
        this.tickerID = null;
        this.ticker = () => {
            this.tickerID = setInterval(() => {
                this.sendLogs();
            }, this.config.interval * 1000);
        }

        this.mutex = new Mutex();
    }

    public SendLogs(logMessage:string, resourceIdMap?:{}, metaData?:{}) {

        let log = {
            msg: logMessage,
            '_lm.resourceId': resourceIdMap,
            ...metaData
        }
        if(this.config.batch) {
            this.addRequestToBatch(log);
        } else {
            this.logBatch.push(log);
            this.sendLogs();
        }

    }

    private async sendLogs() {

        if(this.config.batch && this.logBatch.length == 0) {
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

          //check rate limit
          if(this.requestCount === 0 || Date.now() - this.rateLimitInitTime > this.oneMinute){
            this.requestCount = 1;
            this.rateLimitInitTime = Date.now();
        } else if(Date.now() - this.rateLimitInitTime <= this.oneMinute && this.requestCount > this.config.rateLimitPerMinute){
            throw new Error('The number of requests exceeds the rate limit');
        } else{
            this.requestCount += 1;
        }
        const response = await makeRequest({
            method: 'POST',
            url: this.config.url,
            resourcePath: this.resourcePath,
            body: body,
            accessId: this.config.accessID,
            accessKey: this.config.accessKey,
            gzip: this.config.gzip
        });

        console.log("Response: ", response);

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