<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const checkboxValue = ref([]);

const diseaseStatus = ref(null);
const product = ref(null);
const treatmentStart = ref(null);

const { mutate: addProductMutation } = useMutation(
    gql`
        mutation CreateProduct($productInput: ProductInput) {
            createProduct(productInput: $productInput) {
                brand
                solution
                packSize
                price
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

const addProduct = async () => {
    try {
        const response = await addProductMutation({
            productInput: {
                diseaseStatus: diseaseStatus.value,
                product: product.value,
                treatmentStart: treatmentStart.value
            }
        });
        console.log('Product added successfully:', response.data.createProduct);
        // Reset the form fields after successful submission
        diseaseStatus.value = null;
        product.value = null;
        treatmentStart.value = null;
    } catch (error) {
        console.error('Error adding product:', error.message);
    }
};

const deletePatient = async (data) => {
    if (!data.data.diseaseStatus || !data.data.product || !data.data.treatmentStart || !data.data.os || !data.data.pfs) {
        console.error('Invalid input for delete operation. Please provide valid patient data.');
        return;
    }

    try {
        console.log(
            (({ brand, solution, packSize, price }) => ({
                brand,
                solution,
                packSize,
                price
            }))(data.data.product)
        );
        const response = await deletePatientMutation({
            patientInput: {
                diseaseStatus: data.data.diseaseStatus,
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

const { result } = useQuery(gql`
    query AllPatients {
        allPatients {
            diseaseStatus
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
`);

const patients = computed(() => result.value?.allPatients ?? []);
</script>

<template>
    <div className="card">
        <h5>Add Patient</h5>
        <div class="field grid">
            <label for="disease" class="col-12 mb-2 md:col-2 md:mb-0">Disease Status</label>
            <div class="col-12 md:col-10">
                <InputText v-model="diseaseStatus" id="disease" type="text" />
            </div>
        </div>
        <div class="field grid">
            <label for="product" class="col-12 mb-2 md:col-2 md:mb-0">Product</label>
            <div class="col-12 md:col-10">
                <InputText v-model="product" id="product" type="text" />
            </div>
        </div>
        <div class="field grid">
            <label for="treatmentStart" class="col-12 mb-2 md:col-2 md:mb-0">Treatment Start</label>
            <div class="col-12 md:col-10">
                <InputText v-model="treatmentStart" id="treatmentStart" type="date" />
            </div>
        </div>
        <div class="grid right">
            <div class="col-12 md:col-4">
                <div class="field-checkbox mb-0">
                    <Checkbox id="checkOption1" name="option" value="os" v-model="checkboxValue" />
                    <label for="checkOption1">OS</label>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field-checkbox mb-0">
                    <Checkbox id="checkOption2" name="option" value="pfs" v-model="checkboxValue" />
                    <label for="checkOption2">PFS</label>
                </div>
            </div>
        </div>
        <Button @click="addProduct" label="Submit" class="mr-2 mb-2"></Button>
    </div>

    <div className="card">
        <DataTable :value="patients" tableStyle="min-width: 50rem">
            <Column field="diseaseStatus" header="Disease Status"></Column>
            <Column field="product.brand product.solution" header="Product"></Column>
            <Column field="treatmentStart" header="Treatment Start"></Column>
            <Column field="os" header="OS"></Column>
            <Column field="pfs" header="PFS"></Column>
            <Column header="Delete"
                ><template #body="{ data }"> <Button @click="deletePatient({ data })" icon="pi pi-trash" class="p-button-danger" /> </template
            ></Column>
        </DataTable>
    </div>
</template>
<style scoped>
.right {
    padding-left: 10em;
}
</style>
