<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            {
                label: 'Contracts',
                icon: 'pi pi-fw pi-clone',
                items: [
                    {
                        label: 'Create Contract',
                        icon: 'pi pi-fw pi-file',
                        to: '/contractform'
                    },
                    {
                        label: 'Contract Status',
                        icon: 'pi pi-fw pi-check-square',
                        to: '/contractstatus'
                    }
                ]
            },
            {
                label: 'Patients',
                icon: 'pi pi-fw pi-id-card',
                to: '/patientform'
            },
            { label: 'Create Product', icon: 'pi pi-fw pi-cart-plus', to: '/productform' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
