import { isString } from 'lodash'

export class FormStore {
    private values: any
    private defaultValues: any
    private rules: {
        [key: string]: ((values: any) => boolean | string)[]
    }
    private listeners: any[]
    private errors: any
    constructor(defaultValues = {}, rules = {}) {
        // 表单值
        this.values = defaultValues

        // 表单初始值，用于重置表单
        this.defaultValues = this.values

        // 表单校验规则
        this.rules = rules

        // 事件回调
        this.listeners = []

        this.errors = {}
    }

    subscribe(listener: any) {
        this.listeners.push(listener)

        // 返回一个用于取消订阅的函数
        return () => {
            const index = this.listeners.indexOf(listener)
            if (index > -1) this.listeners.splice(index, 1)
        }
    }

    // 通知表单变动，调用所有listener
    notify(name: string) {
        this.listeners.forEach(listener => listener(name))
    }

    // 获取表单值
    get(name?: string | number) {
        // 如果传入name，返回对应的表单值，否则返回整个表单的值
        return name === undefined ? this.values : this.values[name]
    }

    // 设置表单值
    set(name: string, value: any) {
        this.values[name] = value
        // 表单校验
        this.validate(name)
        // 通知表单变动
        this.notify(name)
    }

    setSome(val: Record<string, any>) {
        this.values = { ...this.values, ...val }
        const keys = Object.keys(val)
        keys.forEach(key => {
            this.validate(key)
            this.notify(key)
        })
    }

    // 重置表单值
    reset() {
        // 清空错误信息
        this.errors = {}
        // 重置默认值
        this.values = this.defaultValues
        // 执行通知
        this.notify('*')
    }

    // 用于设置和获取错误信息
    error(name?: string) {
        return name ? this.errors[name] : this.errors
    }

    setError(name: string, value: any) {
        this.errors[name] = value
    }

    clearError(name?: string) {
        name ? delete this.errors[name] : (this.errors = {})
    }

    // 用于表单校验
    validate(name: string) {
        const validator = this.rules[name]
        const value = this.get(name)
        return validator?.map(v => v(value)).filter(r => isString(r))
    }
}
