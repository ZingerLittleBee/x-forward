<template>
    <div>
        <button class="btn" @click="handleClick">Click Me</button>
        <card id="123" :group="cardGroup" :btn-group="btnGroup" />
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { Alert } from '@/plugins/alert'
import Card, { BtnGroup } from '@/components/Card/index'
import IconModule from '~icons/mdi/view-dashboard-outline'

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
