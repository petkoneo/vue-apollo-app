<template>
  <v-alert
    type="error"
    :value="true"
    dismissible
    transition="scale-transition"
  ><h3>{{ message }}</h3></v-alert>
</template>

<script>
export default {
  name: 'FormAlert',
  props: [
    'message'
  ]
}
</script>

<style scoped>

</style>
