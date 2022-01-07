<template>
  <img draggable="false" :src="url" :alt="material" />
</template>

<script>
export default {
  props: ["material", "part"],
  mounted() {
    // console.log(this.material);
  },
  computed: {
    url() {
      let images = require.context('@/assets/textures/parts')
      return (images(`./${this.part}_tconstruct_${this.material}.png`));
      // return `./assets/textures/pickaxe/binding_tconstruct_${this.material}.png`;
    },
  },
};
</script>

<style scoped>
img {
  height: 64px;
  width: 64px;
  image-rendering: pixelated;
  user-select: none;
  pointer-events: none;
}
</style>
