import {
    isValidId9Digit,
    isValidIdExpo,
    passEmptyAndSpellCheck,
    standardChecks
} from './Validator'

const REGEX_INVALID_DATA_SOURCE_GROUP_NAME           = /[^a-zA-Z0-9_\-\ ]/
const REGEX_INVALID_DATA_SOURCE_DISPLAY_NAME = /[^a-zA-Z: _0-9\(\)\\.\\+@<>\n-]/
const REGEX_INVALID_DATA_SOURCE_NAME         = /[^a-zA-Z $#@_\-0-9:&\\.\\+\n]/

export async function validateDatasource(ds: any) {
    let errorMsg = '';

    if(ds !== undefined){
        let dsId = ds.dataSourceId;
        let dsName = ds.dataSource;

        if(dsId !== undefined) {
            if(dsId > 0) {
                errorMsg += checkDataSourceId(dsId)
            } else {
                errorMsg += 'DataSource Id ' + dsId + ' should be a positive integer. ';
            }
        } else if(dsName === undefined || dsName ===''){
            errorMsg += 'Either dataSourceId or dataSource is mandatory. ';
        }

        if(dsName !== undefined && dsName !== ''){
            errorMsg += checkDataSourceNameValidation(dsName);
        }

        if(ds.dataSourceDisplayName !== undefined && ds.dataSourceDisplayName !== ''){
            errorMsg += checkDsDisplayNameValidation(ds.dataSourceDisplayName);
        }

        if(ds.dataSourceGroup !== undefined && ds.dataSourceGroup!==''){
            errorMsg += checkDsGroupValidation(ds.dataSourceGroup);
        }
    } else{
        errorMsg += 'DataSource must be defined. ';
    }
    return errorMsg;
}

function checkDataSourceId(id: number): string {
    let errorMsg = '';

    if(isValidIdExpo(id)){
        return 'DataSource Id cannot be in Exponential form. ';
    }
    if(!isValidId9Digit(id)){
        return 'DataSource Id should be an integer not more than 9 digit. ';
    }
   

    return errorMsg;
}

function checkDataSourceNameValidation(dsName: string): string {
    let errorMsg = '';

    if(passEmptyAndSpellCheck(dsName)){
        return 'Datasource Name Should not be empty or have tailing spaces. ';
    } else if(dsName.length > 64){
        return 'Datasource Name size should not be greater than 64 characters. ';
    }

    errorMsg += validateDsName(dsName, 'dataSource');
    if(errorMsg !== ''){
        return errorMsg;
    }
    errorMsg += standardChecks(dsName, 'dataSource', REGEX_INVALID_DATA_SOURCE_NAME);

    return errorMsg;    
}

function checkDsDisplayNameValidation(name: string): string{

    let errorMsg = '';

    if(passEmptyAndSpellCheck(name)){
        return 'Datasource Display Name Should not be empty or have tailing spaces. ';
    } else if(name.length > 64){
        return 'Datasource Display Name size should not be greater than 64 characters. ';
    }

    errorMsg += validateDsName(name, 'dataSourceDisplayName');
    if(errorMsg !== ''){
        return errorMsg;
    }
    errorMsg += standardChecks(name, 'dataSourceDisplayName', REGEX_INVALID_DATA_SOURCE_DISPLAY_NAME);

    return errorMsg;
}

function validateDsName(name: string, fieldName: string): string{
    let errorMsg = '';

    if(name.includes('-')){
        if(name.indexOf('-') == name.length - 1){
            if(name.length==1){
                errorMsg += fieldName + ' cannot be a single \'-\'. ';
            }
        } else {
            errorMsg += '\'-\' is only supported when it is the last character of ' + fieldName + '. ';
        }
    }

    return errorMsg;
}

function checkDsGroupValidation(name: string): string{
    let errorMsg = '';

    if(passEmptyAndSpellCheck(name)){
       return 'Datasource Group Name Should not be empty or have tailing spaces.';
    }

    if(name.length > 128){
        return 'Datasource Group Name length should not be greater than 128 characters.';
    }

    if(!isValidDataSourceGroupName(name)){
        errorMsg += 'Invalid Datasource Group Name: ' + name + '. ';
    }

    return errorMsg;
}

function isValidDataSourceGroupName(name: string){
    return !REGEX_INVALID_DATA_SOURCE_GROUP_NAME.test(name);
}