<template>
  <canvas id="canvas"></canvas>
</template>

<script>
export default {
  mounted() {
    let canvas = document.getElementById("canvas");
    /** @type {CanvasRenderingContext2D} */
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 200, 200);

    ctx.imageSmoothingEnabled = false;
    let image = new Image();
    image.src = require.context("@/assets/textures")(
      "./pickaxe/binding_tconstruct_bone.png"
    );
    console.log(image);
    createImageBitmap(image).then((data) => {
      ctx.drawImage(data, 0, 0, 16, 16, 0, 0, 160, 160);
    });
  },
};
</script>

<style>
</style>
