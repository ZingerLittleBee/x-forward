export interface IResult<T> {
    success: boolean
    message?: string
    data?: T
}
