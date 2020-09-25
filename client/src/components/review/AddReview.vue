<!--Add review form on the restaurant details page-->

<template>
  <v-card class="add-review" elevation="3">
    <h4>Add review:</h4>

    <div
      v-if="userRole !== 'guest'"
      class="font-italic"
    >
      Login as a restaurant guest to add a review
    </div>

    <div v-else>
      <v-form
        ref="form"
        v-model="formValid"
        class="review-form"
      >
        <!--Review comment-->
        <v-textarea
          outlined
          auto-grow
          label="Comment"
          :rows="6"
          :rules="mandatoryField"
          v-model="review.comment"
        />

        <v-layout column>
          <!--Date picker in menu for selecting review date of visit-->
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="slide-y-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                readonly
                outlined
                hide-details
                label="Date of visit"
                v-model="review.dateOfVisit"
                v-bind="attrs"
                v-on="on"
              />
            </template>

            <v-date-picker
              color="primary"
              v-model="review.dateOfVisit"
              :max="new Date().toISOString()"
              @input="dateMenu = false"
            />
          </v-menu>

          <!--Review rating-->
          <div class="rating">
            <div>Rating:</div>
            <v-rating
              color="secondary"
              background-color="secondary"
              v-model="review.rating"
            />
          </div>
        </v-layout>
      </v-form>

      <!--Submit button-->
      <v-layout justify-end>
        <v-btn
          large
          color="primary"
          :disabled="!formValid"
          :loading="loading"
          @click="submit"
        >
          Submit
        </v-btn>
      </v-layout>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AddReview',

  props: {
    restaurantId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      formValid: false,
      dateMenu: false, // Date picker menu model

      // Review model
      review: {
        rating: 5,
        comment: '',
        dateOfVisit: new Date().toISOString().substring(0, 10),
      },
      mandatoryField: [v => !!v || 'Mandatory field'],
    };
  },

  computed: {
    ...mapState({
      userRole: state => state.user.userRole,
    }),
  },

  methods: {
    ...mapActions({
      addReview: 'review/addReview',
    }),

    // Sending data to the server
    submit() {
      this.review.restaurantId = this.restaurantId;
      this.loading = true;

      this.addReview(this.review)
        .then(() => {
          this.$refs.form.reset();
          this.review.dateOfVisit = new Date().toISOString().substring(0, 10);
          this.review.rating = 5;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
  .add-review {
    margin: 2rem 0;
    padding: 1rem 2rem;

    h4 {
      margin-bottom: 0.8rem;
      font-size: 1.2rem;
    }
  }

  .review-form {
    display: flex;

    .v-rating {
      margin-left: -0.6rem;
    }

    .v-text-field.v-input--is-readonly {
      flex-grow: 0;
      margin-bottom: 1rem;
    }

    .v-textarea {
      width: 50%;
      margin-right: 2rem;
    }
  }
</style>
