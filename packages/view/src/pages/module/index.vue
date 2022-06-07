<template>
    <div>
        <List title="Nginx 参数" :data="nginxInfo" :icon="ParamIcon" />
    </div>
</template>

<script setup lang="ts">
import List, { ListData } from '@/components/List'
import { getNginxInfo } from '@/request/modules/env'
import { useClientStore } from '@/stores/client'
import { onMounted, ref } from 'vue'
import ParamIcon from '~icons/carbon/parameter'

const clientStore = useClientStore()

let nginxInfo = ref<ListData[]>([])

onMounted(async () => {
    if (!clientStore.getCurrentClientId) {
        await clientStore.initClient()
    }
    if (clientStore.getCurrentClientId) {
        const { data } = await getNginxInfo(clientStore.getCurrentClientId)
        let rawData = data.value
        rawData?.args &&
            Object.keys(rawData?.args).map(key => {
                nginxInfo.value.push({
                    key,
                    label: rawData?.args?.[key].label,
                    value: rawData?.args?.[key].value
                })
            })
    }
})
</script>
