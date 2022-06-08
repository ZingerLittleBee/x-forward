<template>
    <div class="p-4">
        <template v-for="card in cards" :key="card.id">
            <card :id="card.id" :group="card.group" :btn-group="btnGroup" width="w-80" />
        </template>
    </div>
</template>

<script setup lang="ts">
import Card, { BtnGroup, Content } from '@/components/Card/index'
import { useClientStore } from '@/stores/client'
import { ClientEnum } from '@forwardx/shared'
import { ClientVo } from '@x-forward/app/apps/x-forward-server/src/modules/client/vo/client.vo'
import { onMounted, ref } from 'vue'

const cards = ref<{ id: string; group: Content[] }[]>([])

const btnGroup: BtnGroup = {
    leftBtn: {
        message: '编辑',
        type: 'accent',
        onClick: (id: string) => console.log('id', id)
    },
    rightBtn: {
        message: '启用',
        onClick: (id: string) => console.log('id', id)
    }
}

const clientStore = useClientStore()

onMounted(async () => {
    if (!clientStore.getCurrentClientId) {
        await clientStore.initClient()
    }
    clientStore.clients?.forEach((client: ClientVo) => {
        cards.value.push({
            id: client.id ? client.id : '',
            group: Object.keys(client)
                .filter(key => (ClientEnum as Record<string, string>)[key])
                .map((key, index) => {
                    return {
                        index,
                        key: (ClientEnum as Record<string, string>)[key],
                        value: (client as Record<string, string>)[key]
                    }
                })
        })
    })
})
</script>
