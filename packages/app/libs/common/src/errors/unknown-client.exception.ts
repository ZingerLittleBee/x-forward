export class UnknownClient extends Error {
    constructor() {
        super(`Unknown client come to light, Please check register or not`)
    }
}
