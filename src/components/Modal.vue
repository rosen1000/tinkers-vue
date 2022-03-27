<template>
  <div class="background" @click="close">
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang='scss' scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #7777;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    width: fit-content;
    background: #f7f7f7;
    margin: auto;
    padding: 2em;
    box-shadow: 8px 0 0 0 #777, 0 8px 0 0 #777, 4px 4px 0 0 #777, -8px 0 0 0 #e8e8e8, 0 -8px 0 0 #e8e8e8,
      -4px -4px 0 0 #e8e8e8, 0 0 0 4px #b5b4b5, 4px 8px 0 0 #555, 8px 4px 0 0 #555, -4px -8px 0 0 #e8e8e8,
      -8px -4px 0 0 #e8e8e8, 8px -4px 0 0 #000, 4px -8px 0 0 #000, -8px 4px 0 0 #000, -4px 8px 0 0 #000,
      -8px -8px 0 0 #000, 8px 8px 0 0 #000, -12px 0 0 0 #000, -12px -4px 0 0 #000, 12px 0 0 0 #000, 12px 4px 0 0 #000,
      0 -12px 0 0 #000, -4px -12px 0 0 #000, 0 12px 0 0 #000, 4px 12px 0 0 #000;
  }
}
</style>