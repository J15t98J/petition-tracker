// Vue imports
import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

// Firebase
import * as firebase from 'firebase/app';
Vue.prototype.$firebase = firebase;

// Pages
import App from '@/App.vue';
import PetitionCards from '@/pages/PetitionCards.vue';
import NotFound from "@/pages/NotFound";


Vue.config.productionTip = false;

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/:id',
            component: NotFound
        },
        {
            path: '/',
            component: PetitionCards
        }
    ]
});

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app');
