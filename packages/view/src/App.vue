<template>
    <div>
        <button data-set-theme="" class="btn">default</button>
        <button data-set-theme="dark" class="btn">dark</button>
        <!-- The button to open modal -->
        <label for="my-modal" class="btn modal-button">open modal</label>

        <!-- Put this part before </body> tag -->
        <input type="checkbox" id="my-modal" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Congratulations random Interner user!</h3>
                <p class="py-4">
                    You've been selected for a chance to get one year of subscription to use Wikipedia for free!
                </p>
                <div class="modal-action">
                    <label for="my-modal" class="btn">Yay!</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { themeChange } from 'theme-change'
import { onMounted } from 'vue'

onMounted(() => {
    themeChange(false)
})
</script>
