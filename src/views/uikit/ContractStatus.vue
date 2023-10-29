<script setup>
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed } from 'vue';

const expandedRows = ref([]);

const { result } = useQuery(gql`
    query GetContractStatus {
        getContractStatus {
            _id
            insuranceCompany
            duration
            ppp1
            ppp2
            ppp3
            ppp4
            product {
                brand
                packSize
                price
                solution
            }
            enrolled {
                _id
                age
                cancerStage
                insuranceCompany
                treatmentStart
                death
                progression
            }
            payable
            refundable
        }
    }
`);

const contractStatuses = computed(() => result.value?.getContractStatus ?? []);
</script>

<template>
    <div className="card">
        <DataTable v-model:expandedRows="expandedRows" dataKey="_id" :value="contractStatuses" tableStyle="min-width: 50rem">
            <Column expander style="width: 5rem" />
            <Column field="insuranceCompany" header="Insurance Company"></Column>
            <Column field="product.brand" header="Brand"></Column>
            <Column field="product.solution" header="Product"></Column>
            <Column field="product.price" header="Price"></Column>
            <Column field="ppp1" header="Price Per Patient 1.">
                <template #body="contract"> {{ parseFloat(contract.data.ppp1) * 100 }}% </template>
            </Column>
            <Column field="ppp2" header="Price Per Patient 2.">
                <template #body="contract"> {{ parseFloat(contract.data.ppp2) * 100 }}% </template>
            </Column>
            <Column field="ppp3" header="Price Per Patient 3.">
                <template #body="contract"> {{ parseFloat(contract.data.ppp3) * 100 }}% </template>
            </Column>
            <Column field="ppp4" header="Price Per Patient 4.">
                <template #body="contract"> {{ parseFloat(contract.data.ppp4) * 100 }}% </template>
            </Column>
            <Column field="payable" header="Payable"
                ><template #body="contract">{{ contract.data.payable.toFixed(2) }} CHF</template></Column
            >
            <Column field="refundable" header="Refundable"
                ><template #body="contract">{{ contract.data.refundable.toFixed(2) }} CHF</template></Column
            >
            <template #expansion="contract">
                <div class="p-3">
                    <h6>Enrolled in this contract:</h6>
                    <DataTable :value="contract.data.enrolled">
                        <Column field="cancerStage" header="Cancer Stage"></Column>
                        <Column field="age" header="Age"></Column>
                        <Column field="treatmentStart" header="Treatment Start"></Column>
                        <Column field="death" header="Death"></Column>
                        <Column field="progression" header="Progression"></Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>
