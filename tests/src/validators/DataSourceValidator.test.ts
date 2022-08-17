import { validateDatasource } from '../../../src/validators/DataSourceValidator';
import * as randomString from 'randomstring';

describe('InstanceValidator', () => {

    it('should be defined', () => {
        expect(validateDatasource).toBeDefined();
    });

    it('should validate undefined DataSource', async () => {

        let undefinedDataSource;

        let errorMsg = await validateDatasource(undefinedDataSource);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('DataSource must be defined. ')

    });

    it('should validate dataSourceId', async () => {
        let errorMsg = '';

        let undefinedDataSourceId = {};

        errorMsg = await validateDatasource(undefinedDataSourceId)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Either dataSourceId or dataSource is mandatory. ');

        const zeroDataSourceId = {
            dataSourceId: 0
        }
        errorMsg = await validateDatasource(zeroDataSourceId)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('DataSource Id ' + zeroDataSourceId.dataSourceId + ' should be a positive integer. ');

        const negativeDataSourceId = {
            dataSourceId: -1
        }
        errorMsg = await validateDatasource(negativeDataSourceId)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('DataSource Id ' + negativeDataSourceId.dataSourceId + ' should be a positive integer. ');

        const positiveDataSourceId = {
            dataSourceId: 1
        }
        errorMsg = await validateDatasource(positiveDataSourceId)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const nineDigitNumber = randomString.generate({
            length: 9,
            charset: 'numeric'
        })
        const nineDigitDataSourceId = {
            dataSourceId: nineDigitNumber
        }
        errorMsg = await validateDatasource(nineDigitDataSourceId)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const tenDigitNumber = randomString.generate({
            length: 10,
            charset: 'numeric'
        })
        const tenDigitDataSourceId = {
            dataSourceId: tenDigitNumber
        }
        errorMsg = await validateDatasource(tenDigitDataSourceId)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('DataSource Id should be an integer not more than 9 digit. ');

        const alphaNumericDatasourceId = {
            dataSourceId: 'abv123'
        }
        errorMsg = await validateDatasource(alphaNumericDatasourceId)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('DataSource Id ' + alphaNumericDatasourceId.dataSourceId + ' should be a positive integer. ');

        const num = 1234567890
        const exponentialDataSourceId = {
            dataSourceId: num.toExponential()
        }
        errorMsg = await validateDatasource(exponentialDataSourceId)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('DataSource Id cannot be in Exponential form. ');

    });

    it('should validate dataSource', async () => {

        let errorMsg = '';

        let undefinedDataSourceName = {};

        errorMsg = await validateDatasource(undefinedDataSourceName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Either dataSourceId or dataSource is mandatory. ')

        const emptyDataSourceName = {
            dataSource: ''
        }
        errorMsg = await validateDatasource(emptyDataSourceName);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Either dataSourceId or dataSource is mandatory. ')

        const leadingSpace = {
            dataSource: ' test'
        }
        errorMsg = await validateDatasource(leadingSpace);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Name Should not be empty or have tailing spaces. ')

        const trailingSpace = {
            dataSource: 'test '
        }
        errorMsg = await validateDatasource(trailingSpace);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Name Should not be empty or have tailing spaces. ')

        const leadingAndTrailingSpace = {
            dataSource: ' test '
        }
        errorMsg = await validateDatasource(leadingAndTrailingSpace);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Name Should not be empty or have tailing spaces. ')

        const lengthExceeding64Characters = {
            dataSource: randomString.generate({
                length: 65
            })
        }
        errorMsg = await validateDatasource(lengthExceeding64Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Name size should not be greater than 64 characters. ')

        const lengthEquals64Characters = {
            dataSource: randomString.generate({
                length: 64
            })
        }
        errorMsg = await validateDatasource(lengthEquals64Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const dsWithHyphen = {
            dataSource: 'abc-def'
        }
        errorMsg = await validateDatasource(dsWithHyphen);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('\'-\' is only supported when it is the last character of dataSource. ')

        const dsSingleHyphen = {
            dataSource: '-'
        }
        errorMsg = await validateDatasource(dsSingleHyphen);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('dataSource cannot be a single \'-\'. ')

        const dsWithHyphenAtEnd = {
            dataSource: 'test-'
        }
        errorMsg = await validateDatasource(dsWithHyphenAtEnd);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const invalidCharacter = {
            dataSource: 'test##123'
        }
        errorMsg = await validateDatasource(invalidCharacter);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Invalid ' + 'dataSource' + ' : ' + invalidCharacter.dataSource + ' ')
    })

    it('should validate dataSourceDisplayName', async () => {

        let errorMsg = '';

        const undefinedDisplayName = {
            dataSourceId: 1
        }
        errorMsg = await validateDatasource(undefinedDisplayName)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const emptyDsName = {
            dataSourceId: 1,
            dataSourceDisplayName: ''
        }
        errorMsg = await validateDatasource(emptyDsName)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const leadingSpace = {
            dataSourceId: 1,
            dataSourceDisplayName: ' test'
        }
        errorMsg = await validateDatasource(leadingSpace)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Display Name Should not be empty or have tailing spaces. ');

        const trailingSpace = {
            dataSourceId: 1,
            dataSourceDisplayName: 'test '
        }
        errorMsg = await validateDatasource(trailingSpace)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Display Name Should not be empty or have tailing spaces. ');

        const leadingAndTrailingSpace = {
            dataSourceId: 1,
            dataSourceDisplayName: ' test '
        }
        errorMsg = await validateDatasource(leadingAndTrailingSpace)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Display Name Should not be empty or have tailing spaces. ');

        const lengthExceeding64Characters = {
            dataSourceId: 1,
            dataSourceDisplayName: randomString.generate({
                length: 65
            })
        }
        errorMsg = await validateDatasource(lengthExceeding64Characters)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Display Name size should not be greater than 64 characters. ');

        const lengthEquals64Characters = {
            dataSourceId: 1,
            dataSourceDisplayName: randomString.generate({
                length: 64
            })
        }
        errorMsg = await validateDatasource(lengthEquals64Characters)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const dsWithHyphen = {
            dataSource: 'abcdef',
            dataSourceDisplayName: 'abc-def'
        }
        errorMsg = await validateDatasource(dsWithHyphen);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('\'-\' is only supported when it is the last character of dataSourceDisplayName. ')

        const dsSingleHyphen = {
            dataSource: 'test',
            dataSourceDisplayName: '-'
        }
        errorMsg = await validateDatasource(dsSingleHyphen);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('dataSourceDisplayName cannot be a single \'-\'. ')

        const dsWithHyphenAtEnd = {
            dataSource: 'test',
            dataSourceDisplayName: 'test-'
        }
        errorMsg = await validateDatasource(dsWithHyphenAtEnd);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const invalidCharacter = {
            dataSourceId: 1,
            dataSourceDisplayName: 'test@##'
        }
        errorMsg = await validateDatasource(invalidCharacter);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Invalid dataSourceDisplayName : '+ invalidCharacter.dataSourceDisplayName + ' ')
    });

    it('should validate dataSourceGroup', async () => {
        let errorMsg = '';

        const undefinedDsGroup = {
            dataSourceId: 1
        }
        errorMsg = await validateDatasource(undefinedDsGroup);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const emptyDsGroup = {
            dataSourceId: 1,
            dataSourceGroup: ''
        }
        errorMsg = await validateDatasource(emptyDsGroup);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const leadingSpaceDsGroup = {
            dataSourceId: 1,
            dataSourceGroup: ' test'
        }
        errorMsg = await validateDatasource(leadingSpaceDsGroup);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Group Name Should not be empty or have tailing spaces.');

        const trailingSpaceDsGroup = {
            dataSourceId: 1,
            dataSourceGroup: 'test '
        }
        errorMsg = await validateDatasource(trailingSpaceDsGroup);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Group Name Should not be empty or have tailing spaces.');

        const leadingAndTrailingSpaceDsGroup = {
            dataSourceId: 1,
            dataSourceGroup: ' test '
        }
        errorMsg = await validateDatasource(leadingAndTrailingSpaceDsGroup);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Group Name Should not be empty or have tailing spaces.');

        const lengthExceeding128Characters = {
            dataSourceId: 1,
            dataSourceGroup: randomString.generate({
                length: 129
            })
        }
        errorMsg = await validateDatasource(lengthExceeding128Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Datasource Group Name length should not be greater than 128 characters.');

        const lengthEquals128Characters = {
            dataSourceId: 1,
            dataSourceGroup: randomString.generate({
                length: 128
            })
        }
        errorMsg = await validateDatasource(lengthEquals128Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');

        const invalidCharacter = {
            dataSourceId: 1,
            dataSourceGroup: 'test##123'
        }
        errorMsg = await validateDatasource(invalidCharacter);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Invalid Datasource Group Name: ' + invalidCharacter.dataSourceGroup + '. ');

        const validCharacter = {
            dataSourceId: 1,
            dataSourceGroup: 'test-_ 123'
        }
        errorMsg = await validateDatasource(validCharacter);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('');
    });
})