import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'
import VueRouter from 'vue-router';
import VueCompositionApi from "@vue/composition-api";
import Vuetify from 'vuetify';
import PortalVue from 'portal-vue';

Vue.use(firestorePlugin);
Vue.use(VueRouter);
Vue.use(VueCompositionApi);
Vue.use(Vuetify);
Vue.use(PortalVue);

import Home from './components/Home'
import ChatRoom from './components/ChatRoom'
import vuetify from './plugins/vuetify';

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/chats/:id', component: ChatRoom, name: 'chat'}
  ]
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
