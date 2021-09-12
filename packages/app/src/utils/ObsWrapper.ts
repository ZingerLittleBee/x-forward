import { Observable } from "rxjs";

export default function () {

    let observable
    const createObservable = (obsProcess) => {
        observable = new Observable(subscriber => {obsProcess(subscriber)})
        return observable
    }

    const handlerSubscribe = (getNext: Function, handlerError: Function, handlerComplete: Function) => {
        if (!observable) return null
        observable.subscribe({
            next(x) { getNext(x) },
            error(err) { handlerError(err) },
            complete() { handlerComplete() }
          });
    }


    return {
        createObservable,
        handlerSubscribe
    }
}
