<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <div :key="$route.name">
                <component :is="Component" />
            </div>
        </transition>
    </router-view>
</template>

<script>
export default {
    name: 'Container'
}
</script>
