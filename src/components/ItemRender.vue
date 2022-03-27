<template>
  <canvas ref="canvas" :width="size" :height="size" id="canvas"></canvas>
</template>

<script>
import { getImageSrc } from '@/utils';

export default {
  props: {
    renderData: { type: [Object] },
    toolType: { type: [String] },
    size: { type: [Number], default: 200}
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

      ctx.clearRect(0, 0, this.size, this.size);
      ctx.imageSmoothingEnabled = false;

      for (let type in this.renderData) {
        let renderSegment = this.renderData[type];
        try {
          let image = new Image(16, 16);
          image.src = getImageSrc(this.toolType, type, renderSegment.data);
          image.onload = async () => {
            await createImageBitmap(image).then((data) => {
              ctx.drawImage(data, 0, 0, 16, 16, 0, 0, this.size, this.size);
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
/* #canvas {
  width: 200px;
  height: 200px;
} */
</style>
