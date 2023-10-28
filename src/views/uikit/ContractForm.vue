<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const expandedRows = ref([]);

const insuranceCompany = ref(null);
const selectedProduct = ref(null);
const duration = ref(null);
const ppp1 = ref(null);
const ppp2 = ref(null);
const ppp3 = ref(null);
const ppp4 = ref(null);

const { mutate: addContractMutation } = useMutation(
    gql`
        mutation CreateContract($contractInput: ContractInput) {
            createContract(contractInput: $contractInput) {
                insuranceCompany
                product {
                    brand
                    packSize
                    price
                    solution
                }
                duration
                ppp1
                ppp2
                ppp3
                ppp4
            }
        }
    `
);

const { mutate: deleteContractMutation } = useMutation(
    gql`
        mutation DeleteContract($id: ID!) {
            deleteContract(ID: $id)
        }
    `
);

const addContract = async () => {
    if (!insuranceCompany.value || !selectedProduct.value || !duration.value || ppp1.value === null || ppp2.value === null || ppp3.value === null || ppp4.value === null) {
        console.error('Invalid input for create operation. Please provide valid patient data.');
        return;
    }
    try {
        const response = await addContractMutation({
            contractInput: {
                insuranceCompany: insuranceCompany.value,
                product: (({ brand, solution, packSize, price }) => ({
                    brand,
                    solution,
                    packSize,
                    price
                }))(selectedProduct.value),
                duration: duration.value,
                ppp1: parseFloat(ppp1.value),
                ppp2: parseFloat(ppp2.value),
                ppp3: parseFloat(ppp3.value),
                ppp4: parseFloat(ppp4.value)
            }
        });
        console.log('Contract added successfully:', response.data.createContract);
        // Reset the form fields after successful submission
        insuranceCompany.value = null;
        selectedProduct.value = null;
        duration.value = null;
        ppp1.value = null;
        ppp2.value = null;
        ppp3.value = null;
        ppp4.value = null;
    } catch (error) {
        console.error('Error adding patient:', error.message);
    }
};

const deleteContract = async (contractId) => {
    try {
        const response = await deleteContractMutation({
            id: contractId
        });
        console.log('Contract deleted successfully:', response.data.deleteContract);
    } catch (error) {
        console.error('Error deleting contract:', error.message);
    }
};

const { result: contractResult } = useQuery(gql`
    query AllContracts {
        allContracts {
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
        }
    }
`);

const contracts = computed(() => contractResult.value?.allContracts ?? []);

const { result: productResult } = useQuery(gql`
    query Product {
        allProducts {
            brand
            price
            packSize
            solution
        }
    }
`);
const products = computed(() => productResult.value?.allProducts ?? []);
</script>

<template>
    <div className="card">
        <h5>Create Contract</h5>
        <div class="field grid">
            <label for="insuranceCompany" class="col-12 mb-2 md:col-2 md:mb-0">Insurance Company</label>
            <div class="col-12 md:col-10">
                <InputText v-model="insuranceCompany" id="insuranceCompany" type="text" />
            </div>
        </div>
        <div class="field grid">
            <label for="productTable" class="col-12 mb-2 md:col-2 md:mb-0">Product</label>
            <DataTable v-model:selection="selectedProduct" :value="products" id="productTable">
                <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                <Column field="brand" header="Brand"></Column>
                <Column field="solution" header="Solution"></Column>
                <Column field="packSize" header="Pack Size"></Column>
                <Column field="price" header="Price"></Column>
            </DataTable>
        </div>
        <div class="field grid">
            <label for="duration" class="col-12 mb-2 md:col-2 md:mb-0">Duration</label>
            <div class="col-12 md:col-10">
                <InputText v-model="duration" id="duration" type="text" />
            </div>
        </div>
        <div class="field grid">
            <label for="ppp1" class="col-12 mb-2 md:col-2 md:mb-0">Price Per Patient 1.</label>
            <div class="col-12 md:col-10">
                <InputText v-model="ppp1" id="ppp1" type="number" />
            </div>
        </div>
        <div class="field grid">
            <label for="ppp2" class="col-12 mb-2 md:col-2 md:mb-0">Price Per Patient 2.</label>
            <div class="col-12 md:col-10">
                <InputText v-model="ppp2" id="ppp2" type="number" />
            </div>
        </div>
        <div class="field grid">
            <label for="ppp3" class="col-12 mb-2 md:col-2 md:mb-0">Price Per Patient 3.</label>
            <div class="col-12 md:col-10">
                <InputText v-model="ppp3" id="ppp3" type="number" />
            </div>
        </div>
        <div class="field grid">
            <label for="ppp4" class="col-12 mb-2 md:col-2 md:mb-0">Price Per Patient 4.</label>
            <div class="col-12 md:col-10">
                <InputText v-model="ppp4" id="ppp4" type="number" />
            </div>
        </div>
        <Button @click="addContract" label="Submit" class="mr-2 mb-2"></Button>
    </div>

    <div className="card">
        <DataTable v-model:expandedRows="expandedRows" :value="contracts" dataKey="_id" tableStyle="min-width: 60rem">
            <Column expander style="width: 5rem" />
            <Column field="insuranceCompany" header="Insurance Company"></Column>
            <Column field="product.brand" header="Product"></Column>
            <Column field="duration" header="Duration"></Column>
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
            <Column header="Delete"
                ><template #body="{ data }"> <Button @click="deleteContract(data._id)" icon="pi pi-trash" class="p-button-danger" /> </template
            ></Column>
            <template #expansion="contract">
                <div class="p-3">
                    <h6>Enrolled in this contract:</h6>
                    <DataTable :value="contract.data.enrolled">
                        <Column field="insuranceCompany" header="Insurance Company"></Column>
                        <Column field="cancerStage" header="Cancer Stage"></Column>
                        <Column field="age" header="Age"></Column>
                        <Column field="product.brand" header="Product"></Column>
                        <Column field="treatmentStart" header="Treatment Start"></Column>
                        <Column field="death" header="Death"></Column>
                        <Column field="progression" header="Progression"></Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>
