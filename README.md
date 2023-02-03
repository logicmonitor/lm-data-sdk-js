# LogicMonitor JS Data SDK

LogicMonitor JS Data SDK is suitable for ingesting the metrics and logs into the LogicMonitor Platform.

## Overview
LogicMonitor's Push Metrics feature allows you to send metrics directly to the LogicMonitor platform via a dedicated API, removing the need to route the data through a LogicMonitor Collector. Once ingested, these metrics are presented alongside all other metrics gathered via LogicMonitor, providing a single pane of glass for metric monitoring and alerting.

Similarly, If a log integration isn’t available or you have custom logs that you want to analyze, you can send the logs directly to your LogicMonitor account via the logs ingestion API.

## Quick Start Notes:

### Set Configurations
While using LMv1 authentication set LM_ACCESS_ID and LM_ACCESS_KEY properties.
In case of BearerToken authentication set LM_BEARER_TOKEN property. 
Company's name or Account name must be passed to LM_ACCOUNT property. 
All properties can be set using environment variable.

| Environment variable |	Description |
| -------------------- |:--------------:|
|   LM_ACCOUNT         |	Account name (Company Name) is your organization name |
|   LM_ACCESS_ID       |	Access id while using LMv1 authentication.|
|   LM_ACCESS_KEY      |	Access key while using LMv1 authentication.|
|   LM_BEARER_TOKEN    |	BearerToken while using Bearer authentication.|

### Batching

By default, batching is disabled.
If enabled, the default batch time is 10s.
### Logs

    import {Log} from  '@logicmonitor-official/lm-data-sdk-js';
    let log =  new  Log(true, 10); // Instantiate Logger with barching enabled and batching interval 10s
    log.SendLogs(
	    'Log Message',
	    {
	        'system.displayname' : 'example-currency-service',
	    }
	)

### Metrics

    import {Metrics} from '@logicmonitor-official/lm-data-sdk-js';
    //instantiate Metrics with batching enabled and bathing time set to 10s
    let metric = new Metrics(true, 10);

    // Build the Resource
    let resource = new ResourceBuilder()
                .setResourceName('LmExporterSDKTest_71799')
                .setResourceIds({
                    'system.displayname': 'LmExporterSDKTest_71799'
                })
                .build();
    // Build DataSource
    let dS1 = new DataSourceBuilder()
                        .setDataSource('JsSDK')
                        .setDataSourceDisplayName('JsSDK')
                        .setDataSourceGroup('Sdk')
                        .build();
    
    // Build Second DataSource
    let dS2 = new DataSourceBuilder()
        .setDataSource('MetricJsSDK')
        .setDataSourceDisplayName('MetricJsSDK')
        .setDataSourceGroup('Sdk')
        .build();

    // Build Instance
    let i1 = new InstanceBuilder()
                .setInstanceName('DataSDK')
                .setInstanceDisplayName('DataSDK')
                .setInstanceProperties(
                    {
                        'test': 'dataSDK'
                    }
                )
                .build();
    
    //Build second Instance
    let i2 = new InstanceBuilder()
    .setInstanceName('MetricDataSDK')
    .setInstanceDisplayName('MetricDataSDK')
    .setInstanceProperties(
    {
        'test': 'dataSDK'
    }
    )
    .build();
            
    // Build DataPoint
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

    //Build second DataPoint
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

    // Send metrics in various combinations.
    metric.SendMetrics(resource,dS1,i1,dP1)
    metric.SendMetrics(resource,dS1,i1,dP2)
    metric.SendMetrics(resource,dS1,i2,dP1)
    metric.SendMetrics(resource,dS1,i2,dP2)

    metric.SendMetrics(resource,dS2,i1,dP1)
    metric.SendMetrics(resource,dS2,i1,dP2)
    metric.SendMetrics(resource,dS2,i2,dP1)
    metric.SendMetrics(resource,dS2,i2,dP2)

Copyright, 2022, LogicMonitor, Inc.

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.