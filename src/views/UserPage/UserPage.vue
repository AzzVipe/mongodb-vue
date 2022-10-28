<template>
  <main>
    <div class="navigation">
      <MenuBar :model="items">
        <template #end>
          <div class="profile-card">
            <Avatar icon="pi pi-user" shape="circle" />
            <div v-if="isAnonUser === true" class="profile-card-text">
              <h1>Anonymous</h1>
              <h2>Anonymous</h2>
            </div>
            <div v-else class="profile-card-text">
              <h1>{{ userData.email }}</h1>
              <h2>{{ userData.name }}</h2>
            </div>
          </div>
        </template> 
      </MenuBar>
    </div>
    <div class="body">
      <router-view></router-view>
      <!-- <div class="table-container">
        <DataTable :value="[userData]">
          <Column field="name" header="Name" />
          <Column field="username" header="Username" />
          <Column field="designation" header="Job Title" />
          <Column field="role" header="Job Type" />
        </DataTable>
      </div> -->
    </div>
  </main>
</template>

<script>

import * as Realm from "realm-web";

export default {
  name: 'UserPage',

  data() {
    return {
      userData: {},
      isLoggedIn: false,
      isAnonUser: false,
      items: [{
        label: 'All Users',
        icon: 'pi pi-home',
        to: `/user/allusers`
      }, {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: this.handleSignOut,
        visible: this.isLoggedIn
      }],
    }
  },

  created() {
    const app = Realm.getApp("application-0-kmolw");
    
    if (app.currentUser.providerType === "anon-user")
      this.isAnonUser = true;

    app.currentUser.refreshCustomData();
    this.userData.uid = app.currentUser.id;
    this.userData.email = app.currentUser._profile.data.email;
    this.userData.name = app.currentUser.customData.name;
  },

  methods: {
    handleSignOut() {
      const app = Realm.getApp("application-0-kmolw");
      if (this.isAnonUser) 
        app.deleteUser(app.currentUser);
      else 
        app.currentUser.logOut();
      this.isLoggedIn = false;
      this.userData = null;
      this.$router.push('/');
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

</style>
