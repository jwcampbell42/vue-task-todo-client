import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import BootstrapVue from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTrash)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(BootstrapVue);
Vue.config.productionTip = false;
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
