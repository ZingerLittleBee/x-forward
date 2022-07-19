<script setup lang="ts">
import Selector, { BadgeType, SelectItem } from '@/components/Selector'
import { useClientStore } from '@/stores/client'
import { IsOrNotEnum } from '@forwardx/shared'
import { computed, shallowRef, watchEffect } from 'vue'
import IconModule from '~icons/mdi/view-dashboard-outline'

const clientStore = useClientStore()

const selector = shallowRef<SelectItem[]>([])

const defaultSelectedId = computed(() => clientStore.currentClentId)

const status = (isOnline?: IsOrNotEnum): { type: BadgeType; tips: string } => {
    if (isOnline === IsOrNotEnum.True) {
        return {
            type: 'success',
            tips: '在线'
        }
    }
    if (isOnline === IsOrNotEnum.False) {
        return {
            type: 'warning',
            tips: '离线'
        }
    }
    return {
        type: 'error',
        tips: '未知'
    }
}

watchEffect(() => {
    clientStore.clients?.forEach(c => {
        if (c.id) {
            selector.value.push({
                id: c.id,
                message: c.domain ? c.domain : c.ip ? c.ip : '',
                badge: status(c.isOnline),
                icon: IconModule,
                onClick: () => {
                    c.id && clientStore.changeCurrentClient(c.id)
                }
            })
        }
    })
})
</script>

<template>
    <Selector :list="selector" :default-selected-id="defaultSelectedId" placeHolder="Select Client" />
</template>
