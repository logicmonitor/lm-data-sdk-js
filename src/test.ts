import {Log} from './api/logs/Logs';
import {Metrics} from './api/metrics/Metrics'
import {ResourceBuilder} from './model/Resource'
import {DataSourceBuilder} from './model/DataSource'
import {InstanceBuilder} from './model/Instance'
import {DataPointBuilder} from './model/DataPoint'

let log = new Log(true, 10);
log.SendLogs(
    'This is a test message',
    {
        'system.displayname' : 'LmExporterSDKTest_OTEL_71799',
    }
)
setTimeout(() => {
    log.SendLogs(
        'This is a test message2',
        {
            'system.displayname' : 'LmExporterSDKTest_OTEL_71799',
        }
    )
}, 1000);

setTimeout(() => {
    log.SendLogs(
        'This is a test message3',
        {
            'system.displayname' : 'LmExporterSDKTest_OTEL_71799',
        }
    )
}, 5000);

setTimeout(() => {
    log.SendLogs(
        'This is a test message4',
        {
            'system.displayname' : 'LmExporterSDKTest_OTEL_71799',
        }
    )
}, 15000);

let metric = new Metrics(true, 10);

let resource = new ResourceBuilder()
               .setResourceName('LmExporterSDKTest_OTEL_71799')
               .setResourceIds({
                'system.displayname': 'LmExporterSDKTest_OTEL_71799'
               })
               .build();

let dS1 = new DataSourceBuilder()
                    .setDataSource('JsSDK')
                    .setDataSourceDisplayName('JsSDK')
                    .setDataSourceGroup('Sdk')
                    .build();

let dS2 = new DataSourceBuilder()
    .setDataSource('MetricJsSDK')
    .setDataSourceDisplayName('MetricJsSDK')
    .setDataSourceGroup('Sdk')
    .build();

let i1 = new InstanceBuilder()
               .setInstanceName('DataSDK')
               .setInstanceDisplayName('DataSDK')
               .setInstanceProperties(
                {
                    'test': 'dataSDK'
                }
               )
               .build();
       
let i2 = new InstanceBuilder()
.setInstanceName('MetricDataSDK')
.setInstanceDisplayName('MetricDataSDK')
.setInstanceProperties(
 {
     'test': 'dataSDK'
 }
)
.build();
        

let dP1 = new DataPointBuilder()
                .setDataPointName('cpu')
                .setDataPointDescription('cpu')
                .setDataPointAggregationType('SUM')
                .setDataPointType('COUNTER')
                .build();

dP1.setValue(
    Math.floor(Date.now()/1000).toString(),
    '79'
)
let dP2 = new DataPointBuilder()
                .setDataPointName('mem')
                .setDataPointDescription('mem')
                .setDataPointAggregationType('SUM')
                .setDataPointType('COUNTER')
                .build();

dP2.setValue(
    Math.floor(Date.now()/1000).toString(),
    '100'
)

metric.SendMetrics(resource,dS1,i1,dP1)
metric.SendMetrics(resource,dS1,i1,dP2)
metric.SendMetrics(resource,dS1,i2,dP1)
metric.SendMetrics(resource,dS1,i2,dP2)

metric.SendMetrics(resource,dS2,i1,dP1)
metric.SendMetrics(resource,dS2,i1,dP2)
metric.SendMetrics(resource,dS2,i2,dP1)
metric.SendMetrics(resource,dS2,i2,dP2)
