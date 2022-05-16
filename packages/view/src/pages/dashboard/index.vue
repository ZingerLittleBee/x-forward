<template>
    <div>
        <Alert :visible="visible" message="message" type="success" btnName="confirm" @close="visible = !visible" />
        <button class="btn" @click="visible = !visible">Click Me</button>
    </div>
</template>

<script setup lang="ts">
import Alert from '@/components/Alert/index.tsx'
import { ref } from 'vue'
const visible = ref(true)
</script>
