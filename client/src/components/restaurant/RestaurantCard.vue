<!--Restaurant card on the Restaurants page-->

<template>
  <v-card
    class="restaurant-card"
    :ripple="false"
    @click="$router.push(`/restaurant/${restaurant._id}`)"
  >
    <v-card-title>
      <v-layout justify-space-between>
        <div class="name">{{ restaurant.name }}</div>

        <!--Edit and delete restaurant buttons-->
        <div v-if="canEdit">
          <v-btn
            outlined
            color="secondary"
            @click.stop="$emit('edit', restaurant)"
          >
            edit
          </v-btn>

          <v-btn
            outlined
            color="secondary"
            @click.stop="$emit('delete', restaurant)"
          >
            delete
          </v-btn>
        </div>
      </v-layout>
    </v-card-title>

    <v-card-text>
      <v-layout align-center>
        <v-rating
          readonly
          dense
          background-color="primary"
          :value="restaurant.averageRating"
        />
        <span class="restaurant-rating teal--text">
          {{ restaurant.averageRating || 'No rating' }}
        </span>
      </v-layout>

      <div class="restaurant-description">
        {{ restaurant.description }}
      </div>

      <!--Number of not replied reviews for owners-->
      <div
        v-if="isOwner"
        class="reviews-count"
      >
        Reviews pending reply:
        <span>{{ reviewsCount[restaurant._id] || 0 }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Restaurant',

  props: {
    restaurant: {
      type: Object,
      default: () => {},
    },
    reviewsCount: {
      type: Object,
      default: () => {},
    },
    isOwner: Boolean,
    canEdit: Boolean,
  },
};
</script>

<style scoped lang="scss">
  .restaurant-card {
    margin-bottom: 1rem;
    cursor: pointer;

    &:hover {
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2),
      0 4px 5px 0 rgba(0, 0, 0, 0.14),
      0 1px 10px 0 rgba(0, 0, 0, 0.12);
    }

    .v-card__title {
      padding: 1rem 1rem 0;

      .name {
        font-family: 'Dancing Script', cursive;
        font-size: 1.6rem;
        font-weight: 600;
      }
    }

    .v-btn {
      margin-left: 1rem;
    }

    .v-card__text {
      padding: 0 1rem 1rem;
      font-size: 1rem;
    }

    .v-rating {
      margin: .2rem .4rem 0 -.2rem;
    }

    .restaurant-rating {
      margin-top: 0.4rem;
      font-size: 1.2rem;
    }

    .restaurant-description {
      margin-top: 1rem;
    }

    .reviews-count {
      margin-top: 0.6rem;
      font-size: 0.875rem;

      span {
        color: #FFA000;
        font-weight: 600;
      }
    }
  }
</style>
