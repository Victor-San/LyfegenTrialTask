<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const brand = ref(null);
const solution = ref(null);
const packSize = ref(null);
const price = ref(null);

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

const { mutate: deleteProductMutation } = useMutation(
    gql`
        mutation DeleteProduct($productInput: ProductInput) {
            deleteProduct(productInput: $productInput)
        }
    `
);

const addProduct = async () => {
    try {
        const response = await addProductMutation({
            productInput: {
                brand: brand.value,
                solution: solution.value,
                packSize: parseInt(packSize.value),
                price: parseFloat(price.value)
            }
        });
        console.log('Product added successfully:', response.data.createProduct);
        // Reset the form fields after successful submission
        brand.value = null;
        solution.value = null;
        packSize.value = null;
        price.value = null;
    } catch (error) {
        console.error('Error adding product:', error.message);
    }
};

const deleteProduct = async (data) => {
    try {
        const response = await deleteProductMutation({
            productInput: {
                brand: data.data.brand,
                solution: data.data.solution,
                packSize: data.data.packSize,
                price: data.data.price
            }
        });
        console.log('Product deleted successfully:', response.data.deleteProduct);
    } catch (error) {
        console.error('Error deleting product:', error.message);
    }
};

const { result } = useQuery(gql`
    query Product {
        allProducts {
            brand
            price
            packSize
            solution
        }
    }
`);
const products = computed(() => result.value?.allProducts ?? []);
</script>

<template>
    <div className="card">
        <h5>Add Product</h5>
        <div class="field grid">
            <label for="brand" class="col-12 mb-2 md:col-2 md:mb-0">Brand</label>
            <div class="col-12 md:col-10">
                <InputText v-model="brand" id="brand" type="text" />
            </div>
        </div>
        <div class="field grid">
            <label for="solution" class="col-12 mb-2 md:col-2 md:mb-0">Solution</label>
            <div class="col-12 md:col-10">
                <InputText v-model="solution" id="solution" type="text" />
            </div>
        </div>
        <div class="field grid">
            <label for="packSize" class="col-12 mb-2 md:col-2 md:mb-0">Pack Size</label>
            <div class="col-12 md:col-10">
                <InputText v-model="packSize" id="packSize" type="number" />
            </div>
        </div>
        <div class="field grid">
            <label for="price" class="col-12 mb-2 md:col-2 md:mb-0">Price</label>
            <div class="col-12 md:col-10">
                <InputText v-model="price" id="price" type="number" />
            </div>
        </div>
        <Button @click="addProduct" label="Submit" class="mr-2 mb-2"></Button>
    </div>

    <div className="card">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column field="brand" header="Brand"></Column>
            <Column field="solution" header="Solution"></Column>
            <Column field="packSize" header="Pack Size"></Column>
            <Column field="price" header="Price"></Column>
            <Column header="Delete"
                ><template #body="{ data }"> <Button @click="deleteProduct({ data })" icon="pi pi-trash" class="p-button-danger" /> </template
            ></Column>
        </DataTable>
    </div>
</template>
