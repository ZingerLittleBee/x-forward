<template>
    <div class="grid place-content-center">
        <!--        <button class="btn" @click="handleClick">Click Me</button>-->
        <!--        <card id="123" :group="cardGroup" :btn-group="btnGroup" />-->
        <!--        <toggle />-->
        <Form :store="store" :on-submit="handleSubmit" class="w-96">
            <FormItem.Field name="username" label="username">
                <input class="input input-bordered input-primary w-full" />
            </FormItem.Field>
            <FormItem.Field name="password" label="password">
                <input type="password" class="input input-bordered input-secondary w-full" />
            </FormItem.Field>
            <FormItem.Field name="check" label="check">
                <input
                    type="checkbox"
                    class="checkbox"
                    @change="e => store.set('checkbox', (e.target as HTMLInputElement).checked ? 1 : 0)"
                />
            </FormItem.Field>
            <FormItem.Field name="toggle" label="check">
                <input
                    type="checkbox"
                    class="toggle"
                    @change="e => store.set('toggle', (e.target as HTMLInputElement).checked ? 1 : 0)"
                />
            </FormItem.Field>
            <button class="btn">Submit</button>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { BtnGroup } from '@/components/Card'
import { FormStore } from '@/components/form/formStore'
import Form from '@/components/form/index.vue'
import { Alert } from '@/plugins/alert'
import { inject } from 'vue'
import IconModule from '~icons/mdi/view-dashboard-outline'

let store = new FormStore({
    username: 'username',
    password: 'password'
})

const handleSubmit = () => {
    console.log('Submit', store.get())
}
const alert = inject<(props: Alert) => void>('$alert')
const handleClick = () => {
    alert?.({
        message: 'Ok',
        type: 'success'
    })
}
const cardGroup = [
    {
        key: '转发规则',
        value: 'www.123456.xyz',
        type: 'success'
    },
    {
        key: '转发规则',
        value: 'baidu.com'
    },
    {
        key: '转发规则',
        value: 'baidu.com',
        type: 'secondary'
    },
    {
        key: '转发规则',
        value: 'baidu.com'
    },
    {
        key: '转发规则',
        value: 'baidu.com'
    },
    {
        key: '转发规则',
        value: 'baidu.com'
    },
    {
        key: '转发规则',
        value: 'baidu.com'
    },
    {
        key: '转发规则',
        value: 'baidu.com'
    }
]

const btnGroup: BtnGroup = {
    leftBtn: {
        message: 'BUTTON',
        type: 'accent',
        onClick: (id: string) => console.log('id', id)
    },
    centerBtn: {
        message: '123',
        onClick: (id: string) => console.log('id', id)
    },
    rightBtn: {
        message: '123',
        type: 'secondary',
        icon: IconModule,
        onClick: (id: string) => console.log('id', id)
    }
}
</script>
