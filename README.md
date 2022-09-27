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


Copyright, 2022, LogicMonitor, Inc.

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.