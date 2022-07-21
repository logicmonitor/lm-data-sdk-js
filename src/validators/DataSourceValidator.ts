import {
    isValidId9Digit,
    isValidIdExpo,
    passEmptyAndSpellCheck,
    standardChecks
} from './Validator'

const REGEX_DATA_SOURCE_GROUP_NAME           = /[a-zA-Z0-9\_\-\ ]+$/
const REGEX_INVALID_DATA_SOURCE_DISPLAY_NAME = /[^a-zA-Z: _0-9\\(\\)\\.#\\+@<>\n]/
const REGEX_INVALID_DATA_SOURCE_NAME         = /[^a-zA-Z $#@_0-9:&\\.\\+\n]/

export async function validateDatasource(ds: any) {
    let errorMsg = '';

    if(ds){
        let dsId = ds.dataSourceId;
        let dsName = ds.dataSource;

        if(dsId) {
            if(dsId > 0) {
                errorMsg += checkDataSourceId(dsId)
            } else {
                errorMsg += 'DataSource Id ' + dsId + ' should not be negative. ';
            }
        } else if(!dsName || dsName ===''){
            errorMsg += 'Either dataSourceId or dataSource is mandatory. ';
        }

        if(dsName && dsName !== ''){
            errorMsg += checkDataSourceNameValidation(dsName);
        }

        if(ds.dataSourceDisplayName && ds.dataSourceDisplayName !== ''){
            errorMsg += checkDsDisplayNameValidation(ds.dataSourceDisplayName);
        }

        if(ds.dataSourceGroup && ds.dataSourceGroup!==''){
            errorMsg += checkDsGroupValidation(ds.dataSourceGroup);
        }
    } else{
        errorMsg += 'DataSource must be defined. ';
    }
    return errorMsg;
}

function checkDataSourceId(id: number): string {
    let errorMsg = '';

    if(!isValidId9Digit(id)){
        errorMsg += 'DataSource Id cannot be more than 9 digit. ';
    }
    if(isValidIdExpo(id)){
        errorMsg += 'DataSource Id cannot be in Exponential form. ';
    }

    return errorMsg;
}

function checkDataSourceNameValidation(dsName: string): string {
    let errorMsg = '';

    if(passEmptyAndSpellCheck(dsName)){
        errorMsg += 'Datasource Name Should not be empty or have tailing spaces. ';
    } else if(dsName.length > 64){
        errorMsg += 'Datasource Name size should not be greater than 64 characters. ';
    }

    errorMsg += validateDsName(dsName, 'dataSource');
    errorMsg += standardChecks(dsName, 'dataSource', REGEX_INVALID_DATA_SOURCE_NAME);

    return errorMsg;    
}

function checkDsDisplayNameValidation(name: string): string{

    let errorMsg = '';

    if(passEmptyAndSpellCheck(name)){
        errorMsg += 'Datasource Display Name Should not be empty or have tailing spaces. ';
    } else if(name.length > 64){
        errorMsg += 'Datasource Display Name size should not be greater than 64 characters. ';
    }

    errorMsg += validateDsName(name, 'dataSourceDisplayName');
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
        errorMsg += 'Datasource Group Name Should not be empty or have tailing spaces.';
    }

    if(name.length < 2 || name.length > 128){
        errorMsg += 'Datasource Group Name size should not be less than 2 or greater than 128 characters.';
    }

    if(!isisValidDataSourceGroupName(name)){
        errorMsg += 'Invalid Datasource Group Name: ' + name + '. ';
    }

    return errorMsg;
}

function isisValidDataSourceGroupName(name: string){
    return REGEX_DATA_SOURCE_GROUP_NAME.test(name);
}