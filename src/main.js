// Vue imports
import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Other libraries
import _ from 'lodash';
Vue.prototype.$_ = _;

import * as prettydate from 'pretty-date';
Vue.prototype.$prettydate = prettydate;

// Pages
import App from '@/App.vue';
import PetitionCards from '@/pages/PetitionCards.vue';
import NotFound from "@/pages/NotFound";


Vue.config.productionTip = false;

const router = new VueRouter({
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
