<template>
    <div>
        <div>Client</div>
        <button @click="handleClick">Click Me</button>
    </div>
</template>

<script setup lang="ts">
import { getAllClient } from '../../request'

const handleClick = async () => {
    const { data } = await getAllClient()
    console.log('getAllClient', data.value)
}
</script>
