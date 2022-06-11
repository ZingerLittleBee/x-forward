<template>
    <div class="h-full overflow-hidden">
        <div class="flex flex-col h-full w-full">
            <Header class="border-b-2 border-indigo-500" />
            <div class="flex flex-row w-full h-full overflow-auto">
                <div>
                    <SideBar class="overflow-auto" />
                </div>
                <div class="flex flex-col h-full w-full">
                    <div class="overflow-auto h-full bg-base-200">
                        <Container />
                    </div>
                    <div class="relative">
                        <Footer class="relative bottom-0" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Container from './Container/index.vue'
import Footer from './Footer/index.vue'
import Header from './Header/index.vue'
import SideBar from './SideBar/index'
export default {
    components: { Container, SideBar, Footer, Header }
}
</script>
