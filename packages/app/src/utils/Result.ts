export class Result<T> {
    constructor() {}

    static ok() {
        return {
            success: true
        }
    }

    static okData(t: any) {
        return {
            success: true,
            data: t
        }
    }

    okWithData(t: T) {
        return {
            success: true,
            data: t
        }
    }

    static no() {
        return {
            success: false
        }
    }

    static noWithMsg(msg: string) {
        return {
            success: false,
            message: msg
        }
    }
}
