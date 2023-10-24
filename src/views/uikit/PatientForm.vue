<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const insuranceCompany = ref(null);
const cancerStage = ref(null);
const age = ref(null);
const selectedProduct = ref(null);
const treatmentStart = ref(null);
const os = ref(null);
const pfs = ref(null);

const { mutate: addPatientMutation } = useMutation(
    gql`
        mutation CreatePatient($patientInput: PatientInput) {
            createPatient(patientInput: $patientInput) {
                age
                cancerStage
                insuranceCompany
                os
                pfs
                product {
                    brand
                    packSize
                    price
                    solution
                }
                treatmentStart
            }
        }
    `
);

const { mutate: deletePatientMutation } = useMutation(
    gql`
        mutation DeletePatient($patientInput: PatientInput) {
            deletePatient(patientInput: $patientInput)
        }
    `
);

const addPatient = async () => {
    if (!cancerStage.value || !selectedProduct.value || !treatmentStart.value) {
        console.error('Invalid input for create operation. Please provide valid patient data.');
        return;
    }
    try {
        const response = await addPatientMutation({
            patientInput: {
                insuranceCompany: insuranceCompany.value,
                cancerStage: parseInt(cancerStage.value),
                age: parseInt(age.value),
                product: (({ brand, solution, packSize, price }) => ({
                    brand,
                    solution,
                    packSize,
                    price
                }))(selectedProduct.value),
                treatmentStart: treatmentStart.value,
                os: os.value,
                pfs: pfs.value
            }
        });
        console.log('Patient added successfully:', response.data.createPatient);
        // Reset the form fields after successful submission
        cancerStage.value = null;
        selectedProduct.value = null;
        treatmentStart.value = null;
    } catch (error) {
        console.error('Error adding patient:', error.message);
    }
};

const deletePatient = async (data) => {
    if (!data.data.cancerStage || !data.data.product || !data.data.treatmentStart) {
        console.error('Invalid input for delete operation. Please provide valid patient data.');
        return;
    }

    try {
        const response = await deletePatientMutation({
            patientInput: {
                insuranceCompany: data.data.insuranceCompany,
                cancerStage: data.data.cancerStage,
                age: data.data.age,
                product: (({ brand, solution, packSize, price }) => ({
                    brand,
                    solution,
                    packSize,
                    price
                }))(data.data.product),
                treatmentStart: data.data.treatmentStart,
                os: data.data.os,
                pfs: data.data.pfs
            }
        });
        console.log('Patient deleted successfully:', response.data.deletePatient);
    } catch (error) {
        console.error('Error deleting patient:', error.message);
    }
};

const { result: patientResult } = useQuery(gql`
    query AllPatients {
        allPatients {
            insuranceCompany
            cancerStage
            age
            product {
                brand
                packSize
                price
                solution
            }
            treatmentStart
            os
            pfs
        }
    }
`);

const patients = computed(() => patientResult.value?.allPatients ?? []);

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
        <h5>Add Patient</h5>
        <div class="field grid">
            <label for="insuranceCompany" class="col-12 mb-2 md:col-2 md:mb-0">Insurance Company</label>
            <div class="col-12 md:col-10">
                <InputText v-model="insuranceCompany" id="insuranceCompany" type="text" />
            </div>
        </div>
        <div class="field grid">
            <label for="cancerStage" class="col-12 mb-2 md:col-2 md:mb-0">Cancer Stage</label>
            <div class="col-12 md:col-10">
                <InputText v-model="cancerStage" id="cancerStage" type="number" />
            </div>
        </div>
        <div class="field grid">
            <label for="age" class="col-12 mb-2 md:col-2 md:mb-0">Age</label>
            <div class="col-12 md:col-10">
                <InputText v-model="age" id="age" type="number" />
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
            <label for="treatmentStart" class="col-12 mb-2 md:col-2 md:mb-0">Treatment Start</label>
            <div class="col-12 md:col-10">
                <InputText v-model="treatmentStart" id="treatmentStart" type="date" />
            </div>
        </div>
        <div class="field grid">
            <label for="os" class="col-12 mb-2 md:col-2 md:mb-0">OS</label>
            <div class="col-12 md:col-10">
                <InputText v-model="os" id="os" type="date" />
            </div>
        </div>
        <div class="field grid">
            <label for="pfs" class="col-12 mb-2 md:col-2 md:mb-0">PFS</label>
            <div class="col-12 md:col-10">
                <InputText v-model="pfs" id="pfs" type="date" />
            </div>
        </div>
        <Button @click="addPatient" label="Submit" class="mr-2 mb-2"></Button>
    </div>

    <div className="card">
        <DataTable :value="patients" tableStyle="min-width: 50rem">
            <Column field="insuranceCompany" header="Insurance Company"></Column>
            <Column field="cancerStage" header="Cancer Stage"></Column>
            <Column field="product.brand" header="Product"></Column>
            <Column field="treatmentStart" header="Treatment Start"></Column>
            <Column field="os" header="OS"></Column>
            <Column field="pfs" header="PFS"></Column>
            <Column header="Delete"
                ><template #body="{ data }"> <Button @click="deletePatient({ data })" icon="pi pi-trash" class="p-button-danger" /> </template
            ></Column>
        </DataTable>
    </div>
</template>
