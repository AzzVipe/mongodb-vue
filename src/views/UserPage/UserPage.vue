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
    this.realmApp = Realm.getApp("application-0-kmolw");
    
    if (this.realmApp.currentUser.providerType === "anon-user")
      this.isAnonUser = true;

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
      this.isLoggedIn = false;
      this.userData = null;
      this.$router.push('/');
    },
    userEdited(user) {
      this.userData.name = user.name;
      this.realmApp.currentUser.refreshCustomData();
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
