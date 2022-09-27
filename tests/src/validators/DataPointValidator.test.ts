import { validateDataPoint } from '../../../src/validators/DataPointValidator';
import { dpName, validAggregationDatapointType, invalidDataPointNameSet, validDatapointType } from './testData/dataPoint';
import * as randomString from 'randomstring';

describe('DataPointValidator', () => {
    it('should be defined', () => {
        expect(validateDataPoint).toBeDefined();
    });

    it('should validate data point name', async () => {


        let undefinedDataPoint;
        
        let errorMsg = await validateDataPoint(undefinedDataPoint);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('DataPoint must be defined. ');


        const emptyDataPointName = {
            dataPointName: dpName.empty
        };
        errorMsg = await validateDataPoint(emptyDataPointName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('DataPoint must be defined. ');


        const trailingSpaceDataPointName = {
            dataPointName: dpName.trailingSpace
        };
        errorMsg = await validateDataPoint(trailingSpaceDataPointName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datapoint Name Should not be empty or have tailing spaces. '+'Invalid Datapoint name \'' + trailingSpaceDataPointName.dataPointName + '\' ');

        const leadingSpaceDataPointName = {
            dataPointName: dpName.leadingSpace
        };
        errorMsg = await validateDataPoint(leadingSpaceDataPointName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datapoint Name Should not be empty or have tailing spaces. '+'Invalid Datapoint name \'' + leadingSpaceDataPointName.dataPointName + '\' ');

        const leadingAndTrailingSpaceDataPointName = {
            dataPointName: dpName.leadingAndTrailingSpace
        };
        errorMsg = await validateDataPoint(leadingAndTrailingSpaceDataPointName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datapoint Name Should not be empty or have tailing spaces. '+'Invalid Datapoint name \'' + leadingAndTrailingSpaceDataPointName.dataPointName + '\' ');

        const invalidCharacters = {
            dataPointName: dpName.invalidCharacters
        };
        errorMsg = await validateDataPoint(invalidCharacters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Invalid Datapoint name \'' + invalidCharacters.dataPointName + '\' ');

        const lengthExceeding128characters = {
            dataPointName: dpName.lengthExceeding128characters
        };
        errorMsg = await validateDataPoint(lengthExceeding128characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datapoint Name size should not be greater than 128 characters. ');

        invalidDataPointNameSet.forEach(async element => {
            let reservedKeyword = {
                dataPointName: element
            };

            errorMsg = await validateDataPoint(reservedKeyword);
            expect(errorMsg).toBeDefined();
            expect(errorMsg).toBe(element + ' is a keyword and cannot be used as datapoint name. ');
        });

        const valid = {
            dataPointName: dpName.valid
        };
        errorMsg = await validateDataPoint(valid);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

    });

    it('should validate DataPoint Description', async () => {

        let errorMsg = '';

        const undefinedDataPointDescription = {
            dataPointName: dpName.valid
        }
        errorMsg = await validateDataPoint(undefinedDataPointDescription);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const blankDataPointDescription = {
            dataPointName: dpName.valid,
            dataPointDescription: ''
        }
        errorMsg = await validateDataPoint(blankDataPointDescription);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const lengthExceeding1024characters = {
            dataPointName: dpName.valid,
            dataPointDescription: randomString.generate({
                length: 1025
            })
        }
        errorMsg = await validateDataPoint(lengthExceeding1024characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datapoint description should not be greater than 1024 characters. ');

        const lengthEquals1024characters = {
            dataPointName: dpName.valid,
            dataPointDescription: randomString.generate({
                length: 1024
            })
        }
        errorMsg = await validateDataPoint(lengthEquals1024characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');
    });

    it('should validate DataPoint Aggregation Type', async () => {

        let errorMsg = '';

        const undefinedDpAggregationType = {
            dataPointName: dpName.valid,
        }
        errorMsg = await validateDataPoint(undefinedDpAggregationType);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const emptyDpAggregationType = {
            dataPointName: dpName.valid,
            dataPointAggregationType: ''
        }
        errorMsg = await validateDataPoint(emptyDpAggregationType);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const invalidDpAggregationType = {
            dataPointName: dpName.valid,
            dataPointAggregationType: 'test'
        }
        errorMsg = await validateDataPoint(invalidDpAggregationType);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('The datapoint aggregation type is having invalid datapoint aggregation type: ' + invalidDpAggregationType.dataPointAggregationType + ' ');

        validAggregationDatapointType.forEach(async element => {
            let validDataPointAggregationType = {
                dataPointName: dpName.valid,
                dataPointAggregationType: element
            }
            errorMsg = await validateDataPoint(validDataPointAggregationType);
            expect(errorMsg).toBeDefined();
            expect(errorMsg).toBe('');
        });
    });

    it('should validate DataPoint Type', async () => {
        let errorMsg = '';

        const undefinedDpType = {
            dataPointName: dpName.valid,
        }
        errorMsg = await validateDataPoint(undefinedDpType);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const emptyDpType = {
            dataPointName: dpName.valid,
            dataPointType: ''
        }
        errorMsg = await validateDataPoint(emptyDpType);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const invalidDpType = {
            dataPointName: dpName.valid,
            dataPointType: 'test'
        }
        errorMsg = await validateDataPoint(invalidDpType);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('The datapoint type is having invalid dataPointType :' + invalidDpType.dataPointType + ' ')

        validDatapointType.forEach(async element => {
            let validDpType = {
                dataPointName: dpName.valid,
                dataPointType: element
            }
            errorMsg = await validateDataPoint(validDpType);
            expect(errorMsg).toBeDefined();
            expect(errorMsg).toBe('')
        })

    });

});