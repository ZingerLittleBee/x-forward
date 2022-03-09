export class NotSerializable extends Error {
    constructor(something: string) {
        super(`${something} not serializable. Please check again`)
    }
}
