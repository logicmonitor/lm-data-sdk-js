export default class Config {
    public readonly company: string;
    public readonly accessID:string;
    public readonly accessKey:string;
    public readonly bearerToken:string;
    public readonly url: string;
    public readonly signalType: string
    public readonly batch: boolean;
    public readonly gzip: boolean;
    public readonly interval: number;
    public readonly rateLimitPerMinute: number;

    constructor(options: any, signalType: string){
        
        this.signalType = signalType;
        let errorMsg = '';

        this.company = '';
        if(typeof options.company == 'string'){
            this.company = options.company;
        } else {
            if(process.env.LM_COMPANY !== undefined){
                this.company = process.env.LM_COMPANY!;
            }
        }
        if(this.company == ''){
            console.log('Company name must be defined.')
            errorMsg += 'Company name must be defined. \n';
        }

        this.url = `https://${this.company}.logicmonitor.com/rest`;

        this.accessID = '';
        if(typeof options.accessID == 'string'){
            this.accessID = options.accessID;
        } else {
            if(process.env.LM_ACCESS_ID !== undefined){
                this.accessID = process.env.LM_ACCESS_ID!;
            }
        }
        this.accessKey = '';
        if(typeof options.accessKey == 'string'){
            this.accessKey = options.accessKey;
        } else {
            if(process.env.LM_ACCESS_KEY !== undefined){
                this.accessKey = process.env.LM_ACCESS_KEY!;
            }
        }
        this.bearerToken = '';
        if(typeof options.bearerToken == 'string'){
            this.bearerToken = options.bearerToken;
        } else {
            if(process.env.LM_BEARER_TOKEN !== undefined){
                this.bearerToken = process.env.LM_BEARER_TOKEN!;
            }
        }
        if(this.signalType == 'logs' && this.accessID == '' && this.accessKey == ''){
            errorMsg += 'For logs accessID & accessKey both must be defined.\n';
        }
        if((this.accessID == '' && this.accessKey != '') || (this.accessID != '' && this.accessKey =='')){
            errorMsg+='If using accessID & accessKey, both must be defined.\n';
        }
        if(this.accessID == '' && this.accessKey == '' && this.bearerToken == '') {
            errorMsg += 'Either accessID/accessKey paid or Bearer Token must be defined.\n';
        }


        if(options.batch && options.interval == 0) {
            errorMsg += 'Interval must be greater than 0 when batching is enabled.\n';
        }

        if(typeof options.batch != 'boolean'){
            options.batch = false
        }
        if(typeof options.interval != 'number'){
            options.interval = 10
        }
        if(typeof options.rateLimitPerMinute != 'number'){
            options.rateLimitPerMinute = 100
        }
        if(typeof options.gzip != 'boolean'){
            options.gzip = true;
        }
        if (typeof options.batch != 'boolean') {
            this.batch = false;
        } else {
            this.batch = options.batch
        }
        if (typeof options.interval != 'number') {
            this.interval = 10;
        } else {
            this.interval = options.interval
        }
        if (typeof options.rateLimitPerMinute != 'number') {
            this.rateLimitPerMinute = 100;
        } else {
            this.rateLimitPerMinute = options.rateLimitPerMinute
        }
        if (typeof options.gzip != 'boolean') {
            this.gzip = true;
        } else {
            this.gzip = options.gzip
        }

        if(errorMsg != ''){
            throw new Error(errorMsg);
        }
    }
}