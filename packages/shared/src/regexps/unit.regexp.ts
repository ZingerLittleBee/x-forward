import { getValuesOfEnum } from '../utils/enum.utils'

export const unitRegExp = (unitEnum: Record<string, string | number>) =>
    new RegExp('^\\d+[' + getValuesOfEnum(unitEnum)?.join('') + ']$')
