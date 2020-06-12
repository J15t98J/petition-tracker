// Vue imports
import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import {firestorePlugin} from 'vuefire'
Vue.use(firestorePlugin);

// Other libraries
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

import * as firebase from 'firebase/app';
Vue.prototype.$firebase = firebase;

import _ from 'lodash';
Vue.prototype.$_ = _;

import * as prettydate from 'pretty-date';
Vue.prototype.$prettydate = prettydate;

// Pages
import App from '@/App.vue';
import PetitionCards from '@/pages/PetitionCards.vue';
import PetitionDetails from "@/pages/PetitionDetails";

Vue.config.productionTip = false;

const router = new VueRouter({
  mode : 'history',
  routes : [
    {path : '/:id', component : PetitionDetails, props : true},
    {path : '/', component : PetitionCards},
    {path : '**', component : PetitionDetails, props : {id : 'notfound'}}
  ]
});

new Vue({render : h => h(App), router : router}).$mount('#app');
