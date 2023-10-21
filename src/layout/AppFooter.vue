<script setup>
import { computed } from 'vue';

const logoUrl = computed(() => {
    return `layout/images/lyfegen-logo.png`;
});
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl" alt="Logo" height="20" class="mr-2" />
        by
        <span class="font-medium ml-2">Victor Sandersen</span>
    </div>
</template>
<style lang="scss" scoped></style>
