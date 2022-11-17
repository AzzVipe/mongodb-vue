<template>
	<div class="table-container">
		<DataTable v-if="allUsers.length != 0" :value="allUsers" :paginator="true" :rows="5" 
		  v-model:selection="selectedUsers" :rowsPerPageOptions="[5,10,25]">
			<Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
		  <Column :sortable="true" field="name" header="Name" />
		  <Column :sortable="true" field="salary" header="Salary" />
		  <!-- <Column v-if="isAdmin" :sortable="true" field="salary" header="Salary" /> -->
		  <Column :sortable="true" field="role" header="Role" />
		  <!-- <Column v-if="isAdmin" :sortable="true" field="role" header="Role" /> -->
		  <Column v-if="isAdmin" :exportable="false">
		  	<template #body="slotProps">
		  		<Button icon="pi pi-pencil" class="p-button-rounded p-button-text" 
		  			@click="editUser(slotProps.data)" />
		  	</template>
		  </Column>
		</DataTable>

		<Dialog v-model:visible="updateUserDialog" 
    	:style="{width: '450px'}" header="Product Details" :modal="true" class="p-fluid">
    	<template #footer>
    		<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
    		<Button label="Update" icon="pi pi-check" class="p-button-text" @click="updateUser" />
    	</template>
    	<div class="card-content">
    		<span class="p-float-label">
    		  <InputText id="name" type="name" v-model="selectedUserForEdit.name" placeholder="Name"/>
    		  <label for="name">Name</label>
    		</span>
    		<span class="p-float-label">
    		  <InputText id="salary" type="number" v-model="selectedUserForEdit.salary" placeholder="Salary"/>
    		  <label for="salary">Salary</label>
    		</span>
    	</div>
    </Dialog>
	</div>
</template>

<script>

import * as Realm from "realm-web";

export default {
  name: 'UserPost',

  data() {
    return {
      allUsers: [],
      userData: {},
      selectedUserForEdit: {},
      isAdmin: false,
      selectedUsers: null,
      updateUserDialog: false,
    }
  },

  created() {
    this.realmApp = Realm.getApp("application-0-kmolw");
    const mongodb = this.realmApp.currentUser.mongoClient("mongodb-atlas");
    const collection = mongodb.db("db1").collection("users");
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

    this.userData = this.realmApp.currentUser;
    collection.find()
    .then((data) => {
    	this.allUsers = data;
    })
  },

  methods: {
		editUser(product) {
			this.updateUserDialog = true;
      this.selectedUserForEdit = {...product};
	  },
	  hideDialog() {
	  	this.updateUserDialog = false;
	  },
	  updateUser() {
	    const mongodb = this.realmApp.currentUser.mongoClient("mongodb-atlas");
	    const collection = mongodb.db("db1").collection("users");

	  	collection.updateOne(
	  	  { userID: this.selectedUserForEdit.userID },
	  	  { $set: { name: this.selectedUserForEdit.name, salary: this.selectedUserForEdit.salary } }
	  	).then((res) => {
	  		this.allUsers.forEach((temp, index) => {
	  			if (temp.userID == this.selectedUserForEdit.userID) {
	  				this.allUsers[index] = this.selectedUserForEdit;
	  			}
	  		})
	  		this.$toast.add({severity: 'success', summary: 'Success', detail: 'User Updated', life: 3000});
	  	}).catch((err) => {
	  		this.$toast.add({severity: 'error', summary: 'Success', 
	  			detail: 'User Update Failed', life: 3000});
	  		console.log(err);
	  	})
	  	if (this.selectedUserForEdit.userID == this.realmApp.currentUser.id) {
	  		this.realmApp.currentUser.refreshCustomData();
	  		this.$emit('userEdited', this.selectedUserForEdit);
	  	}
	  	this.updateUserDialog = false;
	  }
  },
}
</script>

<style lang="scss">
  
  ::v-deep(.p-datatable.p-datatable-customers) {
    .p-datatable-header {
    	padding: 10rem;
    	text-align: left;
    }
  }

  .confirmation-content {
  	display: flex;
  	align-items: center;
  	justify-content: center;
  }

  .p-dialog .p-dialog-content {
  	padding: 1.5rem;
  }

  .card-content {
  	display: flex;
  	flex-direction: column;
  	gap: 2rem;
  }

</style>