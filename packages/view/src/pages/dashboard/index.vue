<template>
    <div>
        <button class="btn" @click="handleClick">Click Me</button>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { Alert } from '@/plugins/alert'

const alert = inject<(props: Alert) => void>('$alert')
const handleClick = () => {
    alert?.({
        message: 'Ok',
        type: 'success'
    })
}
</script>
