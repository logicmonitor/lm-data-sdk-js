import { passEmptyAndSpellCheck } from './Validator'

const REGEX_DATA_POINT = /^[a-zA-Z_0-9]+$/

export async function validateDataPoint(dp: any) {

    let errMsg = "";

    if(dp){
        errMsg += checkDataPointNameValidation(dp.dataPointName);

        if (dp.dataPointDescription && dp.dataPointDescription != '') {
            errMsg += checkDataPointDescriptionValidation(dp.dataPointDescription)
        }

        if (dp.dataPointAggregationType && dp.dataPointAggregationType != '') {
            errMsg += checkDataPointAggregationTypeValidation(dp.dataPointAggregationType);
        }

        if (dp.dataPointType && dp.dataPointType != '') {
            errMsg += checkDataPointTypeValidation(dp.dataPointType);
        }
    } else {
        errMsg += 'DataPoint must be defined. ';
    }




    return errMsg;
}

function checkDataPointNameValidation(dataPointName: string): string {

    let errMsg = "";

    if (dataPointName == "" || dataPointName == undefined) {
        errMsg += 'DataPoint name is mandatory '
    } else {
        if (passEmptyAndSpellCheck(dataPointName)) {
            errMsg += 'Datapoint Name Should not be empty or have tailing spaces. '
        }
        if(dataPointName.length > 128) {
            errMsg += 'Datapoint Name size should not be greater than 128 characters. '
        }
        errMsg += validateDpName(dataPointName)

    }
    return errMsg;
}

function validateDpName(name: string): string {
    let errorDpMsg = "";
	let invalidDataPointNameSet = [
		"SIN",
		"COS",
		"LOG",
		"EXP",
		"FLOOR",
		"CEIL",
		"ROUND",
		"POW",
		"ABS",
		"SQRT",
		"RANDOM",
		"LT",
		"LE",
		"GT",
		"GE",
		"EQ",
		"NE",
		"IF",
		"MIN",
		"MAX",
		"LIMIT",
		"DUP",
		"EXC",
		"POP",
		"UN",
		"UNKN",
		"NOW",
		"TIME",
		"PI",
		"E",
		"AND",
		"OR",
		"XOR",
		"INF",
		"NEGINF",
		"STEP",
		"YEAR",
		"MONTH",
		"DATE",
		"HOUR",
		"MINUTE",
		"SECOND",
		"WEEK",
		"SIGN",
		"RND",
		"SUM2",
		"AVG2",
		"PERCENT",
		"RAWPERCENTILE",
		"IN",
		"NANTOZERO",
		"MIN2",
		"MAX2",
    ];

    if(!(REGEX_DATA_POINT.test(name))) {
        errorDpMsg += 'Invalid Datapoint name ' + name + ' ';
    }

    let flag = false;

    invalidDataPointNameSet.forEach(element => {
        if(name===element) {
            flag = true;
        }
    });

    if(flag) {
        errorDpMsg += name + ' is a keyword and cannot be used as datapoint name.'
    }

    return errorDpMsg;
}

function checkDataPointDescriptionValidation(description: string): string {
    let errorDpMsg = '';

    if(description.length > 1024){
        errorDpMsg += 'Datapoint description should not be greater than 1024 characters. ';
    }

    return errorDpMsg;
}

function checkDataPointAggregationTypeValidation(agrType: string): string {
    let errorDpMsg = '';

    let flag = false;
    let validAggregationDatapointType  = ["none", "avg", "sum", "percentile"];

    validAggregationDatapointType.forEach(element => {
        if(agrType.toLowerCase() === element) {
            flag = true;
        }
    });

    if(!flag) {
        errorDpMsg += 'The datapoint aggregation type is having invalid datapoint aggregation type: ' + agrType + ' ';
    }

    return errorDpMsg;
}

function checkDataPointTypeValidation(dpType: string): string {
    let errorDpMsg = '';
    let flag = false;
    let validDatapointType = ["gauge", "counter", "derive"];

    validDatapointType.forEach(element => {
        if(dpType.toLowerCase() === element) {
            flag = true;
        }
    });

    if (!flag) {
        errorDpMsg += 'The datapoint type is having invalid dataPointType :' + dpType + ' ';
    }

    return errorDpMsg;
}