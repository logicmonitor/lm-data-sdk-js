import {
    isValidId9Digit,
    isValidIdExpo,
    passEmptyAndSpellCheck,
    standardChecks
} from './Validator'

const REGEX_INSTANCE_NAME = /^[a-z:A-Z0-9\\._\\-]+$/;
const REGEX_INVALID_DEVICE_DISPLAY_NAME = /[*<?,;`\\n]/;

export async function validateInstance(instance: any) {
    let errorMsg = '';

    if(instance){
        let insId = instance.instanceId;
        let insName = instance.instanceName;

        if(insId) {
            if(insId > 0) {
                errorMsg += checkInstanceId(insId)
            } else {
                errorMsg += 'Instance Id ' + insId + ' should not be negative. ';
            }
        } else if(!insName || insName ===''){
            errorMsg += 'Either Instance Id or Instance Name is mandatory. ';
        }

        if(insName && insName!=='') {
            errorMsg += checkInstanceNameValidation(insName);
        }

        if(instance.instanceDisplayName && instance.instanceDisplayName !== ''){
            errorMsg += checkInsDisplayNameValidation(instance.instanceDisplayName);
        }

        if(instance.instanceProperties !== undefined) {
            errorMsg += checkInstancePropertiesValidation(instance.instanceProperties)
        }
    } else {
        errorMsg += 'Instance must be defined. ';
    }


    return errorMsg;
}

function checkInstanceId(insID: number): string {
    let errorMsg = '';

    if(!isValidId9Digit(insID)){
        errorMsg += 'Instance Id cannot be more than 9 digit. ';
    }
    if(isValidIdExpo(insID)){
        errorMsg += 'Instance Id cannot be in Exponential form. ';
    }

    return errorMsg;
}

function checkInstanceNameValidation(name: string): string {
    let errorMsg = '';

    if(passEmptyAndSpellCheck(name)) {
        errorMsg += 'Instance Name Should not be empty or have tailing spaces. ';
    } else if(name.length > 255) {
        errorMsg += 'Instance Name size should not be greater than 255 characters. ';
    } else if(!isValidInstanceName(name)){
        errorMsg += 'Invalid Instance Name ' + name +'. ';
    }

    return errorMsg;
}

function isValidInstanceName(name: string): boolean {
    return REGEX_INSTANCE_NAME.test(name);
}

function checkInsDisplayNameValidation(insDisplay: string): string {
    let errorMsg = '';

    if(insDisplay!==''){
        if(passEmptyAndSpellCheck(insDisplay)){
            errorMsg += 'Instance Display Name Should not be empty or have tailing spaces. ';
        }
        if(insDisplay.length > 255){
            errorMsg += 'Instance Display Name size should not be greater than 255 characters. ';
        }
        errorMsg += standardChecks(insDisplay, 'instanceDisplayName', REGEX_INVALID_DEVICE_DISPLAY_NAME);
    }

    return errorMsg;
}

function checkInstancePropertiesValidation(properties: any): string {
    let errorMsg = '';

    for(const prop in properties){
        if(passEmptyAndSpellCheck(prop)){
            errorMsg += 'Instance Properties Key should not be null, empty or have trailing spaces. ';
        } else if(prop.length > 255) {
            errorMsg += 'Instance Properties Key should not be greater than 255 characters. ';
        } else if(prop.includes('##')){
            errorMsg += 'Cannot use \'##\' in property name. ';
        } else if( prop.toLowerCase().startsWith('system.') || prop.toLowerCase().startsWith('auto.') ){
            errorMsg += 'Instance Properties should not contain system or auto properties ' + prop + ' . ';
        } else if(!isValidInstanceName(prop)){
            errorMsg += 'Invalid Instance Properties key ' + prop + ' . ';
        } else if(passEmptyAndSpellCheck(properties[prop])){
            errorMsg += 'Instance Properties Value should not be null, empty or have trailing spaces. ';
        } else if(properties[prop].length > 24000){
            errorMsg += 'Instance Properties Value should not be greater than 24000 characters. ';
        } else if(!isValidInstanceName(properties[prop])){
            errorMsg += 'Invalid Instance Properties Value ' + properties[prop] + ' . ';
        }
    }

    return errorMsg;
}