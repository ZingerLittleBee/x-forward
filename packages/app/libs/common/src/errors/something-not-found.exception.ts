export class SomethingNotFound extends Error {
    constructor(something: string) {
        super(`${something} not found, please check environment`)
    }
}
