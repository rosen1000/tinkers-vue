<template>
  <canvas width="200" height="200" id="canvas"></canvas>
</template>

<script>
import { getImageSrc } from '@/utils';

export default {
  props: {
    // [toolType, materialType]
    renderData: { type: [Array] },
    toolType: {
      type: [String],
    },
  },
  mounted() {
    this.render();
  },
  updated() {
    this.render();
  },
  methods: {
    async render() {
      let canvas = document.getElementById('canvas');
      /** @type {CanvasRenderingContext2D} */
      let ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, 160, 160);
      ctx.imageSmoothingEnabled = false;

      for (let renderSegment of this.renderData) {
        let [part, material] = renderSegment;
        let image = new Image();
        image.src = getImageSrc(this.toolType, part, material);

        await createImageBitmap(image).then((data) => {
          ctx.drawImage(data, 0, 0, 16, 16, 0, 0, 200, 200);
        });
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
