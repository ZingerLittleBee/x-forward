<template>
    <Layout />
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { themeChange } from 'theme-change'
import { onMounted } from 'vue'
import { useClientStore } from './stores/client'

// init client
const clientStore = useClientStore()
clientStore.initClient()

onMounted(() => {
    themeChange(false)
})
</script>

<style>
html,
body,
#app {
    height: 100%;
}
</style>
