<script setup lang="ts">
type ModalProps = {
    modelValue: boolean
    title?: string
    titleClasses?: string
    closeAble?: boolean
    confirm?: {
        text?: string
        onConfirm?: () => void
        actionClass?: string
        btnClass?: string
    }
}

const UPDATE_EVENT = 'update:modelValue'

const props = withDefaults(defineProps<ModalProps>(), {
    modelValue: false,
    closeAble: true
})

const emit = defineEmits(['update:modelValue'])

const modalClick = () => {
    props.closeAble && emit(UPDATE_EVENT, !props.modelValue)
}
</script>

<template>
    <div>
        <input
            type="checkbox"
            id="my-modal-6"
            class="modal-toggle"
            :checked="props.modelValue"
            @change="e => emit(UPDATE_EVENT, e.target.checked)"
        />
        <div class="modal modal-bottom sm:modal-middle" @click="modalClick">
            <div class="modal-box relative" @click="e => e.stopPropagation()">
                <button
                    class="btn btn-sm btn-circle absolute right-4 top-5"
                    @click="() => emit(UPDATE_EVENT, !props.modelValue)"
                >
                    ✕
                </button>
                <h3 v-if="props.title" class="font-bold text-lg" :class="props.titleClasses">{{ props.title }}</h3>
                <div class="py-4">
                    <slot />
                </div>
                <div v-if="props.confirm" class="modal-action" :class="props.confirm.actionClass">
                    <button class="btn" :class="props.confirm.btnClass" @click="() => props.confirm.onConfirm?.()">
                        {{ props.confirm.text }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
