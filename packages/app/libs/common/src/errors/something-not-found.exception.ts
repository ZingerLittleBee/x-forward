export class SomethingNotFound extends Error {
    constructor(something: string) {
        super(`${something} not found. Please check environment`)
    }
}
