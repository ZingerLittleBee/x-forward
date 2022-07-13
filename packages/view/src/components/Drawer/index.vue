<script setup lang="ts">
import { h, ref, VNode } from 'vue'

interface Props {
    side?: 'left' | 'right'
    trigger?: string | VNode
    contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
    side: 'left',
    trigger: 'Open drawer'
})

const computedSide = () => {
    const { side } = props
    return side === 'left' ? 'drawer' : 'drawer drawer-end'
}

const checked = ref(false)

const Trigger = (props: { trigger: string | VNode }) => {
    const { trigger } = props
    if (typeof trigger === 'string') {
        return h(
            'label',
            {
                class: 'btn btn-primary drawer-button',
                onClick: () => (checked.value = !checked.value)
            },
            trigger
        )
    }
    return h(
        'div',
        {
            onClick: () => (checked.value = !checked.value)
        },
        h(trigger)
    )
}
</script>

<template>
    <div :class="computedSide()">
        <input id="my-drawer" type="checkbox" v-model="checked" class="drawer-toggle" />
        <div class="drawer-content">
            <template v-if="!$slots.trigger">
                <Trigger :trigger="props.trigger" />
            </template>
            <div v-else @click="() => (checked = !checked)">
                <slot name="trigger" />
            </div>
        </div>
        <div class="drawer-side">
            <label for="my-drawer" class="drawer-overlay"></label>
            <div class="drawer-side__overlay" :class="contentClass">
                <slot name="content" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.drawer-side__overlay {
    @apply w-fit bg-base-100 text-base-content;
}
</style>
