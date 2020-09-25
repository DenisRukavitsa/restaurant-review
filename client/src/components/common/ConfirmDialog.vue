<!--Dialog window to confirm an action-->

<template>
  <v-dialog
    persistent
    content-class="confirm-dialog"
    v-model="model"
    width="400"
  >
    <v-card>
      <v-card-title>
        Are you sure?
      </v-card-title>

      <v-layout justify-end>
        <v-btn
          outlined
          color="secondary"
          @click="model = false"
        >
          cancel
        </v-btn>

        <v-btn
          color="primary"
          @click="confirm"
        >
          confirm
        </v-btn>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',

  props: {
    value: Boolean,
  },

  computed: {
    // Controls dialog visibility
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  methods: {
    confirm() {
      this.$emit('confirm');
      this.model = false;
    },
  },
};
</script>

<style scoped lang="scss">
  .confirm-dialog {
    .v-card {
      padding: 0.8rem;
    }

    .v-card__title {
      padding: 0 0 0.8rem;
    }

    .v-btn {
      margin-left: 1rem;
    }
  }
</style>
