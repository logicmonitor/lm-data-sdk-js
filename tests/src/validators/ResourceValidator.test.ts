import { validateResource } from '../../../src/validators/ResourceValidator';
import * as randomString from 'randomstring';

describe('ResourceValidator', () => {
    it('should be defined', () => {
        expect(validateResource).toBeDefined()
    });

    it('should validate undefined resource', async () => {
        let errorMsg = '';
        let undefinedResource;

        errorMsg = await validateResource(undefinedResource);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Resource must be defined. ')
    })

    it('should validate resourceIds', async () => {
        
        let errorMsg = '';

        const undefinedResourceIds = {};
        errorMsg = await validateResource(undefinedResourceIds);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Resource IDs are mandatory. ');

        const emptyResourceIds = {
            resourceIds: {}
        }
        errorMsg = await validateResource(emptyResourceIds);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Resource IDs are mandatory. ');

        const emptyKey = {
            resourceIds: {
                '' : 'value'
            }
        }
        errorMsg = await validateResource(emptyKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Key should not be null, empty or have trailing spaces. ')

        const leadingSpaceKey = {
            resourceIds: {
                ' key' : 'value'
            }
        }
        errorMsg = await validateResource(leadingSpaceKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Key should not be null, empty or have trailing spaces. ')

        const trailingSpaceKey = {
            resourceIds: {
                'key ' : 'value'
            }
        }
        errorMsg = await validateResource(trailingSpaceKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Key should not be null, empty or have trailing spaces. ')

        const leadingAndTrailingSpaceKey = {
            resourceIds: {
                ' key ' : 'value'
            }
        }
        errorMsg = await validateResource(leadingAndTrailingSpaceKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Key should not be null, empty or have trailing spaces. ')

        type resourceWithIDs = {
            resourceIds: any
        }
        const keyLengthExceeding255Characters: resourceWithIDs = {
            resourceIds: {}
        }
        keyLengthExceeding255Characters.resourceIds[randomString.generate({
            length: 256
        })] = 'value'
        errorMsg = await validateResource(keyLengthExceeding255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Key should not be greater than 255 characters. ')

        const keyLengthEquals255Characters: resourceWithIDs = {
            resourceIds: {}
        }
        keyLengthEquals255Characters.resourceIds[randomString.generate({
            length: 255
        })] = 'value'
        errorMsg = await validateResource(keyLengthEquals255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const invalidCharacterKey = {
            resourceIds: {
                'test##key': 'value'
            }
        }
        errorMsg = await validateResource(invalidCharacterKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Invalid ResourceID key: ' + Object.keys(invalidCharacterKey.resourceIds)[0] + '. ')

        const validKey = {
            resourceIds: {
                'testkey': 'value'
            }
        }
        errorMsg = await validateResource(validKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const emptyValue = {
            resourceIds: {
                'key': ''
            }
        }
        errorMsg = await validateResource(emptyValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Value should not be null, empty or have trailing spaces. ')

        const leadingAndTailingSpaceValue = {
            resourceIds: {
                'key': ' value '
            }
        }
        errorMsg = await validateResource(leadingAndTailingSpaceValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Value should not be null, empty or have trailing spaces. ')

        const leadingSpaceValue = {
            resourceIds: {
                'key': ' value'
            }
        }
        errorMsg = await validateResource(leadingSpaceValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Value should not be null, empty or have trailing spaces. ')

        const tailingValue = {
            resourceIds: {
                'key': 'value '
            }
        }
        errorMsg = await validateResource(tailingValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Value should not be null, empty or have trailing spaces. ')

        const valueLengthExceeds24kcharacters = {
            resourceIds: {
                'key': randomString.generate({
                    length: 24001
                })
            }
        }
        errorMsg = await validateResource(valueLengthExceeds24kcharacters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Id Value should not be greater than 24000 characters. ')

        const valueLengthEquals24kcharacters = {
            resourceIds: {
                'key': randomString.generate({
                    length: 24000
                })
            }
        }
        errorMsg = await validateResource(valueLengthEquals24kcharacters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('')

        const invalidValue = {
            resourceIds: {
                'key' : 'val##ue'
            }
        }
        errorMsg = await validateResource(invalidValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Invalid ResourceID value: ' + invalidValue.resourceIds['key'] + '. ')

        const validValue = {
            resourceIdss: {
                'key': 'value'
            }
        }
        errorMsg = await validateResource(validValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('')

    });

    it('should validate resourceName', async () => {

        let errorMsg = '';

        const undefinedResourceName = {
            resourceIds: {
                key: 'value'
            }
        }
        errorMsg = await validateResource(undefinedResourceName)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const emptyResourceName = {
            resourceIds: {
                key: 'value'
            },
            resourceName: ''
        }
        errorMsg = await validateResource(emptyResourceName)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const isCreateAndNameEmpty = {
            resourceIds: {
                key: 'value'
            },
            resourceName: '',
            create: true
        }
        errorMsg = await validateResource(isCreateAndNameEmpty)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Resource name is mandatory when creating a resource. ')

        const leadingSpace = {
            resourceIds: {
                key: 'value'
            },
            resourceName: ' test',
        }
        errorMsg = await validateResource(leadingSpace)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Name Should not be empty or have tailing spaces. ')

        const tailingSpace = {
            resourceIds: {
                key: 'value'
            },
            resourceName: 'test ',
        }
        errorMsg = await validateResource(tailingSpace)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Name Should not be empty or have tailing spaces. ')

        const leadingAndTilingSpace = {
            resourceIds: {
                key: 'value'
            },
            resourceName: ' test ',
        }
        errorMsg = await validateResource(leadingAndTilingSpace)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Name Should not be empty or have tailing spaces. ')

        const lengthExceeding255Chars = {
            resourceIds: {
                key: 'value'
            },
            resourceName: randomString.generate({
                length: 256
            }),
        }
        errorMsg = await validateResource(lengthExceeding255Chars)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Name size should not be greater than 255 characters. ')

        const lengthEquals255Chars = {
            resourceIds: {
                key: 'value'
            },
            resourceName: randomString.generate({
                length: 255
            }),
        }
        errorMsg = await validateResource(lengthEquals255Chars)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const invalidChars = {
            resourceIds: {
                key: 'value'
            },
            resourceName: '@test'
        }
        errorMsg = await validateResource(invalidChars)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Invalid Resource Name ' + invalidChars.resourceName + '. ')

        const withSpace = {
            resourceIds: {
                key: 'value'
            },
            resourceName: 'te st'
        }
        errorMsg = await validateResource(withSpace)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Invalid Resource Name ' + withSpace.resourceName + '. ')

        const validName = {
            resourceIds: {
                key: 'value'
            },
            resourceName: 'validName'
        }
        errorMsg = await validateResource(validName)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')
    });

    it('should validate resource.description', async () => {

        let errorMsg = '';

        const undefinedDescription = {
            resourceIds: {
                key: 'value'
            },
        }
        errorMsg = await validateResource(undefinedDescription)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const emptyDescription = {
            resourceIds: {
                key: 'value'
            },
            description: ''
        }
        errorMsg = await validateResource(emptyDescription)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const lengthExceeding65535Chars = {
            resourceIds: {
                key: 'value'
            },
            description: randomString.generate({
                length: 65536
            })
        }
        errorMsg = await validateResource(lengthExceeding65535Chars)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Resource Description Size should not be greater than 65535 characters. ')

        const lengthEquals65535Chars = {
            resourceIds: {
                key: 'value'
            },
            description: randomString.generate({
                length: 65535
            })
        }
        errorMsg = await validateResource(lengthEquals65535Chars)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

    })

    it('should validate resource.resourceProperties', async () => {
        let errorMsg = '';

        const undefinedResourceProp = {
            resourceIds: {
                key: 'value'
            },
        }
        errorMsg = await validateResource(undefinedResourceProp)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const emptyResourceProp = {
            resourceIds: {
                key: 'value'
            },
            resourceProperties: {}
        }
        errorMsg = await validateResource(emptyResourceProp)
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')
        
        const emptyKey = {
            resourceProperties: {
                '' : 'value'
            }
        }
        errorMsg = await validateResource(emptyKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Key should not be null, empty or have trailing spaces. ')

        const leadingSpaceKey = {
            resourceProperties: {
                ' key' : 'value'
            }
        }
        errorMsg = await validateResource(leadingSpaceKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Key should not be null, empty or have trailing spaces. ')

        const trailingSpaceKey = {
            resourceProperties: {
                'key ' : 'value'
            }
        }
        errorMsg = await validateResource(trailingSpaceKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Key should not be null, empty or have trailing spaces. ')

        const leadingAndTrailingSpaceKey = {
            resourceProperties: {
                ' key ' : 'value'
            }
        }
        errorMsg = await validateResource(leadingAndTrailingSpaceKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Key should not be null, empty or have trailing spaces. ')

        type resourceWithProps = {
            resourceIds: any,
            resourceProperties: any
        }
        const keyLengthExceeding255Characters: resourceWithProps = {
            resourceIds: {
                'key': 'value'
            },
            resourceProperties: {}
        }
        keyLengthExceeding255Characters.resourceProperties[randomString.generate({
            length: 256
        })] = 'value'
        errorMsg = await validateResource(keyLengthExceeding255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Key should not be greater than 255 characters. ')

        const keyLengthEquals255Characters: resourceWithProps = {
            resourceIds: {
                'key': 'value'
            },
            resourceProperties: {}
        }
        keyLengthEquals255Characters.resourceProperties[randomString.generate({
            length: 255
        })] = 'value'
        errorMsg = await validateResource(keyLengthEquals255Characters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const invalidCharacterKey = {
            resourceIds: {
                'key': 'value'
            },
            resourceProperties: {
                'test##': 'value'
            }
        }
        errorMsg = await validateResource(invalidCharacterKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Cannot use \'##\' in property name. ')

        const validKey = {
            resourceIds: {
                'testkey': 'value'
            },
            resourceProperties: {
                'testkey': 'value'
            }
        }
        errorMsg = await validateResource(validKey);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const systemProperty = {
            resourceIds: {
                'testkey': 'value'
            },
            resourceProperties: {
                'system.prop': 'value'
            }
        }
        errorMsg = await validateResource(systemProperty);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Resource Properties should not contain system or auto properties : ' + Object.keys(systemProperty.resourceProperties)[0] + '. ')

        const autoProperty = {
            resourceIds: {
                'testkey': 'value'
            },
            resourceProperties: {
                'auto.prop': 'value'
            }
        }
        errorMsg = await validateResource(autoProperty);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('Resource Properties should not contain system or auto properties : ' + Object.keys(autoProperty.resourceProperties)[0] + '. ')

        const emptyValue = {
            resourceIds: {
                'testkey': 'value'
            },
            resourceProperties: {
                'testkey': ''
            }
        }
        errorMsg = await validateResource(emptyValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Value should not be null, empty or have trailing spaces. ')

        const leadingAndTailingSpaceValue = {
            resourceIds: {
                'key': 'value'
            },
            resourceProperties: {
                'key': ' value '
            }
        }
        errorMsg = await validateResource(leadingAndTailingSpaceValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Value should not be null, empty or have trailing spaces. ')

        const leadingSpaceValue = {
            resourceIds: {
                'key': 'value'
            },
            resourceProperties: {
                'key': ' value'
            }
        }
        errorMsg = await validateResource(leadingSpaceValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Value should not be null, empty or have trailing spaces. ')

        const tailingValue = {
            resourceIds: {
                'key': 'value'
            },
            resourceProperties: {
                'key': 'value '
            }
        }
        errorMsg = await validateResource(tailingValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Value should not be null, empty or have trailing spaces. ')

        const valueLengthExceeds24kcharacters = {
            resourceIds: {
                'key': 'value'
            },
            resourceProperties: {
                'key': randomString.generate({
                    length: 24001
                })
            }
        }
        errorMsg = await validateResource(valueLengthExceeds24kcharacters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Resource Properties Value should not be greater than 24000 characters. ')

        const valueLengthEquals24kcharacters = {
            resourceIds: {
                'key': 'value'
            },
            resourceProperties: {
                'key': randomString.generate({
                    length: 24000
                })
            }
        }
        errorMsg = await validateResource(valueLengthEquals24kcharacters);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toBe('')

        const invalidValue = {
            resourceIds: {
                'key' : 'val##ue'
            }
        }
        errorMsg = await validateResource(invalidValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('Invalid ResourceID value: ' + invalidValue.resourceIds['key'] + '. ')

        const validValue = {
            resourceIdss: {
                'key': 'value'
            }
        }
        errorMsg = await validateResource(validValue);
        expect(errorMsg).toBeDefined();
        expect(errorMsg).toContain('')
    })
});