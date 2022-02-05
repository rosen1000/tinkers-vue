<template>
  <img draggable="false" :src="url" :alt="`${material}_${part}`" />
  <!-- {{url}} -->
</template>

<script>
export default {
  props: ['toolType', 'material', 'part'],
  mounted() {
    // console.log(this.material, this.part);
  },
  computed: {
    // TODO: because most broad tools (mattock, vein hammer) require more than one of the same type of a part
    // TODO: the second part is using differnt name (mattock: head => axe; head => pick)
    // TODO: now i have to implement custom logic for most if not all tools for the fetching system

    url() {
      try {
        let images = require.context('@/assets/textures/parts');
        let url = images(`./${this.part}_tconstruct_${this.material}.png`);
        return url;
      } catch (e) {
        try {
          console.log(`../assets/textures/${this.toolType}/${this.part.split('_').pop()}_tconstruct_${this.material}.png`);
          let images = require(`../assets/textures/${this.toolType}/${this.part.split('_').pop()}_tconstruct_${this.material}.png`);
          console.log(images);
          return images;
        } catch (e) {
          console.log(e);
          return null;
        }
      }
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
