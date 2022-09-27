import { validateInstance } from '../../../src/validators/InstanceValidator';
import { value } from './testData/instance';
import * as randomString from 'randomstring';

describe('InstanecValidator', () => {
    it('should be defined', () => {
        expect(validateInstance).toBeDefined();
    });

    it('should invalidate undefined instance', async () => {
        let undefinedInstance;

        let errorMsg = await validateInstance(undefinedInstance);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance must be defined. ');
    });

    it('should validate Instance Id', async () => {

        let errorMsg = '';

        const undefinedInstanceIDandName = {}
        errorMsg = await validateInstance(undefinedInstanceIDandName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Either Instance Id or Instance Name is mandatory. ');

        const negativeInstanceId = {
            instanceId: -1
        }
        errorMsg = await validateInstance(negativeInstanceId);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Id ' + negativeInstanceId.instanceId + ' should not be negative or zero. ');

        const decimalInstanceId = {
            instanceId: 1.1
        }
        errorMsg = await validateInstance(decimalInstanceId);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Id cannot be more than 10 digit or in decimal. ');

        const zeroInstanceId = {
            instanceId: 0
        }
        errorMsg = await validateInstance(zeroInstanceId);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Id ' + zeroInstanceId.instanceId + ' should not be negative or zero. ');

        const moreThan10DigitInstanceID = {
            instanceId: 12345678901
        }
        errorMsg = await validateInstance(moreThan10DigitInstanceID);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Id cannot be more than 10 digit or in decimal. ');

        const num = 12345678901
        const exponentialInstanceId = {
            instanceId: num.toExponential()
        }
        errorMsg = await validateInstance(exponentialInstanceId);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Id cannot be in Exponential form. ');

        const tenDigitInstanceId = {
            instanceId: 1234567890
        }
        errorMsg = await validateInstance(tenDigitInstanceId);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const lessThan10DigitInstanceId = {
            instanceId: 12345
        }
        errorMsg = await validateInstance(lessThan10DigitInstanceId);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');
    });

    it('should validate instanceName', async () => {
        let errorMsg = '';

        const undefinedInstanceIDandName = {}
        errorMsg = await validateInstance(undefinedInstanceIDandName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Either Instance Id or Instance Name is mandatory. ');

        const blankInstanceName = {
            instanceName: value.empty
        }
        errorMsg = await validateInstance(blankInstanceName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Either Instance Id or Instance Name is mandatory. ');

        const leadingSpace = {
            instanceName: value.leadingSpace
        }
        errorMsg = await validateInstance(leadingSpace);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Name Should not be empty or have leading or trailing spaces. ');

        const trailingSpace = {
            instanceName: value.trailingSpace
        }
        errorMsg = await validateInstance(trailingSpace);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Name Should not be empty or have leading or trailing spaces. ');

        const leadingAndTrailingSpace = {
            instanceName: value.leadingAndTrailingSpace
        }
        errorMsg = await validateInstance(leadingAndTrailingSpace);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Name Should not be empty or have leading or trailing spaces. ');

        const lengthExceeding255Characters = {
            instanceName: randomString.generate({
                length: 256
            })
        }
        errorMsg = await validateInstance(lengthExceeding255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Name size should not be greater than 255 characters. ');


        const lengthEquals255Characters = {
            instanceName: randomString.generate({
                length: 255
            })
        }
        errorMsg = await validateInstance(lengthEquals255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const inValid = {
            instanceName: value.invalidCharacters
        }
        errorMsg = await validateInstance(inValid);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Invalid Instance Name ' + inValid.instanceName +'. ');

        const valid = {
            instanceName: value.valid
        }
        errorMsg = await validateInstance(valid);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');
    });

    it('should validate instanceDisplayName', async () => {
        let errorMsg = '';

        const undefinedInstanceDisplayName = {
            instanceName: 'test'
        }
        errorMsg = await validateInstance(undefinedInstanceDisplayName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const emptyInstanceDisplayName = {
            instanceName: 'test',
            instanceDisplayName: value.empty
        }
        errorMsg = await validateInstance(emptyInstanceDisplayName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const leadingSpace = {
            instanceName: 'test',
            instanceDisplayName: value.leadingSpace
        }
        errorMsg = await validateInstance(leadingSpace);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Display Name Should not be empty or have tailing spaces. ');

        const trailingSpace = {
            instanceName: 'test',
            instanceDisplayName: value.trailingSpace
        }
        errorMsg = await validateInstance(trailingSpace);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Display Name Should not be empty or have tailing spaces. ');

        const leadingAndTrailingSpace = {
            instanceName: 'test',
            instanceDisplayName: value.leadingAndTrailingSpace
        }
        errorMsg = await validateInstance(leadingAndTrailingSpace);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Display Name Should not be empty or have tailing spaces. ');

        const lengthExceeding255Characters = {
            instanceName: 'test',
            instanceDisplayName: randomString.generate({
                length: 256
            })
        }
        errorMsg = await validateInstance(lengthExceeding255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Display Name size should not be greater than 255 characters. ');


        const lengthEquals255Characters = {
            instanceName: 'test',
            instanceDisplayName: randomString.generate({
                length: 255
            })
        }
        errorMsg = await validateInstance(lengthEquals255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');


    });

    it('should validate instanceProperties', async () => {

        let errorMsg = '';
        // @ts-ignore
        const stringExceeding255Chars = randomString.generate({
            length: 256
        })
        // @ts-ignore
        const stringEquals255Chars = randomString.generate({
            length: 255
        })
        // @ts-ignore
        const stringExceeding24kCharacters = randomString.generate({
            length: 24001
        })
        // @ts-ignore
        const stringEquals24kCharacters = randomString.generate({
            length: 24000
        })

        const undefinedInstanceProperties = {
            instanceName: 'test'
        }
        errorMsg = await validateInstance(undefinedInstanceProperties);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const emptyPropertyKey = {
            instanceName: 'test',
            instanceProperties: {
                '': 'value'
            }
        }
        errorMsg = await validateInstance(emptyPropertyKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Key should not be null, empty or have trailing spaces. ');

        const leadingSpacePropertyKey = {
            instanceName: 'test',
            instanceProperties: {
                ' key': 'value'
            }
        }
        errorMsg = await validateInstance(leadingSpacePropertyKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Key should not be null, empty or have trailing spaces. ');

        const trailingSpacePropertyKey = {
            instanceName: 'test',
            instanceProperties: {
                'key ': 'value'
            }
        }
        errorMsg = await validateInstance(trailingSpacePropertyKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Key should not be null, empty or have trailing spaces. ');

        const leadingAndTrailingSpacePropertyKey = {
            instanceName: 'test',
            instanceProperties: {
                ' key ': 'value'
            }
        }
        errorMsg = await validateInstance(leadingAndTrailingSpacePropertyKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Key should not be null, empty or have trailing spaces. ');
        
        type instanceWithProperties = {
            instanceName: string,
            instanceProperties: any
        }
        let keyLengthExceeding255Characters: instanceWithProperties = {
            instanceName: 'test',
            instanceProperties: {}
        }
        keyLengthExceeding255Characters.instanceProperties[stringExceeding255Chars] = 'value'
        errorMsg = await validateInstance(keyLengthExceeding255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Key should not be greater than 255 characters. ');

        const keyLengthEquals255Characters: instanceWithProperties = {
            instanceName: 'test',
            instanceProperties: {}
        }
        keyLengthEquals255Characters.instanceProperties[stringEquals255Chars] = 'value'
        errorMsg = await validateInstance(keyLengthEquals255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const includesDoubleHashInKey = {
            instanceName: 'test',
            instanceProperties: {
                'k##ey': 'value'
            }
        }
        errorMsg = await validateInstance(includesDoubleHashInKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Cannot use \'##\' in property name. ');

        const keyStartsWithSystem = {
            instanceName: 'test',
            instanceProperties: {
                'system.key': 'value'
            }
        }
        errorMsg = await validateInstance(keyStartsWithSystem);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties should not contain system or auto properties ' + Object.keys(keyStartsWithSystem.instanceProperties)[0] + ' . ');

        const keyStartsWithAuto = {
            instanceName: 'test',
            instanceProperties: {
                'auto.key': 'value'
            }
        }
        errorMsg = await validateInstance(keyStartsWithAuto);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties should not contain system or auto properties ' + Object.keys(keyStartsWithAuto.instanceProperties)[0] + ' . ');

        const invalidKeyName = {
            instanceName: 'test',
            instanceProperties: {
                '@test': 'value'
            }
        }
        errorMsg = await validateInstance(invalidKeyName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Invalid Instance Properties key ' + Object.keys(invalidKeyName.instanceProperties)[0] + ' . ');

        const emptyValue = {
            instanceName: 'test',
            instanceProperties: {
                'key': ''
            }
        }
        errorMsg = await validateInstance(emptyValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Value should not be null, empty or have trailing spaces. ');

        const leadingSpaceValue = {
            instanceName: 'test',
            instanceProperties: {
                'key': ' value'
            }
        }
        errorMsg = await validateInstance(leadingSpaceValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Value should not be null, empty or have trailing spaces. ');

        const trailingSpaceValue = {
            instanceName: 'test',
            instanceProperties: {
                'key': 'value '
            }
        }
        errorMsg = await validateInstance(trailingSpaceValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Value should not be null, empty or have trailing spaces. ');

        const leadingAndTrailingSpaceValue = {
            instanceName: 'test',
            instanceProperties: {
                'key': ' value '
            }
        }
        errorMsg = await validateInstance(leadingAndTrailingSpaceValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Value should not be null, empty or have trailing spaces. ');

        const lengthExceeding24kCharactersValue = {
            instanceName: 'test',
            instanceProperties: {
                'key': stringExceeding24kCharacters
            }
        }
        errorMsg = await validateInstance(lengthExceeding24kCharactersValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Instance Properties Value should not be greater than 24000 characters. ');

        const lengthEquals24kCharactersValue = {
            instanceName: 'test',
            instanceProperties: {
                'key': stringEquals24kCharacters
            }
        }
        errorMsg = await validateInstance(lengthEquals24kCharactersValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');
    });
});