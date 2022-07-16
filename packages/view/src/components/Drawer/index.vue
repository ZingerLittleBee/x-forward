<script setup lang="ts">
import { computed, h, VNode } from 'vue'

interface Props {
    side?: 'left' | 'right'
    trigger?: string | VNode
    contentClass?: string
    modelValue?: boolean
    teleportToBody?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    side: 'left',
    teleportToBody: true
})

const emit = defineEmits(['update:modelValue'])

const { side } = props
const sideClass = side === 'left' ? 'drawer' : 'drawer drawer-end'

const containerClasses = computed(() => {
    return props.modelValue ? `${sideClass} h-screen` : `${sideClass} h-0`
})

const Trigger = (props: { trigger: string | VNode; value?: boolean }) => {
    const { trigger } = props
    if (typeof trigger === 'string') {
        return h(
            'label',
            {
                class: 'btn btn-primary drawer-button',
                onClick: () => emit('update:modelValue', props.value)
            },
            trigger
        )
    }
    return h(
        'div',
        {
            onClick: () => emit('update:modelValue', props.value)
        },
        h(trigger)
    )
}
</script>

<template>
    <teleport to="body" :disabled="!props.teleportToBody">
        <div class="absolute top-0 left-0 z-50" :class="containerClasses">
            <input
                id="my-drawer"
                type="checkbox"
                :checked="modelValue"
                @change="e => emit('update:modelValue', e.target.checked)"
                class="drawer-toggle"
            />
            <div class="drawer-content">
                <template v-if="props.trigger && !$slots.trigger">
                    <Trigger :trigger="props.trigger" :value="props.modelValue" />
                </template>
                <div v-else @click="() => (checked = !checked)">
                    <slot name="trigger" />
                </div>
            </div>
            <div class="drawer-side">
                <label for="my-drawer" class="drawer-overlay"></label>
                <div class="drawer-side__overlay" :class="contentClass">
                    <slot />
                </div>
            </div>
        </div>
    </teleport>
</template>

<style scoped>
.drawer-side__overlay {
    @apply w-fit bg-base-100 text-base-content;
}
</style>
