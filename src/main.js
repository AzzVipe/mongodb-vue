import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import * as Realm from "realm-web";

import PrimeVue from 'primevue/config';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import MenuBar from 'primevue/menubar';
import Menu from 'primevue/menu';
import Avatar from 'primevue/avatar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';

import 'primevue/resources/themes/md-dark-deeppurple/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// import vue3GoogleLogin from 'vue3-google-login'

const realmApp = new Realm.App({ id: "application-0-kmolw" });
const app = createApp(App);

app.use(router)
app.use(PrimeVue);
app.use(ToastService);
// app.use(vue3GoogleLogin, {
//   clientId: '734960750491-ci1nnmaq463gc835qopqsns4drg1d947.apps.googleusercontent.com',
//   scope: 'email profile openid',
// });


app.config.globalProperties.realmApp = realmApp;

app.component('InputText', InputText);
app.component('Button', Button);
app.component('Card', Card);
app.component('MenuBar', MenuBar);
app.component('Menu', Menu);
app.component('Avatar', Avatar);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('Toast', Toast);

app.mount('#app')
