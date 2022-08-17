import {validateDataPoint} from './DataPointValidator';
import {validateDatasource} from './DataSourceValidator';
import {validateInstance} from './InstanceValidator';
import {validateResource} from './ResourceValidator'

const REGEX_ID_9_DIGIT = /^[0-9]{1,9}$/;
const REGEX_ID_10_DIGIT = /^[0-9]{1,10}$/;
const REGEX_ID_EXPO = /^([-+]?\d*\.?\d+)(?:[eE]([-+]?\d+))+$/;

export async function validate(resourceInput: any, dataSourceInput: any, instanceInput: any, dataPointInput: any){
    let errorMsg = '';

    errorMsg += await validateResource(resourceInput);
    errorMsg += await validateDatasource(dataSourceInput);
    errorMsg += await validateInstance(instanceInput);
    errorMsg += await validateDataPoint(dataPointInput);

    return errorMsg;
}

export function passEmptyAndSpellCheck(val: string): boolean {

    return val.length == 0 || /^\s|\s$/.test(val);

}

export function isValidId9Digit(id: number): boolean {
    return REGEX_ID_9_DIGIT.test(id.toString());
}

export function isValidId10Digit(id: number): boolean {
    return REGEX_ID_10_DIGIT.test(id.toString());
}

export function isValidIdExpo(id: number): boolean {
    return REGEX_ID_EXPO.test(id.toString());
}

export function standardChecks(value: string, fieldName: string, regex: RegExp): string {
    let testStr = '##'

    if(value === ''){
        return fieldName + ' can\'t be null. ';
    }

    if(/^\s|\s$/.test(value)){
        return fieldName + ' cannot have leading or trailing spaces. ';
    }
    if(regex.test(value)){
        return 'Invalid ' + fieldName + ' : ' + value + ' ';
    }
    if(value.includes(testStr)){
        return 'Invalid ' + fieldName + ' : ' + value + ' ';
    }

    return '';

}