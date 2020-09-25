import axios from 'axios';

export default {
  namespaced: true,

  state: {
    reviews: [],
  },

  mutations: {
    updateReviews(state, reviews) {
      state.reviews = reviews;
    },

    addReview(state, review) {
      state.reviews.unshift(review);
    },

    updateReview(state, review) {
      const index = state.reviews.findIndex(rev => rev._id === review._id);
      state.reviews.splice(index, 1, {
        ...state.reviews[index],
        ...review,
      });
    },

    deleteReview(state, reviewId) {
      const index = state.reviews.findIndex(rest => rest._id === reviewId);
      state.reviews.splice(index, 1);
    },
  },

  actions: {
    // Fetching reviews
    getReviews({ commit }, params) {
      return axios
        .get('/reviews', { params })
        .then(({ data }) => {
          commit('updateReviews', data);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },

    // Creating new review
    addReview({ commit }, review) {
      return axios
        .post('/reviews', review)
        .then(({ data }) => {
          commit('addReview', data);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },

    // Update review by id
    updateReview({ commit }, review) {
      return axios
        .patch(`/reviews/${review._id}`, review)
        .then(() => {
          commit('updateReview', review);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },

    // Delete review by id
    deleteReview({ commit }, reviewId) {
      return axios
        .delete(`/reviews/${reviewId}`)
        .then(() => {
          commit('deleteReview', reviewId);
        })
        .catch(({ response }) => this.dispatch('snackbar/show', { message: response.data.error }));
    },
  },
};
