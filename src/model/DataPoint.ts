class DataPoint {
    dataPointName!: string;
    dataPointDescription!: string;
    dataPointType: string | undefined;
    dataPointAggregationType: string | undefined;
    percentileValue: number | undefined;
    values: any;

    setValue(epoch_timeStamp: string, value: string) {
        this.values[epoch_timeStamp] = value;
    }
}

export class DataPointBuilder {
    private _dataPoint: DataPoint;

    constructor() {
        this._dataPoint = new DataPoint()
        this._dataPoint.values = {};
    }

    setDataPointName(name: string): DataPointBuilder {
        this._dataPoint.dataPointName = name;
        return this;
    }

    setDataPointDescription(description: string): DataPointBuilder {
        this._dataPoint.dataPointDescription = description;
        return this;
    }

    setDataPointType(type: string): DataPointBuilder {
        this._dataPoint.dataPointType = type;//.toLowerCase();
        return this;
    }

    setDataPointAggregationType(agrtype: string): DataPointBuilder {
        this._dataPoint.dataPointAggregationType = agrtype;//.toLowerCase();
        return this;
    }

    setPercentileValue(percentile: number): DataPointBuilder { 
        this._dataPoint.percentileValue = percentile;
        return this;
    }

    setValues(epoch_timeStamp: string, value: string): DataPointBuilder {
        this._dataPoint.values[epoch_timeStamp] = value;
        return this;
    }

    build(): DataPoint {
        return this._dataPoint;
    }
}