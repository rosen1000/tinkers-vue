<template>
  <canvas ref="canvas" width="200" height="200" id="canvas"></canvas>
  <!-- {{renderData}} -->
</template>

<script>
import { getImageSrc } from '@/utils';

export default {
  props: {
    // [toolType, materialType]
    renderData: { type: [Object] },
    toolType: { type: [String] },
  },
  mounted() {
    this.render();
  },
  updated() {
    this.render();
  },
  methods: {
    async render() {
      /** @type {HTMLCanvasElement} */
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, 200, 200);
      ctx.imageSmoothingEnabled = false;

      for (let type in this.renderData) {
        let renderSegment = this.renderData[type];
        try {
          let image = new Image(16, 16);
          image.src = getImageSrc(this.toolType, type, renderSegment.data);
          image.onload = async () => {
            await createImageBitmap(image).then((data) => {
              ctx.drawImage(data, 0, 0, 16, 16, 0, 0, 200, 200);
            });
          };
        } catch (e) {
          console.warn(`Failed to load texture of ${renderSegment.part} ${renderSegment.data}\n${e.message}`);
        }
      }
    },
  },
};
</script>

<style>
#canvas {
  width: 200px;
  height: 200px;
}
</style>
