import {
    passEmptyAndSpellCheck
} from './Validator'

const VALID_REGEX_RESOURCE_NAME = /^[a-z:A-Z0-9._\-]+$/;

export async function validateResource(resource: any) {
    let errorMsg = ''

    if(resource!==undefined){
        if(resource.resourceName !== undefined && (resource.create || resource.resourceName !== '')){
            errorMsg += checkResourceNameValidation(resource.create, resource.resourceName);
        }
        if(resource.description !== undefined && resource.description !==''){
            errorMsg += checkResourceDescriptionValidation(resource.description);
        }
        errorMsg += checkResourceIDValidation(resource.resourceIds);
        if(resource.resourceProperties !== undefined){
            errorMsg += checkResourcePropertiesValidation(resource.resourceProperties);
        }
    } else {
        errorMsg += 'Resource must be defined. ';
    }


    return errorMsg;
}

function checkResourceNameValidation(create: boolean, name: string): string{
    let errorMsg = '';

    if(create && name===''){
        errorMsg += 'Resource name is mandatory when creating a resource. ';
    } else {
        if(passEmptyAndSpellCheck(name)){
            errorMsg += 'Resource Name Should not be empty or have tailing spaces. ';
        }
        if(name.length>255){
            errorMsg += 'Resource Name size should not be greater than 255 characters. ';
        }
        if(isInvalidResourceName(name)){
            errorMsg += 'Invalid Resource Name ' + name + '. ';
        }
    }

    return errorMsg;
}

function isInvalidResourceName(name: string): boolean{
    return !VALID_REGEX_RESOURCE_NAME.test(name);
}

function checkResourceDescriptionValidation(description: string): string{
    let errorMsg = '';

    if(description.length > 65535) {
        errorMsg += 'Resource Description Size should not be greater than 65535 characters. '
    }

    return errorMsg;
}

function checkResourceIDValidation(ids: any): string{
    let errorMsg = '';

    if(ids === undefined || Object.keys(ids).length == 0 ){
        errorMsg += 'Resource IDs are mandatory. ';
    } else {
        for(const id in ids){
            if(passEmptyAndSpellCheck(id)){
                errorMsg += 'Resource Id Key should not be null, empty or have trailing spaces. ';
            }
            if(id.length > 255){
                errorMsg += 'Resource Id Key should not be greater than 255 characters. ';
            }
            if(isInvalidResourceName(id)){
                errorMsg += 'Invalid ResourceID key: ' + id + '. ';
            }
            if(passEmptyAndSpellCheck(ids[id])){
                errorMsg += 'Resource Id Value should not be null, empty or have trailing spaces. ';
            }
            if(ids[id].length > 24000) {
                errorMsg += 'Resource Id Value should not be greater than 24000 characters. ';
            }
            if(isInvalidResourceName(ids[id])){
                errorMsg += 'Invalid ResourceID value: ' + ids[id] + '. ';
            }
        }
    }


    return errorMsg;
    
}

function checkResourcePropertiesValidation(properties: any): string{
    let errorMsg = '';

    for(const prop in properties){
        if(passEmptyAndSpellCheck(prop)){
            errorMsg += 'Resource Properties Key should not be null, empty or have trailing spaces. ';
        }
        if(prop.length > 255){
            errorMsg += 'Resource Properties Key should not be greater than 255 characters. ';
        }
        if(prop.includes('##')){
            errorMsg += 'Cannot use \'##\' in property name. ';
        }
        if( prop.toLowerCase().startsWith('system.') || prop.toLowerCase().startsWith('auto.')){
            errorMsg += 'Resource Properties should not contain system or auto properties : ' + prop + '. ';
        }
        if(isInvalidResourceName(prop)){
            errorMsg += 'Invalid Resource Properties key ' + prop + '. ';
        }
        if(passEmptyAndSpellCheck(properties[prop])){
            errorMsg += 'Resource Properties Value should not be null, empty or have trailing spaces. ';
        }
        if(properties[prop].length > 24000){
            errorMsg += 'Resource Properties Value should not be greater than 24000 characters. ';
        }
        if(isInvalidResourceName(properties[prop])){
            errorMsg += 'Invalid Resource Properties Value ' + properties[prop] + '. ';
        }
    }


    return errorMsg;
}