<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  methods: {
    togglePalette() {
      this.$root.$emit("openCommandMenu")
    },
  },
})
</script>

<template>
  <Button
    v-tippy="{
      content: '⌘/Ctrl + K',
    }"
    icon="Menu"
    class="focus:outline-none"

    elevated
    @click.native="togglePalette"
  />
</template>
