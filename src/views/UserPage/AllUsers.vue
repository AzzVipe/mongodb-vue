<template>
	<div class="table-container">
		<DataTable v-if="allUsers.length != 0" :value="allUsers" :paginator="true" :rows="10" 
		  v-model:selection="selectedUsers" :rowsPerPageOptions="[5,10,25]">
			<Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
		  <Column :sortable="true" field="name" header="Name" />
		  <Column :exportable="false">
		  	<template #body="slotProps">
		  		<Button icon="pi pi-pencil" class="p-button-rounded p-button-text" 
		  			@click="editProduct(slotProps.data)" />
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
      selectedUsers: null,
      updateUserDialog: false,
    }
  },

  created() {
    const app = Realm.getApp("application-0-kmolw");
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const collection = mongodb.db("db1").collection("users");

    this.userData = app.currentUser;
    collection.find()
    .then((data) => {
    	this.allUsers = data;
    })
  },

  methods: {
		editProduct(product) {
			this.updateUserDialog = true;
      this.selectedUserForEdit = {...product};
	  },
	  hideDialog() {
	  	this.updateUserDialog = false;
	  },
	  updateUser() {
			console.log("ok");
	  	const app = Realm.getApp("application-0-kmolw");
	    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
	    const collection = mongodb.db("db1").collection("users");
	    const userName = this.selectedUserForEdit.name
	    const uid = this.selectedUserForEdit.userID;

	  	collection.updateOne(
	  	  { userID: uid },
	  	  { $set: { name: userName } }
	  	)
	  	.catch((err) => {
	  		console.log(err);
	  	})
	  	app.currentUser.refreshCustomData();
	  	this.updateUserDialog = false;
	  	// location.reload();
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