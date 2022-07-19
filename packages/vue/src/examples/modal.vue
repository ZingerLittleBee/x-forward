<script setup lang="ts">
import Modal from '@/components/modal/index.vue'
import FormExample from '@/examples/form.vue'
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
    <button class="btn btn-primary" @click="() => (show = !show)">Show Modal</button>
    <Modal v-model="show" title="编辑规则" :close-able="false">
        <FormExample />
    </Modal>
</template>
