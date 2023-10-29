import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/contractform',
                    name: 'contractform',
                    component: () => import('@/views/ContractForm.vue')
                },
                {
                    path: '/contractstatus',
                    name: 'contractstatus',
                    component: () => import('@/views/ContractStatus.vue')
                },
                {
                    path: '/productform',
                    name: 'productform',
                    component: () => import('@/views/ProductForm.vue')
                },
                {
                    path: '/patientform',
                    name: 'patientform',
                    component: () => import('@/views/PatientForm.vue')
                }
            ]
        }
    ]
});

export default router;
