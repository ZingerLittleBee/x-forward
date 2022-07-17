<template>
    <div class="grid place-content-center">
        <!--        <button class="btn" @click="handleClick">Click Me</button>-->
        <!--        <card id="123" :group="cardGroup" :btn-group="btnGroup" />-->
        <!--        <toggle />-->
        <Form :store="props.store" :on-submit="handleSubmit" class="w-96">
            <Field name="upstreamHost" label="上游地址">
                <input class="input input-bordered input-primary w-full h-10" />
            </Field>
            <Field name="upstreamPort" label="上游端口">
                <input class="input input-bordered input-secondary w-full h-10" />
            </Field>
            <Field name="weight" label="权重">
                <input class="input input-bordered input-primary w-1/3 h-8" />
            </Field>
            <Field name="maxCons" label="最大连接数">
                <input class="input input-bordered input-primary w-1/3 h-8" />
            </Field>
            <Field name="maxFails" label="最大失败次数">
                <input class="input input-bordered input-primary w-1/3 h-8" />
            </Field>
            <Field name="failTimeout" label="超时时间">
                <input class="input input-bordered input-primary w-1/3 h-8" />
            </Field>
            <Field name="backup" label="是否备用">
                <input type="checkbox" class="checkbox" />
            </Field>
            <Field name="down" label="是否关闭">
                <input type="checkbox" class="checkbox" />
            </Field>
            <button class="btn">Submit</button>
        </Form>
    </div>
</template>

<script setup lang="ts">
import Field from '@/components/form/field'
import Form from '@/components/form/index.vue'
import { Alert } from '@/plugins/alert'
import { inject, watch } from 'vue'

const props = defineProps<{
    store: any
}>()

watch(props, () => {
    console.log('props changed', props.store)
})

const handleSubmit = () => {
    console.log('Submit', props.store?.get())
}

const alert = inject<(props: Alert) => void>('$alert')
</script>
