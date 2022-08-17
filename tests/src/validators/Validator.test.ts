import { validate, standardChecks } from '../../../src/validators/Validator';

describe('Validator', () => {

    it('should be defined', () => {
        expect(validate).toBeDefined();
        expect(standardChecks).toBeDefined();
    });

    it('should return a defined errorMsg', async () => {
        let errorMsg = await validate({},{},{},{});
        expect(errorMsg).toBeDefined();
        expect(typeof errorMsg).toBe('string')
    })

    it('should return can\'t be null', () => {
        let errorMsg = standardChecks('','test',/\*/)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('test can\'t be null. ')
    })

    it('should return can\'t have tailing spaces', () => {
        let errorMsg = standardChecks('test ','test',/\*/)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('test cannot have leading or trailing spaces. ')

        errorMsg = standardChecks(' test ','test',/\*/)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('test cannot have leading or trailing spaces. ')

        errorMsg = standardChecks(' test','test',/\*/)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('test cannot have leading or trailing spaces. ')
    })

});