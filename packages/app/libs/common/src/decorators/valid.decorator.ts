import { registerDecorator, ValidationOptions } from 'class-validator'
import { ipRegExp, domainRegExp, getValuesOfEnum, unitRegExp } from '@x-forward/shared'

export function IsHost(validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isHost',
            target: object.constructor,
            propertyName: propertyName,
            options: { message: `${propertyName} must be valid IP or Domain`, ...validationOptions },
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false
                    return ipRegExp.test(value) || domainRegExp.test(value)
                }
            }
        })
    }
}

export function IsPort(validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isPort',
            target: object.constructor,
            propertyName: propertyName,
            options: { message: `${propertyName} must be number and range in 0 to 65535`, ...validationOptions },
            validator: {
                validate(value: any) {
                    if (typeof value !== 'number') return false
                    return Number(value) <= 65535 && Number(value) >= 0
                }
            }
        })
    }
}

export function IsNginxUnit(unitEnum: Record<string, string | number>, validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'IsNginxUnit',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: `${propertyName} must be end with ${getValuesOfEnum(unitEnum)}`,
                ...validationOptions
            },
            validator: {
                validate(value: any) {
                    if (typeof value !== 'string') return false
                    if (value === '0') return true
                    return unitRegExp(unitEnum).test(value)
                }
            }
        })
    }
}
