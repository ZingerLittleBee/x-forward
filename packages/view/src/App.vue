<template>
    <Layout />
</template>

<script setup lang="ts">
import { themeChange } from 'theme-change'
import { onMounted } from 'vue'
import Layout from '@/components/layout/index.vue'

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
