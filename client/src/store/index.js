import Vue from 'vue';
import Vuex from 'vuex';

import user from './user';
import restaurant from './restaurant';
import review from './review';
import snackbar from './snackbar';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    user,
    restaurant,
    review,
    snackbar,
  },
});
