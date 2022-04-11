import { isObject } from '@forwardx/shared'
import { ChannelOptions, credentials, loadPackageDefinition } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import { Inject, Injectable } from '@nestjs/common'
import { GrpcOptions } from '@nestjs/microservices'
import { isFunction } from 'lodash'
import { Observable, Subscription } from 'rxjs'
import { GRPC_CANCELLED, GRPC_CLIENT_REGISTER_OPTIONS } from './constants'
import { GrpcClientRegisterOptions } from './grpc-client-register.module'

// https://github.com/nestjs/nest/blob/master/packages/microservices/client/client-grpc.ts
@Injectable()
export class GrpcClientRegisterService {
    constructor(@Inject(GRPC_CLIENT_REGISTER_OPTIONS) private registerOptions: GrpcClientRegisterOptions) {
        const packageDefinition = loadSync(registerOptions.protoPath, registerOptions.grpcOptions?.options?.loader)
        this.proto = loadPackageDefinition(packageDefinition)[registerOptions.protoName]
    }
    protected grpcClients = []

    private proto

    public getService<T extends {}>(url: string): T {
        const grpcClient = this.createClientByServiceName(url, this.registerOptions.serviceName)
        const clientRef = this.proto
        if (!clientRef) {
            throw new Error('grpc clientRef is null')
        }

        const protoMethods = Object.keys(clientRef[this.registerOptions.serviceName].prototype)
        const grpcService = {} as T

        protoMethods.forEach(m => {
            grpcService[m] = this.createServiceMethod(grpcClient, m)
        })
        return grpcService
    }

    public createClientByServiceName(url: string, name: string) {
        const clientRef = this.proto
        const loaderOptions = this.registerOptions.grpcOptions?.options
        if (!clientRef) {
            throw new Error()
        }
        const channelOptions: ChannelOptions = loaderOptions?.channelOptions ? loaderOptions?.channelOptions : {}
        if (loaderOptions?.maxSendMessageLength) {
            channelOptions['grpc.max_send_message_length'] = loaderOptions.maxSendMessageLength
        }
        if (loaderOptions?.maxReceiveMessageLength) {
            channelOptions['grpc.max_receive_message_length'] = loaderOptions.maxReceiveMessageLength
        }
        if (loaderOptions?.maxMetadataSize) {
            channelOptions['grpc.max_metadata_size'] = loaderOptions.maxMetadataSize
        }

        const keepaliveOptions = this.getKeepaliveOptions()
        const options: Record<string, string | number> = {
            ...channelOptions,
            ...keepaliveOptions
        }
        const grpcClient = new clientRef[name](url, loaderOptions?.credentials || credentials.createInsecure(), options)
        return grpcClient
    }

    public getKeepaliveOptions() {
        if (!isObject(this.registerOptions.grpcOptions?.options?.keepalive)) {
            return {}
        }
        const keepaliveKeys: Record<keyof GrpcOptions['options']['keepalive'], string> = {
            keepaliveTimeMs: 'grpc.keepalive_time_ms',
            keepaliveTimeoutMs: 'grpc.keepalive_timeout_ms',
            keepalivePermitWithoutCalls: 'grpc.keepalive_permit_without_calls',
            http2MaxPingsWithoutData: 'grpc.http2.max_pings_without_data',
            http2MinTimeBetweenPingsMs: 'grpc.http2.min_time_between_pings_ms',
            http2MinPingIntervalWithoutDataMs: 'grpc.http2.min_ping_interval_without_data_ms',
            http2MaxPingStrikes: 'grpc.http2.max_ping_strikes'
        }

        const keepaliveOptions = {}
        for (const [optionKey, optionValue] of Object.entries(this.registerOptions.grpcOptions.options.keepalive)) {
            const key = keepaliveKeys[optionKey]
            if (key === undefined) {
                continue
            }
            keepaliveOptions[key] = optionValue
        }
        return keepaliveOptions
    }

    public createServiceMethod(client: any, methodName: string): (...args: unknown[]) => Observable<unknown> {
        return client[methodName].responseStream
            ? this.createStreamServiceMethod(client, methodName)
            : this.createUnaryServiceMethod(client, methodName)
    }

    public createStreamServiceMethod(client: unknown, methodName: string): (...args: any[]) => Observable<any> {
        return (...args: any[]) => {
            const isRequestStream = client[methodName].requestStream
            const stream = new Observable(observer => {
                let isClientCanceled = false
                let upstreamSubscription: Subscription

                const upstreamSubjectOrData = args[0]
                const maybeMetadata = args[1]

                const isUpstreamSubject = upstreamSubjectOrData && isFunction(upstreamSubjectOrData.subscribe)

                const call =
                    isRequestStream && isUpstreamSubject
                        ? client[methodName](maybeMetadata)
                        : client[methodName](...args)

                if (isRequestStream && isUpstreamSubject) {
                    upstreamSubscription = upstreamSubjectOrData.subscribe(
                        (val: unknown) => call.write(val),
                        (err: unknown) => call.emit('error', err),
                        () => call.end()
                    )
                }
                call.on('data', (data: any) => observer.next(data))
                call.on('error', (error: any) => {
                    if (error.details === GRPC_CANCELLED) {
                        call.destroy()
                        if (isClientCanceled) {
                            return
                        }
                    }
                    observer.error(error)
                })
                call.on('end', () => {
                    if (upstreamSubscription) {
                        upstreamSubscription.unsubscribe()
                        upstreamSubscription = null
                    }
                    call.removeAllListeners()
                    observer.complete()
                })
                return () => {
                    if (upstreamSubscription) {
                        upstreamSubscription.unsubscribe()
                        upstreamSubscription = null
                    }

                    if (call.finished) {
                        return undefined
                    }
                    isClientCanceled = true
                    call.cancel()
                }
            })
            return stream
        }
    }

    public createUnaryServiceMethod(client: any, methodName: string): (...args: any[]) => Observable<any> {
        return (...args: any[]) => {
            const isRequestStream = client[methodName].requestStream
            const upstreamSubjectOrData = args[0]
            const isUpstreamSubject = upstreamSubjectOrData && isFunction(upstreamSubjectOrData.subscribe)

            if (isRequestStream && isUpstreamSubject) {
                return new Observable(observer => {
                    const callArgs = [
                        (error: unknown, data: unknown) => {
                            if (error) {
                                return observer.error(error)
                            }
                            observer.next(data)
                            observer.complete()
                        }
                    ]
                    const maybeMetadata = args[1]
                    if (maybeMetadata) {
                        callArgs.unshift(maybeMetadata)
                    }
                    const call = client[methodName](...callArgs)

                    const upstreamSubscription: Subscription = upstreamSubjectOrData.subscribe(
                        (val: unknown) => call.write(val),
                        (err: unknown) => call.emit('error', err),
                        () => call.end()
                    )

                    return () => {
                        upstreamSubscription.unsubscribe()
                    }
                })
            }
            return new Observable(observer => {
                client[methodName](...args, (error: any, data: any) => {
                    if (error) {
                        return observer.error(error)
                    }
                    observer.next(data)
                    observer.complete()
                })
            })
        }
    }
}
