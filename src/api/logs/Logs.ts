import {Mutex, MutexInterface} from 'async-mutex';
import makeRequest from '../../utils/MakeRequest'


export class Log {
    public company:string;
    public accessID:string;
    public accessKey:string;
    private requestCount: number;
    private rateLimitInitTime!: number;
    private readonly oneMinute: number = 60000;
    readonly resourcePath = "/log/ingest";
    readonly url:string;
    readonly batch:boolean;
    readonly interval:number;
    private readonly rateLimitPerMinute: number;
    readonly mutex:MutexInterface;
    private logBatch = [] as any;
    ticker: () => void;
    tickerID: NodeJS.Timer | null;

    constructor(batch = false, interval = 10, rateLimitPerMinute = 100) {
        this.company = process.env.LM_COMPANY!;
        this.accessID = process.env.LM_ACCESS_ID!;
        this.accessKey = process.env.LM_ACCESS_KEY!;
        this.url = `https://${this.company}.logicmonitor.com/rest`;

        // if batch is true interval should not be 0
        if(batch && interval == 0) {
            throw new Error('Interval must be greater than 0 when batching is enabled');
        }

        this.batch = batch;
        this.interval = interval;
        this.rateLimitPerMinute = rateLimitPerMinute;
        this.requestCount = 0;
        this.tickerID = null;
        this.ticker = () => {
            this.tickerID = setInterval(() => {
                this.sendLogs();
            }, this.interval * 1000);
        }

        this.mutex = new Mutex();
    }

    public SendLogs(logMessage:string, resourceIdMap?:{}, metaData?:{}) {

        let log = {
            msg: logMessage,
            '_lm.resourceId': resourceIdMap,
            ...metaData
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

          //check rate limit
          if(this.requestCount === 0 || Date.now() - this.rateLimitInitTime > this.oneMinute){
            this.requestCount = 1;
            this.rateLimitInitTime = Date.now();
        } else if(Date.now() - this.rateLimitInitTime <= this.oneMinute && this.requestCount > this.rateLimitPerMinute){
            throw new Error('The number of requests exceeds the rate limit');
        } else{
            this.requestCount += 1;
        }
        const response = await makeRequest('POST', this.url, this.resourcePath, body, this.accessID, this.accessKey);

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