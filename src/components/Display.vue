<template>
  <v-container fluid grid-list-md>
    <h1>{{name}}</h1>
    <v-textarea
      name="input-7-1"
      :label="type"
      auto-grow
      :value="text"
    ></v-textarea>
  </v-container>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
