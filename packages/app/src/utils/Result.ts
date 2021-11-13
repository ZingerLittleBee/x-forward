export class Result<T> {
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

    static okMsg(message: string) {
        return {
            success: true,
            message
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

    static noWithMsg(message: string) {
        return {
            success: false,
            message
        }
    }
}
