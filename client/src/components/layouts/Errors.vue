<template>
  <div>
    <!-- <b-notification type="is-danger" v-for="error in errors" v-bind:key="error">
      {{ error }}
    </b-notification> -->
    <ul>
      <li class="has-text-danger" v-for="error in errors" v-bind:key="error">
        {{ error }}
      </li>
    </ul>
    <br />
  </div>
</template>

<script>
export default {
  name: "Errors",
  props: {
    errors: Array
  }
};
</script>

<style lang="scss" scoped>
ul {
  list-style-type: disc;
}
</style>
