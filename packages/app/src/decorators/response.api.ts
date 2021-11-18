import { applyDecorators, Type } from '@nestjs/common'
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

// export const ApiResultResponse = <TModel extends Type<any>>(
//     model?: TModel,
//     options?: { isArray: boolean; isMessage: boolean }
// ) => {
//     const resultSchema = { $ref: getSchemaPath(Result) }
//     const modelSchema = { $ref: getSchemaPath(model) }
//     let allOf: (SchemaObject | ReferenceObject)[] = [resultSchema]
//     if (model) {
//         const properties: SchemaObject['properties'] = {}
//         allOf.push({ properties })
//         if (options?.isArray) {
//             properties.data = {
//                 type: 'array',
//                 items: modelSchema
//             }
//         } else {
//             properties.data = modelSchema
//         }
//     } else {
//         allOf = [
//             {
//                 properties: {
//                     success: { type: 'boolean' },
//                     message: { type: 'string' }
//                 }
//             }
//         ]
//     }
//     return applyDecorators(
//         ApiOkResponse({
//             schema: {
//                 allOf
//             }
//         })
//     )
// }

export const ApiResultResponse = <TModel extends Type<any>>(
    model?: TModel | string,
    options: { isArray?: boolean; isMessage?: boolean } = { isArray: false, isMessage: true }
) => {
    const schema: any = {}
    const resultSchema: any = {}
    schema.properties = resultSchema
    resultSchema['success'] = { type: 'boolean' }
    if (options?.isMessage) {
        resultSchema['message'] = { type: 'string' }
    }
    if (model) {
        if (options.isArray) {
            resultSchema['data'] = {
                type: 'array',
                items: typeof model === 'string' ? { type: model } : { $ref: getSchemaPath(model) }
            }
        } else {
            if (typeof model === 'string') {
                resultSchema['data'] = { type: model }
            } else {
                resultSchema['data'] = { $ref: getSchemaPath(model) }
            }
        }
    }
    return applyDecorators(
        ApiOkResponse({
            schema: schema
        })
    )
}
