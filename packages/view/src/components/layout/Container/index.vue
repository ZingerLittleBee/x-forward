<template>
    <router-view v-slot="{ Component }">
        <transition name="container-fade">
            <div :key="$route.name" class="h-full">
                <component :is="Component" />
            </div>
        </transition>
    </router-view>
</template>

<script>
import './index.css'
export default {
    name: 'Container'
}
</script>
