<template>
  <img draggable="false" :src="url" :alt="`${material}_${part}`" />
  <!-- {{url}} -->
</template>

<script>
export default {
  props: ['toolType', 'material', 'part'],
  computed: {
    url() {
      // same part patch
      let part = this.part.split(/_\d$/)[0];

      try {
        let images = require.context('@/assets/textures/parts');
        let url = images(`./${part}_tconstruct_${this.material}.png`);
        return url;
      } catch (_) {
        try {
          let fullPart = part;
          part = part.split('_').pop();

          if (
            this.toolType == 'mattock' ||
            this.toolType == 'broad_axe' ||
            this.toolType == 'hand_axe' ||
            this.toolType == 'scythe' ||
            this.toolType == 'cleaver' ||
            this.toolType == 'vein_hammer'
          ) {
            if (fullPart == 'small_axe_head')
              return require(`../assets/textures/hand_axe/head_tconstruct_${this.material}.png`);
            if (fullPart == 'pickaxe_head')
              return require(`../assets/textures/pickaxe/head_tconstruct_${this.material}.png`);
            if (fullPart == 'broad_axe_head')
              return require(`../assets/textures/broad_axe/blade_tconstruct_${this.material}.png`);
            if (fullPart == 'broad_blade')
              return require(`../assets/textures/cleaver/head_tconstruct_${this.material}.png`);
            if (fullPart == 'hammer_head')
              return require(`../assets/textures/sledge_hammer/head_tconstruct_${this.material}.png`);
          }

          return require(`../assets/textures/${this.toolType}/${part}_tconstruct_${this.material}.png`);
        } catch (e) {
          console.error(e);
          return null;
        }
      }
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
