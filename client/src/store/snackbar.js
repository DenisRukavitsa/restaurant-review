// Module for calling a snackbar notification

export default {
  namespaced: true,

  state: {
    model: false,
    type: null,
    title: null,
    message: null,
  },

  mutations: {
    show(state, details) {
      // Switching model to true shows the snackbar with the passed details
      state.model = true;
      state.type = details.type || 'error';
      state.title = details.title || details.type || 'error';
      state.message = details.message;
    },

    hide(state) {
      state.model = false;
    },
  },

  actions: {
    // Showing a new snackbar with hiding a currently shown one
    show({ state, commit }, details) {
      // If there is a currently visible snackbar, hiding it and waiting 0.3 sec
      // for closing animation to complete
      if (state.model) {
        commit('hide');
        setTimeout(() => {
          commit('show', details);
        }, 300);
      } else {
        commit('show', details);
      }
    },
  },
};
