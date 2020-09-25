<!--Restaurant details page-->

<template>
  <div class="restaurant-details-page">
    <!--Progressbar while loading restaurant details-->
    <v-progress-linear
      v-if="loading"
      color="secondary"
      top
      absolute
      indeterminate
    />

    <div
      v-else
      class="restaurant"
    >
      <!--Restaurant name, average rating and description-->
      <h2 class="name">
        {{ restaurant.name }}
      </h2>

      <v-layout
        align-center
        class="average-rating"
      >
        <v-rating
          readonly
          large
          background-color="primary"
          :value="restaurant.averageRating"
        />
        <div class="teal--text">
          {{ restaurant.averageRating || 'No rating' }}
        </div>
      </v-layout>

      <p class="description">
        {{ restaurant.description }}
      </p>

      <!--Review form-->
      <add-review :restaurant-id="restaurant._id" />

      <!--Restaurant reviews-->
      <div
        v-if="!reviews.length"
        class="font-italic"
      >
        No reviews here yet
      </div>
      <div
        v-else
        class="reviews"
      >
        <div class="highest-rated">
          <h4>Highest rated review:</h4>
          <review :review-id="highestRatedReview._id" />
        </div>

        <div class="lowest-rated">
          <h4>Lowest rated review:</h4>
          <review :review-id="lowestRatedReview._id" />
        </div>

        <div class="latest">
          <h4>Latest reviews:</h4>
          <review
            v-for="review in reviews"
            :review-id="review._id"
            :key="review._id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Review from '@/components/review/ReviewCard.vue';
import AddReview from '@/components/review/AddReview.vue';

export default {
  name: 'RestaurantDetails',
  components: { AddReview, Review },

  data() {
    return {
      id: this.$route.params.id,
      loading: true,
    };
  },

  computed: {
    ...mapState({
      restaurant: state => state.restaurant.restaurants[0],
      reviews: state => state.review.reviews,
    }),

    highestRatedReview() {
      return [...this.reviews].sort((a, b) => b.rating - a.rating)[0];
    },

    lowestRatedReview() {
      return [...this.reviews].sort((a, b) => a.rating - b.rating)[0];
    },
  },

  methods: {
    ...mapActions({
      getRestaurants: 'restaurant/getRestaurants',
      getReviews: 'review/getReviews',
    }),
  },

  mounted() {
    // Fetching restaurant details and it reviews
    Promise.all([
      this.getRestaurants({ id: this.id }),
      this.getReviews({ restaurantId: this.id }),
    ]).then(() => {
      this.loading = false;
    });
  },
};
</script>

<style scoped lang="scss">
  .restaurant {
    max-width: 80%;
    margin: 3rem auto 0;

    .name {
      font-family: 'Dancing Script', cursive;
      font-size: 2rem;
    }

    .description {
      margin: 0;
      font-size: 1.2rem;
    }

    .average-rating {
      margin: -0.4rem 0 0.8rem -0.8rem;

      .teal--text {
        margin-left: 0.5rem;
        font-size: 1.8rem;
      }
    }

    .reviews {
      .highest-rated, .lowest-rated {
        margin-bottom: 1.6rem;
      }

      .review {
        margin-bottom: 0.6rem;
      }

      h4 {
        margin-bottom: 0.6rem;
        font-size: 1.2rem;
        font-weight: normal;
      }
    }
  }
</style>
