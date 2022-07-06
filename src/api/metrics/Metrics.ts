const fetch = require('node-fetch');
import {Mutex, MutexInterface} from 'async-mutex';
var crypto = require('crypto');
var hash = require('object-hash');
import { gzip } from 'node-gzip';

export class Metrics{
    public company:string;
    public accessID:string;
    public accessKey:string;
    private readonly PATH = "/v2/metric/ingest";
    private readonly METHOD = "POST";
    private readonly metricIngestUrl: string;
    private readonly batch: boolean;
    private readonly interval: number;
    private readonly mutex:MutexInterface;

    private metricBatch = [] as any;
    ticker: () => void;
    tickerID: NodeJS.Timer | null;

    constructor(batch = false, interval = 1) {
        this.company = process.env.LM_COMPANY!;
        this.accessID = process.env.LM_ACCESS_ID!;
        this.accessKey = process.env.LM_ACCESS_KEY!;
        this.metricIngestUrl = `https://${this.company}.logicmonitor.com/rest/v2/metric/ingest`;

        // if batch is true interval should not be 0
        if(batch && interval == 0) {
            throw new Error('Interval must be greater than 0 when batching is enabled');
        }

        this.batch = batch;
        this.interval = interval;
        this.tickerID = null;
        this.ticker = () => {
            this.tickerID = setInterval(() => {
                this.exportData();
            }, this.interval * 1000);
        }

        this.mutex = new Mutex();
    }

    public async SendMetrics(resourceInput: any, dataSourceInput: any, instanceInput: any, dataPointInput: any) {


        //validate the inputs here
        let input = await this.createSingleMetricPayload(resourceInput, dataSourceInput, instanceInput, dataPointInput);
        
        console.log("Payload: ", JSON.stringify(input));

        
        if(this.batch) {
            // console.log("Implement this.addRequestToBatch(log);");
            this.addRequestToBatch(input);
        } else {
            this.metricBatch.push(input);
            this.exportData();
        }

    }

    private async createSingleMetricPayload(resourceInput: any, dataSourceInput: any, instanceInput: any, dataPointInput: any) {
        console.log("Creating payload");

        let instance = {
            ...instanceInput
        }
        instance.dataPoints = [dataPointInput]
        let metric = {
            ...resourceInput,
            ...dataSourceInput,
        }
        metric.instances = [instance];

        return metric;
        
    }

    private async addRequestToBatch(input: any){

        const release = await this.mutex.acquire();
        try{
            this.metricBatch.push(input);
            if(!this.tickerID) {
                this.ticker();
            }
        } finally {
            release();
        }

    }

    private async exportData() {

        if(this.batch && this.metricBatch.length == 0) {
            if(this.tickerID) {
                clearInterval(this.tickerID);
                this.tickerID = null;
            }
            return;
        }

        let body = "";
        let localMetricBatch;
        if(this.batch) {
            const release = await this.mutex.acquire();
            try{
                localMetricBatch = this.metricBatch
                this.metricBatch = [];
            } finally{
                release();
            }
            let payload = await this.mergeMetrics(localMetricBatch);
            body = JSON.stringify(payload);
        } else{
            localMetricBatch = this.metricBatch
            body = JSON.stringify(localMetricBatch);
            this.metricBatch = [];
        }


        let lmV1Token = this.getLmV1Token(body);
        console.log("LMV1 Token: " + lmV1Token);
        console.log("Body: ", body)
        const compressedBody = await gzip(body);
        //console.log("Compressed body: ", compressedBody.toString)
        const response = await fetch(this.metricIngestUrl, {
            method: this.METHOD,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': lmV1Token,
                'Content-Encoding': 'gzip',
            },
            body: compressedBody
        });
        // 'Content-Encoding': 'gzip',
        console.log("Response: ", await response.json())


    }
    private async mergeMetrics(metricsBatch: any){

        let rdsMap: any = {}
        for (let x in metricsBatch) {
            let metric = metricsBatch[x];
            let {instances, ...rds} = metric;
            let rdsHash = hash(rds);
            console.log("rdsHash: ",rdsHash)
            if(!(rdsHash in rdsMap)) {
                rdsMap[rdsHash] = {...rds,
                instances: {}
                };
                for( let y in metric.instances) {
                    let instance = metric.instances[y];
                    let {dataPoints, ...insID} = instance
                    let instanceHash = hash(insID)
                    console.log("Instance hash: ", instanceHash)
                    if(!(instanceHash in rdsMap[rdsHash].instances)) {
        
                        rdsMap[rdsHash].instances[instanceHash] = {
                            ...insID,
                            dataPoints: {}
                        }
                        // console.log("*** ", rdsMap[rdsHash].instances[instanceHash] )
                        for(let z in instance.dataPoints) {
                            let dataPoint = instance.dataPoints[z];
                            let {values, ...dpId} = dataPoint;
                            let dpHash = hash(dpId);
        
                            if(!(dpHash in rdsMap[rdsHash].instances[instanceHash].dataPoints)) {
                                rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash] = {
                                    ...dpId,
                                    values: values
                                }
                            } else {
                                rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash] = {
                                    ...dpId,
                                    values: {
                                        ...rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash].values,
                                        ...values
                                    }
                                }
                            }
                        }
        
                    } else {
        
                        for(let z in instance.dataPoints) {
                            let dataPoint = instance.dataPoints[z];
                            let {values, ...dpId} = dataPoint;
                            let dpHash = hash(dpId);
        
                            if(!(dpHash in rdsMap[rdsHash].instances[instanceHash].dataPoints)) {
                                rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash] = {
                                    ...dpId,
                                    values: values
                                }
                            } else {
                                rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash] = {
                                    ...dpId,
                                    values: {
                                        ...rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash].values,
                                        ...values
                                    }
                                }
                            }
                        }
        
                    }
                }
            } else {
        
              console.log("In rds else")
              for( let y in metric.instances) {
                let instance = metric.instances[y];
                let {dataPoints, ...insID} = instance
                let instanceHash = hash(insID)
                console.log("Instance hash: ", instanceHash)
                if(!(instanceHash in rdsMap[rdsHash].instances)) {
        
                    rdsMap[rdsHash].instances[instanceHash] = {
                        ...insID,
                        dataPoints: {}
                    }
                    // console.log("*** ", rdsMap[rdsHash].instances[instanceHash] )
                    for(let z in instance.dataPoints) {
                        let dataPoint = instance.dataPoints[z];
                        let {values, ...dpId} = dataPoint;
                        let dpHash = hash(dpId);
        
                        if(!(dpHash in rdsMap[rdsHash].instances[instanceHash].dataPoints)) {
                            rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash] = {
                                ...dpId,
                                values: values
                            }
                        } else {
                            rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash] = {
                                ...dpId,
                                values: {
                                    ...rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash].values,
                                    ...values
                                }
                            }
                        }
                    }
        
                } else {
        
                    for(let z in instance.dataPoints) {
                        let dataPoint = instance.dataPoints[z];
                        let {values, ...dpId} = dataPoint;
                        let dpHash = hash(dpId);
        
                        if(!(dpHash in rdsMap[rdsHash].instances[instanceHash].dataPoints)) {
                            rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash] = {
                                ...dpId,
                                values: values
                            }
                        } else {
                            rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash] = {
                                ...dpId,
                                values: {
                                    ...rdsMap[rdsHash].instances[instanceHash].dataPoints[dpHash].values,
                                    ...values
                                }
                            }
                        }
                    }
        
                }
            }
            }
        
        }
        console.log("metric Map: ", JSON.stringify(rdsMap));
        console.log("****")
        //make payload array from map
        
        let metricPayload = [];
        
        for( const x in rdsMap) {
        
            let {instances, ...rds} = rdsMap[x];
        
            rds.instances = [];
        
            for( const y in instances) {
                let {dataPoints, ...instance} = instances[y];
                
                instance.dataPoints = [];
        
                for( const z in dataPoints) {
                    instance.dataPoints.push(dataPoints[z])
                }
        
                rds.instances.push(instance)
            }
            metricPayload.push(rds)
        
        }
        return metricPayload;
    }
    private getLmV1Token(body: string) {

        // let timeStamp = Math.floor(Date.now()/1000).toString();
        let timeStamp = Date.now();
        const method = this.METHOD;
        const resourcePath = this.PATH;
        let hmac = crypto.createHmac('sha256', this.accessKey);
        console.log("Access Key: ", this.accessKey)
        console.log("Input to HMAC: ", method + timeStamp + body + resourcePath)
        hmac.update(method + timeStamp + body + resourcePath);
        let hexString = hmac.digest('hex');
        let buffer = Buffer.from(hexString, 'utf8');
        let signature = buffer.toString('base64');

        return 'LMv1 ' + this.accessID + ':' + signature + ':' + timeStamp;
    }



}

