<template>
    <div class="flex flex-row space-x-2 p-4 h-full">
        <List class="w-1/2 rounded-lg shadow-lg pt-3" title="Nginx 参数" :data="nginxParam" :icon="ParamIcon" />
        <List class="w-1/2 rounded-lg shadow-lg pt-3" title="Nginx 模块" :data="nginxMoudle" :icon="PackageIcon" />
    </div>
</template>

<script setup lang="ts">
import List, { ListData } from '@/components/List'
import { getNginxInfo } from '@/request/modules/env'
import { useClientStore } from '@/stores/client'
import { onMounted, ref } from 'vue'
import ParamIcon from '~icons/carbon/parameter'
import PackageIcon from '~icons/lucide/package-check'

const clientStore = useClientStore()

let nginxParam = ref<ListData[]>([])
let nginxMoudle = ref<ListData[]>([])

onMounted(async () => {
    if (!clientStore.getCurrentClientId) {
        await clientStore.initClient()
    }
    if (clientStore.getCurrentClientId) {
        const { data } = await getNginxInfo(clientStore.getCurrentClientId)
        let rawData = data.value
        rawData?.args &&
            Object.keys(rawData?.args).forEach(key => {
                nginxParam.value.push({
                    key,
                    label: rawData?.args?.[key].label,
                    value: rawData?.args?.[key].value
                })
            })
        rawData?.module?.forEach(m => {
            nginxMoudle.value.push({
                key: m
            })
        })
    }
})
</script>
