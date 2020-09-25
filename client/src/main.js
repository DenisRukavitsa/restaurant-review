import Vue from 'vue';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

axios.defaults.baseURL = 'http://localhost:3000';

// Adding token to every request to the server
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },
);

// Common handler for all the Unauthorised errors coming from the server
axios.interceptors.response.use(null, error => {
  if (error.response && error.response.status === 401 && router.history.current.name !== 'login') {
    // Logging user out
    store.dispatch('user/logout');
    store.dispatch('snackbar/show', {
      type: 'warning',
      title: 'Session expired',
      message: 'Please login again',
    });
  } else {
    throw error;
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
