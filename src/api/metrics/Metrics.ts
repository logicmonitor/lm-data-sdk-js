import {Mutex, MutexInterface} from 'async-mutex';
var hash = require('object-hash');
import makeRequest from '../../utils/MakeRequest'
import Config from '../../config';
import {validate} from '../../validators/Validator';

export class Metrics{
    private readonly config: Config;
    private requestCount: number;
    private rateLimitInitTime!: number;
    private readonly oneMinute: number = 60000;
    private readonly resourcePath = "/v2/metric/ingest";
    private readonly mutex:MutexInterface;

    private metricBatch = [] as any;
    ticker: () => void;
    tickerID: NodeJS.Timer | null;

    constructor(options: any) {
        
        this.config = new Config(options, 'metrics')

        this.requestCount = 0;
        this.tickerID = null;
        this.ticker = () => {
            this.tickerID = setInterval(() => {
                this.exportData();
            }, this.config.interval * 1000);
        }

        this.mutex = new Mutex();
    }

    public async SendMetrics(resourceInput: any, dataSourceInput: any, instanceInput: any, dataPointInput: any) {


        //validate the inputs here
        let errorMsg = await validate(resourceInput, dataSourceInput, instanceInput, dataPointInput);
        if(errorMsg != ''){
            console.log("Validation failed");
            throw new Error('Validation failed: '+ errorMsg)
        }


        let input = await this.createSingleMetricPayload(resourceInput, dataSourceInput, instanceInput, dataPointInput);
        

        
        if(this.config.batch) {
            this.addRequestToBatch(input);
        } else {
            this.metricBatch.push(input);
            this.exportData();
        }

    }

    private async createSingleMetricPayload(resourceInput: any, dataSourceInput: any, instanceInput: any, dataPointInput: any) {

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

        if(this.config.batch && this.metricBatch.length == 0) {
            if(this.tickerID) {
                clearInterval(this.tickerID);
                this.tickerID = null;
            }
            return;
        }

        let body = "";
        let localMetricBatch;
        if(this.config.batch) {
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
            bearerToken: this.config.bearerToken,
            gzip: this.config.gzip
        });
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



}

