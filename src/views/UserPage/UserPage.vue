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
      <Toast position="top-right" />
      <router-view @user-edited="userEdited"></router-view>
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
      isAnonUser: false,
      isAdmin: false,
      items: [{
        label: 'Home',
        icon: 'pi pi-home',
        to: '/user/userhome'
      }, {
        label: 'All Users',
        icon: 'pi pi-users',
        to: '/user'
      }, {
        label: 'Add User',
        icon: 'pi pi-user-plus',
        to: '/user/adduser',
        visible: () => this.isAdmin
      }, {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: this.handleSignOut
      }]
    }
  },

  created() {
    this.realmApp = Realm.getApp("application-0-kmolw");
    
    if (this.realmApp.currentUser.providerType === "anon-user")
      this.isAnonUser = true;
    else {
      this.realmApp.currentUser.callFunction("isAdmin")
      .then((data) => {
        this.isAdmin = data;
        localStorage.setItem('isAdmin', JSON.stringify(data));
      })
    }

    this.realmApp.currentUser.refreshCustomData();
    this.userData.uid = this.realmApp.currentUser.id;
    this.userData.email = this.realmApp.currentUser._profile.data.email;
    this.userData.name = this.realmApp.currentUser.customData.name;
    
  },

  methods: {
    handleSignOut() {
      if (this.isAnonUser) 
        this.realmApp.deleteUser(this.realmApp.currentUser);
      else 
        this.realmApp.currentUser.logOut();
      // this.userData = null;
      localStorage.removeItem('isAdmin');
      this.$router.push('/');
    },
    userEdited(user) {
      this.userData.name = user.name;
      this.realmApp.currentUser.refreshCustomData();
    }
  }
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
