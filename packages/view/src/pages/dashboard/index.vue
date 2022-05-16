<template>
    <div>
        <button class="btn" @click="handleClick">Click Me</button>
    </div>
</template>

<script setup lang="ts">
import { AlertProp } from '@/components/Alert'
import { inject } from 'vue'

const createAlert = inject<(props: AlertProp) => void>('createAlert')
const handleClick = () => {
    createAlert?.({
        message: 'Ok',
        type: 'success'
    })
}
</script>
