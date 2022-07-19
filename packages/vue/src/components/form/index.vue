<script lang="ts">
export const STORE = Symbol('store')
</script>

<script setup lang="ts">
import { provide } from 'vue'
const props = defineProps(['store', 'onSubmit'])
provide(STORE, props.store)
</script>

<template>
    <form
        @submit="props.onSubmit"
        class="grid grid-cols-1 gap-4 p-4 content-center place-content-center justify-center items-center rounded-xl shadow-xl bg-base-100"
    >
        <slot />
    </form>
</template>
