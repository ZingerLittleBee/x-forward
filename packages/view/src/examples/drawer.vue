<template>
    <Drawer class="h-full" side="right" content-class="drawer-example__content">
        <template #trigger>
            <button class="btn btn-primary drawer-button">Open drawer slot</button>
        </template>
        <template #content>
            <div class="h-full flex justify-center">
                <FormExample />
            </div>
        </template>
    </Drawer>
</template>

<script setup lang="ts">
import Drawer from '@/components/Drawer/index.vue'
import FormExample from '@/examples/form.vue'
</script>

<style>
.drawer-example__content {
    @apply p-4 bg-transparent !important;
}
</style>
